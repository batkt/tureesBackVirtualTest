const { createClient } = require("redis");

const redisUrl = "redis://127.0.0.1:6379";

const pubClient = createClient({ url: redisUrl });
const subClient = pubClient.duplicate();

pubClient.on("error", (err) => console.error("Redis pubClient error:", err));
subClient.on("error", (err) => console.error("Redis subClient error:", err));

async function connectRedis() {
  if (!pubClient.isOpen) {
    await pubClient.connect();
  }
  if (!subClient.isOpen) {
    await subClient.connect();
  }
}

module.exports = {
  pubClient,
  subClient,
  connectRedis,
};
