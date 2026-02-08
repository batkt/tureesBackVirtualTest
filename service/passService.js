const {
    Parking,
    Uilchluulegch,
} = require("parking-v2");
const { db } = require("zevbackv2");

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

module.exports = {
  getPassZogsool,
};
