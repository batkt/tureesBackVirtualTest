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

module.exports.archiveEbarimtKhonog =
  async function archiveEbarimtKhonog() {
    const { db } = require("zevbackv2");
    const kholboltuud = db.kholboltuud;
    const now = new Date();
    const archiveBeforeDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    archiveBeforeDate.setHours(0, 0, 0, 0);
    const y = archiveBeforeDate.getFullYear();
    const m = archiveBeforeDate.getMonth() + 1;
    const archiveName = `ebarimtShine${y}${String(m).padStart(2, "0")}`;
    if (kholboltuud) {
        for (const kholbolt of kholboltuud) {
            console.log("baiguullagiinId --->:", kholbolt.baiguullagiinId);
            const baiguullaga = await Baiguullaga(db.erunkhiiKholbolt).findById(kholbolt.baiguullagiinId);
            if(!baiguullaga) continue;
            if (kholbolt.baiguullagiinId !== "612f457d185280db676d0b51") continue;
            const archivedIds = await EbarimtShine(
            kholbolt,
            false,
            archiveName
            ).find({ mashiniiDugaar: {$exists: true} }, { _id: 1 }).lean();
            const archivedIdSet = new Set(archivedIds.map(d => String(d._id)));
            console.log("archiveBeforeDate --->:", archiveBeforeDate);
            const data = await EbarimtShine(kholbolt).find({
            _id: { $nin: Array.from(archivedIdSet) },
            mashiniiDugaar: {$exists: true},
            createdAt: { $lt: archiveBeforeDate }
            }).lean();
            if (!data.length) continue;
            console.log(`Archiving ${data.length} docs for ${baiguullaga?.ner} (${kholbolt.baiguullagiinId})`);
            // await EbarimtShine(kholbolt, false, archiveName).insertMany(data);
            // await EbarimtShine(kholbolt).deleteMany({
            // _id: { $in: data.map(d => d._id) },
            // mashiniiDugaar: {$exists: true},
            // createdAt: { $lt: archiveBeforeDate }
            // });
        }
    }
};