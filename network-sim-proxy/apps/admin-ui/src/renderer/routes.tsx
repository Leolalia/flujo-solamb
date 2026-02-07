import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { NoAuthorized } from './pages/NoAuthorized';
import { TechnicalHome } from './pages/TechnicalHome';
import { RequireTech } from './components/RequireTech';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/no-autorizado" element={<NoAuthorized />} />
      <Route
        path="/tecnico"
        element={
          <RequireTech>
            <TechnicalHome />
          </RequireTech>
        }
      />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
}
