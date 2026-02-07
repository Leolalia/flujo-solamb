export {};

declare global {
  interface SnapshotMeta {
    file: string;
    timestamp: number;
    size: number;
  }

  interface Window {
    snapshots: {
      list(): Promise<SnapshotMeta[]>;
      get(file: string): Promise<any>;
    };
  }
}
