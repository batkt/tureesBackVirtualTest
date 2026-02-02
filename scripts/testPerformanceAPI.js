/**
 * Alternative: Test performance via API endpoint
 * 
 * Usage:
 * 1. Start your server: pm2 start index.js (or node index.js)
 * 2. Run this script: node scripts/testPerformanceAPI.js
 * 
 * This script calls the benchmark endpoint to test performance
 */

const http = require("http");

// Configuration
const API_URL = process.env.API_URL || "http://localhost:8081";
const API_TOKEN = process.env.API_TOKEN || ""; // You'll need to provide a valid token

async function testViaAPI() {
  
  // Example query - adjust based on your needs
  const query = {
    baiguullagiinId: "your-baiguullagiinId-here", // Replace with actual ID
    // createdAt: { $gte: "2026-01-01T00:00:00.000Z", $lte: "2026-01-31T23:59:59.999Z" }
  };

  const queryString = new URLSearchParams({
    query: JSON.stringify(query),
    khuudasniiDugaar: "1",
    khuudasniiKhemjee: "100",
  }).toString();

  const options = {
    hostname: new URL(API_URL).hostname,
    port: new URL(API_URL).port || 8081,
    path: `/benchmarkUilchluulegch?${queryString}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(data);
            resolve(result);
          } catch (err) {
            reject(err);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on("error", (err) => {
      console.error("❌ Request error:", err.message);
      console.error("\n💡 Make sure:");
      console.error("   1. Server is running (pm2 start index.js)");
      console.error("   2. API_URL is correct");
      console.error("   3. API_TOKEN is valid");
      reject(err);
    });

    req.end();
  });
}

if (require.main === module) {
  if (!API_TOKEN) {
    console.error("❌ API_TOKEN not set!");
    console.error("\n💡 Set it as environment variable:");
    console.error("   export API_TOKEN='your-token-here'");
    console.error("   node scripts/testPerformanceAPI.js");
    console.error("\n   Or edit this file and set API_TOKEN directly");
    process.exit(1);
  }

  testViaAPI()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error("\n❌ Test failed:", err.message);
      process.exit(1);
    });
}

module.exports = { testViaAPI };
