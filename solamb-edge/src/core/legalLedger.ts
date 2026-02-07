// src/core/legalLedger.ts

import { buildLegalSnapshot } from "../utils/legalHash";

export type LegalSnapshotType = "WeighingSnapshotCreated";

export type LegalLedgerInput = {
  type: LegalSnapshotType;
  version: number; // schema version
  scaleId: string;
  siteId: string;
  laneId: string;
  grossWeightKg: number;
  stabilizedAt: number;
  source: "SCALE";
};

export type LegalLedgerRecord = {
  hash: string;          // sha256(canonicalJson)
  prevHash: string | null; // chain
  type: LegalSnapshotType;
  canonicalJson: string; // canonical payload (WITHOUT prevHash)
  createdAt: number;
};

export function buildLegalLedgerRecord(
  input: LegalLedgerInput,
  prevHash: string | null,
  createdAt: number
): LegalLedgerRecord {
  // canonical payload MUST NOT include prevHash (prevHash is linkage, not content)
  const payload = {
    type: input.type,
    version: input.version,
    scaleId: input.scaleId,
    siteId: input.siteId,
    laneId: input.laneId,
    grossWeightKg: input.grossWeightKg,
    stabilizedAt: input.stabilizedAt,
    source: input.source
  };

  const { canonicalJson, hash } = buildLegalSnapshot(payload);

  return {
    hash,
    prevHash,
    type: input.type,
    canonicalJson,
    createdAt
  };
}
