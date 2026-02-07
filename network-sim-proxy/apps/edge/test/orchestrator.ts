import { emitVehicleDetected, emitAnprOk, emitAnprFail } from "../src/hardware/anpr";
import { emitDocumentDetected } from "../src/hardware/ocr";
import { emitWeightStable } from "../src/hardware/scale";
import { emitExitIdentify, emitExitWeightStable, closeStay } from "../src/hardware/exit";
import { verifyLedger } from "../src/ledger/verify";

/**
 * ESCENARIO S1 — Patente autorizada (flujo OK)
 */
export async function S1_autorizado() {
  emitVehicleDetected();
  emitAnprOk("ABC123");
  emitDocumentDetected("DOC-001");
  emitWeightStable(28500);
}

/**
 * ESCENARIO S2 — Patente NO autorizada
 */
export async function S2_no_autorizado() {
  emitVehicleDetected();
  emitAnprOk("XYZ999");
}

/**
 * ESCENARIO S3 — Falla ANPR
 */
export async function S3_anpr_fail() {
  emitVehicleDetected();
  emitAnprFail();
}

/**
 * ESCENARIO S4 — Documento + peso OK
 */
export async function S4_doc_y_peso_ok() {
  emitDocumentDetected("DOC-002");
  emitWeightStable(30000);
}

/**
 * ESCENARIO S5 — Peso OK sin documento
 */
export async function S5_peso_sin_doc() {
  emitWeightStable(30000);
}

/**
 * ESCENARIO S6 — Salida correcta
 */
export async function S6_salida_ok() {
  emitExitIdentify("ABC123");
  emitExitWeightStable(29000);
  closeStay();
}

/**
 * ESCENARIO S7 — Salida con patente incorrecta
 */
export async function S7_salida_patente_erronea() {
  emitExitIdentify("ZZZ000");
}

/**
 * Auditoría de integridad
 */
export async function audit() {
  return verifyLedger();
}
