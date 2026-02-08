const {
    Parking,
    Mashin,
    BlockMashin,
} = require("parking-v2");
const { getParkingFind, getDotorZogsoolById, getAggregateUilchluulegch } = require("../middlewares/parkingMiddle");
const { db } = require("zevbackv2");

async function getCameraIPsByBarilgiinId(req, barilgiinId) {
    if (!barilgiinId) throw new Error("BarilgiinId baihgui bn");
    const result = await Parking(req.body.tukhainBaaziinKholbolt).find({ barilgiinId });
    const yavuulakhIp = [];
    result.forEach((zogsool) => {
        zogsool.khaalga.forEach((khaalga) => {
        khaalga.camera.forEach((cameraIp) => {
            yavuulakhIp.push(cameraIp.cameraIP);
        });
        });
    });
    return yavuulakhIp;
}
async function mashiniiTooAvakh({
  baiguullagiinId,
  barilgiinId,
  tukhainBaaziinKholbolt,
}) {
  const mashinQuery = [
    {
      $match: {
        baiguullagiinId,
        barilgiinId,
      },
    },
    {
      $group: {
        _id: "$turul",
        too: { $sum: 1 },
      },
    },
  ];

  const mashinResult = await Mashin(
    tukhainBaaziinKholbolt,
  ).aggregate(mashinQuery);

  const blockQuery = [
    {
      $match: {
        baiguullagiinId,
        barilgiinId,
      },
    },
    {
      $group: {
        _id: "Block",
        too: { $sum: 1 },
      },
    },
  ];

  const blockResult = await BlockMashin(
    tukhainBaaziinKholbolt,
  ).aggregate(blockQuery);

  return [...mashinResult, ...blockResult];
}
async function getParkingStatus(body) {
  const jagsaalt = [];

  let kholboltuud = db.kholboltuud;

  const ekhlekhOgnoo = new Date();
  const duusakhOgnoo = new Date();
  ekhlekhOgnoo.setHours(0, 0, 0, 0);
  duusakhOgnoo.setHours(23, 59, 59, 999);

  if (body.baiguullagiinId) {
    kholboltuud = kholboltuud.filter(
      (a) => a.baiguullagiinId == body.baiguullagiinId,
    );
  }

  if (!kholboltuud || kholboltuud.length === 0) return [];

  const baseQuery = { tokiNer: { $exists: true } };
  if (body.baiguullagiinId) {
    baseQuery.baiguullagiinId = body.baiguullagiinId;
  }

  for (const kholbolt of kholboltuud) {
    const zogsooluud = await getParkingFind(
      kholbolt,
      kholbolt.baiguullagiinId,
      baseQuery,
    );

    for (const zogsool of zogsooluud) {
      if (!zogsool) continue;

      let dotorZogsool;
      if (zogsool.dotorZogsooliinId) {
        dotorZogsool = await getDotorZogsoolById(
          kholbolt,
          zogsool.baiguullagiinId,
          zogsool.barilgiinId,
          zogsool.dotorZogsooliinId,
        );
      }

      const queryMatch = [
        {
          $match: {
            createdAt: {
              $gte: ekhlekhOgnoo,
              $lte: duusakhOgnoo,
            },
            baiguullagiinId: zogsool.baiguullagiinId,
            barilgiinId: zogsool.barilgiinId,
          },
        },
        { $unwind: "$tuukh" },
        {
          $match: {
            "tuukh.garsanKhaalga": { $exists: false },
          },
        },
        {
          $project: {
            zogsooliinId: "$tuukh.zogsooliinId",
          },
        },
        {
          $group: {
            _id: "$zogsooliinId",
            too: { $sum: 1 },
          },
        },
      ];

      const xariu = await getAggregateUilchluulegch(
        kholbolt,
        zogsool.baiguullagiinId,
        zogsool.barilgiinId,
        queryMatch,
      );

      let parked = 0;
      let inside = {};

      if (xariu && xariu.length > 0) {
        if (dotorZogsool && zogsool.dotorZogsooliinId) {
          inside.total = dotorZogsool.too;
          inside.parked =
            xariu.find(
              (x) => x._id == dotorZogsool._id.toString(),
            )?.too || 0;

          parked =
            xariu.find(
              (x) => x._id == zogsool._id.toString(),
            )?.too || 0;
        } else {
          parked = xariu[0].too;
        }
      }

      const slot = {
        outside: {
          total: zogsool.too,
          parked,
        },
      };

      if (dotorZogsool && zogsool.dotorZogsooliinId) {
        slot.inside = inside;
      }

      jagsaalt.push({
        id: zogsool._id.toString(),
        name: zogsool.ner,
        baiguullagiinId: zogsool.baiguullagiinId,
        barilgiinId: zogsool.barilgiinId,
        slot,
      });
    }
  }

  return jagsaalt;
}
module.exports = { getCameraIPsByBarilgiinId, mashiniiTooAvakh, getParkingStatus };
