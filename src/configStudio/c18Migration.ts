import type {CategoryNode,ConfigPackageV3,WorkflowDefinition} from './types';
import type {MigrationChange} from './contractMigration';
import {resolveNodeFieldSettings} from './nodeFieldSettings';
import {classificationPathKey,inheritanceControls,resolveEffectiveFields,resolveGeometryProfile,resolveCardConfiguration} from './runtime';
import {toSignedScope} from './classificationScope';
import {migrateButtonClassification} from '../core/project/buttonClassification';
import {syncWorkflowClassification} from './systemClassification';
import {defaultAboutContent} from './defaultAbout';

export function migrateC18Ranges(document:unknown,changes:MigrationChange[],path='config'){
  if(Array.isArray(document)){document.forEach((item,index)=>migrateC18Ranges(item,changes,path+'/'+index));return;}
  if(!document||typeof document!=='object')return;
  const value=document as Record<string,unknown>;
  let converted=false;
  if(value.mode==='external'&&value.target&&value.targetIdField&&value.targetColorField){value.targetScope=toSignedScope([value.target as import('./types').ClassificationPath]);value.target={class:''};converted=true;}
  if(value.targetClassification&&!value.targetRole){value.targetScope=toSignedScope([value.targetClassification as import('./types').ClassificationPath]);delete value.targetClassification;converted=true;}
  if(value.target&&value.queryFields&&value.returnField&&!value.targetRole){value.scope=toSignedScope([value.target as import('./types').ClassificationPath]);value.target={class:''};converted=true;}
  if(converted)changes.push({id:'c17-c18:range:'+path,kind:'converted',component:'scope',path,message:'原四级功能范围转为显式 + 条件，可再添加排除范围。'});
  for(const [key,item] of Object.entries(value))if(!['legacy','defaultValue','targetScope','scope','source','valueSchema'].includes(key))migrateC18Ranges(item,changes,path+'/'+key);
}

export function migrateC18Nodes(nodes:CategoryNode[],config:ConfigPackageV3|undefined,changes:MigrationChange[]){
  // Fragment input takes precedence over the destination. Migration must not
  // replace an imported local setting with the destination's current setting.
  const incomingKeys=new Set(nodes.map(node=>classificationPathKey(node.path)));
  const rest=(config?.nodes??[]).filter(node=>!incomingKeys.has(classificationPathKey(node.path))).map(node=>{
    if((config?.contractRevision??17)<18)return node;
    const settings=resolveNodeFieldSettings(config!,node.path).value;
    return {...node,fieldSettings:settings};
  });
  const context={...config,nodes:[...rest,...nodes],contractRevision:17} as ConfigPackageV3;
  const values=nodes.map(node=>({node,settings:structuredClone(resolveNodeFieldSettings(context,node.path).value),fields:structuredClone(resolveEffectiveFields(context,node.path)),profiles:Object.fromEntries((['Point','LineString','Polygon'] as const).flatMap(key=>{const profile=resolveGeometryProfile(context,node.path,key);return profile?[[key,structuredClone(profile)]]:[];})),card:structuredClone(resolveCardConfiguration(context,node.path))}));
  for(const {node,settings,fields,profiles,card} of values){
    const controls=inheritanceControls(node);
    node.inheritDown={...controls,search:Boolean(controls.fields&&settings.search?.inheritance==='sealed')};
    if(settings.structure){node.displaySettings={structure:settings.structure};if(settings.structure.role==='main')settings.structure.floorViewMinZoom=config?.engine?.contextView?.minZoom??6;else settings.structure.allowIndependentDisplay=false;}
    if(settings.search){node.searchSettings=settings.search;delete node.searchSettings.inheritance;}
    delete node.fieldSettings;
    // Old module propagation independent of fields is detached, preserving the
    // complete effective view before introducing the c18 dependency rule.
    if(!controls.fields&&(controls.display||controls.card)){
      node.fields=fields;node.geometryProfiles=profiles;node.card=card;
      node.inheritDown.display=false;node.inheritDown.card=false;
      changes.push({id:`c17-c18:detach:${node.nodeId}`,kind:'converted',component:'inheritance',path:`nodes/${node.nodeId}`,message:'保留有效字段、信息卡与渲染副本；未启用字段继承的模块已解除传播锁定。'});
    }
    changes.push({id:`c17-c18:settings:${node.nodeId}`,kind:'converted',component:'category',path:`nodes/${node.nodeId}`,message:'搜索迁入独立软继承设置，包含关系迁入显示设置；既有有效内容保持。'});
  }
}
export function migrateC18Workflow(workflow:WorkflowDefinition,config:ConfigPackageV3|undefined){
  for(const output of workflow.outputs)for(const row of output.classificationGroup?.selectors??[])if(row.mode==='leafDescendants')row.condition='include';
  for(const role of workflow.external?.roleBindings??[])for(const row of role.classificationGroup.selectors)if(row.mode==='leafDescendants')row.condition='include';
  for(const binding of workflow.external?.referenceBindings??[])if(binding.classificationGroup)for(const row of binding.classificationGroup.selectors)if(row.mode==='leafDescendants')row.condition='include';
  if(workflow.editor?.scope){workflow.editor.range=toSignedScope([workflow.editor.scope]);delete workflow.editor.scope;}
  return config?syncWorkflowClassification({...config,contractRevision:18},workflow):workflow;
}
export function migrateC18Application(config:ConfigPackageV3,changes:MigrationChange[]){
  const app=config.application;if(!app)return;
  const quick=config.workflows.filter(workflow=>workflow.quickMapping!==false&&workflow.external?.purpose!=='edit').map(workflow=>workflow.id);
  app.workflowAvailability=Object.fromEntries(app.worlds.map(world=>[world.id,[...quick]]));
  app.preferences.pictureControls={allowUpload:true,allowExternalLink:true};
  app.announcements={items:[]};app.about=defaultAboutContent();
  const buttons=migrateButtonClassification(app.buttons,config.nodes.map(node=>node.path)).buttons;
  buttons.items=buttons.items.map(button=>({...button,criteria:{scope:toSignedScope(button.criteria.paths??[])}}));app.buttons=buttons;
  for(const selectors of [app.preferences.railwayRoles?.selectors,app.navigation?.rail.selectors,app.navigation?.teleport.selectors,app.navigation?.road.selectors])if(selectors)for(const key of Object.keys(selectors)){const value=selectors as Record<string,import('./classificationScope').ClassificationRange>;value[key]=toSignedScope(value[key]);}
  changes.push({id:'c17-c18:application',kind:'default',component:'application',path:'application',message:'新增各世界工作流清单、公告、关于内容及图片控制；原分类范围转为 + 条件。'});
}
