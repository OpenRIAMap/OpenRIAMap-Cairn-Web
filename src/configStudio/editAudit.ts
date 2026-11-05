import type {ConfigPackageV3} from './types';
import {stableConfigText} from '../configRuntime/configurationFingerprint';
import {sha256Bytes,type ConfigurationIdentity} from '../configRuntime/formalConfiguration';
export const EDIT_AUDIT_PATH='reports/edit-audit.json';
export type EditCheckpoint={id:string;parentId?:string;savedAt:string;configSha256:string;changes:Array<{path:string;before?:unknown;after?:unknown}>;validation:{valid:true};imported?:boolean};
export type EditAudit={schemaVersion:'cairnmap.edit-audit.v1';baseline:Pick<ConfigurationIdentity,'packageId'|'revision'|'configSha256'|'contractRevision'>;checkpoints:EditCheckpoint[];publication?:{sourceRevision:number;revision:number;configSha256:string};staged?:{sourceConfig:ConfigPackageV3;configSha256:string}};
const hash=(value:unknown)=>sha256Bytes(new TextEncoder().encode(stableConfigText(value)));
export function editDiff(before:unknown,after:unknown,path='config'):EditCheckpoint['changes']{
 if(stableConfigText(before)===stableConfigText(after))return [];
 if(Array.isArray(before)&&Array.isArray(after)){
  const rows=[...before,...after];
  const identity=['nodeId','fieldId','id'].find(key=>rows.length&&rows.every(row=>row&&typeof row==='object'&&!Array.isArray(row)&&typeof row[key]==='string')&&[before,after].every(items=>new Set(items.map(row=>row[key])).size===items.length));
  if(identity){
   const a=new Map(before.map(row=>[row[identity],row])),b=new Map(after.map(row=>[row[identity],row]));
   const changes=[...new Set([...a.keys(),...b.keys()])].flatMap(id=>editDiff(a.get(id),b.get(id),path+'/'+encodeURIComponent(id)));
   const oldOrder=before.map(row=>row[identity]),newOrder=after.map(row=>row[identity]);
   if(stableConfigText(oldOrder)!==stableConfigText(newOrder))changes.push({path:path+'/@order',before:oldOrder,after:newOrder});
   return changes;
  }
 }
 if(before&&after&&typeof before==='object'&&typeof after==='object'&&!Array.isArray(before)&&!Array.isArray(after))return [...new Set([...Object.keys(before),...Object.keys(after)])].flatMap(key=>editDiff((before as Record<string,unknown>)[key],(after as Record<string,unknown>)[key],path+'/'+key));
 return [{path,...(before===undefined?{}:{before}),...(after===undefined?{}:{after})}];
}
export async function appendEditCheckpoint(audit:EditAudit|undefined,baseline:EditAudit['baseline'],before:ConfigPackageV3,after:ConfigPackageV3):Promise<EditAudit|undefined>{
 const digest=await hash(after);if(audit?.checkpoints.slice(-1)[0]?.configSha256===digest)return audit;
 const changes=editDiff(before,after);if(!changes.length)return audit;
 const previous=audit?.checkpoints.slice(-1)[0],checkpoint:EditCheckpoint={id:crypto.randomUUID(),...(previous?{parentId:previous.id}:{}),savedAt:new Date().toISOString(),configSha256:await hash(after),changes,validation:{valid:true}};
 return {schemaVersion:'cairnmap.edit-audit.v1',baseline:audit?.baseline??baseline,checkpoints:[...audit?.checkpoints??[],checkpoint]};
}
export async function readEditAudit(value:unknown,config:ConfigPackageV3):Promise<EditAudit|undefined>{
 if(value===undefined)return;
 const audit=value as EditAudit;if(audit?.schemaVersion!=='cairnmap.edit-audit.v1'||!audit.baseline||audit.baseline.packageId!==config.packageId||!Number.isSafeInteger(audit.baseline.revision)||!Array.isArray(audit.checkpoints)||audit.checkpoints.length>10000)throw Error('编辑审计文件结构或基线身份无效。');
 const ids=new Set<string>();let parent:string|undefined;
 for(const checkpoint of audit.checkpoints){if(!checkpoint.id||ids.has(checkpoint.id)||checkpoint.parentId!==parent||!Number.isFinite(Date.parse(checkpoint.savedAt))||!Array.isArray(checkpoint.changes)||!/^[a-f\d]{64}$/.test(checkpoint.configSha256)||checkpoint.validation?.valid!==true)throw Error('编辑审计检查点链不完整。');ids.add(checkpoint.id);parent=checkpoint.id;}
 if(audit.checkpoints.length&&audit.checkpoints.slice(-1)[0]!.configSha256!==await hash(config)){
  const staged=audit.staged;
  const stagedValid=staged?.sourceConfig?.packageId===config.packageId&&staged.configSha256===await hash(config)&&audit.checkpoints.slice(-1)[0]!.configSha256===await hash(staged.sourceConfig);
  const mapping=audit.publication;
  if(!stagedValid&&(!mapping||!Number.isSafeInteger(mapping.sourceRevision)||mapping.revision!==config.revision||mapping.configSha256!==await hash(config)||audit.checkpoints.slice(-1)[0]!.configSha256!==await hash({...config,revision:mapping.sourceRevision})))throw Error('编辑审计与导入配置摘要不一致。');
 }
 return structuredClone(audit);
}
/** A remote revision allocation changes bytes, without rewriting local history. */
export async function editAuditForExport(audit:EditAudit|undefined,config:ConfigPackageV3,sourceConfig?:ConfigPackageV3):Promise<EditAudit|undefined>{
 if(!audit?.checkpoints.length)return;
 const digest=await hash(config),last=audit.checkpoints.slice(-1)[0]!;
 if(last.configSha256===digest){const copy=structuredClone(audit);delete copy.publication;delete copy.staged;return copy;}
 const sourceRevision=audit.publication?.sourceRevision??audit.baseline.revision;
 if(last.configSha256!==await hash({...config,revision:sourceRevision})){const source=sourceConfig??audit.staged?.sourceConfig;if(source&&source.packageId===config.packageId&&last.configSha256===await hash(source))return {...audit,staged:{sourceConfig:source,configSha256:digest}};return;}
 return {...audit,publication:{sourceRevision,revision:config.revision,configSha256:digest}};
}
export function editVersionName(config:ConfigPackageV3,savedAt?:string){const date=(savedAt??new Date().toISOString()).replace(/[-:]/g,'').replace('.','');return `${date}-base-r${config.revision}-c${config.contractRevision}`;}
