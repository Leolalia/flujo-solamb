import fetch from "node-fetch";
import { readAll, rewrite, OutboxItem } from "./store.js";
import { metrics } from "./metrics.js";

const ENDPOINT = process.env.OUTBOX_ENDPOINT || "http://localhost:9999/ingest";
const BASE_DELAY = Number(process.env.OUTBOX_BASE_DELAY_MS || 500);
const MAX_ATTEMPTS = Number(process.env.OUTBOX_MAX_ATTEMPTS || 10);

const now = () => Date.now();
const backoff = (a: number) => BASE_DELAY * Math.pow(2, a);

export async function runOnce() {
  const items = readAll();
  metrics.pending = items.filter(i => i.attempts < MAX_ATTEMPTS).length;

  let changed = false;

  for (const it of items) {
    if (it.attempts >= MAX_ATTEMPTS) continue;
    if (it.nextAttemptAt > now()) continue;

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": it.id
        },
        body: JSON.stringify(it.payload)
      });

      if (res.ok) {
        it.attempts = MAX_ATTEMPTS;
        metrics.processed++;
        changed = true;
      } else {
        it.attempts++;
        it.nextAttemptAt = now() + backoff(it.attempts);
        metrics.failed++;
        changed = true;
      }
    } catch {
      it.attempts++;
      it.nextAttemptAt = now() + backoff(it.attempts);
      metrics.failed++;
      changed = true;
    }
  }

  if (changed) rewrite(items);
}

export async function loop(intervalMs: number, stop: () => boolean) {
  while (!stop()) {
    await runOnce();
    await new Promise(r => setTimeout(r, intervalMs));
  }
}
