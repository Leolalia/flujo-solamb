import http from "http";

const HOST = "localhost";
const PORT = 7788;

function post(ev: any) {
  return new Promise<void>((resolve) => {
    const req = http.request(
      { hostname: HOST, port: PORT, path: "/event", method: "POST", headers: { "Content-Type": "application/json" } },
      (res) => {
        res.on("data", () => {});
        res.on("end", () => resolve());
      }
    );
    req.write(JSON.stringify(ev));
    req.end();
  });
}

async function run() {
  console.log("S1: VEHICLE ARRIVE");
  await post({ type: "VEHICLE_ARRIVE", at: Date.now() });

  console.log("S2: ANPR OK");
  await post({ type: "ANPR_OK", plate: "AA123BB", at: Date.now() });

  console.log("S3: BARRIER OPEN");
  await post({ type: "BARRIER_OPEN", at: Date.now() });

  console.log("S4: WEIGH");
  await post({ type: "WEIGH_OK", weight: 28740, at: Date.now() });

  console.log("S5: OCR OK");
  await post({ type: "OCR_OK", doc: "CTG-7781", at: Date.now() });

  console.log("S6: PLANT ENTRY");
  await post({ type: "PLANT_ENTRY", at: Date.now() });

  console.log("S7: EXIT + TICKET");
  await post({ type: "EXIT_OK", ticket: true, at: Date.now() });

  console.log("SCENARIOS DONE");
}

run();
