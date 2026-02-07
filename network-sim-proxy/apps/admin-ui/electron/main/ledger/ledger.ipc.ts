import { ipcMain } from "electron";
import path from "node:path";
import os from "node:os";
import { LedgerStoreV1 } from './ledger.store';

function getAppDataSnapshotsDir(appName: string): string {
  const home = os.homedir();
  if (process.platform === "win32") {
    const appData = process.env.APPDATA || path.join(home, "AppData", "Roaming");
    return path.join(appData, appName, "snapshots");
  }
  if (process.platform === "darwin") return path.join(home, "Library", "Application Support", appName, "snapshots");
  const xdg = process.env.XDG_CONFIG_HOME || path.join(home, ".config");
  return path.join(xdg, appName, "snapshots");
}

export function registerLedgerIpc(opts?: { appName?: string; snapshotsDir?: string }) {
  const appName = opts?.appName || "smarttrack-admin-ui";
  const snapshotsDir = opts?.snapshotsDir || getAppDataSnapshotsDir(appName);

  const store = new LedgerStoreV1({ appName, snapshotsDir });

  ipcMain.handle("ledger.status", async () => {
    return store.status();
  });

  ipcMain.handle("ledger.sync", async () => {
    return store.syncAppendMissing();
  });

  ipcMain.handle("ledger.verify", async () => {
    return store.verifyFull();
  });

  ipcMain.handle("ledger.export", async (_evt, args: { format: "ndjson" | "json" }) => {
    const format = args?.format === "json" ? "json" : "ndjson";
    return store.export(format);
  });
}



