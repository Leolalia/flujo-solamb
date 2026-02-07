import React, { useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';

export function TechnicalHome() {
  const { audit } = useAuth();

  useEffect(() => {
    audit({
      action: 'OPEN_TECH_HOME',
      outcome: 'INFO',
      human: 'Ingreso a panel técnico.',
      technical: {}
    }).catch(() => {});
  }, []);

  return (
    <div style={{ padding: 20, color: '#e5e7eb' }}>
      <h2 style={{ margin: 0, marginBottom: 10 }}>Panel Técnico</h2>
      <div style={{ color: 'rgba(229,231,235,0.75)' }}>
        Este es el contenedor de módulos técnicos (red, usuarios, updates, backup/restore, simulaciones completas).
      </div>
    </div>
  );
}
