// src/adapter/scaleAdapter.ts

import { EventBus } from "../infrastructure/eventBus";

export type ScaleStatus =
  | "IDLE"
  | "STABILIZING"
  | "STABLE"
  | "ERROR";

export interface ScaleReading {
  grossWeightKg: number;
  timestamp: number;
  stable: boolean;
}

export interface ScaleAdapterContract {
  getStatus(): ScaleStatus;
  requestStabilization(): void;
  readWeight(): ScaleReading | null;
  reset(): void;
}

export class ScaleAdapter implements ScaleAdapterContract {
  private status: ScaleStatus = "IDLE";
  private lastReading: ScaleReading | null = null;
  private stabilizationStartedAt: number | null = null;

  private readonly MIN_STABILIZATION_MS = 1500;
  private readonly MAX_STABILIZATION_MS = 10000;

  constructor(private eventBus: EventBus) {}

  getStatus(): ScaleStatus {
    return this.status;
  }

  requestStabilization(): void {
    if (this.status !== "IDLE") return;

    this.status = "STABILIZING";
    this.stabilizationStartedAt = Date.now();

    this.eventBus.emit("ScaleStabilizationRequested", {
      at: this.stabilizationStartedAt,
    });
  }

  readWeight(): ScaleReading | null {
    if (this.status !== "STABLE") return null;
    return this.lastReading;
  }

  reset(): void {
    this.status = "IDLE";
    this.lastReading = null;
    this.stabilizationStartedAt = null;

    this.eventBus.emit("ScaleReset", {
      at: Date.now(),
    });
  }

  // === INTERNAL — simulation only ===
  internalSetStableWeight(weightKg: number) {
    if (this.status !== "STABILIZING") {
      this.internalFail("WEIGHT_SET_OUT_OF_SEQUENCE");
      return;
    }

    const now = Date.now();
    const elapsed = now - (this.stabilizationStartedAt ?? now);

    if (elapsed < this.MIN_STABILIZATION_MS) {
      this.internalFail("UNSTABLE_TOO_FAST");
      return;
    }

    if (elapsed > this.MAX_STABILIZATION_MS) {
      this.internalFail("STABILIZATION_TIMEOUT");
      return;
    }

    if (weightKg <= 0) {
      this.internalFail("INVALID_WEIGHT");
      return;
    }

    this.lastReading = {
      grossWeightKg: weightKg,
      timestamp: now,
      stable: true,
    };

    this.status = "STABLE";

    this.eventBus.emit("ScaleWeightStabilized", {
      weightKg,
      at: now,
    });
  }

  internalFail(reason: string) {
    this.status = "ERROR";
    this.lastReading = null;

    this.eventBus.emit("ScaleError", {
      reason,
      at: Date.now(),
    });
  }
}
