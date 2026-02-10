const {
    Parking,
    Uilchluulegch,
    zogsooliinDunAvya,
} = require("parking-v2");
const { db } = require("zevbackv2");
const moment = require("moment");
const { getParkingFind } = require("../middlewares/parkingMiddle");

async function getPassZogsool(body) {
  const jagsaalt = [];

  const kholboltuud = db.kholboltuud || [];
  const ekhlekhOgnoo = new Date(Date.now() - 86400000);
  const duusakhOgnoo = new Date(Date.now() - 86400000);
  ekhlekhOgnoo.setHours(0, 0, 0, 0);
  duusakhOgnoo.setHours(23, 59, 59, 999);

  for (const kholbolt of kholboltuud) {
    const zogsooluud = await Parking(kholbolt).find({
      passNer: { $exists: true },
    });

    for (const zogsool of zogsooluud) {
      if (!zogsool) continue;

      let dotorZogsool;
      if (zogsool.dotorZogsooliinId) {
        dotorZogsool = await Parking(kholbolt).findById(
          zogsool.dotorZogsooliinId
        );
      }

      const xariu = await Uilchluulegch(kholbolt, true).aggregate([
        {
          $match: {
            createdAt: {
              $gte: ekhlekhOgnoo,
              $lte: duusakhOgnoo,
            },
            baiguullagiinId: zogsool.baiguullagiinId,
          },
        },
        { $unwind: "$tuukh" },
        {
          $match: { "tuukh.garsanKhaalga": { $exists: false } },
        },
        {
          $group: {
            _id: "$tuukh.zogsooliinId",
            too: { $sum: 1 },
          },
        },
      ]);

      let parked = 0;
      let dotor = {};

      if (xariu && xariu.length > 0) {
        if (dotorZogsool && zogsool.dotorZogsooliinId) {
          dotor.niit = dotorZogsool.too;
          dotor.zogsson =
            xariu.find((x) => x._id == dotorZogsool._id.toString())?.too || 0;

          parked =
            xariu.find((x) => x._id == zogsool._id.toString())?.too || 0;
        } else {
          parked = xariu[0].too;
        }
      }

      const slot = {
        gadna: {
          garakhTsag: zogsool.garakhTsag || 30,
          tulburuud: zogsool.tulburuud,
          niit: zogsool.too,
          zogsson: parked,
        },
      };

      if (dotorZogsool && zogsool.dotorZogsooliinId) {
        slot.dotor = dotor;
      }

      const exists = jagsaalt.some(
        (e) => e.id === zogsool._id.toString()
      );
      if (!exists) {
        jagsaalt.push({
          id: zogsool._id.toString(),
          ner: zogsool.passNer,
          bagtaamj: slot,
        });
      }
    }
  }

  return jagsaalt;
}
async function mashinKhaikhService (dugaar, freeze) {
  const kholboltuud = db.kholboltuud;

  let bodsonDun = 0;
  let data = null;
  let oldsonMashin = null;
  let tukhainKholbolt = null;

  if (kholboltuud) {
    for (const kholbolt of kholboltuud) {
      const query = { passNer: { $exists: true } };

      const zogsooluud = await getParkingFind(
        kholbolt,
        kholbolt.baiguullagiinId,
        query
      );

      for (const zogsool of zogsooluud) {
        if (!zogsool) continue;

        oldsonMashin = await Uilchluulegch(kholbolt, true).findOne({
          "tuukh.0.zogsooliinId": zogsool._id,
          mashiniiDugaar: dugaar,
          $or: [
            {
              "tuukh.0.tsagiinTuukh.0.garsanTsag": {
                $gt: new Date(Date.now() - 100000),
              },
            },
            {
              "tuukh.0.tsagiinTuukh.0.garsanTsag": {
                $exists: false,
              },
            },
          ],
          "tuukh.0.tuluv": { $nin: [-2, -3, -4] },
        });

        if (oldsonMashin?.mashiniiDugaar) {
          bodsonDun = await zogsooliinDunAvya(
            zogsool,
            oldsonMashin,
            kholbolt
          );
        }

        if (oldsonMashin?.mashiniiDugaar) {
          tukhainKholbolt = kholbolt;

          data = {
            dugaar,
            orsonTsag: moment(
              oldsonMashin.tuukh[0].tsagiinTuukh[0].orsonTsag
            ).format("YYYY/MM/DD HH:mm:ss"),
            tulukhDun: bodsonDun || 0,
            zogsoolId: zogsool._id,
            garakhKhugatsaa: zogsool?.garakhTsag || 30,
            id: oldsonMashin._id,
          };
          break;
        }
      }

      if (data) break;
    }
  }

  if (!oldsonMashin) {
    return {
      success: false,
      message: "Машины мэдээлэл олдсонгүй!",
      data: null,
    };
  }

  if (freeze) {
    await Uilchluulegch(tukhainKholbolt).updateOne(
      { _id: oldsonMashin._id },
      { freezeOgnoo: new Date() }
    );
  }

  return {
    success: true,
    message: "Amjilttai",
    data,
  };
};
async function getCarBySession(sessionId) {
  const kholboltuud = db.kholboltuud;

  let data;
  let message = "Amjilttai";
  let success = true;
  let oldsonMashin;

  if (kholboltuud) {
    for (const kholbolt of kholboltuud) {
      const zogsooluud = await Parking(kholbolt).find({
        tokiNer: { $exists: true },
      });

      for (const zogsool of zogsooluud) {
        oldsonMashin = await Uilchluulegch(kholbolt, true).findById(sessionId);

        if (!oldsonMashin) {
          message = "Мэдээлэл олдсонгүй!";
          success = false;
          continue;
        }

        if (oldsonMashin?.mashiniiDugaar) {
          data = {
            plate_number: oldsonMashin.mashiniiDugaar,
            enter_date: moment(
              oldsonMashin.tuukh[0].tsagiinTuukh[0].orsonTsag
            ).format("YYYY/MM/DD HH:mm:ss"),
            out_date: moment(
              oldsonMashin.tuukh[0].tsagiinTuukh[0].garsanTsag
            ).format("YYYY/MM/DD HH:mm:ss"),
            pay_amount: oldsonMashin.niitDun,
            paid_amount:
              oldsonMashin.tuukh[0].tulbur?.length > 0
                ? oldsonMashin.niitDun
                : 0,
            parking_id: zogsool._id,
            session_id: oldsonMashin._id,
          };
          break;
        }
      }
      if (oldsonMashin?.mashiniiDugaar) break;
    }
  }

  return {
    success,
    message,
    data,
  };
};

module.exports = {
  getPassZogsool,
  mashinKhaikhService,
  getCarBySession,
};
