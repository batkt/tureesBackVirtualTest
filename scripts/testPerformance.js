/**
 * Performance testing script
 * Run: node scripts/testPerformance.js
 * 
 * This will test both methods and estimate performance for 200k documents
 */

const dotenv = require("dotenv");
const path = require("path");

// Load environment variables first (required for database connection)
dotenv.config({ path: path.join(__dirname, "../tokhirgoo/tokhirgoo.env") });

const { Uilchluulegch } = require("parking-v2");
const { db } = require("zevbackv2");
const { benchmarkMethods, quickBenchmark } = require("../utils/benchmarkAggregation");

async function testPerformance() {
  try {
    console.log("🚀 Starting performance test...\n");
    console.log("⏳ Initializing database connection...\n");

    // Wait for database to initialize (zevbackv2 might initialize async)
    let kholboltuud = null;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      kholboltuud = db.kholboltuud;
      if (kholboltuud && kholboltuud.length > 0) {
        break;
      }
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    if (!kholboltuud || kholboltuud.length === 0) {
      console.error("❌ No database connections found after", maxAttempts, "attempts");
      console.error("\n💡 Troubleshooting:");
      console.error("   1. Make sure MongoDB is running");
      console.error("   2. Check tokhirgoo/tokhirgoo.env file exists");
      console.error("   3. Verify database connection settings");
      console.error("   4. Try running the main application first to initialize connections");
      process.exit(1);
    }

    const kholbolt = kholboltuud[0];
    const model = Uilchluulegch(kholbolt, true);

    console.log(`📊 Database: ${kholbolt.baiguullagiinId || "Connected"}`);
    console.log(`📦 Total connections: ${kholboltuud.length}`);
    console.log("");

    // Get total document count first
    const totalCount = await model.countDocuments({});
    console.log(`📈 Total documents in collection: ${totalCount.toLocaleString()}`);
    console.log("");

    // Test with a sample query (adjust based on your needs)
    // You can modify this query to match your actual use case
    const testQuery = {
      baiguullagiinId: kholbolt.baiguullagiinId,
      // Uncomment and adjust based on your typical queries:
      // createdAt: { $gte: new Date("2026-01-01"), $lte: new Date("2026-01-31") }
      // barilgiinId: "your-barilgiinId-here"
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
    console.log("\n💡 To compare both methods:");
    console.log("   1. Use the API endpoint: GET /benchmarkUilchluulegch");
    console.log("   2. Or modify this script to call benchmarkMethods()");
    console.log("\n📝 Note: For 200k documents, the actual time will depend on:");
    console.log("   - Query complexity");
    console.log("   - Index usage");
    console.log("   - Server resources");
    console.log("   - Network latency");

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
