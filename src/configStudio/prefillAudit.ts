import type { ClassificationPath, ConfigPackageV3, ConfigValidationIssue, FieldDefinition, PrefillAudit } from './types';

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
