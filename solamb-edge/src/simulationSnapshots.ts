import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "snapshots.json");

type Snapshot = {
  id: string;
  type: string;
  source?: string;
  receivedAt?: number;
};

let snapshots: Snapshot[] = [];

// init
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (fs.existsSync(FILE)) {
  try {
    snapshots = JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    snapshots = [];
  }
}

function persist() {
  fs.writeFileSync(FILE, JSON.stringify(snapshots, null, 2));
}

export function addSimulationSnapshot(event: any) {
  const snap: Snapshot = {
    id: String(Date.now()),
    type: event.type,
    source: event.source || "SIMULATION",
    receivedAt: event.receivedAt || Date.now(),
  };
  snapshots.unshift(snap);
  persist();
}

export function listSimulationSnapshots() {
  return snapshots;
}
