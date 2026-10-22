import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { fetchFormalDefaultConfig } from '../../src/configStudio/formalDefault';
import { loadDefaultConfig } from '../../src/configStudio/defaultConfigProvider';
import { migrateConfigToR12 } from '../../src/configStudio/r12Migration';
import { migrateConfigToR13 } from '../../src/configStudio/r13Migration';
import { hasStudioDraft, type StudioEditingSession } from '../../src/configStudio/studioSession';
import { getFormalConfiguration, type ConfigurationIdentity } from '../../src/configRuntime/formalConfiguration';

Object.assign(globalThis, { location: new URL('https://cmap.ria9.top/') });
const seed = JSON.parse(fs.readFileSync('src/configStudio/defaults/r11-r7.config.json', 'utf8'));
const originalFetch = globalThis.fetch;
let bytes: Buffer, pointer: ConfigurationIdentity, status = 200, changeAfterBody = false;
const requests: string[] = [];
function select(config: typeof seed) {
  bytes = Buffer.from(JSON.stringify(config));
  const hash = createHash('sha256').update(bytes).digest('hex');
  pointer = { releaseId: `test-${hash}`, packageId: config.packageId, projectId: config.projectId, revision: config.revision, contractRevision: config.contractRevision, configSha256: hash, manifestSha256: 'a'.repeat(64), configUrl: `/configuration/releases/${hash}/config.json` };
}
globalThis.fetch = async (input, options) => {
  const url = String(input);requests.push(url);
  assert(url.startsWith('/configuration/'), 'defaults must never call SCF, login, publication or the historical seed URL');
  assert(options?.signal, 'explicit reset requests have a timeout');
  if (url === '/configuration/current.json') {
    assert.equal(options.cache, 'no-cache');
    return new Response(JSON.stringify(pointer), { status });
  }
  assert.equal(url, pointer.configUrl);assert.equal(options.cache, 'force-cache');
  if (changeAfterBody) pointer = { ...pointer, releaseId: 'concurrent-publication' };
  return new Response(bytes);
};
try {
  for (const config of [seed, migrateConfigToR12(seed).config, migrateConfigToR13(seed).config]) {
    select(config);
    const loaded = await fetchFormalDefaultConfig();
    assert.equal(loaded.contractRevision, config.contractRevision);
    assert.equal(loaded.revision, config.revision);
  }
  select(migrateConfigToR13(seed).config);
  bytes = Buffer.from('corrupt');
  await assert.rejects(fetchFormalDefaultConfig, /摘要/);
  select(seed);pointer = { ...pointer, revision: seed.revision + 1 };
  await assert.rejects(fetchFormalDefaultConfig, /身份/);
  const invalid = structuredClone(seed);invalid.nodes.push(invalid.nodes[0]);select(invalid);
  await assert.rejects(fetchFormalDefaultConfig, /核验未通过/);
  select(seed);pointer = { ...pointer, configUrl: 'https://other.example/config.json' };
  await assert.rejects(fetchFormalDefaultConfig, /受控/);
  select(seed);changeAfterBody = true;
  await assert.rejects(fetchFormalDefaultConfig, /读取期间正式配置已更新/);changeAfterBody = false;
  select(seed);status = 503;
  await assert.rejects(loadDefaultConfig, /503/);
  select(migrateConfigToR13(seed).config);status = 200;
  assert.equal((await loadDefaultConfig()).contractRevision, 13, 'a failed default load is retryable');
  assert.equal(getFormalConfiguration(), undefined, 'reading the editor default must not activate or replace the map');
  const session: StudioEditingSession = { baseline: seed, draft: null, tree: null, selectedId: '', editing: false };
  assert.equal(hasStudioDraft(session), false);
  for (const field of ['draft', 'tree', 'editing', 'lookupDraft', 'engineDraft', 'packageCandidate', 'workflowSession', 'generalDrafts']) {
    assert.equal(hasStudioDraft({ ...session, [field]: field === 'generalDrafts' ? { preferences: {} } : true } as StudioEditingSession), true, field);
  }
  console.log(`Studio formal defaults: contracts r11/r12/r13, hashes, identity, controlled URLs, publication race, retry and all draft scopes passed (${requests.length} static requests; zero SCF calls).`);
} finally { globalThis.fetch = originalFetch; }
