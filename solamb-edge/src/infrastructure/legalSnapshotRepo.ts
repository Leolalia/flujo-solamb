// src/infrastructure/legalSnapshotRepo.ts

import Database from "better-sqlite3";

export type LegalSnapshotRow = {
  hash: string;
  type: string;
  canonical_json: string;
  created_at: number;
};

export class LegalSnapshotRepo {
  private db: any;

  constructor(dbPath: string) {
    this.db = new (Database as any)(dbPath);
    this.db.pragma("journal_mode = WAL");
    this.init();
  }

  private init(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS legal_snapshots (
        hash TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        canonical_json TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_legal_snapshots_created_at
        ON legal_snapshots(created_at DESC);
    `);
  }

  insert(hash: string, type: string, canonicalJson: string, createdAt: number): void {
    // Idempotent: hash is PK
    this.db
      .prepare(`
        INSERT OR IGNORE INTO legal_snapshots (hash, type, canonical_json, created_at)
        VALUES (?, ?, ?, ?)
      `)
      .run(hash, type, canonicalJson, createdAt);
  }

  recent(limit: number = 10): LegalSnapshotRow[] {
    return this.db
      .prepare(
        `
        SELECT hash, type, canonical_json, created_at
        FROM legal_snapshots
        ORDER BY created_at DESC
        LIMIT ?
      `
      )
      .all(limit) as LegalSnapshotRow[];
  }
}
