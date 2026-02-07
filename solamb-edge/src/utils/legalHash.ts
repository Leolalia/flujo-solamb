// src/utils/legalHash.ts

import crypto from "crypto";

export function canonicalize(value: any): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);

  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(",")}]`;
  }

  const keys = Object.keys(value).sort();
  const entries = keys.map((k) => `${JSON.stringify(k)}:${canonicalize(value[k])}`);
  return `{${entries.join(",")}}`;
}

export function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input, "utf8").digest("hex");
}

export function buildLegalSnapshot(payload: any): {
  canonicalJson: string;
  hash: string;
} {
  const canonicalJson = canonicalize(payload);
  const hash = sha256Hex(canonicalJson);
  return { canonicalJson, hash };
}
