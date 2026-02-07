const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function sha256Hex(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

const base = process.argv[2] || path.join(process.env.APPDATA, "smarttrack-admin-ui");
const exportsDir = path.join(base, "exports");
const keysDir = path.join(base, "keys");

function latestSig() {
  const files = fs.readdirSync(exportsDir)
    .filter(f => f.startsWith("export.signature_") && f.endsWith(".json"))
    .map(f => ({ f, p: path.join(exportsDir, f), st: fs.statSync(path.join(exportsDir, f)) }))
    .sort((a,b) => b.st.mtimeMs - a.st.mtimeMs);
  if (!files.length) throw new Error("No export.signature_*.json found in " + exportsDir);
  return files[0].p;
}

const sigPath = latestSig();
const sig = JSON.parse(fs.readFileSync(sigPath, "utf8"));

const pubPath = path.join(keysDir, sig.keys.publicKeyFile);
const pubPem = fs.readFileSync(pubPath, "utf8");
const pubHash = sha256Hex(pubPem);

if (pubHash !== sig.keys.publicKeySha256) {
  console.error("PUBLIC_KEY_HASH_MISMATCH");
  process.exit(1);
}

const payloadBuf = Buffer.from(JSON.stringify(sig.payload), "utf8");
const payloadSha = sha256Hex(payloadBuf);

if (payloadSha !== sig.payloadSha256) {
  console.error("PAYLOAD_HASH_MISMATCH");
  process.exit(1);
}

const okSig = crypto.verify(null, payloadBuf, pubPem, Buffer.from(sig.signatureBase64, "base64"));
if (!okSig) {
  console.error("SIGNATURE_INVALID");
  process.exit(1);
}

// Integrity: recompute ndjson sha
const ndjsonPath = path.join(exportsDir, sig.payload.ndjsonFile);
const sha = sig.payload.sha256;
const nd = fs.readFileSync(ndjsonPath, "utf8");
const recomputed = sha256Hex(nd);

if (recomputed !== sha) {
  console.error("EXPORT_SHA_MISMATCH");
  process.exit(1);
}

console.log({ ok: true, signature: "valid", exportSha256: sha, sigFile: path.basename(sigPath) });
process.exit(0);
