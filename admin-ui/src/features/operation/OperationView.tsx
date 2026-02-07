import ActiveTruckPanel from "./components/ActiveTruckPanel";
import MitigationsPanel from "./components/MitigationsPanel";

export default function OperationView() {
  return (
    <div>
      <h1 style={{ marginBottom: 16 }}>Operación</h1>

      <ActiveTruckPanel />

      <div style={{ marginTop: 24 }}>
        <MitigationsPanel />
      </div>
    </div>
  );
}
