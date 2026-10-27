import fs from 'node:fs';
import { createHash } from 'node:crypto';
import type { ConfigPackageV3 } from '../../../src/configStudio/types';

/** Freeze the real c15 source. A newer active pointer is not migration input. */
export function readC16MigrationSource(): ConfigPackageV3 {
  const sha = '44e87b2a96db47e7b2b8abaf1bd19f1e1c3bc54fb501bc0df6a28c18bb756d07';
  const bytes = fs.readFileSync(`public/configuration/releases/${sha}/config.json`);
  const config = JSON.parse(bytes.toString('utf8')) as ConfigPackageV3;
  if (createHash('sha256').update(bytes).digest('hex') !== sha || config.contractRevision !== 15) throw Error('Immutable c16 migration source identity mismatch');
  return config;
}
