import React from 'react';
import { useAuth } from '../auth/AuthContext';

export function Dashboard() {
  const { state, logoutTech } = useAuth();

  return (
    <div style={{ padding: 20, color: '#e5e7eb' }}>
      <h1 style={{ margin: 0, marginBottom: 8 }}>SmartTrack — Admin UI (Local)</h1>
      <div style={{ color: 'rgba(229,231,235,0.8)', marginBottom: 16 }}>
        Rol: <b>{state.role}</b>
        {state.role === 'TECNICO' && (
          <>
            {' '}
            · Sesión expira:{' '}
            <b>{new Date(state.techSession!.expiresAt).toLocaleString()}</b>
          </>
        )}
      </div>

      <div
        style={{
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 12,
          padding: 14,
          background: 'rgba(17,24,39,0.4)'
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Panel principal</div>
        <div style={{ color: 'rgba(229,231,235,0.75)' }}>
          En este paso solo se asegura control de acceso por rol + auditoría UI.
        </div>

        {state.role === 'TECNICO' && (
          <button
            onClick={() => logoutTech()}
            style={{
              marginTop: 12,
              borderRadius: 10,
              padding: '10px 12px',
              border: '1px solid rgba(255,255,255,0.14)',
              background: '#0b1220',
              color: '#e5e7eb',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            Cerrar sesión Técnica
          </button>
        )}
      </div>
    </div>
  );
}
