// server.js
import "dotenv/config";        // để đọc file .env ở root
import { buildApp } from "./app.js";
import { connectMongo } from "./config/mongo.js";
import { config } from "./config/env.js";

async function start() {
  try {
    // 1. Kết nối Mongo
    await connectMongo();

    // 2. Khởi tạo Fastify app
    const app = buildApp();

    // 3. Lắng nghe
    await app.listen({
      port: config.port,
      host: "0.0.0.0",
    });

    console.log(`API running on http://0.0.0.0:${config.port}`);
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
