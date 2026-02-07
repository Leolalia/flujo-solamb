export type IngestPayload = {
  outboxId: string;
  edgeId: string;
  kind: string;
  canonical: string;
  hash: string;
  prevHash?: string | null;
  occurredAt: string;
  payload: unknown;
};

export type AckResponse = {
  status: "applied" | "duplicate";
  ackId: string;
  outboxId: string;
  serverTime: string;
};
