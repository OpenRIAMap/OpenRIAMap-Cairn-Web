import fs from 'node:fs';
import {createHash} from 'node:crypto';
import type {ConfigPackageV3} from '../../../src/configStudio/types';

/** Migration/render regressions use an immutable source, never the active pointer.
 * Production-build checks separately validate whichever configuration is active. */
export function readC14MigrationSource(){
  const sha='dec9ae55a65517c5c0dcc28b52f829ab5f3bd481f7af95d8f5cd9a7332a68f8c';
  const release=JSON.parse(fs.readFileSync(`public/configuration/releases/${sha}/release.json`,'utf8'));
  const bytes=fs.readFileSync(`public/configuration/releases/${sha}/config.json`);
  const config=JSON.parse(bytes.toString('utf8')) as ConfigPackageV3;
  if(createHash('sha256').update(bytes).digest('hex')!==sha||release.identity.configSha256!==sha||config.contractRevision!==14||config.revision!==13)throw Error('Immutable c14 migration source identity mismatch.');
  return {identity:release.identity,bytes,config};
}
