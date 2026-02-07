/**
 * ADAPTER WIRING — CORE INGEST
 * Estado: CONGELADO
 *
 * Este archivo:
 * - Conecta adaptadores con el Ingest Port
 * - NO transforma eventos
 * - NO valida
 * - NO decide
 */

import { ingestEvent } from '../core/ingest/ingest-port';
import { AdapterEventIn } from '../protocols/adapter-event-in';

export function emitToCore(event: AdapterEventIn) {
  return ingestEvent(event);
}
