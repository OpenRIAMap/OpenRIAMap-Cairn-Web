import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { validateBusinessJsonRecords } from '../../src/configStudio/businessJsonValidation';
import { createCategoryArtifact, prepareCategoryImport } from '../../src/configStudio/categoryArtifact';
import { migratePackageToContract } from '../../src/configStudio/contractMigration';
import { resolveLabelText } from '../../src/configStudio/labelTemplate';
import { buildConfigPackageArchive, readConfigPackage } from '../../src/configStudio/package';
import { validateConfigPackage } from '../../src/configStudio/runtime';
import { stableConfigText } from '../../src/configRuntime/configurationFingerprint';
import { buildWorkflowArtifact, prepareWorkflowArtifactImport } from '../../src/configStudio/workflowArtifact';
import { buildV3CardSections } from '../../src/configStudio/V3CardRenderer';
import type { FeatureRecord } from '../../src/components/Rules/rendering/renderPrimitives';
import type { ConfigPackageV3, MountedFeatureRecord, RenderLabelStyle } from '../../src/configStudio/types';
import { validateIncomingBatch } from './server-validation-entry';
import * as server from '../../vendor/configuration-r11/r11-validation.mjs';

const sourceSha256 = '961092bcf0b4b82ae7ab27d1ed0d656773740ea8034d65237c7c2d97efb55505';
const bytes = readFileSync('public/configuration/releases/' + sourceSha256 + '/config.json');
assert.equal(createHash('sha256').update(bytes).digest('hex'), sourceSha256);
const source = JSON.parse(bytes.toString()) as ConfigPackageV3;
assert.equal(source.revision, 159);
assert.equal(source.contractRevision, 19);
const { config, report } = migratePackageToContract(source);
assert.equal(config.revision, source.revision);
assert.equal(config.contractRevision, 20);
assert.equal(report.changes.filter(change => change.path.endsWith('/valueSchema')).length, 7);
assert.deepEqual(report.changes.filter(change => change.kind === 'unresolved'), []);
assert.equal(stableConfigText(migratePackageToContract(config).config), stableConfigText(config));
assert.deepEqual(config.workflows, source.workflows);
assert.deepEqual(config.application, source.application);
assert.deepEqual(config.nodes.map(node => node.nodeId), source.nodes.map(node => node.nodeId));
assert.deepEqual(source, JSON.parse(bytes.toString()));

const old = structuredClone(source);
const oldField = old.nodes.flatMap(node => node.fields).find(field => field.valueSchema)!;
oldField.valueSchema = { type: 'object', properties: { bespoke: { type: 'boolean' } }, required: ['bespoke'] };
assert.ok(migratePackageToContract(old).report.changes.some(change => change.kind === 'unresolved' && change.path.endsWith('/' + oldField.fieldId + '/valueSchema')));
const oldRule = old.nodes.flatMap(node => Object.values(node.geometryProfiles).flatMap(profile => profile?.zoomPriority.rules ?? [])).find(rule => rule.label)!;
oldRule.label!.fallbackValueFormats = { NofFloor: 'floorLabel' };
const oldPrecision = old.engine!.renderTemplates!.find(template => template.modules.visibility?.visibility?.lineContainmentChoice)!;
oldPrecision.modules.visibility!.visibility!.lineContainmentChoice!.precision = 100;
const legacyChanges = migratePackageToContract(old).report.changes;
assert.ok(legacyChanges.some(change => change.path.endsWith('/precision') && change.before === 100));
assert.ok(legacyChanges.some(change => change.path.endsWith('/fallbackValueFormats')));
const contaminated = { ...source, contractRevision: 20 };
assert.ok(validateConfigPackage(contaminated).issues.some(issue => issue.path.endsWith('/valueSchema')));
const label = { visible: true, source: 'Name', fallbackSources: ['NofFloor', 'Code'], valueFormat: 'floorLabel',
  fallbackValueFormats: { Code: 'plain' }, collision: { role: 'optional', basePriority: 0, hideWhenColliding: false } } satisfies RenderLabelStyle;
const format = (value: unknown, key?: string) => key === 'floorLabel' ? value + 'F' : String(value);
assert.equal(resolveLabelText(label, key => ({ NofFloor: 2, Code: 3 })[key as 'NofFloor' | 'Code'], format, () => '', true, false), '2');
assert.equal(resolveLabelText(label, key => key === 'Code' ? 3 : undefined, format, () => '', true, false), '3F');

const rail = source.nodes.find(node => node.path.class === 'RIL' && !node.path.kind)!;
const category = await createCategoryArtifact(source, rail.nodeId, 'classTree');
const categoryDraft = prepareCategoryImport(config, category);
assert.ok(categoryDraft.migration?.changes.some(change => change.path.endsWith('/valueSchema')));
for (const workflow of source.workflows) {
  const artifact = buildWorkflowArtifact(source, workflow);
  const imported = prepareWorkflowArtifactImport(config, artifact);
  assert.equal(imported.workflow.id, workflow.id);
}

const row = (id: string, cls: string, kind: string, fields: Record<string, unknown> = {}): MountedFeatureRecord =>
  ({ ID: id, Class: cls, Kind: kind, World: 'zth', Name: id, ...fields });
const validRows = [
  row('trade', 'TRP', 'NOM', { trade: [{ OfferItems: [{ Name: '纸', Count: '2' }], ReceiveItems: [], Note: 1 }] }),
  row('platform', 'RIL', 'PLF', { Lines: ['line', { ID: 'line', Available: true }] }),
  row('station-area', 'RIL', 'STA', { Platforms: [{ ID: 'platform' }] }),
  row('station', 'RIL', 'STB', { stationsGroup: ['station-area'] }),
  row('road', 'ROD', 'NOM', { connectL: [{ Lot: 'middle', Tgt: 'other-road' }], blacklist: [['another-road']], mode: [{ code: 'walk' }] }),
  row('teleport', 'TPT', 'TPP', { TGTcoordinate: { x: 1, z: 2 } }),
  row('optional', 'TPT', 'TPP'),
  row('unrelated', 'BUD', 'NOM', { Trade: {}, TGTcoordinate: [] }),
];
assert.deepEqual(validateBusinessJsonRecords(config, validRows), []);
const invalidRows = [
  row('trade', 'TRP', 'NOM', { Trade: [{ OfferItems: [{ Name: '纸', Count: {} }], ReceiveItems: [] }] }),
  row('platform', 'RIL', 'PLF', { lines: [{ ID: 'line', Available: 'yes' }] }),
  row('station-area', 'RIL', 'STA', { platforms: { ID: 'platform' } }),
  row('station', 'RIL', 'STB', { Stations: [2] }),
  row('road', 'ROD', 'NOM', { ConnectL: [{ mode: 'invalid', tgt: 'road' }], Blacklist: [2], Mode: 'walk' }),
  row('teleport', 'TPT', 'TPP', { TGTcoordinate: { x: 1, y: Infinity, z: 'bad' } }),
];
const issues = validateBusinessJsonRecords(config, invalidRows);
assert.deepEqual(new Set(issues.map(issue => issue.field)), new Set(['Trade', 'lines', 'platforms', 'Stations', 'ConnectL', 'Blacklist', 'Mode', 'TGTcoordinate']));
assert.ok(issues.some(issue => issue.path === 'mounted/teleport/TGTcoordinate/z'));
assert.deepEqual(validateBusinessJsonRecords(source, invalidRows), []);
assert.deepEqual(server.validateBusinessJsonRecords(config, validRows), []);
assert.deepEqual(server.validateBusinessJsonRecords(config, invalidRows), issues);
assert.throws(() => validateIncomingBatch(config, invalidRows, []),
  (error: unknown) => (error as { issues?: unknown }).issues !== undefined &&
    stableConfigText((error as { issues: unknown }).issues) === stableConfigText(issues));
const sourceRoad = row('new-road', 'ROD', 'NOM', { ConnectL: [{ mode: 'endpoint', tgt: 'other-road' }] });
const destinationRoad = row('other-road', 'ROD', 'NOM');
assert.deepEqual(validateBusinessJsonRecords(config, [sourceRoad]), []);
assert.throws(() => validateIncomingBatch(config, [sourceRoad], []),
  (error: unknown) => (error as { issues?: Array<{ message: string }> }).issues?.some(issue => issue.message.includes('other-road')) === true);
assert.doesNotThrow(() => validateIncomingBatch(config, [sourceRoad, destinationRoad], []));

const validation = validateConfigPackage(config);
assert.equal(validation.valid, true, JSON.stringify(validation.issues.filter(issue => issue.severity === 'error').slice(0, 10)));
const blob = await buildConfigPackageArchive(config, validation);
const roundtrip = await readConfigPackage(new File([blob], 'c20-candidate.zip'));
assert.equal(stableConfigText(roundtrip), stableConfigText(config));
if (process.env.CAIRN_C20_OUTPUT) {
  const out = process.env.CAIRN_C20_OUTPUT;
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, 'CairnMap_c20_from-r159.cairn-config-v3.zip'), Buffer.from(await blob.arrayBuffer()));
  writeFileSync(join(out, 'migration-report.json'), JSON.stringify({ ...report, sourceSha256 }, null, 2));
  writeFileSync(join(out, 'validation-report.json'), JSON.stringify(validation, null, 2));
}
console.log('c20: migration, category/workflow imports, business JSON parity and candidate ZIP roundtrip passed.');
