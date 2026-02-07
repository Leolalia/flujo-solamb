import sqlite3 from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.resolve(__dirname, '../../data/edge.db');

const db = new sqlite3(DB_PATH);

export function getSnapshotsDb() {
  return db;
}
