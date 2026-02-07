/**
 * ADAPTADOR OCR — SKELETON
 * Estado: OPERATIVO (SIN LÓGICA)
 *
 * Este módulo:
 * - Recibe imágenes/documentos OCR
 * - Traduce señal cruda a AdapterEventIn
 * - NO interpreta texto
 * - NO valida documentos
 * - NO decide
 */

import { AdapterEventIn } from '../../protocols/adapter-event-in';

export interface OCRInputSignal {
  sourceId: string;              // cámara / scanner
  capturedAt: string;            // ISO-8601
  rawPayload: Record<string, any>;
  evidence?: {
    uri: string;
    sha256: string;
  };
}

export function mapOCRSignalToEvent(
  signal: OCRInputSignal
): AdapterEventIn {
  return {
    adapterKind: 'OCR',
    adapterId: signal.sourceId,

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
