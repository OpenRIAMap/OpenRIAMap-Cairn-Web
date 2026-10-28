import {NativeDrawingPreviews} from './nativeDrawingPreviews';
import {externalRolePaths} from '@/configStudio/externalBindings';
import {EXTERNAL_COMPONENT_ROLES,EXTERNAL_ROLES} from '@/configStudio/externalCapabilities';
import {workflowCategoryOptions} from '@/configStudio/workflowCategoryOptions';
import type {ClassificationPath} from '@/configStudio/types';
import type {RailCaptureRole} from '@/configStudio/externalCapturePaths';
import { NativeDrawingSession } from './nativeDrawingSession';
import {bindExternalCaptureBridge} from './externalCaptureBridge';
import {assertStructureTargets} from '@/configStudio/structureCommit';
import {isQuickMappingWorkflow} from '@/configStudio/workflowEditing';
import { drawingKey, enabledDrawing, type WorkflowDrawingTarget } from '@/configStudio/workflowDrawing';
import {flattenMultipartCoordinates,firstMultipartCoordinate} from '@/core/geometry/multipartGeometry';
import { migrateWorkflowDrawings } from '@/configStudio/workflowDrawingMigration';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRuleDataStore } from '@/store/ruleDataStore';
import { V3WorkflowRunner, normalizeV3WorldId, type V3WorkflowRunResult } from '@/configStudio/V3WorkflowRunner';
import type { ConfigPackageV3, MountedFeatureRecord, WorkflowDefinition, WorkflowStep } from '@/configStudio/types';
import WorkflowHost, { type WorkflowBridge, type WorkflowKey, type WorkflowRegistry } from './WorkflowHost';

export function NativeWorkflowHost({ config, workflow, bridge, registry, onCommit, onExit }: {
  config: ConfigPackageV3; workflow: WorkflowDefinition; bridge: WorkflowBridge; registry: WorkflowRegistry;
  onCommit: (config: ConfigPackageV3, workflow: WorkflowDefinition, outputs: V3WorkflowRunResult) => void;
  onExit: () => void;
}) {
  // A running workflow cannot change underneath an author saving a new package.
  const [snapshot] = useState(() => ({ config: structuredClone(config), workflow: migrateWorkflowDrawings(workflow), world: normalizeV3WorldId(bridge.getCurrentWorldId()) }));
  const [roleSelection]=useState<{paths:Map<string,ClassificationPath>;active?:RailCaptureRole}>(()=>({paths:new Map()}));
  const worldMismatch = normalizeV3WorldId(bridge.getCurrentWorldId()) !== snapshot.world;
  const bridgeRef = useRef(bridge); bridgeRef.current = bridge;
  const [session] = useState(()=>new NativeDrawingSession(()=>bridgeRef.current,snapshot.workflow));
  const [previews]=useState(()=>new NativeDrawingPreviews(()=>bridgeRef.current));
  const syncPreviews=()=>previews.setContext(session.active,worldMismatch||session.paused,new Set([...session.drafts.keys(),...(session.active?[session.active]:[])]));
  const [drawingRevision,setDrawingRevision]=useState(0);
  useEffect(()=>bridge.subscribeDrawingChanges?.(()=>setDrawingRevision(value=>value+1)),[bridge.subscribeDrawingChanges]);
  useEffect(()=>{session.setWorldMismatch(worldMismatch);syncPreviews();},[session,previews,worldMismatch]);
  useEffect(()=>()=>{session.stop();previews.clearAll();},[session,previews]);
  const exit=()=>{session.stop();previews.clearAll();onExit();};
  const datasets = useRuleDataStore(state => state.datasets);
  const deleted = new Set(bridge.getDeleteMarkedFeatureIds?.() ?? []);
  const all = [...Object.values(datasets).flatMap(dataset => dataset.features), ...(bridge.getCommittedLayerJsonInfos?.().map(item => item.featureInfo) ?? [])];
  const records = [...new Map(all.map(raw => {
    const record = (raw.featureInfo && typeof raw.featureInfo === 'object' ? raw.featureInfo : raw) as MountedFeatureRecord;
    return [`${record.World}:${record.Class}:${record.Kind ?? ""}:${record.SKind ?? record.Skind ?? ""}:${record.SKind2 ?? record.Skind2 ?? ""}:${record.ID}`, record] as const;
  })).values()].filter(record => !deleted.has(String(record.ID ?? '')));
  const switchStep=useCallback((step:WorkflowStep|undefined,targets:Record<string,WorkflowDrawingTarget>)=>{try{session.setTargets(targets);session.switchPage(step);}finally{syncPreviews();}},[session,previews,worldMismatch]);
  const previewSlots = useCallback((slots: Record<string, unknown>) => {
    for(const step of snapshot.workflow.steps.filter(step=>step.kind==='geometry'))if(!enabledDrawing(step,snapshot.workflow,slots)){const key=drawingKey(step);session.invalidate(key);previews.clear(key);}
    const actor = String(slots.actor ?? '');
    if (bridgeRef.current.getEditorId() !== actor) bridgeRef.current.setEditorId(actor);
  }, []);
  if(!isQuickMappingWorkflow(snapshot.workflow))return <p role="alert">此方案专供编辑或已关闭便捷测绘，不能从采集入口执行。</p>;
  if (snapshot.workflow.mode === 'external') {
    const key = { railwayWorkflow: 'railway', stationWorkflow: 'station', tradePointWorkflow: 'trp_point' }[snapshot.workflow.external?.componentKey ?? ''] as WorkflowKey | undefined;
    let captureBridge:WorkflowBridge;
    try{captureBridge=bindExternalCaptureBridge(bridge,snapshot.config,snapshot.workflow,roleSelection);}catch(error){return <p role="alert">整体采集绑定无效：{error instanceof Error?error.message:String(error)}<button type="button" onClick={exit}>退出工作流</button></p>;}
    return key ? <div>{worldMismatch ? <p role="alert">请返回 {snapshot.world} 后继续此工作流。<button type="button" onClick={exit}>退出工作流</button></p> : null}<fieldset disabled={worldMismatch}>{(EXTERNAL_COMPONENT_ROLES[snapshot.workflow.external?.componentKey??'']??[]).filter(role=>role!=='tradePoint').map(role=>{const paths=externalRolePaths(snapshot.config,snapshot.workflow,role);if(paths.length<2)return null;return <label className="mb-2 block text-xs" key={role}>{EXTERNAL_ROLES[role].label}目标分类<select aria-label={EXTERNAL_ROLES[role].label+'目标分类'} className="mt-1 w-full rounded border px-2 py-1" value={roleSelection.paths.has(role)?JSON.stringify(roleSelection.paths.get(role)):''} onChange={event=>{if(event.target.value)roleSelection.paths.set(role,JSON.parse(event.target.value));else roleSelection.paths.delete(role);captureBridge.setCaptureRole?.(roleSelection.active);setDrawingRevision(value=>value+1);}}><option value="">请选择实际目标分类</option>{workflowCategoryOptions(snapshot.config,paths).map(option=><option key={option.key} value={JSON.stringify(option.path)}>{option.label}</option>)}</select></label>;})}<WorkflowHost workflowKey={key} bridge={captureBridge} registry={registry} onExit={exit} /></fieldset></div> : <p role="alert">外部工作流未获得受控绑定。</p>;
  }
  return <div>{worldMismatch ? <p role="alert" className="mb-2 rounded border border-amber-300 bg-amber-50 p-2 text-sm">此工作流属于 {snapshot.world}。请返回原世界继续，或退出后重新开始。</p> : null}<button type="button" className="mb-2 rounded border px-2 py-1 text-xs" onClick={exit}>退出工作流</button><fieldset disabled={worldMismatch}><V3WorkflowRunner config={snapshot.config} workflow={snapshot.workflow} records={records} worldId={snapshot.world} initialActor={bridge.getEditorId()} activeDrawingKey={session.active} drawingRevision={drawingRevision} drawingPaused={session.paused}
    onInvalidateGeometry={id=>previews.clear(id)}
    onPreviewGeometry={(id,geometry)=>{syncPreviews();previews.update(id,geometry);}}
    onStepChange={switchStep} onPreviewSlotsChange={previewSlots}
    onRequestGeometry={(outputId, geometry) => {
      session.activate(outputId,geometry);syncPreviews();
    }}
    onCaptureGeometry={(outputId, geometry) => {
      if(normalizeV3WorldId(bridgeRef.current.getCurrentWorldId())!==snapshot.world)throw new Error('请返回原世界并重新进入绘制。');
      const draft=session.capture(outputId);
      if(draft.geometry.type!==geometry)throw new Error('当前完整草稿与绘制页几何类型不一致。');
      const point=draft.point??firstMultipartCoordinate(draft.geometry)??undefined;
      return {geometry:draft.geometry,coordinates:flattenMultipartCoordinates(draft.geometry),point};
    }}
    onSubmit={outputs => {
      if(normalizeV3WorldId(bridgeRef.current.getCurrentWorldId())!==snapshot.world)throw Error('当前世界与工作流坐标不一致。');
      if(bridgeRef.current.prepareDrawingTransition?.()===false)throw Error('请先完成或关闭当前坐标编辑工具，再确认保存。');
      const latest=[...Object.values(useRuleDataStore.getState().datasets).flatMap(dataset=>dataset.features),...(bridgeRef.current.getCommittedLayerJsonInfos?.().map(item=>item.featureInfo)??[])].map(raw=>(raw.featureInfo&&typeof raw.featureInfo==='object'?raw.featureInfo:raw) as MountedFeatureRecord);
      const removed=new Set(bridgeRef.current.getDeleteMarkedFeatureIds?.()??[]);
      assertStructureTargets(snapshot.config,outputs.map(output=>output.record),latest.filter(record=>!removed.has(String(record.ID??''))));
      onCommit(snapshot.config,snapshot.workflow,outputs);exit();
    }}
  /></fieldset></div>;
}
