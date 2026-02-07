"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerStoreV1 = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_os_1 = __importDefault(require("node:os"));
const node_crypto_1 = __importDefault(require("node:crypto"));
function sha256Hex(buf) {
    return node_crypto_1.default.createHash("sha256").update(buf).digest("hex");
}
function canonicalJson(obj) {
    // Deterministic JSON stringify (sorted keys, stable arrays)
    const seen = new WeakSet();
    const norm = (v) => {
        if (v === null || typeof v !== "object")
            return v;
        if (seen.has(v))
            throw new Error("Cyclic object in canonicalJson");
        seen.add(v);
        if (Array.isArray(v))
            return v.map(norm);
        const keys = Object.keys(v).sort();
        const out = {};
        for (const k of keys)
            out[k] = norm(v[k]);
        return out;
    };
    return JSON.stringify(norm(obj));
}
function ensureDir(p) {
    node_fs_1.default.mkdirSync(p, { recursive: true });
}
function getAppDataDir(appName) {
    // Matches Electron roaming on Windows; safe cross-platform
    const home = node_os_1.default.homedir();
    const platform = process.platform;
    if (platform === "win32") {
        const appData = process.env.APPDATA || node_path_1.default.join(home, "AppData", "Roaming");
        return node_path_1.default.join(appData, appName);
    }
    if (platform === "darwin") {
        return node_path_1.default.join(home, "Library", "Application Support", appName);
    }
    // linux
    const xdg = process.env.XDG_CONFIG_HOME || node_path_1.default.join(home, ".config");
    return node_path_1.default.join(xdg, appName);
}
class LedgerStoreV1 {
    constructor(opts) {
        this.appName = opts.appName;
        this.snapshotsDir = opts.snapshotsDir;
        const baseDir = node_path_1.default.join(getAppDataDir(this.appName), "ledger");
        this.paths = {
            baseDir,
            ledgerNdjson: node_path_1.default.join(baseDir, "ledger.ndjson"),
            headJson: node_path_1.default.join(baseDir, "head.json"),
        };
        ensureDir(this.paths.baseDir);
        if (!node_fs_1.default.existsSync(this.paths.ledgerNdjson))
            node_fs_1.default.writeFileSync(this.paths.ledgerNdjson, "", "utf8");
        if (!node_fs_1.default.existsSync(this.paths.headJson)) {
            const head = {
                v: 1,
                headEntryHash: null,
                headSnapshotSha256: null,
                headSnapshotFile: null,
                entries: 0,
                updatedAtMs: Date.now(),
            };
            node_fs_1.default.writeFileSync(this.paths.headJson, JSON.stringify(head, null, 2), "utf8");
        }
    }
    getPaths() {
        return { ...this.paths, snapshotsDir: this.snapshotsDir };
    }
    readHead() {
        const raw = node_fs_1.default.readFileSync(this.paths.headJson, "utf8");
        return JSON.parse(raw);
    }
    writeHead(h) {
        node_fs_1.default.writeFileSync(this.paths.headJson, JSON.stringify(h, null, 2), "utf8");
    }
    *readLedgerLines() {
        const raw = node_fs_1.default.readFileSync(this.paths.ledgerNdjson, "utf8");
        if (!raw.trim())
            return;
        const lines = raw.split(/\r?\n/).filter(Boolean);
        for (const l of lines)
            yield l;
    }
    readLastEntry() {
        const raw = node_fs_1.default.readFileSync(this.paths.ledgerNdjson, "utf8");
        const lines = raw.split(/\r?\n/).filter(Boolean);
        if (lines.length === 0)
            return null;
        return JSON.parse(lines[lines.length - 1]);
    }
    snapshotAbsPath(snapshotFile) {
        return node_path_1.default.join(this.snapshotsDir, snapshotFile);
    }
    listSnapshotFiles() {
        if (!node_fs_1.default.existsSync(this.snapshotsDir))
            return [];
        const files = node_fs_1.default.readdirSync(this.snapshotsDir).filter(f => /^snap_\d+\.json$/i.test(f));
        // sort by timestamp numeric ascending
        files.sort((a, b) => {
            const ta = Number((a.match(/^snap_(\d+)\.json$/i) || [])[1] || "0");
            const tb = Number((b.match(/^snap_(\d+)\.json$/i) || [])[1] || "0");
            return ta - tb;
        });
        return files;
    }
    listLedgerEntries(limit = 5000) {
        const out = [];
        for (const line of this.readLedgerLines()) {
            out.push(JSON.parse(line));
            if (out.length >= limit)
                break;
        }
        return out;
    }
    status() {
        const head = this.readHead();
        const last = this.readLastEntry();
        return {
            paths: this.getPaths(),
            head,
            lastEntry: last,
        };
    }
    computeEntryHash(entryWithoutEntryHash) {
        // entryHash is sha256(canonical(entryWithoutEntryHash))
        return sha256Hex(canonicalJson(entryWithoutEntryHash));
    }
    computeSnapshotSha256(snapshotFile) {
        const p = this.snapshotAbsPath(snapshotFile);
        const buf = node_fs_1.default.readFileSync(p);
        return sha256Hex(buf);
    }
    syncAppendMissing() {
        const snapshots = this.listSnapshotFiles();
        const existing = new Set();
        for (const line of this.readLedgerLines()) {
            const e = JSON.parse(line);
            existing.add(e.snapshotFile);
        }
        let prev = this.readLastEntry();
        let appended = 0;
        for (const snapFile of snapshots) {
            if (existing.has(snapFile))
                continue;
            const snapPath = this.snapshotAbsPath(snapFile);
            const st = node_fs_1.default.statSync(snapPath);
            const snapBuf = node_fs_1.default.readFileSync(snapPath);
            const snapshotSha256 = sha256Hex(snapBuf);
            const prevHash = prev ? prev.entryHash : null;
            const ts = Number((snapFile.match(/^snap_(\d+)\.json$/i) || [])[1] || Date.now());
            const id = `${ts}:${snapFile}`;
            const base = {
                v: 1,
                id,
                snapshotFile: snapFile,
                snapshotPath: snapPath,
                snapshotBytes: st.size,
                snapshotMtimeMs: st.mtimeMs,
                snapshotSha256,
                prevHash,
                atMs: Date.now(),
            };
            const entryHash = this.computeEntryHash(base);
            const entry = { ...base, entryHash };
            node_fs_1.default.appendFileSync(this.paths.ledgerNdjson, JSON.stringify(entry) + "\n", "utf8");
            prev = entry;
            appended++;
        }
        const head = {
            v: 1,
            headEntryHash: prev ? prev.entryHash : null,
            headSnapshotSha256: prev ? prev.snapshotSha256 : null,
            headSnapshotFile: prev ? prev.snapshotFile : null,
            entries: this.countEntriesFast(),
            updatedAtMs: Date.now(),
        };
        this.writeHead(head);
        return { appended, totalSnapshots: snapshots.length, totalEntries: head.entries };
    }
    countEntriesFast() {
        const raw = node_fs_1.default.readFileSync(this.paths.ledgerNdjson, "utf8");
        if (!raw.trim())
            return 0;
        return raw.split(/\r?\n/).filter(Boolean).length;
    }
    verifyFull() {
        let prevHash = null;
        let i = 0;
        try {
            for (const line of this.readLedgerLines()) {
                const e = JSON.parse(line);
                // 1) chain
                if (e.prevHash !== prevHash) {
                    return { ok: false, checked: i, firstBadIndex: i, error: `CHAIN_MISMATCH at index=${i}` };
                }
                // 2) snapshot exists + bytes hash
                if (!node_fs_1.default.existsSync(e.snapshotPath)) {
                    return { ok: false, checked: i, firstBadIndex: i, error: `SNAPSHOT_MISSING ${e.snapshotPath}` };
                }
                const buf = node_fs_1.default.readFileSync(e.snapshotPath);
                const sha = sha256Hex(buf);
                if (sha !== e.snapshotSha256) {
                    return { ok: false, checked: i, firstBadIndex: i, error: `SNAPSHOT_HASH_MISMATCH file=${e.snapshotFile}` };
                }
                // 3) entryHash
                const { entryHash, ...rest } = e;
                const recomputed = this.computeEntryHash(rest);
                if (recomputed !== entryHash) {
                    return { ok: false, checked: i, firstBadIndex: i, error: `ENTRY_HASH_MISMATCH file=${e.snapshotFile}` };
                }
                prevHash = e.entryHash;
                i++;
            }
            return { ok: true, checked: i };
        }
        catch (err) {
            return { ok: false, checked: i, firstBadIndex: i, error: String(err?.message || err) };
        }
    }
    export(format) {
        const nd = node_fs_1.default.readFileSync(this.paths.ledgerNdjson, "utf8");
        if (format === "ndjson")
            return { format, content: nd };
        const arr = nd.split(/\r?\n/).filter(Boolean).map(l => JSON.parse(l));
        return { format, content: JSON.stringify(arr, null, 2) };
    }
}
exports.LedgerStoreV1 = LedgerStoreV1;
