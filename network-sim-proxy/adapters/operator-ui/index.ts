/**
 * ADAPTADOR OPERATOR UI — SKELETON
 * Estado: OPERATIVO (SIN LÓGICA)
 *
 * Este módulo:
 * - Registra acciones humanas
 * - Traduce input del operador a AdapterEventIn
 * - NO valida reglas
 * - NO decide flujo
 */

import { AdapterEventIn } from '../../protocols/adapter-event-in';

export interface OperatorUIInputSignal {
  operatorId: string;
  stationId: string;
  action: string;                 // acción declarada por el operador
  executedAt: string;             // ISO-8601
  rawPayload?: Record<string, any>;
}

export function mapOperatorUISignalToEvent(
  signal: OperatorUIInputSignal
): AdapterEventIn {
  return {
    adapterKind: 'OPERATOR_UI',
    adapterId: signal.stationId,

    observedAt: signal.executedAt,
    receivedAt: new Date().toISOString(),

    payload: {
      operatorId: signal.operatorId,
      action: signal.action,
      ...(signal.rawPayload ?? {}),
    },
  };
}
