# === FASE 6.1.7 — Snapshots LIVE (READ-ONLY) ===

$base = "src/admin"
$views = "$base/views"
$providers = "$base/providers"

# Asegurar carpetas
New-Item -ItemType Directory -Force -Path $views | Out-Null
New-Item -ItemType Directory -Force -Path $providers | Out-Null

# -------------------------------
# Provider: snapshots LIVE
# -------------------------------
$providerContent = @"
import fs from 'fs';
import path from 'path';

export type SnapshotItem = {
  id: string;
  file: string;
  size: number;
  mtime: string;
};

const SNAP_DIR = (() => {
  try {
    const { ipcRenderer } = window as any;
    if (ipcRenderer?.invoke) {
      return null;
    }
  } catch {}
  return null;
})();

export async function getSnapshotsLive(): Promise<SnapshotItem[]> {
  try {
    const base =
      (window as any)?.__ADMIN_SNAPSHOT_DIR ||
      null;

    if (!base) throw new Error('SNAPSHOT_DIR_UNAVAILABLE');

    const files = fs
      .readdirSync(base)
      .filter(f => f.startsWith('snap_'));

    return files.map(f => {
      const p = path.join(base, f);
      const st = fs.statSync(p);
      return {
        id: f,
        file: f,
        size: st.size,
        mtime: st.mtime.toISOString()
      };
    });
  } catch {
    throw new Error('SNAPSHOTS_LIVE_UNAVAILABLE');
  }
}
"@

Set-Content "$providers/snapshotsLiveProvider.ts" $providerContent

# -------------------------------
# View: Snapshots LIVE
# -------------------------------
$viewContent = @"
import React, { useEffect, useState } from 'react';
import { getSnapshotsLive, SnapshotItem } from '../providers/snapshotsLiveProvider';

export default function SnapshotsView() {
  const [items, setItems] = useState<SnapshotItem[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getSnapshotsLive()
      .then(setItems)
      .catch(e => setErr(e.message));
  }, []);

  return (
    <div>
      <h2>Snapshots (LIVE)</h2>
      {err && <div style={{ color: 'red' }}>Error: {err}</div>}
      <ul>
        {items.map(s => (
          <li key={s.id}>
            {s.file} — {(s.size / 1024 / 1024).toFixed(2)} MB — {s.mtime}
          </li>
        ))}
      </ul>
    </div>
  );
}
"@

Set-Content "$views/SnapshotsView.tsx" $viewContent

Write-Host "FASE 6.1.7 creada correctamente."
