const Database = require('better-sqlite3');

const db = new Database('data/edge.db', { readonly: true });

const rows = db
  .prepare('SELECT * FROM snapshots ORDER BY created_at DESC LIMIT 10')
  .all();

console.log({
  count: rows.length,
  rows
});
