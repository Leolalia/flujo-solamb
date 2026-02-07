// src/infrastructure/legalLedgerRepo.ts

import Database from "better-sqlite3";
import type { LegalLedgerRecord } from "../core/legalLedger";

export type LegalLedgerRow = {
  hash: string;
  prev_hash: string | null;
  type: string;
  canonical_json: string;
  created_at: number;
};

export class LegalLedgerRepo {
  private db: any;

  constructor(dbPath: string) {
    this.db = new (Database as any)(dbPath);
    this.db.pragma("journal_mode = WAL");
    this.init();
  }

  private init(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS legal_ledger (
        hash TEXT PRIMARY KEY,
        prev_hash TEXT,
        type TEXT NOT NULL,
        canonical_json TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_legal_ledger_created_at
        ON legal_ledger(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_legal_ledger_prev_hash
        ON legal_ledger(prev_hash);
    `);
  }

  getLastHash(): string | null {
    const row = this.db
      .prepare(
        `
        SELECT hash
        FROM legal_ledger
        ORDER BY created_at DESC
        LIMIT 1
      `
      )
      .get();
    return row?.hash ?? null;
  }

  insert(record: LegalLedgerRecord): void {
    // Idempotent by PK hash
    this.db
      .prepare(
        `
        INSERT OR IGNORE INTO legal_ledger
          (hash, prev_hash, type, canonical_json, created_at)
        VALUES (?, ?, ?, ?, ?)
      `
      )
      .run(record.hash, record.prevHash, record.type, record.canonicalJson, record.createdAt);
  }

  recent(limit: number = 10): LegalLedgerRow[] {
    return this.db
      .prepare(
        `
        SELECT hash, prev_hash, type, canonical_json, created_at
        FROM legal_ledger
        ORDER BY created_at DESC
        LIMIT ?
      `
      )
      .all(limit) as LegalLedgerRow[];
  }
}
