import fs from "fs";
import path from "path";
import os from "os";

const base = path.join(
  process.env.APPDATA || path.join(os.homedir(), ".config"),
  "smarttrack-admin-ui",
  "locks"
);
fs.mkdirSync(base, { recursive: true });

const LOCK = path.join(base, "edge-worker.lock");

export function acquireLock(): boolean {
  try {
    fs.writeFileSync(LOCK, process.pid.toString(), { flag: "wx" });
    return true;
  } catch {
    return false;
  }
}

export function releaseLock() {
  try { fs.unlinkSync(LOCK); } catch {}
}
