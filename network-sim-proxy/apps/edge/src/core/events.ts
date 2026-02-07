export type EdgeState =
  | "IDLE"
  | "ARRIVAL"
  | "ANPR_OK"
  | "BARRIER_OPEN"
  | "WEIGHING"
  | "OCR_OK"
  | "IN_PLANT"
  | "EXITING"
  | "TICKETED";

export type EdgeEvent =
  | { type: "VEHICLE"; at: number; plate?: string }
  | { type: "ANPR_OK"; at: number; plate: string }
  | { type: "ANPR_FAIL"; at: number }
  | { type: "BARRIER_OPEN"; at: number }
  | { type: "WEIGH"; at: number; kg: number }
  | { type: "OCR_OK"; at: number; docId: string }
  | { type: "EXIT"; at: number }
  | { type: "TICKET"; at: number }
  | { type: "STATUS"; at: number };

export interface EdgeContext {
  state: EdgeState;
  data?: Record<string, any>;
  lastEvent?: EdgeEvent;
}
