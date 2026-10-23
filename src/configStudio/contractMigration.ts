import {CONTRACT_CAPABILITIES,formatContractRevision,isNativeConfigRevision} from './contract';
import {defaultHalo} from './halo';
import {validateNativeStructure} from './nativeContractValidation';
import {migrateC15Nodes,migrateC15Workflow} from './c15Migration';
import {syncWorkflowClassification} from './systemClassification';
import type {CategoryNode,ConfigPackageV3,GeometryKind,GeometryProfile,RenderStyle,WorkflowDefinition} from './types';

export type MigrationKind='package'|'node'|'classTree'|'workflow';
export type MigrationChange={id:string;kind:'default'|'converted'|'removed'|'optional'|'unresolved';component:string;path:string;message:string;before?:unknown;after?:unknown};
export type MigrationReport={schemaVersion:'cairnmap.contract-migration.v1';source:number;target:number;steps:string[];migratorVersion:string;changes:MigrationChange[];dismissed:string[];sourceSha256?:string;resultSha256?:string};
type Document={contractRevision:number;nodes?:CategoryNode[];workflow?:WorkflowDefinition;workflows?:WorkflowDefinition[]};
export type MigrationStep={from:number;to:number;kinds:readonly MigrationKind[];apply:(document:Document,changes:MigrationChange[],context?:ConfigPackageV3)=>void};
const change=(changes:MigrationChange[],path:string,after:unknown)=>changes.push({id:`c13-c14:${path}`,kind:'default',component:'render',path,message:'新增必填 Halo 设置，默认关闭以保留原显示。',after:structuredClone(after)});

/** Same component transform is used by full packages, node and Class-tree imports.
 * Partial condition styles intentionally inherit the parent halo. */
export function addC14ProfileDefaults(profile:GeometryProfile,geometry:GeometryKind,changes:MigrationChange[]=[],root="geometryProfile"):void {
  const style=(value:RenderStyle,at:string,geometry:GeometryKind,point:boolean,partial:boolean)=>{
    const set=(host:{halo?:import('./types').HaloSettings},path:string)=>{if(!host.halo){host.halo=defaultHalo();change(changes,path,host.halo);}};
    const symbol=value.pointSymbol;
    if(symbol){
      if(symbol.kind==='shape')set(symbol.shape,at+'/pointSymbol/shape/halo');
      else {
        set(symbol.fallback,at+'/pointSymbol/fallback/halo');
        if(symbol.kind==='icon'){
          if(symbol.icon.mode==='single')set(symbol.icon.item,at+'/pointSymbol/icon/item/halo');
          else symbol.icon.entries.forEach((row,i)=>set(row.item,`${at}/pointSymbol/icon/entries/${i}/item/halo`));
        }else if(symbol.image.mode==='valueMap')symbol.image.entries.forEach((row,i)=>set(row.presentation,`${at}/pointSymbol/image/entries/${i}/presentation/halo`));
        else set(symbol.image.presentation,at+'/pointSymbol/image/presentation/halo');
      }
    } else if(!partial&&!point&&geometry!=='Point')set(value,at+'/halo');
  };
  for(const rule of profile.zoomPriority.rules){
    const at=`${root}/rules/${rule.id}/style`;
    const point=geometry==='Point'||rule.representation==='point';
    if(rule.style||(!point&&rule.representation!=='hidden'&&rule.representation!=='labelOnly')){
      rule.style??={};style(rule.style,at,geometry as GeometryKind,point,rule.representation==='hidden'||rule.representation==='labelOnly');
    }
    for(const branch of rule.conditionalOverrides??[])if(branch.style)style(branch.style,`${at}/conditionalOverrides/${branch.id}`,geometry as GeometryKind,branch.representation==='point'||point,true);
  }
}

export function addC14NodeDefaults(nodes:CategoryNode[],changes:MigrationChange[]=[]):void {
  for(const node of nodes)for(const [geometry,profile] of Object.entries(node.geometryProfiles))if(profile)addC14ProfileDefaults(profile,geometry as GeometryKind,changes,`nodes/${node.nodeId}/geometryProfiles/${geometry}`);
}

export const MIGRATION_STEPS:readonly MigrationStep[]=[{
  from:13,to:14,kinds:['package','node','classTree','workflow'],
  apply(document,changes){
    if(document.nodes)addC14NodeDefaults(document.nodes,changes);
    changes.push({id:'c13-c14:identity',kind:'converted',component:document.workflow?'workflow':'contract',path:'contractRevision',message:'c13 → c14；未变化的字段、工作流、信息卡及全局规则保持原值。',before:13,after:14});
  },
},{
  from:14,to:15,kinds:['package','node','classTree','workflow'],
  apply(document,changes,context){
    if(document.nodes)migrateC15Nodes(document.nodes,changes);
    const config='schemaVersion' in document&&document.schemaVersion==='cairnmap.config-package.v3'?document as ConfigPackageV3:context;
    for(const workflow of document.workflow?[document.workflow]:document.workflows??[])migrateC15Workflow(workflow,config,changes);
    if(config){const target={...config,contractRevision:15 as const};if(document.workflow)document.workflow=syncWorkflowClassification(target,document.workflow);if(document.workflows)document.workflows=document.workflows.map(workflow=>syncWorkflowClassification(target,workflow));}
  },
}];

/** Injected registries are for window/chain tests; production always uses known capabilities. */
export function migrationChain(source:number,target:number,kind:MigrationKind,steps:readonly MigrationStep[]=MIGRATION_STEPS,known:readonly number[]=CONTRACT_CAPABILITIES.native):MigrationStep[]{
  if(!known.includes(source)||!known.includes(target))throw Error(`未知契约：${formatContractRevision(source)} → ${formatContractRevision(target)}。`);
  if(source>target)throw Error('不支持契约降级，请先明确升级当前工作稿。');
  if(source<Math.max(CONTRACT_CAPABILITIES.migration.baseline,target-CONTRACT_CAPABILITIES.migration.previousVersions))throw Error('来源超出自动迁移窗口；请使用受支持的完整包历史迁移工具。');
  const result:MigrationStep[]=[];
  for(let version=source;version<target;version++){
    const matches=steps.filter(step=>step.from===version&&step.to===version+1&&step.kinds.includes(kind));
    if(matches.length!==1)throw Error(`缺少或重复的 ${formatContractRevision(version)} → ${formatContractRevision(version+1)} ${kind} 迁移步骤。`);
    result.push(matches[0]);
  }
  return result;
}
export function migrateContract<T extends Document>(input:T,target:number,kind:MigrationKind,context?:ConfigPackageV3):{document:T;report:MigrationReport}{
  const chain=migrationChain(input.contractRevision,target,kind),document=structuredClone(input),changes:MigrationChange[]=[];
  const full=(value:Document)=>'schemaVersion' in value&&value.schemaVersion==='cairnmap.config-package.v3';
  const check=(value:Document)=>{
    // Validate fragments at every hop with the same strict node/workflow shapes.
    // Their real dependency and business checks still run against the destination
    // package; this wrapper must not invent project bindings for a fragment.
    const shape=full(value)?value:{schemaVersion:'cairnmap.config-package.v3',packageId:'migration-structure',projectId:'migration-structure',revision:0,displayName:{zh:'',en:''},contractRevision:value.contractRevision,registries:{cardLayouts:[],cardComponents:[],displayProfiles:[],specialDisplayLogic:[],workflowControls:[],workflowBlocks:[]},nodes:value.nodes??[],workflows:value.workflow?[value.workflow]:[]};
    const issues=validateNativeStructure(shape);if(issues.length)throw Error(issues.map(issue=>`${issue.path}：${issue.message}`).join('\n'));
  };
  check(document);
  for(const step of chain){step.apply(document,changes,context);document.contractRevision=step.to;check(document);}
  return {document,report:{schemaVersion:'cairnmap.contract-migration.v1',source:input.contractRevision,target,steps:chain.map(step=>`c${step.from} → c${step.to}`),migratorVersion:'c15-1',changes,dismissed:[]}};
}
export function migratePackageToContract(input:ConfigPackageV3,target:number=CONTRACT_CAPABILITIES.latest){
  if(!isNativeConfigRevision(input.contractRevision))throw Error('未知契约，不能升级。');
  const result=migrateContract(input,target,'package');
  return {config:result.document,report:result.report};
}
/** Stable historical entrypoint: adding c15 must not change what "to c14" means. */
export const migratePackageToC14=(input:ConfigPackageV3)=>migratePackageToContract(input,14);
export const migratePackageToC15=(input:ConfigPackageV3)=>migratePackageToContract(input,15);
