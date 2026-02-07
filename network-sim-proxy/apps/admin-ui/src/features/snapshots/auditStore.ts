const KEY = 'audit_snapshots_v1';

export function getAudited(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

export function isAudited(file: string): boolean {
  return getAudited().has(file);
}

export function markAudited(file: string) {
  const set = getAudited();
  set.add(file);
  localStorage.setItem(KEY, JSON.stringify(Array.from(set)));
}
