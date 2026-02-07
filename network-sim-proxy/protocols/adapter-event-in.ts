/**
 * CONTRATO CANÓNICO — ADAPTER EVENT IN
 * Estado: CONGELADO
 * Autoridad: CORE
 *
 * Los adaptadores SOLO pueden emitir eventos que cumplan este contrato.
 * No hay lógica, no hay decisiones, no hay estado.
 */

export type AdapterKind =
  | 'ANPR'
  | 'OCR'
  | 'SCALE'
  | 'PRINTER'
  | 'BARRIER'
  | 'OPERATOR_UI';

export type EvidenceRef = {
  type: 'image' | 'pdf' | 'text' | 'binary';
  uri: string;          // ruta local o referencia interna
  sha256: string;       // hash del artefacto
};

export interface AdapterEventIn {
  // Identidad técnica
  adapterKind: AdapterKind;
  adapterId: string;          // serial, ip, nombre lógico
  manufacturer?: string;
  model?: string;

  // Tiempo observado (NO decide el sistema)
  observedAt: string;         // ISO-8601
  receivedAt: string;         // ISO-8601 (edge)

  // Payload crudo (sin interpretación)
  payload: Record<string, any>;

  // Evidencia asociada (opcional)
  evidences?: EvidenceRef[];

  // Metadatos técnicos
  meta?: {
    firmware?: string;
    sdk?: string;
    operatorId?: string;
  };
}
