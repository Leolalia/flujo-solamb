import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";

interface LedgerEntry {
  ts: number;
  snapshotFile: string;
  snapshotHash: string;
  prevHash: string | null;
  hash: string;
}

export function writeLedger(snapshotFile: string, snapshotJson: string) {
  const base = path.join(
    process.env.APPDATA || path.join(os.homedir(), ".config"),
    "smarttrack-admin-ui",
    "ledger"
  );
  fs.mkdirSync(base, { recursive: true });

  const ledgerPath = path.join(base, "edge-ledger.jsonl");

  const snapshotHash = crypto.createHash("sha256").update(snapshotJson).digest("hex");

  let prevHash: string | null = null;
  if (fs.existsSync(ledgerPath)) {
    const last = fs.readFileSync(ledgerPath, "utf8").trim().split("\n").pop();
    if (last) prevHash = JSON.parse(last).hash;
  }

  const entryBase = {
    ts: Date.now(),
    snapshotFile,
    snapshotHash,
    prevHash
  };

  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(entryBase))
    .digest("hex");

  const entry: LedgerEntry = { ...entryBase, hash };

  fs.appendFileSync(ledgerPath, JSON.stringify(entry) + "\n");
}
