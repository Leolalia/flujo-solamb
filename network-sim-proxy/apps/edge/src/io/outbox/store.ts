import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";

export interface OutboxItem {
  id: string;
  ts: number;
  payload: any;
  attempts: number;
  nextAttemptAt: number;
}

const base = path.join(
  process.env.APPDATA || path.join(os.homedir(), ".config"),
  "smarttrack-admin-ui",
  "outbox"
);
const file = path.join(base, "edge-outbox.jsonl");
fs.mkdirSync(base, { recursive: true });

export function enqueue(payload: any): OutboxItem {
  const item: OutboxItem = {
    id: crypto.randomUUID(),
    ts: Date.now(),
    payload,
    attempts: 0,
    nextAttemptAt: Date.now()
  };
  fs.appendFileSync(file, JSON.stringify(item) + "\n");
  return item;
}

export function readAll(): OutboxItem[] {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map(l => JSON.parse(l));
}

export function rewrite(items: OutboxItem[]) {
  fs.writeFileSync(file, items.map(i => JSON.stringify(i)).join("\n") + (items.length ? "\n" : ""));
}

export const OUTBOX_FILE = file;
