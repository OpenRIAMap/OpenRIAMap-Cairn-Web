import type {ConfigPackageV3,ConfigValidationIssue,MountedFeatureRecord,StructureRole} from './types';
import type {FeatureRecord} from '../components/Rules/rendering/renderPrimitives';
import type {FeatureStore} from '../components/Rules/data/featureStore';
import {normalizeRuleSourceWorldId} from '../core/project/worldIdentity';
import {resolveNodeFieldSettings} from './nodeFieldSettings';

export const STRUCTURE_CONTEXT_ID='structure-role-context';
export const recordPath=(record:FeatureRecord)=>{const fi=record.featureInfo??{},sig=record.meta.sig??{};return {class:record.meta.Class??String(fi.Class??''),kind:fi.Kind??sig.Kind,skind:fi.SKind??fi.Skind??sig.SKind??sig.Skind,skind2:fi.SKind2??fi.Skind2??sig.SKind2??sig.Skind2};};
export const recordValue=(record:FeatureRecord,key:string):unknown=>key==='ID'?record.featureInfo?.ID??record.meta.idValue:key.split('.').reduce<unknown>((value,key)=>value&&typeof value==='object'?(value as Record<string,unknown>)[key]:undefined,record.featureInfo);
export const recordWorld=(record:FeatureRecord)=>normalizeRuleSourceWorldId(String(record.featureInfo?.World??record.meta.World??''));
export const recordId=(record:FeatureRecord)=>String(recordValue(record,'ID')??'').trim();
const values=(record:FeatureRecord,key?:string):string[]=>{if(!key)return [];const value=recordValue(record,key);return (Array.isArray(value)?value:[value]).flatMap(value=>typeof value==='string'||typeof value==='number'?[String(value).trim()].filter(Boolean):value&&typeof value==='object'&&'ID' in value&&typeof value.ID==='string'?[value.ID.trim()].filter(Boolean):[]);};
export type StructureIndex={byUid:Map<string,FeatureRecord>;roles:Map<FeatureRecord,StructureRole>;hostsByMember:Map<FeatureRecord,FeatureRecord>;membersByHost:Map<FeatureRecord,FeatureRecord[]>;diagnostics:Array<{code:string;record:string;message:string}>};
const cache=new WeakMap<Pick<FeatureStore,'all'>,WeakMap<ConfigPackageV3,StructureIndex>>();
export function buildStructureIndex(config:ConfigPackageV3,store:Pick<FeatureStore,'all'>):StructureIndex {
  const existing=cache.get(store)?.get(config);if(existing)return existing;
  const result:StructureIndex={byUid:new Map(),roles:new Map(),hostsByMember:new Map(),membersByHost:new Map(),diagnostics:[]},ids=new Map<string,FeatureRecord[]>();
  const key=(record:FeatureRecord,id=recordId(record))=>`${recordWorld(record)}/${id}`;
  for(const record of store.all){if(record.featureInfo?.__disabled||(record.meta as unknown as {disabled?:boolean}).disabled)continue;result.byUid.set(record.uid,record);const id=recordId(record);if(id){const rows=ids.get(key(record))??[];rows.push(record);ids.set(key(record),rows);}const role=resolveNodeFieldSettings(config,recordPath(record)).value.structure;if(role?.enabled)result.roles.set(record,role);}
  const add=(host:FeatureRecord,member:FeatureRecord)=>{const previous=result.hostsByMember.get(member);if(previous&&previous!==host){result.hostsByMember.delete(member);result.diagnostics.push({code:'structure-host-ambiguous',record:member.uid,message:'附属记录同时指向多个主结构，未自动选择。'});return;}result.hostsByMember.set(member,host);};
  const ambiguousMembers=new Set<FeatureRecord>();
  for(const [member,role] of result.roles)if(role.role==='member'){
    if(!structureSelector(result,member))result.diagnostics.push({code:'structure-selector-missing',record:member.uid,message:'附属记录缺少有效的层级值。'});
    const refs=values(member,role.hostField);if(refs.length>1){ambiguousMembers.add(member);result.diagnostics.push({code:'structure-host-ambiguous',record:member.uid,message:'主结构 ID 不是单值。'});continue;}
    if(refs.length){const matches=ids.get(key(member,refs[0]))??[];if(matches.length>1){ambiguousMembers.add(member);result.diagnostics.push({code:'structure-id-ambiguous',record:member.uid,message:'同世界目标 ID 重复，未选择任意记录。'});}else if(matches[0]&&result.roles.get(matches[0])?.role==='main')add(matches[0],member);else result.diagnostics.push({code:'structure-target-missing',record:member.uid,message:`没有找到同世界主结构 ${refs[0]}。`});}
  }
  // Reverse references supply compatibility only when the member has no
  // primary reference. They cannot override a conflicting primary relation.
  for(const [host,role] of result.roles)if(role.role==='main'&&role.memberField)for(const id of values(host,role.memberField)){
    const matches=ids.get(key(host,id))??[];if(matches.length>1){result.diagnostics.push({code:'structure-id-ambiguous',record:host.uid,message:`同世界附属 ID ${id} 重复。`});continue;}
    const member=matches[0],memberRole=member?result.roles.get(member):undefined;
    if(!member||memberRole?.role!=='member'){result.diagnostics.push({code:'structure-reverse-target-missing',record:host.uid,message:`没有找到同世界附属结构 ${id}。`});continue;}
    if(member&&memberRole?.role==='member'&&!ambiguousMembers.has(member)&&!values(member,memberRole.hostField).length){const prior=result.hostsByMember.get(member);if(prior&&prior!==host){ambiguousMembers.add(member);result.hostsByMember.delete(member);result.diagnostics.push({code:'structure-host-ambiguous',record:member.uid,message:'多个主结构反向引用同一附属记录。'});}else add(host,member);}
  }
  for(const [member,role] of result.roles)if(role.role==='member'&&!ambiguousMembers.has(member)&&!result.hostsByMember.has(member)&&!values(member,role.hostField).length)result.diagnostics.push({code:'structure-target-missing',record:member.uid,message:'附属记录没有主结构 ID，也没有可用的主结构反向引用。'});
  for(const [member,host] of result.hostsByMember){if(ambiguousMembers.has(member))continue;const members=result.membersByHost.get(host)??[];members.push(member);result.membersByHost.set(host,members);}
  if(Object.isFrozen(config)){let configs=cache.get(store);if(!configs){configs=new WeakMap();cache.set(store,configs);}configs.set(config,result);}return result;
}
export function structureSelector(index:StructureIndex,member:FeatureRecord):string {
  const field=index.roles.get(member)?.selectorField,value=field?recordValue(member,field):undefined;return typeof value==='string'||typeof value==='boolean'||typeof value==='number'&&Number.isFinite(value)?String(value).trim():'';
}
export function validateMountedStructureRoles(config:ConfigPackageV3,records:MountedFeatureRecord[]):ConfigValidationIssue[]{
  if(config.contractRevision<10||!records.length)return [];
  const all:FeatureRecord[]=records.map((record,index)=>({uid:`mounted:${index}`,type:'Points',featureInfo:record,meta:{Class:String(record.Class??''),Type:'Points',World:record.World,idField:'ID',idValue:String(record.ID??''),sig:{},signatureKey:`mounted:${index}`,groups:{}}}));
  const index=buildStructureIndex(config,{all});return index.diagnostics.map(diagnostic=>{const record=index.byUid.get(diagnostic.record);return {severity:diagnostic.code.includes('ambiguous')?'error':'warning',code:`mounted-${diagnostic.code}`,path:`mounted/${recordId(record!)}`,message:diagnostic.message,count:1,affectedFeatures:[{id:recordId(record!),name:String(record?.featureInfo?.Name??'')}]};});
}
