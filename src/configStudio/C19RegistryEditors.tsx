import {HelpLabel} from './SettingHelp';
import { useState } from 'react';
import { C19LogicModule, moduleApplies } from './C19RuleLogicEditor';
import { BUILTIN_DENSITY_GROUP_NAMES, C19_GEOMETRIES, emptyLogicModules, interactionSnapshot, LOGIC_MODULES, LOGIC_MODULE_NAMES } from './c19Render';
import { classificationPathKey, resolveSelectableFields } from './runtime';
import type { ConfigEngineSettings, ConfigPackageV3, DensityGrid, GeometryKind, RenderDensityGroup, RenderLogicTemplate } from './types';

const geometryLabels:Record<GeometryKind,string>={Point:'点',LineString:'线',Polygon:'面'};

export function RenderTemplateRegistry({engine,config,onChange}:{engine:ConfigEngineSettings;config:ConfigPackageV3;onChange:(engine:ConfigEngineSettings)=>void}) {
  const templates=engine.renderTemplates??[];
  const [selected,setSelected]=useState(templates[0]?.id??'');
  const [geometry,setGeometry]=useState<GeometryKind>('Point');
  const [copy,setCopy]=useState('');
  const template=templates.find(item=>item.id===selected);
  const persist=(value:RenderLogicTemplate)=>onChange({...engine,renderTemplates:templates.map(item=>item.id===value.id?value:item)});
  const references=config.nodes.flatMap(node=>(node.geometryProfiles[template?.geometry??geometry]?.zoomPriority.rules??[]).filter(rule=>rule.logic?.templateId===selected).map(rule=>({node,rule})));
  const path=references[0]?.node.path??config.nodes.find(node=>node.geometryType===template?.geometry)?.path??{class:''};
  const fields=[...new Set((references.length?references.map(ref=>ref.node.path):[path]).flatMap(scope=>resolveSelectableFields(config,scope).map(field=>field.key)))];
  return <div className="space-y-2">
    <div className="flex flex-wrap gap-3">
      <HelpLabel context="C19RegistryEditors">已保存模板<select value={selected} onChange={e=>setSelected(e.target.value)}><option value="">选择模板</option>{templates.map(item=><option value={item.id} key={item.id}>{geometryLabels[item.geometry]} · {item.name.zh||item.id}</option>)}</select></HelpLabel>
      <HelpLabel context="C19RegistryEditors">新模板几何<select value={geometry} onChange={e=>{setGeometry(e.target.value as GeometryKind);setCopy('');}}>{C19_GEOMETRIES.map(key=><option key={key} value={key}>{geometryLabels[key]}</option>)}</select></HelpLabel>
      <HelpLabel context="C19RegistryEditors">初始化模板<select value={copy} onChange={e=>setCopy(e.target.value)}><option value="">空白模板</option>{templates.filter(item=>item.geometry===geometry).map(item=><option key={item.id} value={item.id}>复制 {item.name.zh}</option>)}</select></HelpLabel>
      <button type="button" className="rounded border px-2" onClick={()=>{
        const source=templates.find(item=>item.id===copy&&item.geometry===geometry);
        const item={id:'template-'+crypto.randomUUID(),geometry,name:{zh:'新模板',en:''},description:{zh:'',en:''},modules:source?structuredClone(source.modules):emptyLogicModules()};
        onChange({...engine,renderTemplates:[...templates,item]});setSelected(item.id);
      }}>添加模板</button>
    </div>
    {template?<div className="space-y-2">
      <div className="cm-flex-grid gap-2">
        {(['zh','en'] as const).map(lang=><HelpLabel context="C19RegistryEditors" key={lang}>名称 {lang}<input value={template.name[lang]} onChange={e=>persist({...template,name:{...template.name,[lang]:e.target.value}})}/></HelpLabel>)}
        {(['zh','en'] as const).map(lang=><HelpLabel context="C19RegistryEditors" key={lang}>说明 {lang}<input value={template.description[lang]} onChange={e=>persist({...template,description:{...template.description,[lang]:e.target.value}})}/></HelpLabel>)}
      </div>
      <button type="button" disabled={references.length>0} className="text-rose-700" onClick={()=>{onChange({...engine,renderTemplates:templates.filter(item=>item.id!==template.id)});setSelected('');}}>删除未引用模板</button>
      <details><summary>保存影响范围 · {references.length} 条规则</summary>
        {references.map(({node,rule})=><div className="text-xs" key={node.nodeId+rule.id}>{classificationPathKey(node.path)} · Zoom {rule.when?.zoom.min}–{rule.when?.zoom.max} · {rule.id} · 随模板更新 {LOGIC_MODULES.filter(key=>moduleApplies(key,template.geometry)&&!rule.logic?.overrides[key]).map(key=>LOGIC_MODULE_NAMES[key]).join('、')||'无'}</div>)}
      </details>
      {LOGIC_MODULES.filter(part=>moduleApplies(part,template.geometry)).map(part=><details className="cm-subsection" key={part}><summary>{LOGIC_MODULE_NAMES[part]}</summary>
        {part==='interaction'?<HelpLabel context="C19RegistryEditors"><input type="checkbox" checked={Boolean(template.modules.interaction.interaction)} onChange={e=>persist({...template,modules:{...template.modules,interaction:e.target.checked?{interaction:interactionSnapshot({...config,engine},template.geometry)}:{}}})}/>覆写统一交互基准</HelpLabel>:null}
        <fieldset disabled={part==='interaction'&&!template.modules.interaction.interaction}>
          <C19LogicModule config={{...config,engine}} geometry={template.geometry} fields={fields} path={path} part={part} modules={template.modules} rule={{id:template.id}} onChange={modules=>persist({...template,modules})}/>
        </fieldset>
      </details>)}
    </div>:null}
  </div>;
}

function GridFields({value,change}:{value:DensityGrid;change:(value:DensityGrid)=>void}) {
  return <div className="cm-flex-grid gap-2">{([
    ['gridSizePx','网格尺寸 px'],['maxLabelsPerGrid','每格 Label 上限'],['maxSymbolsPerGrid','每格符号上限'],
  ] as const).map(([key,label])=><HelpLabel context="C19RegistryEditors" key={key}>{label}<input type="number" min={1} placeholder={key==='gridSizePx'?'':'不限'} value={value[key]??''} onChange={e=>change({...value,[key]:e.target.value===''&&key!=='gridSizePx'?undefined:Number(e.target.value)})}/></HelpLabel>)}</div>;
}

export function DensityRegistry({engine,onChange,config}:{engine:ConfigEngineSettings;onChange:(engine:ConfigEngineSettings)=>void;config:ConfigPackageV3}) {
  const groups=engine.densityGroups??[];
  const [selected,setSelected]=useState(groups[0]?.id??'');
  const group=groups.find(item=>item.id===selected);
  const persist=(value:RenderDensityGroup)=>onChange({...engine,densityGroups:groups.map(item=>item.id===value.id?value:item)});
  const referred=Boolean(group&&[...engine.renderTemplates?.map(template=>template.modules.collision)??[],
    ...config.nodes.flatMap(node=>Object.values(node.geometryProfiles).flatMap(profile=>profile?.zoomPriority.rules.map(rule=>rule.logic?.overrides.collision)??[]))]
    .some(c=>c?.groupId===group.id||c?.collision?.blocks?.includes(`group:${group.id}`)||c?.collision?.collideWith?.includes(`group:${group.id}`)));
  return <div className="space-y-2">
    <HelpLabel context="C19RegistryEditors">密度组<select value={selected} onChange={e=>setSelected(e.target.value)}><option value="">选择分组</option>{groups.map(item=><option key={item.id} value={item.id}>{item.name.zh||item.id}</option>)}</select></HelpLabel>
    <button type="button" className="rounded border px-2" onClick={()=>{
      const next={id:'density-'+crypto.randomUUID(),name:{zh:'新密度组',en:''},description:{zh:'',en:''},defaultGrid:{gridSizePx:96,maxLabelsPerGrid:2},zoomGrids:[]};
      onChange({...engine,densityGroups:[...groups,next]});setSelected(next.id);
    }}>添加密度组</button>
    {group?<div className="space-y-2">
      <div className="cm-flex-grid gap-2">
        {(['zh','en'] as const).map(lang=><HelpLabel context="C19RegistryEditors" key={lang}>名称 {lang}<input value={group.name[lang]} onChange={e=>persist({...group,name:{...group.name,[lang]:e.target.value}})}/></HelpLabel>)}
        {(['zh','en'] as const).map(lang=><HelpLabel context="C19RegistryEditors" key={lang}>说明 {lang}<input value={group.description[lang]} onChange={e=>persist({...group,description:{...group.description,[lang]:e.target.value}})}/></HelpLabel>)}
      </div>
      <fieldset className="cm-subsection"><legend>默认规格</legend><GridFields value={group.defaultGrid} change={defaultGrid=>persist({...group,defaultGrid})}/></fieldset>
      {group.zoomGrids.map((segment,index)=>{
        const set=(value:typeof segment)=>persist({...group,zoomGrids:group.zoomGrids.map((item,i)=>i===index?value:item)});
        return <fieldset className="cm-subsection space-y-1" key={index}><legend>Zoom 分段 {index+1}</legend>
          <HelpLabel context="C19RegistryEditors">下界<input type="number" min={0} max={8} value={segment.minZoom} onChange={e=>set({...segment,minZoom:Number(e.target.value)})}/></HelpLabel>
          <HelpLabel context="C19RegistryEditors">上界<input type="number" min={0} max={8} value={segment.maxZoom} onChange={e=>set({...segment,maxZoom:Number(e.target.value)})}/></HelpLabel>
          <GridFields value={segment.grid} change={grid=>set({...segment,grid})}/>
          <button type="button" onClick={()=>persist({...group,zoomGrids:group.zoomGrids.filter((_,i)=>i!==index)})}>删除分段</button>
        </fieldset>;
      })}
      <button type="button" className="rounded border px-2" onClick={()=>persist({...group,zoomGrids:[...group.zoomGrids,{minZoom:0,maxZoom:8,grid:structuredClone(group.defaultGrid)}]})}>添加 Zoom 分段</button>
      <button type="button" disabled={Boolean(BUILTIN_DENSITY_GROUP_NAMES[group.id])||referred} className="text-rose-700" onClick={()=>{onChange({...engine,densityGroups:groups.filter(item=>item.id!==group.id)});setSelected('');}}>删除未引用分组</button>
    </div>:null}
  </div>;
}
