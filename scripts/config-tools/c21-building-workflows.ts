import type {ClassificationPath,ConfigPackageV3,FieldDefinition,WorkflowDefinition,WorkflowValueCondition} from '../../src/configStudio/types';
import {classificationPathKey,resolveEffectiveFields} from '../../src/configStudio/runtime';
import {workflowControlFromField} from '../../src/configStudio/workflowFieldControl';
import {workflowClassificationGroup} from '../../src/configStudio/workflowClassificationGroup';
import {groupTagControls} from '../../src/configStudio/c21Workflow';

const L=(zh:string)=>({zh,en:''});
const parse=(text:string):ClassificationPath=>Object.fromEntries(text.split('/').map((value,index)=>[['class','kind','skind','skind2'][index],value])) as ClassificationPath;
export const buildingWorkflowSpecs=[
 {id:'v3-bud-standard',label:'标准建筑',prefix:'BUD/NOM',geometry:'Polygon',editor:'v3-editor-bud-standard'},
 {id:'v3-bud-complex',label:'建筑群',prefix:'BUD/LAR',geometry:'Polygon'},
 {id:'v3-bud-sub-area',label:'附属建筑面',prefix:'BUD/SUB/BUM',geometry:'Polygon'},
 {id:'v3-bud-sub-point',label:'附属设施点',prefix:'BUD/SUB/BUP',geometry:'Point'},
 {id:'v3-flr-standard',label:'标准楼内单元',prefix:'FLR/NOM',geometry:'Polygon',editor:'v3-editor-flr-standard'},
] as const;
const management=new Set(['User','Operator','Contact','Public','Access']);
const structure=new Set(['Address','BuildingNo','RoomNo','Builder','Status','Situation','BuildingID','NofFloor']);
const samePath=(path:ClassificationPath):WorkflowValueCondition=>({token:'',operator:'present',all:[['Class',path.class],['Kind',path.kind??''],['Skind',path.skind??''],['Skind2',path.skind2??'']].map(([token,value])=>({token,operator:'equals',value}))});

/** RIA configuration policy, separate from the generic c21 migration. */
export function configureC21BuildingWorkflows(config:ConfigPackageV3,fieldKeys:string[]):void {
 const bud=config.workflows.find(w=>w.id==='v3-bud_building')!,flr=config.workflows.find(w=>w.id==='v3-flr_unit')!;
 const wanted=new Set([...fieldKeys,'BuildingID','NofFloor']);
 function build(spec:typeof buildingWorkflowSpecs[number],dedicated=false):WorkflowDefinition {
  const floor=spec.prefix.startsWith('FLR'),id=dedicated&&'editor' in spec?spec.editor:spec.id;
  const workflow=structuredClone(floor?flr:bud),output=workflow.outputs[0];
  workflow.id=id;workflow.label=L(spec.label+(dedicated?'（专供编辑）':''));workflow.quickMapping=!dedicated;
  output.id=id+'-output';output.geometry.selected=spec.geometry;
  output.classificationGroup={selectors:[{id:id+'-leaves',mode:'leafDescendants',path:parse(spec.prefix)},...(dedicated?[{id:id+'-historical-parent',mode:'self' as const,path:parse(spec.prefix)}]:[])]};
  delete output.classification;
  workflow.editor={enabled:dedicated||!('editor' in spec),...(dedicated?{dedicated:true}:{}),range:{rows:[{id:id+'-range',condition:'include',path:parse(spec.prefix)}]}};
  for(const step of workflow.steps){
   step.id=id+'-'+step.kind;if(step.kind==='geometry'){step.outputId=output.id;step.geometry=[spec.geometry];step.drawing={...step.drawing,multiple:spec.geometry!=='Point'};}
   for(const control of step.controls??[]){control.id=id+'-'+control.id;if(control.outputId)control.outputId=output.id;}
  }
  for(const assignment of output.assignments)assignment.id=id+'-'+assignment.id;
  const form=workflow.steps.find(s=>s.kind==='form')!;form.sections=[];
  const paths=workflowClassificationGroup(config,output).paths;
  const sets=paths.map(path=>({path,fields:resolveEffectiveFields(config,path)})),fields=new Map<string,FieldDefinition>();
  for(const set of sets)for(const field of set.fields)if(wanted.has(field.key))fields.set(field.key,field);
  for(const [key,field] of fields){
   const pathsWithField=sets.filter(set=>set.fields.some(f=>f.key===key)).map(set=>set.path);
   const when=pathsWithField.length===paths.length?undefined:{token:'',operator:'present' as const,any:pathsWithField.map(samePath)};
   const existing=output.assignments.find(a=>a.target===key),existingControl=existing&&form.controls!.find(c=>c.slot===existing.expression);
   const slot=existingControl?.slot??'C21_'+key.toUpperCase();
   let control=existingControl??workflowControlFromField(field,slot,id+'-'+key,config);
   control.outputId=output.id;control.when=when;
   if(key==='ContainTRP')control={...control,kind:'group',group:{storage:'object',optional:true,addLabel:L('添加交易'),itemFields:[{key:'ID',kind:'featureSearch',required:true,label:L('交易'),search:{target:{class:'TRP'},queryFields:['ID','Name'],returnField:'ID',displayTemplate:'{{Name}}',matcher:'contains',cacheScope:'world',maxResults:30,minQueryLength:1,debounceMs:180}}]}};
   if(key==='BuildingID')control={...control,kind:'featureSearch',search:{target:{class:'BUD'},targetRole:'main',queryFields:['ID','Name'],returnField:'ID',displayTemplate:'{{ID}} ({{Name}})',matcher:'contains',cacheScope:'world',maxResults:30,minQueryLength:1,debounceMs:180}};
   const sectionId=structure.has(key)?'building-details':management.has(key)?'building-management':'building-special';
   control.sectionId=sectionId;
   if(!form.sections.some(s=>s.id===sectionId))form.sections.push({id:sectionId,label:L(sectionId==='building-details'?'建筑与结构信息':sectionId==='building-management'?'使用与管理信息':'用途专属信息'),initialOpen:true});
   if(existingControl)form.controls=form.controls!.map(c=>c.id===existingControl.id?control:c);else form.controls!.push(control);
   if(existing){existing.when=when;}else output.assignments.push({id:id+'-write-'+key,target:key,expression:slot,when});
  }
  groupTagControls(workflow);
  const rank=(control:NonNullable<typeof form.controls>[number])=>control.sectionId==='building-details'?1:control.sectionId==='building-management'?2:control.sectionId==='building-special'?3:control.sectionId==='extra-tag-information'?5:control.kind==='tagsExtensions'?6:output.assignments.some(a=>['extensions.link.wiki','extensions.character.brief'].includes(a.target)&&a.expression===control.slot)?4:0;
  form.controls!.sort((a,b)=>rank(a)-rank(b));
  return workflow;
 }
 const retired=new Set(['v3-bud_building','v3-flr_unit','v3-bud-sub-point']);
 const generated=buildingWorkflowSpecs.flatMap(spec=>[build(spec),...('editor' in spec?[build(spec,true)]:[])]);
 config.workflows=[...config.workflows.filter(w=>!retired.has(w.id)),...generated];
 for(const [world,ids] of Object.entries(config.application?.workflowAvailability??{}))config.application!.workflowAvailability![world]=[...new Set(ids.flatMap(id=>id==='v3-bud_building'?buildingWorkflowSpecs.filter(s=>s.prefix.startsWith('BUD')).map(s=>s.id):id==='v3-flr_unit'?['v3-flr-standard']:id==='v3-bud-sub-point'?[]:[id]))];
 config.nodes=config.nodes.filter(node=>!(['BUD','FLR'].includes(node.path.class)&&node.path.kind==='SPE'));
 for(const button of config.application?.buttons.items??[]){
  if(button.criteria.scope)button.criteria.scope.rows=button.criteria.scope.rows.filter(row=>!(['BUD','FLR'].includes(row.path.class)&&row.path.kind==='SPE'));
  if(button.id==='building'&&button.criteria.scope)for(const prefix of ['BUD/LAR','BUD/SUB'])button.criteria.scope.rows.push({id:'c21-button-'+prefix.replaceAll('/','-'),condition:'include',path:parse(prefix)});
 }
 for(const node of config.nodes){const prefix=classificationPathKey(node.path)+'/';node.children=config.nodes.filter(child=>classificationPathKey(child.path).startsWith(prefix)&&classificationPathKey(child.path).split('/').length===prefix.split('/').length).map(child=>child.nodeId);}
}
