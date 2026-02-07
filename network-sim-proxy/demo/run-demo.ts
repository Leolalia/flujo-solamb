/**
 * RUN DEMO — SOLAMB EDGE
 * Estado: DEMO CONTROLADO
 *
 * Muestra en consola:
 * - Registro de dispositivos demo
 * - Emisión de eventos desde adaptadores
 * - Paso por Ingest Gate
 *
 * NO UI
 * NO hardware
 * NO lógica de negocio
 */

import { registerDevice } from '../core/devices/device-registry';
import { mapANPRSignalToEvent } from '../adapters/anpr';
import { mapOCRSignalToEvent } from '../adapters/ocr';
import { mapScaleSignalToEvent } from '../adapters/scale';
import { mapBarrierSignalToEvent } from '../adapters/barrier';
import { mapPrinterSignalToEvent } from '../adapters/printer';
import { emitToCore } from '../adapters/wiring';

// 1) Registro de dispositivos DEMO
console.log('== REGISTRANDO DISPOSITIVOS DEMO ==');

registerDevice({
  deviceId: 'DEMO_ANPR_01',
  adapterKind: 'ANPR',
  manufacturer: 'DEMO',
  model: 'ANPR_CAM',
  serialNumber: 'ANPR-001',
  firmwareVersion: '1.0',
  connectionType: 'VIRTUAL',
  location: 'LAB',
  registeredAt: new Date().toISOString(),
  enabled: true,
});

registerDevice({
  deviceId: 'DEMO_OCR_01',
  adapterKind: 'OCR',
  manufacturer: 'DEMO',
  model: 'OCR_CAM',
  serialNumber: 'OCR-001',
  firmwareVersion: '1.0',
  connectionType: 'VIRTUAL',
  location: 'LAB',
  registeredAt: new Date().toISOString(),
  enabled: true,
});

registerDevice({
  deviceId: 'DEMO_SCALE_01',
  adapterKind: 'SCALE',
  manufacturer: 'DEMO',
  model: 'SCALE',
  serialNumber: 'SCALE-001',
  firmwareVersion: '1.0',
  connectionType: 'VIRTUAL',
  location: 'LAB',
  registeredAt: new Date().toISOString(),
  enabled: true,
});

registerDevice({
  deviceId: 'DEMO_BARRIER_01',
  adapterKind: 'BARRIER',
  manufacturer: 'DEMO',
  model: 'BARRIER',
  serialNumber: 'BARRIER-001',
  firmwareVersion: '1.0',
  connectionType: 'VIRTUAL',
  location: 'LAB',
  registeredAt: new Date().toISOString(),
  enabled: true,
});

registerDevice({
  deviceId: 'DEMO_PRINTER_01',
  adapterKind: 'PRINTER',
  manufacturer: 'DEMO',
  model: 'PRINTER',
  serialNumber: 'PRINTER-001',
  firmwareVersion: '1.0',
  connectionType: 'VIRTUAL',
  location: 'LAB',
  registeredAt: new Date().toISOString(),
  enabled: true,
});

// 2) Emisión de eventos DEMO
console.log('\n== EMITIENDO EVENTOS DEMO ==');

// ANPR
const anprEvent = mapANPRSignalToEvent({
  cameraId: 'DEMO_ANPR_01',
  capturedAt: new Date().toISOString(),
  rawPayload: { frame: 'frame001' },
});
console.log('[ANPR]', emitToCore(anprEvent));

// OCR
const ocrEvent = mapOCRSignalToEvent({
  sourceId: 'DEMO_OCR_01',
  capturedAt: new Date().toISOString(),
  rawPayload: { doc: 'carta_porte' },
});
console.log('[OCR]', emitToCore(ocrEvent));

// SCALE
const scaleEvent = mapScaleSignalToEvent({
  scaleId: 'DEMO_SCALE_01',
  measuredAt: new Date().toISOString(),
  rawPayload: { weight: 32000 },
});
console.log('[SCALE]', emitToCore(scaleEvent));

// BARRIER
const barrierEvent = mapBarrierSignalToEvent({
  barrierId: 'DEMO_BARRIER_01',
  action: 'OPEN',
  executedAt: new Date().toISOString(),
});
console.log('[BARRIER]', emitToCore(barrierEvent));

// PRINTER
const printerEvent = mapPrinterSignalToEvent({
  printerId: 'DEMO_PRINTER_01',
  executedAt: new Date().toISOString(),
  rawPayload: { ticket: 'print' },
});
console.log('[PRINTER]', emitToCore(printerEvent));

console.log('\n== DEMO FINALIZADA ==');
