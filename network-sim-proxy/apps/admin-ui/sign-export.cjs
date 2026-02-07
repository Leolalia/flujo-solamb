const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const base = path.join(process.env.APPDATA, "smarttrack-admin-ui");
const exportsDir = path.join(base, "exports");
const keysDir = path.join(base, "keys");
const privPath = path.join(keysDir, "ed25519.private.pem");
const pubPath  = path.join(keysDir, "ed25519.public.pem");

if (!fs.existsSync(exportsDir)) throw new Error("exports dir missing: " + exportsDir);
if (!fs.existsSync(keysDir)) fs.mkdirSync(keysDir, { recursive: true });

function sha256Hex(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function latestManifest() {
  const files = fs.readdirSync(exportsDir)
    .filter(f => f.startsWith("export.manifest_") && f.endsWith(".json"))
    .map(f => ({ f, p: path.join(exportsDir, f), st: fs.statSync(path.join(exportsDir, f)) }))
    .sort((a,b) => b.st.mtimeMs - a.st.mtimeMs);
  if (!files.length) throw new Error("No export.manifest_*.json found in " + exportsDir);
  return files[0].p;
}

function ensureKeys() {
  if (fs.existsSync(privPath) && fs.existsSync(pubPath)) return;

  const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");
  const privPem = privateKey.export({ type: "pkcs8", format: "pem" });
  const pubPem  = publicKey.export({ type: "spki", format: "pem" });
  fs.writeFileSync(privPath, privPem, "utf8");
  fs.writeFileSync(pubPath, pubPem, "utf8");
}

ensureKeys();

const manPath = latestManifest();
const manifestRaw = fs.readFileSync(manPath, "utf8");
const manifest = JSON.parse(manifestRaw);

const ndjsonPath = path.join(exportsDir, manifest.files.ndjson);
const shaPath    = path.join(exportsDir, manifest.files.sha256);

const ndjsonRaw = fs.readFileSync(ndjsonPath, "utf8");
const shaRaw    = fs.readFileSync(shaPath, "utf8").trim();

const recomputedSha = sha256Hex(ndjsonRaw);
if (recomputedSha !== shaRaw) {
  throw new Error("SHA mismatch: file=" + shaRaw + " recomputed=" + recomputedSha);
}

// Payload canon: manifest filename + sha256 + manifest.sha256 (should match)
const payloadObj = {
  v: 1,
  manifestFile: path.basename(manPath),
  ndjsonFile: manifest.files.ndjson,
  sha256File: manifest.files.sha256,
  sha256: shaRaw
};
const payload = Buffer.from(JSON.stringify(payloadObj), "utf8");
const payloadSha = sha256Hex(payload);

const privPem = fs.readFileSync(privPath, "utf8");
const pubPem  = fs.readFileSync(pubPath, "utf8");
const pubKeyHash = sha256Hex(pubPem);

const signature = crypto.sign(null, payload, privPem).toString("base64");

const ts = Date.now();
const sigOut = path.join(exportsDir, `export.signature_${ts}.json`);

const out = {
  v: 1,
  algo: "ed25519",
  signedAt: new Date().toISOString(),
  keys: {
    publicKeySha256: pubKeyHash,
    publicKeyFile: path.basename(pubPath)
  },
  payload: payloadObj,
  payloadSha256: payloadSha,
  signatureBase64: signature
};

fs.writeFileSync(sigOut, JSON.stringify(out, null, 2), "utf8");
console.log(sigOut);
