#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, '.cairn/case-template-manifest.json'), 'utf8'));
const errors = [];
function canonicalTemplateBytes(file) {
  const bytes = fs.readFileSync(file);
  // The frozen showcase contains text configuration. Hash it with canonical LF
  // so a Windows CRLF checkout cannot falsely look like a semantic template edit.
  return Buffer.from(bytes.toString('utf8').replaceAll('\r\n', '\n'), 'utf8');
}
function list(relative) {
  const target = path.join(root, relative);
  if (fs.statSync(target).isFile()) return [target];
  return fs.readdirSync(target, { withFileTypes: true }).flatMap((entry) => list(path.join(relative, entry.name)));
}
for (const template of manifest.templates ?? []) {
  if (template.role !== 'template-only' || template.syncDirection !== 'none' || template.allowedChangeContext !== 'workflow-modularization') errors.push('template metadata is invalid');
  const rows = template.paths.flatMap(list).sort().map((file) => `${path.relative(root, file).replaceAll('\\', '/')}:${crypto.createHash('sha256').update(canonicalTemplateBytes(file)).digest('hex')}`);
  const hash = crypto.createHash('sha256').update(rows.join('\n')).digest('hex');
  if (hash !== template.sourceTreeSha256) errors.push('showcase snapshot hash changed outside an approved workflow-modularization change');
}
if (errors.length) { console.error('Case template manifest: FAIL'); errors.forEach((error) => console.error(`- ${error}`)); process.exitCode = 1; }
else console.log('Case template manifest: PASS');
