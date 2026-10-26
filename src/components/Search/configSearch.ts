import type {CategorySearch,ConfigPackageV3} from '../../configStudio/types';
import type {FeatureRecord} from '../Rules/rendering/renderPrimitives';
import {resolveNodeFieldSettings} from '../../configStudio/nodeFieldSettings';
import {classificationPathKey,resolveCategoryNodes,resolveEffectiveFields} from '../../configStudio/runtime';
import {recordPath,recordValue,recordWorld,recordId} from '../../configStudio/structureRoleIndex';
import {normalizeRuleSourceWorldId} from '../Rules/data/ruleDataSources';
import {getRuleDisplayName} from './searchPresentation';

const defaultSearch:CategorySearch={enabled:true,queryFields:['Name','ID'],subtitle:{mode:'classification'},extension:{mode:'none'}};
const text=(value:unknown):string=>value===null||value===undefined?'':typeof value==='object'?JSON.stringify(value):String(value);
type Entry={record:FeatureRecord;search:CategorySearch;hay:string;priority:number;order:number};
export type CategorySearchIndex={entries:Entry[];byRecord:WeakMap<FeatureRecord,Entry>;ids:Map<string,FeatureRecord[]>};
const cache=new WeakMap<FeatureRecord[],WeakMap<ConfigPackageV3,CategorySearchIndex>>();
export function categorySearchIndex(config:ConfigPackageV3,records:FeatureRecord[]):CategorySearchIndex {
  const existing=cache.get(records)?.get(config);if(existing)return existing;
  const result:CategorySearchIndex={entries:[],byRecord:new WeakMap(),ids:new Map()};
  for(const [order,record] of records.entries()){
    if(record.featureInfo?.__disabled||(record.meta as unknown as {disabled?:boolean}).disabled)continue;
    const id=recordId(record),key=`${recordWorld(record)}/${id}`;
    if(id){const matches=result.ids.get(key)??[];matches.push(record);result.ids.set(key,matches);}
    const path=recordPath(record),search=resolveNodeFieldSettings(config,path).value.search??defaultSearch;
    if(!search.enabled)continue;
    const name=getRuleDisplayName(record),fields=resolveEffectiveFields(config,path);
    const hay=search.queryFields.map(field=>{
      const value=recordValue(record,field),definition=fields.find(row=>row.key===field);
      const labels=(Array.isArray(value)?value:[value]).flatMap(value=>{const row=definition?.options?.find(row=>row.value===String(value));return row?[row.label.zh,row.label.en]:[];});
      return [field==='Name'?`${name.name} ${name.rawName}`:field==='ID'?name.idValue:text(value),...labels].join(' ');
    }).join(' ').toLowerCase();
    const entry={record,search,hay,priority:search.priority??100,order};result.entries.push(entry);result.byRecord.set(record,entry);
  }
  if(Object.isFrozen(config)){let configs=cache.get(records);if(!configs){configs=new WeakMap();cache.set(records,configs);}configs.set(config,result);}return result;
}
export function categorySearchSubtitle(config:ConfigPackageV3,index:CategorySearchIndex,entry:Entry,locale:'zh'|'en'='zh'):string {
  const {record,search}=entry,spec=search.subtitle,path=recordPath(record),nodes=resolveCategoryNodes(config,path);
  const last=nodes[nodes.length-1],node=last&&classificationPathKey(last.path)===classificationPathKey(path)?last:nodes[0],level=node?(['skind2','skind','kind','class'] as const).find(level=>node.path[level]):undefined;
  const override=spec.classificationLabel,fallback=spec.fallbackClassificationLabel,useFallback=(!path.kind||!last||classificationPathKey(last.path)!==classificationPathKey(path))&&fallback&&(fallback.zh||fallback.en);
  const classification=override&&(override.zh||override.en)?override[locale]:useFallback?fallback[locale]:node&&level?node.classificationLabels?.[level]?.[locale]??String(node.path[level]??''):'';
  if(spec.mode==='classification')return classification;
  const value=spec.field?recordValue(record,spec.field):undefined;let display=text(value);
  if(spec.valueMode==='meaning')display=spec.valueOptions?.find(row=>row.value===String(value))?.label[locale]??'';
  if(spec.valueMode==='reference'){
    const matches=value===undefined||value===null?[]:index.ids.get(`${recordWorld(record)}/${String(value).trim()}`)??[];
    display=matches.length===1?text(recordValue(matches[0],spec.referenceDisplayField??'Name')):'';
  }
  return spec.mode==='field'?display:classification&&display?`${classification}(${display})`:classification||display;
}
export function findCategorySearchEntries(config:ConfigPackageV3,records:FeatureRecord[],world:string,query:string):Entry[]{
  const index=categorySearchIndex(config,records),key=normalizeRuleSourceWorldId(world),needle=query.trim().toLowerCase();
  return index.entries.filter(entry=>recordWorld(entry.record)===key&&(!needle||entry.hay.includes(needle))).sort((a,b)=>a.priority-b.priority||a.order-b.order);
}
