import type { StatusPayload } from '../../electron/preload/status';

declare global {
  interface Window {
    statusReadonly: {
      get: () => Promise<StatusPayload>;
    };
  }
}

export {};
