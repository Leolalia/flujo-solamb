import http from "http";
import fs from "fs";
import path from "path";
import os from "os";

let ctx = { state: "IDLE" };

const SNAP_DIR = path.join(
  process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming"),
  "smarttrack-admin-ui",
  "snapshots"
);

const server = http.createServer((req, res) => {
  // HEALTH
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, state: ctx.state, ts: Date.now() }));
    return;
  }

  // STATUS
  if (req.method === "GET" && req.url === "/status") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ state: ctx.state }));
    return;
  }

  // SNAPSHOTS LIST
  if (req.method === "GET" && req.url === "/snapshots") {
    try {
      if (!fs.existsSync(SNAP_DIR)) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ list: [] }));
        return;
      }

      const files = fs.readdirSync(SNAP_DIR)
        .filter(f => f.endsWith(".json"))
        .sort()
        .reverse();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ list: files }));
    } catch (e) {
      res.writeHead(500);
      res.end("SNAPSHOT_READ_ERROR");
    }
    return;
  }

  // GET SINGLE SNAPSHOT CONTENT
  // Expected format: /snapshots/snap_123456.json
  if (req.method === "GET" && req.url?.startsWith("/snapshots/")) {
    const snapName = req.url.split("/")[2]; // /snapshots/:name
    if (!snapName || !snapName.endsWith(".json")) {
      res.writeHead(400);
      res.end("BAD_NAME");
      return;
    }

    const filePath = path.join(SNAP_DIR, path.basename(snapName)); // Prevent traversal

    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end("NOT_FOUND");
      return;
    }

    try {
      const content = fs.readFileSync(filePath, "utf-8");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(content);
    } catch (e) {
      res.writeHead(500);
      res.end("READ_ERROR");
    }
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(7788, () => {
  console.log("EDGE HTTP listening on :7788");
});
