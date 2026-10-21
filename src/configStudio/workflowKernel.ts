import { tagRecordErrors } from './standardTagFields';
import { validateStructuredValue } from './valueSchema';
import { applicationWorld } from '../core/project/applicationRuntime';
import { coerceWorkflowValues } from './workflowValues';
import { resolveNodeFieldSettings } from './nodeFieldSettings';
import { annotationsForOutput, mergeAnnotations, annotationPaths } from './workflowAnnotations';
import { normalizeRuleSourceWorldId } from '../core/project/worldIdentity';
import type { ClassificationPath, ConfigPackageV3, MountedFeatureRecord, SearchProfile, WorkflowControl, WorkflowDefinition, WorkflowGroupField } from './types';
import { normalizeSearchProfile, pathMatchesScope, readRecordPath, hasCategoryNode, hasDescendants, resolveGeometryProfile, resolveEffectiveFields, resolveWorkflowSelectOptions } from './runtime';

import { activeOutputIds, enabledDrawing, type WorkflowDrawingCapture } from './workflowDrawing';
import { resolveWorkflowFields } from './fieldReuse';
import { finalizeV3WorkflowRecord } from './workflowRecord';
import { readMultipartGeometry, type MultipartCoord, type MultipartGeometry } from '../core/geometry/multipartGeometry';
import { evaluateWorkflowExpression, isSafeWorkflowTarget, PROTECTED_WORKFLOW_TARGETS, workflowExpressionTokens, parseWorkflowExpression, workflowOutputAssemblyOrder, workflowCaptureSlots, workflowConditionMatches } from './workflowExpression';

export type V3WorkflowValueMap = Record<string, unknown>;
export type V3WorkflowRunResult = Array<{ outputId: string; classification: ClassificationPath; geometry: string; record: Record<string, unknown> }> & { executionSlots?:V3WorkflowValueMap };
export type V3WorkflowInputIssue = { stepId?: string; controlId?: string; message: string };
export type V3SearchCandidate = { id: string; display: string; returned: unknown; record: MountedFeatureRecord };
export type V3GeometryCapture = WorkflowDrawingCapture;

export function resolveV3WorldPrefix(world: unknown): string {
  const raw = normalizeV3WorldId(world);
  return applicationWorld(raw).prefix;
}

/** One canonical World value is used by workflow output, search, and the
 * map executor.  Imports may still carry legacy numeric, Chinese, or prefix
 * values, but they never create a second logical world namespace. */
export function normalizeV3WorldId(world: unknown): string {
  return normalizeRuleSourceWorldId(String(world ?? ''));
}

/** The editor and runner use exactly the same safe parser/evaluator. */
export const evaluateV3Expression = evaluateWorkflowExpression;

function setPath(target: Record<string, unknown>, path: string, value: unknown): void {
  if (!isSafeWorkflowTarget(path)) throw new Error(`无效组装路径：${path}`);
  const parts = String(path ?? '').split('.').filter(Boolean); if (!parts.length) return;
  let cursor = target;
  for (const key of parts.slice(0, -1)) {
    if (!cursor[key] || typeof cursor[key] !== 'object' || Array.isArray(cursor[key])) cursor[key] = {};
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[parts[parts.length - 1]] = value;
}

export function resolvedClassification(output: WorkflowDefinition['outputs'][number], selections: Record<string, ClassificationPath | undefined>): ClassificationPath {
  return selections[output.id] ?? output.classification;
}

function parseStructuredOutput(target: string, value: unknown): unknown {
  if (target !== 'tags' && target !== 'extensions') return value;
  if (typeof value !== 'string' || !value.trim()) return value;
  try { return JSON.parse(value); } catch { return value; }
}

export function normalizeV3WorkflowSlots(workflow: WorkflowDefinition, raw: V3WorkflowValueMap): V3WorkflowValueMap {
  const slots = coerceWorkflowValues(workflow,raw);
  for (const point of workflow.steps.flatMap(step => step.drawing?.auxiliaryPoints ?? [])) if (!workflowConditionMatches(point.when, slots)) delete slots[point.slot];
  for(const step of workflow.steps.filter(step=>step.kind==='geometry'))if(!enabledDrawing(step,workflow,slots)){
    for(const slot of [step.drawing?.captureSlot,step.drawing?.pointSlot].filter(Boolean) as string[])for(const key of [slot,`${slot}_RAW_POINT`,`${slot}_X`,`${slot}_Y`,`${slot}_Z`,`${slot}_HEIGHT`])delete slots[key];
    for(const control of step.controls??[])if(control.slot)delete slots[control.slot];
  }
  for (const slot of workflowCaptureSlots(workflow)) {
    let raw=slots[`${slot}_RAW_POINT`]??slots[slot];while(Array.isArray(raw)&&Array.isArray(raw[0]))raw=raw[0];
    const point:Record<string,unknown>|undefined=Array.isArray(raw)?{x:raw[0],y:raw[1],z:raw[2]}:raw as Record<string,unknown>|undefined;
    if(!Object.prototype.hasOwnProperty.call(slots,`${slot}_HEIGHT`))slots[`${slot}_HEIGHT`]=typeof point?.y==='number'&&Number.isFinite(point.y)?point.y:undefined;
    for (const axis of ['x','y','z']) {
      const value = point?.[axis];
      slots[`${slot}_${axis.toUpperCase()}`] = typeof value === 'number' && Number.isFinite(value) ? value : undefined;
    }
  }
  return slots;
}

export function workflowOutputSystem(workflow: WorkflowDefinition, slots: V3WorkflowValueMap, options: { world?: string; classifications?: Record<string, ClassificationPath | undefined> }, outputId: string): V3WorkflowValueMap {
  const world = normalizeV3WorldId(options.world ?? slots.World ?? 'zth');
  const values = (classification: ClassificationPath) => ({ World: world, WorldPrefix: resolveV3WorldPrefix(world), Class: classification.class, Kind: classification.kind ?? '', Skind: classification.skind ?? '', Skind2: classification.skind2 ?? '', Creator: slots.actor ?? '', ID: slots.ID ?? '' });
  const selected = workflow.outputs.find((output) => output.id === outputId) ?? workflow.outputs[0];
  const system: V3WorkflowValueMap = selected ? values(resolvedClassification(selected, options.classifications ?? {})) : {};
  workflow.outputs.forEach((output, index) => Object.entries(values(resolvedClassification(output, options.classifications ?? {}))).forEach(([key, value]) => { system[`${key}_${index + 1}`] = value; }));
  return system;
}

export function evaluateV3WorkflowOutputs(workflow: WorkflowDefinition, slots: V3WorkflowValueMap, options: { world?: string; classifications?: Record<string, ClassificationPath | undefined>; config?: ConfigPackageV3; coordinates?: Record<string, MultipartCoord[] | MultipartGeometry>; now?: Date } = {}): V3WorkflowRunResult {
  if (options.config) workflow=resolveWorkflowFields(options.config,workflow);
  slots = normalizeV3WorkflowSlots(workflow, slots);
  const world = normalizeV3WorldId(options.world ?? slots.World ?? 'zth');
  const assembled = new Map<number, V3WorkflowRunResult[number]>();
  const active=new Set(activeOutputIds(workflow,slots));
  for(const output of workflow.outputs.filter(item=>active.has(item.id)))for(const assignment of output.assignments)for(const token of workflowExpressionTokens(parseWorkflowExpression(assignment.expression))){
    const index=/^(?:ID|Class|Kind|Skind|Skind2)_(\d+)$/.exec(token);if(index&&!active.has(workflow.outputs[Number(index[1])-1]?.id))throw new Error(`输出 ${output.id} 依赖未启用的输出 ${token}。`);
  }
  for (const index of workflowOutputAssemblyOrder(workflow)) {
    const output = workflow.outputs[index];
    if(!active.has(output.id))continue;
    const classification = resolvedClassification(output, options.classifications ?? {});
    const system = workflowOutputSystem(workflow, slots, { ...options, world }, output.id);
    for (const [otherIndex, result] of assembled) system[`ID_${otherIndex + 1}`] = result.record.ID ?? '';
    if (options.config && (!hasCategoryNode(options.config, classification) || hasDescendants(options.config, classification) || !pathMatchesScope(classification, output.classification) || !resolveGeometryProfile(options.config, classification, output.geometry.selected)?.enabled)) throw new Error(`输出 ${output.id} 必须选择最终分类与有效几何。`);
    const record: Record<string, unknown> = { World: world, Class: classification.class, ...(classification.kind ? { Kind: classification.kind } : {}), ...(classification.skind ? { SKind: classification.skind } : {}), ...(classification.skind2 ? { SKind2: classification.skind2 } : {}) };
    const actor = String(slots.actor ?? '').trim(); if (actor) record.Creator = actor;
    for (const namespace of ['tags', 'extensions'] as const) {
      const value = parseStructuredOutput(namespace, slots[namespace]);
      if (value && typeof value === 'object' && !Array.isArray(value)) record[namespace] = structuredClone(value);
    }
    const assignmentOrder = [...output.assignments.filter(assignment => assignment.target === 'ID'), ...output.assignments.filter(assignment => assignment.target !== 'ID')];
    for (const assignment of assignmentOrder) {
      if (!workflowConditionMatches(assignment.when, slots, system)) continue;
      if (PROTECTED_WORKFLOW_TARGETS.has(assignment.target.split('.')[0])) {
        const source = assignment.target === 'SKind' ? 'Skind' : assignment.target === 'SKind2' ? 'Skind2' : assignment.target;
        if (assignment.expression.trim() === source && source in system) continue;
        throw new Error(`系统字段 ${assignment.target} 不能由组装覆盖。`);
      }
      const value = parseStructuredOutput(assignment.target, evaluateV3Expression(assignment.expression, slots, system));
      if (value !== undefined) setPath(record, assignment.target, value);
      system.ID = record.ID ?? '';
      system[`ID_${index + 1}`] = record.ID ?? '';
    }
    const custom=annotationsForOutput(workflow,slots,output.id);
    for(const namespace of ['tags','extensions'] as const)if(Object.keys(custom[namespace]).length){
      if(record[namespace]!=null&&(typeof record[namespace]!=='object'||Array.isArray(record[namespace])))throw new Error(`${namespace} 自动组装必须为对象。`);
      record[namespace]??={};mergeAnnotations(record[namespace] as Record<string,unknown>,custom[namespace],namespace);
    }
    record.World = world;
    for(const step of workflow.steps.filter(step=>step.kind==='geometry'&&enabledDrawing(step,workflow,slots)))for(const binding of step.drawing?.bindings??[])if(binding.outputId===output.id){
      const slot=step.drawing?.captureSlot;
      let value=binding.value==='height'?slot?slots[`${slot}_HEIGHT`]:undefined:slot?slots[slot]:undefined;
      if(binding.value==='height'&&value==null&&step.drawing?.heightSlot){const entered=slots[step.drawing.heightSlot];if(entered!==''&&entered!=null&&Number.isFinite(Number(entered)))value=Number(entered);}
      if(binding.value==='geometry'&&step.drawing?.returnFormat==='pointObject'&&value&&typeof value==='object'&&!Array.isArray(value)&&!(typeof (value as Record<string,unknown>).y==='number')){
        const entered=step.drawing.heightSlot?slots[step.drawing.heightSlot]:undefined;value={...value,y:entered!==''&&entered!=null?Number(entered):-64};
      }
      if(value!==undefined)setPath(record,binding.target,value);
    }
    const captured=options.coordinates?.[output.id];
    const geometry=captured&&!Array.isArray(captured)?captured:undefined;
    const finalized = options.config && captured ? finalizeV3WorkflowRecord(options.config,{...output,classification},record,{coords:Array.isArray(captured)?captured:[],geometry,preservePaths:[...annotationPaths(custom.tags,'tags'),...annotationPaths(custom.extensions,'extensions')],now:options.now??new Date()}) : record;
    assembled.set(index, { outputId: output.id, classification, geometry: output.geometry.selected, record: finalized });
  }
  const results=workflow.outputs.flatMap((_,index)=>assembled.has(index)?[assembled.get(index)!]:[]) as V3WorkflowRunResult;
  Object.defineProperty(results,'executionSlots',{value:structuredClone(slots),enumerable:false});
  return results;
}

export function empty(value: unknown): boolean { return value === undefined || value === null || (typeof value === 'string' && !value.trim()) || (Array.isArray(value) && value.length === 0); }

export function recordPath(record: MountedFeatureRecord): ClassificationPath {
  return { class: String(record.Class ?? ''), ...(record.Kind ? { kind: String(record.Kind) } : {}), ...(record.Skind ?? record.SKind ? { skind: String(record.Skind ?? record.SKind) } : {}), ...(record.Skind2 ?? record.SKind2 ? { skind2: String(record.Skind2 ?? record.SKind2) } : {}) };
}

export function displaySearchTemplate(template: string, record: MountedFeatureRecord): string {
  return template.replace(/{{\s*([A-Za-z][A-Za-z0-9_.]*)\s*}}/g, (_all, field: string) => String(readRecordPath(record, field) ?? 'Null'));
}

/** Query actual mounted records. The returned value is deliberately one field,
 * while ID/Name are only the human-facing choice label. */
export function findV3SearchCandidates(records: MountedFeatureRecord[], profile: SearchProfile | undefined, query: string, world?: string,config?:ConfigPackageV3): V3SearchCandidate[] {
  const search = normalizeSearchProfile(profile);
  const needle = query.trim().toLocaleLowerCase();
  if (!search || needle.length < (search.minQueryLength ?? 1)) return [];
  const matches = (value: string) => {
    const text = value.toLocaleLowerCase();
    if (search.matcher === 'prefix') return text.startsWith(needle);
    if (search.matcher === 'token') return text.split(/[\s_\-/.]+/).some((token) => token.startsWith(needle));
    if (search.matcher === 'fuzzy') { let index = 0; for (const char of text) if (char === needle[index]) index += 1; return index === needle.length; }
    return text.includes(needle);
  };
  return records.filter((record) => {
    if (search.cacheScope !== 'loadedWorlds' && world && String(record.World ?? '').trim() && normalizeV3WorldId(record.World) !== normalizeV3WorldId(world)) return false;
    if(search.targetRole==='main'){const role=config?resolveNodeFieldSettings(config,recordPath(record)).value.structure:undefined;if(!role?.enabled||role.role!=='main')return false;}
    else if (!pathMatchesScope(recordPath(record), search.target)) return false;
    return (search.queryFields ?? []).some((field) => matches(String(readRecordPath(record, field) ?? '')));
  }).slice(0, search.maxResults ?? 30).map((record, index) => ({ id: String(record.ID ?? index), display: displaySearchTemplate(search.displayTemplate ?? '{{ID}} ({{Name}})', record), returned: readRecordPath(record, search.returnField ?? 'ID'), record }));
}

export function validateV3WorkflowInputs(workflow: WorkflowDefinition, slots: V3WorkflowValueMap, steps = workflow.steps, config?: ConfigPackageV3): V3WorkflowInputIssue[] {
  if (workflow.mode !== 'composed') return [];
  if(config){workflow=resolveWorkflowFields(config,workflow);steps=resolveWorkflowFields(config,{...workflow,steps}).steps;}
  slots=coerceWorkflowValues(workflow,slots);
  const issues: V3WorkflowInputIssue[] = [];
  for (const step of steps) if (step.kind === 'actor' && workflow.actor?.required !== false && empty(slots.actor)) issues.push({ stepId: step.id, message: '填写人为必填项。' });
  const isRequired=(field:WorkflowControl|WorkflowGroupField)=>field.required&&(!field.requiredWhen?.length||field.requiredWhen.every(condition=>workflowConditionMatches(condition,slots)));
  const validateValue = (field: WorkflowControl | WorkflowGroupField, value: unknown, report: (message: string) => void) => {
    if (isRequired(field) && empty(value)) report(`${field.label.zh} 为必填项。`);
    if (empty(value)) return;
    if(field.kind==='toggle'&&typeof value!=='boolean')report(`${field.label.zh} 必须选择是或否。`);
    if (field.kind === 'number' && !Number.isFinite(Number(value))) report(`${field.label.zh} 必须是有限数值。`);
    if (field.kind === 'select' && !field.options?.some((option) => option.value === String(value))) report(`${field.label.zh} 必须选择有效的保存值。`);
    if (field.kind === 'json') try { if (typeof value === 'string') JSON.parse(value); } catch { report(`${field.label.zh} 必须是有效 JSON。`); }
  };
  for (const step of steps) for (const control of step.controls ?? []) {
    if (!workflowConditionMatches(control.when, slots) || control.kind==='classificationPicker' && control.outputId && !activeOutputIds(workflow,slots).includes(control.outputId)) continue;
    const value = slots[control.slot ?? control.id];
    const report = (message: string) => issues.push({ stepId: step.id, controlId: control.id, message });
    if(control.kind==='classificationPicker' && config && !empty(value)){
      const path=decodePath(String(value));if(!path||!hasCategoryNode(config,path)||hasDescendants(config,path)||!pathMatchesScope(path,control.classificationScope??{class:''}))report('请选择范围内最终子分类。');
    }
    if(control.kind==='tagsExtensions'){
      try {for(const output of workflow.outputs)annotationsForOutput({...workflow,steps:[{...step,controls:[control]}]},slots,output.id);}catch(error){report(error instanceof Error?error.message:'标签/扩展无效。');}continue;
    }
    validateValue(config && control.kind === 'select' ? { ...control, options: resolveWorkflowSelectOptions(config, control) } : control, value, report);
    if (control.kind !== 'group') continue;
    const group = control.group; const scalar = group?.storage === 'scalar';
    const rows = Array.isArray(value) ? value : [];
    if (!empty(value) && !Array.isArray(value)) report(`${control.label.zh} 必须是数组。`);
    const minItems = Math.max(group?.minItems ?? 0, isRequired(control) || group?.optional === false ? 1 : 0);
    if (rows.length < minItems) report(`${control.label.zh} 至少需要 ${minItems} 项。`);
    for (const [rowIndex, row] of rows.entries()) {
      if (!scalar && (!row || typeof row !== 'object' || Array.isArray(row))) { report(`${control.label.zh} 第 ${rowIndex + 1} 项必须是字段对象。`); continue; }
      if (scalar && row !== null && typeof row === 'object') { report(`${control.label.zh} 第 ${rowIndex + 1} 项必须是纯值。`); continue; }
      for (const field of group?.itemFields ?? []) validateValue(config ? {...field,options:resolveWorkflowSelectOptions(config,field)} : field, scalar ? row : row[field.key], (message) => report(`第 ${rowIndex + 1} 项：${message}`));
    }
  }
  for (const step of steps) for (const point of step.drawing?.auxiliaryPoints ?? []) {
    if (!workflowConditionMatches(point.when, slots)) continue;
    const value = slots[point.slot] as { x?: number; y?: number; z?: number } | undefined;
    if (point.required && !value || value && (!Number.isFinite(value.x) || !Number.isFinite(value.z) || value.y !== undefined && !Number.isFinite(value.y))) issues.push({ stepId: step.id, controlId: point.id, message: `${point.label.zh} 必须采用有效点坐标。` });
  }
  if (steps.some((step) => step.kind === 'tagsExtensions')) for (const field of ['tags', 'extensions']) {
    if (empty(slots[field])) continue;
    try {
      const value = typeof slots[field] === 'string' ? JSON.parse(slots[field] as string) : slots[field];
      if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error();
    } catch { issues.push({ message: `${field} 必须是有效 JSON 对象。` }); }
  }
  return issues;
}

/** Creation validates the assembled record, not only its form slots. */
export function validateV3WorkflowRecords(config: ConfigPackageV3, workflow: WorkflowDefinition, result: V3WorkflowRunResult): V3WorkflowInputIssue[] {
  const issues: V3WorkflowInputIssue[] = [];
  for (const output of result) {
    const definition = workflow.outputs.find(item => item.id === output.outputId);
    if (!definition || !hasCategoryNode(config, output.classification) || !pathMatchesScope(output.classification, definition.classification)) { issues.push({ message: `输出 ${output.outputId} 的分类无效。` }); continue; }
    for(const message of tagRecordErrors(config,output.classification,output.record))issues.push({message});
    const geometry=readMultipartGeometry(output.record,definition.geometry.selected).geometry;
    if(geometry&&geometry.parts.length>1&&resolveGeometryProfile(config,output.classification,definition.geometry.selected)?.allowMultipleParts===false)issues.push({message:`输出 ${output.outputId} 的分类只允许单部件几何。`});
    if (!String(output.record.ID ?? '').trim()) issues.push({ message: `输出 ${output.outputId} 缺少有效 ID。` });
    if(config.contractRevision>=10){const role=resolveNodeFieldSettings(config,output.classification).value.structure;if(role?.enabled&&role.role==='member'){
      const host=role.hostField?readRecordPath(output.record,role.hostField):undefined,selector=role.selectorField?readRecordPath(output.record,role.selectorField):undefined;
      if(typeof host!=='string'||!host.trim())issues.push({message:`输出 ${output.outputId} 缺少单值主结构 ID（${role.hostField}）。`});
      if(!['string','number','boolean'].includes(typeof selector)||typeof selector==='string'&&!selector.trim()||typeof selector==='number'&&!Number.isFinite(selector))issues.push({message:`输出 ${output.outputId} 缺少有效附属层级（${role.selectorField}）。`});
    }}
    for (const field of resolveEffectiveFields(config, output.classification)) {
      const value = readRecordPath(output.record, field.key);
      const required = field.required || field.requiredWhen?.some(condition => condition.kind === 'always' || condition.kind === 'fieldPresent' && !empty(readRecordPath(output.record, condition.field)) === condition.present || condition.kind === 'fieldEquals' && String(readRecordPath(output.record, condition.field) ?? '') === condition.value || condition.kind === 'fieldIn' && condition.values.includes(String(readRecordPath(output.record, condition.field) ?? '')));
      if (required && empty(value)) issues.push({ message: `输出 ${output.outputId} 的 ${field.key} 为必填项。` });
      if (empty(value)) continue;
      if(field.valueSchema)for(const message of validateStructuredValue(value,field.valueSchema,field.key))issues.push({message});
      const values = field.cardinality === 'multiple' ? Array.isArray(value) ? value : [value] : [value];
      if (field.cardinality === 'multiple' && !Array.isArray(value)) issues.push({ message: `${field.key} 必须是数组。` });
      if (['string','reference'].includes(field.type)&&values.some(item=>typeof item!=='string'))issues.push({message:`${field.key} 必须是文本值。`});
      if (field.type === 'enum'&&field.optionValueType&&values.some(item=>typeof item!==field.optionValueType))issues.push({message:`${field.key} 的选项保存值类型不符。`});
      if (field.type === 'number' && values.some(item => typeof item !== 'number' || !Number.isFinite(item))) issues.push({ message: `${field.key} 必须是有限数值。` });
      if (field.type === 'boolean' && values.some(item => typeof item !== 'boolean')) issues.push({ message: `${field.key} 必须是布尔值。` });
      if (field.type === 'enum' && field.options?.length && values.some(item => !field.options!.some(option => option.value === String(item)))) issues.push({ message: `${field.key} 不是有效选项值。` });
    }
  }
  return issues;
}

export function decodePath(value: string): ClassificationPath | undefined { try { const parsed = JSON.parse(value); return parsed?.class ? parsed as ClassificationPath : undefined; } catch { return undefined; } }

