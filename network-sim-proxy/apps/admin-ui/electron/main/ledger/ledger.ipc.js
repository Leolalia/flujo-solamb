"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerLedgerIpc = registerLedgerIpc;
const electron_1 = require("electron");
const node_path_1 = __importDefault(require("node:path"));
const node_os_1 = __importDefault(require("node:os"));
const ledger_store_1 = require("./ledger.store");
function getAppDataSnapshotsDir(appName) {
    const home = node_os_1.default.homedir();
    if (process.platform === "win32") {
        const appData = process.env.APPDATA || node_path_1.default.join(home, "AppData", "Roaming");
        return node_path_1.default.join(appData, appName, "snapshots");
    }
    if (process.platform === "darwin")
        return node_path_1.default.join(home, "Library", "Application Support", appName, "snapshots");
    const xdg = process.env.XDG_CONFIG_HOME || node_path_1.default.join(home, ".config");
    return node_path_1.default.join(xdg, appName, "snapshots");
}
function registerLedgerIpc(opts) {
    const appName = opts?.appName || "smarttrack-admin-ui";
    const snapshotsDir = opts?.snapshotsDir || getAppDataSnapshotsDir(appName);
    const store = new ledger_store_1.LedgerStoreV1({ appName, snapshotsDir });
    electron_1.ipcMain.handle("ledger.status", async () => {
        return store.status();
    });
    electron_1.ipcMain.handle("ledger.sync", async () => {
        return store.syncAppendMissing();
    });
    electron_1.ipcMain.handle("ledger.verify", async () => {
        return store.verifyFull();
    });
    electron_1.ipcMain.handle("ledger.export", async (_evt, args) => {
        const format = args?.format === "json" ? "json" : "ndjson";
        return store.export(format);
    });
}
