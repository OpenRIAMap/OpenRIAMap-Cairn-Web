import type {ClassificationPath,ConfigPackageV3,MountedFeatureRecord,SearchProfile} from '../configStudio/types';
import {classificationPathKey,pathMatchesScope} from '../configStudio/runtime';
import {findV3SearchCandidates} from '../configStudio/workflowKernel';
import {recordCategory} from '../configStudio/multipartPolicy';
/** Explicit project migration aliases for READ scopes only. These never change
 * records, rendered classifications, output routing, or validation eligibility. */
function migrated(path:ClassificationPath):ClassificationPath|undefined {
 const {class:c,kind:k,skind:s,skind2:t}=path;
 if(['RLE','PLF','PFB','STA','STB','SBP','STF','TPP','WRP'].includes(c))return {class:['TPP','WRP'].includes(c)?'TPT':'RIL',kind:c,...(k?{skind:k}:{}),...(s?{skind2:s}:{})};
 if(['BUD','FLR'].includes(c)&&k&&s===k&&!t)return {class:c,kind:k};
 if(c==='ISG'&&k==='NGF'){
  if(s==='LAD'&&t)return ['PEN','IST'].includes(t)?{class:'NGF',kind:'LIS',skind:'LAG',skind2:t}:{class:'NGF',kind:'LAD',skind:t};
  if(s==='LIS'&&t)return {class:'NGF',kind:'LIS',skind:'LAG',skind2:t};
  if(s==='WTB'&&t)return {class:'NGF',kind:'WTR',skind:'LWB',skind2:t};
 }
 if(c==='ISL'&&k==='NGF'&&t){if(s==='BOD')return {class:'NGF',kind:'LIS',skind:'LAL',skind2:t};if(s==='WTR')return {class:'NGF',kind:'WTR',skind:'WTL',skind2:t};}
 if(c==='ISP'&&k==='NGF'&&s==='SCP'&&t==='SPP')return {class:'NGF',kind:'LIS',skind:'LAP',skind2:t};
 if(k==='ADM'&&t){
  if(c==='ISG'&&['DBZ','PLZ'].includes(s??''))return {class:'ADM',kind:'DBZ',skind:s==='PLZ'&&['L1','L2','L3'].includes(t)?'U'+t:t};
  if(c==='ISL'&&['DBL','PLL'].includes(s??''))return {class:'ADM',kind:'DBL',skind:t};
  if(c==='ISP'&&['DBP','PLP'].includes(s??''))return {class:'ADM',kind:'DBP',skind:t};
 }
 return undefined;
}
const cache=new WeakMap<ConfigPackageV3,Map<string,ClassificationPath[]>>();
function aliases(config:ConfigPackageV3):Map<string,ClassificationPath[]>{
 const cached=cache.get(config);if(cached)return cached;
 const paths=new Set(config.nodes.map(node=>classificationPathKey(node.path))),result=new Map<string,ClassificationPath[]>();
 const add=(a:ClassificationPath,b:ClassificationPath)=>result.set(classificationPathKey(a),[...result.get(classificationPathKey(a))??[],b]);
 for(const node of config.nodes){const target=migrated(node.path);if(target&&paths.has(classificationPathKey(target))){add(node.path,target);add(target,node.path);}}
 cache.set(config,result);return result;
}
export function matchesClassificationReadScope(config:ConfigPackageV3|undefined,path:ClassificationPath,scope:ClassificationPath):boolean {
 return pathMatchesScope(path,scope)||Boolean(config&&aliases(config).get(classificationPathKey(path))?.some(alias=>pathMatchesScope(alias,scope)));
}
export function isExactClassificationMigrationAlias(config:ConfigPackageV3,from:ClassificationPath,to:ClassificationPath):boolean {
 return Boolean(aliases(config).get(classificationPathKey(from))?.some(path=>classificationPathKey(path)===classificationPathKey(to)));
}
/** Filter to the exact compatible set first, then reuse the existing matcher,
 * world restriction, order, limit and value extraction on original records. */
export function findCompatibleSearchCandidates(records:MountedFeatureRecord[],profile:SearchProfile|undefined,query:string,world?:string,config?:ConfigPackageV3){
 if(!config||!profile||profile.targetRole)return findV3SearchCandidates(records,profile,query,world,config);
 const selected=records.filter(record=>matchesClassificationReadScope(config,recordCategory(record),profile.target));
 return findV3SearchCandidates(selected,{...profile,target:{class:''}},query,world,config);
}
