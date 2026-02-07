import express from "express";
import { ingestHandler } from "./ingest";
import { eventRoutes } from "./routes";
import { healthHandler } from "./health";
import { metricsHandler, metricsMiddleware } from "./metrics";

export function createServer() {
  const app = express();

  // ENV Config
  const TIMEOUT_MS = Number(process.env.HTTP_TIMEOUT_MS || 10000);
  const JSON_LIMIT = (process.env.JSON_LIMIT_MB || "10") + "mb";

  // 1. Global Timeout Middleware
  app.use((req, res, next) => {
    const timeoutId = setTimeout(() => {
      if (!res.headersSent) {
        res.status(503).json({ error: "timeout" });
      }
    }, TIMEOUT_MS);

    res.on("finish", () => clearTimeout(timeoutId));
    next();
  });

  // 2. Metrics Middleware
  app.use(metricsMiddleware);

  // 3. Payload Limit
  app.use(express.json({ limit: JSON_LIMIT }));

  // Routes
  app.get("/health", healthHandler);
  app.get("/metrics", metricsHandler);

  app.post("/v1/edge/ingest", ingestHandler);
  app.use(eventRoutes);

  return app;
}
