import fetch from "node-fetch";

export type HttpOutboxItem = {
  outboxId: string;
  edgeId: string;
  kind: string;
  canonical: string;
  hash: string;
  prevHash?: string | null;
  occurredAt: string;
  payload: unknown;
};

export type HttpAck = {
  status: "applied" | "duplicate";
  ackId: string;
  outboxId: string;
  serverTime: string;
};

const CENTRAL_URL =
  process.env.CENTRAL_BASE_URL || "http://localhost:4010";

export async function sendOutboxItem(
  item: HttpOutboxItem
): Promise<HttpAck> {
  const res = await fetch(`${CENTRAL_URL}/v1/edge/ingest`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(item)
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(
      `central_http_error ${res.status}: ${txt}`
    );
  }

  return (await res.json()) as HttpAck;
}
