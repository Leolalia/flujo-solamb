import { sendOutboxItem } from "./httpOutboxTransport";

type ReplicationItem = {
  outboxId: string;
  edgeId: string;
  kind: string;
  canonical: string;
  hash: string;
  prevHash?: string | null;
  occurredAt: string;
  payload: unknown;
};

type ReplicationResult =
  | { ok: true }
  | { ok: false; retry: boolean; error: Error };

export class ReplicationQueue {
  private readonly inFlight = new Set<string>();

  async replicate(item: ReplicationItem): Promise<ReplicationResult> {
    if (this.inFlight.has(item.outboxId)) {
      return { ok: true };
    }

    this.inFlight.add(item.outboxId);

    try {
      const ack = await sendOutboxItem(item);

      if (ack.status === "applied" || ack.status === "duplicate") {
        return { ok: true };
      }

      return {
        ok: false,
        retry: true,
        error: new Error("unexpected_ack")
      };
    } catch (err: any) {
      return {
        ok: false,
        retry: true,
        error: err
      };
    } finally {
      this.inFlight.delete(item.outboxId);
    }
  }
}
