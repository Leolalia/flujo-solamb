import { ipcMain } from 'electron';

type StatusPayload = {
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

export function registerStatusReadonlyIPC(deps: {
  getOverallStatus: () => StatusPayload['overall'];
  getServicesStatus: () => StatusPayload['services'];
  getCounters: () => StatusPayload['counters'];
  getLastSnapshot: () => StatusPayload['lastSnapshot'];
  getLastSync: () => StatusPayload['lastSync'];
}) {
  ipcMain.handle('status:readonly:get', async (): Promise<StatusPayload> => {
    return {
      overall: deps.getOverallStatus(),
      services: deps.getServicesStatus(),
      counters: deps.getCounters(),
      lastSnapshot: deps.getLastSnapshot(),
      lastSync: deps.getLastSync()
    };
  });
}
