const client = require("../routes/redisClient");
const crypto = require("crypto");
const { Parking } = require("parking-v2");

function stableStringify(obj) {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return `[${obj.map(stableStringify).join(",")}]`;
  const keys = Object.keys(obj).sort();
  return `{${keys
    .map((k) => JSON.stringify(k) + ":" + stableStringify(obj[k]))
    .join(",")}}`;
}

async function getParkingFind(kholbolt, baiguullagiinId, query) {
  const queryKey = crypto
    .createHash("md5")
    .update(stableStringify(query))
    .digest("hex");
  const cacheKey = `parkingFind:${baiguullagiinId}:${queryKey}`;
  const cached = await client.get(cacheKey);
  if (cached) return JSON.parse(cached);
  const data = await Parking(kholbolt)
    .find(query)
    .lean();
  await client.setEx(cacheKey, 300, JSON.stringify(data));
  return data;
}

module.exports = { getParkingFind };