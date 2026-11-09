import {HelpLabel} from './SettingHelp';
import { RenderRuleExtensionsEditor } from './RenderRuleExtensionsEditor';
import { DisplayPrioritySettings } from './DisplayPrioritySettings';
import { RuleInteractionSettings } from './InteractionShapeSettings';
import { ColorBindingEditor } from './ColorBindingEditor';
import { OrderedDensityEditor } from './OrderedDensityEditor';
import { densityGridAt, emptyLogicModules, interactionSnapshot, LOGIC_MODULE_NAMES, LOGIC_MODULES, logicExtensions, resolveLogicModules } from './c19Render';
import type { ClassificationPath, ConfigPackageV3, GeometryKind, RenderCollisionExtension, RenderLogicModules, ZoomPriorityRule } from './types';

type Context = { config:ConfigPackageV3; geometry:GeometryKind; fields:string[]; path:ClassificationPath };
type ModuleKey = keyof RenderLogicModules;
const roleTargets = ['required','important','optional','soft','ignore'].map(role=>'role:'+role);
const roles: Record<string,string> = {required:'必显',important:'重要',optional:'普通',soft:'弱',ignore:'忽略',symbol:'符号',geometry:'几何'};
export const moduleApplies = (key:ModuleKey, geometry:GeometryKind)=>key!=='line'||geometry==='LineString';

export function C19LogicModule({ config, geometry, path, fields, modules, part, onChange, rule }: Context & {
  modules:RenderLogicModules; part:ModuleKey; onChange:(modules:RenderLogicModules)=>void; rule:ZoomPriorityRule;
}) {
  const update=<K extends ModuleKey,>(key:K,value:RenderLogicModules[K])=>onChange({...modules,[key]:value});
  const group=config.engine?.densityGroups?.find(item=>item.id===modules.collision.groupId);
  const grid=group&&densityGridAt(group,rule.when?.zoom.min??rule.minZoom??0);
  const extensions=logicExtensions(modules,grid);
  const view={...rule,extensions,priority:{base:rule.priority?.base,...(modules.priority.priority??{mode:'add' as const})}};
  const patch=(next:ZoomPriorityRule)=>{
    const ext=next.extensions??{};
    if(part==='admission')update(part,{pane:ext.pane,screenGate:ext.screenGate,hitTolerancePx:ext.hitTolerancePx});
    if(part==='text')update(part,{labelText:ext.labelText,fallback:ext.fallback});
    if(part==='visibility')update(part,{visibility:ext.visibility});
    if(part==='candidates')update(part,{anchor:ext.anchor,polygonCandidates:ext.polygonCandidates});
    if(part==='stability')update(part,{stability:ext.stability});
    if(part==='collision')update(part,{...modules.collision,collision:ext.collision});
    if(part==='line'&&ext.lineLabel){
      const {profile:_profile,...lineLabel}=ext.lineLabel;
      update(part,{lineLabel});
    }
    if(part==='priority'&&next.priority){
      const {base:_base,...priority}=next.priority;
      update(part,{priority});
    }
    if(part==='interaction')update(part,{interaction:ext.interaction});
  };
  if(part==='priority')return <DisplayPrioritySettings rule={view} onChange={patch} fields={fields} geometry={geometry}/>;
  if(part==='interaction')return <RuleInteractionSettings rule={view} onChange={patch} baseline={config.engine!.interactionBaselines[geometry]} complete colorEditor={(visual,change)=>
    <ColorBindingEditor config={config} sourcePath={path} fields={fields} label="交互描边取色" value={visual.strokeColorBinding??{mode:'fixed',color:visual.strokeColor}} onChange={strokeColorBinding=>change({strokeColorBinding})}/>}/>;

  const collision=modules.collision;
  const patchCollision=(change:Partial<RenderLogicModules['collision']>)=>update('collision',{...collision,...change});
  const setTargets=(key:'collideWith'|'blocks', target:string, checked:boolean)=>{
    const values=new Set<string>(collision.collision?.[key]??[]);
    if(checked)values.add(target); else values.delete(target);
    patchCollision({collision:{...collision.collision,[key]:[...values]} as RenderCollisionExtension});
  };
  const groups=config.engine?.densityGroups??[];
  const anchor=modules.candidates.anchor??{};
  const offsets=anchor.candidateOffsetsPx??[];
  return <>
    <RenderRuleExtensionsEditor embedded part={part} config={config} sourcePath={path} fields={fields} geometry={geometry} rule={view} onChange={patch}/>
    {part==='candidates'?<fieldset className="cm-subsection"><legend>自定义候选偏移</legend>
      {offsets.map((offset,index)=><div className="flex gap-2" key={index}>
        <HelpLabel context="C19RuleLogicEditor">候选名称<input value={offset.name} onChange={e=>update('candidates',{...modules.candidates,anchor:{...anchor,candidateOffsetsPx:offsets.map((row,i)=>i===index?{...row,name:e.target.value}:row)}})}/></HelpLabel>
        {(['x','y'] as const).map(axis=><HelpLabel context="C19RuleLogicEditor" key={axis}>{axis.toUpperCase()} px<input type="number" value={offset[axis]} onChange={e=>update('candidates',{...modules.candidates,anchor:{...anchor,candidateOffsetsPx:offsets.map((row,i)=>i===index?{...row,[axis]:Number(e.target.value)}:row)}})}/></HelpLabel>)}
        <button type="button" onClick={()=>update('candidates',{...modules.candidates,anchor:{...anchor,candidateOffsetsPx:offsets.filter((_,i)=>i!==index)}})}>移除</button></div>)}
      <button type="button" onClick={()=>update('candidates',{...modules.candidates,anchor:{...anchor,candidateOffsetsPx:[...offsets,{name:'candidate-'+(offsets.length+1),x:0,y:0}]}})}>添加偏移</button>
    </fieldset>:null}
    {part==='stability'?<><HelpLabel context="C19RuleLogicEditor"><input type="checkbox" checked={modules.stability.stability?.keepPreviousAnchor??true} onChange={e=>update('stability',{stability:{...modules.stability.stability,keepPreviousAnchor:e.target.checked}})}/>复用上次锚点</HelpLabel>
      <fieldset className="cm-subsection"><legend>缓存失效条件</legend><div className="flex flex-wrap gap-2">
        {(['zoomBucketChanged','featureGeometryChanged','featureTextChanged','modeChanged','worldChanged','labelOutOfViewport','collisionFailedRepeatedly'] as const).map(key=><HelpLabel context="C19RuleLogicEditor" key={key}>
          <input type="checkbox" checked={modules.stability.stability?.invalidateWhen?.includes(key)??false} onChange={e=>{
            const current=modules.stability.stability?.invalidateWhen??[];
            update('stability',{stability:{...modules.stability.stability,invalidateWhen:e.target.checked?[...current,key]:current.filter(item=>item!==key)}});
          }}/>{key}</HelpLabel>)}
      </div></fieldset></>:null}
    {part==='collision'?<div className="space-y-3">
      {(['collideWith','blocks'] as const).map(key=><fieldset className="cm-subsection" key={key}><legend>{key==='blocks'?'阻挡标签对象':'检测碰撞对象'}</legend><div className="flex flex-wrap gap-3">
        {[...(key==='blocks'?[]:['symbol','geometry']),...roleTargets,...groups.map(item=>'group:'+item.id)].map(target=><HelpLabel context="C19RuleLogicEditor" key={target} className="text-xs">
          <input type="checkbox" checked={(collision.collision?.[key] as string[]|undefined)?.includes(target)??false} onChange={e=>setTargets(key,target,e.target.checked)}/>
          {target.startsWith('group:')?groups.find(item=>item.id===target.slice(6))?.name.zh:roles[target.replace('role:','')]}
        </HelpLabel>)}
      </div></fieldset>)}
      <HelpLabel context="C19RuleLogicEditor">所属密度组<select value={collision.groupId??''} onChange={e=>patchCollision({groupId:e.target.value||undefined})}><option value="">无分组</option>{groups.map(item=><option key={item.id} value={item.id}>{item.name.zh||item.name.en} · {item.id}</option>)}</select></HelpLabel>
      {grid?<p className="text-xs">当前规则 Zoom 规格 {grid.gridSizePx} px，每格 Label {grid.maxLabelsPerGrid??'不限'}，符号 {grid.maxSymbolsPerGrid??'不限'}</p>:null}
      <HelpLabel context="C19RuleLogicEditor"><input type="checkbox" checked={collision.density?.enabled??false} onChange={e=>patchCollision({density:{...collision.density,enabled:e.target.checked}})}/>启用格内密度预算</HelpLabel>
      <div className="flex flex-wrap gap-2">{(['preserveSelected','preserveRequired'] as const).map(key=><HelpLabel context="C19RuleLogicEditor" key={key}><input type="checkbox" checked={collision.density?.[key]??true} onChange={e=>patchCollision({density:{...collision.density,[key]:e.target.checked}})}/>{key==='preserveSelected'?'保护选中':'保护必显'}</HelpLabel>)}</div>
      <HelpLabel context="C19RuleLogicEditor">重要性字段<select value={collision.density?.importanceField??''} onChange={e=>patchCollision({density:{...collision.density,importanceField:e.target.value||undefined}})}><option value="">无</option>{fields.map(key=><option key={key}>{key}</option>)}</select></HelpLabel>
      <OrderedDensityEditor scope={rule.id+':c19-density'} value={collision.density?.reduceOrder} effective={collision.density?.reduceOrder??['abbreviateOptionalLabels','hideOptionalLabels']} onChange={reduceOrder=>patchCollision({density:{...collision.density,reduceOrder}})}/>
      <HelpLabel context="C19RuleLogicEditor"><input type="checkbox" checked={Boolean(collision.screenBudget)} onChange={e=>patchCollision({screenBudget:e.target.checked?{id:'',limit:1}:undefined})}/>启用全屏配额</HelpLabel>
      {collision.screenBudget?<div className="flex gap-3"><HelpLabel context="C19RuleLogicEditor">共享配额 ID<input value={collision.screenBudget.id} onChange={e=>patchCollision({screenBudget:{...collision.screenBudget!,id:e.target.value}})}/></HelpLabel><HelpLabel context="C19RuleLogicEditor">上限<input type="number" min={1} value={collision.screenBudget.limit} onChange={e=>patchCollision({screenBudget:{...collision.screenBudget!,limit:Number(e.target.value)}})}/></HelpLabel></div>:null}
    </div>:null}
  </>;
}

export function C19RuleLogicEditor({ rule, onChange, ...context }:Context & {rule:ZoomPriorityRule;onChange:(rule:ZoomPriorityRule)=>void}) {
  const templates=context.config.engine?.renderTemplates?.filter(item=>item.geometry===context.geometry)??[];
  const selected=rule.logic?.templateId??'';
  const modules=resolveLogicModules(context.config,context.geometry,rule);
  const changeTemplate=(templateId:string)=>{
    const next={...rule,logic:{templateId,overrides:rule.logic?.overrides??{}}};
    const values=resolveLogicModules(context.config,context.geometry,next);
    const changes=LOGIC_MODULES.filter(key=>JSON.stringify(modules[key])!==JSON.stringify(values[key])).map(key=>LOGIC_MODULE_NAMES[key]);
    if(selected&&changes.length&&!window.confirm('将改用新模板的模块：\n'+changes.join('\n')))return;
    onChange(next);
  };
  return <details className="cm-subsection space-y-2" data-rule-extensions><summary>扩展规则</summary>
    <HelpLabel context="C19RuleLogicEditor">碰撞与交互逻辑模板<select aria-label="碰撞与交互逻辑模板" value={selected} onChange={e=>changeTemplate(e.target.value)}><option value="">选择模板</option>{templates.map(item=><option key={item.id} value={item.id}>{item.name.zh||item.name.en}</option>)}</select></HelpLabel>
    {LOGIC_MODULES.filter(key=>moduleApplies(key,context.geometry)).map(key=>{
      const local=rule.logic?.overrides[key];
      const commit=(overrides:Partial<RenderLogicModules>)=>onChange({...rule,logic:{templateId:selected,overrides}});
      return <div className="cm-subsection" key={key}>
        <div className="flex flex-wrap items-center justify-between gap-2"><strong>{LOGIC_MODULE_NAMES[key]}</strong>
          <HelpLabel context="C19RuleLogicEditor"><input type="checkbox" aria-label={LOGIC_MODULE_NAMES[key]+'覆写'} checked={Boolean(local)} disabled={!selected} onChange={e=>{
            const overrides={...rule.logic?.overrides};
            if(e.target.checked)Object.assign(overrides,{[key]:key==='interaction'
              ? {interaction:interactionSnapshot(context.config,context.geometry,modules.interaction.interaction)}
              : structuredClone(modules[key]??emptyLogicModules()[key])});
            else delete overrides[key];
            commit(overrides);
          }}/>覆写</HelpLabel></div>
        <details><summary className="text-xs">{local?'本规则覆写':selected?'模板有效值':'待选择模板'}</summary><fieldset disabled={!local}>
          <C19LogicModule {...context} part={key} modules={modules} rule={rule} onChange={next=>commit({...rule.logic?.overrides,[key]:next[key]})}/>
        </fieldset></details>
      </div>;
    })}
  </details>;
}
