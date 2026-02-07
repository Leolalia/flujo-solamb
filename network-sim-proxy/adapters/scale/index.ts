/**
 * ADAPTADOR BALANZA — SKELETON
 * Estado: OPERATIVO (SIN LÓGICA)
 *
 * Este módulo:
 * - Recibe lecturas de balanza
 * - Traduce señal cruda a AdapterEventIn
 * - NO valida peso
 * - NO calcula neto/tara
 * - NO decide
 */

import { AdapterEventIn } from '../../protocols/adapter-event-in';

export interface ScaleInputSignal {
  scaleId: string;
  measuredAt: string;            // ISO-8601
  rawPayload: Record<string, any>;
  evidence?: {
    uri: string;
    sha256: string;
  };
}

export function mapScaleSignalToEvent(
  signal: ScaleInputSignal
): AdapterEventIn {
  return {
    adapterKind: 'SCALE',
    adapterId: signal.scaleId,

    observedAt: signal.measuredAt,
    receivedAt: new Date().toISOString(),

    payload: signal.rawPayload,

    evidences: signal.evidence
      ? [
          {
            type: 'binary',
            uri: signal.evidence.uri,
            sha256: signal.evidence.sha256,
          },
        ]
      : undefined,
  };
}
