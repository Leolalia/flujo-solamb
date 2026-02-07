/* ============================================================
   NETWORK-SIM-PROXY — EDGE ENTRYPOINT
   DEV SNAPSHOT WRITER (SAFE / READ-ONLY FOR UI)
   ============================================================ */

import fs from 'fs';
import path from 'path';
import os from 'os';

// ============================================================
// CONFIG
// ============================================================

const IS_DEV = process.env.NODE_ENV !== 'production';

const APP_NAME = 'smarttrack-admin-ui';

const SNAPSHOT_DIR = path.join(
  os.homedir(),
  'AppData',
  'Roaming',
  APP_NAME,
  'snapshots'
);

// ============================================================
// DEV SNAPSHOT (ONE SHOT, SAFE)
// ============================================================

function devWriteSnapshotOnce() {
  if (!IS_DEV) return;

  try {
    if (!fs.existsSync(SNAPSHOT_DIR)) {
      fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
    }

    const snapshot = {
      id: `dev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      source: 'EDGE',
      mode: 'DEV_READ_ONLY',
      note: 'DEV SNAPSHOT — UI READ ONLY TEST',
      services: {
        core: 'OK',
        replication: 'WARN',
        outbox: 'OK',
        storage: 'OK'
      }
    };

    const fileName = `snap_${Date.now()}.json`;
    const filePath = path.join(SNAPSHOT_DIR, fileName);

    fs.writeFileSync(
      filePath,
      JSON.stringify(snapshot, null, 2),
      'utf8'
    );

    console.log('[DEV] Snapshot generado:', filePath);
  } catch (err) {
    console.error('[DEV] Error generando snapshot:', err);
  }
}

// ============================================================
// EDGE BOOT
// ============================================================

function bootEdge() {
  console.log('[EDGE] Boot iniciado');

  // 🔒 DEV ONLY — no toca state machine ni ledger
  devWriteSnapshotOnce();

  console.log('[EDGE] Sistema listo');
}

// ============================================================
// START
// ============================================================

bootEdge();
