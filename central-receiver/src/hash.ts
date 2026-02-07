import crypto from "crypto";

const algo = process.env.HASH_ALGO || "sha256";

export function computeHash(canonical: string): string {
  return crypto.createHash(algo).update(canonical).digest("hex");
}

export {};
