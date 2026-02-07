// src/infrastructure/weighingSnapshotRepo.ts

import Database from "better-sqlite3";
import { WeighingSnapshotEvent } from "./eventBus";

export class WeighingSnapshotRepo {
  private db: any;

  constructor(dbPath: string) {
    this.db = new (Database as any)(dbPath);
    this.db.pragma("journal_mode = WAL");
    this.init();
  }

  private init(): void {
    this.db
      .prepare(`
        CREATE TABLE IF NOT EXISTS weighing_snapshots (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          grossWeightKg INTEGER NOT NULL,
          stabilizedAt INTEGER NOT NULL,
          source TEXT NOT NULL,
          version INTEGER NOT NULL,
          createdAt INTEGER NOT NULL
        )
      `)
      .run();
  }

  insert(snapshot: WeighingSnapshotEvent): void {
    this.db
      .prepare(
        `
        INSERT INTO weighing_snapshots
          (grossWeightKg, stabilizedAt, source, version, createdAt)
        VALUES (?, ?, ?, ?, ?)
      `
      )
      .run(
        snapshot.grossWeightKg,
        snapshot.stabilizedAt,
        snapshot.source,
        snapshot.version,
        Date.now()
      );
  }

  listAll(): any[] {
    return this.db
      .prepare(`SELECT * FROM weighing_snapshots ORDER BY id ASC`)
      .all();
  }
}
