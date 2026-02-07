# ============================================================
# FASE 6.1.6 — Diagnóstico de Red / Sync (READ-ONLY)
# ============================================================

$base = "src/admin"

$dirs = @(
  "$base/hooks",
  "$base/views"
)

foreach ($d in $dirs) {
  if (!(Test-Path $d)) {
    New-Item -ItemType Directory -Path $d | Out-Null
  }
}

@'
import { useEffect, useState } from "react";

export type NetworkDiag = {
  online: boolean;
  lastPingMs: number;
  lastSyncTs: number | null;
  retries: number;
  outboxPending: number;
};

const FAKE: NetworkDiag = {
  online: true,
  lastPingMs: 120,
  lastSyncTs: Date.now() - 180000,
  retries: 0,
  outboxPending: 3
};

export function useNetworkDiag(pollMs = 5000) {
  const [data, setData] = useState<NetworkDiag | null>(null);

  useEffect(() => {
    setData(FAKE);
    const id = setInterval(() => setData(FAKE), pollMs);
    return () => clearInterval(id);
  }, [pollMs]);

  return { data };
}
'@ | Set-Content "$base/hooks/useNetworkDiag.ts"

@'
import { FC } from "react";
import { useNetworkDiag } from "../hooks/useNetworkDiag";

export const NetworkDiagView: FC = () => {
  const { data } = useNetworkDiag(5000);

  if (!data) return <div>Cargando diagnóstico…</div>;

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Diagnóstico de Red / Sync</h3>
      <ul>
        <li>Online: {data.online ? "Sí" : "No"}</li>
        <li>Ping: {data.lastPingMs} ms</li>
        <li>Último Sync: {data.lastSyncTs ? new Date(data.lastSyncTs).toISOString() : "Nunca"}</li>
        <li>Retries: {data.retries}</li>
        <li>Outbox Pendiente: {data.outboxPending}</li>
      </ul>
    </div>
  );
};
'@ | Set-Content "$base/views/NetworkDiagView.tsx"

$dashboard = "$base/views/DashboardStatus.tsx"
$content = Get-Content $dashboard -Raw

if ($content -notmatch "NetworkDiagView") {
  $content = $content -replace "import { SnapshotsView } from './SnapshotsView';",
    "import { SnapshotsView } from './SnapshotsView';`nimport { NetworkDiagView } from './NetworkDiagView';"

  $content = $content -replace "<SnapshotsView />",
    "<SnapshotsView />`n      <NetworkDiagView />"

  Set-Content $dashboard $content
}

Write-Host "FASE 6.1.6 lista."
