import React from 'react';
import { useAuth } from '../auth/AuthContext';

export function NoAuthorized() {
  const { state } = useAuth();

  return (
    <div style={{ padding: 20, color: '#e5e7eb' }}>
      <h2 style={{ margin: 0, marginBottom: 8 }}>Acceso restringido</h2>
      <div style={{ color: 'rgba(229,231,235,0.75)' }}>
        Rol actual: <b>{state.role}</b>. Esta sección requiere rol <b>TÉCNICO</b>.
      </div>
      <div style={{ marginTop: 10, color: 'rgba(229,231,235,0.75)' }}>
        Usá la hotkey <b>CTRL + ALT + A</b> para solicitar acceso Técnico.
      </div>
    </div>
  );
}
