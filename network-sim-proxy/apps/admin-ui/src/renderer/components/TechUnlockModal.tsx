import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function TechUnlockModal({ open, onClose }: Props) {
  const { state, unlockTech, initTechPassword } = useAuth();
  const [mode, setMode] = useState<'UNLOCK' | 'INIT'>(() => (state.hasTechPassword ? 'UNLOCK' : 'INIT'));
  const [password, setPassword] = useState('');
  const [bootstrapCode, setBootstrapCode] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [paths, setPaths] = useState<{ bootstrapFile: string } | null>(null);

  const title = useMemo(() => {
    if (mode === 'UNLOCK') return 'Acceso Técnico';
    return 'Inicializar Clave Técnica';
  }, [mode]);

  useEffect(() => {
    if (!open) return;
    setMsg(null);
    setPassword('');
    setBootstrapCode('');
    setMode(state.hasTechPassword ? 'UNLOCK' : 'INIT');
    window.smarttrack.paths.get().then((p) => setPaths({ bootstrapFile: p.bootstrapFile })).catch(() => setPaths(null));
  }, [open, state.hasTechPassword]);

  if (!open) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (mode === 'UNLOCK') {
      const res = await unlockTech(password);
      if (res.ok) {
        setMsg('Acceso Técnico habilitado.');
        setTimeout(() => onClose(), 300);
      } else {
        if (res.code === 'TECH_PASSWORD_NOT_SET') setMsg('No existe clave Técnica configurada. Inicializala primero.');
        else setMsg('Credenciales inválidas.');
      }
      return;
    }

    const res2 = await initTechPassword(bootstrapCode.trim(), password);
    if (res2.ok) {
      setMsg('Clave Técnica inicializada. Ahora podés desbloquear como Técnico.');
      setTimeout(() => onClose(), 600);
    } else {
      if (res2.code === 'WEAK_PASSWORD') setMsg('Clave débil. Mínimo 12 caracteres.');
      else setMsg('Bootstrap inválido.');
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
      onMouseDown={onClose}
    >
      <div
        style={{
          width: 520,
          background: '#0b1220',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          padding: 18,
          color: '#e5e7eb',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{title}</div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#e5e7eb',
              borderRadius: 8,
              padding: '6px 10px',
              cursor: 'pointer'
            }}
          >
            Cerrar
          </button>
        </div>

        <div style={{ fontSize: 13, color: 'rgba(229,231,235,0.8)', marginBottom: 12 }}>
          Hotkey: <b>CTRL + ALT + A</b>. Rol actual: <b>{state.role}</b>.
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button
            onClick={() => setMode('UNLOCK')}
            disabled={!state.hasTechPassword}
            style={{
              flex: 1,
              background: mode === 'UNLOCK' ? '#111827' : 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              color: state.hasTechPassword ? '#e5e7eb' : 'rgba(229,231,235,0.4)',
              borderRadius: 10,
              padding: 10,
              cursor: state.hasTechPassword ? 'pointer' : 'not-allowed'
            }}
          >
            Desbloquear Técnico
          </button>
          <button
            onClick={() => setMode('INIT')}
            style={{
              flex: 1,
              background: mode === 'INIT' ? '#111827' : 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#e5e7eb',
              borderRadius: 10,
              padding: 10,
              cursor: 'pointer'
            }}
          >
            Inicializar Clave
          </button>
        </div>

        <form onSubmit={onSubmit}>
          {mode === 'INIT' && (
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'rgba(229,231,235,0.85)' }}>
                Bootstrap code
              </label>
              <input
                value={bootstrapCode}
                onChange={(e) => setBootstrapCode(e.target.value)}
                placeholder="Pegá el bootstrap code"
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: '#050a14',
                  color: '#e5e7eb',
                  outline: 'none'
                }}
              />
              <div style={{ fontSize: 12, color: 'rgba(229,231,235,0.65)', marginTop: 6 }}>
                El bootstrap se guarda localmente en: <b>{paths?.bootstrapFile || '...'}</b>
              </div>
            </div>
          )}

          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'rgba(229,231,235,0.85)' }}>
              {mode === 'UNLOCK' ? 'Clave Técnica' : 'Nueva Clave Técnica (mín. 12 caracteres)'}
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder={mode === 'UNLOCK' ? 'Ingresá clave técnica' : 'Definí una clave fuerte'}
              style={{
                width: '100%',
                padding: 10,
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.12)',
                background: '#050a14',
                color: '#e5e7eb',
                outline: 'none'
              }}
            />
          </div>

          {msg && (
            <div
              style={{
                marginBottom: 10,
                padding: 10,
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.10)',
                background: 'rgba(17,24,39,0.5)',
                fontSize: 13
              }}
            >
              {msg}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: 11,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.14)',
              background: '#0f172a',
              color: '#e5e7eb',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            {mode === 'UNLOCK' ? 'Habilitar Técnico' : 'Inicializar'}
          </button>
        </form>
      </div>
    </div>
  );
}
