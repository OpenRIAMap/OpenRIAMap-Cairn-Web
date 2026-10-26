import type {ClassificationPath,ConfigPackageV3,WorkflowDefinition} from './types';
import {resolveGeometryProfile} from './runtime';
import {externalSingleRolePath} from './externalBindings';
import {RAIL_ROLE_KEYS} from './externalCapabilities';
export type RailCaptureRole='RLE'|'STA'|'PLF'|'PFB'|'STB'|'SBP'|'STF';
const roleByFormat:Record<string,RailCaptureRole>={'铁路':'RLE','车站':'STA','站台':'PLF','站台轮廓':'PFB','车站建筑':'STB','车站建筑点':'SBP','车站建筑楼层':'STF'};
const roles:Record<string,readonly string[]>={railwayWorkflow:['RLE'],stationWorkflow:['STA','PLF','PFB','STB','SBP','STF'],tradePointWorkflow:['TRP']};
const key=(path:ClassificationPath)=>[path.class,path.kind,path.skind,path.skind2].filter(Boolean).join('/');
const exists=(config:ConfigPackageV3,path:ClassificationPath)=>config.nodes.some(node=>key(node.path)===key(path));
/** Choosing a registered component is an explicit author action. Existing
 * declarations are never silently rewritten when new classes are created. */
export function preferredExternalCapturePaths(config:ConfigPackageV3,component:string):ClassificationPath[]{
 return (roles[component]??[]).map(code=>{const migrated={class:'RIL',kind:code};return code!=='TRP'&&exists(config,migrated)?migrated:{class:code};});
}
export function externalCapturePath(config:ConfigPackageV3,workflow:WorkflowDefinition,role:RailCaptureRole):ClassificationPath {
 if(config.contractRevision>=16)return externalSingleRolePath(config,workflow,RAIL_ROLE_KEYS[role]);
 const permitted=roles[workflow.external?.componentKey??'']??[];
 if(workflow.mode!=='external'||workflow.external?.purpose==='edit'||!permitted.includes(role))throw Error(`此整体采集方案未登记 ${role} 输出。`);
 const candidates=(workflow.external?.coveredClassifications??[]).filter(path=>key(path)===role||key(path)==='RIL/'+role);
 if(candidates.length!==1||!exists(config,candidates[0]))throw Error(`${role} 需要一个明确、存在的受控完整分类；当前声明为空、重复或不受支持。`);
 const path=candidates[0],geometry=role==='RLE'?'LineString':['STB','STF','PFB'].includes(role)?'Polygon':'Point';
 if(!resolveGeometryProfile(config,path,geometry)?.enabled)throw Error(`${key(path)} 未启用 ${geometry} 几何。`);
 return {...path};
}
/** The full editor's registered legacy format is still an algorithm/field
 * executor. New records use the same explicit targets as the overall capture. */
export function declaredRailFormatPath(config:ConfigPackageV3,format:string):ClassificationPath|undefined {
 const role=roleByFormat[format];if(!role)return undefined;
 const component=role==='RLE'?'railwayWorkflow':'stationWorkflow',workflow=config.workflows.find(w=>w.mode==='external'&&w.external?.componentKey===component&&w.external.purpose!=='edit');
 return workflow?externalCapturePath(config,workflow,role):undefined;
}
