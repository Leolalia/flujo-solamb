PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS ingest_received (
  outbox_id TEXT PRIMARY KEY,
  ack_id TEXT NOT NULL,
  edge_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  hash TEXT NOT NULL,
  prev_hash TEXT,
  canonical TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  received_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ingest_rejected (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  outbox_id TEXT,
  reason_code TEXT NOT NULL,
  details TEXT,
  received_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_received_edge_id ON ingest_received(edge_id);
CREATE INDEX IF NOT EXISTS idx_received_kind ON ingest_received(kind);
CREATE INDEX IF NOT EXISTS idx_received_hash ON ingest_received(hash);
CREATE INDEX IF NOT EXISTS idx_received_received_at ON ingest_received(received_at);

