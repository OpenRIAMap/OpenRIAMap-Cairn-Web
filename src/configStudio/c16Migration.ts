import type {CategoryNode,ClassificationPath,ConfigPackageV3,ExternalReferenceBinding,WorkflowDefinition} from './types';
import type {MigrationChange} from './contractMigration';
import {legacyExternalRoleBindings} from './externalLegacyBindings';
import {EXTERNAL_COMPONENT_ROLES} from './externalCapabilities';
import {classificationPathKey} from './runtime';

const legacyReferenceScopes:Record<string,ClassificationPath[]> = {
 landUnit:[{class:'ISG',kind:'NGF',skind:'LAD'},{class:'ISG',kind:'NGF',skind:'WTB'},{class:'ISG',kind:'NGF',skind:'LIS',skind2:'PEN'},{class:'ISG',kind:'NGF',skind:'LIS',skind2:'IST'}],
 settlementPoint:[{class:'ISP',kind:'ADM',skind:'DBP',skind2:'SHR'}],
 settlementArea:[{class:'ISG',kind:'ADM',skind:'DBZ'},{class:'ISG',kind:'ADM',skind:'PLZ'}],
};
const currentReferenceScopes:Record<string,ClassificationPath[]> = {
 landUnit:[{class:'NGF',kind:'LAD'},{class:'NGF',kind:'WTR',skind:'LWB'},{class:'NGF',kind:'LIS',skind:'LAG',skind2:'PEN'},{class:'NGF',kind:'LIS',skind:'LAG',skind2:'IST'}],
 settlementPoint:[{class:'ADM',kind:'DBP',skind:'SHR'}],settlementArea:[{class:'ADM',kind:'DBZ'}],
};
export function migrationReferenceBindings(config:ConfigPackageV3|undefined):ExternalReferenceBinding[]{
 return Object.keys(currentReferenceScopes).map(bindingId=>{
  const present=(paths:ClassificationPath[])=>paths.filter(path=>config?.nodes.some(node=>classificationPathKey(node.path)===classificationPathKey(path)));
  const modern=present(currentReferenceScopes[bindingId]),paths=modern.length?modern:present(legacyReferenceScopes[bindingId]);
  return {bindingId,classificationGroup:{selectors:paths.map((path,index)=>({id:bindingId+'-'+index,mode:'leafDescendants' as const,path}))},search:{queryFields:['Name','ID'],returnField:'ID',displayTemplate:'{{Name}}（{{ID}}）',matcher:'contains',cacheScope:'world',maxResults:30}};
 });
}
function report(changes:MigrationChange[],path:string,message:string,kind:MigrationChange['kind']='converted',after?:unknown){
 changes.push({id:'c15-c16:'+path,kind,component:'workflow',path,message,...(after!==undefined?{after:structuredClone(after)}:{})});
}
export function migrateC16Workflow(workflow:WorkflowDefinition,context:ConfigPackageV3|undefined,changes:MigrationChange[]){
 if(workflow.mode!=='external')return;
 const external=workflow.external;if(!external)return;
 external.roleBindings??=legacyExternalRoleBindings(context,workflow);
 const expected=EXTERNAL_COMPONENT_ROLES[external.componentKey]??[];
 for(const role of expected)if(!external.roleBindings.some(binding=>binding.role===role))report(changes,'workflows/'+workflow.id+'/external/roleBindings/'+role,'旧声明无法唯一转换为角色绑定；请明确补齐，未自动选择分类。','unresolved');
 if(external.coveredClassifications!==undefined){delete external.coveredClassifications;report(changes,'workflows/'+workflow.id+'/external/roleBindings','旧受控范围转换为明确的业务角色分类组。','converted',external.roleBindings);}
 if(workflow.target){if(external.purpose==='edit'&&!workflow.editor?.scope)workflow.editor={...workflow.editor,enabled:true,scope:structuredClone(workflow.target)};delete workflow.target;report(changes,'workflows/'+workflow.id+'/target','移除旧单路径目标；采集范围由角色绑定、编辑路由由 editor.scope 决定。','removed');}
 if(external.componentKey==='tradePointWorkflow'&&!external.referenceBindings){
  external.referenceBindings=migrationReferenceBindings(context);
  for(const binding of external.referenceBindings)report(changes,'workflows/'+workflow.id+'/external/referenceBindings/'+binding.bindingId,binding.classificationGroup?.selectors.length?'明确交易点引用范围，采集／编辑／卡片共用当前配置。':'缺少可唯一识别的引用范围，请补齐。',binding.classificationGroup?.selectors.length?'default':'unresolved',binding);
 }
 if(external.componentKey==='tradePointEditor'&&!external.referenceBindings){
  const sources=context?.workflows.filter(row=>row.external?.componentKey==='tradePointWorkflow'&&row.external?.purpose!=='edit')??[];
  external.referenceBindings=sources.length===1?['landUnit','settlementPoint','settlementArea'].map(bindingId=>({bindingId,source:{workflowId:sources[0].id,bindingId}})):migrationReferenceBindings(context);
  report(changes,'workflows/'+workflow.id+'/external/referenceBindings','专用编辑引用显式来源，不再读取旧编辑候选过滤器。','default',external.referenceBindings);
 }
}
export function migrateC16Nodes(nodes:CategoryNode[],context:ConfigPackageV3|undefined,changes:MigrationChange[]){
 const sources=context?.workflows.filter(row=>row.external?.componentKey==='tradePointWorkflow'&&row.external?.purpose!=='edit')??[];
 for(const node of nodes)if(node.card?.mode==='component'&&node.card.componentKey==='TRP'&&!node.card.options?.referenceBindings){
  if(sources.length!==1){report(changes,'nodes/'+node.nodeId+'/card/options/referenceBindings','交易卡片缺少唯一引用来源，请选择明确工作流绑定。','unresolved');continue;}
  node.card.options={...node.card.options,referenceBindings:Object.fromEntries(['landUnit','settlementPoint','settlementArea'].map(bindingId=>[bindingId,{workflowId:sources[0].id,bindingId}]))};
  report(changes,'nodes/'+node.nodeId+'/card/options/referenceBindings','交易卡片使用明确引用来源，移除旧地物范围假设。','default',node.card.options.referenceBindings);
 }
}
