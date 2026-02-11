const { db } = require("zevbackv2");
const {
  Parking,
  Uilchluulegch,
  zogsooliinDunAvya,
} = require("parking-v2");
const { ebarimtDuudya } = require("./ebarimtDuudya");
const {
  zogsooloosEbarimtShineUusgye,
} = require("../routes/ebarimtRoute");
const { handleEbarimt } = require("./tokiEbarimtService");
const Baiguullaga = require("../models/baiguullaga");
const Ebarimt = require("../models/ebarimt");
const EbarimtShine = require("../models/ebarimtShine");

exports.passPay = async (req) => {
  let tulbur = [
    {
      ognoo: new Date(),
      turul: "pass",
      dun: req.body.tulukhDun,
    },
  ];
  let kholboltuud = db.kholboltuud;

  let tukhainKholbolt;
  let tukhainObject;
  let tukhainZogsool;
  for (const kholbolt of kholboltuud) {
    const zogsooluud = await Parking(kholbolt).find({
      passNer: { $exists: true },
    });

    for (const zogsool of zogsooluud) {
      const oldson = await Uilchluulegch(kholbolt, true).findOne({
        "tuukh.0.zogsooliinId": zogsool._id,
        mashiniiDugaar: req.body.dugaar,
        "tuukh.0.tuluv": { $nin: [-2, -3, -4] },
      });

      if (oldson) {
        tukhainKholbolt = kholbolt;
        tukhainZogsool = zogsool;
        tukhainObject = oldson;
        break;
      }
    }
    if (tukhainObject) break;
  }

  if (!tukhainObject) {
    return { success: false, message: "Машины мэдээлэл олдсонгүй!" };
  }
  if (!tukhainObject.freezeOgnoo) {
    tukhainObject.freezeOgnoo = tukhainObject.tuukh[0].tsagiinTuukh[0].garsanTsag || new Date();
    await Uilchluulegch(tukhainKholbolt).updateOne(
      { _id: tukhainObject._id },
      { freezeOgnoo: tukhainObject.freezeOgnoo },
    );
  }
  const bodsonDun = await zogsooliinDunAvya(
    tukhainZogsool,
    tukhainObject,
    tukhainKholbolt
  );
  if (bodsonDun !== req.body.tulukhDun) {
    return { success: false, message: "Төлөх дүн зөрүүтэй байна!" };
  }
  if (!tukhainObject.tuukh[0].tulbur)
    tukhainObject.tuukh[0].tulbur = [];

  tukhainObject.tuukh[0].tulbur.push(...tulbur);
  var set = {
    "tuukh.$[t].tulbur": tukhainObject.tuukh[0].tulbur,
    tokiId: "pass",
  };
  if (bodsonDun > 0) {
    if (bodsonDun == req.body.tulukhDun) {
      set["tuukh.$[t].tuluv"] = 1;
      if (!req.body.manually_open)
        set["garakhTsag"] = new Date(
          new Date().getTime() +
            (tukhainZogsool?.garakhTsag || 30) * 60000,
        );
    }
  }
  await Uilchluulegch(tukhainKholbolt).findByIdAndUpdate(
    tukhainObject._id,
    {
      $set: set,
    },
    {
      arrayFilters: [
        { "t.zogsooliinId": tukhainZogsool._id },
      ],
    }
  );
  if (!!tukhainObject.tuukh[0].tsagiinTuukh?.[0].garsanTsag && tukhainObject.tuukh[0].tsagiinTuukh[0].garsanTsag > new Date(Date.now() - 600000))
      req.body.manually_open = true;
  if (!!req.body.manually_open) {
    if (
      !!tukhainZogsool.kamerDavkharAshiglakh &&
      !tukhainObject?.tuukh[0]?.garsanKhaalga
    ) {
      var nemeltZogsool = await Parking(tukhainKholbolt).findOne({
        _id: { $ne: tukhainZogsool._id },
      });
      var garsanObject = await Uilchluulegch(
        tukhainKholbolt,
        true,
      ).findOne({
        mashiniiDugaar: req.body.dugaar,
        "tuukh.zogsooliinId": nemeltZogsool._id.toString(),
        "tuukh.0.tsagiinTuukh.0.garsanKhaalga": {
          $exists: true,
        },
        updatedAt: {
          $gt: new Date(Date.now() - 300000), //5min dotor
        },
        "tuukh.0.tuluv": {
          $ne: -2,
        },
      });
      const io = req.app.get("socketio");
      io.emit(
        "zogsoolGarahTulsun",
        {
          baiguullagiinId: tukhainObject.baiguullagiinId,
          khaalgaTurul: "garsan",
          turul: "toki",
          mashiniiDugaar: tukhainObject.mashiniiDugaar,
          cameraIP: garsanObject.tuukh[0].garsanKhaalga,
        },
      );
    } else {
      const io = req.app.get("socketio");
      io.emit(
        "zogsoolGarahTulsun",
        {
          baiguullagiinId: tukhainObject.baiguullagiinId,
          khaalgaTurul: "garsan",
          turul: "toki",
          mashiniiDugaar: tukhainObject.mashiniiDugaar,
          cameraIP: tukhainObject.tuukh[0].garsanKhaalga,
        },
      );
    }
  }
  tukhainObject.niitDun = req.body.tulukhDun;
  var baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(
    tukhainObject.baiguullagiinId,
  );
  var tuxainSalbar = baiguullaga?.barilguud?.find(
    (e) => e._id.toString() == tukhainObject.barilgiinId,
  )?.tokhirgoo;
  var nuatTulukhEsekh = baiguullaga.barilguud.find(
    (x) => x._id.toString() == tukhainObject.barilgiinId,
  )?.tokhirgoo?.nuatTulukhEsekh;
  if (nuatTulukhEsekh != false) nuatTulukhEsekh = true;
  const ebarimtResult = await handleEbarimt({
    tuxainSalbar,
    tukhainObject,
    tukhainKholbolt,
    req,
    nuatTulukhEsekh,
  });
  return ebarimtResult;
};
