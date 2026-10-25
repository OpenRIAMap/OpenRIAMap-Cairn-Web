import {outputAcceptsClassification} from './workflowClassificationGroup';
import {workflowClassificationCaption} from './workflowCategoryOptions';
import {WorkflowGroupCategoryInput} from './WorkflowGroupCategoryInput';
import {findCompatibleSearchCandidates} from '../configRuntime/classificationReadScopes';
import {drawingAllowsParts} from './multipartPolicy';


import { coerceWorkflowValues } from './workflowValues';

import { WorkflowCategoryInput } from './WorkflowCategoryInput';
import { WorkflowAnnotationsInput } from './WorkflowAnnotationsInput';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, CSSProperties } from 'react';

import type { ClassificationPath, GeometryKind, ConfigPackageV3, MountedFeatureRecord, SearchProfile, WorkflowControl, WorkflowDefinition, WorkflowGroupField, WorkflowStep } from './types';
import { normalizeSearchProfile, optionLabel, readRecordPath, resolveWorkflowSelectOptions } from './runtime';

import { enabledDrawing, drawingKey, captureDrawingSnapshot, mergeDrawingCapture, serializeDrawingCapture, type WorkflowDrawingCapture } from './workflowDrawing';
import { resolveWorkflowFields } from './fieldReuse';

import { multipartGeometryFromSinglePath, type MultipartCoord, type MultipartGeometry } from '../core/geometry/multipartGeometry';
import { workflowConditionMatches } from './workflowExpression';

export {resolveV3WorldPrefix,normalizeV3WorldId,evaluateV3Expression,normalizeV3WorkflowSlots,workflowOutputSystem,evaluateV3WorkflowOutputs,findV3SearchCandidates,validateV3WorkflowInputs,validateV3WorkflowRecords} from './workflowKernel';
export type {V3WorkflowValueMap,V3WorkflowRunResult,V3WorkflowInputIssue,V3SearchCandidate,V3GeometryCapture} from './workflowKernel';
import { normalizeV3WorldId, normalizeV3WorkflowSlots, evaluateV3WorkflowOutputs, validateV3WorkflowInputs, validateV3WorkflowRecords, decodePath, displaySearchTemplate, type V3WorkflowValueMap, type V3WorkflowRunResult, type V3SearchCandidate, type V3GeometryCapture, type V3WorkflowInputIssue } from './workflowKernel';

function ToggleInput({ value, onChange }: { value: unknown; onChange: (value: boolean | undefined) => void }) {
  return <span className="grid w-full grid-cols-2 self-start overflow-hidden rounded border text-sm" role="group" aria-label="是否选择">{([true,false] as const).map(choice => <button type="button" key={String(choice)} aria-pressed={value===choice} className={`min-w-0 px-3 py-1 ${!choice?'border-l ':''}${value===choice?'bg-blue-600 text-white':'bg-white'}`} onClick={()=>onChange(value===choice?undefined:choice)}>{choice?'是':'否'}</button>)}</span>;
}

function FeatureSearchInput({ config, profile, records, value, onChange, placeholder, world }: { config?:ConfigPackageV3; profile?: SearchProfile; records: MountedFeatureRecord[]; value: unknown; onChange: (value: unknown) => void; placeholder?: string; world?: string }) {
  const [query, setQuery] = useState('');
  const [settledQuery, setSettledQuery] = useState('');
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => { const timer = window.setTimeout(() => setSettledQuery(query), profile?.debounceMs ?? 180); return () => window.clearTimeout(timer); }, [query, profile?.debounceMs]);
  const candidates = useMemo(() => findCompatibleSearchCandidates(records, profile, settledQuery, world ?? String((records[0] as MountedFeatureRecord | undefined)?.World ?? ''),config), [records, profile, settledQuery, world,config]);
  const search = normalizeSearchProfile(profile);
  useEffect(()=>{if(open)return;const selected=search?records.find(record=>Object.is(readRecordPath(record,search.returnField??'ID'),value)):undefined;setQuery(selected?displaySearchTemplate(search?.displayTemplate??'{{ID}} ({{Name}})',selected):String(value??''));},[records,value,profile,open]);
  const choose=(candidate:V3SearchCandidate)=>{onChange(candidate.returned);setQuery(candidate.display);setOpen(false);};
  return <div ref={container} className="min-w-0 space-y-1" onBlur={event=>{if(!container.current?.contains(event.relatedTarget as Node|null))setOpen(false);}}><input role="combobox" aria-label="搜索要素" aria-expanded={open&&Boolean(query)} className="w-full rounded border px-2 py-1 text-sm" value={query} onChange={event=>{setQuery(event.target.value);setOpen(true);onChange(undefined);}} onKeyDown={event=>{if(event.key==='Escape')setOpen(false);if(event.key==='Enter'&&open&&settledQuery===query&&candidates[0]){event.preventDefault();choose(candidates[0]);}}} placeholder={placeholder ?? '输入 ID 或 Name 搜索'} />
    {open && query && search ? <div role="listbox" className="max-h-32 min-w-0 overflow-y-auto overflow-x-hidden rounded border bg-white text-xs shadow-sm">{candidates.length ? candidates.map(candidate=><button role="option" aria-selected={false} type="button" key={`${candidate.id}-${String(candidate.returned)}`} className="block w-full whitespace-normal px-2 py-1 text-left [overflow-wrap:anywhere] hover:bg-blue-50" onClick={()=>choose(candidate)}>{candidate.display}</button>) : <p className="px-2 py-1 text-slate-500">无匹配要素</p>}</div> : null}
    <small className="block text-slate-500 [overflow-wrap:anywhere]">返回：{String(value ?? '') || '（尚未选择）'} · 范围：{search?.targetRole==='main'?'全部启用的主结构':search ? `${search.target.class}${search.target.kind ? `/${search.target.kind}` : ''}` : '未配置'}</small></div>;
}

function fieldInput(field: WorkflowGroupField, value: unknown, onChange: (value: unknown) => void, records: MountedFeatureRecord[], world?: string,config?:ConfigPackageV3) {
  const common = { className: 'w-full rounded border px-2 py-1 text-sm', value: field.kind === 'json' && value && typeof value === 'object' ? JSON.stringify(value) : String(value ?? ''), placeholder: field.placeholder, onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(event.target.value) };
  if (field.kind === 'textarea' || field.kind === 'json') return <textarea {...common} rows={field.rows ?? (field.kind === 'json' ? 4 : 3)} />;
  if (field.kind === 'toggle') return <ToggleInput value={value} onChange={onChange} />;
  if (field.kind === 'select') return <select {...common}><option value="">请选择</option>{(field.options ?? []).map((item) => <option key={item.value} value={item.value}>{optionLabel(item)}</option>)}</select>;
  if (field.kind === 'featureSearch' || field.kind === 'coarseSearch') return <FeatureSearchInput config={config} profile={field.search} records={records} value={value} onChange={onChange} placeholder={field.placeholder} world={world} />;
  return <input {...common} type={field.kind === 'number' ? 'number' : 'text'} />;
}

function GroupControlInput({ config, control, value, onChange, records, world }: { config:ConfigPackageV3; control: WorkflowControl; value: unknown; onChange: (value: unknown) => void; records: MountedFeatureRecord[]; world?: string }) {
  const rowIds=useRef<string[]>([]);
  const group = control.group;
  if (!group) return <div className="rounded border border-rose-200 bg-rose-50 p-2 text-xs text-rose-700">此重复字段组缺少字段定义。</div>;
  const scalar = group.storage === 'scalar';
  const rows = Array.isArray(value) ? value.map((item) => scalar ? { '': item } : item).filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object' && !Array.isArray(item)) : [];
  while(rowIds.current.length<rows.length)rowIds.current.push(crypto.randomUUID());
  rowIds.current.length=rows.length;
  const makeRow = () => Object.fromEntries(group.itemFields.map(field=>[field.key,field.defaultValue===undefined?field.kind==='toggle'?undefined:'':structuredClone(field.defaultValue)]));
  const serialize = (next: Array<Record<string, unknown>>) => scalar ? next.map((row) => row['']) : next;
  const updateRow = (index: number, key: string, nextValue: unknown) => onChange(serialize(rows.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: nextValue } : row)));
  return <div className="min-w-0 space-y-3 rounded border border-slate-200 bg-slate-50 p-2">{rows.map((row,index)=><fieldset key={rowIds.current[index]} className="min-w-0 rounded border bg-white p-3"><legend className="px-1 text-xs text-slate-500">第 {index+1} 项</legend><div className="cm-flex-grid">{group.itemFields.map(field=><label key={field.key} className="grid min-w-0 content-start items-start gap-1 self-start text-xs"><span>{field.label.zh}{field.required?' *':''}</span>{fieldInput(field,row[field.key],nextValue=>updateRow(index,field.key,nextValue),records,world,config)}</label>)}</div><button type="button" className="mt-2 text-xs text-rose-700" onClick={()=>{rowIds.current.splice(index,1);onChange(serialize(rows.filter((_,i)=>i!==index)));}}>删除此项</button></fieldset>)}<button type="button" className="rounded border bg-white px-2 py-1 text-xs" onClick={()=>{rowIds.current.push(crypto.randomUUID());onChange(serialize([...rows,makeRow()]));}}>{group.addLabel?.zh??`添加${control.label.zh}`}</button></div>;
}

export function ControlInput({ control, value, onChange, config, records, world, fixedGeometry, output, classificationPaths }: { control: WorkflowControl; value: unknown; onChange: (value: unknown) => void; config: ConfigPackageV3; records: MountedFeatureRecord[]; world?: string; output?:import('./types').WorkflowOutput;classificationPaths?:ClassificationPath[];fixedGeometry?: GeometryKind }) {
  if (control.kind === 'group') return <GroupControlInput config={config} control={control} value={value} onChange={onChange} records={records} world={world} />;
  const common = { className: 'w-full rounded border px-2 py-1 text-sm', value: control.kind === 'json' && value && typeof value === 'object' ? JSON.stringify(value) : String(value ?? ''), placeholder: control.placeholder??(control.fieldFormat==='externalLink'?'https://…':control.fieldFormat==='date'?'YYYY-MM-DD':undefined), onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(event.target.value) };
  if (control.kind === 'textarea' || control.kind === 'json') return <textarea {...common} rows={control.rows ?? (control.kind === 'json' ? 4 : 3)} placeholder={control.kind === 'json' ? '{ }' : control.placeholder} />;
  if (control.kind === 'toggle') return <ToggleInput value={value} onChange={onChange} />;
  if (control.kind === 'select') return <select {...common}><option value="">请选择</option>{resolveWorkflowSelectOptions(config, control).map((item) => <option key={item.value} value={item.value}>{optionLabel(item)}</option>)}</select>;
  if (control.kind === 'classificationPicker') {
    if(config.contractRevision>=15&&output)return <WorkflowGroupCategoryInput config={config} output={output} allowedPaths={classificationPaths} value={String(value??'')} onChange={onChange}/>;
    return <WorkflowCategoryInput config={config} scope={control.classificationScope??{class:''}} value={String(value??'')} onChange={onChange} geometry={fixedGeometry}/>;
  }
  if (control.kind === 'featureSearch' || control.kind === 'coarseSearch') return <FeatureSearchInput config={config} profile={control.search} records={records} value={value} onChange={onChange} placeholder={control.placeholder} world={world} />;
  return <input {...common} type={control.kind === 'number' ? 'number' : control.fieldFormat==='externalLink'?'url':'text'} />;
}

/** Usable generic runner. It runs V3-composed flows and performs the same
 * target-scoped search used by saved workflows; external units remain intact. */
export function V3WorkflowRunner({ config, workflow:sourceWorkflow, records = [], worldId, initialActor = '', onSubmit, onRequestExternal, onRequestGeometry, onCaptureGeometry, onPreviewGeometry, onStepChange, onPreviewSlotsChange, activeDrawingKey, drawingRevision=0, drawingPaused=false, onInvalidateGeometry }: {
  config: ConfigPackageV3; workflow: WorkflowDefinition; records?: MountedFeatureRecord[]; worldId?: string; initialActor?: string;
  onSubmit?: (result: V3WorkflowRunResult) => void | Promise<void>;
  onRequestExternal?: (workflow: WorkflowDefinition) => void;
  onRequestGeometry?: (outputId: string, geometry: string, options?:{newPart?:boolean;multiple?:boolean}) => void | MultipartCoord[] | Promise<void | MultipartCoord[]>;
  activeDrawingKey?:string;
  drawingRevision?:number;
  drawingPaused?:boolean;
  onInvalidateGeometry?:(id:string)=>void;
  onPreviewGeometry?:(id:string,geometry:MultipartGeometry)=>void;
  onCaptureGeometry?: (outputId: string, geometry: string) => MultipartCoord[] | V3GeometryCapture;
  onStepChange?: (step: WorkflowStep | undefined) => void;
  onPreviewSlotsChange?: (slots: V3WorkflowValueMap) => void;
}) {
  const [coordinates, setCoordinates] = useState<Record<string, MultipartCoord[] | MultipartGeometry>>({});
  const captures=useRef<Record<string,WorkflowDrawingCapture>>({});
  const liveCapture=useRef<(()=>void)|undefined>();
  const [liveCounts,setLiveCounts]=useState<Record<string,number>>({});
  const actions=useRef<Record<string,'replace'|'part'|'ring'>>({});
  const [createdAt] = useState(() => new Date());
  const [geometryErrors, setGeometryErrors] = useState<Record<string, string>>({});
  const [geometryInputs, setGeometryInputs] = useState<Record<string, string>>({});
  const activeWorld = normalizeV3WorldId(worldId ?? records.find(record => String(record.World ?? '').trim())?.World ?? 'zth');
  const defaults = () => Object.fromEntries(workflow.steps.flatMap(item => item.controls ?? []).flatMap(control => control.defaultValue === undefined ? [] : [[control.slot ?? control.id, structuredClone(control.defaultValue)]]));
  const [page, setPage] = useState(0);
  const workflow=useMemo(()=>resolveWorkflowFields(config,sourceWorkflow),[config,sourceWorkflow]);
  const [slots, setSlots] = useState<V3WorkflowValueMap>(() => ({ ...defaults(), actor: initialActor, World: activeWorld }));
  const [classifications, setClassifications] = useState<Record<string, ClassificationPath | undefined>>({});
  const [submitted, setSubmitted] = useState<V3WorkflowRunResult | null>(null);
  const [inputIssues, setInputIssues] = useState<V3WorkflowInputIssue[]>([]);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const stepCallback = useRef(onStepChange); stepCallback.current = onStepChange;
  const typedSlots=useMemo(()=>normalizeV3WorkflowSlots(workflow,slots),[workflow,slots]);
  const steps = workflow.mode === 'composed' ? workflow.steps.filter(step=>step.kind!=='geometry'||enabledDrawing(step,workflow,typedSlots)) : [];
  const step = steps[Math.min(page,steps.length-1)];
  const activeTask=workflow.steps.find(task=>task.kind==='geometry'&&drawingKey(task)===activeDrawingKey);
  const activeHeight=activeTask?.drawing?.heightSlot?typedSlots[activeTask.drawing.heightSlot]:undefined;
  useEffect(()=>{liveCapture.current?.();},[drawingRevision,activeDrawingKey,drawingPaused,activeHeight]);
  useEffect(() => { stepCallback.current?.(step); titleRef.current?.scrollIntoView({block:"start"}); }, [step?.id, page]);
  useEffect(() => { onPreviewSlotsChange?.(typedSlots); }, [typedSlots, onPreviewSlotsChange]);
  useEffect(() => { setSlots(current => ({ ...defaults(), ...current, World: activeWorld })); }, [workflow, activeWorld]);
  const previewState = useMemo(() => {
    try { return { outputs: workflow.mode === 'composed' ? evaluateV3WorkflowOutputs(workflow, slots, { world: activeWorld, classifications, config, coordinates, now: createdAt }) : [], error: '' }; }
    catch (error) { return { outputs: [], error: error instanceof Error ? error.message : '输出表达式无效。' }; }
  }, [workflow, slots, classifications, activeWorld, config, coordinates, createdAt]);
  if (workflow.mode === 'external') return <section className="rounded border bg-violet-50 p-3"><strong>外部整体工作流：{workflow.label.zh}</strong><button type="button" disabled={!onRequestExternal} className="ml-2 rounded border px-2 py-1" onClick={() => onRequestExternal?.(workflow)}>打开已受控工作流</button></section>;
  if (!step) return <p>工作流没有页面。</p>;
  const currentIssues = inputIssues.filter(issue => !issue.stepId || issue.stepId === step.id);
  const collect=(id:string,type:string,capture:MultipartCoord[]|V3GeometryCapture)=>{
    const value=Array.isArray(capture)?{coordinates:capture}:capture;
    return mergeDrawingCapture(captures.current[id],value,type as GeometryKind,actions.current[id]??'replace');
  };
  const acceptGeometry=(id:string,type:string,capture:MultipartCoord[]|V3GeometryCapture)=>{
    const task=workflow.steps.find(item=>item.kind==='geometry'&&drawingKey(item)===id)!;
    const value=collect(id,type,capture);const result=serializeDrawingCapture(task,value,slots);
    if(result.geometry.parts.length>1&&!drawingAllowsParts(config,workflow,task,classifications))throw Error('此绘制仅允许一个部件，仍可在面内添加孔环。');
    captures.current[id]={...value,geometry:result.geometry};actions.current[id]='replace';onPreviewGeometry?.(id,result.geometry);
    setCoordinates(current=>({...current,[id]:result.geometry}));setGeometryInputs(current=>({...current,[id]:JSON.stringify(value.coordinates)}));setGeometryErrors(current=>({...current,[id]:''}));
    setSlots(current=>({...current,...captureDrawingSnapshot({...workflow,steps:[task]},coerceWorkflowValues(workflow,current),{[id]:value}).slots}));
  };
  liveCapture.current=()=>{
    if(!onCaptureGeometry||!activeDrawingKey||drawingPaused)return;
    const task=workflow.steps.find(item=>item.kind==='geometry'&&drawingKey(item)===activeDrawingKey);
    if(!task||!enabledDrawing(task,workflow,typedSlots))return;
    try {
      const capture=onCaptureGeometry(activeDrawingKey,task.geometry![0]);
      const raw=Array.isArray(capture)?capture:capture.coordinates;
      setLiveCounts(current=>({...current,[activeDrawingKey]:raw.length}));
      acceptGeometry(activeDrawingKey,task.geometry![0],capture);
    } catch(error) {
      const message=error instanceof Error?error.message:'几何无效。';
      setGeometryErrors(current=>({...current,[activeDrawingKey]:message}));
      onInvalidateGeometry?.(activeDrawingKey);
    }
  };

  const newPart=(action:'part'|'ring')=>{const id=drawingKey(step);try{if(action==='part'&&!drawingAllowsParts(config,workflow,step,classifications))throw Error('此分类仅允许一个部件。');if(onCaptureGeometry)acceptGeometry(id,step.geometry![0],onCaptureGeometry(id,step.geometry![0]));else if(!captures.current[id])throw new Error('请先完成当前部件。');actions.current[id]=action;setGeometryInputs(current=>({...current,[id]:'[]'}));void onRequestGeometry?.(id,step.geometry![0],{newPart:true,multiple:true});}catch(error){setInputIssues([{stepId:step.id,message:error instanceof Error?error.message:'无法添加部件。'}]);}};

  const snapshot=(tasks:WorkflowStep[])=>{
    const final=captureDrawingSnapshot({...workflow,steps:tasks},coerceWorkflowValues(workflow,slots),captures.current,onCaptureGeometry?(id,type)=>collect(id,type,onCaptureGeometry(id,type)):undefined);
    for(const task of tasks.filter(item=>item.kind==='geometry'))if(enabledDrawing(task,workflow,final.slots)){const id=drawingKey(task);captures.current[id]=final.captures[id];actions.current[id]='replace';if(final.captures[id]?.geometry)onPreviewGeometry?.(id,final.captures[id].geometry!);}
    const coords=Object.fromEntries(Object.entries(final.captures).map(([id,value])=>[id,value.geometry??multipartGeometryFromSinglePath(workflow.steps.find(task=>task.kind==='geometry'&&drawingKey(task)===id)!.geometry![0],value.coordinates)]));
    setCoordinates(coords);setSlots(final.slots);return {...final,coordinates:coords};
  };
  const next=()=>{try{
    const final=step.kind==='geometry'?snapshot([step]):{slots};
    const issues=validateV3WorkflowInputs(workflow,final.slots,[step],config);setInputIssues(issues);if(!issues.length)setPage(value=>Math.min(steps.length-1,value+1));
  }catch(error){setInputIssues([{stepId:step.id,message:error instanceof Error?error.message:'几何无效。'}]);}};
  const submit=async()=>{
    if(savingRef.current||submitted)return;
    try{
      const final=snapshot(workflow.steps);
      const output=evaluateV3WorkflowOutputs(workflow,final.slots,{world:activeWorld,classifications,config,coordinates:final.coordinates,now:createdAt});
      const issues=[...validateV3WorkflowInputs(workflow,final.slots,steps,config),...validateV3WorkflowRecords(config,workflow,output)];
      if(!output.length)issues.push({message:'必须至少启用一个实际输出。'});
      setInputIssues(issues);if(issues.length)return;
      savingRef.current=true;setSaving(true);try{await onSubmit?.(output);setSubmitted(output);}finally{savingRef.current=false;setSaving(false);}
    }catch(error){setInputIssues([{message:error instanceof Error?error.message:'保存失败，请重试。'}]);savingRef.current=false;setSaving(false);}
  };
  const geometryBlocked=step.kind==='geometry'&&Boolean(onCaptureGeometry)&&(drawingPaused||!captures.current[drawingKey(step)]?.geometry||Boolean(geometryErrors[drawingKey(step)]));
  const navigation=<div className="mt-3 flex justify-between"><button type="button" disabled={page === 0 || saving || step.kind === 'geometry' && step.drawing?.allowBack === false} className="rounded border px-3 py-1 disabled:opacity-40" onClick={() => {setInputIssues([]);if(step.kind==='geometry'&&step.drawing?.keepDrawingWhenBack===false){const key=drawingKey(step);delete captures.current[key];delete actions.current[key];setCoordinates(current=>({...current,[key]:[]}));setGeometryInputs(current=>({...current,[key]:'[]'}));setGeometryErrors(current=>({...current,[key]:''}));setSlots(current=>{const next={...current};for(const slot of [step.drawing?.captureSlot,step.drawing?.pointSlot,...(step.drawing?.auxiliaryPoints??[]).map(point=>point.slot)])if(slot)for(const token of [slot,`${slot}_RAW_POINT`,`${slot}_X`,`${slot}_Y`,`${slot}_Z`,`${slot}_HEIGHT`])delete next[token];return next;});}setPage(value=>Math.max(0,value-1));} }>上一页</button>
      {page === steps.length - 1 ? <button type="button" disabled={saving || Boolean(submitted) || geometryBlocked} className="rounded bg-emerald-600 px-3 py-1 text-white disabled:opacity-40" onClick={() => void submit()}>{saving ? '保存中…' : onSubmit ? '确认保存输出' : '生成预览输出'}</button> : <button type="button" disabled={saving||geometryBlocked} className="rounded bg-blue-600 px-3 py-1 text-white disabled:opacity-40" onClick={next}>下一页</button>}
    </div>;
  return <section data-workflow-step={step.id} className="cm-workflow-page rounded-lg border bg-white p-3">
    {config.contractRevision>=15?Object.entries(classifications).filter(([id,path])=>path&&!workflow.outputs.some(output=>output.id===id&&outputAcceptsClassification(config,output,path))).map(([id])=><p role="alert" className="mb-2 text-sm text-rose-700" key={id}>原分类已不属于当前分类组，不能继续提交。<button type="button" className="ml-2 rounded border px-2 py-1" onClick={()=>{setClassifications(current=>({...current,[id]:undefined}));setSlots(current=>{const next={...current};for(const control of workflow.steps.flatMap(step=>step.controls??[]).filter(control=>control.kind==='classificationPicker'&&control.outputId===id))delete next[control.slot??control.id];return next;});}}>清除失效选择并重新选取</button></p>):null}
    <div ref={titleRef} className="mb-3 flex flex-wrap justify-between gap-2"><strong>{step.label.zh}</strong><span className="text-xs">世界：{activeWorld} · 第 {page + 1} / {steps.length} 页</span></div>
    {step.kind!=="actor"&&step.kind!=="geometry"?navigation:null}
    {step.kind === 'actor' ? <label className="block text-sm">填写人<input aria-label="填写人" className="mt-1 w-full rounded border px-2 py-1" value={String(slots.actor ?? '')} onChange={event => setSlots(current => ({ ...current, actor: event.target.value }))} /></label> : null}
    {step.kind === 'tagsExtensions' ? <div className="cm-flex-grid gap-2">{(['tags', 'extensions'] as const).filter(key => step.tagsExtensions?.[key === 'tags' ? 'tagsEnabled' : 'extensionsEnabled'] !== false).map(key => <textarea key={key} className="rounded border p-2 text-sm" rows={3} placeholder={`${key} JSON（可选）`} value={typeof slots[key] === 'object' ? JSON.stringify(slots[key]) : String(slots[key] ?? '')} onChange={event => setSlots(current => ({ ...current, [key]: event.target.value }))} />)}</div> : null}
    {step.kind === 'geometry' ? <div className="rounded border border-dashed p-3 text-sm">
      <p>固定绘制类型：{step.geometry?.[0]} · 当前 {onCaptureGeometry?liveCounts[drawingKey(step)]??0:captures.current[drawingKey(step)]?.coordinates.length??0} 个坐标{captures.current[drawingKey(step)]?.geometry?` · ${captures.current[drawingKey(step)]!.geometry!.parts.length} 个部件`:null}</p>
      {!onCaptureGeometry||drawingPaused||step.drawing?.enabledFromThisPage===false?<button type="button" className="mt-2 rounded border px-2 py-1" onClick={() => {
        const outputId = drawingKey(step); const geometry = step.geometry![0];
        if (onRequestGeometry) void Promise.resolve(onRequestGeometry(outputId, geometry)).then(coords => { if (Array.isArray(coords)) acceptGeometry(outputId, geometry, coords); }).catch(error => setGeometryErrors(current => ({ ...current, [outputId]: error.message })));
        else { const coords = geometry === 'Point' ? [{ x: 0, y: -64, z: 0 }] : geometry === 'LineString' ? [{ x: 0, y: -64, z: 0 }, { x: 20, y: -64, z: 10 }] : [{ x: 0, y: -64, z: 0 }, { x: 20, y: -64, z: 0 }, { x: 20, y: -64, z: 20 }, { x: 0, y: -64, z: 0 }]; acceptGeometry(outputId, geometry, coords); }
      }}>{onRequestGeometry ? '恢复绘制' : '使用预览样例几何'}</button>:null}
      {!onCaptureGeometry ? <label className="mt-2 grid gap-1 text-xs">预览坐标（x / y / z）<textarea className="w-full rounded border p-2 font-mono" rows={3} value={geometryInputs[drawingKey(step)] ?? '[]'} onChange={event => {
        const outputId = drawingKey(step); setGeometryInputs(current => ({ ...current, [outputId]: event.target.value }));
        try { const coords = JSON.parse(event.target.value); if (!Array.isArray(coords)) throw new Error('坐标必须是数组。'); acceptGeometry(outputId, step.geometry![0], coords); }
        catch (error) { setGeometryErrors(current => ({ ...current, [outputId]: error instanceof Error ? error.message : '几何无效。' })); }
      }} /></label>:null}
      {step.geometry?.[0]!=='Point'?<div className="mt-2 flex gap-2"><button type="button" disabled={!drawingAllowsParts(config,workflow,step,classifications)} className="rounded border px-2 py-1 disabled:opacity-40" onClick={()=>{newPart('part');}}>添加部件</button>{step.geometry?.[0]==='Polygon'?<button type="button" className="rounded border px-2 py-1" onClick={()=>{newPart('ring');}}>添加孔环</button>:null}</div>:null}{geometryErrors[drawingKey(step)] ? <p role="alert" className="text-rose-700">{geometryErrors[drawingKey(step)]}</p> : null}
    </div> : null}
    {(step.drawing?.auxiliaryPoints ?? []).filter(point => workflowConditionMatches(point.when, slots)).map(point => {
      const value = slots[point.slot] as { x?: number; y?: number; z?: number } | undefined;
      const update = (next: { x?: number; y?: number; z?: number }) => setSlots(current => ({ ...current, [point.slot]: next }));
      return <fieldset key={point.id} className="mt-3 rounded border p-2 text-sm"><legend>{point.label.zh}{point.required ? ' *' : ''}</legend>{onCaptureGeometry ? <><button type="button" className="rounded border px-2 py-1" disabled={!captures.current[drawingKey(step)]?.coordinates.length} onClick={() => { void onRequestGeometry?.(`auxiliary:${point.id}`, 'Point'); }}>进入{point.label.zh}绘制</button><button type="button" className="ml-2 rounded border px-2 py-1" onClick={() => { try { const capture = onCaptureGeometry(`auxiliary:${point.id}`, 'Point'); const raw = Array.isArray(capture) ? capture[0] : capture.point; if (!raw || !Number.isFinite(raw.x) || !Number.isFinite(raw.z)) throw new Error('请先绘制目标点。'); update(raw); setInputIssues([]); } catch (error) { setInputIssues([{ stepId: step.id, message: error instanceof Error ? error.message : '辅助点无效。' }]); } }}>采用{point.label.zh}</button></> : <div className="grid grid-cols-3 gap-2">{(['x','y','z'] as const).map(axis => <label key={axis}>{axis.toUpperCase()}<input type="number" className="w-full rounded border" value={value?.[axis] ?? ''} onChange={event => update({ ...value, [axis]: event.target.value === '' ? undefined : Number(event.target.value) })} /></label>)}</div>}<p className="mt-1 text-xs">{value ? `已采用：X=${value.x}，Z=${value.z}${value.y === undefined ? '' : `，Y=${value.y}`}` : '尚未采用坐标'}</p></fieldset>;
    })}
    {step.controls?.length ? <div className="cm-runtime-grid">{step.controls.filter(control => workflowConditionMatches(control.when, typedSlots)).map(control => <div key={control.id} data-workflow-control={control.id} className="grid min-w-0 content-start gap-1 self-start text-sm" style={{"--cm-columns":control.columns===1?6:control.columns===2?3:2} as CSSProperties}>
      <span>{control.kind==='classificationPicker'?workflowClassificationCaption(config,control,workflow.outputs.find(output=>output.id===control.outputId)):control.label.zh}{control.required ? ' *' : ''}</span>{control.kind==='tagsExtensions'?<WorkflowAnnotationsInput config={config} workflow={workflow} control={control} value={slots[control.id]} classifications={classifications} onChange={value=>{setSlots(current=>({...current,[control.id]:value}));setInputIssues([]);}}/>:<ControlInput control={control} output={workflow.outputs.find(output=>output.id===control.outputId)} fixedGeometry={workflow.outputs.find(output => output.id === control.outputId)?.geometry.selected} value={slots[control.slot ?? control.id]} config={config} records={records} world={activeWorld} onChange={value => {
        if (control.kind === 'classificationPicker') { const classification = decodePath(String(value)); if (control.outputId) setClassifications(current => ({ ...current, [control.outputId!]: classification })); }
        setSlots(current => ({ ...current, [control.slot ?? control.id]: value })); setInputIssues([]);
      }} />
    }</div>)}</div> : null}
    {currentIssues.length ? <ul role="alert" className="mt-3 rounded border border-rose-200 bg-rose-50 p-2 text-xs text-rose-800">{currentIssues.map((issue, index) => <li key={index}>{issue.message}</li>)}</ul> : null}
    {navigation}
    {!onSubmit ? <details className="mt-3 rounded border p-2"><summary>最终 record 预览</summary>{previewState.error ? <p role="alert">{previewState.error}</p> : <pre className="max-h-64 overflow-auto text-xs">{JSON.stringify(previewState.outputs, null, 2)}</pre>}</details> : null}
    {submitted && !onSubmit ? <pre className="mt-3 max-h-48 overflow-auto rounded bg-slate-950 p-2 text-xs text-emerald-100">{JSON.stringify(submitted, null, 2)}</pre> : null}
  </section>;
}

export default V3WorkflowRunner;
