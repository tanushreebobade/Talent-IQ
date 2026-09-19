import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const ENV = {
  PORT: process.env.PORT || 5000,
  DB_URL: process.env.DB_URL,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
  INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
  STREAM_API_KEY: process.env.STREAM_API_KEY,
  STREAM_API_SECRET: process.env.STREAM_API_SECRET,
};

// Validate critical environment variables
const requiredEnv = ["PORT", "DB_URL", "CLIENT_URL", "STREAM_API_KEY", "STREAM_API_SECRET"];
const missingEnv = requiredEnv.filter((key) => !ENV[key]);

if (missingEnv.length > 0) {
  const errorMessage = `❌ Critical startup failure: Missing environment variable(s): ${missingEnv.join(", ")}`;
  console.error(errorMessage);
  throw new Error(errorMessage);
}
