
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

// Local First: Ensure we are using the local file
const DB_PATH = path.resolve(__dirname, '../../data/edge.db');

export class DatabaseService {
    private db: Database | null = null;

    async initialize(): Promise<void> {
        console.log(`[DB] Initializing SQLite at ${DB_PATH}`);

        this.db = await open({
            filename: DB_PATH,
            driver: sqlite3.Database
        });

        await this.db.exec('PRAGMA journal_mode = WAL;');
        await this.migrate();
        console.log('[DB] Ready.');
    }

    private async migrate(): Promise<void> {
        // Phase 8: Minimal Schema
        await this.db?.exec(`
            CREATE TABLE IF NOT EXISTS events (
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                payload TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                source TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS visits (
                id TEXT PRIMARY KEY,
                state TEXT NOT NULL,
                plate TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
        `);
    }

    async insertEvent(event: any): Promise<void> {
        await this.db?.run(
            `INSERT INTO events (id, type, payload, timestamp, source) VALUES (?, ?, ?, ?, ?)`,
            event.id,
            event.type,
            JSON.stringify(event.payload),
            event.timestamp,
            event.source
        );
    }

    async getVisit(visitId: string): Promise<any> {
        return await this.db?.get('SELECT * FROM visits WHERE id = ?', visitId);
    }

    async saveVisit(visit: { id: string, state: string, plate: string, updated_at: string }): Promise<void> {
        await this.db?.run(
            `INSERT OR REPLACE INTO visits (id, state, plate, updated_at) VALUES (?, ?, ?, ?)`,
            visit.id,
            visit.state,
            visit.plate,
            visit.updated_at
        );
    }
}

export const dbService = new DatabaseService();
