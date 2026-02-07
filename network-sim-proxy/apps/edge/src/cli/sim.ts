import { reduce } from "../fsm/reducer.js";
import { writeSnapshot } from "../io/snapshotWriter.js";
import { EdgeContext } from "../core/events.js";

let ctx: EdgeContext = { state: "IDLE", data: {} };

const step = (ev: any) => {
  ctx = reduce(ctx, ev);
  console.log(ctx.state, "->", writeSnapshot(ctx));
};

const cmd = process.argv[2];
const arg = process.argv[3];

if (cmd === "run" && arg === "S1") {
  step({ type: "VEHICLE", at: Date.now() });
  step({ type: "ANPR_OK", at: Date.now(), plate: "SIM123" });
  step({ type: "BARRIER_OPEN", at: Date.now() });
  step({ type: "WEIGH", at: Date.now(), kg: 30000 });
  step({ type: "OCR_OK", at: Date.now(), docId: "DOCSIM" });
  step({ type: "STATUS", at: Date.now() });
  step({ type: "EXIT", at: Date.now() });
  step({ type: "TICKET", at: Date.now() });
  process.exit(0);
}

switch (cmd) {
  case "vehicle":
    step({ type: "VEHICLE", at: Date.now() });
    break;
  case "anpr":
    step({ type: "ANPR_OK", at: Date.now(), plate: arg || "SIM123" });
    break;
  case "barrier":
    step({ type: "BARRIER_OPEN", at: Date.now() });
    break;
  case "weigh":
    step({ type: "WEIGH", at: Date.now(), kg: Number(arg || 30000) });
    break;
  case "ocr":
    step({ type: "OCR_OK", at: Date.now(), docId: arg || "DOCSIM" });
    break;
  case "status":
    step({ type: "STATUS", at: Date.now() });
    break;
  case "exit":
    step({ type: "EXIT", at: Date.now() });
    break;
  case "ticket":
    step({ type: "TICKET", at: Date.now() });
    break;
  default:
    console.error("Uso: sim run S1 | vehicle | anpr [plate] | barrier | weigh [kg] | ocr [doc] | status | exit | ticket");
    process.exit(1);
}
