import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { gunzipSync, gzipSync } from 'node:zlib';
import JSZip from 'jszip';
import { migratePackageToC17, migratePackageToContract, migrateContract, migrationChain } from '../../src/configStudio/contractMigration';
import { validateNativeStructure } from '../../src/configStudio/nativeContractValidation';
import { validateConfigPackage } from '../../src/configStudio/runtime';
import { imageLibraryUrl, imageLibraryFilename, imageSourceFormProblems } from '../../src/configStudio/imageLibrary';
import { scanImageLibrary } from '../image-library-plugin.mjs';
import { createCategoryArtifact, categoryArtifactBlob, readCategoryArtifact, prepareCategoryImport } from '../../src/configStudio/categoryArtifact';
import { buildWorkflowArtifact, prepareWorkflowArtifactImport } from '../../src/configStudio/workflowArtifact';
import { buildConfigPackageArchive, readConfigPackage, buildTemporaryConfigArchive, readConfigPackageWithDiagnostics } from '../../src/configStudio/package';
import { validateWorkspace } from '../../src/configStudio/workspaceValidation';
import { imageLibraryFixture, imageLibraryPresentation } from './fixtures/image-library-config';
import { editableGeometryProfile } from '../../src/configStudio/renderRuleTemplates';
import type { ConfigPackageV3, ImageSource, PointSymbol } from '../../src/configStudio/types';

const sha = 'd11e0537c8756dcb7d58326675171a06aa47d71dfe7a4213acde9eb550f3b778';
const wire = <T>(value: T): T => JSON.parse(JSON.stringify(value));
const bytes = fs.readFileSync(`public/configuration/releases/${sha}/config.json`);
assert.equal(createHash('sha256').update(bytes).digest('hex'), sha);
const original = JSON.parse(bytes.toString('utf8')) as ConfigPackageV3, before = JSON.stringify(original);
assert.equal(original.contractRevision, 16);
assert.equal(validateConfigPackage(original).valid, true, 'deployment continues to accept actual c16');
const fixture = imageLibraryFixture(original), node = fixture.nodes.find(node => node.nodeId === 'image-library-test')!;
const profile = node.geometryProfiles.Point!, rule = profile.zoomPriority.rules[0];
assert.equal(validateConfigPackage(fixture).valid, true, JSON.stringify(validateConfigPackage(fixture).issues.filter(i => i.severity === 'error')));
const make = (image: ImageSource): PointSymbol => ({ kind: 'externalImage', image, fallback: structuredClone((rule.style!.pointSymbol as Extract<PointSymbol,{kind:'externalImage'}>).fallback) });
const presentation = imageLibraryPresentation();
const forms: ImageSource[] = [
  { mode: 'fixed', sourceForm: 'library', url: '/image-library/N1.png', presentation },
  { mode: 'valueMap', field: 'Choice', entries: [{ value: 'a', sourceForm: 'library', url: '/image-library/N2.png', presentation }, { value: 'b', sourceForm: 'url', url: '/image-library/N3.png', presentation }] },
  { mode: 'fieldUrl', field: 'Name', presentation },
  { mode: 'externalFieldUrl', targetIdField: 'Name', targetUrlField: 'extensions.image', presentation },
];
profile.zoomPriority.rules = forms.map((image, index) => ({ ...structuredClone(rule), id: `image-${index}`, when: { zoom: { min: index * 2, max: index === 3 ? 8 : index * 2 + 1 } }, style: { pointSymbol: make(image) } }));
const old = structuredClone(fixture); old.contractRevision = 16;
function removeForms(config: ConfigPackageV3) {
  for (const category of config.nodes) for (const geometry of Object.values(category.geometryProfiles)) for (const item of geometry?.zoomPriority.rules ?? []) {
    for (const style of [item.style, ...(item.conditionalOverrides ?? []).map(branch => branch.style)]) {
      if (style?.pointSymbol?.kind !== 'externalImage') continue;
      const source = style.pointSymbol.image;
      if (source.mode === 'fixed') delete source.sourceForm;
      if (source.mode === 'valueMap') source.entries.forEach(entry => delete entry.sourceForm);
    }
  }
}
removeForms(old);
const oldText = JSON.stringify(old), migrated = migratePackageToC17(old);
assert.equal(JSON.stringify(old), oldText); assert.equal(JSON.stringify(original), before);
assert.deepEqual(migrated.report.steps, ['c16 → c17']);
const migratedNode = migrated.config.nodes.find(n => n.nodeId === node.nodeId)!;
const images = migratedNode.geometryProfiles.Point!.zoomPriority.rules.map(rule => (rule.style!.pointSymbol as Extract<PointSymbol,{kind:'externalImage'}>).image);
assert.equal(images[0].mode === 'fixed' && images[0].sourceForm, 'url', 'old managed paths stay URL');
assert.deepEqual(images[1].mode === 'valueMap' && images[1].entries.map(entry => entry.sourceForm), ['url', 'url']);
assert.deepEqual(images.slice(2), forms.slice(2));
assert.equal(migrated.report.changes.filter(change => change.path.endsWith('/sourceForm')).length, 3);
const stripped = structuredClone(migrated.config); stripped.contractRevision = 16; removeForms(stripped);
assert.deepEqual(stripped, old, 'migration only changes declared identity/default fields');
assert.deepEqual(migratePackageToC17(migrated.config).config, migrated.config);
assert.equal(migratePackageToC17(migrated.config).report.changes.length, 0);
const pointLike=structuredClone(old);
for(const geometry of ['LineString','Polygon'] as const){
  const category=structuredClone(node),shape=editableGeometryProfile(geometry,16);
  category.nodeId='image-test-'+geometry;category.path={class:'IMAGE_'+geometry.toUpperCase()};category.geometryType=geometry;
  category.fields=category.fields.map(field=>({...field,fieldId:field.fieldId+'-'+geometry}));category.geometryProfiles={[geometry]:shape};
  shape.zoomPriority.rules=[{...shape.zoomPriority.rules[0],representation:'point',style:{pointSymbol:make({mode:'fixed',url:'/image-library/N1.png',presentation})}}];
  pointLike.nodes.push(category);
}
const pointLikeResult=migratePackageToC17(pointLike).config;
assert.equal(validateConfigPackage(pointLikeResult).valid,true,JSON.stringify(validateConfigPackage(pointLikeResult).issues.filter(issue=>issue.severity==='error')));
for(const geometry of ['LineString','Polygon'] as const){const symbol=pointLikeResult.nodes.find(n=>n.nodeId==='image-test-'+geometry)!.geometryProfiles[geometry]!.zoomPriority.rules[0].style!.pointSymbol!;assert.equal(symbol.kind==='externalImage'&&symbol.image.mode==='fixed'&&symbol.image.sourceForm,'url');}
for (const kind of ['node', 'classTree'] as const) {
  const component = migrateContract({ contractRevision: 16, nodes: old.nodes.filter(n => n.nodeId === node.nodeId) }, 17, kind);
  assert.deepEqual(component.document.nodes[0], migratedNode);
}
const conditional = structuredClone(old), conditionalRule = conditional.nodes.find(n => n.nodeId === node.nodeId)!.geometryProfiles.Point!.zoomPriority.rules[0];
conditionalRule.conditionalOverrides = [{ id: 'conditional-image', when: [], style: { pointSymbol: make({ mode: 'fixed', url: '/image-library/N4.png', presentation }) } }];
const conditionalResult = migratePackageToC17(conditional);
assert(conditionalResult.report.changes.some(change => change.path.includes('/conditionalOverrides/conditional-image/') && change.after === 'url'));
for (const version of [13, 14, 15, 16, 17]) for (const kind of ['package', 'node', 'classTree', 'workflow'] as const) assert.equal(migrationChain(version, 17, kind).length, 17 - version);
const c13 = JSON.parse(gunzipSync(fs.readFileSync('scripts/config-tools/fixtures/c13-baseline.config.json.gz')).toString('utf8')) as ConfigPackageV3;
for (const version of [13, 14, 15, 16]) {
  const source = migratePackageToContract(c13, version).config, result = migratePackageToC17(source);
  assert.equal(result.config.contractRevision, 17); assert.deepEqual(validateNativeStructure(result.config), []);
}
assert.throws(() => migrateContract({ contractRevision: 17 }, 16, 'workflow'), /降级/);
assert.throws(() => migrateContract({ contractRevision: 18 }, 17, 'workflow'), /未知/);
assert.throws(() => migrateContract({ contractRevision: 12 }, 17, 'workflow'), /窗口/);
assert.deepEqual(imageSourceFormProblems({ sourceForm: 'url', url: '/image-library/N1.png' }, 17), []);
assert.deepEqual(imageSourceFormProblems({ sourceForm: 'library', url: '/image-library/missing.png' }, 17), [], 'file existence is not a server admission rule');
for (const value of ['', '/image-library/N1.png?q=1', '/image-library/N1.png#x', '/image-library/a/b.png', '/image-library/%2E%2E%2Fx.png', '/image-library/%zz.png', 'https://host/image-library/N1.png', '/image-library/x.svg']) assert(imageSourceFormProblems({ sourceForm: 'library', url: value }, 17).length, value);
for (const name of ['N1.png', '中文 空格.png', 'file%25.png', 'TR100px.png.png']) assert.equal(imageLibraryFilename(imageLibraryUrl(name)), name);
assert(imageSourceFormProblems({ url: '/image-library/N1.png' }, 17).length);
assert(imageSourceFormProblems({ sourceForm: 'other', url: '/image-library/N1.png' }, 17).length);
assert(imageSourceFormProblems({ sourceForm: 'url', url: '/image-library/N1.png' }, 16).length);
const broken = structuredClone(fixture), brokenImage = (broken.nodes.find(n => n.nodeId === node.nodeId)!.geometryProfiles.Point!.zoomPriority.rules[0].style!.pointSymbol as Extract<PointSymbol,{kind:'externalImage'}>).image;
if (brokenImage.mode === 'fixed') delete brokenImage.sourceForm;
assert(validateNativeStructure(broken).some(issue => issue.path.endsWith('/sourceForm')));
assert.throws(() => migratePackageToC17(broken), /来源形式/);

for (const kind of ['node', 'classTree'] as const) {
  const artifact = await createCategoryArtifact(fixture, node.nodeId, kind), blob = await categoryArtifactBlob(artifact);
  const reread = await readCategoryArtifact(new File([await blob.arrayBuffer()], 'category.zip'));
  assert.deepEqual(reread.payload.nodes, wire(artifact.payload.nodes));
  const candidate = prepareCategoryImport(fixture, reread, true);
  assert.equal(candidate.report.valid, true, JSON.stringify(candidate.report.issues.filter(i => i.severity === 'error')));
  assert.deepEqual(candidate.config.nodes.find(n => n.nodeId === node.nodeId), wire(node));
  const legacyArtifact = await createCategoryArtifact(old, node.nodeId, kind);
  const upgraded = prepareCategoryImport(fixture, legacyArtifact, true);
  assert.deepEqual(upgraded.config.nodes.find(n => n.nodeId === node.nodeId), migratedNode);
}
const workflow = old.workflows.find(workflow => workflow.mode === 'composed')!;
const workflowArtifact = buildWorkflowArtifact(old, workflow), imported = prepareWorkflowArtifactImport(fixture, workflowArtifact);
assert.deepEqual(imported.workflow, workflow); assert.equal(imported.migration?.target, 17);
const report = validateConfigPackage(fixture), blob = await buildConfigPackageArchive(fixture, report);
const zip = await JSZip.loadAsync(await blob.arrayBuffer()), configText = await zip.file('config.json')!.async('string');
assert.deepEqual(JSON.parse(configText), wire(fixture));
assert.deepEqual(await readConfigPackage(new File([await blob.arrayBuffer()], 'configuration.zip')), wire(fixture));
Object.assign(globalThis,{location:new URL('http://localhost:5307')});
const diagnosticSource=structuredClone(fixture);diagnosticSource.application!.preferences.search.homepageLimit=0;
const diagnosticRun=await validateWorkspace(diagnosticSource,[],17);assert.equal(diagnosticRun.report.valid,false);
const diagnosticBlob=await buildTemporaryConfigArchive(diagnosticSource,diagnosticRun,17);
const diagnosticImport=await readConfigPackageWithDiagnostics(new File([await diagnosticBlob.arrayBuffer()],'c17-temporary.zip'));
assert.deepEqual(diagnosticImport.config,wire(diagnosticSource));assert.equal(diagnosticImport.diagnostic?.report.valid,false);assert.equal(diagnosticImport.recheckReason,undefined);
const catalogue = await scanImageLibrary(path.resolve('public/image-library'));
assert(catalogue.length >= 25, 'the initial library remains available; new uploaded files need no test/index edits'); assert.equal(new Set(catalogue.map(image => image.name.toLowerCase())).size, catalogue.length);
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cairn-image-library-'));
try {
  fs.copyFileSync('public/image-library/N1.png', path.join(directory, '中文 空格.png'));
  assert.deepEqual(await scanImageLibrary(directory), [{ name: '中文 空格.png', url: imageLibraryUrl('中文 空格.png') }]);
  fs.writeFileSync(path.join(directory, 'broken.png'), 'not an image');
  await assert.rejects(() => scanImageLibrary(directory), /broken.png/); fs.unlinkSync(path.join(directory, 'broken.png'));
  fs.writeFileSync(path.join(directory, 'zero.png'), ''); await assert.rejects(() => scanImageLibrary(directory), /zero.png/);
} finally { if(path.dirname(path.resolve(directory))!==path.resolve(os.tmpdir())||!path.basename(directory).startsWith('cairn-image-library-'))throw Error('Unsafe temporary cleanup target'); fs.rmSync(directory, { recursive: true }); }
if (process.env.CAIRNMAP_C17_FIXTURE_OUT) fs.writeFileSync(process.env.CAIRNMAP_C17_FIXTURE_OUT, gzipSync(configText));
console.log('c17 image library: explicit intent, c13–c17 migration, component/package equivalence, original preservation, all artifact codecs, strict paths and automatic directory scan passed.');
