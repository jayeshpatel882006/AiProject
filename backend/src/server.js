"use strict";

require("dotenv").config();

const app = require("./app");
const { connectDB, disconnectDB } = require("./config/db");
const logger = require("./config/logger");

const PORT = parseInt(process.env.PORT) || 5000;

// ─── Start Server ─────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    const server = app.listen(PORT, "0.0.0.0", () => {
      logger.info(
        `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
      );
    });

    // ─── Graceful Shutdown ────────────────────────────────────────────────────
    const shutdown = async (signal) => {
      logger.info(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info("HTTP server closed.");
        await disconnectDB();
        logger.info("Shutdown complete. Goodbye! 👋");
        process.exit(0);
      });

      // Force exit after 10s if not closed cleanly
      setTimeout(() => {
        logger.error("Forcing shutdown after timeout.");
        process.exit(1);
      }, 10_000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    // ─── Unhandled Rejections & Exceptions ───────────────────────────────────
    process.on("unhandledRejection", (reason, promise) => {
      logger.error("Unhandled Promise Rejection:", { reason, promise });
      // Don't crash the server — log and continue
    });

    process.on("uncaughtException", (err) => {
      logger.error("Uncaught Exception — shutting down:", err);
      shutdown("uncaughtException");
    });

    return server;
  } catch (err) {
    logger.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
