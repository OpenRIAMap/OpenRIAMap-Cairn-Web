import assert from 'node:assert/strict';
import { readC14MigrationSource } from './fixtures/c14-migration-source';
import { migratePackageToC15 } from '../../src/configStudio/contractMigration';
import { initializeCategory, type CategoryInitialization } from '../../src/configStudio/categoryInitialization';
import { categoryDraftReport } from '../../src/configStudio/categoryDraft';
import { prepareCategoryDeletion, categoryDeletionIssues, withCategoryDeletionIssues } from '../../src/configStudio/categoryDeletion';
import { createCategoryArtifact, prepareCategoryImport, prepareClassTreeCommit } from '../../src/configStudio/categoryArtifact';
import { classificationPathKey, resolveCardConfiguration, resolveEffectiveFields, resolveGeometryProfile, validateConfigPackage } from '../../src/configStudio/runtime';
import { hasStudioDraft, recoverPackageCandidate, type StudioEditingSession } from '../../src/configStudio/studioSession';
import { validateNativeStructure } from '../../src/configStudio/nativeContractValidation';
import { validateWorkspace } from '../../src/configStudio/workspaceValidation';
import {proposedWorkflowEditorScope} from '../../src/configStudio/WorkflowEditorScope';
import {validateWorkflowDefinition} from '../../src/configStudio/runtime';

const baseline = migratePackageToC15(readC14MigrationSource().config).config;
const original = JSON.stringify(baseline);
const request: CategoryInitialization = { code: 'AUTHORING_TEST', labels: { zh: '建树回归', en: '' }, mode: 'blank',
  sync: { fields: false, geometry: false, display: false, card: false }, geometry: '', multiple: false, anchor: 'featureBbox' };
assert(validateConfigPackage(baseline).valid);
assert.throws(() => initializeCategory(baseline, request), /最终分类必须解析为一种明确几何类型/);
const root = initializeCategory(baseline, request, { allowUnfinishedGeometry: true });
assert.equal(root.node.geometryType, undefined);
assert.deepEqual(root.node.geometryProfiles, {});
assert.deepEqual(validateNativeStructure(root.config), []);
assert(!validateConfigPackage(root.config).valid);
assert(categoryDraftReport(validateConfigPackage(root.config)).valid);
await assert.rejects(() => createCategoryArtifact(root.config, root.node.nodeId, 'classTree'), /未通过核验/);

const session: StudioEditingSession = { baseline, draft: root.config, tree: null, selectedId: root.node.nodeId, editing: false, draftScope: 'category' };
assert(hasStudioDraft(session));
assert.equal(recoverPackageCandidate(session), null, 'ordinary staged authoring must not become an import/package isolation mode');
const middle = initializeCategory(root.config, { ...request, parentId: root.node.nodeId, code: 'GROUP', mode: 'parent',
  sync: { fields: true, geometry: true, display: true, card: true } }, { allowUnfinishedGeometry: true });
assert.equal(middle.node.geometryType, undefined, 'an untyped parent may be inherited without inventing a point geometry');
const point = initializeCategory(middle.config, { ...request, parentId: middle.node.nodeId, code: 'POINT', geometry: 'Point' });
const line = initializeCategory(point.config, { ...request, parentId: middle.node.nodeId, code: 'LINE', geometry: 'LineString' });
assert(validateConfigPackage(line.config).valid);
assert.deepEqual(validateNativeStructure(line.config), []);
const broken = structuredClone(root.config); broken.nodes.find(node => node.nodeId === root.node.nodeId)!.children.push('missing-child');
assert(!categoryDraftReport(validateConfigPackage(broken)).valid, 'draft staging must not suppress structural/dependency errors');

const tree = await createCategoryArtifact(line.config, root.node.nodeId, 'classTree');
const imported = prepareCategoryImport(line.config, tree);
const committed = prepareClassTreeCommit(line.config, line.config, imported.config, request.code);
assert.deepEqual(committed.nodes, line.config.nodes, 'normal local save, existing tree export and import round trip preserve definitions');
const kinds = ['RLE', 'PLF', 'STB'];
for (const code of kinds) {
  const source = baseline.nodes.find(node => node.path.class === code && !node.path.kind)!;
  const result = initializeCategory(line.config, { ...request, parentId: root.node.nodeId, code,
    mode: 'template', sourceId: source.nodeId, sync: { fields: true, geometry: true, display: true, card: true } });
  assert(validateConfigPackage(result.config).valid);
  assert.equal(result.node.geometryType, source.geometryType);
  assert.deepEqual(resolveEffectiveFields(result.config, result.node.path).map(field => field.key), resolveEffectiveFields(baseline, source.path).map(field => field.key));
  const beforeRules = resolveGeometryProfile(baseline, source.path, source.geometryType!)!.zoomPriority.rules;
  const afterRules = resolveGeometryProfile(result.config, result.node.path, source.geometryType!)!.zoomPriority.rules;
  const withoutId = (rows: typeof beforeRules) => rows.map(({ id: _id, ...row }) => row);
  assert.deepEqual(withoutId(afterRules), withoutId(beforeRules));
  assert(afterRules.every(rule => !beforeRules.some(previous => previous.id === rule.id)), 'template rules must receive new identities');
  assert.equal(resolveCardConfiguration(result.config, result.node.path)?.mode, resolveCardConfiguration(baseline, source.path)?.mode);
}

// Borrow ROD's display under a natural line parent without copying its
// navigation schema, card or search settings. Real fallback colors survive.
const naturalLineParent=baseline.nodes.find(node=>classificationPathKey(node.path)==='ISL/NGF/BOD')!;
const roadTemplate=baseline.nodes.find(node=>classificationPathKey(node.path)==='ROD')!;
const displayOnlyRequest:CategoryInitialization={...request,parentId:naturalLineParent.nodeId,code:'STYLE_ONLY',mode:'template',sourceId:roadTemplate.nodeId,sync:{fields:false,geometry:true,display:true,card:false}};
const displayOnly=initializeCategory(baseline,displayOnlyRequest);
assert(validateConfigPackage(displayOnly.config).valid);
assert.deepEqual(displayOnly.node.fields,[]);
assert(!displayOnly.node.fieldSettings,'display-only copy must not import road search/structure settings');
const borrowed=resolveGeometryProfile(displayOnly.config,displayOnly.node.path,'LineString')!;
const roadRules=resolveGeometryProfile(baseline,roadTemplate.path,'LineString')!.zoomPriority.rules;
let fallbackCount=0;
function checkBorrowed(source:unknown,copied:unknown):void{
  if(Array.isArray(source)){source.forEach((item,index)=>checkBorrowed(item,(copied as unknown[])[index]));return;}
  if(!source||typeof source!=='object')return;
  const binding=source as Record<string,unknown>;
  if(binding.mode==='field'&&binding.field==='color'){
    assert.deepEqual(copied,{mode:'fixed',color:binding.fallbackColor});fallbackCount++;return;
  }
  for(const [key,value] of Object.entries(binding))if(key!=='id')checkBorrowed(value,(copied as Record<string,unknown>)[key]);
}
roadRules.forEach((rule,index)=>checkBorrowed(rule,borrowed.zoomPriority.rules[index]));
assert(fallbackCount>0);
assert.equal(displayOnly.report.actions.filter(action=>action.startsWith('显示取色回退')).length,fallbackCount);
assert(!resolveEffectiveFields(displayOnly.config,displayOnly.node.path).some(field=>['Speed','ConnectL','Blacklist','Mode','color'].includes(field.key)));
const brokenDisplay=structuredClone(baseline);
brokenDisplay.nodes.find(node=>node.nodeId===roadTemplate.nodeId)!.geometryProfiles.LineString!.zoomPriority.rules[0].label!.source='MissingLabel';
assert.throws(()=>initializeCategory(brokenDisplay,displayOnlyRequest),/未同步依赖字段 MissingLabel/,'missing labels cannot be silently replaced');
const noFallback=structuredClone(baseline);
for(const rule of noFallback.nodes.find(node=>node.nodeId===roadTemplate.nodeId)!.geometryProfiles.LineString!.zoomPriority.rules)if(rule.style?.stroke?.mode==='field')delete rule.style.stroke.fallbackColor;
assert.throws(()=>initializeCategory(noFallback,displayOnlyRequest),/未同步依赖字段 color/,'a missing explicit fallback must still block');

const land=structuredClone(baseline.workflows.find(flow=>flow.id==='v3-isg_ngf_lad')!);
assert.deepEqual(proposedWorkflowEditorScope(baseline,land),land.editor!.scope);
const surfaceScope={class:'ISG',kind:'NGF',skind:'LIS'};
land.outputs[0].classificationGroup!.selectors[0].path=surfaceScope;
assert.deepEqual(proposedWorkflowEditorScope(baseline,land),land.editor!.scope,'changing output must not silently replace an explicit edit scope');
assert(!validateWorkflowDefinition(land,baseline).valid,'stale scope must block a migrated output');
delete land.editor!.scope;
assert.deepEqual(proposedWorkflowEditorScope(baseline,land),surfaceScope,'a missing scope defaults to the common ancestor of actual c15 candidates');
land.editor!.scope=proposedWorkflowEditorScope(baseline,land);
assert(validateWorkflowDefinition(land,baseline).valid,'coordinated output and edit scope must validate');
assert.deepEqual(proposedWorkflowEditorScope(baseline,baseline.workflows.find(flow=>flow.id==='v3-tpp_teleport')!),{class:'TPP'});

const leafDeletion = prepareCategoryDeletion(line.config, point.node.nodeId);
assert.deepEqual(leafDeletion.nodes.map(node => node.nodeId), [point.node.nodeId]);
assert(leafDeletion.report.valid);
assert(!leafDeletion.config.nodes.find(node => node.nodeId === middle.node.nodeId)!.children.includes(point.node.nodeId));
const groupDeletion = prepareCategoryDeletion(line.config, middle.node.nodeId);
assert.equal(groupDeletion.nodes.length, 3);
assert(groupDeletion.report.issues.some(issue => issue.code === 'leaf-geometry-type-required' && issue.path.includes(root.node.nodeId)), 'deleting the last child must revalidate its untyped parent');
const deletion = prepareCategoryDeletion(line.config, root.node.nodeId);
assert.equal(deletion.nodes.length, 4);
assert.deepEqual(JSON.parse(JSON.stringify(deletion.config)), JSON.parse(original), 'an unused subtree deletion must leave all other modules intact');
const occupied = [{ ID: 'ONE', Name: '测试', World: 'zth', Class: request.code, Kind: 'GROUP', SKind: 'POINT' }];
assert.equal(categoryDeletionIssues(line.config, deletion.config, occupied)[0].count, 1);
assert(!withCategoryDeletionIssues(validateConfigPackage(deletion.config), line.config, deletion.config, occupied).valid);
assert(!(await validateWorkspace(deletion.config, occupied, 1, line.config)).report.valid, 'top-level validation and final save must share the data-occupancy guard');
assert(categoryDeletionIssues(line.config, line.config, occupied).length === 0, 'restoring the definition resolves the deletion block');
const used = baseline.nodes.find(node => node.path.class === 'ROD' && !node.path.kind)!;
assert(prepareCategoryDeletion(baseline, used.nodeId).report.issues.some(issue => issue.severity === 'error'), 'business references must not be silently removed to make deletion pass');
assert.equal(JSON.stringify(baseline), original);
assert.equal(classificationPathKey(root.node.path), request.code);
console.log('studio-category-authoring: untyped roots/middle nodes, strict final/export gates, mixed children, checkpoint scope, real template semantics, tree round trip, recursive deletion, references and mounted-data guards passed');
