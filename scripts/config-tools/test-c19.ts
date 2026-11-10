import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildConfigPackageArchive, readConfigPackage } from '../../src/configStudio/package';
import { createCategoryArtifact, prepareCategoryImport } from '../../src/configStudio/categoryArtifact';
import { defaultSymbolBehavior } from '../../src/configStudio/c19Render';
import { editableGeometryProfile } from '../../src/configStudio/renderRuleTemplates';
import { migratePackageToContract } from '../../src/configStudio/contractMigration';
import { densityGridAt, mappedLabel, materializeC19Rule } from '../../src/configStudio/c19Render';
import { resolveLabelText } from '../../src/configStudio/labelTemplate';
import { validateConfigPackage } from '../../src/configStudio/runtime';
import { stableConfigText } from '../../src/configRuntime/configurationFingerprint';
import { changeC19Representation, repairPointBehavior } from '../../src/configStudio/renderRepresentationEditing';
import { assertRegistryRemovals, registryUsage } from '../../src/configStudio/registryReferences';
import { prepareRenderRule } from '../../src/configStudio/renderRuleTemplates';
import type { ConfigPackageV3, DisplayRepresentation, GeometryKind, PointSymbol, RenderLabelStyle, ZoomPriorityRule } from '../../src/configStudio/types';

const sourceSha256 = '20fda5b8d97d17c95473ae1aa3ef4e07685ccf00448260eab9c07cbc20d388cc';
const bytes = readFileSync('public/configuration/releases/'+sourceSha256+'/config.json');
assert.equal(createHash('sha256').update(bytes).digest('hex'),sourceSha256);
const source = JSON.parse(bytes.toString()) as ConfigPackageV3;
assert.equal(source.contractRevision,18);
const { config, report } = migratePackageToContract(source);
assert.equal(config.revision,source.revision);
assert.equal(config.contractRevision,19);
assert.equal(config.engine?.renderTemplates?.length,11);
assert.equal(config.engine?.contextView.minZoom,undefined);
assert.equal(config.application?.externalLayers?.path,650);
assert.equal(config.application?.externalLayers?.highlightPath,655);
assert.equal(stableConfigText(migratePackageToContract(config).config),stableConfigText(config));

let count=0;
for(const [index,node] of config.nodes.entries())for(const [kind,profile] of Object.entries(node.geometryProfiles)){
  for(const [ruleIndex,rule] of (profile?.zoomPriority.rules??[]).entries()){
    const geometry=kind as GeometryKind;
    const old=source.nodes[index].geometryProfiles[geometry]!.zoomPriority.rules[ruleIndex];
    assert.equal(rule.geometryStack?.zLevel,(old.geometryStack?.zLevel??0)+(geometry==='Point'?1000:0));
    assert.deepEqual(rule.when,old.when);
    assert.equal(rule.representation,old.representation);
    assert.ok(rule.logic);
    assert.equal(rule.extensions,undefined);
    assert.equal(rule.style?.symbolAnchor,undefined);
    const active=materializeC19Rule(config,geometry,rule,rule.when?.zoom.min??0);
    if(old.extensions?.visibility?.mode==='sameId')assert.deepEqual(active.extensions?.visibility?.sameId,old.extensions.visibility.sameId);
    if(geometry==='Point')count++;
  }
}
const group=config.engine!.densityGroups!.find(item=>item.id==='structureLabel')!;
assert.equal(densityGridAt(group,5).maxLabelsPerGrid,2);
assert.equal(densityGridAt(group,6).maxLabelsPerGrid,3);
const floor:RenderLabelStyle={visible:true,source:'Name',fallbackSources:['NofFloor'],valueFormat:'floorLabel',collision:{role:'optional',basePriority:1,hideWhenColliding:true}};
assert.equal(resolveLabelText(floor,key=>key==='NofFloor'?2:undefined,(value,fmt)=>fmt==='floorLabel'?value+'F':value,()=>'',true),'2');
const { collision: _collision,...item }=floor;
const label={...floor,mode:'valueMap' as const,mapping:{field:'enabled',entries:[{value:false,item:{...item,visible:false,source:'Other'}}]}};
assert.equal(mappedLabel(label,()=>false).visible,false);
assert.equal(mappedLabel(label,()=>undefined).source,'Name');
assert.deepEqual(report.changes.filter(item=>item.kind==='unresolved'),[]);
const validation=validateConfigPackage(config);
const errors=validation.issues.filter(issue=>issue.severity==='error');
assert.equal(errors.length,0,JSON.stringify(errors.slice(0,10),null,2));
assert.ok(validation.valid);
const categoryNode=config.nodes.find(node=>node.geometryProfiles.Point?.zoomPriority.rules.length)!;
const category=await createCategoryArtifact(config,categoryNode.nodeId,'node');
assert.ok(category.payload.renderDependencies?.templates.length);
assert.equal(prepareCategoryImport(config,category).report.valid,true);
const drift=structuredClone(config);
const dependencyId=category.payload.renderDependencies!.templates[0].id;
drift.engine!.renderTemplates!.find(item=>item.id===dependencyId)!.name.zh='定义已变化';
assert.throws(()=>prepareCategoryImport(drift,category),/定义与当前配置不一致/);

const authored=editableGeometryProfile('Point',19).zoomPriority.rules[0];
assert.equal(authored.geometryStack?.zLevel,1420);
assert.equal(authored.extensions,undefined);
assert.deepEqual(authored.style?.pointSymbol?.kind==='shape'&&authored.style.pointSymbol.shape.behavior,defaultSymbolBehavior());
const invalidGrid=structuredClone(config);
invalidGrid.engine!.densityGroups!.find(item=>item.id==='structureLabel')!.zoomGrids.push({minZoom:7,maxZoom:8,grid:{gridSizePx:104,maxLabelsPerGrid:3}});
assert.ok(validateConfigPackage(invalidGrid).issues.some(issue=>issue.code==='density-grid-overlap'));
const conflictingSource=structuredClone(source);
const oldDensity=conflictingSource.nodes.flatMap(node=>Object.values(node.geometryProfiles)).flatMap(profile=>profile.zoomPriority.rules).find(rule=>
  rule.when?.zoom.min===6&&rule.label?.visible&&rule.label.collision.collisionGroup==='structureLabel'&&rule.extensions?.density?.maxLabelsPerGrid===3,
)!.extensions!.density!;
oldDensity.maxLabelsPerGrid=9;
assert.ok(migratePackageToContract(conflictingSource).report.changes.some(item=>item.kind==='unresolved'&&item.path.includes('densityGroups/structureLabel')));
const polygon = config.nodes.find(node => node.nodeId === 'class-bud-nom')!.geometryProfiles.Polygon!;
const originalPoint = polygon.zoomPriority.rules.find(rule => rule.representation === 'point')!;
const originalArea = polygon.zoomPriority.rules.find(rule => rule.representation === 'geometry')!;
const shape = originalPoint.style!.pointSymbol!;
assert.equal(shape.kind, 'shape');
if (shape.kind !== 'shape') throw Error('Expected migrated BUD/NOM base shape');
const shapeMap: PointSymbol = { ...shape, mode: 'valueMap', mapping: { field: 'Name', entries: [{ value: 'test', item: shape.shape }] } };
const fallback = shape.shape;
const placement = { anchor: { mode: 'center' as const }, offsetPx: { x: 0, y: 0 } };
const image: PointSymbol = { kind: 'externalImage', fallback, image: {
  mode: 'valueMap', field: 'Name', entries: [{ value: 'test', sourceForm: 'library', url: '/image-library/N1.png',
    presentation: { placement, sizePx: { width: 16, height: 18 }, behavior: fallback.behavior, halo: fallback.halo } }],
} };
const icon: PointSymbol = { kind: 'icon', fallback, icon: {
  mode: 'valueMap', field: 'Name', entries: [{ value: 'test', item: { placement, library: 'pinhead', id: 'plane_up',
    sizePx: 15, foreground: fallback.stroke, foregroundOpacity: 1, behavior: fallback.behavior, halo: fallback.halo } }],
} };
for (const symbol of [shape, shapeMap, icon, image]) {
  const drafts = new Map();
  const source = { ...originalPoint, style: { pointSymbol: symbol } };
  const update = (rule: ZoomPriorityRule, representation: DisplayRepresentation, geometry: GeometryKind = 'Polygon') =>
    prepareRenderRule({ ...rule, representation,
      style: changeC19Representation(rule, representation, geometry, drafts, originalArea.style!, originalPoint.style!),
    }, geometry, 19);
  const path = update(source, 'geometry');
  assert.equal(path.style?.pointSymbol, undefined);
  const composite = update(path, 'geometryWithPoint');
  assert.deepEqual(composite.style?.midpoint?.pointSymbol, symbol);
  const labelOnly = update(composite, 'labelOnly');
  assert.equal(labelOnly.style?.midpoint, undefined);
  const hidden = update(labelOnly, 'hidden');
  assert.equal(hidden.style, undefined);
  assert.deepEqual(update(hidden, 'point').style?.pointSymbol, symbol);
  const line = update(source, 'geometry', 'LineString');
  assert.equal(line.style?.fill, undefined);
  assert.deepEqual(update(line, 'point', 'LineString').style?.pointSymbol, symbol);
}
const contaminatedPoint = { ...originalPoint, style: { ...originalPoint.style, behavior: defaultSymbolBehavior() } };
assert.deepEqual(repairPointBehavior(contaminatedPoint, 'Polygon').style, originalPoint.style);
const missingPoint = { ...contaminatedPoint, style: { ...contaminatedPoint.style, pointSymbol: { ...shape, shape: { ...shape.shape, behavior: undefined } } } };
assert.deepEqual(repairPointBehavior(missingPoint, 'Polygon').style?.pointSymbol?.kind === 'shape' &&
  (repairPointBehavior(missingPoint, 'Polygon').style!.pointSymbol as typeof shape).shape.behavior, defaultSymbolBehavior());
const contaminatedComposite: ZoomPriorityRule = { ...originalPoint, representation: 'geometryWithPoint', style: {
  ...originalArea.style, ...fallback, midpoint: { pointSymbol: image },
} };
assert.deepEqual(repairPointBehavior(contaminatedComposite, 'Polygon').style?.midpoint?.pointSymbol, image);
assert.ok(repairPointBehavior({ ...contaminatedPoint, style: { ...contaminatedPoint.style, pointSymbol: undefined } }, 'Polygon').problem);

const registry = structuredClone(config);
const registeredEngine = registry.engine!;
const custom = { ...structuredClone(group), id: 'followup-usage-test' };
registeredEngine.densityGroups!.push(custom);
const unused = structuredClone(registeredEngine.renderTemplates![0]);
unused.id = 'followup-unused-template';
unused.modules.collision = { ...unused.modules.collision, collision: { blocks: ['group:followup-usage-test'], collideWith: ['group:followup-usage-test'] } };
registeredEngine.renderTemplates!.push(unused);
const hidden = registry.nodes.flatMap(node => node.geometryProfiles.Polygon?.zoomPriority.rules ?? []).find(rule => rule.representation === 'hidden')!;
const hiddenTemplate = registeredEngine.renderTemplates!.find(template => template.geometry === 'Polygon')!;
hidden.logic = { ...hidden.logic!, templateId: hiddenTemplate.id };
const usage = registryUsage(registry, registeredEngine, 'densityGroups');
assert.equal(usage.saved.get(custom.id)?.length, 2);
assert.equal(usage.effective.has(custom.id), false);
assert.ok(registryUsage(registry, registeredEngine, 'renderTemplates').saved.get(hiddenTemplate.id)?.some(ref => ref.ruleId === hidden.id));
assert.throws(() => assertRegistryRemovals(registry, { section: 'densityGroups', baseline: registeredEngine,
  value: { ...registeredEngine, densityGroups: registeredEngine.densityGroups!.filter(entry => entry.id !== custom.id) },
}), /followup-unused-template/);
assert.throws(() => assertRegistryRemovals(registry, { section: 'densityGroups', baseline: registeredEngine,
  value: { ...registeredEngine, densityGroups: registeredEngine.densityGroups!.filter(entry => entry.id !== group.id) },
}), /内置密度组受保护/);

const blob=await buildConfigPackageArchive(config,validation);
const roundtrip=await readConfigPackage(new File([blob],'c19-candidate.zip'));
assert.equal(stableConfigText(roundtrip),stableConfigText(config));
if(process.env.CAIRN_C19_OUTPUT){
  const out=process.env.CAIRN_C19_OUTPUT;
  mkdirSync(out,{recursive:true});
  writeFileSync(join(out,`cairnmap-config-base-r${config.revision}-c19.cairn-config-v3.zip`),Buffer.from(await blob.arrayBuffer()));
  writeFileSync(join(out,'migration-report.json'),JSON.stringify({...report,sourceSha256},null,2));
  writeFileSync(join(out,'validation-report.json'),JSON.stringify(validation,null,2));
}
console.log(`c19: ${count} Point rules, 11 templates, package validation and ZIP roundtrip passed.`);
