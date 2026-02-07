// src/infrastructure/eventBus.ts

export interface WeighingSnapshotEvent {
  grossWeightKg: number;
  stabilizedAt: number;
  source: "SCALE";
  version: number;
}

export type EventMap = {
  StateTransition: {
    from: string;
    to: string;
    at: number;
  };
  ScaleStabilizationRequested: {
    at: number;
  };
  ScaleWeightStabilized: {
    weightKg: number;
    at: number;
  };
  ScaleReset: {
    at: number;
  };
  ScaleError: {
    reason: string;
    at: number;
  };
  WeighingSnapshotCreated: WeighingSnapshotEvent;
};

type EventHandler<T> = (payload: T) => void;

export class EventBus {
  private handlers: {
    [K in keyof EventMap]?: EventHandler<EventMap[K]>[];
  } = {};

  on<K extends keyof EventMap>(
    event: K,
    handler: EventHandler<EventMap[K]>
  ) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event]!.push(handler);
  }

  emit<K extends keyof EventMap>(
    event: K,
    payload: EventMap[K]
  ) {
    console.log(`[EVENT] ${event}`, payload);
    this.handlers[event]?.forEach((h) => h(payload));
  }
}
