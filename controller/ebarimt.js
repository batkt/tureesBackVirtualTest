const EbarimtShine = require("../models/ebarimtShine");

module.exports.archiveEbarimt =
  async function archiveEbarimt() {
    try 
    {
        const { db } = require("zevbackv2");
        const kholboltuud = db.kholboltuud;
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        if (kholboltuud) {
            for (const kholbolt of kholboltuud) {
                // if (kholbolt.baiguullagiinId !== "6115f350b35689cdbf1b9da3") continue;
                const months = await EbarimtShine(kholbolt).aggregate([
                    { $project: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } } },
                    { $group: { _id: { year: "$year", month: "$month" } } },
                    { $sort: { "_id.year": 1, "_id.month": 1 }, },
                ]);
                for (const { _id } of months) {
                    const y = _id.year;
                    const m = _id.month;
                    if (y === currentYear && m === currentMonth) continue; // одоогийн сар алгасна
                    const archiveName = `ebarimtShine${y}${String(m).padStart(2, "0")}`;
                    const docs = await EbarimtShine(kholbolt, archiveName).find({
                        createdAt: { $gte: new Date(y, m - 1, 1), $lt: new Date(y, m, 1) }
                    });
                    if (docs?.length > 0) continue;
                    // --- Archive ---
                    const data = await EbarimtShine(kholbolt).aggregate([
                        { $match: { createdAt: { $gte: new Date(y, m - 1, 1), $lt: new Date(y, m, 1) } } },
                    ]);
                    await EbarimtShine(kholbolt, archiveName).insertMany(data);
                    // --- Delete ---
                    const res = await EbarimtShine(kholbolt).deleteMany({
                        createdAt: { $gte: new Date(y, m - 1, 1), $lt: new Date(y, m, 1) }
                    });
                }
            }
        }
    } catch (error) {
    }
};