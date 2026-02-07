/**
 * ADAPTADOR IMPRESORA — SKELETON
 * Estado: OPERATIVO (SIN LÓGICA)
 *
 * Este módulo:
 * - Recibe órdenes de impresión
 * - Registra acción física ejecutada
 * - NO arma tickets
 * - NO valida contenido
 * - NO decide
 */

import { AdapterEventIn } from '../../protocols/adapter-event-in';

export interface PrinterInputSignal {
  printerId: string;
  executedAt: string;            // ISO-8601
  rawPayload: Record<string, any>;
}

export function mapPrinterSignalToEvent(
  signal: PrinterInputSignal
): AdapterEventIn {
  return {
    adapterKind: 'PRINTER',
    adapterId: signal.printerId,

    observedAt: signal.executedAt,
    receivedAt: new Date().toISOString(),

    payload: signal.rawPayload,
  };
}
