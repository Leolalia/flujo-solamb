import dotenv from "dotenv";
dotenv.config();

import { createServer } from "./server";

const port = Number(process.env.PORT || 4000);
const app = createServer();

const server = app.listen(port, () => {
  console.log(`[central] receiver listening on :${port}`);
});

function shutdown(signal: string) {
  console.log(`[central] ${signal} received. Closing server...`);
  server.close(() => {
    console.log("[central] Server closed.");
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

