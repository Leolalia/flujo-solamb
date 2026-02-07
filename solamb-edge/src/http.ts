import express from 'express';
import { saveSnapshot, listSnapshots } from './infrastructure/snapshotsRepo';
import { isProduction } from './utils/appMode';

export function startHttpServer(port = 7789) {
  const app = express();

  // CORS fijo local
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true, mode: isProduction() ? 'PRODUCTION' : 'SIMULATION' });
  });

  app.post('/simulations/event', (_req, res) => {
    if (isProduction()) {
      return res.status(403).json({
        error: 'SIMULATIONS_DISABLED_IN_PRODUCTION'
      });
    }
    return res.status(500).json({ error: 'UNEXPECTED' });
  });

  app.get('/snapshots', (_req, res) => {
    res.json({ list: listSnapshots() });
  });

  app.listen(port, () => {
    console.log('HTTP listening on ' + port);
    console.log('[MODE]', isProduction() ? 'PRODUCTION' : 'SIMULATION');
  });
}
