import type {BasePointStyle,CategoryNode,ConfigPackageV3,GeometryKind,GeometryProfile,RenderStyle,WorkflowDefinition} from './types';
import type {MigrationChange} from './contractMigration';
import {haloWidth} from './halo';
import {hasCategoryNode,hasDescendants} from './runtime';

function note(changes:MigrationChange[],path:string,before:unknown,after:unknown,message:string,kind:MigrationChange['kind']='converted'){
  changes.push({id:'c14-c15:'+path,kind,component:path.startsWith('workflows/')?'workflow':'render',path,message,before:structuredClone(before),after:structuredClone(after)});
}
function circle(host:Partial<BasePointStyle>,changes:MigrationChange[],path:string){
  if((host.pointShape??'circle')!=='circle')return;
  const before=host.size??Math.max(4,Number(host.weight??2)*3),after=haloWidth(host.halo)>0?Math.max(2,before):Math.max(1,Math.round(before));
  if(before!==after){host.size=after;note(changes,path+'/size',before,after,'保持旧版圆形实际显示半径；c15 新输入小数不再取整。');}
}
/** Creation uses defaults only; migration additionally preserves the old circle footprint. */
export function initializeC15Profile(profile:GeometryProfile,geometry:GeometryKind,changes:MigrationChange[]=[],root='profile',migrate=false){
  const anchor=profile.anchor??'featureBbox',interaction=structuredClone(profile.interaction??{triggers:{}});
  const style=(value:RenderStyle|undefined,at:string,point:boolean,inherited?:RenderStyle,migratedInherited?:RenderStyle)=>{
    if(!value)return;
    const symbol=value.pointSymbol;
    if(symbol){if(migrate){if(symbol.kind==='shape')circle(symbol.shape,changes,at+'/pointSymbol/shape');else circle(symbol.fallback,changes,at+'/pointSymbol/fallback');}}
    else if(point&&migrate&&!inherited?.pointSymbol){
      const effective={...inherited,...value},desired={...effective};circle(desired,changes,at);
      const current={...migratedInherited,...value},oldRadius=desired.size??Math.max(4,Number(desired.weight??2)*3),newRadius=current.size??Math.max(4,Number(current.weight??2)*3);
      if((effective.pointShape??'circle')==='circle'&&oldRadius!==newRadius){value.size=oldRadius;if(!changes.some(change=>change.path===at+'/size'))note(changes,at+'/size',newRadius,oldRadius,'按条件分支的有效样式保留旧圆形半径，只写必要覆盖。');}
    }
    if(geometry==='Polygon'&&!point&&value.halo&&!('showInner' in value.halo)){
      const showInner=migrate&&haloWidth(value.halo)>0&&(value.fillOpacity??inherited?.fillOpacity??.25)<1;
      value.halo={...value.halo,showInner};
      note(changes,at+'/halo/showInner',undefined,showInner,showInner?'新增面内侧 Halo；现在主动显示在填色上方，半透明面请检查效果。':'新增面内侧开关，保持关闭。','default');
    }
  };
  for(const rule of profile.zoomPriority.rules){
    const at=root+'/rules/'+rule.id,sourceStyle=structuredClone(rule.style);
    if(rule.multipartAnchor===undefined){rule.multipartAnchor=anchor;note(changes,at+'/multipartAnchor',undefined,anchor,'多部件锚点由几何级移入规则。');}
    if(migrate||!rule.interaction){const prior=rule.interaction;rule.interaction=structuredClone(interaction);note(changes,at+'/interaction',prior,rule.interaction,'复制旧版实际生效的几何级触发；不激活旧规则中失效的触发。');}
    style(rule.style,at+'/style',geometry==='Point'||rule.representation==='point');
    for(const branch of rule.conditionalOverrides??[])style(branch.style,at+'/conditionalOverrides/'+branch.id+'/style',geometry==='Point'||(branch.representation??rule.representation)==='point',sourceStyle,rule.style);
  }
  if(profile.anchor!==undefined)note(changes,root+'/anchor',profile.anchor,undefined,'已移入每条规则，删除旧权威位置。','removed');
  if(profile.interaction!==undefined)note(changes,root+'/interaction',profile.interaction,undefined,'已移入每条规则，删除旧权威位置。','removed');
  delete profile.anchor;delete profile.interaction;
}
export function migrateC15Nodes(nodes:CategoryNode[],changes:MigrationChange[]){
  for(const node of nodes)for(const [geometry,profile]of Object.entries(node.geometryProfiles))if(profile)initializeC15Profile(profile,geometry as GeometryKind,changes,'nodes/'+node.nodeId+'/geometryProfiles/'+geometry,true);
}
export function migrateC15Workflow(workflow:WorkflowDefinition,config:ConfigPackageV3|undefined,changes:MigrationChange[]){
  if(workflow.mode==='composed'&&workflow.editor?.enabled&&!workflow.editor.scope&&workflow.outputs[0]?.classification){workflow.editor.scope=structuredClone(workflow.outputs[0].classification);note(changes,'workflows/'+workflow.id+'/editor/scope',undefined,workflow.editor.scope,'保留旧版由输出路径推导的编辑范围与路由优先级。');}
  for(const output of workflow.outputs){
    if(output.classificationGroup)continue;
    const path=output.classification;
    if(!path||!config||!hasCategoryNode(config,path))throw Error('工作流分类组迁移缺少有效分类树上下文：'+workflow.id+'/'+output.id);
    const group={selectors:[{id:output.id+'-classification-1',mode:hasDescendants(config,path)?'leafDescendants' as const:'self' as const,path:structuredClone(path)}]};
    output.classificationGroup=group;delete output.classification;
    note(changes,'workflows/'+workflow.id+'/outputs/'+output.id+'/classificationGroup',path,group,'原输出范围迁移为分类组，保留 outputId、绘制类型和组装。');
  }
  for(const step of workflow.steps)for(const control of step.controls??[])if(control.kind==='classificationPicker'&&control.classificationScope){note(changes,'workflows/'+workflow.id+'/steps/'+step.id+'/controls/'+control.id+'/classificationScope',control.classificationScope,undefined,'分类控件改由原 outputId 解析分类组，删除旧范围副本。','removed');delete control.classificationScope;}
  if(workflow.mode==='composed'&&workflow.target){note(changes,'workflows/'+workflow.id+'/target',workflow.target,undefined,'移除旧第一输出范围副本。','removed');delete workflow.target;}
}
