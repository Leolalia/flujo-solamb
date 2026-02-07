const Database = require('better-sqlite3');
const db = new Database('data/edge.db');

const rows = db
  .prepare("SELECT * FROM snapshots ORDER BY id DESC LIMIT 5")
  .all();

console.log(rows);
