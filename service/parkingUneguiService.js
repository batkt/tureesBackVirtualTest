const {
    Uilchluulegch,
} = require("parking-v2");
const { getParkingFind, } = require("../middlewares/parkingMiddle");
const { db } = require("zevbackv2");

async function searchCarUnegui({ plate_number, baiguullagiinId }) {
  let kholboltuud = db.kholboltuud || [];
  let oldsonMashin;
  let tukhainKholbolt;
  let data;
  let tulburData = [];
  let message = "Amjilttai";
  let success = true;

  const localEsekh = !!baiguullagiinId;
  if (localEsekh) {
    kholboltuud = kholboltuud.filter(
      (a) => a.baiguullagiinId == baiguullagiinId
    );
  }

  for (const kholbolt of kholboltuud) {
    const query = localEsekh
      ? { baiguullagiinId }
      : { tokiNer: { $exists: true } };

    const zogsooluud = await getParkingFind(kholbolt, kholbolt.baiguullagiinId, query);

    for (const zogsool of zogsooluud) {
      if (!zogsool) continue;

      tukhainKholbolt = kholbolt;

      oldsonMashin = await Uilchluulegch(kholbolt, true).findOne({
        mashiniiDugaar: plate_number,
        tuukh: {
          $elemMatch: {
            zogsooliinId: zogsool._id,
            tuluv: { $nin: [-2, -3, -4] },
            $or: [
              {
                "tsagiinTuukh.0.garsanTsag": {
                  $gt: new Date(Date.now() - 15 * 100000),
                },
              },
              { "tsagiinTuukh.0.garsanTsag": { $exists: false } },
            ],
          },
        },
      });

      if (localEsekh && oldsonMashin) {
        if (baiguullagiinId === "670f3437b41a478195dd3d4b") {
          data = {
            plate_number,
            text: "Үнэгүй зочид",
          };
          tulburData = [{ ognoo: new Date(), turul: "Үнэгүй", dun: 0 }];
        }
        // Бусад нөхцөлүүдийг энд нэмэх боломжтой
      }

      if (data && data.plate_number) break;
    }
    if (data && data.plate_number) break;
  }

  if (!oldsonMashin) {
    message = "Машины мэдээлэл олдсонгүй!";
    success = false;
  }

  if (localEsekh && oldsonMashin) {
    await Uilchluulegch(tukhainKholbolt).updateOne(
      { _id: oldsonMashin._id },
      {
        "tuukh.0.uneguiGarsan": data.text,
        "tuukh.0.tulbur": tulburData,
      }
    );
  }

  return {
    success,
    message,
    data,
  };
}

module.exports = {
  searchCarUnegui,
};
