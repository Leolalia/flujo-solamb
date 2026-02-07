import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Role, TechSession } from './techSession';
import { clearTechSession, loadTechSession, saveTechSession } from './techSession';

type AuthState = {
  role: Role;
  techSession: TechSession | null;
  hasTechPassword: boolean;
  ttlMinutes: number;
};

type AuthApi = {
  state: AuthState;
  refreshStatus: () => Promise<void>;
  unlockTech: (password: string) => Promise<{ ok: true } | { ok: false; code: string }>;
  initTechPassword: (
    bootstrapCode: string,
    newPassword: string
  ) => Promise<{ ok: true } | { ok: false; code: string }>;
  logoutTech: () => Promise<void>;
  audit: (p: {
    action: string;
    outcome: 'ALLOW' | 'DENY' | 'INFO';
    human: string;
    technical?: Record<string, unknown>;
  }) => Promise<void>;
};

const AuthContext = createContext<AuthApi | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [techSession, setTechSession] = useState<TechSession | null>(() => loadTechSession());
  const [hasTechPassword, setHasTechPassword] = useState(false);
  const [ttlMinutes, setTtlMinutes] = useState(30);

  const role: Role = techSession ? 'TECNICO' : 'OPERADOR';

  async function refreshStatus() {
    const s = await window.smarttrack.auth.status();
    if (s?.ok) {
      setHasTechPassword(!!s.hasTechPassword);
      setTtlMinutes(Number(s.ttlMinutes || 30));
    }
  }

  useEffect(() => {
    refreshStatus().catch(() => {});
    const t = setInterval(() => {
      setTechSession(loadTechSession());
    }, 1000);
    return () => clearInterval(t);
  }, []);

  async function audit(p: {
    action: string;
    outcome: 'ALLOW' | 'DENY' | 'INFO';
    human: string;
    technical?: Record<string, unknown>;
  }) {
    await window.smarttrack.audit.append({
      actor: { role, sessionId: techSession?.sessionId ?? null },
      action: p.action,
      outcome: p.outcome,
      human: p.human,
      technical: p.technical || {}
    });
  }

  async function unlockTech(password: string) {
    const res = await window.smarttrack.auth.verify({ password });

    if (res.ok) {
      const now = Date.now();
      const ttlMs = Number(res.ttlMinutes || ttlMinutes) * 60_000;

      const sess: TechSession = {
        role: 'TECNICO',
        sessionId: res.sessionId,
        issuedAt: now,
        expiresAt: now + ttlMs
      };

      saveTechSession(sess);
      setTechSession(sess);

      await audit({
        action: 'ADMIN_UNLOCK',
        outcome: 'ALLOW',
        human: 'Acceso Técnico habilitado.',
        technical: { ttlMinutes: res.ttlMinutes }
      });

      return { ok: true as const };
    }

    await audit({
      action: 'ADMIN_UNLOCK',
      outcome: 'DENY',
      human: 'Acceso Técnico denegado.',
      technical: { code: res.code }
    });

    return { ok: false as const, code: res.code };
  }

  async function initTechPassword(bootstrapCode: string, newPassword: string) {
    const res = await window.smarttrack.auth.init({ bootstrapCode, newPassword });

    if (res.ok) {
      await audit({
        action: 'TECH_PASSWORD_INIT',
        outcome: 'ALLOW',
        human: 'Clave Técnica inicializada.',
        technical: {}
      });
      await refreshStatus();
      return { ok: true as const };
    }

    await audit({
      action: 'TECH_PASSWORD_INIT',
      outcome: 'DENY',
      human: 'Inicialización de clave Técnica fallida.',
      technical: { code: res.code }
    });

    return { ok: false as const, code: res.code };
  }

  async function logoutTech() {
    clearTechSession();
    setTechSession(null);
    await audit({
      action: 'ADMIN_LOCK',
      outcome: 'INFO',
      human: 'Sesión Técnica cerrada.',
      technical: {}
    });
  }

  const value = useMemo<AuthApi>(
    () => ({
      state: { role, techSession, hasTechPassword, ttlMinutes },
      refreshStatus,
      unlockTech,
      initTechPassword,
      logoutTech,
      audit
    }),
    [role, techSession, hasTechPassword, ttlMinutes]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthContext not mounted');
  return ctx;
}
