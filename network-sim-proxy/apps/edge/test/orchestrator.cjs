const {
  emitVehicleDetected,
  emitAnprOk,
  emitAnprFail
} = require("../src/hardware/anpr");

const { emitDocumentDetected } = require("../src/hardware/ocr");
const { emitWeightStable } = require("../src/hardware/scale");
const {
  emitExitIdentify,
  emitExitWeightStable,
  closeStay
} = require("../src/hardware/exit");

const { verifyLedger } = require("../src/ledger/verify");

// S1 — Patente autorizada
async function S1_autorizado() {
  emitVehicleDetected();
  emitAnprOk("ABC123");
  emitDocumentDetected("DOC-001");
  emitWeightStable(28500);
}

// S2 — Patente NO autorizada
async function S2_no_autorizado() {
  emitVehicleDetected();
  emitAnprOk("XYZ999");
}

// S3 — Falla ANPR
async function S3_anpr_fail() {
  emitVehicleDetected();
  emitAnprFail();
}

// S6 — Salida OK
async function S6_salida_ok() {
  emitExitIdentify("ABC123");
  emitExitWeightStable(29000);
  closeStay();
}

// Auditoría
async function audit() {
  return verifyLedger();
}

module.exports = {
  S1_autorizado,
  S2_no_autorizado,
  S3_anpr_fail,
  S6_salida_ok,
  audit
};
