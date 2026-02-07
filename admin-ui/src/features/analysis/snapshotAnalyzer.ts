import { analysisRules as baseRules } from "../../config/analysisRules";

let liveRules = { ...baseRules };

export function setLiveRules(next: any) {
  liveRules = { ...liveRules, ...next };
}

export function analyzeSnapshot(data: any) {
  if (!data || typeof data !== "object") {
    return { level: "error", summary: "Snapshot inválido", details: [] };
  }

  const keys = Object.keys(data);
  const details: string[] = [];
  let level: "ok" | "warning" | "error" = "ok";

  if (keys.length < liveRules.minKeys || keys.length > liveRules.maxKeys) {
    level = liveRules.severity.sizeOutOfRange;
    details.push("Cantidad de claves fuera de rango normal");
  }

  for (const k of liveRules.expectedKeys) {
    if (!(k in data)) {
      level = liveRules.severity.missingExpectedKey;
      details.push(`Falta clave esperada: ${k}`);
    }
  }

  return {
    level,
    summary: level === "ok" ? "Snapshot normal" : "Snapshot con observaciones",
    details
  };
}
