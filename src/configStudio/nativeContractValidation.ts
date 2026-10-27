import generated from './native-contract-schema.generated.json';
import {symbolHalos} from './halo';
import {imageSourceFormProblems} from './imageLibrary';
import type {ConfigPackageV3,RenderStyle} from './types';
type Schema = { ref?: string; type?: string; const?: unknown; anyOf?: Schema[]; tuple?: Schema[]; items?: Schema; properties?: Record<string, Schema>; required?: string[]; additionalProperties?: Schema };
export type NativeStructureIssue = { path: string; message: string };
/** Strict executable shape generated from the same TypeScript contract used
 * by editors. Legacy/source metadata and explicitly unknown values retain
 * their declared open shape; typed settings reject unknown keys. */
export function validateNativeStructure(value: unknown): NativeStructureIssue[] {
  const definitions = generated.definitions as Record<string, Schema>;
  const inspect = (value: unknown, input: Schema, path: string, depth: number): NativeStructureIssue[] => {
    if (depth > 64) return [{ path, message: '配置嵌套超过 64 层。' }];
    const schema = input.ref ? definitions[input.ref] : input;
    if (schema.anyOf) {
      const choices = schema.anyOf.map(branch => inspect(value, branch, path, depth + 1));
      if (choices.some(issues => !issues.length)) return [];
      return choices.sort((a,b) => a.length - b.length)[0] ?? [{ path, message: '配置值类型无效。' }];
    }
    if ('const' in schema) return value === schema.const ? [] : [{ path, message: `配置值必须为 ${JSON.stringify(schema.const)}。` }];
    if (!schema.type) return [];
    if (schema.type === 'null') return value === null ? [] : [{ path, message: '配置值必须为空。' }];
    if (schema.type === 'array') {
      if (!Array.isArray(value)) return [{ path, message: '配置值必须为数组。' }];
      if (schema.tuple && schema.tuple.length !== value.length) return [{ path, message: `数组必须包含 ${schema.tuple.length} 项。` }];
      return value.flatMap((item,index) => inspect(item, schema.tuple?.[index] ?? schema.items ?? {}, `${path}/${index}`, depth + 1)).slice(0,100);
    }
    if (schema.type === 'object') {
      if (!value || typeof value !== 'object' || Array.isArray(value)) return [{ path, message: '配置值必须为对象。' }];
      const record = value as Record<string, unknown>;
      const issues: NativeStructureIssue[] = (schema.required ?? []).filter(key => record[key] === undefined).map(key => ({ path: `${path}/${key}`, message: '缺少必需的配置属性。' }));
      for (const [key,item] of Object.entries(record)) {
        if (item === undefined) continue;
        const shape = schema.properties?.[key] ?? schema.additionalProperties;
        if (!shape || ['__proto__','constructor','prototype'].includes(key)) issues.push({ path: `${path}/${key}`, message: `未知或不安全的配置属性 ${key}。` });
        else issues.push(...inspect(item, shape, `${path}/${key}`, depth + 1));
        if (issues.length >= 100) break;
      }
      return issues.slice(0,100);
    }
    return typeof value === schema.type && (schema.type !== 'number' || Number.isFinite(value)) ? [] : [{ path, message: `配置值必须为有效的 ${schema.type}。` }];
  };
  const issues=inspect(value, generated.root, 'config', 0);
  if(issues.length)return issues;
  const config=value as ConfigPackageV3;
  const c15=config.contractRevision>=15;
  for(const node of config.nodes)for(const [geometry,profile]of Object.entries(node.geometryProfiles))if(profile){
    const at='config/nodes/'+node.nodeId+'/geometryProfiles/'+geometry;
    if(c15&&(profile.anchor!==undefined||profile.interaction!==undefined))issues.push({path:at,message:'c15 锚点与交互必须位于每条渲染规则，不能残留几何级权威设置。'});
    for(const rule of profile.zoomPriority.rules){
      if(c15&&(!['featureBbox','perPart'].includes(rule.multipartAnchor??'')||!rule.interaction?.triggers))issues.push({path:at+'/rules/'+rule.id,message:'缺少 c15 规则级多部件锚点或交互触发。'});
      if(!c15&&rule.multipartAnchor!==undefined)issues.push({path:at+'/rules/'+rule.id,message:'规则级多部件锚点最低要求 c15。'});
      for(const [style,representation]of [[rule.style,rule.representation],...(rule.conditionalOverrides??[]).map(branch=>[branch.style,branch.representation??rule.representation] as const)] as const)if(style?.halo){
        const point=geometry==='Point'||representation==='point';
        const inner='showInner' in style.halo;
        if(inner&&(!c15||geometry!=='Polygon'||point))issues.push({path:at+'/rules/'+rule.id+'/halo',message:'内侧 Halo 仅用于 c15 面几何。'});
        if(c15&&geometry==='Polygon'&&!point&&!inner)issues.push({path:at+'/rules/'+rule.id+'/halo',message:'缺少面内侧 Halo 的明确布尔设置。'});
      }
    }
  }
  for(const workflow of config.workflows){
    if(config.contractRevision<16&&workflow.external&&(workflow.external.roleBindings!==undefined||workflow.external.referenceBindings!==undefined))issues.push({path:'config/workflows/'+workflow.id+'/external',message:'角色与引用绑定最低要求 c16。'});
    if(config.contractRevision>=16&&workflow.mode==='external'&&(!workflow.external?.roleBindings||workflow.external.coveredClassifications!==undefined))issues.push({path:'config/workflows/'+workflow.id+'/external',message:'c16 专用流程必须使用明确角色绑定，不能保留旧范围副本。'});
    if(config.contractRevision>=16&&workflow.mode==='external'&&workflow.target!==undefined)issues.push({path:'config/workflows/'+workflow.id+'/target',message:'c16 专用范围使用 roleBindings 与 editor.scope，不能保留旧 target 副本。'});
    if(config.contractRevision>=16&&workflow.external?.purpose==='edit'&&!workflow.editor?.scope)issues.push({path:'config/workflows/'+workflow.id+'/editor/scope',message:'c16 专用编辑需要明确的路由范围。'});
    if(c15&&workflow.mode==='composed'&&workflow.target)issues.push({path:'config/workflows/'+workflow.id+'/target',message:'c15 分类组不能保留旧 target 副本。'});
    if(c15)for(const step of workflow.steps)for(const control of step.controls??[])if(control.kind==='classificationPicker'&&control.classificationScope)issues.push({path:'config/workflows/'+workflow.id+'/controls/'+control.id,message:'c15 分类控件由 outputId 解析分类组，不能保留旧范围副本。'});
  }
  for(const workflow of config.workflows)for(const output of workflow.outputs){
    const at='config/workflows/'+workflow.id+'/outputs/'+output.id;
    if(c15&&(!output.classificationGroup||output.classification!==undefined))issues.push({path:at,message:'c15 输出必须使用分类组，不得保留单路径输出副本。'});
    if(!c15&&(!output.classification||output.classificationGroup))issues.push({path:at,message:'此历史契约必须使用单路径输出，分类组最低要求 c15。'});
  }
  const check=(style:RenderStyle|undefined,path:string,required:boolean)=>{
    if(style?.pointSymbol?.kind==='externalImage'){
      const image=style.pointSymbol.image,at=path+'/pointSymbol/image';
      if(image.mode==='fixed'||image.mode==='valueMap'){
        const rows=image.mode==='fixed'?[{value:image,path:at}]:image.entries.map((value,index)=>({value,path:`${at}/entries/${index}`}));
        // Intent is structural; URL policy is semantic so a diagnostic package
        // with a wrong path remains safely importable for repair.
        for(const row of rows)for(const issue of imageSourceFormProblems(row.value,config.contractRevision).filter(issue=>issue.path==='sourceForm'))issues.push({path:row.path+'/'+issue.path,message:issue.message});
      }
    }
    const halos=[{path:path+'/halo',value:style?.halo,required},...symbolHalos(style?.pointSymbol).map(row=>({path:path+'/pointSymbol/'+row.path,value:row.value,required:config.contractRevision>=14}))];
    for(const row of halos){
      if(config.contractRevision<14&&row.value!==undefined)issues.push({path:row.path,message:'Halo 最低要求契约 c14，不能在旧契约中加入新属性。'});
      if(config.contractRevision>=14&&row.required&&!row.value)issues.push({path:row.path,message:'缺少 c14 必需 Halo 设置，请明确迁移来源配置。'});
    }
    if(style?.pointSymbol&&style.halo)issues.push({path:path+'/halo',message:'点状显示的 Halo 必须放在具体形状／图标／图片定义中，不能同时设置顶层 Halo。'});
  };
  for(const node of config.nodes)for(const [geometry,profile] of Object.entries(node.geometryProfiles))if(profile)for(const rule of profile.zoomPriority.rules){
    const path=`config/nodes/${node.nodeId}/geometryProfiles/${geometry}/rules/${rule.id}/style`;
    check(rule.style,path,config.contractRevision>=14&&geometry!=='Point'&&rule.representation!=='point'&&rule.representation!=='hidden'&&rule.representation!=='labelOnly');
    for(const branch of rule.conditionalOverrides??[])check(branch.style,`${path}/conditionalOverrides/${branch.id}`,false);
  }
  return issues;
}
