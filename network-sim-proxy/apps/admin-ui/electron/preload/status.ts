import { contextBridge, ipcRenderer } from 'electron';

export type StatusPayload = {
  overall: 'OK' | 'WARN' | 'ERROR';
  services: {
    core: 'OK' | 'WARN' | 'ERROR';
    replication: 'OK' | 'WARN' | 'ERROR';
    outbox: 'OK' | 'WARN' | 'ERROR';
    storage: 'OK' | 'WARN' | 'ERROR';
  };
  counters: {
    eventsToday: number;
    snapshotsToday: number;
    outboxPending: number;
  };
  lastSnapshot: {
    id: string;
    timestamp: number;
    hash: string;
  } | null;
  lastSync: {
    status: 'IDLE' | 'RUNNING' | 'ERROR';
    timestamp: number | null;
    retryCount: number;
  };
};

contextBridge.exposeInMainWorld('statusReadonly', {
  get: (): Promise<StatusPayload> => ipcRenderer.invoke('status:readonly:get')
});
