import { edgeApi } from "./edgeApi";

export async function sendSimulation(type: string, payload: any = {}) {
  await edgeApi.post("/simulations/event", { type, ...payload });

  // 🔁 fuerza refresh de snapshots
  const btn = document.getElementById("refresh-snapshots");
  btn?.click();
}
