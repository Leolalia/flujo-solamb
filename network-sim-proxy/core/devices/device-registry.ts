/**
 * DEVICE REGISTRY — EDGE RUNTIME
 * Estado: CONGELADO
 *
 * Registro autoritativo de dispositivos habilitados en planta.
 * - Append-only
 * - No muta historia
 * - No decide lógica de negocio
 */

import { AdapterKind } from '../../protocols/adapter-event-in';

export interface RegisteredDevice {
  deviceId: string;
  adapterKind: AdapterKind;

  manufacturer: string;
  model: string;
  serialNumber: string;
  firmwareVersion: string;

  connectionType: string;
  location?: string;

  registeredAt: string;      // ISO-8601
  enabled: boolean;
}

const registry: Map<string, RegisteredDevice> = new Map();

/**
 * Registro inicial del dispositivo.
 * Uso controlado por operaciones.
 */
export function registerDevice(device: RegisteredDevice): void {
  registry.set(device.deviceId, device);
}

/**
 * Consulta runtime (solo lectura).
 */
export function getDevice(deviceId: string): RegisteredDevice | undefined {
  return registry.get(deviceId);
}

/**
 * Listado completo (auditoría / diagnóstico).
 */
export function listDevices(): RegisteredDevice[] {
  return Array.from(registry.values());
}
