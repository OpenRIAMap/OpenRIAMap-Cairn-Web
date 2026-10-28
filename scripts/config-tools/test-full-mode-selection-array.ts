import assert from 'node:assert/strict';
import fs from 'node:fs';
import {resolveCreateForm,projectCreateDraft,transferCreateDraft,fieldInputStandard} from '../../src/components/Mapping/core/fullCreateForms';
import {convertEditingGeometry,parseCompleteArray,replaceDraftGeometry,validateEditingGeometry} from '../../src/components/Mapping/core/editingGeometry';
import type {ConfigPackageV3,ClassificationPath} from '../../src/configStudio/types';
import type {WorkflowDrawingDraft} from '../../src/components/Mapping/Workflow/WorkflowHost';
const config=JSON.parse(fs.readFileSync('public/configuration/releases/e8f258de720cbcc49938b6edac21e5b6178990cf499fc3c782b495d4cf877036/config.json','utf8')) as ConfigPackageV3;
const frozen=structuredClone(config),air:ClassificationPath={class:'PTA',kind:'AIR',skind:'NOM'},port:ClassificationPath={class:'PTA',kind:'POT',skind:'NOM'};
const a=resolveCreateForm(config,air),b=resolveCreateForm(config,port);assert.equal(a.type,'Polygon');assert.equal(a.form.kind,'native');
if(a.form.kind!=='native'||b.form.kind!=='native')throw Error('Native fixtures');
assert.doesNotThrow(()=>projectCreateDraft(config,air,a.form),'Missing required data is not invalid draft data.');
a.form.draft.slots.EDIT_ID='SAME-ID';const name=a.form.plan.bindings.find(v=>v.target==='Name')!;a.form.draft.slots[name.slot]='untrimmed text ';
const annotation=a.form.plan.controls.find(c=>c.kind==='tagsExtensions')!;a.form.draft.slots[annotation.id]={[a.form.plan.workflow.outputs[0].id]:{tags:[{key:'Adm',type:'text',value:'ADM_TEST'}]}};
const transferred=transferCreateDraft(config,air,a.form,port,b.form);
assert.equal(projectCreateDraft(config,port,transferred).get('tags.Adm'),'ADM_TEST');assert.equal(projectCreateDraft(config,port,transferred).get('ID'),'SAME-ID');assert.equal(projectCreateDraft(config,port,transferred).get('Name'),'untrimmed text ');
const bad=structuredClone(config);bad.nodes.filter(n=>n.path.class==='PTA'&&n.path.kind==='POT').forEach(n=>{n.fields=n.fields.filter(f=>f.key!=='Name');});
// Effective inheritance is intentionally respected; a direct schema variant makes the conflict explicit.
const field=bad.nodes.find(n=>JSON.stringify(n.path)===JSON.stringify(port))!;field.fields.push({fieldId:'bad-name',key:'Name',type:'number',cardinality:'single',input:'text',labels:{zh:'别名',en:''},description:{zh:'',en:''}});
assert.throws(()=>transferCreateDraft(bad,air,a.form,port,resolveCreateForm(bad,port).form),/Name|标准/);
const xyz=(x:number,z:number)=>({x,y:7,z});
const line={type:'LineString' as const,parts:[[xyz(0,0),xyz(5,0),xyz(5,5)]]};
assert.equal(convertEditingGeometry(line,'LineString',true).parts[0].length,3);
assert.throws(()=>convertEditingGeometry(line,'Point',true),/最多 1/);
assert.equal(convertEditingGeometry({type:'LineString',parts:[[xyz(0,0)]]},'Polygon',true).parts.length,1);
assert.equal(validateEditingGeometry({type:'Polygon',parts:[[[xyz(0,0),xyz(5,0)]]]}),undefined);
const polygon={type:'Polygon' as const,parts:[[[xyz(0,0),xyz(20,0),xyz(20,20),xyz(0,20)],[xyz(2,2),xyz(5,2),xyz(5,5),xyz(2,5)]]]},array=[[[[0,7,0],[20,7,0],[20,7,20],[0,7,20]],[[2,7,2],[5,7,2],[5,7,5],[2,7,5]]]];
assert.throws(()=>convertEditingGeometry(polygon,'LineString',true),/内洞/);
assert.equal(parseCompleteArray(JSON.stringify(array),'Polygon',true).parts.length,1);
for(const value of [null,true,'2'])assert.throws(()=>parseCompleteArray(JSON.stringify([[value,7,3]]),'Point',true),/有限数字/);
assert.throws(()=>parseCompleteArray('[[[0,7,0]]]','Point',true),/三元/);
assert.throws(()=>parseCompleteArray('[[0,7,0],[1,7,1]]','Point',false),/禁止多部件/);
assert.throws(()=>parseCompleteArray('[[[0,7,0]]]','LineString',true),/至少需要 2/);
const draft:WorkflowDrawingDraft={geometry:polygon,coordinates:polygon.parts[0][1],editor:{multipart:true,part:0,innerSpace:true,editingHole:true,hole:0,panelOpen:true,showingPartNumbers:false},redo:[]};
const replaced=replaceDraftGeometry(draft,{type:'Polygon',parts:[[polygon.parts[0][0]],...polygon.parts]});
assert.equal(replaced.geometry.parts.length,2);assert.equal(replaced.editor.editingHole,false);assert.deepEqual(replaced.coordinates,polygon.parts[0][0]);assert.equal(draft.editor.editingHole,true);
const jsonConfig=structuredClone(config);jsonConfig.nodes.find(n=>n.path.class==='PTA'&&!n.path.kind)!.fields.push({fieldId:'json-transfer',key:'Sample',type:'json',cardinality:'single',input:'json',labels:{zh:'样例',en:''},description:{zh:'',en:''}});
const src=resolveCreateForm(jsonConfig,air).form,dst=resolveCreateForm(jsonConfig,port).form;
if(src.kind!=='native'||dst.kind!=='native')throw Error('JSON fixture');
for(const [form,slot]of [[src,'SOURCE_JSON'],[dst,'TARGET_JSON']] as const){form.plan.controls.push({id:slot,slot,kind:'json',columns:1,label:{zh:slot,en:''}});form.plan.bindings.push({slot,target:'Sample'});form.plan.workflow.outputs[0].assignments.push({id:slot,target:'Sample',expression:slot});}
for(const value of [0,false,{nested:[0,false,'text']}]){src.draft.slots.SOURCE_JSON=JSON.stringify(value);const next=transferCreateDraft(jsonConfig,air,src,port,dst);assert.deepEqual(projectCreateDraft(jsonConfig,port,next).get('Sample'),value);}
for(const form of [src,dst]){const control=form.plan.controls.find(c=>c.slot?.endsWith('_JSON'))!;control.kind='group';control.group={storage:'object',itemFields:[{key:'label',label:{zh:'内容',en:''},kind:'text',valueNormalization:'trim'}]};}
src.draft.slots.SOURCE_JSON=[{label:' keep spaces '}];const grouped=transferCreateDraft(jsonConfig,air,src,port,dst);assert.deepEqual(projectCreateDraft(jsonConfig,port,grouped).get('Sample'),[{label:' keep spaces '}]);
const externalConfig=structuredClone(config),trp:ClassificationPath={class:'TRP',kind:'NOM',skind:'NOM'};externalConfig.nodes.find(n=>n.path.class==='TRP'&&!n.path.kind)!.fields.push({fieldId:'nested-number',key:'tags.NumericSample',type:'number',cardinality:'single',input:'text',labels:{zh:'数值',en:''},description:{zh:'',en:''}});
const external=resolveCreateForm(externalConfig,trp).form;if(external.kind!=='external')throw Error('External fixture');external.view.fields.push({key:'NumericSample',path:'tags.NumericSample',label:'数值',control:'number',order:1000});external.values['tags.NumericSample']='12.5';assert.equal(projectCreateDraft(externalConfig,trp,external).get('tags.NumericSample'),12.5);external.values['tags.NumericSample']='not a number';assert.throws(()=>projectCreateDraft(externalConfig,trp,external),/有限数字/);
const left={fieldId:'left',key:'Sample',type:'json' as const,cardinality:'single' as const,input:'json' as const,labels:{zh:'A',en:''},description:{zh:'',en:''},valueSchema:{type:'object' as const,properties:{a:{anyOf:[{type:'number' as const},{type:'boolean' as const}]}},required:['a']}};
const right={...left,fieldId:'right',labels:{zh:'不同标题',en:''},valueSchema:{type:'object' as const,properties:{a:{anyOf:[{type:'boolean' as const},{type:'number' as const}]}},required:[]}};
assert.deepEqual(fieldInputStandard(config,left),fieldInputStandard(config,right),'Schema key/branch order, labels and required completeness do not change the input value standard.');
assert.deepEqual(config,frozen);console.log('Full creation: missing-required draft, exact field transfer, schema rejection, partial geometry, strict complete arrays and focus reconciliation passed.');
