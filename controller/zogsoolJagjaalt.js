const Uilchluulegch = require("parking-v2");

module.exports.archiveUilchluulegch = async function archiveUilchluulegch() {
  try {
    const { db } = require("zevbackv2");
    const kholboltuud = db.kholboltuud;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    if (kholboltuud) {
      for (const kholbolt of kholboltuud) {
        // if (kholbolt.baiguullagiinId !== "65435cdff2f5358696c61454") continue;
        const months = await Uilchluulegch(kholbolt).aggregate([
          {
            $project: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
          },
          { $group: { _id: { year: "$year", month: "$month" } } },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);
        console.log(
          `${JSON.stringify(months)} months found for kholbolt: ${
            kholbolt.baiguullagiinId
          }`
        );
        for (const { _id } of months) {
          const y = _id.year;
          const m = _id.month;
          if (y === currentYear && m === currentMonth) continue; // одоогийн сар алгасна
          const archiveName = `Uilchluulegch${y}${String(m).padStart(2, "0")}`;
          console.log(`📦 Archiving month: ${archiveName}`);
          const docs = await Uilchluulegch(kholbolt, false, archiveName).find({
            "tuukh.0.tsagiinTuukh.0.garsanTsag": { $exists: true },
            createdAt: { $gte: new Date(y, m - 1, 1), $lt: new Date(y, m, 1) },
          });
          if (docs?.length > 0) continue;
          console.log(`📦 docs length: ${docs?.length}`);
          // --- Archive ---
          const data = await Uilchluulegch(kholbolt).aggregate([
            {
              $match: {
                "tuukh.0.tsagiinTuukh.0.garsanTsag": { $exists: true },
                createdAt: {
                  $gte: new Date(y, m - 1, 1),
                  $lt: new Date(y, m, 1),
                },
              },
            },
          ]);
          await Uilchluulegch(kholbolt, false, archiveName).insertMany(data);
          // --- Delete ---
          const res = await Uilchluulegch(kholbolt).deleteMany({
            "tuukh.0.tsagiinTuukh.0.garsanTsag": { $exists: true },
            createdAt: { $gte: new Date(y, m - 1, 1), $lt: new Date(y, m, 1) },
          });
          console.log(
            `🗑️ Deleted ${res?.deletedCount} docs from Uilchluulegch`
          );
        }
      }
    }
  } catch (error) {
    console.error("Error archiving archiveUilchluulegch:", error);
  }
};
