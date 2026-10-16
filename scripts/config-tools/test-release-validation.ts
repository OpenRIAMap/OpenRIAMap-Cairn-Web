import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {validateConfigPackage,validateWorkflowDefinition,resolveSelectableFields} from '../../src/configStudio/runtime';
import {validateWorkflowWrites,workflowConditionsDisjoint} from '../../src/configStudio/workflowPreflight';
import {referencedField} from '../../src/configStudio/lookupTables';
import {validCssColor} from '../../src/configStudio/cssColor';
import {prepareConfigForActivation} from '../../src/configStudio/configActivation';
import {createCategoryArtifact,prepareCategoryImport} from '../../src/configStudio/categoryArtifact';
import {migrateConfigToR11} from '../../src/configStudio/r11Migration';
import type {ConfigPackageV3,WorkflowValueCondition as C} from '../../src/configStudio/types';
const bytes=fs.readFileSync('src/configStudio/defaults/r11-r7.config.json');
assert.equal(createHash('sha256').update(bytes).digest('hex'),'982e1c0b6dc004dd90ee1ff92cd502dfb0f77a9ef4c53bb5a707a2c188460d7e');
const base=JSON.parse(bytes.toString()) as ConfigPackageV3;
const workflow=base.workflows.find(w=>w.id==='v3-rod_road')!;
const leaf=(operator:C['operator'],value?:C['value'],token='F'):C=>({token,operator,...(value!==undefined?{value}:{})});
const all=(...items:C[])=>({all:items} as C),any=(...items:C[])=>({any:items} as C);
const disjoint=(a:C|undefined,b:C|undefined)=>workflowConditionsDisjoint([a],[b]);
assert.equal(disjoint(undefined,undefined),false);
assert.equal(disjoint(leaf('empty'),leaf('present')),true);
assert.equal(disjoint(leaf('empty'),leaf('equals',0)),true);
assert.equal(disjoint(leaf('present'),leaf('equals',false)),false);
assert.equal(disjoint(leaf('equals',0),leaf('equals','0')),true);
assert.equal(disjoint({token:'F',operator:'in',values:[1,2]},leaf('equals',3)),true);
assert.equal(disjoint(any(leaf('equals',1),leaf('equals',2)),leaf('equals',2)),false);
assert.equal(disjoint(all(leaf('present'),leaf('equals',1)),leaf('equals',2)),true);
assert.equal(disjoint(any(...Array.from({length:129},(_,i)=>leaf('equals',i))),leaf('equals',200)),undefined);
assert.equal(disjoint({token:'F',operator:'in',values:Array.from({length:4096},(_,i)=>i)},leaf('equals',5000)),undefined,'large membership sets consume the condition budget');
const analyse=(expression:string,modify?:(w:typeof workflow)=>void)=>{const w=structuredClone(workflow);w.editor={enabled:false};w.outputs[0].assignments=w.outputs[0].assignments.filter(a=>a.target==='Level');w.outputs[0].assignments[0].expression=expression;modify?.(w);return validateWorkflowWrites(w,path=>resolveSelectableFields(base,path));};
for(const expression of ['"bad"','"12"','join("",A)','coalesce(F,"bad")','point(A)'])assert.ok(analyse(expression).some(i=>i.code==='workflow-expression-type-conflict'),expression);
for(const expression of ['0','12','null','""','F','add(F,2)','coalesce(F,0)','coalesce(F,"")'])assert.ok(!analyse(expression).some(i=>i.severity==='error'),expression);
const normalized=structuredClone(workflow);normalized.editor={enabled:false};const numericInput=normalized.steps.flatMap(s=>s.controls??[]).find(c=>c.slot==='F')!;numericInput.kind='text';numericInput.valueNormalization='number';assert.ok(validateWorkflowDefinition(normalized,base).valid,'text controls explicitly normalised to numbers preserve their actual stored type');
assert.ok(analyse('F',w=>{const c=w.steps.flatMap(s=>s.controls??[]).find(c=>c.slot==='F')!;c.valueNormalization='trim';}).some(i=>i.code==='workflow-expression-type-conflict'),'trim produces text even for a numeric input kind');
assert.ok(analyse('divide(1,0)').some(i=>i.code==='workflow-expression-result-invalid'));
assert.ok(analyse('A',w=>{w.steps.flatMap(s=>s.controls??[]).find(c=>c.slot==='A')!.kind='json';}).some(i=>i.code==='workflow-expression-type-unknown'));
for(const expression of ['F','coalesce(F,null)']){const unknown=structuredClone(workflow);unknown.editor={enabled:false};const control=unknown.steps.flatMap(s=>s.controls??[]).find(c=>c.slot==='F')!;control.kind='json';control.valueNormalization=undefined;unknown.outputs[0].assignments.find(row=>row.target==='Level')!.expression=expression;const report=validateWorkflowDefinition(unknown,base);assert.ok(report.valid,JSON.stringify(report.issues.filter(i=>i.severity==='error')));assert.ok(report.issues.some(i=>i.code==='workflow-expression-type-unknown'),'direct and wrapped dynamic JSON use the same warning boundary');}
assert.ok(analyse('C').some(i=>i.code==='workflow-expression-type-conflict'),'search ID is text');
assert.ok(analyse('P').some(i=>i.code==='workflow-expression-type-conflict'),'group is an array');
for(const [expression,cardinality,coordinateFormat,conflict] of [['F','multiple',undefined,true],['P','multiple',undefined,false],['F','single','pointObject',true],['point(A)','single','pointObject',false]] as const){const w=structuredClone(workflow);w.outputs[0].assignments=[{id:'json-shape',target:'AuditJson',expression}];const field={fieldId:'audit-json',key:'AuditJson',type:'json',cardinality,coordinateFormat,input:'json',labels:{zh:'JSON',en:''},description:{zh:'',en:''}} as any;assert.equal(validateWorkflowWrites(w,()=>[field]).some(i=>i.code==='workflow-expression-type-conflict'),conflict,`${expression} / ${cardinality} / ${coordinateFormat}`);}
const writes=(left?:C,right?:C)=>analyse('F',w=>{const original=w.outputs[0].assignments[0];original.when=left;w.outputs[0].assignments.push({...original,id:'second',when:right});});
assert.ok(writes().some(i=>i.code==='workflow-target-write-conflict'));
assert.ok(!writes(leaf('empty'),leaf('present')).some(i=>i.code==='workflow-target-write-conflict'));
assert.ok(analyse('A',w=>{const row=w.outputs[0].assignments[0];row.target='ID';row.when=leaf('empty',undefined,'ID');w.outputs[0].assignments.push({...row,id:'mutable-id',when:leaf('present',undefined,'ID')});}).some(i=>i.code==='workflow-target-write-conflict'),'mutable system ID is not a stable mutually exclusive condition');
assert.ok(analyse('F',w=>{w.steps.find(s=>s.kind==='geometry')!.drawing={captureSlot:'CAPTURE',bindings:[{outputId:w.outputs[0].id,target:'Level',value:'height'}]};}).some(i=>i.code==='workflow-target-write-conflict'));
assert.ok(!analyse('F',w=>{w.outputs.push({...structuredClone(w.outputs[0]),id:'separate'});}).some(i=>i.code==='workflow-target-write-conflict'));
assert.ok(analyse('F',w=>{w.outputs[0].assignments.push({id:'parent',target:'extensions.a',expression:'A'},{id:'child',target:'extensions.a.b',expression:'A'});}).some(i=>i.code==='workflow-target-path-overlap'));
for(const input of ['#abc','#abcd','#123456','#12345678','red','rebeccapurple','transparent','rgb(1, 2, 3)','rgba(1,2,3,.5)','rgb(10% 20% 30% / 50%)','hsl(120deg, 50%, 50%)','hsl(.5turn 20% 40% / .7)'])assert.ok(validCssColor(input),input);
for(const input of ['', 'not-a-color','#12','rgb(1,2)','hsl(1,2,3)','url(x)','var(--x)','rgb(Infinity,0,0)','rgb(1,,2,3)'])assert.ok(!validCssColor(input),input);
assert.equal(validateConfigPackage(null as never).valid,false);
assert.equal(validateConfigPackage({...base,nodes:null} as never).valid,false);
assert.equal(validateWorkflowDefinition({...workflow,steps:null} as never,base).valid,false);
const duplicate=structuredClone(base),node=duplicate.nodes.find(n=>n.path.class==='ROD'&&!n.path.kind)!;
node.fields.push({...structuredClone(node.fields[0]),key:'AuditValue'});
assert.ok(validateConfigPackage(duplicate).issues.some(i=>i.code==='field-id-duplicate'));
assert.equal(referencedField(duplicate,{nodeId:node.nodeId,fieldId:node.fields[0].fieldId}),undefined);
assert.throws(()=>prepareConfigForActivation(duplicate));
assert.ok(validateConfigPackage(base).valid,'legal inherited identities remain valid');
const nested=structuredClone(base),rod=nested.nodes.find(n=>n.path.class==='ROD'&&!n.path.kind)!,field=rod.fields.find(f=>f.key==='tags.nomenclator')!;
field.required=true;field.validateExistingData=true;
const mounted:any={ID:'nested',World:'zth',Class:'ROD',tags:{nomenclator:'value'}};
const missing=()=>validateConfigPackage(nested,[mounted]).issues.some(i=>i.code==='mounted-data-required-field-missing'&&i.field===field.key);
for(const value of ['value',0,false]){mounted.tags.nomenclator=value;assert.equal(missing(),false);}
for(const value of ['',[],null]){mounted.tags.nomenclator=value;assert.equal(missing(),true);}
field.requiredWhen=[{kind:'fieldEquals',field:'tags.flag',value:'yes'}];mounted.tags={flag:'no'};assert.equal(missing(),false);mounted.tags.flag='yes';assert.equal(missing(),true);
field.validateExistingData=false;assert.equal(missing(),false);
const old=JSON.parse(fs.readFileSync('src/configStudio/defaults/r9-r5.config.json','utf8')) as ConfigPackageV3;
for(const code of ['BUD','STB','FLR','STF','RLE']){const artifact=await createCategoryArtifact(old,old.nodes.find(n=>n.path.class===code&&!n.path.kind)!.nodeId,'classTree');assert.throws(()=>prepareCategoryImport(base,artifact),/旧 r9.*完整配置包/);}
const upgraded=migrateConfigToR11(old).config;
let trees=0;
for(const node of upgraded.nodes.filter(n=>!n.path.kind)){assert.ok(prepareCategoryImport(base,await createCategoryArtifact(upgraded,node.nodeId,'classTree')).report.valid);trees++;}
assert.equal(trees,16);
for(const node of base.nodes){assert.ok(prepareCategoryImport(base,await createCategoryArtifact(base,node.nodeId,'node')).report.valid,node.nodeId);}
console.log('release-validation: bounded conditions, expression types, cross-entry writes, IDs, CSS colours, nested required, old-context guidance, 16 upgraded trees and 95 single-node imports passed');
