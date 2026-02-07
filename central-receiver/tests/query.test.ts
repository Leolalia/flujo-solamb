import test from "node:test";
import assert from "node:assert";
import { createServer } from "../src/server";
import { db } from "../src/db";
import { Server } from "http";

const TEST_PORT = 4002;
const BASE_URL = `http://localhost:${TEST_PORT}`;

function startTestServer(): Promise<Server> {
    const app = createServer();
    return new Promise((resolve) => {
        const server = app.listen(TEST_PORT, () => resolve(server));
    });
}

test("Query API E2E", async (t) => {
    let server: Server;
    const now = new Date().toISOString();

    t.before(async () => {
        db.exec("DELETE FROM ingest_received; DELETE FROM ingest_rejected;");

        // Seed data
        const stmt = db.prepare(`
      INSERT INTO ingest_received (outbox_id, ack_id, edge_id, kind, hash, prev_hash, canonical, payload_json, received_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        stmt.run("evt_1", "ack_1", "EDGE_A", "TypeA", "hash_1", null, "{}", "{}", "2023-01-01T10:00:00.000Z");
        stmt.run("evt_2", "ack_2", "EDGE_A", "TypeB", "hash_2", "hash_1", "{}", "{}", "2023-01-01T11:00:00.000Z");
        stmt.run("evt_3", "ack_3", "EDGE_B", "TypeA", "hash_3", null, "{}", "{}", "2023-01-01T12:00:00.000Z");

        server = await startTestServer();
    });

    t.after(() => {
        server.close();
    });

    await t.test("GET /v1/events should list all events", async () => {
        const res = await fetch(`${BASE_URL}/v1/events`);
        const body = await res.json() as any;
        assert.strictEqual(res.status, 200);
        assert.strictEqual(body.data.length, 3);
        assert.strictEqual(body.meta.total, 3);
    });

    await t.test("GET /v1/events should filter by edgeId", async () => {
        const res = await fetch(`${BASE_URL}/v1/events?edgeId=EDGE_A`);
        const body = await res.json() as any;
        assert.strictEqual(body.data.length, 2);
        assert.strictEqual(body.data[0].edge_id, "EDGE_A");
    });

    await t.test("GET /v1/events should filter by kind", async () => {
        const res = await fetch(`${BASE_URL}/v1/events?kind=TypeB`);
        const body = await res.json() as any;
        assert.strictEqual(body.data.length, 1);
        assert.strictEqual(body.data[0].kind, "TypeB");
    });

    await t.test("GET /v1/events should filter by time range", async () => {
        const res = await fetch(`${BASE_URL}/v1/events?fromReceivedAt=2023-01-01T10:30:00Z&toReceivedAt=2023-01-01T11:30:00Z`);
        const body = await res.json() as any;
        assert.strictEqual(body.data.length, 1);
        assert.strictEqual(body.data[0].outbox_id, "evt_2");
    });

    await t.test("GET /v1/events/:outboxId should return single event", async () => {
        const res = await fetch(`${BASE_URL}/v1/events/evt_3`);
        const body = await res.json() as any;
        assert.strictEqual(res.status, 200);
        assert.strictEqual(body.outbox_id, "evt_3");
    });

    await t.test("GET /v1/events/hash/:hash should return single event", async () => {
        const res = await fetch(`${BASE_URL}/v1/events/hash/hash_2`);
        const body = await res.json() as any;
        assert.strictEqual(res.status, 200);
        assert.strictEqual(body.hash, "hash_2");
    });

    await t.test("GET /v1/events/:outboxId should 404", async () => {
        const res = await fetch(`${BASE_URL}/v1/events/missing`);
        assert.strictEqual(res.status, 404);
    });
});
