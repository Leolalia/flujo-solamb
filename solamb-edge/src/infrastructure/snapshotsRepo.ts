import { getSnapshotsDb } from './dbAdapterSnapshots';
import { evaluateBaseline } from '../baseline/baselineEngine';

type SnapshotInput = {
  type: string;
  source: string;
  ts: number;
};

export function saveSnapshot(snapshot: SnapshotInput) {
  const db = getSnapshotsDb();

  const recent = db
    .prepare('SELECT type FROM snapshots ORDER BY id DESC LIMIT 5')
    .all() as { type: string }[];

  const baseline = evaluateBaseline(snapshot, recent);
  const anomaly = baseline.status === 'WARN' ? 1 : 0;

  db.prepare(
    'INSERT INTO snapshots (type, source, ts, anomaly) VALUES (?, ?, ?, ?)'
  ).run(snapshot.type, snapshot.source, snapshot.ts, anomaly);

  return { anomaly, baseline };
}

export function listSnapshots() {
  const db = getSnapshotsDb();
  return db.prepare('SELECT * FROM snapshots ORDER BY id DESC').all();
}
