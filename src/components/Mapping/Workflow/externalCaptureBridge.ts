import type {ConfigPackageV3,WorkflowDefinition} from '@/configStudio/types';
import {externalCapturePath,type RailCaptureRole} from '@/configStudio/externalCapturePaths';
import {categoryAllowsParts} from '@/configStudio/multipartPolicy';
import type {WorkflowBridge} from './WorkflowHost';
const roleFor:Record<string,RailCaptureRole>={'铁路':'RLE','车站':'STA','站台':'PLF','站台轮廓':'PFB','车站建筑':'STB','车站建筑点':'SBP','车站建筑楼层':'STF'};
/** The frozen workflow declaration is the sole authority for output targets. */
export function bindExternalCaptureBridge(bridge:WorkflowBridge,config:ConfigPackageV3,workflow:WorkflowDefinition):WorkflowBridge {
 if(!['railwayWorkflow','stationWorkflow'].includes(workflow.external?.componentKey??''))return bridge;
 for(const role of workflow.external?.componentKey==='railwayWorkflow'?['RLE'] as const:['STA','PLF','PFB','STB','SBP','STF'] as const)externalCapturePath(config,workflow,role);
 return {...bridge,
  setCaptureRole:role=>{if(!role){bridge.setDrawingTarget?.(undefined);return;}const path=externalCapturePath(config,workflow,role);bridge.setDrawingTarget?.(path,role==='PFB'&&categoryAllowsParts(config,path,'Polygon'));},
  commitFeature:args=>{try{const role=roleFor[args.subType];if(!role)throw Error('整体铁路工作流尝试输出未登记的要素类型。');const classification=externalCapturePath(config,workflow,role);if(role==='STB'&&args.geometry&&args.geometry.parts.length>1)throw Error('车站建筑仅允许一个面部件；请修正完整几何，不能自动截断。');return bridge.commitFeature({...args,classification,configuration:config});}catch(error){return {ok:false,error:error instanceof Error?error.message:'整体采集目标无效。'};}},
 };
}
