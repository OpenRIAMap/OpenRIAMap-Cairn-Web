import type {FeatureRecord} from '../Rules/rendering/renderRules';
import {passLineBooleanFilters,type RailNewIndex} from '../Navigation/railNewIndex';
import {recordId} from '../../configStudio/structureRoleIndex';

export type RelatedLineToken={label:string;color:string;title:string};
export function normalizeSearchColor(value:unknown):string{const raw=String(value??'').trim(),text=/^0x/i.test(raw)?`#${raw.slice(2)}`:raw;return /^[a-f\d]{6}$/i.test(text)?`#${text}`:text;}
/** The explicit association tier replaces Class tests. Preserve the existing
 * bureau+line grouping, segment de-duplication, colours and first-seen order. */
export function relatedLineTokens(record:FeatureRecord,index:RailNewIndex|null|undefined,source:'platform'|'station'|'stationBuilding'):RelatedLineToken[]{
  if(!index)return [];
  const refs:Array<{id:string;flags?:Record<string,boolean>}>=[];
  const platform=(id:string)=>{for(const ref of index.plfs.get(id)?.lines??[])refs.push(ref);};
  const station=(id:string)=>{for(const platformId of index.stas.get(id)?.platformIds??[])platform(platformId);};
  const id=recordId(record);
  if(source==='platform')platform(id);else if(source==='station')station(id);else for(const stationId of index.buildingToStations.get(id)??[])station(stationId);
  const groups=new Map<string,Array<{name:string;prefix:string;color:string}>>();
  for(const ref of refs){if(!passLineBooleanFilters(ref.flags))continue;const line=index.rles.get(ref.id);if(!line)continue;const name=String(line.name||line.line||line.id),position=name.indexOf('线'),prefix=position>=0?name.slice(0,position+1):name,key=line.bureau&&line.line?`${line.bureau}@@${line.line}`:`id:${line.id}`,rows=groups.get(key)??[];rows.push({name,prefix,color:normalizeSearchColor(line.color)||'#999999'});groups.set(key,rows);}
  const result:RelatedLineToken[]=[],seen=new Set<string>();
  const add=(row:{prefix:string;color:string},title:string)=>{const key=`${row.prefix}@@${row.color}`;if(!seen.has(key)){seen.add(key);result.push({label:row.prefix,color:row.color,title});}};
  for(const rows of groups.values()){
    if(rows.every(row=>row.prefix===rows[0].prefix)){add(rows[0],rows.map(row=>row.name).join(' / '));continue;}
    const prefixes=new Set<string>();for(const row of rows)if(!prefixes.has(row.prefix)){prefixes.add(row.prefix);add(row,row.name);}
  }
  return result;
}
