// src/config/env.js
export const config = {
  // Server
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || "development",

  // Database
  mongoUri: process.env.MONGO_URI || "mongodb://mongo:27017/picklepickle_dev",
  redisUrl: process.env.REDIS_URL || "redis://redis:6379",

  // Auth
  jwtSecret: process.env.JWT_SECRET || "dev_super_secret_change_me",

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",

  // API
  apiPrefix: process.env.API_PREFIX || "/api",

  emailHost: process.env.EMAIL_HOST,
  emailPort: Number(process.env.EMAIL_PORT || 587),
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  emailFrom: process.env.EMAIL_FROM || process.env.EMAIL_USER,
};

