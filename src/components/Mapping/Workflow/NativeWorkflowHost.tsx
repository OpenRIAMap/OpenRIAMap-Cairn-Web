import { NativeDrawingSession } from './nativeDrawingSession';
import {bindExternalCaptureBridge} from './externalCaptureBridge';
import {assertStructureTargets} from '@/configStudio/structureCommit';
import {isQuickMappingWorkflow} from '@/configStudio/workflowEditing';
import { drawingKey, enabledDrawing } from '@/configStudio/workflowDrawing';
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
  const worldMismatch = normalizeV3WorldId(bridge.getCurrentWorldId()) !== snapshot.world;
  const bridgeRef = useRef(bridge); bridgeRef.current = bridge;
  const [session] = useState(()=>new NativeDrawingSession(()=>bridgeRef.current,snapshot.workflow));
  const [drawingRevision,setDrawingRevision]=useState(0);
  useEffect(()=>bridge.subscribeDrawingChanges?.(()=>setDrawingRevision(value=>value+1)),[bridge.subscribeDrawingChanges]);
  useEffect(()=>{session.setWorldMismatch(worldMismatch);},[session,worldMismatch]);
  useEffect(()=>()=>{session.stop();},[session]);
  const exit=()=>{session.stop();onExit();};
  const datasets = useRuleDataStore(state => state.datasets);
  const deleted = new Set(bridge.getDeleteMarkedFeatureIds?.() ?? []);
  const all = [...Object.values(datasets).flatMap(dataset => dataset.features), ...(bridge.getCommittedLayerJsonInfos?.().map(item => item.featureInfo) ?? [])];
  const records = [...new Map(all.map(raw => {
    const record = (raw.featureInfo && typeof raw.featureInfo === 'object' ? raw.featureInfo : raw) as MountedFeatureRecord;
    return [`${record.World}:${record.Class}:${record.Kind ?? ""}:${record.SKind ?? record.Skind ?? ""}:${record.SKind2 ?? record.Skind2 ?? ""}:${record.ID}`, record] as const;
  })).values()].filter(record => !deleted.has(String(record.ID ?? '')));
  const switchStep=useCallback((step:WorkflowStep|undefined)=>{session.switchPage(step);},[session]);
  const previewSlots = useCallback((slots: Record<string, unknown>) => {
    for(const step of snapshot.workflow.steps.filter(step=>step.kind==='geometry'))if(!enabledDrawing(step,snapshot.workflow,slots))session.invalidate(drawingKey(step));
    const actor = String(slots.actor ?? '');
    if (bridgeRef.current.getEditorId() !== actor) bridgeRef.current.setEditorId(actor);
  }, []);
  if(!isQuickMappingWorkflow(snapshot.workflow))return <p role="alert">此方案专供编辑或已关闭便捷测绘，不能从采集入口执行。</p>;
  if (snapshot.workflow.mode === 'external') {
    const key = { railwayWorkflow: 'railway', stationWorkflow: 'station', tradePointWorkflow: 'trp_point' }[snapshot.workflow.external?.componentKey ?? ''] as WorkflowKey | undefined;
    return key ? <div>{worldMismatch ? <p role="alert">请返回 {snapshot.world} 后继续此工作流。<button type="button" onClick={exit}>退出工作流</button></p> : null}<fieldset disabled={worldMismatch}><WorkflowHost workflowKey={key} bridge={bindExternalCaptureBridge(bridge,snapshot.config,snapshot.workflow)} registry={registry} onExit={exit} /></fieldset></div> : <p role="alert">外部工作流未获得受控绑定。</p>;
  }
  return <div>{worldMismatch ? <p role="alert" className="mb-2 rounded border border-amber-300 bg-amber-50 p-2 text-sm">此工作流属于 {snapshot.world}。请返回原世界继续，或退出后重新开始。</p> : null}<button type="button" className="mb-2 rounded border px-2 py-1 text-xs" onClick={exit}>退出工作流</button><fieldset disabled={worldMismatch}><V3WorkflowRunner config={snapshot.config} workflow={snapshot.workflow} records={records} worldId={snapshot.world} initialActor={bridge.getEditorId()} activeDrawingKey={session.active} drawingRevision={drawingRevision} drawingPaused={session.paused}
    onInvalidateGeometry={id=>bridgeRef.current.clearWorkflowPreview(`native:${id}`)}
    onPreviewGeometry={(id,geometry)=>bridgeRef.current.upsertWorkflowPreview(`native:${id}`,geometry.type==='Point'?'point':geometry.type==='LineString'?'polyline':'polygon',[],undefined,geometry)}
    onStepChange={switchStep} onPreviewSlotsChange={previewSlots}
    onRequestGeometry={(outputId, geometry, options) => {
      session.activate(outputId,geometry,true,Boolean(options?.newPart));
    }}
    onCaptureGeometry={(outputId, geometry) => {
      if(normalizeV3WorldId(bridgeRef.current.getCurrentWorldId())!==snapshot.world)throw new Error('请返回原世界并重新进入绘制。');
      const rawPoints=session.capture(outputId);
      if(!rawPoints)throw new Error('此绘制尚未采集有效坐标。');
      const task=snapshot.workflow.steps.find(step=>step.kind==='geometry'&&drawingKey(step)===outputId);
      const selected=geometry==='Point'&&snapshot.config.contractRevision<8&&task?.geometryRole!=='auxiliary'?rawPoints.slice(-1):rawPoints;
      const coords=selected.map(point=>({x:point.x,y:point.y??-64,z:point.z}));
      const rawPoint=selected[0];session.drafts.set(outputId,selected.map(point=>({...point})));
      if(coords.length>=(geometry==='Point'?1:geometry==='LineString'?2:3))bridgeRef.current.upsertWorkflowPreview(`native:${outputId}`,geometry==='Point'?'point':geometry==='LineString'?'polyline':'polygon',coords);
      return {coordinates:coords,point:rawPoint?{x:rawPoint.x,y:rawPoint.y,z:rawPoint.z}:undefined};
    }}
    onSubmit={outputs => { if (normalizeV3WorldId(bridgeRef.current.getCurrentWorldId()) !== snapshot.world) throw new Error('当前世界与工作流坐标不一致。');const latest=[...Object.values(useRuleDataStore.getState().datasets).flatMap(dataset=>dataset.features),...(bridgeRef.current.getCommittedLayerJsonInfos?.().map(item=>item.featureInfo)??[])].map(raw=>(raw.featureInfo&&typeof raw.featureInfo==='object'?raw.featureInfo:raw) as MountedFeatureRecord);const removed=new Set(bridgeRef.current.getDeleteMarkedFeatureIds?.()??[]);assertStructureTargets(snapshot.config,outputs.map(output=>output.record),latest.filter(record=>!removed.has(String(record.ID??''))));onCommit(snapshot.config, snapshot.workflow, outputs); exit(); }}
  /></fieldset></div>;
}
