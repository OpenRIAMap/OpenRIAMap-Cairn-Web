import assert from 'node:assert/strict';
import fs from 'node:fs';
import type { ConfigPackageV3, FieldDefinition } from '../../src/configStudio/types';
import { migrateConfigToR10 } from '../../src/configStudio/r10Migration';
import { resolveEffectiveFields, resolveCardConfiguration, resolveIncomingFields, validateConfigPackage, compileConfigRuntime } from '../../src/configStudio/runtime';
import { createPrefillAudit, confirmPrefillCopies, validatePrefillCopies } from '../../src/configStudio/prefillAudit';
import { clearCardMapping, prefillCardItem, prefillWorkflowControl } from '../../src/configStudio/fieldPrefillModel';
import { initializeCategory } from '../../src/configStudio/categoryInitialization';
import { createCategoryArtifact, prepareCategoryImport } from '../../src/configStudio/categoryArtifact';

const old=JSON.parse(fs.readFileSync('src/configStudio/defaults/r9-r5.config.json','utf8')) as ConfigPackageV3;
const migration=migrateConfigToR10(old),config=migration.config;
assert.equal(old.contractRevision,9);assert.equal(config.contractRevision,10);assert.equal(config.revision,6);
assert.equal(config.nodes.filter(node=>node.path.kind&&node.card).length,79);
assert(validateConfigPackage(config).valid,JSON.stringify(validateConfigPackage(config).issues.filter(i=>i.severity==='error')));
const cardChanges=[];
for(const node of old.nodes){
  const before=resolveCardConfiguration(old,node.path),after=resolveCardConfiguration(config,node.path);
  if(before?.mode!=='fields'||after?.mode!=='fields')continue;
  for(const item of before.items.filter(item=>item.visible)){
    const next=after.items.find(next=>next.id===item.id);
    assert(next?.visible,`${node.nodeId}/${item.id} visible row lost`);
    assert.equal(next.renderer,item.renderer);assert.equal(next.section,item.section);if(next.relation?.targetRole==='main'){assert.equal(next.relation.targetMatchField,'ID');assert.equal(next.relation.targetDisplayField,item.relation?.targetDisplayField);}else assert.deepEqual(next.relation,item.relation);
    if(JSON.stringify([next.source,next.label,next.valueOptions])!==JSON.stringify([item.source,item.label,item.valueOptions]))cardChanges.push({node:node.nodeId,item:item.id,before:[item.source,item.label,item.valueOptions],after:[next.source,next.label,next.valueOptions]});
  }
}
fs.mkdirSync('.cache/main-update',{recursive:true});fs.writeFileSync('.cache/main-update/r10-inheritance-migration.json',JSON.stringify({report:migration.report,cardChanges},null,2));
assert.deepEqual(cardChanges,[],'Migration must preserve the current V1-visible authored card values.');
const root=config.nodes.find(n=>n.path.class==='BUD'&&!n.path.kind)!,child=config.nodes.find(n=>n.path.class==='BUD'&&n.path.kind&&!n.path.skind)!;
const fixed:FieldDefinition={fieldId:'hard-test',key:'HardTest',type:'enum',cardinality:'single',input:'select',labels:{zh:'父字段',en:'Parent'},description:{zh:'完整定义',en:''},options:[{value:'1',label:{zh:'一',en:'One'}}]};
root.fields.push(fixed);root.inheritDown={fields:true,card:true,display:true};
child.receiveFromParent={fields:false,card:false};child.fields.push({...fixed,fieldId:'local-copy',type:'string',labels:{zh:'遮挡',en:''}});
assert.equal(resolveEffectiveFields(config,child.path).find(f=>f.key==='HardTest')!.fieldId,'hard-test');
assert.equal(resolveIncomingFields(config,child.path).find(f=>f.key==='HardTest')!.inheritance,'sealed');
assert(validateConfigPackage(config).issues.some(issue=>issue.code==='field-sealed-override'));
child.fields=child.fields.filter(field=>field.fieldId!=='local-copy');fixed.labels={zh:'父字段更新',en:''};fixed.options![0].label.zh='一更新';
const inherited=resolveEffectiveFields(config,child.path).find(f=>f.key==='HardTest')!;assert.equal(inherited.labels.zh,'父字段更新');assert.equal(inherited.labels.en,'');assert.equal(inherited.options![0].label.zh,'一更新');
assert(root.card?.mode==='fields');assert(child.card?.mode==='fields');
const parentRow=root.card.items[0],origin=child.card.items.find(item=>item.inheritFrom?.itemId===parentRow.id)!;assert(origin);
const renderer=origin.renderer,layout=origin.section;parentRow.label={zh:'父信息卡更新',en:''};parentRow.valueOptions=[{value:'a',label:{zh:'父对照',en:''}}];
const inheritedRow=resolveCardConfiguration(config,child.path);assert(inheritedRow?.mode==='fields');const updated=inheritedRow.items.find(item=>item.id===origin.id)!;
assert.equal(updated.label!.zh,'父信息卡更新');assert.deepEqual(updated.valueOptions,parentRow.valueOptions);assert.equal(updated.renderer,renderer);assert.equal(updated.section,layout);
const independent={id:'independent-test',source:'HardTest',visible:true,renderer:'text' as const};
root.card.items.push(prefillCardItem(independent,fixed,createPrefillAudit(root.path,fixed)));
const localSnapshot=root.card.items.at(-1)!;fixed.labels.zh='新名称';
let warnings=validatePrefillCopies(config,resolveEffectiveFields);assert(warnings.some(i=>i.path.endsWith('/independent-test')&&i.severity==='warning'));
assert.equal(localSnapshot.label!.zh,'父字段更新','Audit must never update a runtime snapshot');
const confirmed=confirmPrefillCopies(config,resolveEffectiveFields,warnings.map(i=>i.path));assert.equal(validatePrefillCopies(confirmed,resolveEffectiveFields).length,0);
confirmed.nodes.find(n=>n.nodeId===root.nodeId)!.fields.find(f=>f.fieldId===fixed.fieldId)!.labels.zh='再次更新';assert(validatePrefillCopies(confirmed,resolveEffectiveFields).some(i=>i.code==='prefill-copy-outdated'));
const cleared=clearCardMapping(localSnapshot);assert.equal(cleared.options?.format,'plain');assert.equal(cleared.prefillAudit,undefined);assert.equal(cleared.source,localSnapshot.source);assert.deepEqual(cleared.label,localSnapshot.label);
const control=prefillWorkflowControl({id:'prefill-test',slot:'PREFILL',kind:'text',columns:1,label:{zh:'旧',en:''}},fixed,createPrefillAudit(root.path,fixed));assert(control.prefillAudit);assert.equal(control.optionsTableId,undefined);
const frozen=compileConfigRuntime(confirmed,true);assert.equal(resolveEffectiveFields(frozen,child.path).find(f=>f.key==='HardTest')!.labels.zh,'再次更新');assert(Object.isFrozen(resolveEffectiveFields(frozen,child.path)));
const fresh=migrateConfigToR10(old).config,freshRoot=fresh.nodes.find(n=>n.path.class==='BUD'&&!n.path.kind)!;
const created=initializeCategory(fresh,{parentId:freshRoot.nodeId,code:'HARD_TEST',labels:{zh:'测试',en:''},mode:'blank',sync:{fields:false,geometry:false,display:false,card:false},geometry:'Polygon',multiple:true,anchor:'featureBbox'});
assert(resolveEffectiveFields(created.config,created.node.path).length>0);assert(resolveCardConfiguration(created.config,created.node.path)?.mode==='fields');
const artifact=await createCategoryArtifact(created.config,created.node.nodeId,'node');assert(prepareCategoryImport(fresh,artifact).report.valid);
console.log('hard-inheritance-prefill: 79 preserved layouts, parent identity/definitions/maps, bypass blocking, independent snapshots, version confirmations/clear, compiled cache and category creation/import passed');
