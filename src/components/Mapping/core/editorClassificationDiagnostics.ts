import type {ClassificationPath,ConfigPackageV3,GeometryKind,WorkflowDefinition} from '@/configStudio/types';
import {classificationPathKey,hasCategoryNode,pathMatchesScope,resolveGeometryProfile,workflowPathLabel} from '@/configStudio/runtime';
import {categoryAllowsParts} from '@/configStudio/multipartPolicy';
import {findEditingWorkflow,type WorkflowEditPlan} from '@/configStudio/workflowEditing';

export type EditorClassificationIssue={code:string;message:string};
type Request={config:ConfigPackageV3;path:ClassificationPath;geometry:GeometryKind;parts:number;workflow?:WorkflowDefinition;plan?:WorkflowEditPlan;externalPaths?:ClassificationPath[]};
/** Explain existing admission policies; does not create a new field-group gate. */
export function diagnoseEditorClassification({config,path,geometry,parts,workflow,plan,externalPaths}:Request):EditorClassificationIssue[]{
  const label=workflowPathLabel(config,path)||'未选择分类';
  const context=`当前选择 ${label}；${workflow?`编辑方案 ${workflow.label.zh||workflow.label.en||workflow.id}：`:''}`;
  const issue=(code:string,message:string)=>[{code,message:context+message+' 当前选择尚未应用，原分类、字段及完整几何草稿保持。'}];
  const levels=['class','kind','skind','skind2'] as const;
  if(!path.class||levels.some((level,index)=>path[level]&&levels.slice(0,index).some(parent=>!path[parent]))||!hasCategoryNode(config,path))return issue('invalid-path','分类未选定、路径不连续或节点已不存在，请完成有效分类选择。');
  if(!resolveGeometryProfile(config,path,geometry)?.enabled){
    const enabled=(['Point','LineString','Polygon'] as const).filter(kind=>resolveGeometryProfile(config,path,kind)?.enabled);
    return issue('geometry-disabled',`未启用当前 ${geometry} 几何，可用类型：${enabled.join(' / ')||'无'}。`);
  }
  const scope=workflow?.editor?.scope??workflow?.target??workflow?.outputs[0]?.classification;
  const accepted=plan?.classifications??externalPaths;
  if(accepted&&!accepted.some(candidate=>classificationPathKey(candidate)===classificationPathKey(path))){
    const descendants=accepted.filter(candidate=>pathMatchesScope(candidate,path));
    const suggestions=(descendants.length?descendants:accepted).slice(0,3).map(candidate=>workflowPathLabel(config,candidate)).join('、');
    const advice=`本方案仅接纳 ${suggestions||'无可用分类'}${accepted.length>3?`等 ${accepted.length} 个分类`:''}。`;
    if(descendants.length)return issue('ancestor-not-accepted',`当前是候选分类的上级，本方案未接纳该节点自身。${advice}请继续选择对应下级；有下级的节点并非一律不可保存。`);
    if(scope&&!pathMatchesScope(path,scope))return issue('outside-editor-scope',`超出本方案编辑作用范围 ${workflowPathLabel(config,scope)}。${advice}不会自动切换到其他编辑方案。`);
    const modes=workflow?.outputs.flatMap(output=>output.classificationGroup?.selectors.map(selector=>selector.mode)??[])??[];
    return issue(externalPaths?'specialized-scope':'outside-output-group',`不属于${externalPaths?'专用角色绑定':'本方案输出分类组'}。${modes.includes('leafDescendants')?'分类组包含仅展开末端的指定；目标节点自身须明确纳入才可选择。':''}${advice}`);
  }
  if(parts>1&&!categoryAllowsParts(config,path,geometry))return issue('multipart-forbidden',`现有 ${parts} 个部件，目标分类禁止多部件。请通过原“多部件和内洞设置”处理或选择允许的分类，不自动修剪。`);
  if(!workflow){
    let selected:WorkflowDefinition|undefined;
    try{selected=findEditingWorkflow(config,{Class:path.class,Kind:path.kind,SKind:path.skind,SKind2:path.skind2});}
    catch(error){return issue('invalid-editor',error instanceof Error?error.message:'无法解析当前编辑方案。');}
    if(!selected)return issue('no-editor','没有启用的编辑方案，请在工作台配置该分类的编辑范围。');
    if(selected.mode==='composed'&&selected.outputs[0]?.geometry.selected!==geometry||selected.mode==='external'&&geometry!=='Point')return issue('editor-geometry',`最高优先级编辑方案 ${selected.label.zh||selected.id} 与当前 ${geometry} 几何不相容，不自动改用次优先级方案。`);
  }
  return [];
}
