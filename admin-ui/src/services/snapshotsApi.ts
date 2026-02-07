import { edgeApi } from "./edgeApi";

export async function fetchSnapshots() {
  const res = await edgeApi.get("/snapshots");
  return res.data.list ?? [];
}
