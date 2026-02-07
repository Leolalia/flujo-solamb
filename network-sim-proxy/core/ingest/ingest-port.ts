/**
 * INGEST PORT — EVENT ENTRYPOINT
 * Estado: CONGELADO
 *
 * ÚNICO punto permitido de ingreso de eventos al CORE.
 * Gate técnico:
 * - Verifica dispositivo registrado
 * - Verifica dispositivo habilitado
 * NO interpreta payload
 * NO decide lógica de dominio
 */

import { AdapterEventIn } from '../../protocols/adapter-event-in';
import { getDevice } from '../devices/device-registry';

export interface IngestResult {
  accepted: boolean;
  eventId: string;
  receivedAt: string;
  reason?: string;
}

export type IngestHandler = (event: AdapterEventIn) => IngestResult;

function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Implementación mínima del gate técnico.
 * La lógica de dominio EXISTENTE se encadena luego.
 */
export const ingestEvent: IngestHandler = (event) => {
  const device = getDevice(event.adapterId);

  if (!device) {
    return {
      accepted: false,
      eventId: '',
      receivedAt: new Date().toISOString(),
      reason: 'DEVICE_NOT_REGISTERED',
    };
  }

  if (!device.enabled) {
    return {
      accepted: false,
      eventId: '',
      receivedAt: new Date().toISOString(),
      reason: 'DEVICE_DISABLED',
    };
  }

  return {
    accepted: true,
    eventId: generateEventId(),
    receivedAt: new Date().toISOString(),
  };
};
