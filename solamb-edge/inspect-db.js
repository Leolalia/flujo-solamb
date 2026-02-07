const Database = require('better-sqlite3');

const db = new Database('data/edge.db', { readonly: true });

const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table'")
  .all();

console.log(tables);
