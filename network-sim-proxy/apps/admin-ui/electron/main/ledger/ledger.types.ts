export type LedgerEntryV1 = {
  v: 1;
  id: string;                 // stable id (timestamp+filename)
  snapshotFile: string;       // snap_<ts>.json
  snapshotPath: string;       // absolute
  snapshotBytes: number;
  snapshotMtimeMs: number;

  snapshotSha256: string;     // sha256(bytes)
  prevHash: string | null;    // chain
  entryHash: string;          // sha256(canonical(entryWithoutEntryHash))
  atMs: number;               // write time (ms)
};

export type LedgerHead = {
  v: 1;
  headEntryHash: string | null;
  headSnapshotSha256: string | null;
  headSnapshotFile: string | null;
  entries: number;
  updatedAtMs: number;
};
