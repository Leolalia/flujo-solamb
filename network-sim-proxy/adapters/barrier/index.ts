/**
 * ADAPTADOR BARRERA — SKELETON
 * Estado: OPERATIVO (SIN LÓGICA)
 *
 * Este módulo:
 * - Registra acciones físicas de barrera
 * - Traduce señal cruda a AdapterEventIn
 * - NO decide cuándo abrir/cerrar
 * - NO valida condiciones
 */

import { AdapterEventIn } from '../../protocols/adapter-event-in';

export interface BarrierInputSignal {
  barrierId: string;
  action: 'OPEN' | 'CLOSE';
  executedAt: string;            // ISO-8601
  rawPayload?: Record<string, any>;
}

export function mapBarrierSignalToEvent(
  signal: BarrierInputSignal
): AdapterEventIn {
  return {
    adapterKind: 'BARRIER',
    adapterId: signal.barrierId,

    observedAt: signal.executedAt,
    receivedAt: new Date().toISOString(),

    payload: {
      action: signal.action,
      ...(signal.rawPayload ?? {}),
    },
  };
}
