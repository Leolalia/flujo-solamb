import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("snapshots", {
  list: () => ipcRenderer.invoke("snapshots:list"),
  get: (file: string) => ipcRenderer.invoke("snapshots:get", file),
  onLive: (cb: (data: any) => void) =>
    ipcRenderer.on("snapshots:live", (_e, data) => cb(data)),
});
