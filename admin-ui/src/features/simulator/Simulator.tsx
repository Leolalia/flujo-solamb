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

