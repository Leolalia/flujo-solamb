import { db } from "./db";

export interface EventFilter {
    edgeId?: string;
    kind?: string;
    hash?: string;
    outboxId?: string;
    fromReceivedAt?: string;
    toReceivedAt?: string;
    limit?: number;
    offset?: number;
}

export interface EventRow {
    outbox_id: string;
    ack_id: string;
    edge_id: string;
    kind: string;
    hash: string;
    prev_hash: string | null;
    canonical: string;
    payload_json: string;
    received_at: string;
}

export const eventQueryRepo = {
    find(filter: EventFilter): EventRow[] {
        let sql = `SELECT * FROM ingest_received WHERE 1=1`;
        const params: any[] = [];

        if (filter.edgeId) {
            sql += ` AND edge_id = ?`;
            params.push(filter.edgeId);
        }

        if (filter.kind) {
            sql += ` AND kind = ?`;
            params.push(filter.kind);
        }

        if (filter.hash) {
            sql += ` AND hash = ?`;
            params.push(filter.hash);
        }

        if (filter.outboxId) {
            sql += ` AND outbox_id = ?`;
            params.push(filter.outboxId);
        }

        if (filter.fromReceivedAt) {
            sql += ` AND received_at >= ?`;
            params.push(filter.fromReceivedAt);
        }

        if (filter.toReceivedAt) {
            sql += ` AND received_at <= ?`;
            params.push(filter.toReceivedAt);
        }

        sql += ` ORDER BY received_at DESC`;
        sql += ` LIMIT ? OFFSET ?`;

        params.push(filter.limit || 50);
        params.push(filter.offset || 0);

        return db.prepare(sql).all(...params) as EventRow[];
    },

    count(filter: EventFilter): number {
        let sql = `SELECT COUNT(*) as count FROM ingest_received WHERE 1=1`;
        const params: any[] = [];

        if (filter.edgeId) {
            sql += ` AND edge_id = ?`;
            params.push(filter.edgeId);
        }

        if (filter.kind) {
            sql += ` AND kind = ?`;
            params.push(filter.kind);
        }

        if (filter.hash) {
            sql += ` AND hash = ?`;
            params.push(filter.hash);
        }

        if (filter.outboxId) {
            sql += ` AND outbox_id = ?`;
            params.push(filter.outboxId);
        }

        if (filter.fromReceivedAt) {
            sql += ` AND received_at >= ?`;
            params.push(filter.fromReceivedAt);
        }

        if (filter.toReceivedAt) {
            sql += ` AND received_at <= ?`;
            params.push(filter.toReceivedAt);
        }

        const result = db.prepare(sql).get(...params) as { count: number };
        return result.count;
    },

    getByOutboxId(outboxId: string): EventRow | undefined {
        return db
            .prepare(`SELECT * FROM ingest_received WHERE outbox_id = ?`)
            .get(outboxId) as EventRow | undefined;
    },

    getByHash(hash: string): EventRow | undefined {
        return db
            .prepare(`SELECT * FROM ingest_received WHERE hash = ?`)
            .get(hash) as EventRow | undefined;
    }
};
