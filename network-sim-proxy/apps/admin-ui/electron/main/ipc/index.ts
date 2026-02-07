import { registerStatusReadonlyIPC } from './status.readonly';

export function registerIPC(deps: {
  status: {
    getOverallStatus: () => 'OK' | 'WARN' | 'ERROR';
    getServicesStatus: () => {
      core: 'OK' | 'WARN' | 'ERROR';
      replication: 'OK' | 'WARN' | 'ERROR';
      outbox: 'OK' | 'WARN' | 'ERROR';
      storage: 'OK' | 'WARN' | 'ERROR';
    };
    getCounters: () => {
      eventsToday: number;
      snapshotsToday: number;
      outboxPending: number;
    };
    getLastSnapshot: () => {
      id: string;
      timestamp: number;
      hash: string;
    } | null;
    getLastSync: () => {
      status: 'IDLE' | 'RUNNING' | 'ERROR';
      timestamp: number | null;
      retryCount: number;
    };
  };
}) {
  registerStatusReadonlyIPC({
    getOverallStatus: deps.status.getOverallStatus,
    getServicesStatus: deps.status.getServicesStatus,
    getCounters: deps.status.getCounters,
    getLastSnapshot: deps.status.getLastSnapshot,
    getLastSync: deps.status.getLastSync
  });
}
