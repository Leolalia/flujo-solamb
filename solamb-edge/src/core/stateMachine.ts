// src/core/stateMachine.ts

import { EventBus } from "../infrastructure/eventBus";

export type SystemState =
  | "BOOTING"
  | "IDLE"
  | "TRUCK_ARRIVED"
  | "OCR_READING"
  | "READY"
  | "WEIGHING"
  | "WEIGHED";

export class StateMachine {
  private state: SystemState = "BOOTING";
  private lastGrossWeightKg: number | null = null;
  private weightLocked = false;

  constructor(private eventBus: EventBus) {
    this.eventBus.on("ScaleWeightStabilized", (e) => {
      if (this.state !== "WEIGHING") return;
      if (this.weightLocked) return;

      this.lastGrossWeightKg = e.weightKg;
      this.weightLocked = true;

      // SNAPSHOT INMUTABLE
      this.eventBus.emit("WeighingSnapshotCreated", {
        grossWeightKg: e.weightKg,
        stabilizedAt: e.at,
        source: "SCALE",
        version: 1,
      });

      this.transition("WEIGHED");
    });

    this.eventBus.on("ScaleError", () => {
      // No transición
    });
  }

  private transition(next: SystemState): void {
    const prev = this.state;
    this.state = next;

    this.eventBus.emit("StateTransition", {
      from: prev,
      to: next,
      at: Date.now(),
    });
  }

  boot(): void {
    if (this.state !== "BOOTING") return;
    this.transition("IDLE");
  }

  truckArrived(): void {
    if (this.state !== "IDLE") return;
    this.transition("TRUCK_ARRIVED");
  }

  ocrRead(): void {
    if (this.state !== "TRUCK_ARRIVED") return;
    this.transition("OCR_READING");
  }

  ready(): void {
    if (this.state !== "OCR_READING") return;
    this.transition("READY");
  }

  startWeighing(): void {
    if (this.state !== "READY") return;
    if (this.weightLocked) return;
    this.transition("WEIGHING");
  }
}
