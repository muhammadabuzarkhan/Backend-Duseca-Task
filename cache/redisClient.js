const redis = require("redis");

const client = redis.createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
  },
});

client.on("connect", () => {
  console.log("🟢 Redis: Connecting...");
});

client.on("ready", () => {
  console.log("✅ Redis: Connected and ready to use");
});

client.on("reconnecting", () => {
  console.log("♻️ Redis: Reconnecting...");
});

client.on("error", (err) => {
  console.error("❌ Redis Client Error:", err);
});

client.on("end", () => {
  console.warn("🔴 Redis: Connection closed");
});

(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error("🚫 Redis connection failed:", err);
  }
})();

module.exports = client;
