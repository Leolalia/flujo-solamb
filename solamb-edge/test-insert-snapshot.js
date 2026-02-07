const Database = require('better-sqlite3');

const db = new Database('data/edge.db');

const stmt = db.prepare(`
  INSERT INTO snapshots (type, source, ts, anomaly)
  VALUES (?, ?, ?, ?)
`);

const info = stmt.run(
  'TEST_MANUAL',
  'diagnostic',
  Date.now(),
  0
);

console.log(info);
