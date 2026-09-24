import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";
import compilerRoutes from "./routes/compilerRoute.js";
import submissionRoutes from "./routes/submissionRoute.js";
import aiRoutes from "./routes/aiRoute.js";

const app = express();

const __dirname = path.resolve();

// middleware
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware()); // adds req.auth()

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/code", compilerRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/ai", aiRoutes);

// Health check endpoint for cloud deployment monitors
app.get("/health", (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(isDbConnected ? 200 : 503).json({
    status: isDbConnected ? "ok" : "degraded",
    database: isDbConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Production SPA deployment serving
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("{*path}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Global centralized error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error caught in Express error middleware:", err);
  const isProd = ENV.NODE_ENV === "production";
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    message: isProd && statusCode === 500 ? "Internal Server Error" : err.message || "Internal Server Error",
  });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();
