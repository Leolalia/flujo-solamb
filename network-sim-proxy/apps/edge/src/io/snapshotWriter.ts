import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";
import { EdgeContext } from "../core/events.js";
import { writeLedger } from "./ledgerWriter.js";
import { enqueue } from "./outbox/store.js";

export function writeSnapshot(ctx: EdgeContext): string {
  const base = path.join(
    process.env.APPDATA || path.join(os.homedir(), ".config"),
    "smarttrack-admin-ui",
    "snapshots"
  );
  fs.mkdirSync(base, { recursive: true });

  const payload = {
    ts: Date.now(),
    state: ctx.state,
    data: ctx.data ?? null,
    lastEvent: ctx.lastEvent ?? null
  };

  const json = JSON.stringify(payload, null, 2);
  const hash = crypto.createHash("sha256").update(json).digest("hex");
  const file = path.join(base, `${payload.ts}_${hash}.json`);

  fs.writeFileSync(file, json);
  writeLedger(file, json);
  enqueue({ snapshotFile: file, snapshot: payload });

  return file;
}
