import type { ClassificationPath, ConfigPackageV3, ConfigValidationIssue, FieldDefinition, PrefillAudit } from './types';
import migrationEvidence from './prefillSourceMigrationEvidence.json';

function canonical(value:unknown):string {
  return Array.isArray(value)?'['+value.map(canonical).join(',')+']':value&&typeof value==='object'?'{'+Object.entries(value).filter(([,v])=>v!==undefined).sort(([a],[b])=>a.localeCompare(b)).map(([key,v])=>JSON.stringify(key)+':'+canonical(v)).join(',')+'}':JSON.stringify(value);
}
/** Non-security fingerprint: two independent 32-bit lanes identify changes. */
function legacyFieldFingerprint(field:FieldDefinition):string {
  const text=canonical({key:field.key,type:field.type,cardinality:field.cardinality,input:field.input,labels:field.labels,description:field.description,options:field.options,optionValueType:field.optionValueType,format:field.format});
  let a=2166136261,b=5381;for(let i=0;i<text.length;i++){a=Math.imul(a^text.charCodeAt(i),16777619);b=Math.imul(b,33)^text.charCodeAt(i);}
  return `field-v1-${(a>>>0).toString(16).padStart(8,'0')}${(b>>>0).toString(16).padStart(8,'0')}`;
}
/** Full semantic fingerprints are used for new evidence; v1 remains readable. */
function digest(value:unknown):string {
 const text=canonical(value);let a=2166136261,b=5381;for(let i=0;i<text.length;i++){a=Math.imul(a^text.charCodeAt(i),16777619);b=Math.imul(b,33)^text.charCodeAt(i);}return (a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');
}
function withoutAudit(value:unknown):unknown {return Array.isArray(value)?value.map(withoutAudit):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).filter(([key])=>key!=='prefillAudit').map(([key,item])=>[key,withoutAudit(item)])):value;}
const semanticField=(field:FieldDefinition)=>'field-v2-'+digest(withoutAudit(field));
export const fieldFingerprint=semanticField;
export function createPrefillAudit(path:ClassificationPath,field:FieldDefinition):PrefillAudit {
 return {source:{path:structuredClone(path),fieldId:field.fieldId,key:field.key},fingerprint:semanticField(field)};
}
type Audited={prefillAudit?:PrefillAudit};
export function visitPrefillCopies(config:ConfigPackageV3,visit:(owner:Audited,path:string)=>void):void {
 const seen=new WeakSet<object>();
 const emit=(owner:Audited,path:string)=>{if(seen.has(owner))return;seen.add(owner);if(owner.prefillAudit)visit(owner,path);};
 // Preserve existing stable issue locations while covering all additional owners.
 config.nodes.forEach(node=>{if(node.card?.mode==='fields')node.card.items.forEach(item=>emit(item,`nodes/${node.nodeId}/card/${item.id}`));if(node.fieldSettings?.search)emit(node.fieldSettings.search.subtitle,`nodes/${node.nodeId}/fieldSettings/search/subtitle`);if(node.searchSettings)emit(node.searchSettings.subtitle,`nodes/${node.nodeId}/searchSettings/subtitle`);});
 config.workflows.forEach(w=>w.steps.forEach(s=>s.controls?.forEach(c=>{emit(c,`workflows/${w.id}/${c.id}`);c.group?.itemFields.forEach(f=>emit(f,`workflows/${w.id}/${c.id}/${f.key}`));})));
 const walk=(value:unknown,path:string)=>{if(Array.isArray(value)){value.forEach((item,index)=>{const row=item as {nodeId?:string;id?:string}|null;walk(item,path+'/'+(row?.nodeId??row?.id??index));});return;}if(!value||typeof value!=='object')return;if('prefillAudit' in value)emit(value as Audited,path);for(const [key,item]of Object.entries(value))if(key!=='prefillAudit')walk(item,path?path+'/'+key:key);};walk(config,'');
}
function sourceField(config:ConfigPackageV3,audit:PrefillAudit,resolve:(config:ConfigPackageV3,path:ClassificationPath)=>FieldDefinition[]){
 if(!config.nodes.some(node=>canonical(node.path)===canonical(audit.source.path)))return undefined;
 const fields=resolve(config,audit.source.path);return fields.find(field=>field.fieldId===audit.source.fieldId&&field.key===audit.source.key);
}
function confirmation(owner:Audited,audit:PrefillAudit,field:FieldDefinition|undefined,path:string){return 'copy-v2-'+digest({owner:path,source:audit.source,state:field?semanticField(field):'missing',copy:withoutAudit(owner)});}
export function validatePrefillCopies(config:ConfigPackageV3,resolve:(config:ConfigPackageV3,path:ClassificationPath)=>FieldDefinition[],sourceConfig:ConfigPackageV3=config):ConfigValidationIssue[] {
 const issues:ConfigValidationIssue[]=[];if(config.contractRevision<10)return issues;
 visitPrefillCopies(config,(owner,path)=>{
  const audit=owner.prefillAudit!;const field=sourceField(sourceConfig,audit,resolve),source=Object.values(audit.source.path).filter(Boolean).join('/');
  if(audit.confirmedFingerprint===confirmation(owner,audit,field,path))return;
  if(!field){issues.push({severity:config.contractRevision>=11?'warning':'error',code:'prefill-source-field-missing',path,field:audit.source.key,message:`预填来源 ${source} / ${audit.source.key} 已不存在；当前副本仍独立保存，请确认是否需要更新。`});return;}
  const current=audit.fingerprint.startsWith('field-v2-')?semanticField(field):legacyFieldFingerprint(field);
  if(audit.confirmedFingerprint||current!==audit.fingerprint)issues.push({severity:'warning',code:audit.confirmedFingerprint&&!audit.confirmedFingerprint.startsWith('copy-v2-')?'prefill-confirmation-needs-refresh':'prefill-copy-outdated',path,field:field.key,message:`来源 ${source} / ${field.key} 的定义、当前副本或确认依据需重新核对；${path} 仍保留独立副本。请重新预填，或确认保留本次自定义副本。`});
 });return issues;
}
export function confirmPrefillCopies(input:ConfigPackageV3,resolve:(config:ConfigPackageV3,path:ClassificationPath)=>FieldDefinition[],paths?:string[]):ConfigPackageV3 {
 const config=structuredClone(input);visitPrefillCopies(config,(owner,path)=>{if(paths&&!paths.includes(path))return;const audit=owner.prefillAudit!;audit.confirmedFingerprint=confirmation(owner,audit,sourceField(config,audit,resolve),path);});return config;
}
export type PrefillRepair={owner:string;before:PrefillAudit['source'];after?:PrefillAudit['source'];status:'repairable'|'changed'|'unresolved'|'unchanged';reason:string;originalFingerprint?:string;originalConfirmation?:string;copy?:unknown;previousDefinition?:unknown;currentDefinition?:unknown};
/** An explicit project migration preview. Never invoked as an activation-time alias. */
export function previewPrefillSourceRepairs(config:ConfigPackageV3,resolve:(config:ConfigPackageV3,path:ClassificationPath)=>FieldDefinition[]):PrefillRepair[]{
 const changes:PrefillRepair[]=[];if(config.projectId!=='openriamap-ria')return changes;
 visitPrefillCopies(config,(owner,path)=>{
  const audit=owner.prefillAudit!,existing=sourceField(config,audit,resolve),before=structuredClone(audit.source),context={owner:path,before,originalFingerprint:audit.fingerprint,originalConfirmation:audit.confirmedFingerprint,copy:withoutAudit(owner)};
  if(existing){changes.push({...context,after:before,currentDefinition:existing,status:'unchanged',reason:'原来源仍可解析，保持原指定；副本变化仍由正常核验检查。'});return;}
  const known=migrationEvidence.rows.filter(row=>canonical(row.beforePath)===canonical(before.path));
  const targets=new Map(known.map(row=>[canonical(row.afterPath),row.afterPath]));
  const target=targets.size===1?[...targets.values()][0] as ClassificationPath:undefined;
  if(!target||!config.nodes.some(node=>canonical(node.path)===canonical(target))){changes.push({...context,status:'unresolved',reason:'没有已核实的唯一搬迁路径，保留原件待核对。'});return;}
  const evidence=migrationEvidence.rows.find(row=>canonical(row.beforePath)===canonical(before.path)&&row.beforeField.fieldId===before.fieldId&&row.beforeField.key===before.key&&canonical(row.afterPath)===canonical(target));
  const candidates=resolve(config,target).filter(field=>field.fieldId===(evidence?.afterFieldId??audit.source.fieldId)&&field.key===audit.source.key);
  if(candidates.length!==1){changes.push({...context,status:'unresolved',reason:'目标字段身份或 Key 无法唯一对应，不按同名猜测。'});return;}
  const field=candidates[0],previous=evidence?.beforeField as FieldDefinition|undefined;
  const fingerprintMatches=(audit.fingerprint.startsWith('field-v2-')?semanticField(previous??field):legacyFieldFingerprint(previous??field))===audit.fingerprint;
  const semanticDefinition=(value:FieldDefinition)=>withoutAudit({...value,fieldId:undefined});
  // v1 omitted constraints/defaults/references. It alone cannot prove equality.
  const fullDefinitionMatches=previous?canonical(semanticDefinition(previous))===canonical(semanticDefinition(field)):audit.fingerprint.startsWith('field-v2-');
  const same=fingerprintMatches&&fullDefinitionMatches;
  changes.push({owner:path,before,after:{path:structuredClone(target),fieldId:field.fieldId,key:field.key},status:same?'repairable':'changed',originalFingerprint:audit.fingerprint,originalConfirmation:audit.confirmedFingerprint,copy:withoutAudit(owner),previousDefinition:previous,currentDefinition:field,reason:same?'已核实分类模板搬迁与字段身份重映射；完整原定义（含约束、默认值、引用）一致，只修来源身份。':'来源可定位，但完整定义存在差异或历史证据不足；保留副本，不自动确认。'});
 });return changes;
}
export function applyPrefillSourceRepairs(input:ConfigPackageV3,resolve:(config:ConfigPackageV3,path:ClassificationPath)=>FieldDefinition[]):ConfigPackageV3{
 const changes=new Map(previewPrefillSourceRepairs(input,resolve).filter(item=>item.status==='repairable'&&item.after).map(item=>[item.owner,item]));
 const config=structuredClone(input);visitPrefillCopies(config,(owner,path)=>{const repair=changes.get(path);if(repair?.after)owner.prefillAudit={...owner.prefillAudit!,source:structuredClone(repair.after),fingerprint:semanticField(repair.currentDefinition as FieldDefinition),confirmedFingerprint:undefined};});return config;
}
