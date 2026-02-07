import test from "node:test";
import assert from "node:assert";
import { createServer } from "../src/server";
import { db } from "../src/db";
import { Server } from "http";

const TEST_PORT = 4001;
const BASE_URL = `http://localhost:${TEST_PORT}`;

// Helper to start/stop server
function startTestServer(): Promise<Server> {
    const app = createServer();
    return new Promise((resolve) => {
        const server = app.listen(TEST_PORT, () => resolve(server));
    });
}

test("Ingest Endpoint E2E", async (t) => {
    let server: Server;

    t.before(async () => {
        // Clean DB before tests
        db.exec("DELETE FROM ingest_received; DELETE FROM ingest_rejected;");
        server = await startTestServer();
    });

    t.after(() => {
        server.close();
    });

    await t.test("should accept a valid event and return ACK", async () => {
        const payload = {
            outboxId: "evt_test_001",
            edgeId: "SOLAMB_SITE_001",
            kind: "WeighingSnapshotCreated",
            canonical: "{\"some\":\"json\"}",
            hash: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4", // sha256 of canonical
            prevHash: null,
            occurredAt: new Date().toISOString(),
            payload: { some: "json" }
        };

        const res = await fetch(`${BASE_URL}/v1/edge/ingest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        assert.strictEqual(res.status, 200);
        const body = await res.json() as any;

        assert.strictEqual(body.status, "applied");
        assert.strictEqual(body.outboxId, payload.outboxId);
        assert.ok(body.ackId);
    });

    await t.test("should return duplicate for same outboxId", async () => {
        const payload = {
            outboxId: "evt_test_001",
            edgeId: "SOLAMB_SITE_001",
            kind: "WeighingSnapshotCreated",
            canonical: "{\"some\":\"json\"}",
            hash: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
            occurredAt: new Date().toISOString(),
            payload: { some: "json" }
        };

        const res = await fetch(`${BASE_URL}/v1/edge/ingest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        assert.strictEqual(res.status, 200);
        const body = await res.json() as any;

        assert.strictEqual(body.status, "duplicate");
        assert.strictEqual(body.outboxId, payload.outboxId);
    });

    await t.test("should reject hash mismatch", async () => {
        const payload = {
            outboxId: "evt_test_bad_hash",
            edgeId: "SOLAMB_SITE_001",
            kind: "WeighingSnapshotCreated",
            canonical: "{\"some\":\"json\"}",
            hash: "bad_hash",
            occurredAt: new Date().toISOString(),
            payload: { some: "json" }
        };

        const res = await fetch(`${BASE_URL}/v1/edge/ingest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        assert.strictEqual(res.status, 409);
    });
});
