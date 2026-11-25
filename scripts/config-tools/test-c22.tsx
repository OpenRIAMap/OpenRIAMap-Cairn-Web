import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {migratePackageToContract} from '../../src/configStudio/contractMigration';
import {validateConfigPackage,validateWorkflowDefinition} from '../../src/configStudio/runtime';
import {validateV3WorkflowInputs} from '../../src/configStudio/workflowKernel';
import {validateNativeStructure} from '../../src/configStudio/nativeContractValidation';
import {canonicalizeWorkflow} from '../../src/configStudio/V3WorkflowEditor';
import {workflowLayout,orderedWorkflowControls,workflowLayoutProblems,moveWorkflowLayout,layoutContainer} from '../../src/configStudio/workflowLayout';
import {WorkflowFormLayout} from '../../src/configStudio/WorkflowFormLayout';
import {buildConfigPackageArchive,readConfigPackage} from '../../src/configStudio/package';
import {capsuleColor} from '../../src/configStudio/cssColor';
import {buildV3CardSections} from '../../src/configStudio/V3CardRenderer';
import {normalizeAuditSelection,matchesAuditSelection,priceMicros} from '../../src/core/audit/contributionContract.mjs';
import {normalizeReviewControlRequest} from '../../api/review-control.mjs';
import {applyApplicationSettings,reviewEndpoint} from '../../src/core/project/applicationRuntime';
import {requestRiaContributionAudit,requestRiaReleaseHistory} from '../../src/components/Review/riaReviewSubmissionAdapter';
import type {ConfigPackageV3,WorkflowStep,WorkflowControl} from '../../src/configStudio/types';
(globalThis as any).React=React;
// Pin the immutable c21 input: publishing c22 must not change this migration regression.
const base=JSON.parse(fs.readFileSync('public/configuration/releases/36e3e9aacd32e7fa937315d0b8b927c40d11ef4b84d7331a5dc8ee3878b03ca1/config.json','utf8')) as ConfigPackageV3;
const before=JSON.stringify(base),config=migratePackageToContract(base,22).config,checks:string[]=[];
const check=(name:string,fn:()=>void)=>{fn();checks.push(name);};
check('explicit migration preserves business config and all workflow definitions',()=>{
  assert.equal(JSON.stringify(base),before);assert.equal(config.contractRevision,22);assert.equal(config.revision,base.revision);assert.deepEqual(config.nodes,base.nodes);assert.deepEqual(config.lookupTables,base.lookupTables);
  const report=validateConfigPackage(config);assert(report.valid,JSON.stringify(report.issues.filter(i=>i.severity==='error').slice(0,4)));
  for(const original of base.workflows){const w=config.workflows.find(w=>w.id===original.id)!;assert.deepEqual(w.outputs,original.outputs);for(const step of original.steps){const s=w.steps.find(s=>s.id===step.id)!;if(step.kind!=='form'){assert.deepEqual(s,step);continue;}assert.deepEqual(workflowLayout(step),s.layout);for(const c of s.controls??[]){const {sectionId,...old}=step.controls!.find(old=>old.id===c.id)!;assert.deepEqual(c,old);assert(!('sectionId' in c));}}}
});
const form:WorkflowStep={id:'page',kind:'form',label:{zh:'页',en:''},sections:[{id:'section',label:{zh:'分栏',en:''},initialOpen:false}],controls:[{id:'a',kind:'text',columns:1,label:{zh:'A',en:''}},{id:'b',kind:'text',columns:1,label:{zh:'B',en:''}},{id:'sys',kind:'classificationPicker',columns:1,label:{zh:'分类',en:''},systemManaged:true}],layout:[{kind:'control',controlId:'a'},{kind:'section',sectionId:'section',children:[{kind:'control',controlId:'b'}]},{kind:'control',controlId:'sys'}]};
check('move transactions retain definitions and restrict nested/system targets',()=>{
 const top=layoutContainer('page'),inside=layoutContainer('page','section');
 const moved=moveWorkflowLayout([form],{from:'a',to:'',fromContainer:top,toContainer:inside,after:true,into:'start'});
 assert.deepEqual(orderedWorkflowControls(moved[0]).map(c=>c.id),['a','b','sys']);assert.deepEqual(moved[0].controls,form.controls);assert.deepEqual(workflowLayoutProblems(moved[0]),[]);
 const extracted=moveWorkflowLayout(moved,{from:'a',to:'sys',fromContainer:inside,toContainer:top,after:true});assert.deepEqual(orderedWorkflowControls(extracted[0]).map(c=>c.id),['b','sys','a']);
 for(const id of ['sys','section'])assert.deepEqual(moveWorkflowLayout([form],{from:id,to:'',fromContainer:top,toContainer:inside,after:true}),[form]);
 const second:WorkflowStep={id:'page2',kind:'form',label:{zh:'第二页',en:''},controls:[],layout:[]};
 const cross=moveWorkflowLayout([form,second],{from:'section',to:'',fromContainer:top,toContainer:layoutContainer('page2'),after:true});assert.equal(cross[1].controls?.[0].id,'b');assert.equal(cross[1].sections?.[0].id,'section');assert(!cross[0].controls?.some(c=>c.id==='b'));
});
check('strict layout refuses duplicates, orphans, illegal system members, and c21 mixed ownership',()=>{
 for(const mutate of [(s:WorkflowStep)=>s.layout!.push({kind:'control',controlId:'a'}),(s:WorkflowStep)=>s.layout!.push({kind:'control',controlId:'missing'}),(s:WorkflowStep)=>s.layout!.pop(),(s:WorkflowStep)=>{s.controls![0].sectionId='section';},(s:WorkflowStep)=>{const section=s.layout![1];if(section.kind==='section')section.children.push({kind:'control',controlId:'sys'});}]){const s=structuredClone(form);mutate(s);assert(workflowLayoutProblems(s).length);}
 const c=structuredClone(config),w=c.workflows.find(w=>w.steps.some(s=>s.kind==='form'))!,s=w.steps.find(s=>s.kind==='form')!;s.layout!.push({kind:'control',controlId:'missing'});assert(validateNativeStructure(c).length);assert(!validateWorkflowDefinition(w,c).valid);
 const old=structuredClone(base);old.workflows.flatMap(w=>w.steps).find(s=>s.kind==='form')!.layout=[];assert(validateNativeStructure(old).length);
});
check('required errors follow layout references, independently of definition storage order',()=>{
 const workflow=structuredClone(config.workflows.find(w=>w.mode==='composed')!),step=structuredClone(form);
 step.sections=[];step.controls=step.controls!.filter(c=>c.id!=='sys').map(c=>({...c,slot:c.id.toUpperCase(),required:true}));step.layout=[{kind:'control',controlId:'b'},{kind:'control',controlId:'a'}];workflow.steps=[step];
 const issues=validateV3WorkflowInputs(workflow,{}).filter(i=>i.controlId);assert.deepEqual(issues.map(i=>i.controlId),['b','a']);assert.deepEqual(step.controls.map(c=>c.id),['a','b']);
});
check('canonicalization preserves moved layout and empty section; runtime hides empty conditional section',()=>{
 const w=structuredClone(config.workflows.find(w=>w.mode==='composed')!);const s=w.steps.find(s=>s.kind==='form')!;
 s.sections??=[];s.sections.push({id:'empty',label:{zh:'空分栏',en:''}});s.layout!.unshift({kind:'section',sectionId:'empty',children:[]});const once=canonicalizeWorkflow(w,config),twice=canonicalizeWorkflow(once,config);assert.deepEqual(twice,once);assert.equal(once.steps.find(p=>p.id===s.id)!.layout?.[0].kind,'section');
 const html=renderToStaticMarkup(<WorkflowFormLayout step={form} controls={form.controls!.filter(c=>c.id!=='b')} render={c=><span key={c.id}>{c.id}</span>}/>);assert(!html.includes('data-workflow-section='));assert(html.includes('sys'));
 const all=renderToStaticMarkup(<WorkflowFormLayout step={form} controls={form.controls!} render={c=><span key={c.id}>{c.id}</span>}/>);assert(all.includes('aria-expanded="false"'));assert(all.indexOf('>a<')<all.indexOf('data-workflow-section'));
});
check('capsule accepts both hex forms and valid CSS; actual information card preserves stored text',()=>{
 assert.equal(capsuleColor(' FFD700 '),'#FFD700');assert.equal(capsuleColor('abc'),'#abc');assert.equal(capsuleColor('#11223344'),'#11223344');assert.equal(capsuleColor('rgb(1, 2, 3)'),'rgb(1, 2, 3)');assert.equal(capsuleColor('badcolor','##bad','64748b'),'#64748b');
 const c=structuredClone(config),node=c.nodes.find(n=>n.path.class==='RIL'&&n.path.kind==='RLE')!;node.receiveFromParent={...node.receiveFromParent,card:false};node.card={mode:'fields',items:[{id:'test-color',source:'color',visible:true,renderer:'colorCapsule',label:{zh:'色号',en:''},options:{fallbackColor:'#999999'}}]};
 const record={meta:{idValue:'test-color'},featureInfo:{ID:'test-color',Class:'RIL',Kind:'RLE',color:'FFD700',Name:'测试'}} as any;
 const sections=buildV3CardSections(c,record);assert(JSON.stringify(sections).includes('"color":"#FFD700"'));assert.equal(record.featureInfo.color,'FFD700');
 node.card.items[0].renderer='nameColorCapsule';assert(JSON.stringify(buildV3CardSections(c,record)).includes('"color":"#FFD700"'));
});
check('selection actor, parent paths, exclusions, historical casing, dataset and normalized cursor identity',()=>{
 const make=(id:string)=>normalizeAuditSelection({schemaVersion:'cairnmap.contribution-selection.v1',userId:' A ',datasetValue:' ZInd1 ',classificationScope:{rows:[{id,condition:'include',path:{class:'BUD'}},{id:id+'2',condition:'exclude',path:{class:'BUD',kind:'SUB'}}]}})!;
 assert.deepEqual(make('a'),make('b'));const s=make('a'),op={kind:'modify',actor:'A',after:{Class:'BUD',Kind:'LAR',Skind:'IND',CreateBy:'B',tags:{dataset:'ZInd1'}}};assert(matchesAuditSelection(s,op));assert(!matchesAuditSelection(s,{...op,actor:'B'}));assert(!matchesAuditSelection(s,{...op,kind:'delete',before:op.after}));assert(!matchesAuditSelection(s,{...op,after:{...op.after,Kind:'SUB'}}));
 for(const selection of [{schemaVersion:'bad'},{schemaVersion:'cairnmap.contribution-selection.v1',userId:114},{schemaVersion:'cairnmap.contribution-selection.v1',classificationScope:{rows:[{condition:'exclude',path:{class:'BUD'}}]}},{schemaVersion:'cairnmap.contribution-selection.v1',classificationScope:{rows:[{condition:'include',path:{class:'BUD',skind:'IND'}}]}}])assert.throws(()=>normalizeAuditSelection(selection));
 assert.throws(()=>normalizeAuditSelection(s,"CreateBy = 'B'"));
 const normalized=normalizeReviewControlRequest({operation:'contribution-audit-query',query:{selection:s}},{principalId:'actual'});assert.deepEqual(normalized.query.selection,s);
 assert.throws(()=>normalizeReviewControlRequest({operation:'contribution-audit-detail',query:{selection:s}},{principalId:'actual'}));
});
check('defaults are exact nonnegative decimal values and c22 endpoints are mandatory',()=>{
 assert.deepEqual(config.application!.preferences.auditCalculationDefaults,{featuresCreated:'0',optionalAdded:'0',requiredEdited:'0',optionalEdited:'0'});
 for(const v of ['0','0.000001','999999999999.999999'])assert.doesNotThrow(()=>priceMicros(v));for(const v of ['-1','1e2','1.0000001'])assert.throws(()=>priceMicros(v));
 const bad=structuredClone(config);delete bad.application!.review.auditQuery;assert(validateNativeStructure(bad).length);bad.application!.review.auditQuery='https://example.test/audit';assert(validateNativeStructure(bad).length);
});
const archive=await buildConfigPackageArchive(config,validateConfigPackage(config));const roundtrip=await readConfigPackage(new File([archive],'c22.zip'));assert.equal(roundtrip.contractRevision,22);assert.deepEqual(roundtrip.workflows,config.workflows);checks.push('archive roundtrip preserves layout and definition identities');
const paths:string[]=[],originalFetch=globalThis.fetch;
try{const app=structuredClone(config.application!);Object.assign(app.review,{releaseHistory:'/test/history',auditQuery:'/test/query',auditCoverage:'/test/coverage',auditDetail:'/test/detail'});applyApplicationSettings(app);globalThis.fetch=(async(url:any)=>{paths.push(String(url));return new Response('{}',{status:200,headers:{'content-type':'application/json'}});}) as typeof fetch;
 await requestRiaReleaseHistory({});for(const kind of ['query','coverage','detail'] as const)await requestRiaContributionAudit(kind,{});assert.deepEqual(paths,['/test/history','/test/query','/test/coverage','/test/detail']);
 applyApplicationSettings(base.application);assert.equal(reviewEndpoint('auditQuery'),base.application!.review.control);checks.push('all configured paths are used; c21 retains control endpoint');
}finally{globalThis.fetch=originalFetch;}
console.log(JSON.stringify({passed:checks.length,checks},null,2));
