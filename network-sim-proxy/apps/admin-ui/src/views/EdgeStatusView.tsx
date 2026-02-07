import { useEffect, useState } from "react";
import { getEdgeHealth, getEdgeStatus } from "../services/edgeApi";

export default function EdgeStatusView() {
  const [health, setHealth] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  async function tick() {
    try {
      setErr(null);
      setHealth(await getEdgeHealth());
      setStatus(await getEdgeStatus());
    } catch {
      setErr("EDGE OFFLINE");
    }
  }

  useEffect(() => {
    tick();
    const id = setInterval(tick, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <h2>Edge Status</h2>
      {err && <div style={{ color: "red" }}>{err}</div>}
      {health && <pre>{JSON.stringify(health, null, 2)}</pre>}
      {status && <pre>{JSON.stringify(status, null, 2)}</pre>}
    </div>
  );
}
