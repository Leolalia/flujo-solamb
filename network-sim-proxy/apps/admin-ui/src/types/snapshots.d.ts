export type SnapshotMeta = {
  file: string;
  timestamp: number;
  size: number;
};

declare global {
  interface Window {
    snapshots?: {
      list(): Promise<SnapshotMeta[]>;
      get(file: string): Promise<unknown>;
    };
  }
}

export {};
