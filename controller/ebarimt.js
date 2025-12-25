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
            for await (const kholbolt of kholboltuud) {
                if (kholbolt.baiguullagiinId !== "612f457d185280db676d0b51") continue;
                const months = await EbarimtShine(kholbolt).aggregate([
                    { $project: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } } },
                    { $group: { _id: { year: "$year", month: "$month" } } }
                ]);
                console.log(`${months} months found for kholbolt: ${kholbolt.baiguullagiinId}`);
                for(const { _id } of months) {
                    const y = _id.year;
                    const m = _id.month;
                    if (y === currentYear && m === currentMonth) return; // одоогийн сар алгасна
                    const archiveName = `ebarimtShine${y}${String(m).padStart(2, "0")}`;
                    console.log(`📦 Archiving month: ${archiveName}`);

                    const collections = await kholbolt?.kholbolt?.listCollections({ name: archiveName }).toArray();
                    if (collections.length > 0) {
                        console.log(`${archiveName} collection already exists`);
                    } else {
                        console.log(`${archiveName} does not exist yet`);
                    }

                    
                    // // --- Archive ---
                    // await EbarimtShine(kholbolt).aggregate([
                    //     { $match: { createdAt: { $gte: new Date(y, m - 1, 1), $lt: new Date(y, m, 1) } } },
                    //     { $out: archiveName }
                    // ]);
                    // // --- Delete ---
                    // const res = await EbarimtShine(kholbolt).deleteMany({
                    //     createdAt: { $gte: new Date(y, m - 1, 1), $lt: new Date(y, m, 1) }
                    // });
                    // console.log(`🗑️ Deleted ${res?.deletedCount} docs from ebarimtShine`);
                }
            }
        }
    } catch (error) {
        console.error("Error archiving archiveEbarimt:", error);
    }
};