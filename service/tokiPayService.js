const { db } = require("zevbackv2");
const {
  Uilchluulegch,
  zogsooliinDunAvya,
} = require("parking-v2");
const { getParkingFind } = require("../middlewares/parkingMiddle");
const Baiguullaga = require("../models/baiguullaga");
const { handleEbarimt } = require("./tokiEbarimtService");

exports.tokiPay = async (req, res, next) => {
  try {
    let tulbur = [
      {
        ognoo: new Date(),
        turul: "toki",
        dun: req.body.paid_amount,
      },
    ];

    let kholboltuud = db.kholboltuud;
    let message = "Amjilttai";
    let success = true;

    let oldsonMashin;
    let tukhainKholbolt;
    let tukhainZogsool;
    let tukhainObject;
    let bodsonDun = 0;

    const localEsekh = !!req.body.baiguullagiinId;

    if (localEsekh) {
      kholboltuud = kholboltuud.filter(
        (a) => a.baiguullagiinId == req.body.baiguullagiinId,
      );
    }

    if (kholboltuud) {
      let query = { tokiNer: { $exists: true } };
      if (req.body.baiguullagiinId)
        query.baiguullagiinId = req.body.baiguullagiinId;

      for (const kholbolt of kholboltuud) {
        const zogsooluud = await getParkingFind(
          kholbolt,
          kholbolt.baiguullagiinId,
          query,
        );

        for (const zogsool of zogsooluud) {
          const fiveMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
          oldsonMashin = await Uilchluulegch(kholbolt, true)
            .findOne({
              mashiniiDugaar: req.body.plate_number,
              "tuukh.0.zogsooliinId": zogsool._id,
              "tuukh.0.tuluv": { $nin: [-2, -3, -4] },
              updatedAt: { $gt: fiveMinutesAgo },
            })
            .sort({ updatedAt: -1 });

          if (oldsonMashin?.mashiniiDugaar) {
            tukhainKholbolt = kholbolt;
            tukhainZogsool = zogsool;
            tukhainObject = oldsonMashin;
            break;
          }
        }
        if (tukhainObject) break;
      }
    }

    if (!tukhainObject) {
      return {
        success: false,
        message: "Машины мэдээлэл олдсонгүй!",
      };
    }
    var butsaakhKhariu = {
      success,
      message,
    };
    if (!tukhainObject.freezeOgnoo) {
      tukhainObject.freezeOgnoo = tukhainObject.tuukh[0].tsagiinTuukh[0].garsanTsag || new Date();
      await Uilchluulegch(tukhainKholbolt).updateOne(
        { _id: tukhainObject._id },
        { freezeOgnoo: tukhainObject.freezeOgnoo },
      );
    }
    bodsonDun = await zogsooliinDunAvya(
      tukhainZogsool,
      tukhainObject,
      tukhainKholbolt,
    );

    if (!tukhainObject.tuukh[0].tulbur)
      tukhainObject.tuukh[0].tulbur = [];

    const tulburDun = tukhainObject.tuukh[0].tulbur.reduce(
      (a, b) => a + (b.dun || 0),
      0,
    );
    console.log("-----tulburDun---->>" + tulburDun);
    console.log("-----bodsonDun---->>" + bodsonDun);
    console.log("-----req.body.paid_amount---->>" + req.body.paid_amount);
    console.log("------>" + (req.body.paid_amount + tulburDun))
    if (tulburDun > 0 && bodsonDun < (req.body.paid_amount + tulburDun)) {
      return { success: false, message: "Төлөлт хийгдсэн байна!" };
    }
    console.log("----bodsonDun----->>" + bodsonDun);
    console.log("--req.body.paid_amount------->>" + req.body.paid_amount);
    if (bodsonDun === req.body.paid_amount + tulburDun) {
      tukhainObject.tuukh[0].tulbur.push(...tulbur);
    }
    else
      return { success: false, message: "Төлөх дүн буруу байна!" };
    let set = {
      "tuukh.$[t].tulbur": tukhainObject.tuukh[0].tulbur,
      tokiId: "toki",
    };
    if (bodsonDun === req.body.paid_amount + tulburDun) {
      if (!req.body.manually_open) {
        set.garakhTsag = new Date(
          Date.now() + (tukhainZogsool?.garakhTsag || 30) * 60000,
        );
      }
      if (!!tukhainObject.tuukh[0].garsanKhaalga)
        set["tuukh.$[t].tuluv"] = 1;
    }
    await Uilchluulegch(tukhainKholbolt).findByIdAndUpdate(
      tukhainObject._id,
      { $set: set },
      {
        arrayFilters: [{ "t.zogsooliinId": tukhainZogsool._id }],
      },
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
          mashiniiDugaar: req.body.plate_number,
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
    tukhainObject.niitDun = req.body.paid_amount;
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
  } catch (err) {
    if (next) next(err);
  }
};
