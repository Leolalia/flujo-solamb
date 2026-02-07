import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbPath = process.env.DB_PATH || "./central.db";

export const db = new Database(dbPath);

const schemaPath = path.join(process.cwd(), "src", "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf-8");

db.exec(schema);

export {};
