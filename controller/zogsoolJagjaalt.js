const Uilchluulegch = require("parking-v2");

module.exports.archiveUilchluulegch = async function archiveUilchluulegch() {
  try {
    const { db } = require("zevbackv2");
    const kholboltuud = db.kholboltuud;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (!kholboltuud || kholboltuud.length === 0) {
      console.log("⚠️ No kholboltuud found");
      return;
    }

    for (const kholbolt of kholboltuud) {
      try {
        console.log(`\n🔄 Processing kholbolt: ${kholbolt.baiguullagiinId}`);

        // Find all distinct months in the collection
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
          `📅 ${months.length} distinct months found for kholbolt: ${kholbolt.baiguullagiinId}`
        );

        for (const { _id } of months) {
          const y = _id.year;
          const m = _id.month;

          // Skip current month
          if (y === currentYear && m === currentMonth) {
            console.log(`⏭️ Skipping current month: ${y}-${m}`);
            continue;
          }

          const archiveName = `Uilchluulegch${y}${String(m).padStart(2, "0")}`;
          console.log(
            `\n📦 Processing month: ${y}-${String(m).padStart(
              2,
              "0"
            )} → ${archiveName}`
          );

          // Count documents in main collection for this month
          const mainCount = await Uilchluulegch(kholbolt).countDocuments({
            "tuukh.0.tsagiinTuukh.0.garsanTsag": { $exists: true },
            createdAt: { $gte: new Date(y, m - 1, 1), $lt: new Date(y, m, 1) },
          });

          // Count documents already in archive
          const archiveCount = await Uilchluulegch(
            kholbolt,
            false,
            archiveName
          ).countDocuments();

          console.log(
            `📊 Main collection: ${mainCount} docs, Archive: ${archiveCount} docs`
          );

          // Check if archiving is already complete
          if (archiveCount > 0 && archiveCount === mainCount) {
            console.log(`✅ Already fully archived: ${archiveName}`);
            continue;
          }

          // Skip if no documents to archive
          if (mainCount === 0) {
            console.log(`⏭️ No documents to archive for ${archiveName}`);
            continue;
          }

          // Fetch documents to archive
          const data = await Uilchluulegch(kholbolt)
            .find({
              "tuukh.0.tsagiinTuukh.0.garsanTsag": { $exists: true },
              createdAt: {
                $gte: new Date(y, m - 1, 1),
                $lt: new Date(y, m, 1),
              },
            })
            .lean();

          if (!data || data.length === 0) {
            console.log(`⚠️ No data retrieved for ${archiveName}`);
            continue;
          }

          console.log(`📥 Retrieved ${data.length} documents to archive`);

          // Insert into archive collection
          const insertResult = await Uilchluulegch(
            kholbolt,
            false,
            archiveName
          ).insertMany(data, {
            ordered: false, // Continue on duplicate key errors
          });

          const insertedCount =
            insertResult?.insertedCount || insertResult?.length || 0;
          console.log(
            `💾 Inserted ${insertedCount} documents into ${archiveName}`
          );

          // Verify insertion before deleting
          if (insertedCount !== data.length) {
            console.error(
              `⚠️ Insertion mismatch: Expected ${data.length}, got ${insertedCount}. Skipping deletion.`
            );
            continue;
          }

          // Delete from main collection
          const deleteResult = await Uilchluulegch(kholbolt).deleteMany({
            "tuukh.0.tsagiinTuukh.0.garsanTsag": { $exists: true },
            createdAt: { $gte: new Date(y, m - 1, 1), $lt: new Date(y, m, 1) },
          });

          console.log(
            `🗑️ Deleted ${
              deleteResult?.deletedCount || 0
            } documents from main collection`
          );
          console.log(`✅ Successfully archived ${archiveName}`);
        }

        console.log(`✅ Completed kholbolt: ${kholbolt.baiguullagiinId}\n`);
      } catch (kholboltError) {
        console.error(
          `❌ Error processing kholbolt ${kholbolt.baiguullagiinId}:`,
          kholboltError
        );
        // Continue with next kholbolt
      }
    }

    console.log("🎉 Archiving process completed");
  } catch (error) {
    console.error("❌ Critical error in archiveUilchluulegch:", error);
    throw error;
  }
};
