import type {ConfigPackageV3,WorkflowDefinition} from '@/configStudio/types';
import type {RailCaptureRole} from '@/configStudio/externalCapturePaths';
import {classificationPathKey} from '@/configStudio/runtime';
import {categoryAllowsParts} from '@/configStudio/multipartPolicy';
import type {WorkflowBridge} from './WorkflowHost';
import {externalRolePaths} from '@/configStudio/externalBindings';
import {EXTERNAL_COMPONENT_ROLES,EXTERNAL_ROLES,RAIL_ROLE_KEYS} from '@/configStudio/externalCapabilities';
/** The frozen workflow declaration is the sole authority for output targets. */
export function bindExternalCaptureBridge(bridge:WorkflowBridge,config:ConfigPackageV3,workflow:WorkflowDefinition,selection:{paths:Map<string,import('@/configStudio/types').ClassificationPath>;active?:RailCaptureRole}={paths:new Map()}):WorkflowBridge {
 if(!EXTERNAL_COMPONENT_ROLES[workflow.external?.componentKey??''])throw Error('专用采集组件未登记。');
 for(const role of EXTERNAL_COMPONENT_ROLES[workflow.external!.componentKey])externalRolePaths(config,workflow,role);
 return {...bridge,
  getCaptureContext:()=>({config,workflow}),
  setCaptureRole:role=>{selection.active=role;if(!role){bridge.setDrawingTarget?.(undefined);return;}const key=RAIL_ROLE_KEYS[role],paths=externalRolePaths(config,workflow,key),path=selection.paths.get(key)??(paths.length===1?paths[0]:undefined);bridge.setDrawingTarget?.(path,Boolean(path&&role==='PFB'&&categoryAllowsParts(config,path,'Polygon')));},
  commitFeature:args=>{try{
   if(!args.role)throw Error('专用采集缺少业务角色。');
   const paths=externalRolePaths(config,workflow,args.role),classification=args.classification??selection.paths.get(args.role)??(paths.length===1?paths[0]:undefined);
   if(!classification||!paths.some(path=>classificationPathKey(path)===classificationPathKey(classification)))throw Error('请明确选择专用采集目标分类。');
   if(args.geometry){if(args.geometry.type!==EXTERNAL_ROLES[args.role].geometry)throw Error('专用角色与绘制类型不一致。');if(args.geometry.parts.length>1&&(args.role==='stationBuilding'||!categoryAllowsParts(config,classification,args.geometry.type)))throw Error('此专用分类禁止多部件，完整草稿保持。');}
   return bridge.commitFeature({...args,classification,configuration:config,workflowDefinition:workflow});
  }catch(error){return {ok:false,error:error instanceof Error?error.message:'整体采集目标无效。'};}},
 };
}
