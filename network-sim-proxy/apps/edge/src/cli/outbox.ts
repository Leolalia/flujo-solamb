import { runOnce } from "../io/outbox/worker.js";

await runOnce();
console.log("OUTBOX WORKER RUN OK");
