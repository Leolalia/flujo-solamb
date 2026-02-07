import { loop } from "../io/outbox/worker.js";
import { metrics } from "../io/outbox/metrics.js";
import { acquireLock, releaseLock } from "../io/outbox/lock.js";

const INTERVAL = Number(process.env.OUTBOX_LOOP_MS || 1000);
let stopping = false;

if (!acquireLock()) {
  console.error("WORKER already running. Exit.");
  process.exit(1);
}

process.on("SIGINT", () => stopping = true);
process.on("SIGTERM", () => stopping = true);
process.on("exit", () => releaseLock());

(async () => {
  console.log("OUTBOX WORKER STARTED");
  await loop(INTERVAL, () => stopping);
  console.log("OUTBOX WORKER STOPPED", metrics);
  process.exit(0);
})();
