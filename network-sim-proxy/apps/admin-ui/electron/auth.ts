import fs from 'fs';
import { sha256Hex, randomHex } from './crypto.js';

export class AuthService {
  constructor(private filePath: string) {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(
        filePath,
        JSON.stringify({
          password: null,
          bootstrap: randomHex(6)
        }),
        'utf8'
      );
    }
  }

  verify(password: string) {
    const raw = fs.readFileSync(this.filePath, 'utf8');
    const data = JSON.parse(raw);
    if (!data.password) return { ok: false };
    if (sha256Hex(password) !== data.password) return { ok: false };
    return { ok: true };
  }
}
