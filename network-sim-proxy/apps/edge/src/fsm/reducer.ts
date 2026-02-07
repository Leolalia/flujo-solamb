import { EdgeContext, EdgeEvent } from "../core/events.js";

export function reduce(ctx: EdgeContext, ev: EdgeEvent): EdgeContext {
  const base = { ...ctx, lastEvent: ev };

  switch (ctx.state) {
    case "IDLE":
      if (ev.type === "VEHICLE") return { state: "ARRIVAL", data: {}, lastEvent: ev };
      return base;

    case "ARRIVAL":
      if (ev.type === "ANPR_OK") return { state: "ANPR_OK", data: { plate: ev.plate }, lastEvent: ev };
      return base;

    case "ANPR_OK":
      if (ev.type === "BARRIER_OPEN") return { state: "BARRIER_OPEN", data: ctx.data, lastEvent: ev };
      return base;

    case "BARRIER_OPEN":
      if (ev.type === "WEIGH") return { state: "WEIGHING", data: { ...ctx.data, kg: ev.kg }, lastEvent: ev };
      return base;

    case "WEIGHING":
      if (ev.type === "OCR_OK") return { state: "OCR_OK", data: { ...ctx.data, docId: ev.docId }, lastEvent: ev };
      return base;

    case "OCR_OK":
      if (ev.type === "STATUS") return { state: "IN_PLANT", data: ctx.data, lastEvent: ev };
      return base;

    case "IN_PLANT":
      if (ev.type === "EXIT") return { state: "EXITING", data: ctx.data, lastEvent: ev };
      return base;

    case "EXITING":
      if (ev.type === "TICKET") return { state: "TICKETED", data: ctx.data, lastEvent: ev };
      return base;

    default:
      return base;
  }
}
