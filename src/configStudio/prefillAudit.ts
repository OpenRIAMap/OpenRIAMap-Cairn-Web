import type { ClassificationPath, ConfigPackageV3, ConfigValidationIssue, FieldDefinition, PrefillAudit } from './types';

function canonical(value:unknown):string {
  return Array.isArray(value)?'['+value.map(canonical).join(',')+']':value&&typeof value==='object'?'{'+Object.entries(value).filter(([,v])=>v!==undefined).sort(([a],[b])=>a.localeCompare(b)).map(([key,v])=>JSON.stringify(key)+':'+canonical(v)).join(',')+'}':JSON.stringify(value);
}
/** Non-security fingerprint: two independent 32-bit lanes identify changes. */
export function fieldFingerprint(field:FieldDefinition):string {
  const text=canonical({key:field.key,type:field.type,cardinality:field.cardinality,input:field.input,labels:field.labels,description:field.description,options:field.options,optionValueType:field.optionValueType,format:field.format});
  let a=2166136261,b=5381;for(let i=0;i<text.length;i++){a=Math.imul(a^text.charCodeAt(i),16777619);b=Math.imul(b,33)^text.charCodeAt(i);}
  return `field-v1-${(a>>>0).toString(16).padStart(8,'0')}${(b>>>0).toString(16).padStart(8,'0')}`;
}
export function createPrefillAudit(path:ClassificationPath,field:FieldDefinition):PrefillAudit {
  return {source:{path:structuredClone(path),fieldId:field.fieldId,key:field.key},fingerprint:fieldFingerprint(field)};
}
type Audited={prefillAudit?:PrefillAudit};
export function visitPrefillCopies(config:ConfigPackageV3,visit:(owner:Audited,path:string)=>void):void {
  config.nodes.forEach(node=>{if(node.card?.mode==='fields')node.card.items.filter(item=>!item.inheritFrom).forEach(item=>visit(item,`nodes/${node.nodeId}/card/${item.id}`));if(node.fieldSettings?.search)visit(node.fieldSettings.search.subtitle,`nodes/${node.nodeId}/fieldSettings/search/subtitle`);});
  config.workflows.forEach(w=>w.steps.forEach(s=>s.controls?.forEach(c=>{if(!c.optionsTableId)visit(c,`workflows/${w.id}/${c.id}`);c.group?.itemFields.filter(f=>!f.optionsTableId).forEach(f=>visit(f,`workflows/${w.id}/${c.id}/${f.key}`));})));
}
export function validatePrefillCopies(config:ConfigPackageV3,resolve:(config:ConfigPackageV3,path:ClassificationPath)=>FieldDefinition[]):ConfigValidationIssue[] {
  const issues:ConfigValidationIssue[]=[];if(config.contractRevision<10)return issues;
  visitPrefillCopies(config,(owner,path)=>{
    const audit=owner.prefillAudit;if(!audit)return;
    const fields=resolve(config,audit.source.path),field=fields.find(field=>field.fieldId===audit.source.fieldId)??fields.find(field=>field.key===audit.source.key);
    const source=Object.values(audit.source.path).filter(Boolean).join('/');
    if(!field){issues.push({severity:config.contractRevision>=11?'warning':'error',code:'prefill-source-field-missing',path,field:audit.source.key,message:`预填来源 ${source} / ${audit.source.key} 已不存在；当前副本仍独立保存，请确认是否需要更新。`});return;}
    const current=fieldFingerprint(field);
    if(current!==audit.fingerprint&&current!==audit.confirmedFingerprint)issues.push({severity:'warning',code:'prefill-copy-outdated',path,field:field.key,message:`来源 ${source} / ${field.key} 的定义、名称、类型或对照已变化；${path} 仍保留独立副本。请重新预填，或确认保留本次自定义副本。`});
  });return issues;
}
export function confirmPrefillCopies(input:ConfigPackageV3,resolve:(config:ConfigPackageV3,path:ClassificationPath)=>FieldDefinition[],paths?:string[]):ConfigPackageV3 {
  const config=structuredClone(input);visitPrefillCopies(config,(owner,path)=>{
    if(paths&&!paths.includes(path))return;const audit=owner.prefillAudit;if(!audit)return;
    const field=resolve(config,audit.source.path).find(field=>field.fieldId===audit.source.fieldId||field.key===audit.source.key);if(field)audit.confirmedFingerprint=fieldFingerprint(field);
  });return config;
}
