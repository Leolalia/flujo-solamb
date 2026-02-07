import { useEffect, useState } from "react";
import { fetchSnapshots } from "../../services/snapshotsApi";
import { onSnapshotsChanged } from "../../services/uiEvents";

type Snapshot = {
  id: number;
  type: string;
  source: string;
  anomaly: boolean;
};

export default function SnapshotsHistory() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

  async function load() {
    const list = await fetchSnapshots();
    setSnapshots(list);
  }

  useEffect(() => {
    load();
    onSnapshotsChanged(load);
  }, []);

  return (
    <div>
      <h3>Snapshots</h3>

      {snapshots.length === 0 && (
        <div style={{ opacity: 0.6 }}>Sin snapshots</div>
      )}

      {snapshots.map((s) => (
        <div
          key={s.id}
          style={{
            padding: "6px 8px",
            borderBottom: "1px solid #222",
            color: s.anomaly ? "#ff6b6b" : "#e5e5e5",
            fontWeight: s.anomaly ? 600 : 400,
          }}
        >
          {s.type} · {s.source}
          {s.anomaly && <span> ⚠ ANÓMALO</span>}
        </div>
      ))}
    </div>
  );
}
