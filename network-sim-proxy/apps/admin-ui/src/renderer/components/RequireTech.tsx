import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function RequireTech({ children }: { children: React.ReactNode }) {
  const { state, audit } = useAuth();
  const loc = useLocation();

  const allowed = state.role === 'TECNICO';

  useEffect(() => {
    if (allowed) return;
    audit({
      action: 'ROUTE_GUARD',
      outcome: 'DENY',
      human: 'Acceso a sección técnica denegado por rol Operador.',
      technical: { path: loc.pathname }
    }).catch(() => {});
  }, [allowed, loc.pathname]);

  if (!allowed) return <Navigate to="/no-autorizado" replace />;
  return <>{children}</>;
}
