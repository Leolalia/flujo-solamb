import fs from "fs";
import path from "path";

export type SnapshotMeta = {
  file: string;
  timestamp: number;
  size: number;
};

const SNAP_DIR =
  process.env.SOLAMB_SNAP_DIR ||
  path.join(process.env.APPDATA || "", "smarttrack-admin-ui", "snapshots");

export function listSnapshots(): SnapshotMeta[] {
  if (!fs.existsSync(SNAP_DIR)) return [];
  return fs.readdirSync(SNAP_DIR)
    .filter(f => f.startsWith("snap_") && f.endsWith(".json"))
    .map(f => {
      const p = path.join(SNAP_DIR, f);
      const stat = fs.statSync(p);
      const ts = Number(f.replace("snap_", "").replace(".json", ""));
      return { file: f, timestamp: ts, size: stat.size };
    })
    .sort((a, b) => b.timestamp - a.timestamp);
}

export function readSnapshot(file: string): string {
  const p = path.join(SNAP_DIR, file);
  if (!p.startsWith(SNAP_DIR)) throw new Error("INVALID_PATH");
  return fs.readFileSync(p, "utf-8");
}
