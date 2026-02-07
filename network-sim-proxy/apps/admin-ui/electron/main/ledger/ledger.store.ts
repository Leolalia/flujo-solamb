import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { LedgerEntryV1, LedgerHead } from './ledger.types';

type LedgerPaths = {
  baseDir: string;
  ledgerNdjson: string;
  headJson: string;
};

function sha256Hex(buf: Buffer | string): string {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function canonicalJson(obj: any): string {
  // Deterministic JSON stringify (sorted keys, stable arrays)
  const seen = new WeakSet();

  const norm = (v: any): any => {
    if (v === null || typeof v !== "object") return v;
    if (seen.has(v)) throw new Error("Cyclic object in canonicalJson");
    seen.add(v);

    if (Array.isArray(v)) return v.map(norm);

    const keys = Object.keys(v).sort();
    const out: any = {};
    for (const k of keys) out[k] = norm(v[k]);
    return out;
  };

  return JSON.stringify(norm(obj));
}

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

function getAppDataDir(appName: string): string {
  // Matches Electron roaming on Windows; safe cross-platform
  const home = os.homedir();
  const platform = process.platform;

  if (platform === "win32") {
    const appData = process.env.APPDATA || path.join(home, "AppData", "Roaming");
    return path.join(appData, appName);
  }

  if (platform === "darwin") {
    return path.join(home, "Library", "Application Support", appName);
  }

  // linux
  const xdg = process.env.XDG_CONFIG_HOME || path.join(home, ".config");
  return path.join(xdg, appName);
}

export class LedgerStoreV1 {
  private readonly appName: string;
  private readonly snapshotsDir: string;
  private readonly paths: LedgerPaths;

  constructor(opts: { appName: string; snapshotsDir: string }) {
    this.appName = opts.appName;
    this.snapshotsDir = opts.snapshotsDir;

    const baseDir = path.join(getAppDataDir(this.appName), "ledger");
    this.paths = {
      baseDir,
      ledgerNdjson: path.join(baseDir, "ledger.ndjson"),
      headJson: path.join(baseDir, "head.json"),
    };

    ensureDir(this.paths.baseDir);
    if (!fs.existsSync(this.paths.ledgerNdjson)) fs.writeFileSync(this.paths.ledgerNdjson, "", "utf8");
    if (!fs.existsSync(this.paths.headJson)) {
      const head: LedgerHead = {
        v: 1,
        headEntryHash: null,
        headSnapshotSha256: null,
        headSnapshotFile: null,
        entries: 0,
        updatedAtMs: Date.now(),
      };
      fs.writeFileSync(this.paths.headJson, JSON.stringify(head, null, 2), "utf8");
    }
  }

  getPaths() {
    return { ...this.paths, snapshotsDir: this.snapshotsDir };
  }

  private readHead(): LedgerHead {
    const raw = fs.readFileSync(this.paths.headJson, "utf8");
    return JSON.parse(raw) as LedgerHead;
  }

  private writeHead(h: LedgerHead) {
    fs.writeFileSync(this.paths.headJson, JSON.stringify(h, null, 2), "utf8");
  }

  private *readLedgerLines(): Generator<string> {
    const raw = fs.readFileSync(this.paths.ledgerNdjson, "utf8");
    if (!raw.trim()) return;
    const lines = raw.split(/\r?\n/).filter(Boolean);
    for (const l of lines) yield l;
  }

  private readLastEntry(): LedgerEntryV1 | null {
    const raw = fs.readFileSync(this.paths.ledgerNdjson, "utf8");
    const lines = raw.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return null;
    return JSON.parse(lines[lines.length - 1]) as LedgerEntryV1;
  }

  private snapshotAbsPath(snapshotFile: string): string {
    return path.join(this.snapshotsDir, snapshotFile);
  }

  listSnapshotFiles(): string[] {
    if (!fs.existsSync(this.snapshotsDir)) return [];
    const files = fs.readdirSync(this.snapshotsDir).filter(f => /^snap_\d+\.json$/i.test(f));
    // sort by timestamp numeric ascending
    files.sort((a, b) => {
      const ta = Number((a.match(/^snap_(\d+)\.json$/i) || [])[1] || "0");
      const tb = Number((b.match(/^snap_(\d+)\.json$/i) || [])[1] || "0");
      return ta - tb;
    });
    return files;
  }

  listLedgerEntries(limit = 5000): LedgerEntryV1[] {
    const out: LedgerEntryV1[] = [];
    for (const line of this.readLedgerLines()) {
      out.push(JSON.parse(line) as LedgerEntryV1);
      if (out.length >= limit) break;
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

  private computeEntryHash(entryWithoutEntryHash: Omit<LedgerEntryV1, "entryHash">): string {
    // entryHash is sha256(canonical(entryWithoutEntryHash))
    return sha256Hex(canonicalJson(entryWithoutEntryHash));
  }

  computeSnapshotSha256(snapshotFile: string) {
    const p = this.snapshotAbsPath(snapshotFile);
    const buf = fs.readFileSync(p);
    return sha256Hex(buf);
  }

  syncAppendMissing(): { appended: number; totalSnapshots: number; totalEntries: number } {
    const snapshots = this.listSnapshotFiles();
    const existing = new Set<string>();
    for (const line of this.readLedgerLines()) {
      const e = JSON.parse(line) as LedgerEntryV1;
      existing.add(e.snapshotFile);
    }

    let prev = this.readLastEntry();
    let appended = 0;

    for (const snapFile of snapshots) {
      if (existing.has(snapFile)) continue;

      const snapPath = this.snapshotAbsPath(snapFile);
      const st = fs.statSync(snapPath);
      const snapBuf = fs.readFileSync(snapPath);

      const snapshotSha256 = sha256Hex(snapBuf);
      const prevHash = prev ? prev.entryHash : null;

      const ts = Number((snapFile.match(/^snap_(\d+)\.json$/i) || [])[1] || Date.now());
      const id = `${ts}:${snapFile}`;

      const base: Omit<LedgerEntryV1, "entryHash"> = {
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
      const entry: LedgerEntryV1 = { ...base, entryHash };

      fs.appendFileSync(this.paths.ledgerNdjson, JSON.stringify(entry) + "\n", "utf8");
      prev = entry;
      appended++;
    }

    const head: LedgerHead = {
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

  private countEntriesFast(): number {
    const raw = fs.readFileSync(this.paths.ledgerNdjson, "utf8");
    if (!raw.trim()) return 0;
    return raw.split(/\r?\n/).filter(Boolean).length;
  }

  verifyFull(): {
    ok: boolean;
    checked: number;
    error?: string;
    firstBadIndex?: number;
  } {
    let prevHash: string | null = null;
    let i = 0;

    try {
      for (const line of this.readLedgerLines()) {
        const e = JSON.parse(line) as LedgerEntryV1;

        // 1) chain
        if (e.prevHash !== prevHash) {
          return { ok: false, checked: i, firstBadIndex: i, error: `CHAIN_MISMATCH at index=${i}` };
        }

        // 2) snapshot exists + bytes hash
        if (!fs.existsSync(e.snapshotPath)) {
          return { ok: false, checked: i, firstBadIndex: i, error: `SNAPSHOT_MISSING ${e.snapshotPath}` };
        }
        const buf = fs.readFileSync(e.snapshotPath);
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
    } catch (err: any) {
      return { ok: false, checked: i, firstBadIndex: i, error: String(err?.message || err) };
    }
  }

  export(format: "ndjson" | "json"): { format: string; content: string } {
    const nd = fs.readFileSync(this.paths.ledgerNdjson, "utf8");
    if (format === "ndjson") return { format, content: nd };

    const arr = nd.split(/\r?\n/).filter(Boolean).map(l => JSON.parse(l) as LedgerEntryV1);
    return { format, content: JSON.stringify(arr, null, 2) };
  }
}

