/**
 * ADAPTADOR ANPR — SKELETON
 * Estado: OPERATIVO (SIN LÓGICA)
 *
 * Este módulo:
 * - Recibe señales de cámaras ANPR
 * - Traduce a AdapterEventIn
 * - NO interpreta patentes
 * - NO decide
 * - NO muta estado
 */

import { AdapterEventIn } from '../../protocols/adapter-event-in';

export interface ANPRInputSignal {
  cameraId: string;
  capturedAt: string;           // ISO-8601
  rawPayload: Record<string, any>;
  evidence?: {
    uri: string;
    sha256: string;
  };
}

export function mapANPRSignalToEvent(
  signal: ANPRInputSignal
): AdapterEventIn {
  return {
    adapterKind: 'ANPR',
    adapterId: signal.cameraId,

    observedAt: signal.capturedAt,
    receivedAt: new Date().toISOString(),

    payload: signal.rawPayload,

    evidences: signal.evidence
      ? [
          {
            type: 'image',
            uri: signal.evidence.uri,
            sha256: signal.evidence.sha256,
          },
        ]
      : undefined,
  };
}
