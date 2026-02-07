import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { computeHash } from "./hash";
import { IngestPayload, AckResponse } from "./types";

export function ingestHandler(req: Request, res: Response) {
  const body = req.body as IngestPayload;
  const now = new Date().toISOString();

  if (!body || !body.outboxId || !body.canonical || !body.hash) {
    db.prepare(
      `INSERT INTO ingest_rejected (outbox_id, reason_code, details, received_at)
       VALUES (?, ?, ?, ?)`
    ).run(body?.outboxId ?? null, "INVALID_PAYLOAD", null, now);

    return res.status(422).json({ error: "invalid_payload" });
  }

  const existing = db
    .prepare(`SELECT outbox_id FROM ingest_received WHERE outbox_id = ?`)
    .get(body.outboxId);

  if (existing) {
    const ack: AckResponse = {
      status: "duplicate",
      ackId: uuidv4(),
      outboxId: body.outboxId,
      serverTime: now
    };
    return res.status(200).json(ack);
  }

  const recomputed = computeHash(body.canonical);
  if (recomputed !== body.hash) {
    db.prepare(
      `INSERT INTO ingest_rejected (outbox_id, reason_code, details, received_at)
       VALUES (?, ?, ?, ?)`
    ).run(body.outboxId, "HASH_MISMATCH", null, now);

    return res.status(409).json({ error: "hash_mismatch" });
  }

  const ackId = uuidv4();

  db.prepare(
    `INSERT INTO ingest_received
     (outbox_id, ack_id, edge_id, kind, hash, prev_hash, canonical, payload_json, received_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    body.outboxId,
    ackId,
    body.edgeId,
    body.kind,
    body.hash,
    body.prevHash ?? null,
    body.canonical,
    JSON.stringify(body.payload),
    now
  );

  const ack: AckResponse = {
    status: "applied",
    ackId,
    outboxId: body.outboxId,
    serverTime: now
  };

  return res.status(200).json(ack);
}
