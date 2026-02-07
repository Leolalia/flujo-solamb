const BASE = "http://localhost:7788";

export type EdgeHealth = { ok: boolean; state: string; ts: number; latencyMs?: number };
export type EdgeStatus = { state: string };
export type SnapshotsList = { list: string[] };
export type SnapshotDoc = any;

async function jget<T>(path: string, timeoutMs = 2000): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const r = await fetch(`${BASE}${path}`, { signal: ctrl.signal });
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    return (await r.json()) as T;
  } finally {
    clearTimeout(t);
  }
}

export async function getEdgeHealth(): Promise<EdgeHealth> {
  const t0 = performance.now();
  const data = await jget<EdgeHealth>("/health", 2000);
  return { ...data, latencyMs: Math.round(performance.now() - t0) };
}

export async function getEdgeStatus(): Promise<EdgeStatus> {
  return await jget<EdgeStatus>("/status", 2000);
}

export async function listSnapshotsHttp(): Promise<SnapshotsList> {
  return await jget<SnapshotsList>("/snapshots", 4000);
}

export async function getSnapshotHttp(id: string): Promise<SnapshotDoc> {
  return await jget<SnapshotDoc>(`/snapshot/${encodeURIComponent(id)}`, 4000);
}
