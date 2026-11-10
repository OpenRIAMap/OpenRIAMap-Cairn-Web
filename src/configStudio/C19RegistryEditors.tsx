import {HelpLabel} from './SettingHelp';
import { useRef, useState, type ReactNode } from 'react';
import { C19LogicModule, moduleApplies } from './C19RuleLogicEditor';
import { C19_GEOMETRIES, emptyLogicModules, interactionSnapshot, LOGIC_MODULES, LOGIC_MODULE_NAMES } from './c19Render';
import { classificationPathKey, resolveSelectableFields } from './runtime';
import { registryItemProtected, registryUsage, type RegistryReference, type RegistrySection, type RegistryUsage } from './registryReferences';
import { validateStudioModule } from './studioModuleValidation';
import type { ConfigEngineSettings, ConfigPackageV3, DensityGrid, GeometryKind, LocalizedText, RenderDensityGroup, RenderLogicTemplate } from './types';

const geometryLabels:Record<GeometryKind,string>={Point:'点',LineString:'线',Polygon:'面'};
export type RegistryCreation = {
  section: RegistrySection; geometry: GeometryKind | ''; source: string; name: LocalizedText; description: LocalizedText;
};
type RegistryProps = {
  engine: ConfigEngineSettings; config: ConfigPackageV3; onChange: (engine: ConfigEngineSettings) => void;
  selection?: string; onSelection: (id: string) => void;
  creation: RegistryCreation | null; onCreation: (draft: RegistryCreation | null) => void;
};
type RegistryItem = RenderLogicTemplate | RenderDensityGroup;
const caption = (item: RegistryItem) => ('geometry' in item ? geometryLabels[item.geometry] + ' · ' : '') + (item.name.zh || item.name.en || item.id);
const selectedItem = <T extends RegistryItem>(items: T[], selection?: string) =>
  selection === undefined ? items[0] : items.find(item => item.id === selection);

function ReferenceRows({ title, rows }: { title: string; rows?: RegistryReference[] }) {
  if (!rows?.length) return null;
  return <details className="cm-subsection">
    <summary>{title} · {rows.length} 项</summary>
    <ul className="mt-2 space-y-1 break-words">{rows.map((row, index) => <li key={index}>
      {[row.classification, geometryLabels[row.geometry], row.zoom && 'Zoom ' + row.zoom, row.ruleId, row.via].filter(Boolean).join(' · ')}
      <span className="block text-slate-500">来源 {row.source}</span>
    </li>)}</ul>
  </details>;
}

function RegistryPanel({ engine, config, section, items, selection, onSelection, creation, onCreation, onChange, children }: RegistryProps & {
  section: RegistrySection; items: RegistryItem[]; children: ReactNode;
}) {
  const template = section === 'renderTemplates';
  const noun = template ? '模板' : '密度组';
  const draft = creation?.section === section ? creation : null;
  const current = selectedItem(items, selection);
  const [report, setReport] = useState<{ config: ConfigPackageV3; engine: ConfigEngineSettings; usage: RegistryUsage }>();
  const reportPanel = useRef<HTMLDetailsElement>(null);
  const checkedItems = report?.engine[section] ?? [];
  const [creationError, setCreationError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const stale = Boolean(report && (report.config !== config || report.engine !== engine));
  const usage = report?.usage;
  const references = current ? usage?.saved.get(current.id) ?? [] : [];
  const deleteReason = !current ? '请选择要删除的项。'
    : registryItemProtected(section, current.id) ? '内置密度组受保护。'
    : !report ? '请先检查当前引用状态。'
    : stale ? '引用检查已过期，请重新检查。'
    : references.length ? `存在 ${references.length} 项保存引用，请先解除引用。` : '';

  const start = () => {
    setCreationError('');
    onCreation({ section, geometry: '', source: '', name: { zh: '', en: '' }, description: { zh: '', en: '' } });
  };
  const create = () => {
    if (!draft) return;
    try {
      const name = { zh: draft.name.zh.trim(), en: draft.name.en.trim() };
      if (!name.zh && !name.en) throw Error('至少填写一个名称。');
      const source = items.find(item => item.id === draft.source);
      if (draft.source && !source) throw Error('初始化来源已不存在，请重新选择。');
      const description = draft.description;
      const id = (template ? 'template-' : 'density-') + crypto.randomUUID();
      let next: ConfigEngineSettings;
      if (template) {
        if (!draft.geometry) throw Error('请选择模板几何。');
        if (source && (!('geometry' in source) || source.geometry !== draft.geometry)) throw Error('请选择同几何的初始化模板。');
        const modules = source && 'geometry' in source ? structuredClone(source.modules) : emptyLogicModules();
        next = { ...engine, renderTemplates: [...engine.renderTemplates ?? [], { id, geometry: draft.geometry, name, description, modules }] };
      } else {
        const density = source && 'defaultGrid' in source ? structuredClone(source) : { defaultGrid: { gridSizePx: 96, maxLabelsPerGrid: 2 }, zoomGrids: [] };
        next = { ...engine, densityGroups: [...engine.densityGroups ?? [], { ...density, id, name, description }] };
      }
      const result = validateStudioModule({ ...config, engine: next }, [], ['engine/' + section + '/' + id]);
      if (!result.valid) throw Error(result.issues.filter(issue => issue.severity === 'error').map(issue => issue.path + ' · ' + issue.message).join('\n'));
      onChange(next);
      onSelection(id);
      onCreation(null);
    } catch (error) { setCreationError(error instanceof Error ? error.message : String(error)); }
  };
  const remove = () => {
    if (!current || deleteReason || draft) return;
    const latest = registryUsage(config, engine, section, false).saved.get(current.id);
    if (latest?.length) { setDeleteError('此项出现了新的保存引用，请重新检查。'); return; }
    if (!window.confirm(`删除「${caption(current)}」？删除将暂存在本模块草稿中。`)) return;
    onChange(template
      ? { ...engine, renderTemplates: engine.renderTemplates?.filter(item => item.id !== current.id) }
      : { ...engine, densityGroups: engine.densityGroups?.filter(item => item.id !== current.id) });
    onSelection('');
  };
  const canCopy = (item: RegistryItem) => !template || 'geometry' in item && item.geometry === draft?.geometry;
  return <div className="space-y-3">
    <fieldset disabled={Boolean(draft)} className="min-w-0 space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <HelpLabel context="C19RegistryEditors">{template ? '已保存模板' : '密度组'}<select value={current?.id ?? ''} onChange={event => { onSelection(event.target.value); setDeleteError(''); }}>
          <option value="">选择{noun}</option>{items.map(item => <option value={item.id} key={item.id}>{caption(item)}</option>)}
        </select></HelpLabel>
        <button type="button" className="rounded border bg-white px-3 py-1.5" onClick={start}>添加{noun}</button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="rounded border bg-white px-3 py-1.5" onClick={() => {
          setReport({ config, engine, usage: registryUsage(config, engine, section) });
          if (reportPanel.current) reportPanel.current.open = true;
          setDeleteError('');
        }}>检查当前引用状态</button>
        <button type="button" className="rounded border border-rose-300 bg-white px-3 py-1.5 text-rose-700 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400" disabled={Boolean(deleteReason)} aria-describedby={section + '-delete-state'} onClick={remove}>删除所选{noun}</button>
        <span id={section + '-delete-state'} className="text-xs text-slate-500">{deleteReason}</span>
      </div>
      {deleteError ? <p role="alert" className="text-xs text-rose-700">{deleteError}</p> : null}
      {usage ? <details ref={reportPanel} data-fold-transient open className="cm-subsection break-words text-xs" aria-label={noun + '引用报告'}>
        <summary>当前引用状态 · {checkedItems.length} 个{noun}{stale ? ' · 已过期' : ''}</summary>
        <p className="my-2 text-slate-500">有效分类按规则、几何和继承计算。保存引用还包括隐藏规则和未被采用的模板。</p>
        {checkedItems.map(item => {
          const saved = usage.saved.get(item.id);
          return <details className="cm-item my-2" key={item.id}>
            <summary>{caption(item)} · {saved?.length ? `已引用 ${saved.length} 项` : '未引用'}{registryItemProtected(section, item.id) ? ' · 内置保护' : ''}</summary>
            <p className="mt-2 text-slate-500">{item.id}</p>
            <ReferenceRows title="保存引用" rows={saved}/>
            <ReferenceRows title="有效分类" rows={usage.effective.get(item.id)}/>
          </details>;
        })}
      </details> : null}
      {children}
    </fieldset>
    {draft ? <section aria-label={'创建' + noun} className="cm-item space-y-3 border-blue-300 bg-blue-50">
      <h3 className="font-semibold">创建{noun}</h3>
      <div className="cm-flex-grid gap-2">
        {template ? <HelpLabel context="C19RegistryEditors">几何<select value={draft.geometry} onChange={event => onCreation({ ...draft, geometry: event.target.value as GeometryKind | '', source: '' })}>
          <option value="">请选择几何</option>{C19_GEOMETRIES.map(geometry => <option key={geometry} value={geometry}>{geometryLabels[geometry]}</option>)}
        </select></HelpLabel> : null}
        <HelpLabel context="C19RegistryEditors">初始化<select value={draft.source} disabled={template && !draft.geometry} onChange={event => onCreation({ ...draft, source: event.target.value })}>
          <option value="">空白{noun}</option>{items.filter(canCopy).map(item => <option key={item.id} value={item.id}>复制 {caption(item)}</option>)}
        </select></HelpLabel>
        {(['name', 'description'] as const).flatMap(key => (['zh', 'en'] as const).map(language => <HelpLabel context="C19RegistryEditors" key={key + language}>
          {key === 'name' ? '名称' : '说明'} {language}<input value={draft[key][language]} onChange={event => onCreation({ ...draft, [key]: { ...draft[key], [language]: event.target.value } })}/>
        </HelpLabel>))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded bg-blue-600 px-3 py-1.5 text-white" onClick={create}>核验并创建</button>
        <button type="button" className="rounded border bg-white px-3 py-1.5" onClick={() => onCreation(null)}>取消创建</button>
      </div>
      {creationError ? <p role="alert" className="whitespace-pre-wrap break-words text-xs text-rose-700">{creationError}</p> : null}
    </section> : null}
  </div>;
}

export function RenderTemplateRegistry(props: RegistryProps) {
  const { engine, config, onChange, selection } = props;
  const templates = engine.renderTemplates ?? [];
  const template = selectedItem(templates, selection);
  const persist = (value: RenderLogicTemplate) => onChange({ ...engine, renderTemplates: templates.map(item => item.id === value.id ? value : item) });
  const references = template ? config.nodes.flatMap(node => (node.geometryProfiles[template.geometry]?.zoomPriority.rules ?? [])
    .filter(rule => rule.logic?.templateId === template.id).map(rule => ({ node, rule }))) : [];
  const path=references[0]?.node.path??config.nodes.find(node=>node.geometryType===template?.geometry)?.path??{class:''};
  const fields=[...new Set((references.length?references.map(ref=>ref.node.path):[path]).flatMap(scope=>resolveSelectableFields(config,scope).map(field=>field.key)))];
  return <RegistryPanel {...props} section="renderTemplates" items={templates}>
    {template?<div className="space-y-2">
      <div className="cm-flex-grid gap-2">
        {(['zh','en'] as const).map(lang=><HelpLabel context="C19RegistryEditors" key={lang}>名称 {lang}<input value={template.name[lang]} onChange={e=>persist({...template,name:{...template.name,[lang]:e.target.value}})}/></HelpLabel>)}
        {(['zh','en'] as const).map(lang=><HelpLabel context="C19RegistryEditors" key={lang}>说明 {lang}<input value={template.description[lang]} onChange={e=>persist({...template,description:{...template.description,[lang]:e.target.value}})}/></HelpLabel>)}
      </div>
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
  </RegistryPanel>;
}

function GridFields({value,change}:{value:DensityGrid;change:(value:DensityGrid)=>void}) {
  return <div className="cm-flex-grid gap-2">{([
    ['gridSizePx','网格尺寸 px'],['maxLabelsPerGrid','每格 Label 上限'],['maxSymbolsPerGrid','每格符号上限'],
  ] as const).map(([key,label])=><HelpLabel context="C19RegistryEditors" key={key}>{label}<input type="number" min={1} placeholder={key==='gridSizePx'?'':'不限'} value={value[key]??''} onChange={e=>change({...value,[key]:e.target.value===''&&key!=='gridSizePx'?undefined:Number(e.target.value)})}/></HelpLabel>)}</div>;
}

export function DensityRegistry(props: RegistryProps) {
  const { engine, onChange, selection } = props;
  const groups = engine.densityGroups ?? [];
  const group = selectedItem(groups, selection);
  const persist = (value: RenderDensityGroup) => onChange({ ...engine, densityGroups: groups.map(item => item.id === value.id ? value : item) });
  return <RegistryPanel {...props} section="densityGroups" items={groups}>
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
    </div>:null}
  </RegistryPanel>;
}
