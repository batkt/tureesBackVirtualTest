const { db } = require("zevbackv2");
const {
  Uilchluulegch,
  zogsooliinDunAvya,
} = require("parking-v2");
const { getParkingFind } = require("../middlewares/parkingMiddle");
const { buildResponseData } = require("../helper/parkingData");

async function tootsoolohTulbur({ zogsool, mashin, kholbolt }) {
  if (
    zogsool?.togtmolTulburEsekh &&
    zogsool?.togtmolTulburiinDun > 0 &&
    mashin?.turul === "Дурын"
  ) {
    return zogsool.togtmolTulburiinDun;
  }

  return zogsooliinDunAvya(zogsool, mashin, kholbolt);
}

async function findActiveCar({ kholbolt, zogsool, plateNumber, barilgiinId }) {
  const match = {
    mashiniiDugaar: plateNumber,
    "tuukh.0.zogsooliinId": zogsool._id,
    "tuukh.0.tuluv": 0,
    zurchil: { $exists: false },
  };

  if (barilgiinId) match.barilgiinId = barilgiinId;

  return Uilchluulegch(kholbolt, true)
    .findOne(match)
    .sort({ createdAt: -1 });
}

exports.searchCarToki = async ({ plateNumber, query }) => {
  let kholboltuud = db.kholboltuud;
  let dataList = [];
  let message = "Amjilttai";
  let success = true;

  const localEsekh = !!query.baiguullagiinId;

  if (localEsekh) {
    kholboltuud = kholboltuud.filter(
      (a) => a.baiguullagiinId == query.baiguullagiinId
    );
  }

  for (const kholbolt of kholboltuud) {
    if (!kholbolt.baiguullagiinId) continue;

    const parkingQuery = localEsekh
      ? { baiguullagiinId: query.baiguullagiinId }
      : { tokiNer: { $exists: true } };

    if (query.barilgiinId) {
      parkingQuery.barilgiinId = query.barilgiinId;
    }

    const zogsooluud = await getParkingFind(
      kholbolt,
      kholbolt.baiguullagiinId,
      parkingQuery
    );

    for (const zogsool of zogsooluud) {
      const mashin = await findActiveCar({
        kholbolt,
        zogsool,
        plateNumber,
        barilgiinId: query.barilgiinId,
      });

      if (!mashin) continue;

      const bodsonDun = await tootsoolohTulbur({
        zogsool,
        mashin,
        kholbolt,
      });

      if (bodsonDun > 0) {
        dataList.push(buildResponseData({
          zogsool,
          mashin,
          plateNumber,
          bodsonDun,
        }));
      }
    }
  }

  if (dataList.length === 0) {
    return {
      success: false,
      message: "Машины мэдээлэл олдсонгүй!",
      data: null,
    };
  }

  const data = dataList.reduce((a, b) =>
    new Date(a.enter_date) > new Date(b.enter_date) ? a : b
  );

  return { success, message, data };
};
