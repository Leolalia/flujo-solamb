import { reduce } from "../fsm/reducer.js";
import { writeSnapshot } from "../io/snapshotWriter.js";
import { EdgeContext } from "../core/events.js";

let ctx: EdgeContext = { state: "IDLE" };

ctx = reduce(ctx, { type: "STATUS", at: Date.now() });

console.log("SMOKE SNAPSHOT:", writeSnapshot(ctx));
