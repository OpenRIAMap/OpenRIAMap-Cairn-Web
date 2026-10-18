import {build as bundle} from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import JSZip from 'jszip';
import { build } from 'vite';
import react from '@vitejs/plugin-react';

const root = resolve(import.meta.dirname, '../..');
const frozen = resolve(root, 'legacy-v1');
const stage = resolve(root, 'node_modules/.cache/cairnmap-legacy-v1');
const archive = await readFile(resolve(frozen, 'source-5b3e9c2.zip'));
const manifest = JSON.parse(await readFile(resolve(frozen, 'manifest.json'), 'utf8'));
if (createHash('sha256').update(archive).digest('hex') !== manifest.archiveSha256) throw Error('V1 frozen archive digest mismatch');
const zip = await JSZip.loadAsync(archive);
for (const entry of Object.values(zip.files)) {
  if (entry.dir) continue;
  if (!/^(src|project-config|public|\.cairn)\//.test(entry.name) || entry.name.split('/').includes('..')) throw Error('Unsafe frozen path');
  const target = resolve(stage, entry.name);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, await entry.async('nodebuffer'));
}
for (const [source, target] of [['App.tsx', 'App.tsx'], ['isolation.ts', 'isolation.ts'], ['filter.ts', 'legacyFilter.ts']]) {
  await writeFile(resolve(stage, 'src', target), await readFile(resolve(frozen, source)));
}
async function patch(file, from, to) {
  const path = resolve(stage, 'src', file), text = await readFile(path, 'utf8');
  if (!text.includes(from)) throw Error(`Frozen adapter anchor changed: ${file}`);
  await writeFile(path, text.replaceAll(from, to));
}
await patch('components/Rules/data/worldRuleDatasetLoader.ts', "import type { ProgressCallback }", "import {filterLegacyDataset} from '../../../legacyFilter';\nimport type { ProgressCallback }");
await patch('components/Rules/data/worldRuleDatasetLoader.ts', 'if(!source.resourceGroupId)return dataset;', 'if(!source.resourceGroupId)return filterLegacyDataset(dataset);');
await patch('components/Rules/data/worldRuleDatasetLoader.ts', 'return {...dataset,worldId,resourceGroupId:', 'return filterLegacyDataset({...dataset,worldId,resourceGroupId:');
await patch('components/Rules/data/worldRuleDatasetLoader.ts', '})):dataset.features};', '})):dataset.features});');
await patch('lib/cookies.ts', "const COOKIE_NAME = 'map_settings';", "const COOKIE_NAME = 'legacy_v1_map_settings';");
// V1 has no authoring/publication entry; its old frozen UI remains otherwise intact.
await patch('components/Settings/SettingsPanel.tsx', '{onOpenConfigStudio ? (', '{false && onOpenConfigStudio ? (');
await writeFile(resolve(stage, 'index.html'), '<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CairnMap · V1 兼容</title></head><body><div id="root"></div><script type="module" src="/src/isolation.ts"></script></body></html>');
await bundle({entryPoints:[resolve(stage,'src/legacyFilter.ts')],outfile:resolve(stage,'legacy-filter.mjs'),bundle:true,format:'esm',platform:'node'});
await build({ configFile: false, root: stage, base: '/legacy-v1/runtime/', plugins: [react()],
  define: { __APP_VERSION__: JSON.stringify('legacy-v1-5b3e9c2') },
  resolve: { alias: { '@': resolve(stage, 'src') } },
  css: { postcss: resolve(root, 'postcss.config.js') },
  build: { outDir: resolve(root, 'dist/legacy-v1/runtime'), emptyOutDir: true },
});
