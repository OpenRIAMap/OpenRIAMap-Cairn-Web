#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { coreSharedDir } from './lib/audit-config-paths.mjs';

const root = process.cwd();
const sharedDir = coreSharedDir(root);
const formatContractsPath = path.join(sharedDir, 'format', 'formatRuntimeContracts.json');
const specialFormattersPath = path.join(sharedDir, 'format', 'formatSpecialFormatters.json');
const executorRegistryPath = path.join(root, 'src', 'core', 'project', 'formatExecutorRegistry.ts');

const messages = [];
let errors = 0;
let warnings = 0;

function add(level, message) {
  messages.push({ level, message });
  if (level === 'ERROR') errors += 1;
  if (level === 'WARN') warnings += 1;
}

function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    add('ERROR', `Unable to read JSON ${path.relative(root, filePath)}: ${error.message}`);
    return fallback;
  }
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    add('ERROR', `Unable to read text ${path.relative(root, filePath)}: ${error.message}`);
    return '';
  }
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalize(value) {
  return String(value ?? '').trim();
}

function normalizeClassCode(value) {
  return normalize(value).toUpperCase();
}

const formatContractsConfig = readJson(formatContractsPath, { items: [] });
const specialFormattersConfig = readJson(specialFormattersPath, { items: [] });
const executorRegistryText = readText(executorRegistryPath);

const specialFormatterKeys = new Set(
  asArray(specialFormattersConfig?.items)
    .map((item) => normalize(item?.key))
    .filter(Boolean)
);

const executorKeys = new Set();
for (const match of executorRegistryText.matchAll(/key:\s*['"]([^'"]+)['"]/g)) {
  const key = normalize(match[1]);
  if (key) executorKeys.add(key);
}
for (const match of executorRegistryText.matchAll(/passthroughExecutor\(\s*['"]([^'"]+)['"]/g)) {
  const key = normalize(match[1]);
  if (key) executorKeys.add(key);
}

for (const item of asArray(specialFormattersConfig?.items)) {
  const key = normalize(item?.key);
  if (!key) add('ERROR', 'formatSpecialFormatters contains item without key');
  else if (!executorKeys.has(key)) add('ERROR', `Missing built-in format executor for formatterKey: ${key}`);
}

for (const contract of asArray(formatContractsConfig?.items)) {
  const classCode = normalizeClassCode(contract?.classCode);
  const formatterKey = normalize(contract?.formatterKey);
  if (!formatterKey) continue;
  if (!specialFormatterKeys.has(formatterKey)) {
    add('ERROR', `${classCode || 'UNKNOWN'} references unregistered special formatter: ${formatterKey}`);
  }
  if (!executorKeys.has(formatterKey)) {
    add('ERROR', `${classCode || 'UNKNOWN'} references formatterKey without built-in executor: ${formatterKey}`);
  }
}

for (const key of executorKeys) {
  if (!specialFormatterKeys.has(key)) add('WARN', `Built-in format executor is not referenced by special formatter config: ${key}`);
}

console.log('CairnMap Format Executor Audit');
console.log('');
console.log('Summary');
console.log(`  Special formatter config keys: ${specialFormatterKeys.size}`);
console.log(`  Built-in executor keys: ${executorKeys.size}`);
console.log(`  Format contracts: ${asArray(formatContractsConfig?.items).length}`);
console.log(`  Errors: ${errors}`);
console.log(`  Warnings: ${warnings}`);

if (messages.length) {
  console.log('');
  console.log('Checks');
  for (const message of messages) console.log(`  [${message.level}] ${message.message}`);
}

console.log('');
const result = errors > 0 ? 'FAIL' : warnings > 0 ? 'PASS_WITH_WARNINGS' : 'PASS';
console.log(`Result: ${result}`);
process.exit(errors > 0 ? 1 : 0);
