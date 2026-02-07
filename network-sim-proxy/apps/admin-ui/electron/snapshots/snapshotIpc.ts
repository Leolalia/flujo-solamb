import { ipcMain } from "electron";
import { listSnapshots, readSnapshot } from "./snapshotIndexer";

export function registerSnapshotIPC() {
  ipcMain.handle("snapshots:list", () => listSnapshots());
  ipcMain.handle("snapshots:get", (_e, file: string) => readSnapshot(file));
}
