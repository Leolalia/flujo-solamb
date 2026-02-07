// src/infrastructure/replicationQueue.ts

import Database from "better-sqlite3";

export type OutboxStatus = "PENDING" | "SENDING" | "SENT" | "FAILED";

export interface OutboxItem {
  event_id: string;
  type: string;
  payload: string; // JSON
  status: OutboxStatus;
  attempt_count: number;
  last_attempt_at: number | null;
  next_attempt_at: number;
  last_error: string | null;
}

export class ReplicationQueue {
  private db: any;

  constructor(dbPath: string) {
    this.db = new (Database as any)(dbPath);
    this.db.pragma("journal_mode = WAL");
    this.init();
  }

  private init(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS replication_outbox (
        event_id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        payload TEXT NOT NULL,
        status TEXT NOT NULL,
        attempt_count INTEGER DEFAULT 0,
        last_attempt_at INTEGER,
        next_attempt_at INTEGER DEFAULT 0,
        last_error TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_outbox_status_next
        ON replication_outbox(status, next_attempt_at);
    `);
  }

  enqueue(type: string, payload: any): void {
    // Idempotence requires deterministic ID
    const id = payload?.id;
    if (!id) {
      console.error("[REPLICATION] Cannot enqueue event without deterministic id:", payload);
      return;
    }

    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO replication_outbox
        (event_id, type, payload, status, next_attempt_at)
      VALUES (?, ?, ?, 'PENDING', ?)
    `);

    const info = stmt.run(id, type, JSON.stringify(payload), Date.now());

    if (info.changes > 0) {
      console.log(`[REPLICATION][ENQUEUE] ${type} ${id}`);
    } else {
      console.log(`[REPLICATION][DEDUPE] Skipping ${id}`);
    }
  }

  process(simulateFailure: boolean = false): void {
    const now = Date.now();

    const pendingStmt = this.db.prepare(`
      SELECT * FROM replication_outbox
      WHERE status IN ('PENDING', 'FAILED')
        AND next_attempt_at <= ?
      ORDER BY next_attempt_at ASC
      LIMIT 10
    `);

    const items = pendingStmt.all(now) as OutboxItem[];

    if (items.length === 0) {
      console.log("[REPLICATION] No items ready to send.");
      return;
    }

    const updateStatusStmt = this.db.prepare(`
      UPDATE replication_outbox SET status = ? WHERE event_id = ?
    `);

    const successStmt = this.db.prepare(`
      UPDATE replication_outbox
      SET status = 'SENT',
          last_attempt_at = ?,
          attempt_count = attempt_count + 1,
          last_error = NULL
      WHERE event_id = ?
    `);

    const failureStmt = this.db.prepare(`
      UPDATE replication_outbox
      SET status = 'FAILED',
          last_attempt_at = ?,
          attempt_count = attempt_count + 1,
          next_attempt_at = ?,
          last_error = ?
      WHERE event_id = ?
    `);

    for (const item of items) {
      console.log(`[REPLICATION][SENDING] ${item.event_id} (Attempt ${item.attempt_count + 1})`);
      updateStatusStmt.run("SENDING", item.event_id);

      try {
        if (simulateFailure) {
          throw new Error("Simulated Network Error");
        }

        // --- SEND (SIMULATED) ---
        // Central delivery would go here (HTTP/IPC). Not implemented in this stage.

        successStmt.run(Date.now(), item.event_id);
        console.log(`[REPLICATION][SENT] ${item.event_id}`);
      } catch (err: any) {
        const nextTry = Date.now() + this.calculateBackoff(item.attempt_count + 1);
        const msg = String(err?.message || err || "Unknown error");
        failureStmt.run(Date.now(), nextTry, msg, item.event_id);
        console.error(`[REPLICATION][FAILED] ${item.event_id} -> Retry at ${new Date(nextTry).toISOString()}`);
      }
    }
  }

  getStatus(): any[] {
    return this.db
      .prepare(`
        SELECT event_id, type, status, attempt_count, last_attempt_at, next_attempt_at, last_error
        FROM replication_outbox
        ORDER BY next_attempt_at ASC
      `)
      .all();
  }

  private calculateBackoff(attempts: number): number {
    // Exponential backoff: 2s, 4s, 8s, ... max 60s
    return Math.min(2000 * Math.pow(2, attempts - 1), 60000);
  }
}
