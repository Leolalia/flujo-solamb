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
