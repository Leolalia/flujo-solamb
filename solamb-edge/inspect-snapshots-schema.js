const Database = require('better-sqlite3');

const db = new Database('data/edge.db', { readonly: true });

const schema = db
  .prepare("PRAGMA table_info('snapshots')")
  .all();

console.log(schema);
