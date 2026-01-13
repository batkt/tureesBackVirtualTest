/**
 * Performance testing script
 * Run: node scripts/testPerformance.js
 * 
 * This will test both methods and estimate performance for 200k documents
 */

const { Uilchluulegch } = require("parking-v2");
const { db } = require("zevbackv2");
const { benchmarkMethods, quickBenchmark } = require("../utils/benchmarkAggregation");

async function testPerformance() {
  try {
    console.log("🚀 Starting performance test...\n");

    // Get first available connection
    const kholboltuud = db.kholboltuud;
    if (!kholboltuud || kholboltuud.length === 0) {
      console.error("❌ No database connections found");
      process.exit(1);
    }

    const kholbolt = kholboltuud[0];
    const model = Uilchluulegch(kholbolt, true);

    console.log(`📊 Database: ${kholbolt.baiguullagiinId}`);
    console.log("");

    // Test with a sample query (adjust based on your needs)
    const testQuery = {
      baiguullagiinId: kholbolt.baiguullagiinId,
      // Add your typical query conditions here
      // createdAt: { $gte: new Date("2026-01-01"), $lte: new Date("2026-01-31") }
    };

    // First, do a quick benchmark to see current performance
    console.log("📈 Quick benchmark (current method only)...");
    const quickResult = await quickBenchmark(model, testQuery, {
      khuudasniiDugaar: 1,
      khuudasniiKhemjee: 100,
    });

    if (quickResult.error) {
      console.error("❌ Error:", quickResult.error);
      return;
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`⏱️  Current method performance:`);
    console.log(`   Duration: ${quickResult.durationSeconds}s`);
    console.log(`   Memory: ${quickResult.memoryUsed}MB`);
    console.log(`   Documents processed: ${quickResult.totalDocs.toLocaleString()}`);
    console.log(`   Results returned: ${quickResult.resultCount}`);
    console.log("");
    console.log(`🔮 ESTIMATION FOR 200,000 DOCUMENTS:`);
    console.log(`   Estimated time: ~${quickResult.estimated200kSeconds}s (~${quickResult.estimated200kMinutes} minutes)`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");

    // Ask if user wants full comparison
    console.log("💡 To compare both methods, use the /benchmarkUilchluulegch endpoint");
    console.log("   or modify this script to call benchmarkMethods()");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  testPerformance()
    .then(() => {
      console.log("\n✅ Test completed");
      process.exit(0);
    })
    .catch((err) => {
      console.error("\n❌ Test failed:", err);
      process.exit(1);
    });
}

module.exports = { testPerformance };
