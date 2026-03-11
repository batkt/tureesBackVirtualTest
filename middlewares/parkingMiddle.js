const { pubClient } = require("../utils/redisClient");
const crypto = require("crypto");
const { Parking, Uilchluulegch } = require("parking-v2");

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
  const cached = await pubClient.get(cacheKey);
  // if (cached) return JSON.parse(cached);
  const data = await Parking(kholbolt)
    .find(query)
    .lean();
  await pubClient.setEx(cacheKey, 36000, JSON.stringify(data));
  return data;
}
async function getDotorZogsoolById(kholbolt, baiguullagiinId, barilgiinId, id) {
  const cacheKey = `dotorZogsoolFindById:${baiguullagiinId}:${barilgiinId}:${id}`;
  const cached = await pubClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  const dotorZogsool = await Parking(kholbolt).findById(id);
  await pubClient.setEx(cacheKey, 300, JSON.stringify(dotorZogsool));
  return dotorZogsool;
}
async function getAggregateUilchluulegch(
  kholbolt,
  baiguullagiinId,
  barilgiinId,
  query,
) {
  const queryKey = crypto
    .createHash("md5")
    .update(stableStringify(query))
    .digest("hex");
  const cacheKey = `parkingUilchluulegch:${baiguullagiinId}:${barilgiinId}:${queryKey}`;
  const cached = await pubClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const xariu = await Uilchluulegch(kholbolt, true).aggregate(query);
  await pubClient.setEx(cacheKey, 300, JSON.stringify(xariu));
  return xariu;
}
async function delParkingFind(baiguullagiinId) {
  const keys = await pubClient.keys(`parkingFind:${baiguullagiinId}:*`);
  if (keys.length > 0) {
    await pubClient.del(keys);
  }
}
module.exports = { getParkingFind, getDotorZogsoolById, getAggregateUilchluulegch, delParkingFind };