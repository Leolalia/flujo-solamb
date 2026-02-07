# DOSSIER — admin-ui (autogenerado)
## Fecha
2026-02-07 02:13:16

## Git status
fatal: not a git repository (or any of the parent directories): .git

## Últimos commits
fatal: not a git repository (or any of the parent directories): .git

## Árbol src

FullName                                                                           
--------                                                                           
C:\dev\Flujo Solamb\admin-ui\src\App.css                                           
C:\dev\Flujo Solamb\admin-ui\src\App.tsx                                           
C:\dev\Flujo Solamb\admin-ui\src\index.css                                         
C:\dev\Flujo Solamb\admin-ui\src\main.tsx                                          
C:\dev\Flujo Solamb\admin-ui\src\styles.css                                        
C:\dev\Flujo Solamb\admin-ui\src\assets\react.svg                                  
C:\dev\Flujo Solamb\admin-ui\src\config\analysisRules.ts                           
C:\dev\Flujo Solamb\admin-ui\src\config\env.ts                                     
C:\dev\Flujo Solamb\admin-ui\src\config\systemMode.ts                              
C:\dev\Flujo Solamb\admin-ui\src\features\admin\ModeSwitch.tsx                     
C:\dev\Flujo Solamb\admin-ui\src\features\admin\RulesPanel.tsx                     
C:\dev\Flujo Solamb\admin-ui\src\features\analysis\snapshotAnalyzer.ts             
C:\dev\Flujo Solamb\admin-ui\src\features\operation\OperationView.tsx              
C:\dev\Flujo Solamb\admin-ui\src\features\operation\components\ActiveTruckPanel.tsx
C:\dev\Flujo Solamb\admin-ui\src\features\operation\components\MitigationsPanel.tsx
C:\dev\Flujo Solamb\admin-ui\src\features\simulator\Simulator.tsx                  
C:\dev\Flujo Solamb\admin-ui\src\features\snapshots\SnapshotsHistory.tsx           
C:\dev\Flujo Solamb\admin-ui\src\services\appMode.ts                               
C:\dev\Flujo Solamb\admin-ui\src\services\edgeApi.ts                               
C:\dev\Flujo Solamb\admin-ui\src\services\simulationApi.ts                         
C:\dev\Flujo Solamb\admin-ui\src\services\snapshotsApi.ts                          
C:\dev\Flujo Solamb\admin-ui\src\services\uiEvents.ts                              




## package.json
{
  "name": "admin-ui",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.13.4",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.46.4",
    "vite": "^7.2.4"
  }
}


## main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


## App.tsx
import "./App.css";
import OperationView from "./features/operation/OperationView";

export default function App() {
  return (
    <div className="app-root">
      <OperationView />
    </div>
  );
}


## config/systemMode.ts
export type SystemMode = "SIMULATION" | "PRODUCTION";

export const systemMode = {
  current: "SIMULATION" as SystemMode
};


## services/appMode.ts
export function getMode(): 'PRODUCTION' | 'SIMULATION' {
  return 'PRODUCTION';
}


## ModeSwitch.tsx
import { getMode, setMode, AppMode } from "../../services/appMode";
import { useState } from "react";

export default function ModeSwitch() {
  const [mode, setLocalMode] = useState<AppMode>(getMode());

  function change(mode: AppMode) {
    setMode(mode);
    setLocalMode(mode);
    window.location.reload();
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <strong>Modo:</strong>{" "}
      <button
        disabled={mode === "SIMULATION"}
        onClick={() => change("SIMULATION")}
      >
        Simulación
      </button>
      {" "}
      <button
        disabled={mode === "PRODUCTION"}
        onClick={() => change("PRODUCTION")}
      >
        Producción
      </button>
    </div>
  );
}


## OperationView.tsx
import ActiveTruckPanel from "./components/ActiveTruckPanel";
import MitigationsPanel from "./components/MitigationsPanel";

export default function OperationView() {
  return (
    <div>
      <h1 style={{ marginBottom: 16 }}>OperaciÃ³n</h1>

      <ActiveTruckPanel />

      <div style={{ marginTop: 24 }}>
        <MitigationsPanel />
      </div>
    </div>
  );
}


## Simulator.tsx
import { sendSimulation } from "../../services/simulationApi";
import { getMode } from "../../services/appMode";
import { notifySnapshotsChanged } from "../../services/uiEvents";

const EVENTS = [
  { label: "Semáforo verde", type: "LIGHT_GREEN" },
  { label: "Semáforo rojo", type: "LIGHT_RED" },
  { label: "Abrir barrera", type: "BARRIER_OPEN" },
  { label: "Cerrar barrera", type: "BARRIER_CLOSE" },
  { label: "ANPR", type: "ANPR" },
  { label: "OCR", type: "OCR" },
  { label: "Loop detecta", type: "LOOP_DETECT" },
  { label: "Loop libre", type: "LOOP_FREE" },
];

export default function Simulator() {
  const mode = getMode();
  const disabled = mode === "PRODUCTION";

  async function run(type: string) {
    await sendSimulation(type);
    notifySnapshotsChanged();
  }

  return (
    <div>
      <h3>Simulaciones</h3>

      {disabled && (
        <div style={{ color: "#f59e0b", marginBottom: 12 }}>
          Modo PRODUCCIÓN activo — simulaciones deshabilitadas
        </div>
      )}

      {EVENTS.map((e) => (
        <button
          key={e.type}
          disabled={disabled}
          style={{ margin: 4, opacity: disabled ? 0.4 : 1 }}
          onClick={() => run(e.type)}
        >
          {e.label}
        </button>
      ))}
    </div>
  );
}



## CSS
### index.css
:root {
  --bg-main: #1f2328;
  --bg-panel: #262b31;
  --text-primary: #f2f4f7;
  --text-secondary: #c6ccd4;
  --accent: #3a7afe;
  --border-subtle: #3a4048;
  --disabled: #7a828c;
}

* { box-sizing: border-box; }

html, body, #root {
  height: 100%;
  margin: 0;
  background: var(--bg-main);
  color: var(--text-primary);
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, sans-serif;
}

### styles.css
button {
  background: var(--bg-panel);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
  padding: 10px 14px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

button:hover:not(:disabled) {
  border-color: var(--accent);
}

button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

button:disabled {
  color: var(--disabled);
  cursor: not-allowed;
  opacity: 0.75;
}

### App.css
.app-root {
  min-height: 100vh;
  padding: 16px;
}

