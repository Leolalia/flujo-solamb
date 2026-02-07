import { useState } from "react";
import { analysisRules } from "../../config/analysisRules";
import { setLiveRules } from "../analysis/snapshotAnalyzer";

export default function RulesPanel() {
  const [rules, setRules] = useState(analysisRules);

  const update = (key: string, value: number) => {
    const next = { ...rules, [key]: value };
    setRules(next);
    setLiveRules(next);
  };

  return (
    <div style={{ padding: 12 }}>
      <h3>Reglas de análisis</h3>

      <label>
        Claves mínimas
        <input
          type="number"
          value={rules.minKeys}
          onChange={e => update("minKeys", Number(e.target.value))}
        />
      </label>

      <br />

      <label>
        Claves máximas
        <input
          type="number"
          value={rules.maxKeys}
          onChange={e => update("maxKeys", Number(e.target.value))}
        />
      </label>

      <p style={{ fontSize: 12 }}>
        Aplicación inmediata (sin reiniciar)
      </p>
    </div>
  );
}
