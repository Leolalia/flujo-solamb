
import { dbService } from './src/infrastructure/database';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

async function verify() {
    const dbPath = path.resolve(__dirname, 'data/edge.db');
    console.log(`Checking DB at ${dbPath}`);

    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    const events = await db.all('SELECT * FROM events');
    console.log('--- EVENTS ---');
    console.log(JSON.stringify(events, null, 2));

    const visits = await db.all('SELECT * FROM visits');
    console.log('--- VISITS ---');
    console.log(JSON.stringify(visits, null, 2));
}

verify().catch(console.error);
