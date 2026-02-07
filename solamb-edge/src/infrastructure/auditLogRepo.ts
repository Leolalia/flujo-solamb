// src/infrastructure/auditLogRepo.ts

import Database from "better-sqlite3";

export type AuditRow = {
  id: number;
  event_type: string;
  entity_id: string;
  hash: string;
  actor: string;
  created_at: number;
};

export class AuditLogRepo {
  private db: any;

  constructor(dbPath: string) {
    this.db = new (Database as any)(dbPath);
    this.db.pragma("journal_mode = WAL");
    this.init();
  }

  private init(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS audit_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        hash TEXT NOT NULL,
        actor TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_audit_created_at
        ON audit_log(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_audit_entity
        ON audit_log(entity_id, created_at DESC);
    `);
  }

  append(eventType: string, entityId: string, hash: string, actor: string, createdAt: number): void {
    this.db
      .prepare(
        `
        INSERT INTO audit_log (event_type, entity_id, hash, actor, created_at)
        VALUES (?, ?, ?, ?, ?)
      `
      )
      .run(eventType, entityId, hash, actor, createdAt);
  }

  recent(limit: number = 20): AuditRow[] {
    return this.db
      .prepare(
        `
        SELECT id, event_type, entity_id, hash, actor, created_at
        FROM audit_log
        ORDER BY created_at DESC
        LIMIT ?
      `
      )
      .all(limit) as AuditRow[];
  }
}
