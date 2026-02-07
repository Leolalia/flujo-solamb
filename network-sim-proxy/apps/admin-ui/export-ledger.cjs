const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const base = path.join(process.env.APPDATA, "smarttrack-admin-ui");
const ledger = path.join(base, "ledger", "ledger.ndjson");
const outDir = path.join(base, "exports");

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const ts = Date.now();
const ndOut = path.join(outDir, `ledger_${ts}.ndjson`);
const jsonOut = path.join(outDir, `ledger_${ts}.json`);
const shaOut = path.join(outDir, `ledger_${ts}.sha256`);
const manOut = path.join(outDir, `export.manifest_${ts}.json`);

const nd = fs.readFileSync(ledger, "utf8");
fs.writeFileSync(ndOut, nd, "utf8");

const arr = nd.trim().split(/\r?\n/).map(l => JSON.parse(l));
fs.writeFileSync(jsonOut, JSON.stringify(arr, null, 2), "utf8");

const sha = crypto.createHash("sha256").update(nd).digest("hex");
fs.writeFileSync(shaOut, sha, "utf8");

const manifest = {
  v: 1,
  at: new Date().toISOString(),
  files: {
    ndjson: path.basename(ndOut),
    json: path.basename(jsonOut),
    sha256: path.basename(shaOut)
  },
  sha256: sha
};

fs.writeFileSync(manOut, JSON.stringify(manifest, null, 2), "utf8");
console.log(manOut);
