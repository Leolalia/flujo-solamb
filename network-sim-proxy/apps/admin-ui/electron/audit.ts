import fs from 'fs';
import { sha256Hex } from './crypto.js';

export class AuditService {
  constructor(private filePath: string) {}

  append(data: any) {
    const hash = sha256Hex(JSON.stringify(data));
    fs.appendFileSync(
      this.filePath,
      JSON.stringify({ ...data, hash }) + '\n',
      'utf8'
    );
  }
}
