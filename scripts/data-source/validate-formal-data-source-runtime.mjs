#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const file = path.join(process.cwd(), '.cairn', 'formal-data-source-runtime.json');
const errors = [];
const requireValue = (condition, message) => { if (!condition) errors.push(message); };

let config;
try {
  config = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (error) {
  console.error(`Formal data source runtime: FAIL\n- cannot parse ${file}: ${error.message}`);
  process.exit(1);
}

requireValue(config?.schemaVersion === 'openriamap.formal-data-source-runtime.v1', 'schemaVersion is invalid');
requireValue(config?.projectId === 'openriamap-ria', 'projectId is invalid');
const selection = config?.selection;
const sources = Array.isArray(selection?.sources) ? selection.sources : [];
const bindings = Array.isArray(config?.bindings) ? config.bindings : [];
const githubRawTransport = config?.githubRawTransport;
const policy = selection?.policy ?? {};
requireValue(selection?.schemaVersion === 'cairnmap.data-source-selection.v1', 'selection schemaVersion is invalid');
requireValue(typeof selection?.storageKey === 'string' && selection.storageKey.length > 0, 'selection storageKey is required');
requireValue(policy.automaticFallback === false, 'automaticFallback must be false');
requireValue(policy.requireExplicitApply === true, 'requireExplicitApply must be true');
requireValue(sources.length > 0, 'sources must not be empty');
requireValue(bindings.length > 0, 'bindings must not be empty');

const sourceById = new Map();
for (const source of sources) {
  requireValue(typeof source?.id === 'string' && source.id.length > 0, 'source id is required');
  if (source?.id && sourceById.has(source.id)) errors.push(`duplicate source id: ${source.id}`);
  if (source?.id) sourceById.set(source.id, source);
  requireValue(typeof source?.readerKind === 'string' && source.readerKind.length > 0, `source readerKind is required: ${source?.id ?? '?'}`);
}
requireValue(sourceById.has(policy.defaultSourceId), 'defaultSourceId must identify a source');

const bindingIds = new Set();
for (const binding of bindings) {
  requireValue(typeof binding?.id === 'string' && sourceById.has(binding.id), `binding must identify a source: ${binding?.id ?? '?'}`);
  if (binding?.id && bindingIds.has(binding.id)) errors.push(`duplicate binding id: ${binding.id}`);
  if (binding?.id) bindingIds.add(binding.id);
  requireValue(typeof binding?.rootUrl === 'string' && /^https:\/\//.test(binding.rootUrl), `binding rootUrl must be HTTPS: ${binding?.id ?? '?'}`);
  requireValue(typeof binding?.readerSchemaVersion === 'string' && binding.readerSchemaVersion.length > 0, `binding readerSchemaVersion is required: ${binding?.id ?? '?'}`);
  requireValue(binding?.readerKind === sourceById.get(binding?.id)?.readerKind, `binding readerKind mismatch: ${binding?.id ?? '?'}`);
  requireValue(['direct', 'github-raw-compatible'].includes(binding?.transport ?? 'direct'), `binding transport is invalid: ${binding?.id ?? '?'}`);
}
for (const sourceId of sourceById.keys()) requireValue(bindingIds.has(sourceId), `source has no binding: ${sourceId}`);

const githubRawSourceIds = Array.isArray(githubRawTransport?.sourceIds) ? githubRawTransport.sourceIds : [];
const githubRepository = githubRawTransport?.repository ?? {};
const githubTransportBindings = bindings.filter((binding) => binding?.transport === 'github-raw-compatible').map((binding) => binding.id);
if (githubTransportBindings.length) {
  requireValue(githubRawSourceIds.length > 0, 'githubRawTransport sourceIds is required');
  requireValue(githubTransportBindings.every((id) => githubRawSourceIds.includes(id)), 'githubRawTransport must bind every github-raw-compatible source');
  requireValue(githubRawSourceIds.every((id) => sourceById.has(id)), 'githubRawTransport references unknown source');
  requireValue(typeof githubRepository.owner === 'string' && githubRepository.owner.length > 0, 'githubRawTransport repository owner is required');
  requireValue(typeof githubRepository.repo === 'string' && githubRepository.repo.length > 0, 'githubRawTransport repository repo is required');
  requireValue(typeof githubRepository.branch === 'string' && githubRepository.branch.length > 0, 'githubRawTransport repository branch is required');
}

if (errors.length) {
  console.error('Formal data source runtime: FAIL');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log('Formal data source runtime: PASS');
}
