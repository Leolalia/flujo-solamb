import crypto from 'crypto';

export function sha256Hex(data: string): string {
  return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
}

export function randomHex(bytes: number): string {
  return crypto.randomBytes(bytes).toString('hex');
}
