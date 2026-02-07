import React, { useEffect, useState } from 'react';
import { AppRoutes } from './routes';
import { TechUnlockModal } from './components/TechUnlockModal';
import { useAuth } from './auth/AuthContext';

export function App() {
  const { state, audit } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isHotkey = e.ctrlKey && e.altKey && (e.key === 'a' || e.key === 'A');
      if (!isHotkey) return;

      e.preventDefault();
      setModalOpen(true);

      audit({
        action: 'HOTKEY_ADMIN',
        outcome: 'INFO',
        human: 'Hotkey de acceso admin invocada.',
        technical: { role: state.role }
      }).catch(() => {});
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state.role]);

  return (
    <div style={{ minHeight: '100vh', background: '#050a14' }}>
      <AppRoutes />
      <TechUnlockModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
