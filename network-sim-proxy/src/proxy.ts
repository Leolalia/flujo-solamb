import express from "express";
import fetch from "node-fetch";

export function createProxy() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));

  const upstream = process.env.UPSTREAM_URL || "http://localhost:4000";
  const failRate = Number(process.env.FAIL_RATE || 0);
  const dropRate = Number(process.env.DROP_RATE || 0);
  const maxDelay = Number(process.env.MAX_DELAY_MS || 0);

  app.all("*", async (req, res) => {
    const r = Math.random();

    if (r < dropRate) {
      return;
    }

    if (r < dropRate + failRate) {
      return res.status(503).json({ error: "simulated_network_failure" });
    }

    if (maxDelay > 0) {
      const delay = Math.floor(Math.random() * maxDelay);
      await new Promise((r) => setTimeout(r, delay));
    }

    const url = upstream + req.originalUrl;

    const upstreamRes = await fetch(url, {
      method: req.method,
      headers: { "content-type": "application/json" },
      body: ["GET", "HEAD"].includes(req.method)
        ? undefined
        : JSON.stringify(req.body)
    });

    const text = await upstreamRes.text();
    res.status(upstreamRes.status).send(text);
  });

  return app;
}
