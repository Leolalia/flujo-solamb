import { useEffect, useState, KeyboardEvent } from "react";
import axios from "axios";
import { EDGE_BASE } from "../../config";
import "./SnapshotsHistory.css";

type SnapshotsListResp = { list: string[] };

export default function SnapshotsHistory() {
  const [list, setList] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [snapshotJson, setSnapshotJson] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingSnap, setLoadingSnap] = useState(false);

  const loadList = async () => {
    setLoadingList(true);
    setErr(null);
    try {
      const res = await axios.get<SnapshotsListResp>(`${EDGE_BASE}/snapshots`, { timeout: 8000 });
      const newList = Array.isArray(res.data?.list) ? res.data.list : [];
      setList(newList);

      // Auto-select first if none selected and list exists
      if (!selected && newList.length > 0) {
        setSelected(newList[0]);
      } else if (selected && !newList.includes(selected)) {
        // If selected item is gone, deselect
        setSelected(null);
      }
    } catch (e: any) {
      console.error("Failed to load snapshots list", e);
      setErr(e?.message ?? "Failed to load snapshots list");
      setList([]);
    } finally {
      setLoadingList(false);
    }
  };

  const loadSnapshot = async (name: string) => {
    setLoadingSnap(true);
    // Do not clear global error here, only if snapshot fails
    try {
      const res = await axios.get(`${EDGE_BASE}/snapshots/${encodeURIComponent(name)}`, { timeout: 12000 });
      setSnapshotJson(res.data);
    } catch (e: any) {
      console.error(`Failed to load snapshot ${name}`, e);
      setSnapshotJson(null);
      // Show error in the viewer or global? Global is safer for visibility
      setErr(`Error loading ${name}: ${e?.message}`);
    } finally {
      setLoadingSnap(false);
    }
  };

  useEffect(() => {
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selected) {
      loadSnapshot(selected);
    } else {
      setSnapshotJson(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent, item: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelected(item);
    }
  };

  return (
    <div className="snapshots-container">
      {/* SIDEBAR */}
      <div className="snapshots-sidebar">
        <div className="snapshots-header">
          <h2>Snapshots</h2>
          <button
            onClick={loadList}
            disabled={loadingList}
            className="snapshots-refresh-btn"
            title="Refresh list"
          >
            {loadingList ? "..." : "↻"}
          </button>
        </div>

        {err && <div className="snapshots-error">{err}</div>}

        <div className="snapshots-list">
          {list.length === 0 ? (
            <div className="snapshots-empty">
              {loadingList ? "Loading..." : "No snapshots found"}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {list.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelected(s)}
                  onKeyDown={(e) => handleKeyDown(e, s)}
                  className={`snapshot-item ${selected === s ? "selected" : ""}`}
                  title={s}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* VIEWER */}
      <div className="snapshots-main">
        <h2 className="snapshots-content-title">
          Content: <span style={{ fontWeight: 400 }}>{selected || "None"}</span>
        </h2>

        <div className="snapshots-viewer">
          {!selected ? (
            <div className="snapshots-placeholder">
              Select a snapshot to view content
            </div>
          ) : loadingSnap ? (
            <div className="snapshots-placeholder">Loading content...</div>
          ) : snapshotJson ? (
            <pre style={{ margin: 0 }}>
              {JSON.stringify(snapshotJson, null, 2)}
            </pre>
          ) : (
            <div className="snapshots-placeholder" style={{ color: "#d32f2f" }}>
              Failed to load content
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
