export type AppMode = 'SIMULATION' | 'PRODUCTION';

export function getAppMode(): AppMode {
  return 'PRODUCTION';
}

export function isProduction(): boolean {
  return getAppMode() === 'PRODUCTION';
}
