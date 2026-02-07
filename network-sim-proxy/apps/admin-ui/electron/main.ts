import { registerLedgerIpc } from './main/ledger/ledger.ipc';
import { app, BrowserWindow } from "electron";
import path from "path";
import { registerSnapshotIPC } from "./snapshots/snapshotIpc";
import { startSnapshotsLive } from "./snapshots/snapshotsLive";

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: true
    },
  });

  if (process.env.NODE_ENV !== "production") {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "index.html"));
  }

  startSnapshotsLive(mainWindow);
}

registerLedgerIpc();
app.whenReady().then(() => {
  registerSnapshotIPC();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});









//
// === AUTO_LEDGER_VERIFY (FASE 7) ===
// NO UI, NO DEVTOOLS, NO INTERACCION
//
import { LedgerStoreV1 } from './main/ledger/ledger.store';
import os from 'os';
import fs from 'fs';

const appName = 'smarttrack-admin-ui';

function getAppDataDir(appName: string): string {
  if (process.platform === 'win32') {
    return path.join(process.env.APPDATA || '', appName);
  }
  if (process.platform === 'darwin') {
    return path.join(os.homedir(), 'Library', 'Application Support', appName);
  }
  return path.join(process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config'), appName);
}

setTimeout(() => {
  try {
    const snapshotsDir = path.join(getAppDataDir(appName), 'snapshots');
    const ledger = new LedgerStoreV1({ appName, snapshotsDir });

    const sync = ledger.syncAppendMissing();
    const verify = ledger.verifyFull();

    const out = {
      at: new Date().toISOString(),
      sync,
      verify
    };

    const outPath = path.join(getAppDataDir(appName), 'ledger', 'verify.last.json');
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  } catch (e:any) {
    try {
      const errPath = path.join(getAppDataDir(appName), 'ledger', 'verify.error.json');
      fs.writeFileSync(errPath, JSON.stringify({ error: String(e) }, null, 2), 'utf8');
    } catch {}
  }
}, 1500);

