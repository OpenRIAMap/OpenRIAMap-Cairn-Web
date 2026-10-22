import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { verifyPublishedMirror, verifyPublishedRelease } from './productionMirror';

/** First-stage mirror commits have not moved current yet. Validate every
 * immutable directory as well, including the candidate awaiting deployment. */
export async function validateProductionBuild(publicRoot = path.resolve('public')) {
  const current = await verifyPublishedMirror(publicRoot);
  const entries = await fs.readdir(path.join(publicRoot,'configuration/releases'),{withFileTypes:true});
  let count = 0;
  for (const entry of entries) {
    if (!entry.isDirectory() || !/^[a-f0-9]{64}$/.test(entry.name)) throw Error(`Invalid configuration release directory: ${entry.name}`);
    const release = JSON.parse(await fs.readFile(path.join(publicRoot,'configuration/releases',entry.name,'release.json'),'utf8'));
    if (release.identity?.configSha256 !== entry.name) throw Error('Release directory does not match configuration identity');
    await verifyPublishedRelease(publicRoot,release.identity);
    count++;
  }
  return {current:current.identity,verifiedReleases:count};
}
if (process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  console.log(JSON.stringify(await validateProductionBuild()));
}
