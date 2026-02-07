export type Role = 'OPERADOR' | 'TECNICO';

export type TechSession = {
  role: 'TECNICO';
  sessionId: string;
  issuedAt: number;
  expiresAt: number;
};

const KEY = 'smarttrack.tech.session.v1';

export function loadTechSession(): TechSession | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw) as TechSession;
    if (Date.now() > obj.expiresAt) return null;
    return obj;
  } catch {
    return null;
  }
}

export function saveTechSession(s: TechSession) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function clearTechSession() {
  localStorage.removeItem(KEY);
}
