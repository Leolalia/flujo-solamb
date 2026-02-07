import fs from "fs";
import path from "path";
import { BrowserWindow } from "electron";

const SNAP_DIR =
  process.env.SOLAMB_SNAP_DIR ||
  path.join(process.env.APPDATA || "", "smarttrack-admin-ui", "snapshots");

let watcherStarted = false;

export function startSnapshotsLive(win: BrowserWindow) {
  if (watcherStarted) return;
  watcherStarted = true;

  if (!fs.existsSync(SNAP_DIR)) return;

  fs.watch(SNAP_DIR, (_event, filename) => {
    if (!filename) return;
    if (!filename.startsWith("snap_") || !filename.endsWith(".json")) return;

    win.webContents.send("snapshots:live", {
      file: filename,
      timestamp: Date.now(),
    });
  });
}
