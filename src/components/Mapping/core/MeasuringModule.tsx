import {recordsAfterExactDeletes} from '@/configStudio/nativeRecordSubmission';
import {prepareSpecializedCapture} from '@/configStudio/nativeRecordSubmission';
import {categoryAllowsParts,recordCategory} from '@/configStudio/multipartPolicy';
import {ExternalFeatureEditHost} from '../Workflow/ExternalFeatureEditHost';
import {createTrpExternalEditSession,prepareTrpExternalEdit,type TrpExternalEditSession} from '@/configStudio/trpExternalEditing';
import {prepareDownstreamNativeImport} from '../Workflow/downstreamNativeImport';
import {NativeWorkflowEditPanel} from '../Workflow/NativeWorkflowEditPanel';
import {compileWorkflowEditPlan,reverseWorkflowEditEndpoints,hydrateWorkflowEdit,findEditingWorkflow,isQuickMappingWorkflow,type WorkflowEditPlan,type WorkflowEditDraft} from '@/configStudio/workflowEditing';
import {prepareNativeWorkflowEdit} from '@/configStudio/workflowEditCommit';
import {normalizeV3WorldId} from '@/configStudio/V3WorkflowRunner';
import {useRuleDataStore} from '@/store/ruleDataStore';
import { NativeWorkflowHost } from '../Workflow/NativeWorkflowHost';
import { prepareNativeWorkflowCommit } from '@/configStudio/nativeWorkflowCommit';
import { validateConfigPackage,resolveGeometryProfile } from '@/configStudio/runtime';
import type { ClassificationPath,ConfigPackageV3, WorkflowDefinition } from '@/configStudio/types';
import type { V3WorkflowRunResult } from '@/configStudio/V3WorkflowRunner';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState, type ChangeEvent, type RefObject, useCallback } from 'react';
import { createPortal } from 'react-dom';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';


import {layerToJsonText,type FeatureKey,type DrawMode} from '@/components/Common/featurePrimitives';
import {mergeEditorDraftIntoFeatureInfo,type WorkflowEditorDraftValues,type WorkflowEditorUnparsedEntry} from '@/components/Common/workflowEditorParser';
import type {ProjectedRegistryScene} from '@/components/Common/formProjection';
import {CategoryPathPicker} from '@/configStudio/CategoryPathPicker';
import {classificationPathKey,workflowPathLabel,pathMatchesScope,resolveEffectiveFields} from '@/configStudio/runtime';
import {fullEditorWorkflow,initializeFullEditor,prepareFullEditorCreate} from '@/configStudio/fullEditor';
import {specializedFormView} from '../Workflow/specialized/registration';
import {externalRolePaths} from '@/configStudio/externalBindings';
import {EXTERNAL_COMPONENT_ROLES} from '@/configStudio/externalCapabilities';
import type {ExternalRole} from '@/configStudio/types';
import {prepareNativeRecordCreate} from '@/configStudio/nativeRecordSubmission';
import {prepareMergeDraft,type DraftBundle} from '../Special/NativeMergeForm';

import WorkflowStyleEditPanel from '@/components/Mapping/Editor/WorkflowStyleEditPanel';


import type { DynmapProjection } from '@/lib/DynmapProjection';
import { DraggablePanel } from '@/components/DraggablePanel/DraggablePanel';
import { useDesktopWindowStackLayer } from '@/components/DraggablePanel/desktopWindowStack';
import BlockingFullscreenModal from '@/components/Common/BlockingFullscreenModal';
import { EyeOff, MousePointerClick, Pencil, Upload, Trash2, X } from 'lucide-react';
import ToolIconButton from '@/components/Toolbar/ToolIconButton';

import { buildZipStore } from '@/lib/zipStore';
import { stringifyFeatureJson, stringifyFeatureJsonArray } from '@/components/Common/featureJsonSerializer';
import {
  countActiveRelayPictures,
  createEmptyRelayPackageDraft,
  relayDraftShowsMeta,
  relayDraftStatusLabel,
  type RelayPackageDraft,
  type RelayPackageDraftStatus,
} from '@/components/Mapping/core/relayPackageDraft';
import { buildRelayPackageZip, resolveRelayPackageWorldId } from '@/components/Mapping/core/relayPackageSerializer';
import { materializeRiaReviewPackageForWorkspace } from '@/components/Mapping/core/relayPackageParser';
import type { MinimalFeatureEditPackage } from '@/components/Mapping/core/minimalFeatureEditPackage';
import RelayPackageExportPanel from '@/components/Mapping/panels/RelayPackageExportPanel';
import DeleteFeatureSelectionPanel, { type DeletePanelItem } from '@/components/Mapping/panels/DeleteFeatureSelectionPanel';
import DeleteFeaturePickPanel from '@/components/Mapping/panels/DeleteFeaturePickPanel';
import FeaturePictureBindingPanel from '@/components/Mapping/panels/FeaturePictureBindingPanel';
import { pickIdFieldValue, type FeatureRecord } from '@/components/Rules/rendering/renderPrimitives';
import {
  multipartGeometryFromSinglePath,
  readMultipartGeometry,
  validateMultipartHoleDraft,
  validateMultipartGeometry,
  type MultipartGeometry,
  type MultipartGeometryKind,
} from '@/core/geometry/multipartGeometry';
import { removeMultipartInnerSpaceAt, removeMultipartPartAt } from '@/core/geometry/multipartEditorState';
import { makeLabelDivIcon } from '@/components/Rules/rendering/labelStyles';
import { rebuildRoadGraphCacheForWorld } from '@/components/Navigation/Navigation_Road';
import { rebuildRailNewIndexCacheForWorld } from '@/components/Navigation/railNewIndex';
import { rebuildRailNewNavigationCacheForWorld } from '@/components/Navigation/Navigation_RailNewIntegrated';
import { rebuildTeleportNewCacheForWorld } from '@/components/Navigation/Navigation_TeleportNewIntegrated';
import {
  clearTemporaryRuleSession,
  readTemporaryRuleDeleteIds,
  readTemporaryRuleOverrideIds,
  readTemporaryRuleSources,
  writeTemporaryRuleDeleteIds,
  writeTemporaryRuleOverrideIds,
  writeTemporaryRuleSources,
} from '@/components/Rules/data/temporaryRuleSession';

import ControlPointsT, { type ControlPointsTHandle } from '@/components/Mapping/tools/ControlPointsT';


import AssistLineTools, {
  type AssistLineToolsHandle,
} from '@/components/Mapping/tools/AssistLineTools';

import GridSnapModeSwitch, {
  formatGridNumber,
  snapWorldPointByMode,
} from '@/components/Mapping/tools/GridSnapModeSwitch';

import ManualPointInput from '@/components/Mapping/tools/ManualPointInput';

import CurveInputT, { type CurveInputTHandle } from '@/components/Mapping/tools/CurveInputT';

import MergePointPlatformStation, {
  type MergePointPlatformStationDraft,
} from '@/components/Mapping/Special/MergePointPlatformStation';

import MergePolygonOutlineBuilding, {
  type MergePolygonOutlineBuildingDraft,
} from '@/components/Mapping/Special/MergePolygonOutlineBuilding';

import RailwayDirectionReverseButton from '@/components/Mapping/Special/RailwayDirectionReverseButton';

import WorkflowHost, {
  type WorkflowBridge,
  type WorkflowCommitArgs,
  type WorkflowKey,
  type WorkflowPreviewKind,
  type WorkflowPreviewStyle,
  type WorkflowRegistry,
  type WorldPoint,
} from '@/components/Mapping/Workflow/WorkflowHost';
import RailwayWorkflow from '@/components/Mapping/Workflow/RailwayWorkflow';
import StationWorkflow from '@/components/Mapping/Workflow/StationWorkflow';
import TradePointWorkflow from '@/components/Mapping/Workflow/TradePointWorkflow';
import AppButton from '@/components/ui/AppButton';
import AppCard from '@/components/ui/AppCard';
import type { ReviewInboxItem } from '@/components/Review/reviewStatusTypes';
import type { ReviewPackageSession } from '@/components/Review/reviewPackageSession';
import type { ReviewPackageUploadPort } from '@/components/Review/contracts';

import {
  checkTempMountIdConflictsDetailed,
  type TempLayerIdCandidate,
} from '@/components/Rules/data/globalIdIndex';



/**
 * 关键：把 MapContainer 里的引用对象（ref）当 props 传进来
 * 这属于 React 组件间通过 props 传值的常规做法。:contentReference[oaicite:1]{index=1}
 */
export type MeasuringModuleProps = {
  configRuntime?: ConfigPackageV3;
  /** Lab allows local package export while suppressing remote upload. */
  disablePackageUpload?: boolean;
  mapReady: boolean;
  leafletMapRef: React.MutableRefObject<L.Map | null>;
  projectionRef: React.MutableRefObject<DynmapProjection | null>;

  // 当前世界（来自 MapContainer 的 currentWorld），用于自动写入 featureInfo.World
  currentWorldId: string;

  // 新增：外部强制关闭信号（MapContainer 递增）
  closeSignal?: number;

  /**
   * 外部请求打开入口下拉（用于分包首次加载后自动继续原操作）
   */
  openSignal?: number;

  // 新增：当本模块打开时通知 MapContainer 关闭别的面板
  onBecameActive?: () => void;

  // 可选：将启动按钮插入到外部工具栏
  launcherSlot?: (launcher: React.ReactNode) => React.ReactNode;

  /** The Map host owns cross-workspace admission before a mapping menu opens. */
  onRequestOpen?: () => void;

  /**
   * The fixed desktop mapping button is the public launcher after the old
   * standalone launcher was intentionally hidden. Its element still anchors
   * the mapping menu portal.
   */
  launcherAnchorRef?: RefObject<HTMLElement | null>;

  /** ReviewEditor supplies this constant only at mount time. */
  reviewWorkspace?: true;
  // ReviewWorkspace passes an immutable package session into its own mounted
  // editor instance. MappingWorkspace never supplies these Review bindings.
  reviewSession?: ReviewPackageSession | null;
  onReviewDirtyChange?: (dirty: boolean) => void;
  /** Host-owned transport for an immutable ZIP revision built from this workspace. */
  onReviewSave?: (artifact: ReviewWorkspaceSaveArtifact) => Promise<unknown>;
  /** The host clears only the active workspace; the review sequence stays open. */
  onReviewExitRequested?: () => void;
  /** App-provided transport binding for a prepared standard package. */
  onReviewPackageUpload?: ReviewPackageUploadPort['uploadPackage'];
};

export type ReviewWorkspaceSaveArtifact = {
  packageName: string;
  blob: Blob;
  summary: string;
};


function sanitizeFilenamePart(value: string): string {
  const normalized = String(value ?? '')
    .trim()
    .replace(/[\/:*?"<>|]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
  return normalized || 'unknown';
}

export type MeasuringModuleHandle = {
  /** Read-only integration surface, preserving complete native records. */
  getCommittedFeatures: () => Record<string, unknown>[];
  /**
   * 在切换世界等场景下使用：若用户取消确认，则返回 false 并阻止上层继续执行。
   * 内部会负责：先关闭“临时挂载”，再清除测绘图层并退出测绘。
   */
  requestCloseAndClear: (actionLabel?: string) => Promise<boolean>;
  /** Toggle only the fixed-entry launcher; it never resets mapping state. */
  toggleLauncherMenu: () => void;
  /**
   * Replacing an already loaded audit package never exits the audit sequence.
   * It only confirms whether the current package may be replaced; the next
   * package injection owns the actual layer reset.
   */
  confirmReviewPackageReplacement: (actionLabel?: string) => Promise<boolean>;
};

const MappingEditorCore = forwardRef<MeasuringModuleHandle, MeasuringModuleProps>((props, ref) => {
  const {
    configRuntime,
    disablePackageUpload = false,
    mapReady,
    leafletMapRef,
    projectionRef,
    currentWorldId,
    closeSignal,
    openSignal,
    onBecameActive,
    launcherSlot,
    onRequestOpen,
    launcherAnchorRef,
    reviewWorkspace,
    reviewSession = null,
    onReviewDirtyChange,
    onReviewSave,
    onReviewExitRequested,
    onReviewPackageUpload,
  } = props;
  // A core instance is created by either MappingWorkspace or ReviewEditor and
  // is keyed/remounted by the host on every boundary transition. This is a
  // construction-time capability, never a mutable runtime mode switch.
  const isReviewWorkspace = reviewWorkspace === true;
  const reviewPackageLabel = reviewSession?.packageId ?? '';
  const [reviewStatusDraft, setReviewStatusDraft] = useState<'pending' | 'approved' | 'rejected' | 'archived'>('pending');

  useEffect(() => {
    if (!isReviewWorkspace) return;
    setReviewStatusDraft('pending');
    const receive = (event: Event) => {
      const detail = (event as CustomEvent<{ submissionId?: string; state?: 'pending' | 'approved' | 'rejected' | 'archived' }>).detail;
      const submissionId = reviewSession?.submissionContext?.submissionId ?? reviewPackageLabel;
      if (!submissionId || detail?.submissionId !== submissionId || !detail.state) return;
      setReviewStatusDraft(detail.state);
    };
    window.addEventListener('cairn-review-status-draft-applied', receive);
    return () => window.removeEventListener('cairn-review-status-draft-applied', receive);
  }, [isReviewWorkspace, reviewPackageLabel, reviewSession?.submissionContext?.submissionId]);

  // Mapping previews are strictly process-local. A workspace remount (which
  // also occurs when switching to review) must not resurrect any old layer,
  // delete marker or image binding from browser storage.
  useEffect(() => () => {
    clearTemporaryRuleSession();
    window.dispatchEvent(new CustomEvent('ria-temp-rule-sources-changed'));
    window.dispatchEvent(new CustomEvent('ria-temp-rule-overrides-changed'));
    window.dispatchEvent(new CustomEvent('ria-temp-rule-deletes-changed'));
  }, []);


// ---------- 测绘 & 图层管理状态 ------------
// ---------- 测绘 & 图层管理状态 ------------
const [measuringActive, setMeasuringActive] = useState(false); // 是否开启测绘控制UI
const [drawMode, setDrawMode] = useState<'none'|'point'|'polyline'|'polygon'>('none');
const drawModeRef = useRef<'none'|'point'|'polyline'|'polygon'>('none');
useEffect(() => { drawModeRef.current = drawMode; }, [drawMode]);

const [drawColor, setDrawColor] = useState('#ff0000');         // 当前颜色
const drawColorRef = useRef('#ff0000');
useEffect(() => { drawColorRef.current = drawColor; }, [drawColor]);

const [drawing, setDrawing] = useState(false);                  // 是否正在绘制中

// 测绘交互抑制：开关开启时，仅在实际绘图添点状态下抑制规则要素普通点击。
const [featureInteractionSuppressionEnabled, setFeatureInteractionSuppressionEnabled] = useState(true);
// 工具栏显示抑制：开关开启时，未进入绘图添点状态则仅隐藏辅助工具区，不清空工具状态。
const [toolPanelDisplaySuppressionEnabled, setToolPanelDisplaySuppressionEnabled] = useState(true);

const mapDraftInputActive = measuringActive && drawing && drawMode !== 'none';
// Leaflet's listener is stable by design.  This render-synchronous reference
// is its write permit: an inactive workflow/panel can never reuse a stale
// drawing closure to create a point.
const mapDraftInputActiveRef = useRef(false);
mapDraftInputActiveRef.current = mapDraftInputActive;
const featureInteractionSuppressed = featureInteractionSuppressionEnabled && mapDraftInputActive;
const shouldShowDrawingToolPanel = !toolPanelDisplaySuppressionEnabled || mapDraftInputActive;

// 测绘入口模式：完整 / 快捷（工作流）
const [measuringVariant, setMeasuringVariant] = useState<'full'|'workflow'>('full');

// 工作流选择与运行态（快捷模式使用）
const [workflowKey, setWorkflowKey] = useState<WorkflowKey>('railway');
const [workflowRunning, setWorkflowRunning] = useState(false);
const [nativeWorkflowSnapshot, setNativeWorkflowSnapshot] = useState<{config: ConfigPackageV3; workflow: WorkflowDefinition} | null>(null);
const [nativeHostElement] = useState(() => document.createElement('div'));
useEffect(() => { if (configRuntime && !workflowRunning && !configRuntime.workflows.some(workflow => workflow.id === workflowKey&&isQuickMappingWorkflow(workflow))) setWorkflowKey((configRuntime.workflows.find(isQuickMappingWorkflow)?.id ?? '') as WorkflowKey); }, [configRuntime, workflowRunning, workflowKey]);


// 当前临时点集合（临时绘制的坐标）
// 说明：y 为可选（仅在部分 JSON 子类型需要输出 [x,y,z] 时使用；地图渲染仍使用固定 y=64）
const [tempPoints, setTempPointState] = useState<Array<{ x: number; z: number; y?: number }>>([]);
const tempPointsRef=useRef(tempPoints);
const drawingListeners=useRef(new Set<()=>void>());
const setTempPoints=useCallback((value:typeof tempPoints|((previous:typeof tempPoints)=>typeof tempPoints))=>{
  const next=typeof value==='function'?value(tempPointsRef.current):value;
  tempPointsRef.current=next;setTempPointState(next);
},[]);
useEffect(()=>{for(const listener of drawingListeners.current)listener();},[tempPoints]);

// 对外广播测绘激活态（用于禁用导航“图上选点”等交互）
useEffect(() => {
  if (typeof window !== 'undefined') {
    (window as any).__riaMeasuringActive = measuringActive;
    window.dispatchEvent(new CustomEvent('ria:measuringActiveChanged', {
      detail: { active: measuringActive, source: isReviewWorkspace ? 'ReviewWorkspace' : 'MeasuringModule' },
    }));
  }
}, [isReviewWorkspace, measuringActive]);

// 对外广播“要素交互抑制”状态。抑制只在实际绘图添点状态下生效；已有信息卡不会被强制关闭。
useEffect(() => {
  if (typeof window === 'undefined') return;

  const detail = {
    active: featureInteractionSuppressed,
    enabled: featureInteractionSuppressionEnabled,
    drawing: mapDraftInputActive,
    source: 'MeasuringModule',
  };
  (window as any).__riaFeatureInteractionSuppressed = featureInteractionSuppressed;
  window.dispatchEvent(new CustomEvent('ria:feature-interaction-suppression', { detail }));

  return () => {
    (window as any).__riaFeatureInteractionSuppressed = false;
    window.dispatchEvent(new CustomEvent('ria:feature-interaction-suppression', {
      detail: { active: false, enabled: featureInteractionSuppressionEnabled, drawing: false, source: 'MeasuringModule' },
    }));
  };
}, [featureInteractionSuppressed, featureInteractionSuppressionEnabled, mapDraftInputActive]);




// editingBackupCoordsRef 同样加 y?
const editingBackupCoordsRef = useRef<{ x: number; z: number; y?: number }[] | null>(null);
type EditorCoord = { x: number; z: number; y?: number };

/**
 * The legacy drawing tools still operate on one mutable coordinate list.  This
 * ref owns the complete multipart value; `tempPoints` is only the currently
 * selected component/ring projection of it. This keeps manual input, curves,
 * control points and undo/redo scoped to the visible selected part.
 */
const multipartDraftRef = useRef<MultipartGeometry | null>(null);
const workflowDrawingTargetRef=useRef<{path:ClassificationPath;allowParts?:boolean}|null>(null);
const [multipartEnabled, setMultipartEnabled] = useState(false);
const [multipartPanelOpen,setMultipartPanelOpen]=useState(true);
// Leaflet listeners do not participate in React's render cycle. Keep the
// mode decision in a synchronously updated ref so a click immediately after a
// UI toggle can never be interpreted as the old single-part editor.
const multipartEnabledRef = useRef(false);
const [activeMultipartPart, setActiveMultipartPart] = useState(0);
const [innerSpaceEnabled, setInnerSpaceEnabled] = useState(false);
const [editSelectedInnerSpace, setEditSelectedInnerSpace] = useState(false);
const [activeInnerSpace, setActiveInnerSpace] = useState(0);
const [showMultipartPartLabels, setShowMultipartPartLabels] = useState(false);
const [controlPointSessionBusy, setControlPointSessionBusy] = useState(false);
const [manualPointInputOpen, setManualPointInputOpen] = useState(false);
const [curveInputOpen, setCurveInputOpen] = useState(false);
const [multipartInputError, setMultipartInputError] = useState('');
const activeMultipartPartRef = useRef(0);
const innerSpaceEnabledRef = useRef(false);
const editSelectedInnerSpaceRef = useRef(false);
const activeInnerSpaceRef = useRef(0);
const showMultipartPartLabelsRef = useRef(false);
useEffect(() => { activeMultipartPartRef.current = activeMultipartPart; }, [activeMultipartPart]);
useEffect(() => { innerSpaceEnabledRef.current = innerSpaceEnabled; }, [innerSpaceEnabled]);
useEffect(() => { editSelectedInnerSpaceRef.current = editSelectedInnerSpace; }, [editSelectedInnerSpace]);
useEffect(() => { activeInnerSpaceRef.current = activeInnerSpace; }, [activeInnerSpace]);
useEffect(() => { showMultipartPartLabelsRef.current = showMultipartPartLabels; }, [showMultipartPartLabels]);

const multipartStructureLocked = showMultipartPartLabels || controlPointSessionBusy || manualPointInputOpen || curveInputOpen;




// 扩展 LayerType 定义（包含 jsonInfo）
// 扩展 LayerType 定义（包含 jsonInfo）
type LayerType = {
  id: number;
  mode: 'point' | 'polyline' | 'polygon';
  color: string;
  coords: { x: number; z: number; y?: number }[];
  visible: boolean;
  leafletGroup: L.LayerGroup;
  jsonInfo?: {
    subType: FeatureKey;
    featureInfo: any;
  };
};

const geometryKindForDrawMode = (mode: DrawMode): MultipartGeometryKind =>
  mode === 'point' ? 'Point' : mode === 'polyline' ? 'LineString' : 'Polygon';

const asMultipartCoords = (coords: EditorCoord[]) => coords.map((coord) => ({
  x: Number(coord.x),
  y: Number.isFinite(Number(coord.y)) ? Number(coord.y) : -64,
  z: Number(coord.z),
}));

const asEditorCoords = (coords: Array<{ x: number; y: number; z: number }>): EditorCoord[] =>
  coords
    .filter((coord) => Number.isFinite(coord.x) && Number.isFinite(coord.y) && Number.isFinite(coord.z))
    .map((coord) => ({ x: coord.x, y: coord.y, z: coord.z }));

const resetMultipartEditor = () => {
  multipartDraftRef.current = null;
  multipartEnabledRef.current = false;
  setMultipartEnabled(false);
  setActiveMultipartPart(0);
  setInnerSpaceEnabled(false);
  setEditSelectedInnerSpace(false);
  setActiveInnerSpace(0);
  setShowMultipartPartLabels(false);
  setMultipartInputError('');
};

const activeEditorCoordsFromMultipart = (geometry: MultipartGeometry | null): EditorCoord[] => {
  if (!geometry) return [];
  const partIndex = Math.max(0, Math.min(activeMultipartPartRef.current, geometry.parts.length - 1));
  if (geometry.type === 'Point') return asEditorCoords(geometry.parts.slice(partIndex, partIndex + 1));
  if (geometry.type === 'LineString') return asEditorCoords(geometry.parts[partIndex] ?? []);
  const component = geometry.parts[partIndex] ?? [];
  const targetRing = editSelectedInnerSpaceRef.current
    ? component[Math.max(1, activeInnerSpaceRef.current + 1)] ?? []
    : component[0] ?? [];
  return asEditorCoords(targetRing);
};

const persistActiveEditorCoords = (coords: EditorCoord[]) => {
  const geometry = multipartDraftRef.current;
  if (!geometry) return;
  const partIndex = Math.max(0, Math.min(activeMultipartPartRef.current, geometry.parts.length - 1));
  const next = asMultipartCoords(coords);
  if (geometry.type === 'Point') {
    // A point component is one coordinate. The current point controls may
    // receive more than one click, so retain the most recently supplied one.
    if (next[0]) geometry.parts[partIndex] = next[0];
    return;
  }
  if (geometry.type === 'LineString') {
    geometry.parts[partIndex] = next;
    return;
  }
  const component = geometry.parts[partIndex] ?? (geometry.parts[partIndex] = [[]]);
  if (editSelectedInnerSpaceRef.current) {
    const ringIndex = Math.max(1, activeInnerSpaceRef.current + 1);
    component[ringIndex] = next;
  } else {
    component[0] = next;
  }
};

/** Keep invalid hole points out of every editing entrance, not only Save. */
const validateActiveMultipartCoords = (coords: EditorCoord[]): string | undefined => {
  const geometry = multipartDraftRef.current;
  if (!multipartEnabledRef.current || !geometry || geometry.type !== 'Polygon' || !editSelectedInnerSpaceRef.current) return undefined;
  return validateMultipartHoleDraft(
    geometry,
    activeMultipartPartRef.current,
    activeInnerSpaceRef.current,
    asMultipartCoords(coords),
  );
};

const acceptActiveMultipartCoords = (coords: EditorCoord[]): boolean => {
  const error = validateActiveMultipartCoords(coords);
  setMultipartInputError(error ?? '');
  return !error;
};

const buildCurrentMultipartGeometry = (mode: DrawMode, activeCoords: EditorCoord[]): MultipartGeometry => {
  if (!multipartEnabledRef.current || !multipartDraftRef.current) {
    return multipartGeometryFromSinglePath(geometryKindForDrawMode(mode), activeCoords);
  }
  persistActiveEditorCoords(activeCoords);
  return multipartDraftRef.current;
};

const renderSelectedMultipartCoords = (geometry: MultipartGeometry | null, color: string) => {
  const selected = activeEditorCoordsFromMultipart(geometry);
  setTempPoints(selected);
  setRedoStack([]);
  draftEndpointRef.current?.clearLayers();
  drawDraftGeometry(selected, drawModeRef.current, color);
  return selected;
};

const partsPermission = () => {
  if(workflowDrawingTargetRef.current)return workflowDrawingTargetRef.current.allowParts===true;
  if(specialDraftMode==='merge-point-platform-station')return false;
  if (!configRuntime) return true;
  const path=nativeEdit?.draft.classification??(externalEdit?recordCategory(externalEdit.session.original):fullExternalCreate?.path??fullCategory);
  const config=nativeEdit?.config??externalEdit?.config??fullExternalCreate?.config??configRuntime;
  return !path.class||drawModeRef.current!=='none'&&categoryAllowsParts(config,path,geometryKindForDrawMode(drawModeRef.current));
};
const partsLocked = () => multipartStructureLocked || !partsPermission();

const selectMultipartPart = (nextIndex: number, persistCurrent = true) => {
  if (partsLocked()) return;
  const geometry = multipartDraftRef.current;
  if (!geometry) return;
  if (persistCurrent) persistActiveEditorCoords(tempPoints);
  const index = Math.max(0, Math.min(nextIndex, geometry.parts.length - 1));
  activeMultipartPartRef.current = index;
  setActiveMultipartPart(index);
  if (geometry.type === 'Polygon') {
    const hasHoles = (geometry.parts[index]?.length ?? 0) > 1;
    innerSpaceEnabledRef.current = hasHoles;
    setInnerSpaceEnabled(hasHoles);
    editSelectedInnerSpaceRef.current = false;
    setEditSelectedInnerSpace(false);
    activeInnerSpaceRef.current = 0;
    setActiveInnerSpace(0);
  }
  renderSelectedMultipartCoords(geometry, drawColorRef.current);
};

const addMultipartPart = () => {
  if (partsLocked()) return;
  const geometry = multipartDraftRef.current;
  if (!geometry) return;
  persistActiveEditorCoords(tempPoints);
  // An empty Point component must never silently become a real point at an
  // arbitrary origin. The validator blocks it until the user clicks or enters
  // one concrete coordinate for this selected component.
  if (geometry.type === 'Point') geometry.parts.push({ x: Number.NaN, y: Number.NaN, z: Number.NaN });
  else if (geometry.type === 'LineString') geometry.parts.push([]);
  else geometry.parts.push([[]]);
  selectMultipartPart(geometry.parts.length - 1, false);
};

const removeMultipartPart = () => {
  if (partsLocked()) return;
  const geometry = multipartDraftRef.current;
  if (!geometry || geometry.parts.length <= 1) return;
  persistActiveEditorCoords(tempPoints);
  const removal = removeMultipartPartAt(geometry, activeMultipartPartRef.current);
  if (!removal) return;
  selectMultipartPart(removal.nextPartIndex, false);
};

const selectInnerSpace = (nextIndex: number, persistCurrent = true) => {
  if (multipartStructureLocked) return;
  const geometry = multipartDraftRef.current;
  if (!geometry || geometry.type !== 'Polygon') return;
  if (persistCurrent) persistActiveEditorCoords(tempPoints);
  const holes = (geometry.parts[activeMultipartPartRef.current]?.length ?? 1) - 1;
  const index = Math.max(0, Math.min(nextIndex, Math.max(0, holes - 1)));
  activeInnerSpaceRef.current = index;
  setActiveInnerSpace(index);
  editSelectedInnerSpaceRef.current = true;
  setEditSelectedInnerSpace(true);
  renderSelectedMultipartCoords(geometry, drawColorRef.current);
};

const addInnerSpace = () => {
  if (multipartStructureLocked) return;
  const geometry = multipartDraftRef.current;
  if (!geometry || geometry.type !== 'Polygon') return;
  persistActiveEditorCoords(tempPoints);
  const component = geometry.parts[activeMultipartPartRef.current] ?? (geometry.parts[activeMultipartPartRef.current] = [[]]);
  component.push([]);
  innerSpaceEnabledRef.current = true;
  setInnerSpaceEnabled(true);
  selectInnerSpace(component.length - 2, false);
};

const removeInnerSpace = () => {
  if (multipartStructureLocked) return;
  const geometry = multipartDraftRef.current;
  if (!geometry || geometry.type !== 'Polygon') return;
  const component = geometry.parts[activeMultipartPartRef.current] ?? [];
  if (component.length <= 1) return;
  persistActiveEditorCoords(tempPoints);
  const removal = removeMultipartInnerSpaceAt(geometry, activeMultipartPartRef.current, activeInnerSpaceRef.current);
  if (!removal) return;
  innerSpaceEnabledRef.current = removal.hasInnerSpaces;
  setInnerSpaceEnabled(removal.hasInnerSpaces);
  editSelectedInnerSpaceRef.current = removal.hasInnerSpaces;
  setEditSelectedInnerSpace(removal.hasInnerSpaces);
  if (removal.hasInnerSpaces) {
    selectInnerSpace(removal.nextInnerSpaceIndex, false);
    return;
  }
  activeInnerSpaceRef.current = 0;
  setActiveInnerSpace(0);
  renderSelectedMultipartCoords(geometry, drawColorRef.current);
};

const toggleMultipartPartLabels = () => {
  if (!multipartEnabled || !multipartDraftRef.current) return;
  if (showMultipartPartLabels) {
    setShowMultipartPartLabels(false);
    return;
  }
  if (!closeControlPointSessions()) return;
  curveInputTRef.current?.requestCloseAndClear?.();
  persistActiveEditorCoords(tempPoints);
  setMultipartInputError('');
  setShowMultipartPartLabels(true);
};

/**
 * Both desktop and compact mapping panels share one multipart editor.  Keeping
 * this as a single renderer is intentional: selected parts/rings are a single
 * editor state and either panel must offer exactly the same operations.
 */
const renderMultipartEditor = () => (
  drawMode !== 'none' && drawing ? (
    <div className="mt-5 mb-2 rounded border border-slate-200 bg-slate-50 p-2">
      <div className="flex gap-2">
        <AppButton
          type="button"
          className={`flex-1 px-2 py-1 rounded text-sm border ${
            multipartEnabled ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
          } ${showMultipartPartLabels ? 'opacity-60 cursor-not-allowed' : ''}`}
          disabled={showMultipartPartLabels}
          onClick={() => {
            if (multipartEnabled) { setMultipartPanelOpen(value=>!value); return; }
            setMultipartPanelOpen(true);
            multipartDraftRef.current = multipartGeometryFromSinglePath(
              geometryKindForDrawMode(drawMode as DrawMode),
              tempPoints,
            );
            activeMultipartPartRef.current = 0;
            setActiveMultipartPart(0);
            multipartEnabledRef.current = true;
            setMultipartEnabled(true);
          }}
          title="启用后，绘制、控制点、手工输入与数组编辑只作用于当前选定部件"
        >
          多部件和内洞设置
        </AppButton>
        {multipartEnabled && (
          <AppButton
            type="button"
            className={`flex-1 px-2 py-1 rounded text-sm border ${
              showMultipartPartLabels ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
            }`}
            onClick={toggleMultipartPartLabels}
            title="以独立标签层强制显示部件与当前部件的内部洞编号；开启后锁定编辑操作"
          >
            显示部件编号
          </AppButton>
        )}
      </div>

      {multipartEnabled && multipartPanelOpen && multipartDraftRef.current && (
        <>
          {showMultipartPartLabels && <div className="mt-2 text-xs text-blue-700">部件编号显示中：已锁定部件、内洞与所有编辑工具；关闭此模式后才可继续编辑。</div>}
          {multipartInputError && <div className="mt-2 text-xs text-rose-700">{multipartInputError}</div>}
          <div className="mt-2 flex items-center gap-2">
            <select
              aria-label="部件编号"
              className="min-w-0 flex-1 rounded border p-1 text-sm"
              value={activeMultipartPart}
              onChange={(event) => selectMultipartPart(Number(event.target.value))}
              disabled={partsLocked()}
            >
              {multipartDraftRef.current.parts.map((_, index) => (
                <option key={index} value={index}>部件 {index + 1}</option>
              ))}
            </select>
            <AppButton type="button" className="px-3 py-1 rounded border bg-white disabled:opacity-40" onClick={addMultipartPart} disabled={partsLocked()} title="添加部件">+</AppButton>
            <AppButton
              type="button"
              className="px-3 py-1 rounded border bg-white disabled:opacity-40"
              onClick={removeMultipartPart}
              disabled={partsLocked() || multipartDraftRef.current.parts.length <= 1}
              title="删除当前部件"
            >
              −
            </AppButton>
          </div>

          {drawMode === 'polygon' && multipartDraftRef.current.type === 'Polygon' && (
            <div className="mt-2 border-t border-slate-200 pt-2">
              <div className="flex gap-2">
                <AppButton
                  type="button"
                  className={`flex-1 px-2 py-1 rounded text-sm border ${
                    innerSpaceEnabled ? 'bg-violet-600 text-white border-violet-700' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                  } ${multipartStructureLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                  disabled={multipartStructureLocked}
                  onClick={() => {
                    const currentPart = multipartDraftRef.current?.type === 'Polygon'
                      ? multipartDraftRef.current.parts[activeMultipartPartRef.current] ?? []
                      : [];
                    const hasHoles = currentPart.length > 1;
                    const next = hasHoles ? true : !innerSpaceEnabled;
                    innerSpaceEnabledRef.current = next;
                    setInnerSpaceEnabled(next);
                    if (!next) {
                      editSelectedInnerSpaceRef.current = false;
                      setEditSelectedInnerSpace(false);
                      renderSelectedMultipartCoords(multipartDraftRef.current, drawColorRef.current);
                    }
                  }}
                  title="内部空间存在时会随所选部件自动保持开启"
                >
                  内部空间
                </AppButton>
                <AppButton
                  type="button"
                  className={`flex-1 px-2 py-1 rounded text-sm border ${
                    editSelectedInnerSpace ? 'bg-violet-600 text-white border-violet-700' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                  } disabled:opacity-40`}
                  disabled={multipartStructureLocked || !innerSpaceEnabled || ((multipartDraftRef.current.parts[activeMultipartPart]?.length ?? 1) <= 1)}
                  onClick={() => {
                    if (editSelectedInnerSpaceRef.current) {
                      persistActiveEditorCoords(tempPoints);
                      editSelectedInnerSpaceRef.current = false;
                      setEditSelectedInnerSpace(false);
                      renderSelectedMultipartCoords(multipartDraftRef.current, drawColorRef.current);
                      return;
                    }
                    selectInnerSpace(activeInnerSpace);
                  }}
                  title="开启后，绘图状态与辅助工具编辑所选内部洞；关闭时编辑外边界"
                >
                  编辑所选内洞
                </AppButton>
              </div>

              {innerSpaceEnabled && (
                <div className="mt-2 flex items-center gap-2">
                  <select
                    aria-label="内部洞编号"
                    className="min-w-0 flex-1 rounded border p-1 text-sm"
                    value={activeInnerSpace}
                    onChange={(event) => selectInnerSpace(Number(event.target.value))}
                    disabled={multipartStructureLocked || (multipartDraftRef.current.parts[activeMultipartPart]?.length ?? 1) <= 1}
                  >
                    {multipartDraftRef.current.parts[activeMultipartPart]?.slice(1).map((_, index) => (
                      <option key={index} value={index}>内部洞 {index + 1}</option>
                    ))}
                    {(multipartDraftRef.current.parts[activeMultipartPart]?.length ?? 1) <= 1 && <option value={0}>尚未添加内部洞</option>}
                  </select>
                  <AppButton type="button" className="px-3 py-1 rounded border bg-white disabled:opacity-40" onClick={addInnerSpace} disabled={multipartStructureLocked} title="添加内部洞">+</AppButton>
                  <AppButton
                    type="button"
                    className="px-3 py-1 rounded border bg-white disabled:opacity-40"
                    onClick={removeInnerSpace}
                    disabled={multipartStructureLocked || (multipartDraftRef.current.parts[activeMultipartPart]?.length ?? 1) <= 1}
                    title="删除当前内部洞"
                  >
                    −
                  </AppButton>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  ) : null
);


// 所有固定图层
const [layers, setLayers] = useState<LayerType[]>([]);
const nextLayerId = useRef(1);

// 编辑模式下被编辑的图层ID
const [editingLayerId, setEditingLayerId] = useState<number|null>(null);

// 子类型选择
const [subType, setSubType] = useState<FeatureKey>('默认');

// 撤销/重做栈
const [redoStack, setRedoStack] = useState<Array<{ x: number; z: number; y?: number }>>([]);

// 当前 JSON 特征信息
const [featureInfo, setFeatureInfo] = useState<any>({});

// Raw draft annotations; native forms own their typed slot state.
const [groupInfo, setGroupInfo] = useState<Record<string, any[]>>({});

// Full creation and editing share the native editing plan.
const [editUiMode, setEditUiMode] = useState<'full-fallback' | 'native-workflow' | 'external-workflow'>('full-fallback');

const [nativeEdit,setNativeEdit]=useState<{config:ConfigPackageV3;plan:WorkflowEditPlan;draft:WorkflowEditDraft;original?:Record<string,unknown>;world:string}|null>(null);
const [externalEdit,setExternalEdit]=useState<{config:ConfigPackageV3;workflow:WorkflowDefinition;session:TrpExternalEditSession;world:string}|null>(null);
const [fullCategory,setFullCategory]=useState<ClassificationPath>({class:''});
const [fullCategoryError,setFullCategoryError]=useState('');
const [fullExternalCreate,setFullExternalCreate]=useState<{config:ConfigPackageV3;workflow:WorkflowDefinition;path:ClassificationPath;view:ProjectedRegistryScene;values:WorkflowEditorDraftValues;unparsed:WorkflowEditorUnparsedEntry[];world:string}|null>(null);
const nativeEditDatasets=useRuleDataStore(state=>state.datasets);
const nativeEditRecords=useMemo(()=>Object.values(nativeEditDatasets).flatMap(dataset=>dataset.features).map(raw=>(raw.featureInfo&&typeof raw.featureInfo==='object'?raw.featureInfo:raw) as Record<string,unknown>),[nativeEditDatasets]);
const nativeEditSearchRecords=useMemo(()=>[...nativeEditRecords,...layers.flatMap(layer=>layer.jsonInfo?.featureInfo?[layer.jsonInfo.featureInfo]:[])],[nativeEditRecords,layers]);
const nativeEditWorldMismatch=Boolean(nativeEdit&&nativeEdit.world!==normalizeV3WorldId(currentWorldId));
const activeEditWorld=nativeEdit?.world??externalEdit?.world??fullExternalCreate?.world;
const externalEditWorldMismatch=Boolean(externalEdit&&externalEdit.world!==normalizeV3WorldId(currentWorldId));
const fullExternalWorldMismatch=Boolean(fullExternalCreate&&fullExternalCreate.world!==normalizeV3WorldId(currentWorldId));
useEffect(()=>{if(!activeEditWorld)return;if(activeEditWorld!==normalizeV3WorldId(currentWorldId)){setDrawing(false);clearDraftOverlays();}else {setDrawing(true);drawDraftGeometry(tempPoints,drawMode,drawColor);}},[currentWorldId,activeEditWorld]);
const resetWorkflowStyleEditorState = () => {
  setNativeEdit(null);
  setExternalEdit(null);
  setEditUiMode('full-fallback');
  setFullExternalCreate(null);
  setFullCategory({class:''});
  setFullCategoryError('');
};

// extensions Step A：按组分区编辑时用于新增 extGroup

// 编辑者ID：用于自动写入 CreateBy / ModifityBy（不直接作为附加字段输出）
const [editorIdInput, setEditorIdInput] = useState('');

// ======== 切换确认：附加信息不为空时提示可能丢失 ========
const [switchWarnOpen, setSwitchWarnOpen] = useState(false);
const pendingSwitchActionRef = useRef<null | (() => void)>(null);


// ======== 测绘进入/退出：要素类型选择状态复位（解决“附加信息面板残留”） ========
const resetFeatureSelectionState = () => {
  // 要素类型回到默认，附加信息回到空（避免下次进入测绘仍残留上次编辑的字段面板）
  setSubType('默认');
  setFeatureInfo({});
  setGroupInfo({});
  resetWorkflowStyleEditorState();
};

const isExtraInfoNonEmpty = () => {
  if(nativeEdit&&JSON.stringify(nativeEdit.draft.slots)!==JSON.stringify(nativeEdit.draft.initialSlots))return true;
  if(fullExternalCreate&&Object.values(fullExternalCreate.values).some(value=>value!==''&&value!==undefined))return true;
  if (subType === '默认') return false;

  const hasNonEmptyValue = (obj: any) => {
    if (!obj || typeof obj !== 'object') return false;
    return Object.values(obj).some((v) => {
      if (v === null || v === undefined) return false;
      if (typeof v === 'string') return v.trim().length > 0;
      if (typeof v === 'number') return true;
      if (typeof v === 'boolean') return v;
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === 'object') return Object.keys(v).length > 0;
      return Boolean(v);
    });
  };

  const hasGroups = (() => {
    if (!groupInfo || typeof groupInfo !== 'object') return false;
    return Object.values(groupInfo).some((v) => {
      if (v === null || v === undefined) return false;
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === 'object') return Object.keys(v).length > 0;
      return Boolean(v);
    });
  })();

  return hasNonEmptyValue(featureInfo) || hasGroups;
};

const requestSwitchWithExtraWarn = (action: () => void) => {
  const hasActive = drawing || editingLayerId !== null;
  if (hasActive && isExtraInfoNonEmpty()) {
    pendingSwitchActionRef.current = action;
    setSwitchWarnOpen(true);
    return;
  }
  action();
};

const confirmExtraSwitch = () => {
  const act = pendingSwitchActionRef.current;
  pendingSwitchActionRef.current = null;
  setSwitchWarnOpen(false);
  act?.();
};

const cancelExtraSwitch = () => {
  pendingSwitchActionRef.current = null;
  setSwitchWarnOpen(false);
};


// ======== 结束测绘确认：任何触发“清空测绘图层 + 关闭测绘”的操作都必须二次确认 ========
const [endMeasuringWarnOpen, setEndMeasuringWarnOpen] = useState(false);
// Requests initiated by MapContainer must be awaitable: a native confirm would
// synchronously tear down an unrelated workspace and could sit below a panel.
// This portal-backed confirmation owns the highest interaction layer.
type ExternalClearConfirmation = {
  label: string;
  mode: 'simple' | 'review-dirty';
};
const [externalClearConfirmation, setExternalClearConfirmation] = useState<ExternalClearConfirmation | null>(null);
const externalClearConfirmResolverRef = useRef<((confirmed: boolean) => void) | null>(null);

const requestExternalClearConfirmation = (label: string, mode: ExternalClearConfirmation['mode'] = 'simple') => new Promise<boolean>((resolve) => {
  if (externalClearConfirmResolverRef.current) {
    resolve(false);
    return;
  }
  externalClearConfirmResolverRef.current = resolve;
  setExternalClearConfirmation({ label, mode });
});

const resolveExternalClearConfirmation = (confirmed: boolean) => {
  const resolve = externalClearConfirmResolverRef.current;
  externalClearConfirmResolverRef.current = null;
  setExternalClearConfirmation(null);
  resolve?.(confirmed);
};

useEffect(() => () => {
  const resolve = externalClearConfirmResolverRef.current;
  externalClearConfirmResolverRef.current = null;
  resolve?.(false);
}, []);

const endMeasuringNow = () => {
  // 1) 关闭 UI
  setMeasuringActive(false);

  // 复位要素类型/附加信息选择状态（避免下次进入测绘残留）
  resetFeatureSelectionState();

  // 2) 清空测绘图层（fixedRoot + 状态）
  clearAllLayers();

  // 3) 收起导入面板（可选）
  setImportPanelOpen(false);

  // 4) 退出绘制态
  setDrawing(false);
  setDrawMode('none');
  setTempPoints([]);
  setRedoStack([]);
  setEditingLayerId(null);

  // 5) 额外锁定/抑制归零
  clearControlPointSessionState();
  setShowDraftControlPointsLocked(false);

  // 6) 关闭确认框
  setEndMeasuringWarnOpen(false);
};


const confirmEndMeasuring = () => {
  endMeasuringNow();
};

const cancelEndMeasuring = () => {
  setEndMeasuringWarnOpen(false);
};



// ---- 导入矢量数据相关状态 ----
const [importPanelOpen, setImportPanelOpen] = useState(false);
const [importText, setImportText] = useState('');
const importFileInputRef = useRef<HTMLInputElement | null>(null);
const [importFileBusy, setImportFileBusy] = useState(false);

// RelayPackage 草稿状态（导入/导出、删除标记、图片绑定均在此维护）
const [relayPackageDraft, setRelayPackageDraft] = useState<RelayPackageDraft>(() => createEmptyRelayPackageDraft());
const [relayPackageExportOpen, setRelayPackageExportOpen] = useState(false);
const [deletePanelOpen, setDeletePanelOpen] = useState(false);
const [deleteMapPickEnabled, setDeleteMapPickEnabled] = useState(false);
const [deletePickPanelOpen, setDeletePickPanelOpen] = useState(false);
const [deletePickCandidate, setDeletePickCandidate] = useState<DeletePanelItem | null>(null);
const [deletePickedCandidate, setDeletePickedCandidate] = useState<DeletePanelItem | null>(null);
const deletePickModeOwnedRef = useRef(false);
const [picturePanelOpen, setPicturePanelOpen] = useState(false);
const [picturePanelLayerId, setPicturePanelLayerId] = useState<number | null>(null);
const [expandedLayerToolbars, setExpandedLayerToolbars] = useState<Record<number, boolean>>({});


const randomColor = () => {
  const r = Math.floor(Math.random()*255);
  const g = Math.floor(Math.random()*255);
  const b = Math.floor(Math.random()*255);
  return `rgb(${r},${g},${b})`;
};

// 两个顶层容器：固定图层容器(2) + 编辑/绘制容器(1)
const fixedRootRef = useRef<L.LayerGroup | null>(null);
const draftRootRef = useRef<L.LayerGroup | null>(null);

// 工作流临时容器：用于快捷工作流过程中持久显示阶段性几何（中心线/上下行等）
const workflowRootRef = useRef<L.LayerGroup | null>(null);
// workflow 预览 key -> Leaflet layer（便于 upsert/clear）
const workflowPreviewMapRef = useRef<Map<string, L.Layer>>(new Map());


// ======== ControlPointsT：控制点修改/添加（替代旧 ControlPointTools） ========
// The desktop and compact shells are rendered concurrently.  They must not
// share a ref: an inactive shell can otherwise overwrite the active session's
// handle and let its map-click suppression leak.
type ControlPointShell = 'desktop' | 'compact';
const controlPointsTDesktopRef = useRef<ControlPointsTHandle | null>(null);
const controlPointsTCompactRef = useRef<ControlPointsTHandle | null>(null);
const controlPointBusyShellsRef = useRef(new Set<ControlPointShell>());
const controlPointSuppressionShellsRef = useRef(new Set<ControlPointShell>());
const controlPointSessionBusyRef = useRef(false);

// ======== CurveInputT：曲线输入（独立临时容器） ========
const curveInputTRef = useRef<CurveInputTHandle | null>(null);

// CurveInputT 面板开启期间：完全冻结主绘制/编辑区交互（独立于 ControlPointsT 的抑制状态）
const [curveInputFrozen, setCurveInputFrozen] = useState(false);
const curveInputFrozenRef = useRef(false);
// 重要：冻结需要“立即生效”，避免刚打开面板就点击地图时主绘制抢先加点。
const setCurveInputFrozenImmediate = (v: boolean) => {
  curveInputFrozenRef.current = v;
  setCurveInputFrozen(v);
};

// ControlPointsT 开启修改/添加时：禁止绘制区 click 加点（避免与“控制点移动/插入”冲突）
const [drawClickSuppressed, setDrawClickSuppressed] = useState(false);

// ref 兜底：避免 Leaflet/React 严格模式下偶发的旧闭包导致 click 仍落入绘制逻辑
const drawClickSuppressedRef = useRef(false);
const setDrawClickSuppressedImmediate = (value: boolean) => {
  drawClickSuppressedRef.current = value;
  setDrawClickSuppressed(value);
};

const updateControlPointSessionState = (shell: ControlPointShell, busy: boolean) => {
  if (busy) controlPointBusyShellsRef.current.add(shell);
  else controlPointBusyShellsRef.current.delete(shell);
  const active = controlPointBusyShellsRef.current.size > 0;
  controlPointSessionBusyRef.current = active;
  setControlPointSessionBusy(active);
};

const updateControlPointDrawSuppression = (shell: ControlPointShell, suppressed: boolean) => {
  if (suppressed) controlPointSuppressionShellsRef.current.add(shell);
  else controlPointSuppressionShellsRef.current.delete(shell);
  setDrawClickSuppressedImmediate(controlPointSuppressionShellsRef.current.size > 0);
};

const clearControlPointSessionState = () => {
  controlPointBusyShellsRef.current.clear();
  controlPointSuppressionShellsRef.current.clear();
  controlPointSessionBusyRef.current = false;
  setControlPointSessionBusy(false);
  setDrawClickSuppressedImmediate(false);
};

const closeControlPointSessions = () => {
  const handles = [controlPointsTDesktopRef.current, controlPointsTCompactRef.current];
  if (handles.some((handle) => handle && !handle.requestCloseAndClear?.())) return false;
  clearControlPointSessionState();
  return true;
};

// The stable Leaflet listener delegates to this ref. The function is replaced
// every render, eliminating stale multipart/hole state from map clicks.
const onMapDrawClickRef = useRef<(event: L.LeafletMouseEvent) => void>(() => undefined);


// ControlPointsT 开启时强制锁定“显示控制点”=true，且不可关闭
const [showDraftControlPointsLocked, setShowDraftControlPointsLocked] = useState(false);



// draft 内真正承载“当前正在编辑/绘制”的那一层（保证容器1永远只有一份图形）
const draftGeomRef = useRef<L.LayerGroup | null>(null);

// ======== 辅助线工具（通用高优先级贴线） ========
const assistLineToolsRef = useRef<AssistLineToolsHandle | null>(null);

// =====featureInfo=== draft 内额外覆盖层：最新点击端点 + 控制点预览 ========
const draftEndpointRef = useRef<L.LayerGroup | null>(null);
const draftVertexOverlayRef = useRef<L.LayerGroup | null>(null);
// Independent of rule-driven layers: multipart labels are an editor-only,
// non-interactive overlay with the shared BUD-like visual preset.
const multipartLabelOverlayRef = useRef<L.LayerGroup | null>(null);

// ======== 绘制态光标：只在“本模块设置过”时才负责清理，避免干扰其它工具 ========
const drawCursorOwnedRef = useRef(false);

// ======== “显示控制点 / 显示控制点坐标”开关 ========
const [showDraftControlPoints, setShowDraftControlPoints] = useState(false);
const [showDraftControlPointCoords, setShowDraftControlPointCoords] = useState(false);

// 临时输出：默认关闭；仅 drawMode!=none 且 subType=默认 时允许展开
const [tempOutputOpen, setTempOutputOpen] = useState(false);

useEffect(() => {
  if (drawMode === 'none' || subType !== '默认') {
    setTempOutputOpen(false);
  }
}, [drawMode, subType]);


// ======== JSON 导出窗口（替代 alert/print） ========
const [jsonPanelOpen, setJsonPanelOpen] = useState(false);
const [jsonPanelText, setJsonPanelText] = useState('');
const [jsonExportSubType, setJsonExportSubType] = useState<string>('__ALL__');

type TempRuleSource = {
  uid: string;
  worldId: string;
  label?: string;
  enabled: boolean;
  items: any[];
  picturesById?: Record<string, Array<{ source?: 'pub' | 'dat' | 'formal' | 'external'; url?: string; filename?: string; relativePath?: string }>>;
};

// ======== “临时挂载(全局)”只读模式（模块化开关，便于后续移除） ========
const [tempMountAllActive, setTempMountAllActive] = useState(false);
const TEMP_MOUNT_READONLY_REASON = '临时挂载模式下仅可查看，无法编辑或保存。';
const isTempMountReadonly = tempMountAllActive;
const guardTempMountReadonly = () => {
  if (!isTempMountReadonly) return false;
  window.alert(TEMP_MOUNT_READONLY_REASON);
  return true;
};

// ======== 临时挂载：全局ID冲突检查遮罩（<1s 不显示） ========
const [tempMountIdCheckOpen, setTempMountIdCheckOpen] = useState(false);
const [tempMountIdCheckText, setTempMountIdCheckText] = useState('正在对比要素ID...');

// ======== 临时挂载：ID 冲突确认弹窗（替代 window.confirm，保证可用性与可控性） ========
const [tempMountConflictOpen, setTempMountConflictOpen] = useState(false);
const [tempMountConflictText, setTempMountConflictText] = useState<string>('');
const [tempMountConflictAllowOverride, setTempMountConflictAllowOverride] = useState(false);
const [tempMountPendingLayers, setTempMountPendingLayers] = useState<LayerType[] | null>(null);
const [tempMountPendingOverrideIds, setTempMountPendingOverrideIds] = useState<string[]>([]);


type SpecialDraftMode =
  | 'none'
  | 'merge-point-platform-station'
  | 'merge-polygon-outline-building';

const [specialDraftMode, setSpecialDraftMode] = useState<SpecialDraftMode>('none');

const [mergePointPSDraft, setMergePointPSDraft] = useState<MergePointPlatformStationDraft>({
  platforms: [],
  station: null,
});

const [mergePolygonOBDraft, setMergePolygonOBDraft] = useState<MergePolygonOutlineBuildingDraft>({
  outline: null,
  building: null,
});

const resetSpecialDrafts = () => {
  setSpecialDraftMode('none');
  setMergePointPSDraft({ platforms: [], station: null });
  setMergePolygonOBDraft({ outline: null, building: null });
};

const hasSpecialDraftData = () => {
  const hasBundleData = (b: any) => {
    if (!b) return false;
    const values = b.values ?? {};
    const groups = b.groups ?? {};
    const hasValues = Object.values(values).some((v: any) => {
      if (v === null || v === undefined) return false;
      if (typeof v === 'string') return v.trim().length > 0;
      if (typeof v === 'number') return true;
      if (typeof v === 'boolean') return v;
      return Boolean(v);
    });
    const hasGroups = Object.values(groups).some((v: any) => Array.isArray(v) ? v.length > 0 : Boolean(v));
    return hasValues || hasGroups;
  };

  if (specialDraftMode === 'merge-point-platform-station') {
    if ((mergePointPSDraft.platforms ?? []).some(hasBundleData)) return true;
    if (hasBundleData(mergePointPSDraft.station)) return true;
  }
  if (specialDraftMode === 'merge-polygon-outline-building') {
    if (hasBundleData(mergePolygonOBDraft.outline)) return true;
    if (hasBundleData(mergePolygonOBDraft.building)) return true;
  }
  return false;
};

const requestExitSpecialDraftIfNeeded = (next: () => void) => {
  if (specialDraftMode !== 'none' && hasSpecialDraftData()) {
    if (!confirm('切换将退出“合一”模式并丢弃其中的附加信息，确定继续吗？')) return;
  }
  next();
};




// ===== 外部 closeSignal：视同“结束测绘” =====
// 关键点：
// 1) 忽略首次挂载（避免刷新时误触发）
// 2) 只有在“测绘已开启 或 当前存在测绘内容/编辑/绘制”时才确认
const closeSignalInitRef = useRef(false);
const lastCloseSignalRef = useRef<any>(undefined);

useEffect(() => {
  if (closeSignal === undefined) return;

  // 忽略首次挂载拿到的初始值（解决：刷新就弹）
  if (!closeSignalInitRef.current) {
    closeSignalInitRef.current = true;
    lastCloseSignalRef.current = closeSignal;
    return;
  }

  // 防重复：同一个 closeSignal 值不重复处理
  if (closeSignal === lastCloseSignalRef.current) return;
  lastCloseSignalRef.current = closeSignal;

  // 只有在“测绘开启/有内容”时才需要确认
  const hasMeasuringContent =
    measuringActive ||
    (layersRef.current?.length ?? 0) > 0 ||
    drawing ||
    editingLayerId !== null ||
    tempPoints.length > 0;

  if (!hasMeasuringContent) return;

  // 统一走同一个确认入口（避免你现在两套 confirm 文案/逻辑）
  confirmExitAndClear('结束测绘');
}, [closeSignal, measuringActive, drawing, editingLayerId, tempPoints.length]);



// 下拉菜单开关（仅再次点击“测绘”主按钮才收回）
const [measureDropdownOpen, setMeasureDropdownOpen] = useState(false);
const [measureDropdownDesktop, setMeasureDropdownDesktop] = useState(false);
const [measureDropdownRect, setMeasureDropdownRect] = useState<{ top: number; right: number } | null>(null);
const measureLauncherRef = useRef<HTMLDivElement | null>(null);
const lastOpenSignalRef = useRef(0);
const {
  portalRoot: measureDropdownPortalRoot,
  effectiveZIndex: measureDropdownZIndex,
  emitFocused: focusMeasureDropdown,
} = useDesktopWindowStackLayer({
  id: 'measuring-launcher-dropdown',
  enabled: measureDropdownDesktop && measureDropdownOpen,
  autoFocusOnEnable: false,
});

useEffect(() => {
  const checkDesktop = () => setMeasureDropdownDesktop(window.innerWidth >= 640);
  checkDesktop();
  window.addEventListener('resize', checkDesktop);
  return () => window.removeEventListener('resize', checkDesktop);
}, []);

const updateMeasureDropdownRect = () => {
  const rect = launcherAnchorRef?.current?.getBoundingClientRect()
    ?? measureLauncherRef.current?.getBoundingClientRect();
  if (!rect) return;
  const width = 176;
  const margin = 8;
  const right = Math.max(8, window.innerWidth - rect.right);
  const top = Math.min(
    Math.max(8, rect.bottom + margin),
    Math.max(8, window.innerHeight - 8)
  );
  const maxRight = Math.max(8, window.innerWidth - width - 8);
  setMeasureDropdownRect({ top, right: Math.min(right, maxRight) });
};

useEffect(() => {
  if (!measureDropdownOpen || !measureDropdownDesktop) return;
  updateMeasureDropdownRect();
  focusMeasureDropdown();

  const handleViewportChange = () => updateMeasureDropdownRect();
  window.addEventListener('resize', handleViewportChange);
  window.addEventListener('scroll', handleViewportChange, true);
  return () => {
    window.removeEventListener('resize', handleViewportChange);
    window.removeEventListener('scroll', handleViewportChange, true);
  };
}, [focusMeasureDropdown, measureDropdownDesktop, measureDropdownOpen]);

useEffect(() => {
  const next = openSignal ?? 0;
  if (next === lastOpenSignalRef.current) return;
  lastOpenSignalRef.current = next;
  setMeasureDropdownOpen(true);
}, [openSignal]);

const toggleMeasureDropdownUi = () => {
  setMeasureDropdownOpen((v) => {
    const next = !v;
    if (next) {
      window.setTimeout(() => {
        updateMeasureDropdownRect();
        focusMeasureDropdown();
      }, 0);
    }
    return next;
  });
};

const toggleMeasureDropdown = () => {
  // A dormant mapping editor must never open its menu directly while another
  // workspace is active; the host coordinates admission first.
  if (!measuringActive && !isReviewWorkspace && onRequestOpen) {
    onRequestOpen();
    return;
  }
  toggleMeasureDropdownUi();
};

const clearCurrentWorkspace = () => {
  // 退出测绘时：若仍处于“临时挂载”模式，必须先关闭挂载（并触发规则图层重载）
  // 目标：避免退出测绘后仍残留挂载源，导致后续世界/数据处理混乱。
  const previewSources = readTemporaryRuleSources();
  const previousEntries = Array.isArray(previewSources[currentWorldId]) ? previewSources[currentWorldId] : [];
  const previewPrefix = `${currentWorldId}::layer-`;
  writeTemporaryRuleSources({
    ...previewSources,
    [currentWorldId]: previousEntries.filter((entry) => !String(entry?.uid ?? '').startsWith(previewPrefix)),
  });
  clearTempRuleOverrideIdsForWorld();
  clearTempRuleDeleteIdsForWorld();
  setTempMountAllActive(false);

  // 退出测绘：强制关闭并清空“曲线输入”临时容器（避免残留与抑制状态遗留）
  curveInputTRef.current?.requestCloseAndClear?.();

  // 关闭测绘与面板
  setMeasuringActive(false);
  setMeasureDropdownOpen(false);
  setImportPanelOpen(false);

  // 退出测绘时：模式与工作流一并复位
  setMeasuringVariant('full');
  setWorkflowRunning(false);

  // 复位要素类型/附加信息选择状态（避免残留）
  resetFeatureSelectionState();

  // 清空测绘图层（fixed + draft）及状态
  clearAllLayers();

  // 额外确保草稿容器也清掉（避免残留）
  draftGeomRef.current?.clearLayers();

  // 退出绘制/编辑态（双保险）
  setDrawing(false);
  setDrawMode('none');
  setTempPoints([]);
  setRedoStack([]);
  setEditingLayerId(null);

  // Review and mapping never share a draft lifetime.  A confirmed transition
  // must also discard the package-only state which has no Leaflet layer.
  setRelayPackageDraft(createEmptyRelayPackageDraft());
  setRelayPackageExportOpen(false);
  setDeletePanelOpen(false);
  setDeleteMapPickEnabled(false);
  setDeletePickPanelOpen(false);
  setDeletePickCandidate(null);
  setDeletePickedCandidate(null);
  setPicturePanelOpen(false);
  setPicturePanelLayerId(null);
  reviewBaselineSignatureRef.current = null;
  reviewJustLoadedRef.current = false;
  reviewDirtyRef.current = false;
  setReviewActionDirty(false);
  onReviewDirtyChange?.(false);

  return true;
};

const confirmExitAndClear = async (actionLabel: string) => {
  // 统一二次确认：任何“退出测绘并清理图层”的入口都走这里。
  // A portal is used so that every active floating panel is covered.
  const ok = await requestExternalClearConfirmation(actionLabel);
  return ok ? clearCurrentWorkspace() : false;
};

useImperativeHandle(ref, () => ({
  getCommittedFeatures: () => layersRef.current.flatMap(layer => layer.jsonInfo?.featureInfo ? [structuredClone(layer.jsonInfo.featureInfo)] : []),
  requestCloseAndClear: async (actionLabel?: string) => {
    const label = (actionLabel ?? '关闭测绘').trim() || '关闭测绘';

    const hasMeasuringContent =
      measuringActive ||
      (layersRef.current?.length ?? 0) > 0 ||
      drawing ||
      editingLayerId !== null ||
      tempPoints.length > 0 ||
      tempMountAllActive;

    if (isReviewWorkspace) {
      if (!hasMeasuringContent && !reviewSession?.packageId && !reviewDirtyRef.current) return true;
      const confirmed = await requestExternalClearConfirmation(label, reviewDirtyRef.current ? 'review-dirty' : 'simple');
      return confirmed ? clearCurrentWorkspace() : false;
    }
    if (!hasMeasuringContent) {
      setMeasureDropdownOpen(false);
      return true;
    }
    return confirmExitAndClear(label);
  },
  toggleLauncherMenu: () => {
    if (!isReviewWorkspace) toggleMeasureDropdownUi();
  },
  confirmReviewPackageReplacement: async (actionLabel?: string) => {
    if (!isReviewWorkspace || !reviewSession?.packageId) return true;
    const label = (actionLabel ?? '切换审核包').trim() || '切换审核包';
    return requestExternalClearConfirmation(label, reviewDirtyRef.current ? 'review-dirty' : 'simple');
  },
}));

// ===== 模式切换（完整 <-> 快捷） =====
// 目标：
// 1) 测绘已开启时，允许在下拉菜单内切换另一种模式
// 2) 若存在“未完成编辑/未完成工作流/合一草稿”等临时内容，则提示确认
// 3) 模式切换仅清理临时容器（workflow + draft + 编辑/绘制态），不删除 fixed 图层与图层管理区内容

const hasUnsavedWorkForVariantSwitch = () => {
  // ① 编辑/绘制中的临时几何
  const hasFullTemp = drawing || editingLayerId !== null || tempPoints.length > 0;

  // ② 快捷工作流的运行态
  const hasWorkflowTemp = workflowRunning;

  // ③ “合一”草稿（内部有附加信息/未提交）
  const hasSpecial = specialDraftMode !== 'none' && hasSpecialDraftData();

  // ④ 兜底：若草稿容器仍有内容，也视为未完成（避免边界残留）
  const hasDraftLayers =
    (draftGeomRef.current?.getLayers?.().length ?? 0) > 0 ||
    (draftEndpointRef.current?.getLayers?.().length ?? 0) > 0 ||
    (draftVertexOverlayRef.current?.getLayers?.().length ?? 0) > 0;

  // ⑤ 兜底：快捷工作流预览容器仍有内容
  const hasWorkflowPreview = workflowPreviewMapRef.current.size > 0;

  return hasFullTemp || hasWorkflowTemp || hasSpecial || hasDraftLayers || hasWorkflowPreview;
};

const clearTemporaryForVariantSwitch = () => {
  // 仅清理临时容器：workflow + draft + 编辑/绘制态；不清 fixedRoot 与 layers
  workflowRootRef.current?.clearLayers();
  workflowPreviewMapRef.current.clear();
  clearDraftOverlays();

  // 曲线输入也属于临时容器
  curveInputTRef.current?.requestCloseAndClear?.();

  // 编辑/绘制态复位
  setTempPoints([]);
  setRedoStack([]);
  if(editingLayerId!==null)syncFixedRoot(layersRef.current,null);
  setEditingLayerId(null);
  setDrawing(false);
  setDrawMode('none');
  resetWorkflowStyleEditorState();

  // 工作流态复位
  setWorkflowRunning(false);

  // 控制点显示复位（避免切换后意外常显）
  setShowDraftControlPoints(false);
  setShowDraftControlPointCoords(false);
  clearControlPointSessionState();
  setShowDraftControlPointsLocked(false);

  // 合一草稿复位
  if (specialDraftMode !== 'none') setSpecialDraftMode('none');
};

const switchMeasuringVariantFromMenu = (target: 'full' | 'workflow') => {
  if (!measuringActive) return;
  if (target === measuringVariant) {
    // 仍收起菜单，避免用户误以为没有响应
    setMeasureDropdownOpen(false);
    return;
  }

  const label = target === 'full' ? '完整模式' : '快捷模式';

  const doSwitch = () => {
    // 切换时建议关闭导入面板，避免 UI 残留
    setImportPanelOpen(false);
    clearTemporaryForVariantSwitch();
    setMeasuringVariant(target);
    setMeasureDropdownOpen(false);
  };

  // 若存在未完成内容：提示确认（文案与“关闭时”保持同类语义，但仅清理临时/切断工作流）
  if (hasUnsavedWorkForVariantSwitch()) {
    const ok = window.confirm(`切换到${label}将清除临时测绘图层并结束当前未完成的编辑/工作流，是否确认？`);
    if (!ok) return;
  }

  // “合一”模式需额外确认（其内部附加信息不应静默丢弃）
  requestExitSpecialDraftIfNeeded(doSwitch);
};

const startMeasuringFromMenu = (variant: 'full' | 'workflow') => {
  if (measuringActive) return;

  // 打开测绘时：通知外部关闭“测量工具”
  onBecameActive?.();

  // 进入测绘前清空
  clearAllLayers();

  // 复位要素类型/附加信息选择状态（避免上一次编辑残留）
  resetFeatureSelectionState();

  setMeasuringVariant(variant);
  setWorkflowRunning(false);
  setMeasuringActive(true);
};

const endMeasuringFromMenu = () => {
  // 结束测绘：必须二次确认 + 清理
  confirmExitAndClear('结束测绘');
};


  const closeMeasuringUI = () => {
    if (isReviewWorkspace) {
      // The detail panel owns the loaded package. Closing its bound layer
      // manager must always be explicit: a dirty package offers save/discard;
      // a clean package asks for a simple close confirmation.
      void (async () => {
        const confirmed = await requestExternalClearConfirmation('关闭审核图层管理', reviewDirtyRef.current ? 'review-dirty' : 'simple');
        if (confirmed && clearCurrentWorkspace()) onReviewExitRequested?.();
      })();
      return;
    }
  // 右上角 X：也视同“退出测绘并清理”，必须二次确认
  confirmExitAndClear('退出测绘');
};






useEffect(() => {
  if (!leafletMapRef.current) return;
  const map = leafletMapRef.current;

  if (!fixedRootRef.current) {
    fixedRootRef.current = L.layerGroup().addTo(map);
  }
  if (!workflowRootRef.current) {
    // 置于 fixed 之上、draft 之下
    workflowRootRef.current = L.layerGroup().addTo(map);
  }
  if (!draftRootRef.current) {
    // 草稿层置于最上层
    draftRootRef.current = L.layerGroup().addTo(map);
  }


  // 1) 草稿几何（线/面/点）
  if (!draftGeomRef.current) {
    draftGeomRef.current = L.layerGroup();
    draftRootRef.current.addLayer(draftGeomRef.current);
  }

  // 2) 最新点击端点指示（只保留一个）
  if (!draftEndpointRef.current) {
    draftEndpointRef.current = L.layerGroup();
    draftRootRef.current.addLayer(draftEndpointRef.current);
  }

  // 3) 控制点预览（显示控制点/坐标）
  if (!draftVertexOverlayRef.current) {
    draftVertexOverlayRef.current = L.layerGroup();
    draftRootRef.current.addLayer(draftVertexOverlayRef.current);
  }
  if (!multipartLabelOverlayRef.current) {
    multipartLabelOverlayRef.current = L.layerGroup();
    draftRootRef.current.addLayer(multipartLabelOverlayRef.current);
  }
}, [mapReady]);



// ========= 地图点击监听（绘制模式） =========

// ========= 删除要素选择模式（Rules 专用命中链路） =========
const buildDeleteCandidateFromRuleFeature = (feature: FeatureRecord | null | undefined) => {
  const fi = feature?.featureInfo as any;
  const cls = String(fi?.Class ?? '').trim();
  const { idValue } = pickIdFieldValue(fi, cls);
  const id = String(idValue ?? '').trim();
  if (!id) return null;
  const name = String(fi?.Name ?? fi?.Label ?? '').trim() || id;
  return { ID: id, Name: name, className: cls, worldId: resolveRelayPackageWorldId(fi?.World, currentWorldId) };
};

useEffect(() => {
  const active = Boolean(deletePanelOpen && deletePickPanelOpen && deleteMapPickEnabled);
  if (typeof window === 'undefined') return;
  if (deletePickModeOwnedRef.current === active) return;
  deletePickModeOwnedRef.current = active;
  window.dispatchEvent(new CustomEvent('ria:delete-pick-mode', { detail: { active } }));
}, [deletePanelOpen, deletePickPanelOpen, deleteMapPickEnabled]);

useEffect(() => {
  return () => {
    if (typeof window === 'undefined') return;
    if (!deletePickModeOwnedRef.current) return;
    deletePickModeOwnedRef.current = false;
    window.dispatchEvent(new CustomEvent('ria:delete-pick-mode', { detail: { active: false } }));
  };
}, []);

useEffect(() => {
  if (typeof window === 'undefined') return;
  const active = Boolean(deletePanelOpen && deletePickPanelOpen && deleteMapPickEnabled);
  if (!active) return;

  const handler = (ev: Event) => {
    const feature = (ev as CustomEvent<any>)?.detail?.feature as FeatureRecord | undefined;
    const picked = buildDeleteCandidateFromRuleFeature(feature);
    if (!picked) return;
    const currentDeleteIds = new Set(relayPackageDraft.deleteMarks.map((x) => x.ID));
    if (currentDeleteIds.has(picked.ID)) return;
    setDeletePickCandidate({ ...picked });
  };

  window.addEventListener('ria:delete-pick-feature', handler as EventListener);
  return () => window.removeEventListener('ria:delete-pick-feature', handler as EventListener);
}, [deletePanelOpen, deletePickPanelOpen, deleteMapPickEnabled, relayPackageDraft.deleteMarks]);

useEffect(() => {
  const map = leafletMapRef.current;
  if (!map) return;

  const handleClick = (e: L.LeafletMouseEvent) => {
    if (!mapDraftInputActiveRef.current) return;
    // 曲线输入面板开启时：主绘制/编辑区完全冻结
    if (curveInputFrozenRef.current) return;

    // ControlPointsT can exist in desktop and compact shells concurrently.
    // The aggregate ref is updated synchronously by either shell.
    if (controlPointSessionBusyRef.current) return;
    if (drawClickSuppressedRef.current) return;

    onMapDrawClickRef.current(e);
  };

  map.on('click', handleClick);
  return () => {
    map.off('click', handleClick);
  };
}, [mapReady]);


 
 
useEffect(() => {
  const map = leafletMapRef.current;
  if (!map) return;

  const el = map.getContainer();
  const shouldShow = measuringActive && drawing && drawMode !== 'none';

  if (shouldShow) {
    // 只有在当前没有其它工具占用 cursor 时，才设置
    if (!el.style.cursor) {
      el.style.cursor = 'crosshair';
      drawCursorOwnedRef.current = true;
    }
    return;
  }

  // 仅当“本模块设置过”才清理，避免把其它模式的 cursor 清掉
  if (drawCursorOwnedRef.current) {
    el.style.cursor = '';
    drawCursorOwnedRef.current = false;
  }
}, [measuringActive, drawing, drawMode]);

 
const clearDraftOverlays = () => {
  draftGeomRef.current?.clearLayers();
  draftEndpointRef.current?.clearLayers();
  draftVertexOverlayRef.current?.clearLayers();
  multipartLabelOverlayRef.current?.clearLayers();
};

const updateLatestEndpointMarker = (p: { x: number; z: number }, color: string) => {
  const proj = projectionRef.current;
  const g = draftEndpointRef.current;
  if (!proj || !g) return;

  g.clearLayers();

  const ll = proj.locationToLatLng(p.x, 64, p.z);
  L.circleMarker(ll, {
    radius: 6,
    color: '#ffffff',
    weight: 2,
    fillColor: color,
    fillOpacity: 1,
  }).addTo(g);
};



const onMapDrawClick = (e: L.LeafletMouseEvent) => {
  // This remains the final guard for direct calls and for a listener that
  // survives React transitions.  Idle map clicks must never mutate drafts.
  if (!mapDraftInputActiveRef.current) return;
  if (showMultipartPartLabelsRef.current) return;
  // 曲线输入面板开启时：主绘制/编辑区完全冻结
  if (curveInputFrozenRef.current) return;

  // Double protection for direct calls as well as Leaflet's stable listener.
  if (controlPointSessionBusyRef.current) return;
  if (drawClickSuppressedRef.current) return;

  const proj = projectionRef.current;
  if (!proj) return;

  const loc = proj.latLngToLocation(e.latlng, 64);
  let newPoint = { x: loc.x, z: loc.z };

  // ① 辅助线：高优先级贴线
  const assist = assistLineToolsRef.current;
  if (assist?.isEnabled?.()) {
    const r = assist.transformWorldPoint?.(newPoint);
    if (r?.point) newPoint = r.point;
  }

  // ② 网格化（整数 / 0.5 / 强制中心）：在“辅助线修正”之后立刻对点击坐标做修正
  newPoint = snapWorldPointByMode(newPoint);

  setTempPoints((prev) => {
    // Point multipart components are individual coordinates, not a nested
    // path. Re-clicking replaces the selected point rather than creating an
    // invisible second coordinate in the same component.
    const updated = drawMode === 'point' && multipartEnabledRef.current ? [newPoint] : [...prev, newPoint];
    if (!acceptActiveMultipartCoords(updated)) return prev;
    // The selected component/ring is the canonical draft before Leaflet draws
    // the persistent reference geometry. This is what prevents redraws from
    // appearing only after an unrelated Undo/Redo state change.
    if (multipartEnabledRef.current) persistActiveEditorCoords(updated);
    setRedoStack([]);
    drawDraftGeometry(updated, drawMode, drawColorRef.current);
    updateLatestEndpointMarker(newPoint, drawColorRef.current);
    return updated;
  });
};

onMapDrawClickRef.current = onMapDrawClick;

const onManualPointSubmit = (v: { x: number; y: number; z: number }) => {
  if (showMultipartPartLabelsRef.current) return;
  if (!measuringActive || !drawing || drawMode === 'none') return;
  if (curveInputFrozenRef.current) return;
  if (controlPointSessionBusyRef.current) return;
  if (drawClickSuppressedRef.current) return;

  // 点要素：若手动输入包含 y，则写入 tempPoints[0].y，并同步写入 featureInfo.elevation（兼容旧规范）。
  if (drawMode === 'point') {
    setFeatureInfo((prev: any) => ({ ...(prev ?? {}), elevation: v.y }));
  }

  const newPoint = ({ x: v.x, z: v.z, y: v.y } as { x: number; z: number; y: number });

  setTempPoints((prev) => {
    const updated = drawMode === 'point' && multipartEnabledRef.current ? [newPoint] : [...prev, newPoint];
    if (!acceptActiveMultipartCoords(updated)) return prev;
    if (multipartEnabledRef.current) persistActiveEditorCoords(updated);
    setRedoStack([]);
    drawDraftGeometry(updated, drawMode, drawColorRef.current);
    updateLatestEndpointMarker({ x: v.x, z: v.z }, drawColorRef.current);
    return updated;
  });
};



 // ========= 容器1：绘制/编辑专用 =========
 const drawDraftGeometry = (
   coords: { x: number; z: number }[],
   mode: 'none' | 'point' | 'polyline' | 'polygon',
   color: string
 ) => {
   const proj = projectionRef.current;
   const draft = draftGeomRef.current;
   if (!proj || !draft) return;
 
   draft.clearLayers();
 
  if (mode === 'none') return;

  // Keep every non-selected multipart component visible while the legacy
  // tools edit only `coords`. The active component/ring is drawn below with
  // the normal solid style; retained components are a non-interactive dashed
  // reference and can never receive accidental control-point edits.
  const draftMultipart = multipartEnabledRef.current ? multipartDraftRef.current : null;
  const activePart = activeMultipartPartRef.current;
  const editingHole = editSelectedInnerSpaceRef.current;
  const referenceStyle = { color, weight: 2.25, opacity: 0.72, fillOpacity: 0.08, dashArray: '8 6', interactive: false } as L.PathOptions;
  const referenceHaloStyle = { color, weight: 4.75, opacity: 0.12, interactive: false } as L.PathOptions;
  const projectReference = (point: { x: number; y: number; z: number }) => proj.locationToLatLng(point.x, 64, point.z);
  if (draftMultipart?.type === 'Point' && mode === 'point') {
    draftMultipart.parts.forEach((point, index) => {
      if (index === activePart || !Number.isFinite(point.x) || !Number.isFinite(point.z)) return;
      L.circleMarker(projectReference(point), { color, fillColor: color, radius: 5, opacity: 0.45, fillOpacity: 0.2, dashArray: '5 7', interactive: false }).addTo(draft);
    });
  } else if (draftMultipart?.type === 'LineString' && mode === 'polyline') {
    draftMultipart.parts.forEach((part, index) => {
      if (index === activePart || part.length < 2) return;
      const latLngs = part.map(projectReference);
      L.polyline(latLngs, referenceHaloStyle).addTo(draft);
      L.polyline(latLngs, referenceStyle).addTo(draft);
    });
  } else if (draftMultipart?.type === 'Polygon' && mode === 'polygon') {
    draftMultipart.parts.forEach((component, partIndex) => {
      const [outer, ...holes] = component;
      if (outer?.length >= 3) {
        const polygon = [outer, ...holes.filter((hole) => hole.length >= 3)].map((ring) => ring.map(projectReference));
        L.polygon(polygon, {
          color: 'transparent',
          weight: 0,
          fillColor: color,
          fillOpacity: partIndex === activePart ? 0.13 : 0.065,
          fillRule: 'evenodd',
          interactive: false,
        }).addTo(draft);
      }
      component.forEach((ring, ringIndex) => {
        if (ring.length < 2) return;
        const closed = [...ring, ring[0]].map(projectReference);
        const editingCurrentRing = partIndex === activePart && (
          (editingHole && ringIndex === activeInnerSpaceRef.current + 1)
          || (!editingHole && ringIndex === 0)
        );
        // The live ring is painted once below with a solid editing style. Do
        // not paint its stale dashed counterpart beneath it.
        if (editingCurrentRing) return;
        const activeOuterForHole = partIndex === activePart && editingHole && ringIndex === 0;
        // Holes belong to the selected feature, so they inherit its chosen
        // drawing colour; styling (dash/opacity) distinguishes their role.
        const ringColor = color;
        const halo = activeOuterForHole
          ? { color: ringColor, weight: 6.5, opacity: 0.3, interactive: false }
          : { color: ringColor, weight: 4, opacity: partIndex === activePart ? 0.17 : 0.08, interactive: false };
        L.polyline(closed, halo).addTo(draft);
        L.polyline(closed, {
          color: ringColor,
          weight: activeOuterForHole ? 3.4 : 2.25,
          opacity: partIndex === activePart ? 0.84 : 0.62,
          dashArray: activeOuterForHole ? undefined : '8 6',
          interactive: false,
        }).addTo(draft);
      });
    });
  }
  if (coords.length === 0) return;
 
   const latlngs = coords.map(p => proj.locationToLatLng(p.x, 64, p.z));
 
   if (mode === 'point') {
     latlngs.forEach(ll => {
       L.circleMarker(ll, { color, fillColor: color, radius: 6 }).addTo(draft);
     });
   } else if (mode === 'polyline') {
     L.polyline(latlngs, { color, weight: 4, opacity: 0.96 }).addTo(draft);
   } else if (mode === 'polygon') {
    if (latlngs.length > 2 && !editingHole) L.polygon(latlngs, { color, weight: 3.25, fillColor: color, fillOpacity: 0.16 }).addTo(draft);
    else L.polyline([...latlngs, ...(latlngs.length > 2 ? [latlngs[0]] : [])], { color, weight: 3.25, dashArray: undefined }).addTo(draft);
   }
 };
 
// Editor labels deliberately use the shared label-style factory but live in a
// separate non-interactive layer. They are therefore a CairnMap capability,
// not a RIA/BUD rule-rendering side effect.
useEffect(() => {
  const projection = projectionRef.current;
  const overlay = multipartLabelOverlayRef.current;
  if (!projection || !overlay) return;
  overlay.clearLayers();
  if (!showMultipartPartLabels || !multipartEnabled || !multipartDraftRef.current) return;

  const labelAt = (coords: Array<{ x: number; y: number; z: number }>, text: string) => {
    if (!coords.length) return;
    const finite = coords.filter((point) => Number.isFinite(point.x) && Number.isFinite(point.z));
    if (!finite.length) return;
    const anchor = finite.reduce((sum, point) => ({ x: sum.x + point.x, z: sum.z + point.z }), { x: 0, z: 0 });
    const latLng = projection.locationToLatLng(anchor.x / finite.length, 64, anchor.z / finite.length);
    L.marker(latLng, {
      interactive: false,
      keyboard: false,
      icon: makeLabelDivIcon('gm-outline-bold', text, { placement: 'center', withDot: false, interactive: false }),
    }).addTo(overlay);
  };

  const geometry = multipartDraftRef.current;
  if (geometry.type === 'Point') {
    geometry.parts.forEach((part, index) => labelAt([part], `部件 ${index + 1}`));
    return;
  }
  if (geometry.type === 'LineString') {
    geometry.parts.forEach((part, index) => labelAt(part, `部件 ${index + 1}`));
    return;
  }
  geometry.parts.forEach((part, index) => {
    labelAt(part[0] ?? [], `部件 ${index + 1}`);
    if (index === activeMultipartPartRef.current) {
      part.slice(1).forEach((hole, holeIndex) => labelAt(hole, `内洞 ${holeIndex + 1}`));
    }
  });
}, [showMultipartPartLabels, multipartEnabled, activeMultipartPart, activeInnerSpace, tempPoints, drawMode, drawing, mapReady]);

// 颜色变化时：立即刷新草稿图形（避免“必须保存后颜色才变化”）
useEffect(() => {
  if (!measuringActive) return;
  if (!drawing || drawMode === 'none') return;

  drawDraftGeometry(tempPoints, drawMode, drawColor);

  // 端点临时点：仅在本来就存在时更新颜色（避免把“已清除的端点点”又画回来）
  const ep = draftEndpointRef.current;
  if (ep && ep.getLayers().length > 0 && tempPoints.length > 0) {
    updateLatestEndpointMarker(tempPoints[tempPoints.length - 1], drawColor);
  }
}, [drawColor, measuringActive, drawing, drawMode, tempPoints, multipartEnabled, activeMultipartPart, editSelectedInnerSpace, activeInnerSpace]);


useEffect(() => {
  const proj = projectionRef.current;
  const g = draftVertexOverlayRef.current;
  if (!proj || !g) return;

  g.clearLayers();

  // 仅限测绘栏绘制区（draft），且开关开启
  if (!measuringActive) return;
  if (!showDraftControlPoints) return;
  if (drawMode === 'none') return;
  if (!Array.isArray(tempPoints) || tempPoints.length === 0) return;

  const controlPointsTActive = drawClickSuppressed;

  // ControlPointsT 开启时：若不需要“坐标常显”，这里完全不画，避免挡点击
  if (controlPointsTActive && !showDraftControlPointCoords) return;

  for (const p of tempPoints) {
    const ll = proj.locationToLatLng(p.x, 64, p.z);
    const label = `${formatGridNumber(p.x)}, ${formatGridNumber(p.z)}`;

    const isInvisibleForLabelOnly = controlPointsTActive && showDraftControlPointCoords;

    const m = L.circleMarker(
      ll,
      isInvisibleForLabelOnly
        ? {
            radius: 0,
            color: 'transparent',
            weight: 0,
            opacity: 0,
            fillColor: 'transparent',
            fillOpacity: 0,
            // 关键：不参与交互，避免挡住 ControlPointsT 的控制点 marker
            interactive: false,
          }
        : {
            radius: 4,
            color: '#ffffff',
            weight: 2,
            fillColor: drawColor,
            fillOpacity: 1,
            interactive: false, // 仅展示用途
          }
    );

    m.bindTooltip(label, {
      direction: 'right',
      offset: [10, 0],
      opacity: 0.9,
      permanent: showDraftControlPointCoords,
      sticky: !showDraftControlPointCoords,
    });

    if (showDraftControlPointCoords) m.openTooltip();

    m.addTo(g);
  }
}, [
  mapReady,
  measuringActive,
  showDraftControlPoints,
  showDraftControlPointCoords,
  tempPoints,
  drawMode,
  drawColor,
  drawClickSuppressed,
]);



 
 // 让异步回调始终拿到最新 layers（避免 setTimeout / 事件回调拿旧闭包）
 const layersRef = useRef<LayerType[]>([]);
 useEffect(() => {
   layersRef.current = layers;
 }, [layers]);
 
 
 
 // 固定容器2：只由 fixedRootRef 统一管理显示，禁止再对 layer.leafletGroup.addTo(map) 做“绕过式挂载”
 const syncFixedRoot = (nextLayers: LayerType[], editingId: number | null) => {
   const root = fixedRootRef.current;
   if (!root) return;
 
   root.clearLayers();
 
   for (const l of nextLayers) {
     if (!l.visible) continue;
     if (editingId !== null && l.id === editingId) continue; // 编辑中的层交给 draftGeomRef
     root.addLayer(l.leafletGroup);
   }
 };
 
 



const finishLayer = () => {
  if (guardTempMountReadonly()) return;
  const map = leafletMapRef.current;
  const proj = projectionRef.current;
  if (!map || !proj) return;

  if (drawMode === 'none') return;
  if(activeEditWorld&&activeEditWorld!==normalizeV3WorldId(currentWorldId)){alert('请返回本次工作区所属世界后保存。');return;}

  // —— 关键：编辑态允许“未改坐标直接保存”，此时用备份 coords 兜底
  const backup = editingBackupCoordsRef.current ?? [];
  const finalCoords =
    tempPoints.length > 0 ? [...tempPoints] :
    (editingLayerId !== null ? [...backup] : []);

  if (editingLayerId === null && finalCoords.length === 0) return;
  if (editingLayerId !== null && finalCoords.length === 0) return;

  const makeLeafletGroup = (
    mode: DrawMode,
    coords: { x: number; z: number; y?: number }[],
    color: string,
    multipart?: MultipartGeometry,
  ) => {
    const g = L.layerGroup();
    const latlngs = coords.map(p => proj.locationToLatLng(p.x, 64, p.z));

    if (mode === 'point') {
      const points = multipart?.type === 'Point'
        ? multipart.parts.map((point) => proj.locationToLatLng(point.x, point.y, point.z))
        : latlngs;
      points.forEach(ll => {
        L.circleMarker(ll, { color, fillColor: color, radius: 6 }).addTo(g);
      });
    } else if (mode === 'polyline') {
      const parts = multipart?.type === 'LineString'
        ? multipart.parts.map((part) => part.map((point) => proj.locationToLatLng(point.x, point.y, point.z)))
        : latlngs;
      L.polyline(parts as any, { color }).addTo(g);
    } else if (mode === 'polygon') {
      const parts = multipart?.type === 'Polygon'
        ? multipart.parts.map((part) => part.map((ring) => ring.map((point) => proj.locationToLatLng(point.x, point.y, point.z))))
        : latlngs;
      if (latlngs.length > 2) L.polygon(parts as any, { color }).addTo(g);
      else L.polyline(latlngs, { color }).addTo(g);
    }

    return g;
  };

  const cleanupAfterFinish = () => {
    draftGeomRef.current?.clearLayers();
    draftEndpointRef.current?.clearLayers();

    setTempPoints([]);
    setRedoStack([]);
    setEditingLayerId(null);
    editingBackupCoordsRef.current = null;

    setDrawing(false);
    setDrawMode('none');

    resetSpecialDrafts();

    setSubType('默认');
  setFeatureInfo({});
  setGroupInfo({});
    resetWorkflowStyleEditorState();
    resetMultipartEditor();
  };

  if(specialDraftMode!=='none'){
    if(editingLayerId!==null){alert('合并工具仅用于新建。');return;}
    const geometry=buildCurrentMultipartGeometry(drawMode as DrawMode,finalCoords);
    const bundles:DraftBundle[]=specialDraftMode==='merge-point-platform-station'?[...mergePointPSDraft.platforms,...(mergePointPSDraft.station?[mergePointPSDraft.station]:[])]:[...(mergePolygonOBDraft.outline?[mergePolygonOBDraft.outline]:[]),...(mergePolygonOBDraft.building?[mergePolygonOBDraft.building]:[])];
    if(!bundles.length){alert('请至少添加一份要素信息。');return;}
    if(specialDraftMode==='merge-point-platform-station'&&geometry.parts.length!==1){alert('多点合一需要一个共享坐标，不能截断多部件。');return;}
    const outputs:LayerType[]=[],records=[...recordsAfterExactDeletes(nativeEditRecords,relayPackageDraft.deleteMarks),...layersRef.current.flatMap(layer=>layer.jsonInfo?.featureInfo?[layer.jsonInfo.featureInfo]:[])];
    try{for(const bundle of bundles){const record=prepareMergeDraft(bundle,geometry,currentWorldId,editorIdInput,[...records,...outputs.flatMap(layer=>layer.jsonInfo?.featureInfo?[layer.jsonInfo.featureInfo]:[])]);outputs.push({id:nextLayerId.current++,mode:drawMode as DrawMode,color:drawColor,coords:finalCoords,visible:true,leafletGroup:makeLeafletGroup(drawMode as DrawMode,finalCoords,drawColor,geometry),jsonInfo:{subType:classificationPathKey(recordCategory(record)),featureInfo:record}});}}catch(error){alert(error instanceof Error?error.message:String(error));return;}
    setLayers(previous=>{const next=[...previous,...outputs];syncFixedRoot(next,null);return next;});cleanupAfterFinish();return;
  }

  const finalGeometry = buildCurrentMultipartGeometry(drawMode as DrawMode, finalCoords);
  const geometryError = validateMultipartGeometry(finalGeometry);
  if (geometryError) {
    alert(`无法保存，${geometryError}`);
    return;
  }
  let finalFeatureInfo:Record<string,unknown>|undefined;
  const others=[...recordsAfterExactDeletes(nativeEditRecords,relayPackageDraft.deleteMarks),...layersRef.current.filter(layer=>layer.id!==editingLayerId).flatMap(layer=>layer.jsonInfo?.featureInfo?[layer.jsonInfo.featureInfo]:[])];
  try{
    if(fullCategoryError)throw Error(fullCategoryError);
    if(externalEdit&&editUiMode==='external-workflow')finalFeatureInfo=prepareTrpExternalEdit(externalEdit.config,externalEdit.workflow,externalEdit.session,finalGeometry,currentWorldId,editorIdInput,others);
    else if(nativeEdit&&editUiMode==='native-workflow')finalFeatureInfo=nativeEdit.original?prepareNativeWorkflowEdit(nativeEdit.config,nativeEdit.plan.workflow,nativeEdit.original,nativeEdit.draft,finalGeometry,currentWorldId,editorIdInput,others):prepareFullEditorCreate(nativeEdit.config,nativeEdit.plan.workflow,nativeEdit.draft,finalGeometry,currentWorldId,editorIdInput,others);
    else if(fullExternalCreate){const raw=mergeEditorDraftIntoFeatureInfo({originalFeatureInfo:{},view:fullExternalCreate.view,draftValues:fullExternalCreate.values});finalFeatureInfo=prepareNativeRecordCreate(fullExternalCreate.config,fullExternalCreate.path,finalGeometry,raw,currentWorldId,editorIdInput,others);}
    else if(fullCategory.class)throw Error('请先完成分类选择并加载可用编辑方案。');
  }catch(error){alert(error instanceof Error?error.message:'原生保存失败。');return;}

  const newLayerId = editingLayerId ?? nextLayerId.current++;

  const newGroup = makeLeafletGroup(drawMode as DrawMode, finalCoords, drawColor, finalGeometry);

  const layerObj: LayerType = {
    id: newLayerId,
    mode: drawMode,
    color: drawColor,
    coords: finalCoords,
    visible: true,
    leafletGroup: newGroup,
    jsonInfo: {
      subType:finalFeatureInfo?classificationPathKey(recordCategory(finalFeatureInfo)):'默认',
      featureInfo: finalFeatureInfo,
    },
  };

  setLayers(prev => {
    let next: LayerType[];

    if (editingLayerId !== null) {
      const old = prev.find(l => l.id === editingLayerId);
      if (old) fixedRootRef.current?.removeLayer(old.leafletGroup);
      next = prev.map(l => (l.id === editingLayerId ? layerObj : l));
    } else {
      next = [...prev, layerObj];
    }

    syncFixedRoot(next, null);
    return next;
  });

  cleanupAfterFinish();
};


 
 
 
 
const getLayerJSONOutput = (layer: LayerType) => {
  return layerToJsonText(layer);
};


const getLayersJSONOutputBySubType = (target: FeatureKey | '__ALL__') => {
  const items = layers
    .filter((l) => Boolean(l?.jsonInfo?.featureInfo))
    .filter((l) => {
      if (target === '__ALL__') return true;
      return (l.jsonInfo?.subType as any) === target;
    })
    .map((l) => {
      try {
        const one = JSON.parse(layerToJsonText(l));
        if (Array.isArray(one) && one.length > 0) return one[0];
        return null;
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return stringifyFeatureJsonArray(items);
};

const getAvailableSubTypes = (): FeatureKey[] => {
  const set = new Set<string>();
  for (const l of layers) {
    const st = l.jsonInfo?.subType;
    if (st && typeof st === 'string' && st !== '默认') set.add(st);
  }
  return Array.from(set) as FeatureKey[];
};

// Native export filters use the complete classification identity.
type WorkflowCatalogExportKey = `__WF__:${string}`;
const getAvailableWorkflowCatalogKeys=()=>[...new Map(layers.flatMap(layer=>{const record=layer.jsonInfo?.featureInfo;if(!record?.Class)return [];const path=recordCategory(record),key=('__WF__:'+classificationPathKey(path)) as WorkflowCatalogExportKey;return [[key,{key,label:configRuntime?workflowPathLabel(configRuntime,path):classificationPathKey(path)}] as const];})).values()];
const getLayersJSONOutputByWorkflowCatalogKey=(key:WorkflowCatalogExportKey)=>stringifyFeatureJsonArray(layers.flatMap(layer=>layer.jsonInfo?.featureInfo&&classificationPathKey(recordCategory(layer.jsonInfo.featureInfo))===key.slice(7)?[layer.jsonInfo.featureInfo]:[]));

const nativeLayerRecord = (layer: LayerType) => {
  const record=layer.jsonInfo?.featureInfo;
  if(!configRuntime||!record||!String(record.ID??'').trim()||!String(record.Class??'').trim())return undefined;
  return resolveGeometryProfile(configRuntime,recordCategory(record),geometryKindForDrawMode(layer.mode))?.enabled?record:undefined;
};
const getLayerDisplayTitle=(layer:LayerType)=>{const record=layer.jsonInfo?.featureInfo;return record?.ID?String(record.ID)+(record.Name?' '+String(record.Name):''):'#'+layer.id+' '+layer.mode;};
const getLayerPrimaryIdValue=(layer:LayerType)=>String(layer.jsonInfo?.featureInfo?.ID??'');
const getLayerPrimaryNameValue=(layer:LayerType)=>String(layer.jsonInfo?.featureInfo?.Name??'');

const csvEscape = (v: any) => {
  const s = v === null || v === undefined ? '' : String(v);

  // 额外处理少见“Unicode 换行符”，避免部分软件乱断行
  const normalized = s.replace(/\u2028|\u2029/g, ' ');

  const escaped = normalized.replace(/"/g, '""');
  return /[",\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
};

const buildBriefCsvFromLayers = (list: LayerType[], worldIdFallback: string) => {
  const header = ['Type', 'Class', 'World', 'ID', 'Name'];

  // Windows/Excel 更稳：用 CRLF
  const CRLF = '\r\n';

  const rows = list.map((l) => {
    const fi: any = l?.jsonInfo?.featureInfo ?? {};
    const cls = String(nativeLayerRecord(l)?.Class ?? l?.jsonInfo?.subType ?? '默认');

    const type =
      (fi?.Type ?? fi?.type) ??
      (l.mode === 'point' ? 'Point' : l.mode === 'polyline' ? 'Line' : 'Polygon');
    const world = (fi?.World ?? fi?.world ?? worldIdFallback) ?? '';
    const id = getLayerPrimaryIdValue(l);
    const name = getLayerPrimaryNameValue(l);

    return [type, cls, world, id, name].map(csvEscape).join(',');
  });

  // 加 BOM：Excel/WPS 双击打开更容易识别 UTF-8
  return `\uFEFF${header.join(',')}${CRLF}${rows.join(CRLF)}${CRLF}`;
};

const downloadTextFile = (text: string, filename: string, mime: string) => {
  try {
    // 这里 text 已含 BOM；如果你不想在 text 里加 BOM，也可以 Blob 前加 bytes
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch {
    // ignore
  }
};

const readTempRuleSources = (): Record<string, TempRuleSource[]> => readTemporaryRuleSources() as Record<string, TempRuleSource[]>;

const readTempRuleOverrideIds = (): Record<string, string[]> => readTemporaryRuleOverrideIds();


const readTempRuleDeleteIds = (): Record<string, string[]> => readTemporaryRuleDeleteIds();

const writeTempRuleDeleteIds = (all: Record<string, string[]>) => {
  writeTemporaryRuleDeleteIds(all);
  window.dispatchEvent(
    new CustomEvent('ria-temp-rule-deletes-changed', { detail: { worldId: currentWorldId } }),
  );
  requestTempMountNavigationRebuild(currentWorldId);
};

const clearTempRuleDeleteIdsForWorld = () => {
  const all = readTempRuleDeleteIds();
  if (all && typeof all === 'object' && (all as any)[currentWorldId]) {
    const next = { ...all } as any;
    delete next[currentWorldId];
    writeTempRuleDeleteIds(next);
  } else {
    window.dispatchEvent(
      new CustomEvent('ria-temp-rule-deletes-changed', { detail: { worldId: currentWorldId } }),
    );
  }
};

const syncTempRuleDeleteIdsForCurrentWorld = () => {
  const all = readTempRuleDeleteIds();
  const ids = relayPackageDraft.deleteMarks.map((x) => String(x.ID ?? '').trim()).filter(Boolean);
  if (ids.length > 0) writeTempRuleDeleteIds({ ...all, [currentWorldId]: Array.from(new Set(ids)) });
  else if ((all as any)[currentWorldId]) {
    const next = { ...all } as any;
    delete next[currentWorldId];
    writeTempRuleDeleteIds(next);
  } else {
    window.dispatchEvent(new CustomEvent('ria-temp-rule-deletes-changed', { detail: { worldId: currentWorldId } }));
  }
};

const requestTempMountNavigationRebuild = (worldId: string) => {
  const wid = String(worldId ?? '').trim();
  if (!wid) return;
  Promise.resolve().then(async () => {
    try {
      await rebuildRoadGraphCacheForWorld(wid);
    } catch {
      // ignore
    }
    try {
      await rebuildRailNewIndexCacheForWorld(wid);
    } catch {
      // ignore
    }
    try {
      await rebuildRailNewNavigationCacheForWorld(wid);
    } catch {
      // ignore
    }
    try {
      await rebuildTeleportNewCacheForWorld(wid);
    } catch {
      // ignore
    }
  });
};

const writeTempRuleOverrideIds = (all: Record<string, string[]>) => {
  writeTemporaryRuleOverrideIds(all);
  window.dispatchEvent(
    new CustomEvent('ria-temp-rule-overrides-changed', { detail: { worldId: currentWorldId } }),
  );
  requestTempMountNavigationRebuild(currentWorldId);
};

const clearTempRuleOverrideIdsForWorld = () => {
  const all = readTempRuleOverrideIds();
  if (all && typeof all === 'object' && (all as any)[currentWorldId]) {
    const next = { ...all } as any;
    delete next[currentWorldId];
    writeTempRuleOverrideIds(next);
  } else {
    // 仍然发事件，确保 RuleDrivenLayer 刷新
    window.dispatchEvent(
      new CustomEvent('ria-temp-rule-overrides-changed', { detail: { worldId: currentWorldId } }),
    );
  }
};

const writeTempRuleSources = (all: Record<string, TempRuleSource[]>) => {
  writeTemporaryRuleSources(all);
  window.dispatchEvent(new CustomEvent('ria-temp-rule-sources-changed', { detail: { worldId: currentWorldId } }));
  requestTempMountNavigationRebuild(currentWorldId);
};

const [tempMountUiVersion, setTempMountUiVersion] = useState(0);

const getLayerTempUid = (layerId: number) => `${currentWorldId}::layer-${layerId}`;

const getTempMountedEntryByLayer = (layerId: number): TempRuleSource | undefined => {
  const uid = getLayerTempUid(layerId);
  const all = readTempRuleSources();
  const list = (all?.[currentWorldId] ?? []) as any[];
  if (!Array.isArray(list)) return undefined;
  const found = list.find((x) => x && typeof x === 'object' && String((x as any).uid) === uid);
  return found as any;
};

const setTempMountedEnabledForLayer = (layerId: number, enabled: boolean) => {
  const uid = getLayerTempUid(layerId);
  const all = readTempRuleSources();
  const prev = Array.isArray(all?.[currentWorldId]) ? (all[currentWorldId] as any[]) : [];
  const next = prev.map((x) => {
    if (x && typeof x === 'object' && String((x as any).uid) === uid) {
      return { ...(x as any), enabled: Boolean(enabled) };
    }
    return x;
  });
  writeTempRuleSources({ ...all, [currentWorldId]: next as any });
  setTempMountUiVersion((v) => v + 1);
};

const removeAllTempMountedLayersForWorld = (layerIds: number[]) => {
  const all = readTempRuleSources();
  const prev = Array.isArray(all?.[currentWorldId]) ? (all[currentWorldId] as any[]) : [];
  const uidSet = new Set(layerIds.map((id) => getLayerTempUid(id)));
  const next = prev.filter((x) => !(x && typeof x === 'object' && uidSet.has(String((x as any).uid))));
  writeTempRuleSources({ ...all, [currentWorldId]: next as any });
  setTempMountUiVersion((v) => v + 1);
};


const buildTempRulePicturesByIdForLayer = (layer: LayerType): TempRuleSource['picturesById'] | undefined => {
  const id = String(getLayerPrimaryIdValue(layer) ?? '').trim();
  if (!id) return undefined;
  const src = relayPackageDraft.picturesById[id] ?? [];
  const active = src
    .filter((pic) => !pic.deleted)
    .map((pic, idx) => ({ pic, idx }))
    .sort((a, b) => {
      const ao = Number(a.pic.order ?? a.idx + 1);
      const bo = Number(b.pic.order ?? b.idx + 1);
      return ao - bo || a.idx - b.idx;
    })
    .map(({ pic }) => {
      const source: 'pub' | 'dat' | 'formal' | 'external' = pic.source === 'external' ? 'external' : pic.source === 'pub' || pic.source === 'dat' || pic.source === 'formal' ? pic.source : 'dat';
      const url = String(pic.externalUrl ?? pic.previewUrl ?? pic.relativePath ?? '').trim();
      return {
        source,
        url,
        filename: String(pic.originalName ?? '').trim() || undefined,
        relativePath: pic.relativePath,
      };
    })
    .filter((pic) => Boolean(pic.url || pic.relativePath));
  return active.length > 0 ? { [id]: active } : undefined;
};

const mountAllLayersToTempSources = (layerList: LayerType[]) => {
  const all = readTempRuleSources();
  const prev = Array.isArray(all?.[currentWorldId]) ? (all[currentWorldId] as any[]) : [];

  // 先移除同 uid 的旧条目（避免重复）
  const uidSet = new Set(layerList.map((l) => getLayerTempUid(l.id)));
  const kept = prev.filter((x) => !(x && typeof x === 'object' && uidSet.has(String((x as any).uid))));

  const nextEntries: TempRuleSource[] = [];
  for (const layer of layerList) {
    let items: any[] = [];
    try {
      const one = JSON.parse(layerToJsonText(layer));
      if (Array.isArray(one)) items = one;
    } catch {
      items = [];
    }
    if (!items.length) continue;
    const picturesById = buildTempRulePicturesByIdForLayer(layer);
    nextEntries.push({
      uid: getLayerTempUid(layer.id),
      worldId: currentWorldId,
      label: getLayerDisplayTitle(layer),
      enabled: Boolean(layer.visible),
      items,
      ...(picturesById ? { picturesById } : {}),
    });
  }

  writeTempRuleSources({ ...all, [currentWorldId]: [...kept, ...nextEntries] as any });
  setTempMountUiVersion((v) => v + 1);
};

//（单图层临时挂载按钮已被“全局临时挂载”替代，故移除相关逻辑）
// ======== 临时挂载(全局)状态同步：若当前 world 存在 layer-* 的临时源，则视为已进入挂载模式 ========
useEffect(() => {
  const sync = () => {
    const all = readTempRuleSources();
    const list = (all?.[currentWorldId] ?? []) as any[];
    const has = Array.isArray(list) && list.some((x) => {
      const uid = x && typeof x === 'object' ? String((x as any).uid ?? '') : '';
      return uid.startsWith(`${currentWorldId}::layer-`);
    });
    setTempMountAllActive(has);
  };

  sync();
  const handler = () => sync();
  window.addEventListener('ria-temp-rule-sources-changed', handler as any);
  return () => window.removeEventListener('ria-temp-rule-sources-changed', handler as any);
}, [currentWorldId]);

useEffect(() => {
  if (!tempMountAllActive) return;
  syncTempRuleDeleteIdsForCurrentWorld();
}, [tempMountAllActive, relayPackageDraft.deleteMarks, currentWorldId]);

// ======== 图层管理：顶部横向滚动条（始终可见）与内容区横向滚动同步 ========
const layerMgrTopXRef = useRef<HTMLDivElement | null>(null);
const layerMgrBodyRef = useRef<HTMLDivElement | null>(null);
const layerMgrSpacerRef = useRef<HTMLDivElement | null>(null);
const layerMgrSyncLockRef = useRef(false);
const layerMgrCardRef = useRef<HTMLDivElement | null>(null);
const [layerMgrListMaxHeight, setLayerMgrListMaxHeight] = useState(280);

useEffect(() => {
  const top = layerMgrTopXRef.current;
  const body = layerMgrBodyRef.current;
  const spacer = layerMgrSpacerRef.current;
  if (!top || !body || !spacer) return;

  const syncSpacerWidth = () => {
    spacer.style.width = `${body.scrollWidth}px`;
  };
  syncSpacerWidth();

  const onTopScroll = () => {
    if (layerMgrSyncLockRef.current) return;
    layerMgrSyncLockRef.current = true;
    body.scrollLeft = top.scrollLeft;
    layerMgrSyncLockRef.current = false;
  };
  const onBodyScroll = () => {
    if (layerMgrSyncLockRef.current) return;
    layerMgrSyncLockRef.current = true;
    top.scrollLeft = body.scrollLeft;
    layerMgrSyncLockRef.current = false;
  };

  top.addEventListener('scroll', onTopScroll);
  body.addEventListener('scroll', onBodyScroll);

  const ro = new ResizeObserver(syncSpacerWidth);
  ro.observe(body);

  return () => {
    top.removeEventListener('scroll', onTopScroll);
    body.removeEventListener('scroll', onBodyScroll);
    ro.disconnect();
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [layers.length, tempMountAllActive, tempMountUiVersion, measuringActive, layerMgrListMaxHeight]);

useEffect(() => {
  if (!measuringActive) return;

  let frame = 0;
  const updateListMaxHeight = () => {
    if (frame) window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      const card = layerMgrCardRef.current;
      const body = layerMgrBodyRef.current;
      if (!card || !body) return;

      const panelMaxHeight = Math.floor(window.innerHeight * 0.7);
      const cardTop = card.getBoundingClientRect().top;
      const bodyTop = body.getBoundingClientRect().top;
      const fixedHeight = Math.max(0, bodyTop - cardTop);
      const next = Math.max(120, panelMaxHeight - fixedHeight - 12);
      setLayerMgrListMaxHeight((prev) =>
        Math.abs(prev - next) > 1 ? next : prev,
      );
    });
  };

  updateListMaxHeight();
  window.addEventListener('resize', updateListMaxHeight);

  const observer = typeof ResizeObserver !== 'undefined'
    ? new ResizeObserver(updateListMaxHeight)
    : null;
  if (observer) {
    if (layerMgrCardRef.current) observer.observe(layerMgrCardRef.current);
    if (layerMgrTopXRef.current) observer.observe(layerMgrTopXRef.current);
  }

  return () => {
    window.removeEventListener('resize', updateListMaxHeight);
    observer?.disconnect();
    if (frame) window.cancelAnimationFrame(frame);
  };
}, [
  measuringActive,
  layers.length,
  tempMountAllActive,
  tempMountUiVersion,
  relayPackageDraft.deleteMarks.length,
  relayPackageDraft.meta.draftStatus,
  relayPackageDraft.meta.operator,
  relayPackageDraft.meta.note,
  relayPackageDraft.meta.packageVersion,
  relayPackageDraft.meta.updatedAt,
]);

 
const handleUndo = () => {
  if (!tempPoints.length) return;

  const last = tempPoints[tempPoints.length - 1];
  setRedoStack((prev) => [...prev, last]);

  const updated = tempPoints.slice(0, tempPoints.length - 1);
  if (!acceptActiveMultipartCoords(updated)) return;
  if (multipartEnabledRef.current) persistActiveEditorCoords(updated);
  setTempPoints(updated);

  drawDraftGeometry(updated, drawMode, drawColorRef.current);

  if (updated.length === 0) draftEndpointRef.current?.clearLayers();
  else updateLatestEndpointMarker(updated[updated.length - 1], drawColorRef.current);
};

const handleRedo = () => {
  if (!redoStack.length) return;

  const redoPoint = redoStack[redoStack.length - 1];
  setRedoStack((prev) => prev.slice(0, prev.length - 1));

  const updated = [...tempPoints, redoPoint];
  if (!acceptActiveMultipartCoords(updated)) return;
  if (multipartEnabledRef.current) persistActiveEditorCoords(updated);
  setTempPoints(updated);

  drawDraftGeometry(updated, drawMode, drawColorRef.current);
  updateLatestEndpointMarker(redoPoint, drawColorRef.current);
};

// Normal drawing owns browser-style history only while no focused text editor
// or specialised tool owns it. ControlPointsT keeps its own transactional
// undo/redo and therefore deliberately takes precedence.
useEffect(() => {
  const onKeyDown = (event: KeyboardEvent) => {
    if (!measuringActive || !drawing || drawMode === 'none') return;
    if (manualPointInputOpen || curveInputOpen || controlPointSessionBusy) return;
    const target = event.target as HTMLElement | null;
    const tag = target?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || target?.isContentEditable) return;
    if (!(event.ctrlKey || event.metaKey) || event.altKey) return;

    const key = event.key.toLowerCase();
    if (key === 'z' && !event.shiftKey) {
      if (!tempPoints.length) return;
      event.preventDefault();
      handleUndo();
      return;
    }
    if (key === 'y' || (key === 'z' && event.shiftKey)) {
      if (!redoStack.length) return;
      event.preventDefault();
      handleRedo();
    }
  };
  window.addEventListener('keydown', onKeyDown);
  return () => window.removeEventListener('keydown', onKeyDown);
}, [measuringActive, drawing, drawMode, manualPointInputOpen, curveInputOpen, controlPointSessionBusy, tempPoints, redoStack]);

 
 
 // ========= 清除所有图层 =========
const clearAllLayers = () => {
  // 1) 清空三个容器（fixed + workflow + draft）
  fixedRootRef.current?.clearLayers();
  workflowRootRef.current?.clearLayers();
  workflowPreviewMapRef.current.clear();
  clearDraftOverlays();
  resetMultipartEditor();

  // 2) 清空 state
  setLayers([]);

  // 3) 重置绘制/编辑态
  setTempPoints([]);
  setRedoStack([]);
  setEditingLayerId(null);
  setDrawing(false);
  setDrawMode('none');
    resetWorkflowStyleEditorState();
    resetMultipartEditor();

  // 4) 工作流态复位
  setWorkflowRunning(false);

  // 控制点显示也复位（避免下次进来直接常显）
  setShowDraftControlPoints(false);
  setShowDraftControlPointCoords(false);

  clearControlPointSessionState();
  setShowDraftControlPointsLocked(false);
};




 
 
 const toggleLayerVisible = (id: number) => {
   setLayers(prev => {
     const next = prev.map(l => (l.id === id ? { ...l, visible: !l.visible } : l));
 
     // 编辑中的层：只改状态，不把它塞回 fixedRoot（否则会“编辑层 + 固定层”并存成幽灵）
     // 非编辑层：用 fixedRoot 统一重建，确保顺序/显隐与状态一致
     syncFixedRoot(next, editingLayerId);
 
     return next;
   });
 };
 
 
 
 const moveLayerUp = (id: number) => {
   setLayers(prev => {
     const idx = prev.findIndex(l => l.id === id);
     if (idx <= 0) return prev;
 
     const next = [...prev];
     [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
 
     syncFixedRoot(next, editingLayerId);
     return next;
   });
 };
 
 
 const moveLayerDown = (id: number) => {
   setLayers(prev => {
     const idx = prev.findIndex(l => l.id === id);
     if (idx < 0 || idx >= prev.length - 1) return prev;
 
     const next = [...prev];
     [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
 
     syncFixedRoot(next, editingLayerId);
     return next;
   });
 };
 
 
 // --------- 当前临时输出文本 ---------
const currentTempOutput = () => {
  if (tempPoints.length === 0 || drawMode === 'none') return '';

  if(nativeEdit||externalEdit||fullExternalCreate)return '';


  const pts = tempPoints.map((p) => `${formatGridNumber(p.x)},${formatGridNumber(p.z)}`);

  if (drawMode === 'point') return `<point:${pts.join(';')}>`;
  if (drawMode === 'polyline') return `<polyline:${pts.join(';')}>`;
  return `<polygon:${pts.join(';')}>`;
};

 
const editLayer = (id: number) => {
  if (guardTempMountReadonly()) return;
  const layer = layers.find(l => l.id === id);
  if (!layer) return;
  let nativeContext:typeof nativeEdit=null;
  let externalContext:typeof externalEdit=null;
  if(configRuntime&&layer.jsonInfo?.featureInfo)try {
    const workflow=findEditingWorkflow(configRuntime,layer.jsonInfo.featureInfo);
    if(workflow?.mode==='composed'){const config=structuredClone(configRuntime),plan=compileWorkflowEditPlan(workflow,config),original=structuredClone(layer.jsonInfo.featureInfo);nativeContext={config,plan,original,draft:hydrateWorkflowEdit(plan,original),world:normalizeV3WorldId(String(original.World??currentWorldId))};}
    else if(workflow?.mode==='external'&&workflow.external?.purpose==='edit'){const config=structuredClone(configRuntime),session=createTrpExternalEditSession(config,workflow,layer.jsonInfo.featureInfo);externalContext={config,workflow:structuredClone(workflow),session,world:normalizeV3WorldId(String(session.original.World??currentWorldId))};}
  }catch(error){alert(error instanceof Error?error.message:'工作流编辑回填失败。');return;}

  if(layer.jsonInfo?.featureInfo?.Class&&!nativeContext&&!externalContext){alert('该分类没有启用的编辑方案，原图层保持。');return;}

  // 从固定容器移除（用 removeLayer 更稳）
  fixedRootRef.current?.removeLayer(layer.leafletGroup);

  // 备份原始坐标
  editingBackupCoordsRef.current = layer.coords;

  const geometryKind = geometryKindForDrawMode(layer.mode);
  const persistedGeometry = readMultipartGeometry(layer.jsonInfo?.featureInfo, geometryKind);
  if (persistedGeometry.geometry) {
    multipartDraftRef.current = persistedGeometry.geometry;
    const hasMultipleParts = persistedGeometry.geometry.parts.length > 1;
    const hasHoles = persistedGeometry.geometry.type === 'Polygon' && persistedGeometry.geometry.parts.some((part) => part.length > 1);
    multipartEnabledRef.current = hasMultipleParts || hasHoles;
    setMultipartEnabled(hasMultipleParts || hasHoles);
    setActiveMultipartPart(0);
    activeMultipartPartRef.current = 0;
    setInnerSpaceEnabled(false);
    innerSpaceEnabledRef.current = false;
    setEditSelectedInnerSpace(false);
    editSelectedInnerSpaceRef.current = false;
    setActiveInnerSpace(0);
    activeInnerSpaceRef.current = 0;
  } else {
    resetMultipartEditor();
  }

  // 进入编辑态
  setEditingLayerId(id);
  setDrawing(true);
  setDrawMode(layer.mode);
  setDrawColor(layer.color);

  // 恢复坐标并画草稿
  const editCoords = persistedGeometry.geometry
    ? activeEditorCoordsFromMultipart(persistedGeometry.geometry)
    : layer.coords;
  setTempPoints(editCoords);
  drawDraftGeometry(editCoords, layer.mode, layer.color);

  resetWorkflowStyleEditorState();

  setFeatureInfo(layer.jsonInfo?.featureInfo??{});setGroupInfo({});
  const path=layer.jsonInfo?.featureInfo?.Class?recordCategory(layer.jsonInfo.featureInfo):{class:''};
  setFullCategory(path);setSubType(path.class?classificationPathKey(path):'默认');
  if(nativeContext){setNativeEdit(nativeContext);setEditUiMode('native-workflow');}
  if(externalContext){setExternalEdit(externalContext);setEditUiMode('external-workflow');}

};


 
 
 
 
 
 
 
 // ========= 删除图层 =========
 const deleteLayer = (id: number) => {
   setLayers(prev => {
     const target = prev.find(l => l.id === id);
 
     // 先从固定容器移除（不要只 target.leafletGroup.remove()，否则可能仍残留在父 group 里，后续会“复活”）:contentReference[oaicite:3]{index=3}
     if (target) {
       fixedRootRef.current?.removeLayer(target.leafletGroup);
     }
 
if (editingLayerId === id) {
  clearDraftOverlays();
  setTempPoints([]);
  setRedoStack([]);
  resetWorkflowStyleEditorState();
}

 
     const next = prev.filter(l => l.id !== id);
 
     syncFixedRoot(next, editingLayerId === id ? null : editingLayerId);
     return next;
   });
 };
 
 
 

 
// ---------- 批量导入（文本/文件）：只支持“新规范 JSON 条目” ----------
// Batch import uses the current package native record contract.


const runBatchImportFromText = (rawText: string, sourceLabel: string) => {
  const text = String(rawText ?? '').trim();
  if (!text) return;

  const proj = projectionRef.current;
  const fixedRoot = fixedRootRef.current;

  if (!proj || !fixedRoot) {
    alert('地图/固定图层容器尚未就绪，无法导入');
    return;
  }

  const tryParseFlexible = (raw: string): any => {
    const t = String(raw ?? '').trim();
    if (!t) return null;
    try {
      return JSON.parse(t);
    } catch {
      // ignore
    }
    const normalized = t
      .replace(/\r\n/g, '\n')
      .replace(/\n+/g, '\n')
      .replace(/}\s*,\s*{/g, '},{')
      .replace(/}\s*\n\s*{/g, '},{')
      .trim()
      .replace(/,\s*$/g, '');
    const wrapped = `[${normalized}]`;
    try {
      return JSON.parse(wrapped);
    } catch {
      return null;
    }
  };

  const parsed = tryParseFlexible(text);
  if (!parsed) {
    alert(`${sourceLabel}：只支持合法 JSON（可为数组/对象/单对象，或多对象但外层未包 []）。`);
    return;
  }

  let items: any[] = [];
  if (Array.isArray(parsed)) items = parsed;
  else if (parsed && typeof parsed === 'object') {
    if (Array.isArray((parsed as any).items)) items = (parsed as any).items;
    else if (Array.isArray((parsed as any).features)) items = (parsed as any).features;
    else items = [parsed];
  }

  if (!items.length) {
    alert(`${sourceLabel}失败：未找到可导入条目（需要数组或包含 items/features 的对象）。`);
    return;
  }

  const errors: string[] = [];
  const newLayers: LayerType[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    let nativeImport:ReturnType<typeof prepareDownstreamNativeImport>|undefined;
    if(configRuntime)try{nativeImport=prepareDownstreamNativeImport(configRuntime,item,currentWorldId,useRuleDataStore.getState().datasets[normalizeV3WorldId(currentWorldId)]?.features??[]);}catch(error){errors.push(`${sourceLabel} 第 ${i+1} 条：${error instanceof Error?error.message:'原生记录无效。'}`);continue;}
    if(!nativeImport){errors.push(sourceLabel+' 第 '+(i+1)+' 条：缺少当前正式配置，无法核验原生记录。');continue;}
    const mode=nativeImport.mode,coords=nativeImport.coords,importedGeometry={geometry:nativeImport.geometry},featureInfoOut=nativeImport.record;
    const itemColor = randomColor();
    const group = L.layerGroup();

    const yForDisplay =
      Number.isFinite(Number((item as any)?.height)) ? Number((item as any).height)
      : Number.isFinite(Number((item as any)?.heightH)) ? Number((item as any).heightH)
      : 64;

    const latlngs = coords.map(p => proj.locationToLatLng(p.x, yForDisplay, p.z));
    const toLatLng = (point: { x: number; y: number; z: number }) =>
      proj.locationToLatLng(point.x, yForDisplay, point.z);

    if (mode === 'point') {
      const points = importedGeometry.geometry.type === 'Point'
        ? importedGeometry.geometry.parts.map(toLatLng)
        : latlngs;
      points.forEach(ll => {
        L.circleMarker(ll, { color: itemColor, fillColor: itemColor, radius: 6 }).addTo(group);
      });
    } else if (mode === 'polyline') {
      const parts = importedGeometry.geometry.type === 'LineString'
        ? importedGeometry.geometry.parts.map((part) => part.map(toLatLng))
        : latlngs;
      L.polyline(parts as any, { color: itemColor }).addTo(group);
    } else {
      const parts = importedGeometry.geometry.type === 'Polygon'
        ? importedGeometry.geometry.parts.map((part) => part.map((ring) => ring.map(toLatLng)))
        : latlngs;
      L.polygon(parts as any, { color: itemColor }).addTo(group);
    }

    const id = nextLayerId.current++;
    newLayers.push({
      id,
      mode,
      color: itemColor,
      coords,
      visible: true,
      leafletGroup: group,
      jsonInfo: {
        subType: classificationPathKey(recordCategory(featureInfoOut)),
        featureInfo: featureInfoOut,
      },
    });
  }

  if (errors.length) {
    alert(`批量导入部分失败：\n\n${errors.slice(0, 10).join('\n\n')}${errors.length > 10 ? `\n\n...(共 ${errors.length} 条错误)` : ''}`);
    return;
  }

  setLayers(prev => {
    const next = [...prev, ...newLayers];
    syncFixedRoot(next, editingLayerId);
    return next;
  });
};


const resolveMergedRelayDraftStatus = (
  base: RelayPackageDraft,
  incoming: RelayPackageDraft,
): RelayPackageDraftStatus => {
  const incomingStatus = incoming.meta.draftStatus;
  const baseStatus = base.meta.draftStatus;
  if (incomingStatus === 'imported_package') return 'imported_package';
  if (baseStatus === 'imported_package') return 'imported_package';
  if (baseStatus === 'exported_draft' || incomingStatus === 'exported_draft') return 'exported_draft';
  return 'new_draft';
};

const buildRelayPackageVersionStamp = (): string => {
  const now = new Date();
  const y = String(now.getFullYear());
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `draft-${y}${m}${d}-${hh}${mm}${ss}`;
};

const mergeRelayPackageDrafts = (base: RelayPackageDraft, incoming: RelayPackageDraft): RelayPackageDraft => {
  const nextDeleteMarks = new Map<string, any>();
  for (const item of base.deleteMarks) nextDeleteMarks.set(item.ID, item);
  for (const item of incoming.deleteMarks) nextDeleteMarks.set(item.ID, item);

  const nextPicturesById = { ...base.picturesById };
  for (const [id, pictures] of Object.entries(incoming.picturesById ?? {})) {
    nextPicturesById[id] = pictures;
  }

  const nextStatus = resolveMergedRelayDraftStatus(base, incoming);
  const incomingVersion = incoming.meta.packageVersion;
  const baseVersion = base.meta.packageVersion;

  return {
    meta: {
      ...base.meta,
      operator: base.meta.operator || incoming.meta.operator,
      note: base.meta.note || incoming.meta.note,
      draftStatus: nextStatus,
      updatedAt: new Date().toISOString(),
      packageVersion: incomingVersion ?? baseVersion,
      schemaVersion: incoming.meta.schemaVersion || base.meta.schemaVersion,
    },
    deleteMarks: Array.from(nextDeleteMarks.values()),
    picturesById: nextPicturesById,
  };
};

const applyParsedRelayPackage = (parsed: { draft: RelayPackageDraft; jsonItems: any[] }) => {
  const incomingIdSet = new Set<string>();
  for (const item of parsed.jsonItems) {
    if (!item || typeof item !== 'object') continue;
    const cls = String((item as any)?.Class ?? '').trim();
    const { idValue } = pickIdFieldValue(item as any, cls);
    const id = String(idValue ?? '').trim();
    if (id) incomingIdSet.add(id);
  }

  if (incomingIdSet.size > 0) {
    setLayers((prev) => {
      const removed = prev.filter((l) => {
        const fi = l.jsonInfo?.featureInfo as any;
        const cls = String(fi?.Class ?? l.jsonInfo?.subType ?? '').trim();
        const { idValue } = pickIdFieldValue(fi, cls);
        const id = String(idValue ?? '').trim();
        return id && incomingIdSet.has(id);
      });
      for (const layer of removed) {
        fixedRootRef.current?.removeLayer(layer.leafletGroup);
      }
      const next = prev.filter((l) => {
        const fi = l.jsonInfo?.featureInfo as any;
        const cls = String(fi?.Class ?? l.jsonInfo?.subType ?? '').trim();
        const { idValue } = pickIdFieldValue(fi, cls);
        const id = String(idValue ?? '').trim();
        return !(id && incomingIdSet.has(id));
      });
      syncFixedRoot(next, editingLayerId);
      return next;
    });
  }

  setRelayPackageDraft((prev) => mergeRelayPackageDrafts(prev, parsed.draft));
  if (Array.isArray(parsed.jsonItems) && parsed.jsonItems.length > 0) {
    runBatchImportFromText(JSON.stringify(parsed.jsonItems, null, 2), '标准包导入');
  }
};



const buildRelayDraftFromReviewItem = (item: ReviewInboxItem): RelayPackageDraft => {
  const draft = createEmptyRelayPackageDraft();
  const picturesById: RelayPackageDraft['picturesById'] = {};
  for (const [id, entries] of Object.entries(item.picturesById ?? {})) {
    picturesById[id] = (entries ?? []).map((entry, index) => ({
      uid: `review:${item.packageId}:${id}:${index}`,
      originalName: entry.filename || `${id}_${index + 1}.png`,
      relativePath: entry.relativePath,
      previewUrl: entry.url,
      deleted: false,
      order: index + 1,
      source: entry.source,
    }));
  }
  return {
    meta: {
      ...draft.meta,
      operator: item.meta?.operator ?? item.review?.reviewer ?? '',
      note: item.meta?.note ?? `review:${item.packageId}`,
      draftStatus: 'imported_package',
      updatedAt: new Date().toISOString(),
      packageVersion: item.meta?.packageVersion,
    },
    deleteMarks: item.deleteMarks ?? [],
    picturesById,
  };
};

const reviewBaselineSignatureRef = useRef<string | null>(null);
const reviewDirtyRef = useRef(false);
const reviewJustLoadedRef = useRef(false);
const [reviewActionDirty, setReviewActionDirty] = useState(false);
const [reviewSaveInProgress, setReviewSaveInProgress] = useState(false);
const [reviewNotice, setReviewNotice] = useState<string | null>(null);

const applyReviewInboxItemToWorkspace = (item: ReviewInboxItem) => {
  if (!item) return;
  onBecameActive?.();
  clearAllLayers();
  clearTempRuleOverrideIdsForWorld();
  clearTempRuleDeleteIdsForWorld();
  setTempMountAllActive(false);
  resetFeatureSelectionState();
  setImportPanelOpen(false);
  setWorkflowRunning(false);
  setMeasureDropdownOpen(false);
  setMeasuringVariant('full');
  setDrawing(false);
  setDrawMode('none');
  setTempPoints([]);
  setRedoStack([]);
  setEditingLayerId(null);
  reviewBaselineSignatureRef.current = null;
  reviewDirtyRef.current = false;
  reviewJustLoadedRef.current = true;
  onReviewDirtyChange?.(false);
  setMeasuringActive(true);
  applyParsedRelayPackage({
    draft: buildRelayDraftFromReviewItem(item),
    jsonItems: Array.isArray(item.features) ? item.features : [],
  });
};

useEffect(() => {
  if (!isReviewWorkspace) return;
  const handler = (ev: Event) => {
    const item = (ev as CustomEvent<ReviewInboxItem>).detail;
    if (!item) return;
    applyReviewInboxItemToWorkspace(item);
  };
  window.addEventListener('ria:reviewLoadPackageIntoWorkspace', handler as EventListener);
  return () => window.removeEventListener('ria:reviewLoadPackageIntoWorkspace', handler as EventListener);
}, [isReviewWorkspace, currentWorldId, onReviewDirtyChange]);

const applyMinimalFeatureEditPackage = (pkg: MinimalFeatureEditPackage) => {
  const item = (pkg?.feature ?? {}) as any;
  if (!item || typeof item !== 'object') return;

  const cls = String(item.Class ?? '').trim();
  const { idValue } = pickIdFieldValue(item, cls);
  const id = String(idValue ?? '').trim();
  if (!id) return;

  const incomingDraft: RelayPackageDraft = {
    ...createEmptyRelayPackageDraft(),
    picturesById: {
      [id]: (pkg.pictures ?? []).map((pic, idx) => ({
        uid: `${id}:${pic.filename ?? idx + 1}:${Date.now()}`,
        originalName: pic.filename || `${id}_${idx + 1}.png`,
        relativePath: pic.relativePath,
        previewUrl: pic.url,
        deleted: false,
        order: idx + 1,
        source: pic.source,
      })),
    },
    meta: {
      ...createEmptyRelayPackageDraft().meta,
      draftStatus: 'new_draft',
      updatedAt: new Date().toISOString(),
      packageVersion: undefined,
    },
  };

  applyParsedRelayPackage({ draft: incomingDraft, jsonItems: [item] });
};

useEffect(() => {
  const handler = (ev: Event) => {
    const detail = (ev as CustomEvent<MinimalFeatureEditPackage>).detail;
    if (!detail) return;
    const requestId = String((detail as any)?.__riaImportRequestId ?? '').trim();
    try {
      applyMinimalFeatureEditPackage(detail);
      if (!measuringActive) {
        setMeasuringActive(true);
      }
    } finally {
      if (requestId) {
        window.dispatchEvent(new CustomEvent('ria:importFeatureEditPackageDone', { detail: { requestId } }));
      }
    }
  };
  window.addEventListener('ria:importFeatureEditPackage', handler as EventListener);
  return () => window.removeEventListener('ria:importFeatureEditPackage', handler as EventListener);
}, [measuringActive, currentWorldId, layers, relayPackageDraft]);

const layerDeleteCandidateFromLayer = (layer: LayerType) => {
  const fi = layer.jsonInfo?.featureInfo as any;
  const cls = String(fi?.Class ?? layer.jsonInfo?.subType ?? '').trim();
  const { idValue } = pickIdFieldValue(fi, cls);
  const id = String(idValue ?? '').trim();
  if (!id) return null;
  return {
    ID: id,
    Name: String(fi?.Name ?? fi?.Label ?? '').trim() || getLayerDisplayTitle(layer),
    className: cls,
    worldId: resolveRelayPackageWorldId(fi?.World, currentWorldId),
  };
};

const buildDeleteCandidatesFromLayers = (): DeletePanelItem[] => layers.reduce<DeletePanelItem[]>((acc, l) => {
  if (l.id === editingLayerId || !l.jsonInfo?.featureInfo) return acc;
  const candidate = layerDeleteCandidateFromLayer(l);
  if (candidate) acc.push(candidate);
  return acc;
}, []);

const getLayerPictureBindingContext = (layerId: number | null) => {
  const layer = layers.find((l) => l.id === layerId);
  if (!layer || !layer.jsonInfo?.featureInfo) return null;
  const fi = layer.jsonInfo.featureInfo as any;
  const cls = String(fi?.Class ?? layer.jsonInfo.subType ?? '').trim();
  const { idValue } = pickIdFieldValue(fi, cls);
  const id = String(idValue ?? '').trim();
  if (!id) return null;
  const name = String(fi?.Name ?? fi?.Label ?? getLayerDisplayTitle(layer)).trim() || id;
  return {
    id,
    title: `${name} 图片绑定`,
    pictures: relayPackageDraft.picturesById[id] ?? [],
  };
};

const applyPictureBindingForLayer = (layerId: number | null, pictures: any[]) => {
  const ctx = getLayerPictureBindingContext(layerId);
  if (!ctx) return;
  setRelayPackageDraft((prev) => ({
    ...prev,
    picturesById: { ...prev.picturesById, [ctx.id]: pictures },
    meta: { ...prev.meta, updatedAt: new Date().toISOString() },
  }));
  setPicturePanelOpen(false);
};

const buildRelayPackageArtifact = async (operator: string, note: string): Promise<{ blob: Blob; filename: string; nextMeta: RelayPackageDraft['meta'] }> => {
  const visibleList = layers.filter((l) => l.id !== editingLayerId);
  const packageVersion = buildRelayPackageVersionStamp();
  const nextMeta = {
    ...relayPackageDraft.meta,
    operator,
    note,
    draftStatus: 'exported_draft' as RelayPackageDraftStatus,
    packageVersion,
    updatedAt: new Date().toISOString(),
  };
  let blob: Blob;
  try {
    blob = await buildRelayPackageZip({
      layers: visibleList as any,
      currentWorldId,
      draft: {
        ...relayPackageDraft,
        meta: nextMeta,
      },
      operator,
      note,
    });
  } catch (error) {
    throw new Error(`标准包生成失败：${String((error as Error)?.message ?? error ?? '未知错误')}`);
  }
  const now = new Date();
  const y = String(now.getFullYear());
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const filename = `RelayPackage_${sanitizeFilenamePart(operator)}_${sanitizeFilenamePart(currentWorldId)}_${y}${m}${d}${hh}${mm}.zip`;
  return { blob, filename, nextMeta };
};

const handleExportRelayPackage = async (operator: string, note: string): Promise<{ blob: Blob; filename: string }> => {
  const artifact = await buildRelayPackageArtifact(operator, note);
  setRelayPackageDraft((prev) => ({ ...prev, meta: { ...prev.meta, ...artifact.nextMeta } }));
  return artifact;
};

const handleImport = () => {
  runBatchImportFromText(importText, '文本导入');
  setImportText('');
  setImportPanelOpen(false);
};

const handleUploadFileClick = () => {
  importFileInputRef.current?.click();
};

const handleImportFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  e.target.value = ''; // 允许重复选同一文件
  if (!file) return;
  setImportFileBusy(true);
  try {
    const name = file.name || '文件';
    const lower = name.toLowerCase();
    if (lower.endsWith('.json')) {
      const text = await file.text();
      runBatchImportFromText(text, `文件导入：${name}`);
      setImportPanelOpen(false);
      return;
    }
    if (!lower.endsWith('.zip')) {
      alert(`仅支持上传 .zip 或 .json 文件：${name}`);
      return;
    }

    // 先尝试按 RelayPackage 解析。
    // 若 ZIP 已具备 RelayPackage 结构，则不允许回退到旧 ZIP JSON 导入，避免 INDEX/Delete/Picture/Tool_Refresh 被误处理。
    try {
      const parsed = await materializeRiaReviewPackageForWorkspace(file);
      if (parsed.isRelayPackageLike) {
        if (
          (Array.isArray(parsed.jsonItems) && parsed.jsonItems.length > 0) ||
          parsed.parsedPictureCount > 0 ||
          parsed.parsedDeleteCount > 0
        ) {
          applyParsedRelayPackage(parsed);
          setImportPanelOpen(false);
          return;
        }

        alert(
          '标准包结构无法解析：检测到 RelayPackage 结构，但未找到可导入的 Data_Spilt 条目、图片或删除标记。请检查包内 INDEX.json / Data_Spilt / Picture / Delete.json 结构。'
        );
        return;
      }
    } catch (err: any) {
      alert(`标准包结构无法解析：${String(err?.message ?? err)}`);
      return;
    }

    // 非 RelayPackage ZIP：动态加载 jszip，回退旧 ZIP 批量 JSON 导入。
    // - 使用 @ts-ignore 避免在未安装依赖时直接 TypeScript 编译报错
    // - 运行时若缺失，会给出安装提示
    let JSZip: any = null;
    try {
      // @ts-ignore
      JSZip = (await import('jszip')).default;
    } catch {
      alert('无法解压 ZIP：缺少依赖 jszip。请先安装：npm i jszip');
      return;
    }

    const buf = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(buf);
    const errors: string[] = [];
    const jsonFiles: Array<{ path: string; text: string }> = [];

    const entries = Object.values(zip.files) as any[];
    for (const f of entries) {
      if (f.dir) continue;
      const p = String(f.name || '');
      if (!p.toLowerCase().endsWith('.json')) {
        errors.push(`ZIP 包含非 JSON 文件：${p}`);
        continue;
      }
      try {
        const t = await f.async('string');
        jsonFiles.push({ path: p, text: t });
      } catch (err: any) {
        errors.push(`读取 JSON 失败：${p}（${String(err?.message ?? err)}）`);
      }
    }

    if (!jsonFiles.length) {
      alert(`ZIP 内未找到 .json 文件。${errors.length ? `\n\n${errors.slice(0, 10).join('\n')}` : ''}`);
      return;
    }

    for (const jf of jsonFiles) {
      try {
        runBatchImportFromText(jf.text, `ZIP 导入：${jf.path}`);
      } catch (err: any) {
        errors.push(`导入失败：${jf.path}（${String(err?.message ?? err)}）`);
      }
    }

    if (errors.length) {
      alert(`上传导入完成，但存在问题：\n\n${errors.slice(0, 15).join('\n')}${errors.length > 15 ? `\n...(共 ${errors.length} 条)` : ''}`);
    }
    setImportPanelOpen(false);
  } finally {
    setImportFileBusy(false);
  }
};



const selectFullCategory=(path:ClassificationPath)=>{
  if(drawMode==='none'||!configRuntime)return;
  const mode=geometryKindForDrawMode(drawMode);
  const apply=()=>{
    const config=nativeEdit?.config??externalEdit?.config??fullExternalCreate?.config??configRuntime;
    const complete=multipartDraftRef.current;
    if(complete&&complete.parts.length>1&&resolveGeometryProfile(config,path,mode)?.enabled&&!categoryAllowsParts(config,path,mode)){alert('目标分类禁止多部件，请先处理部件；完整草稿保持。');return;}
    setFullCategory(path);setFullCategoryError('');
    if(nativeEdit?.original){
      if(!nativeEdit.plan.classifications.some(candidate=>classificationPathKey(candidate)===classificationPathKey(path))){setFullCategoryError('请选择当前编辑方案接纳的实际分类；可继续展开下级。');return;}
      const slots={...nativeEdit.draft.slots};for(const control of nativeEdit.plan.controls)if(control.kind==='classificationPicker')slots[control.slot??control.id]=JSON.stringify(path);
      setNativeEdit({...nativeEdit,draft:{...nativeEdit.draft,classification:path,slots}});return;
    }
    if(externalEdit){
      const scope=externalEdit.workflow.editor?.scope??externalEdit.workflow.target;
      if(!scope||!pathMatchesScope(path,scope)||!externalRolePaths(config,externalEdit.workflow,'tradePoint').some(candidate=>classificationPathKey(candidate)===classificationPathKey(path))){setFullCategoryError('请选择专用编辑范围内的有效分类。');return;}
      setExternalEdit({...externalEdit,session:{...externalEdit.session,view:specializedFormView(config,externalEdit.workflow,path,'tradePoint'),values:{...externalEdit.session.values,__workflowEditorClassification:[path.kind??'',path.skind??'',path.skind2??''].join('||')}}});return;
    }
    if(nativeEdit&&classificationPathKey(nativeEdit.draft.classification)===classificationPathKey(path))return;
    setNativeEdit(null);setExternalEdit(null);setFullExternalCreate(null);setEditUiMode('full-fallback');resetSpecialDrafts();
    setSubType(path.class?classificationPathKey(path):'默认');setFeatureInfo({});setGroupInfo({});
    if(!path.class)return;
    try{
      const snapshot=structuredClone(config),workflow=fullEditorWorkflow(snapshot,path,mode),world=normalizeV3WorldId(currentWorldId);
      if(workflow.mode==='composed'){const plan=compileWorkflowEditPlan(workflow,snapshot);setNativeEdit({config:snapshot,plan,draft:initializeFullEditor(snapshot,plan,path),world});setEditUiMode('native-workflow');}
      else {const view=specializedFormView(snapshot,workflow,path,'tradePoint'),fields=resolveEffectiveFields(snapshot,path),values:WorkflowEditorDraftValues={ID:''};for(const field of view.fields){const definition=fields.find(item=>item.key===field.path);values[field.path]=definition?.defaultValue!==undefined?structuredClone(definition.defaultValue):field.control==='bool'?false:field.control==='trpTrade'?[]:'';}setFullExternalCreate({config:snapshot,workflow,path,view,values,unparsed:[],world});}
    }catch(error){setFullCategoryError(error instanceof Error?error.message:String(error));}
  };
  if(editingLayerId!==null)apply();else requestSwitchWithExtraWarn(apply);
};
const renderFullCategoryPicker=()=>{
  const config=nativeEdit?.config??externalEdit?.config??fullExternalCreate?.config??configRuntime;
  return config?<div className="mb-2 space-y-2"><CategoryPathPicker config={config} value={fullCategory} onChange={selectFullCategory} label="要素分类"/>{fullCategoryError?<p role="alert" className="text-xs text-rose-700">{fullCategoryError}</p>:null}</div>:<p role="alert">缺少当前正式配置，未启用分类编辑。</p>;
};
const renderFullForm=()=>{
  const config=nativeEdit?.config??externalEdit?.config??fullExternalCreate?.config??configRuntime;
  if(!config)return null;
  const roles=new Set<ExternalRole>();
  for(const workflow of config.workflows.filter(workflow=>workflow.mode==='external'))for(const role of EXTERNAL_COMPONENT_ROLES[workflow.external?.componentKey??'']??[])try{if(externalRolePaths(config,workflow,role).some(path=>classificationPathKey(path)===classificationPathKey(fullCategory)))roles.add(role);}catch{/* The binding validator reports this declaration. */}
  const mergeProps={config,world:normalizeV3WorldId(currentWorldId),editor:editorIdInput,onEditorChange:setEditorIdInput,records:nativeEditSearchRecords};
  return <section className="mb-2 border-t pt-2"><div className="mb-2 flex flex-wrap items-center justify-between gap-2"><strong className="text-sm">附加信息{nativeEdit?' · '+nativeEdit.plan.workflow.label.zh:externalEdit?' · '+externalEdit.workflow.label.zh:fullExternalCreate?' · '+fullExternalCreate.workflow.label.zh:''}</strong>
    <div className="flex gap-2">{editingLayerId===null&&drawMode==='point'&&roles.has('platform')?<AppButton type="button" onClick={()=>requestExitSpecialDraftIfNeeded(()=>setSpecialDraftMode(specialDraftMode==='merge-point-platform-station'?'none':'merge-point-platform-station'))}>多点合一</AppButton>:null}
    {editingLayerId===null&&drawMode==='polygon'&&(roles.has('platformFootprint')||roles.has('stationBuilding'))?<AppButton type="button" onClick={()=>requestExitSpecialDraftIfNeeded(()=>setSpecialDraftMode(specialDraftMode==='merge-polygon-outline-building'?'none':'merge-polygon-outline-building'))}>多面合一</AppButton>:null}
    {drawMode==='polyline'&&roles.has('railLine')?<RailwayDirectionReverseButton enabled={tempPoints.length>=2&&!drawClickSuppressed} onReverse={()=>{const reversed=[...tempPoints].reverse();if(multipartEnabledRef.current)persistActiveEditorCoords(reversed);setTempPoints(reversed);drawDraftGeometry(reversed,'polyline',drawColor);setNativeEdit(current=>current?{...current,draft:reverseWorkflowEditEndpoints(current.plan,current.draft)}:current);}}/>:null}</div>
   </div>
   {specialDraftMode==='merge-point-platform-station'?<MergePointPlatformStation {...mergeProps} draft={mergePointPSDraft} onChange={setMergePointPSDraft}/>:specialDraftMode==='merge-polygon-outline-building'?<MergePolygonOutlineBuilding {...mergeProps} draft={mergePolygonOBDraft} onChange={setMergePolygonOBDraft}/>:fullCategoryError?<p className="text-xs text-slate-600">请完成分类选择，当前草稿未作为其他分类保存。</p>:externalEdit?<fieldset disabled={externalEditWorldMismatch}><ExternalFeatureEditHost hideClassification config={externalEdit.config} workflow={externalEdit.workflow} session={externalEdit.session} bridge={workflowBridge} context={{initialRecord:externalEdit.session.original,featureIdentity:{layerId:editingLayerId!,originalId:String(externalEdit.session.original.ID)},activeWorld:externalEdit.world,originalGeometry:externalEdit.session.originalGeometry,currentGeometry:multipartDraftRef.current??undefined,editor:editorIdInput,onEditorChange:setEditorIdInput,onUpdate:finishLayer,onCancel:clearTemporaryForVariantSwitch}} onDraftChange={session=>setExternalEdit(current=>current?{...current,session}:current)}/></fieldset>:nativeEdit?<fieldset disabled={nativeEditWorldMismatch}>{nativeEditWorldMismatch?<p role="alert">请返回 {nativeEdit.world} 后继续。</p>:null}<NativeWorkflowEditPanel config={nativeEdit.config} plan={nativeEdit.plan} draft={nativeEdit.draft} records={nativeEditSearchRecords} world={nativeEdit.world} editor={editorIdInput} onEditorChange={setEditorIdInput} onCancel={clearTemporaryForVariantSwitch} onChange={draft=>setNativeEdit(current=>current?{...current,draft}:current)} mode={nativeEdit.original?'edit':'create'} hideClassification/></fieldset>:fullExternalCreate?<fieldset disabled={fullExternalWorldMismatch}>{fullExternalWorldMismatch?<p role="alert">请返回 {fullExternalCreate.world} 后继续此新建。</p>:null}<WorkflowStyleEditPanel view={fullExternalCreate.view} values={fullExternalCreate.values} unparsedEntries={fullExternalCreate.unparsed} bridge={{...workflowBridge,getCaptureContext:()=>({config:fullExternalCreate.config,workflow:fullExternalCreate.workflow})}} idFirst classificationContent={<p className="text-xs">分类由上方四级选择树指定；本次保存为新要素。</p>} onChangeValue={(key,value)=>setFullExternalCreate(current=>current?{...current,values:{...current.values,[key]:value}}:current)} onChangeUnparsedEntries={unparsed=>setFullExternalCreate(current=>current?{...current,unparsed}:current)} editorId={editorIdInput} onChangeEditorId={setEditorIdInput}/></fieldset>:<p className="text-xs text-slate-500">未分类几何草稿。选择分类后使用对应编辑方案填写新要素。</p>}
  </section>;
};
const isWorkflowStyleEditing=Boolean(nativeEdit||externalEdit||fullExternalCreate);

useEffect(() => {
  const mq = window.matchMedia('(max-width: 639px)'); // < sm
  const sync = () => {
    if (!mq.matches) return;

    // 进入移动端：强制关闭并停止所有绘制/编辑
    setMeasuringActive(false);
    setImportPanelOpen(false);

    setDrawing(false);
    setDrawMode('none');
    setTempPoints([]);
    setRedoStack([]);
    setEditingLayerId(null);

    clearDraftOverlays();
    setShowDraftControlPoints(false);
    setShowDraftControlPointCoords(false);

  };

  sync();
  mq.addEventListener('change', sync);
  return () => mq.removeEventListener('change', sync);
}, []);

const resetFeatureFormToDefault = () => {
  setSubType('默认');
  setFeatureInfo({});
  setGroupInfo({});
  resetWorkflowStyleEditorState();
};

const handleDrawModeButtonClick = (m: 'point' | 'polyline' | 'polygon') => {
  if (guardTempMountReadonly()) return;
  requestSwitchWithExtraWarn(() => {
    const sameMode = drawMode === m;

    // 二次点击同一模式：关闭回到 none
    if (sameMode) {
      // 只要会清空草稿/临时点，就做二次确认（与你“和 .5/.0 类似”的交互一致）
      if (tempPoints.length > 0) {
        if (!confirm('取消当前模式将清空当前临时图形？')) return;
      }

      // 统一清理草稿（避免端点/控制点残留）
      clearDraftOverlays();
      setTempPoints([]);
      setRedoStack([]);

      resetSpecialDrafts();

      setDrawMode('none');
      setDrawing(false);

      resetFeatureFormToDefault();
      return;
    }

    // 切换到另一模式
    if (tempPoints.length > 0 && drawMode !== 'none') {
      if (!confirm('切换模式将清空当前临时图形？')) return;

      // 统一清理草稿（避免端点/控制点残留）
      clearDraftOverlays();
      setTempPoints([]);
      setRedoStack([]);
    } else {
      // 即便没有 tempPoints，切换模式也应清理“最新端点指示”
      draftEndpointRef.current?.clearLayers();
    }
    resetSpecialDrafts();

    setDrawMode(m);
    setDrawing(true);

    resetFeatureFormToDefault();
  });
};

// =========================
// Workflow（快捷模式）桥接层
// =========================
const specializedWorkflowRegistry={railway:RailwayWorkflow,station:StationWorkflow,trp_point:TradePointWorkflow} as WorkflowRegistry;
const workflowRegistry=specializedWorkflowRegistry;
const WORKFLOW_SELECT_OPTIONS:Array<{key:WorkflowKey;label:string;hidden?:boolean}>=configRuntime?configRuntime.workflows.filter(isQuickMappingWorkflow).map(workflow=>({key:workflow.id as WorkflowKey,label:workflow.label.zh})):[];

const stopWorkflowToSelector = () => {
  // 回到“工作流初始选择页面”（不退出测绘）
  setWorkflowRunning(false);
  setNativeWorkflowSnapshot(null);

  // 清空草稿与预览（保留 fixed 图层不动）
  workflowRootRef.current?.clearLayers();
  workflowPreviewMapRef.current.clear();
  clearDraftOverlays();
  // Workflow output intentionally remains one path/ring only; do not inherit
  // a full-editor component or hole selection when entering this mode.
  resetMultipartEditor();

  workflowDrawingTargetRef.current=null;

  setTempPoints([]);
  setRedoStack([]);
  setDrawing(false);
  setDrawMode('none');
};

const startWorkflow = () => {
  if (guardTempMountReadonly()) return;
  if (workflowRunning) return;
  if (configRuntime) {
    const report = validateConfigPackage(configRuntime);
    const workflow = configRuntime.workflows.find(item => item.id === workflowKey);
    if (!report.valid || !workflow||!isQuickMappingWorkflow(workflow)) { window.alert('工作流或当前配置包无效，请在工作台修复。'); return; }
    setNativeWorkflowSnapshot({ config: structuredClone(configRuntime), workflow: structuredClone(workflow) });
  }

  try {
    if(!configRuntime){alert('缺少当前正式配置，无法启动工作流。');return;}
  } catch {
    // config-driven workflow diagnostics should never block legacy workflow startup
  }

  // 快捷模式下：开始工作流前重置草稿/临时输出（保持 fixed 不动）
  workflowRootRef.current?.clearLayers();
  workflowPreviewMapRef.current.clear();
  clearDraftOverlays();

  setTempPoints([]);
  setRedoStack([]);
  setDrawing(false);
  setDrawMode('none');

  // 为避免 UI 中残留的 subtype/附加信息影响（工作流运行中会隐藏这些区域），这里统一回到默认
  resetFeatureFormToDefault();

  setWorkflowRunning(true);
};

// 从 coords 生成 Leaflet 图形组（用于 fixed 图层保存）
const makeLeafletGroupForCoords = (mode: DrawMode, coords: { x: number; z: number }[], color: string, geometry?:MultipartGeometry) => {
  const proj = projectionRef.current;
  if (!proj) return L.layerGroup();

  const g = L.layerGroup();
  if(geometry){
    const project=(point:{x:number;z:number})=>proj.locationToLatLng(point.x,64,point.z);
    const layers=geometry.type==='Point'?geometry.parts.map(point=>L.circleMarker(project(point),{color,fillColor:color,radius:6})):geometry.type==='LineString'?geometry.parts.map(part=>L.polyline(part.map(project),{color})):geometry.parts.map(part=>L.polygon(part.map(ring=>ring.map(project)),{color}));
    layers.forEach(layer=>layer.addTo(g));return g;
  }
  const latlngs = coords.map(p => proj.locationToLatLng(p.x, 64, p.z));

  if (mode === 'point') {
    latlngs.forEach(ll => {
      L.circleMarker(ll, { color, fillColor: color, radius: 6 }).addTo(g);
    });
  } else if (mode === 'polyline') {
    L.polyline(latlngs, { color }).addTo(g);
  } else if (mode === 'polygon') {
    if (latlngs.length > 2) L.polygon(latlngs, { color }).addTo(g);
    else L.polyline(latlngs, { color }).addTo(g);
  }
  return g;
};

const upsertWorkflowPreview = (
  key: string,
  kind: WorkflowPreviewKind,
  points: WorldPoint[],
  style?: WorkflowPreviewStyle,
  geometry?: import('@/core/geometry/multipartGeometry').MultipartGeometry
) => {
  const proj = projectionRef.current;
  const root = workflowRootRef.current;
  if (!proj || !root) return;

  // remove old
  const old = workflowPreviewMapRef.current.get(key);
  if (old) root.removeLayer(old);

  const color = style?.color ?? drawColorRef.current;
  const weight = style?.weight ?? 4;
  const dashArray = style?.dashArray;

  const latlngs = (points ?? []).map(p => proj.locationToLatLng(p.x, 64, p.z));

  let layer: L.Layer;
  if(geometry) {
    const project=(point:{x:number;z:number})=>proj.locationToLatLng(point.x,64,point.z);
    layer=L.layerGroup(geometry.type==='Point'?geometry.parts.map(point=>L.circleMarker(project(point),{color,fillColor:color,radius:6})):geometry.type==='LineString'?geometry.parts.map(part=>L.polyline(part.map(project),{color,weight,dashArray})):geometry.parts.map(part=>L.polygon(part.map(ring=>ring.map(project)),{color,weight,dashArray})));
  } else if (kind === 'point') {
    if (latlngs.length === 0) return;
    layer = L.circleMarker(latlngs[0], { color, fillColor: color, radius: 6 });
  } else if (kind === 'polygon') {
    layer = L.polygon(latlngs, { color, weight, dashArray } as any);
  } else {
    layer = L.polyline(latlngs, { color, weight, dashArray } as any);
  }

  layer.addTo(root);
  workflowPreviewMapRef.current.set(key, layer);
};

const clearWorkflowPreview = (key?: string) => {
  const root = workflowRootRef.current;
  if (!root) return;

  if (!key) {
    workflowPreviewMapRef.current.forEach((layer) => root.removeLayer(layer));
    workflowPreviewMapRef.current.clear();
    return;
  }

  const old = workflowPreviewMapRef.current.get(key);
  if (old) {
    root.removeLayer(old);
    workflowPreviewMapRef.current.delete(key);
  }
};

const commitFeatureFromWorkflow = (args: WorkflowCommitArgs) => {
  const map = leafletMapRef.current;
  const proj = projectionRef.current;
  if (!map || !proj) return { ok: false as const, error: '地图未就绪' };

  const config=args.configuration??configRuntime,workflow=args.workflowDefinition;
  if(!config||!workflow||!args.role)return {ok:false as const,error:'专用采集缺少配置、工作流或业务角色。'};
  const geometry=args.geometry??multipartGeometryFromSinglePath(geometryKindForDrawMode(args.mode),args.mode==='point'?args.coords.slice(0,1):args.coords);
  const geometryError=validateMultipartGeometry(geometry);
  if(geometryError||geometry.type!==geometryKindForDrawMode(args.mode))return {ok:false as const,error:geometryError??'专用几何类型不一致。'};
  const workflowCoords=geometry.type==='Point'?geometry.parts:geometry.type==='LineString'?geometry.parts[0]:geometry.parts[0]?.[0]??[];
  let finalFeatureInfo:Record<string,unknown>;
  try{finalFeatureInfo=prepareSpecializedCapture(config,workflow,args.role,geometry,args.values??{},args.groupInfo??{},currentWorldId,args.editorId??editorIdInput,[...recordsAfterExactDeletes(nativeEditRecords,relayPackageDraft.deleteMarks),...layersRef.current.flatMap(layer=>layer.jsonInfo?.featureInfo?[layer.jsonInfo.featureInfo]:[])],args.classification);}catch(error){return {ok:false as const,error:error instanceof Error?error.message:'专用要素无效。'};}

  const id = nextLayerId.current++;
  const color = args.color ?? drawColor;
  const newGroup = makeLeafletGroupForCoords(args.mode as DrawMode, workflowCoords, color,geometry);

  const layerObj: LayerType = {
    id,
    mode: args.mode as any,
    color,
    coords: workflowCoords,
    visible: true,
    leafletGroup: newGroup,
    jsonInfo: {
      subType: args.subType,
      featureInfo: finalFeatureInfo,
    },
  };

  setLayers(prev => {
    const next = [...prev, layerObj];
    syncFixedRoot(next, null);
    return next;
  });

  return { ok: true as const, layerId: id };
};

const commitNativeWorkflow = (config: ConfigPackageV3, workflow: WorkflowDefinition, outputs: V3WorkflowRunResult) => {
  if (!leafletMapRef.current || !projectionRef.current) throw new Error('地图未就绪。');
  const prepared = prepareNativeWorkflowCommit(config, workflow, outputs, currentWorldId);
  const existing = new Set(layers.map(layer => String(layer.jsonInfo?.featureInfo?.ID ?? '')));
  if (prepared.some(item => existing.has(String(item.record.ID)))) throw new Error('输出 ID 已存在于当前测绘图层。');
  const firstId = nextLayerId.current;
  const batch: LayerType[] = prepared.map((item, index) => {
    const color = typeof item.record.color === 'string' ? item.record.color : drawColor;
    return { id: firstId + index, mode: item.mode, color, coords: item.coords, visible: true,
      leafletGroup: makeLeafletGroupForCoords(item.mode, item.coords, color),
      jsonInfo: { subType: classificationPathKey(recordCategory(item.record)), featureInfo: item.record },
    };
  });
  nextLayerId.current += batch.length;
  setLayers(previous => { const next = [...previous, ...batch]; syncFixedRoot(next, null); return next; });
};

const workflowBridge: WorkflowBridge = {
  getCurrentWorldId: () => currentWorldId,
  getEditorId: () => editorIdInput,
  setEditorId: (id: string) => setEditorIdInput(id),

  setDrawMode: (mode: 'none' | DrawMode) => {
    // 工作流内部切换模式：不走 UI 确认弹窗
    if (mode === 'none') {
      clearDraftOverlays();
      setTempPoints([]);
      setRedoStack([]);
      setEditingLayerId(null);
      setDrawing(false);
      setDrawMode('none');
      drawModeRef.current = 'none';
      resetMultipartEditor();
      resetSpecialDrafts();
      return;
    }

    clearDraftOverlays();
    setRedoStack([]);
    setEditingLayerId(null);
    setDrawMode(mode);
    drawModeRef.current = mode as any;
    setDrawing(true);
    resetMultipartEditor();
    resetSpecialDrafts();
  },

  suspendDrawMode: () => {
    setEditingLayerId(null);
    setDrawing(false);
    setDrawMode('none');
    drawModeRef.current = 'none';
    resetMultipartEditor();
    resetSpecialDrafts();
  },

  setDrawColor: (hex: string) => setDrawColor(hex),

  getTempPoints: () => tempPointsRef.current,
  subscribeDrawingChanges: listener => {drawingListeners.current.add(listener);return()=>{drawingListeners.current.delete(listener);};},
  setTempPoints: (pts: WorldPoint[]) => {
    const next = (pts ?? []) as any;
    // Workflow data is always a flat single-component draft.  It must not
    // mutate the full editor's multipart reference even after a mode switch.
    setTempPoints(next);
    // 同步草稿几何显示（避免 setState 异步导致绘制模式滞后）
    drawDraftGeometry(next, drawModeRef.current, drawColorRef.current);
  },
  clearTempPoints: () => {
    setTempPoints([]);
    resetMultipartEditor();
    clearDraftOverlays();
  },
  setDrawingTarget:(path,allowParts)=>{workflowDrawingTargetRef.current=path?{path,allowParts}:null;},
  getDrawingGeometry:()=>drawModeRef.current==='none'?null:structuredClone(buildCurrentMultipartGeometry(drawModeRef.current,tempPointsRef.current)),
  setDrawingGeometry:geometry=>{
    if(drawModeRef.current==='none'||geometry.type!==geometryKindForDrawMode(drawModeRef.current))throw Error('草稿几何类型与当前绘制页不一致。');
    if(geometry.parts.length>1&&workflowDrawingTargetRef.current?.allowParts===false)throw Error('当前绘制分类禁止多部件，不能截断导入几何。');
    resetMultipartEditor();multipartDraftRef.current=structuredClone(geometry);multipartEnabledRef.current=true;setMultipartEnabled(true);activeMultipartPartRef.current=0;editSelectedInnerSpaceRef.current=false;activeInnerSpaceRef.current=0;
    const holes=geometry.type==='Polygon'&&(geometry.parts[0]?.length??0)>1;innerSpaceEnabledRef.current=holes;setInnerSpaceEnabled(holes);
    renderSelectedMultipartCoords(multipartDraftRef.current,drawColorRef.current);
  },

  requestUndo: () => handleUndo(),
  requestRedo: () => handleRedo(),

  upsertWorkflowPreview,
  clearWorkflowPreview,

  commitFeature: commitFeatureFromWorkflow,

  getCommittedLayerJsonInfos: () => {
    return (layers ?? []).map((l: any) => l?.jsonInfo).filter(Boolean) as any;
  },

  getDeleteMarkedFeatureIds: () => {
    return (relayPackageDraft.deleteMarks ?? []).map((x) => String(x?.ID ?? '').trim()).filter(Boolean);
  },

  exitWorkflowToSelector: () => stopWorkflowToSelector(),
};

  const measureDropdownMenu = (
    <AppCard
      className={`w-44 border border-gray-200 py-1 transition-all duration-150 ${
        measureDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}
      onMouseDownCapture={() => focusMeasureDropdown()}
    >
      {/* 开始测绘（完整/快捷） 或 结束测绘 */}
      {!measuringActive ? (
        <>
          <AppButton
            onClick={() => startMeasuringFromMenu('full')}
            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors text-gray-700"
            type="button"
          >
            <Pencil className="w-4 h-4" />
            <span>开始测绘(完整)</span>
          </AppButton>

          <AppButton
            onClick={() => startMeasuringFromMenu('workflow')}
            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors text-gray-700"
            type="button"
          >
            <Pencil className="w-4 h-4" />
            <span>开始测绘(快捷)</span>
          </AppButton>
        </>
      ) : (
        <>
          <AppButton
            onClick={() => switchMeasuringVariantFromMenu('full')}
            className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
              measuringVariant === 'full'
                ? 'text-gray-400 cursor-not-allowed'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
            type="button"
            disabled={measuringVariant === 'full'}
            title={measuringVariant === 'full' ? '当前已是完整模式' : '切换到完整测绘模式'}
          >
            <Pencil className="w-4 h-4" />
            <span>切换到完整模式</span>
          </AppButton>

          <AppButton
            onClick={() => switchMeasuringVariantFromMenu('workflow')}
            className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
              measuringVariant === 'workflow'
                ? 'text-gray-400 cursor-not-allowed'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
            type="button"
            disabled={measuringVariant === 'workflow'}
            title={measuringVariant === 'workflow' ? '当前已是快捷模式' : '切换到快捷测绘模式'}
          >
            <Pencil className="w-4 h-4" />
            <span>切换到快捷模式</span>
          </AppButton>

          <AppButton
            onClick={endMeasuringFromMenu}
            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors text-gray-700"
            type="button"
          >
            <X className="w-4 h-4" />
            <span className="font-medium">结束测绘</span>
          </AppButton>
        </>
      )}

      {/* 导入数据：仅开始测绘后显示 */}
      {measuringActive && !disablePackageUpload && (
        <AppButton
          onClick={() => setImportPanelOpen(true)}
          className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors text-gray-700"
          type="button"
        >
          <Upload className="w-4 h-4" />
          <span>导入数据</span>
        </AppButton>
      )}

      {/* 清空所有图层 */}
      <AppButton
        onClick={clearAllLayers}
        className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors text-gray-700"
        type="button"
      >
        <Trash2 className="w-4 h-4" />
        <span>清空所有图层</span>
      </AppButton>
    </AppCard>
  );

  const measureDropdownPortal = measureDropdownDesktop && measureDropdownOpen && measureDropdownPortalRoot && measureDropdownRect
    ? createPortal(
        <div
          className="fixed pointer-events-auto origin-top-right"
          style={{
            top: measureDropdownRect.top,
            right: measureDropdownRect.right,
            zIndex: measureDropdownZIndex,
          }}
          onMouseDownCapture={() => focusMeasureDropdown()}
        >
          {measureDropdownMenu}
        </div>,
        measureDropdownPortalRoot
      )
    : null;

  const launcherContent = (
    <div ref={measureLauncherRef} className="relative">
      <ToolIconButton
        label="测绘"
        icon={<Pencil className="w-5 h-5" />}
        active={measuringActive}
        tone="blue"
        onClick={toggleMeasureDropdown}
        className="h-11 w-11"
      />

    </div>
  );

  // ======== 图层管理：临时挂载(全局)切换（存在即移除） ========
  const cancelTempMountConflict = () => {
    setTempMountConflictOpen(false);
    setTempMountConflictText('');
    setTempMountConflictAllowOverride(false);
    setTempMountPendingLayers(null);
    setTempMountPendingOverrideIds([]);
  };

  const confirmTempMountConflictOverride = () => {
    if (!tempMountPendingLayers || tempMountPendingLayers.length === 0) {
      cancelTempMountConflict();
      return;
    }

    // 写入覆盖屏蔽列表：固定数据源中同 ID 的要素在挂载期间不可读
    const all = readTempRuleOverrideIds();
    writeTempRuleOverrideIds({ ...all, [currentWorldId]: tempMountPendingOverrideIds });
    syncTempRuleDeleteIdsForCurrentWorld();

    // 通过确认：批量挂载所有图层（仅用于测试显示/去重/关联）
    mountAllLayersToTempSources(tempMountPendingLayers);
    setTempMountAllActive(true);
    // 挂载模式下仅观看：隐藏测绘图层显示，避免与规则渲染叠加
    fixedRootRef.current?.clearLayers();

    cancelTempMountConflict();
  };

  const toggleTempMountAllLayers = async (layerList: LayerType[], busy: boolean) => {
    if (busy || showMultipartPartLabels) return;
    const ids = layerList.map((l) => l.id);

    // 已挂载：移除所有 layer-* 临时源，并恢复测绘图层显示（存在即移除）
    if (tempMountAllActive) {
      removeAllTempMountedLayersForWorld(ids);
      // 退出挂载：清除“覆盖屏蔽列表”，恢复固定数据源可读
      clearTempRuleOverrideIdsForWorld();
      clearTempRuleDeleteIdsForWorld();
      setTempMountAllActive(false);
      // 恢复 fixedRoot 显示（避免退出挂载后仍然空白）
      syncFixedRoot(layers, editingLayerId);
      return;
    }

    // 未挂载：先做“全局数据库（RULE_DATA_SOURCES 全文件）”ID 重复性检查
    const candidates: TempLayerIdCandidate[] = layerList
      .map((l) => ({
        title: getLayerDisplayTitle(l),
        id: getLayerPrimaryIdValue(l),
      }))
      .filter((c) => String(c.id ?? '').trim().length > 0);

    let shown = false;
    const timer = window.setTimeout(() => {
      shown = true;
      setTempMountIdCheckText('正在对比临时图层ID...');
      setTempMountIdCheckOpen(true);
    }, 1000);

    try {
      // 新挂载：先清理上一次残留的覆盖屏蔽列表
      clearTempRuleOverrideIdsForWorld();
      clearTempRuleDeleteIdsForWorld();

      setTempMountIdCheckText('正在读取全局数据库要素索引...');
      const res = await checkTempMountIdConflictsDetailed({ worldId: currentWorldId, candidates });
      if (res.messages.length > 0) {
        if (shown) setTempMountIdCheckOpen(false);

        // 内部冲突：临时图层之间已冲突 —— 不能提供“确定/更新挂载”入口
        if (res.internalConflict) {
          setTempMountConflictText(res.messages.join('\n'));
          setTempMountConflictAllowOverride(false);
          setTempMountPendingLayers(null);
          setTempMountPendingOverrideIds([]);
          setTempMountConflictOpen(true);
          return;
        }

        // 全局冲突：提供“返回/更新挂载”两个选项（使用站内弹窗，避免浏览器 confirm 被拦截）
        setTempMountConflictText(
          `${res.messages.join('\n')}\n\n是否要“更新挂载”？\n- 返回：不挂载\n- 确定：更新挂载（用临时图层覆盖同ID要素）`
        );
        setTempMountConflictAllowOverride(true);
        setTempMountPendingLayers(layerList);
        setTempMountPendingOverrideIds(res.conflictIds);
        setTempMountConflictOpen(true);
        return;
      }
    } finally {
      window.clearTimeout(timer);
      if (shown) setTempMountIdCheckOpen(false);
    }

    // 通过检查：批量挂载所有图层（仅用于测试显示/去重/关联）
    syncTempRuleDeleteIdsForCurrentWorld();
    mountAllLayersToTempSources(layerList);
    setTempMountAllActive(true);
    // 挂载模式下仅观看：隐藏测绘图层显示，避免与规则渲染叠加
    fixedRootRef.current?.clearLayers();
  };


  const buildReviewWorkspaceSignature = () => JSON.stringify({
    layers: layers.map((l) => ({
      id: l.id,
      title: getLayerDisplayTitle(l),
      subType: l.jsonInfo?.subType ?? l.mode,
      featureInfo: l.jsonInfo?.featureInfo ?? null,
      visible: l.visible,
    })),
    deleteMarks: relayPackageDraft.deleteMarks,
    pictureKeys: Object.keys(relayPackageDraft.picturesById ?? {}).sort(),
    pictureCounts: Object.fromEntries(Object.entries(relayPackageDraft.picturesById ?? {}).map(([id, list]) => [id, list.filter((x) => !x.deleted).length])),
  });

  useEffect(() => {
    if (!isReviewWorkspace || !measuringActive) return;
    const signature = buildReviewWorkspaceSignature();
    if (reviewJustLoadedRef.current) {
      reviewJustLoadedRef.current = false;
      reviewBaselineSignatureRef.current = signature;
      reviewDirtyRef.current = false;
      setReviewActionDirty(false);
      onReviewDirtyChange?.(false);
      return;
    }
    if (reviewBaselineSignatureRef.current === null) {
      reviewBaselineSignatureRef.current = signature;
      reviewDirtyRef.current = false;
      setReviewActionDirty(false);
      onReviewDirtyChange?.(false);
      return;
    }
    const dirty = signature !== reviewBaselineSignatureRef.current;
    if (dirty !== reviewDirtyRef.current) {
      reviewDirtyRef.current = dirty;
      setReviewActionDirty(dirty);
      onReviewDirtyChange?.(dirty);
    }
  }, [isReviewWorkspace, measuringActive, layers, relayPackageDraft, onReviewDirtyChange]);

  const resetReviewDirtyBaseline = () => {
    reviewBaselineSignatureRef.current = buildReviewWorkspaceSignature();
    reviewDirtyRef.current = false;
    setReviewActionDirty(false);
    onReviewDirtyChange?.(false);
  };

  const handleReviewSaveAction = async (): Promise<boolean> => {
    if (!reviewDirtyRef.current || reviewSaveInProgress) return false;
    if (!onReviewSave) {
      setReviewNotice('当前应用未配置审核修订保存通道。审核修改仍保留在本地工作区。');
      return false;
    }
    const operator = String(relayPackageDraft.meta.operator || reviewSession?.reviewerLabel || 'reviewer').trim() || 'reviewer';
    const note = String(relayPackageDraft.meta.note || `审核编辑修订：${reviewPackageLabel || 'review-package'}`).trim();
    setReviewSaveInProgress(true);
    try {
      const artifact = await buildRelayPackageArtifact(operator, note);
      await onReviewSave({
        packageName: artifact.filename,
        blob: artifact.blob,
        summary: `审核编辑修订：${reviewPackageLabel || artifact.filename}`,
      });
      setRelayPackageDraft((prev) => ({ ...prev, meta: { ...prev.meta, ...artifact.nextMeta } }));
      resetReviewDirtyBaseline();
      setReviewNotice('审核修改已保存为新的不可变版本。关闭审核图层管理后会回到审核包详情；刷新该包即可选择新版本。');
      return true;
    } catch (error) {
      setReviewNotice(`审核修改保存失败：${String((error as Error)?.message ?? error ?? '未知错误')}。本地修改仍保留，未生成成功的远端版本。`);
      return false;
    } finally {
      setReviewSaveInProgress(false);
    }
  };

  const requestReviewStatusDraft = (
    state: 'pending' | 'approved' | 'rejected' | 'archived',
    decisionAction: 'approve' | 'reject' | 'request-changes' | 'archive' | 'reopen',
  ) => {
    const submissionId = reviewSession?.submissionContext?.submissionId ?? reviewPackageLabel;
    if (!submissionId) {
      setReviewNotice('请先从审核包详情下载并加载一个审核包，再设置审核状态。');
      return;
    }
    // ReviewModule owns the authoritative in-session draft and renders the
    // confirmation/reason input above every draggable panel.  This workspace
    // only requests a local lamp change; it never writes a remote state.
    window.dispatchEvent(new CustomEvent('cairn-review-status-draft', {
      detail: { submissionId, state, decisionAction },
    }));
  };

  const layerPanelCard = (
  <AppCard className={`w-96 overflow-hidden border ${isReviewWorkspace ? 'flex h-[70vh] max-h-[70vh] flex-col' : ''}`} style={{ maxHeight: '70vh' }}>
      <div ref={layerMgrCardRef} className={isReviewWorkspace ? 'flex min-h-0 flex-1 flex-col' : undefined}>
      {/* 标题栏（拖拽区域：前 48px） */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-bold text-gray-800" data-draggable-title>{isReviewWorkspace ? '审核图层管理' : '图层'}</h3>
        <AppButton
          onClick={closeMeasuringUI}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
          aria-label="关闭"
          title={isReviewWorkspace ? '关闭审核图层管理并清理' : '退出测绘并清理'}
          type="button"
        >
          <X className="w-4 h-4" />
        </AppButton>
      </div>

      {(() => {
        const busy = (drawing && drawMode !== 'none') || editingLayerId !== null;
        // “快捷测绘模式(便捷)”启用时（面板处于 workflow 变体），禁止图层编辑：
        // 该限制不依赖 measuringActive（因为图层栏可在多种状态下被打开）。
        const quickMeasuringActive = measuringVariant === 'workflow';
        const visibleList = layers.filter((l) => l.id !== editingLayerId);
        const hasDefaultLayer = visibleList.some((l) => (l?.jsonInfo?.subType ?? '默认') === '默认'&&!nativeLayerRecord(l));
        const hasRelayExportContent = visibleList.length > 0 || relayPackageDraft.deleteMarks.length > 0;
        const relayExportTitle = busy
          ? '当前有要素正在编辑/绘制，请先保存'
          : !hasRelayExportContent
            ? '暂无可导出内容'
            : visibleList.length === 0
              ? '导出仅含删除标记的标准包'
              : '导出当前图层管理区为标准包';

        return (
          <>
            {/* Both review surfaces use one in-session status draft.  The
                workspace restores the historical 3x3 command layout while
                the package detail remains an equivalent auxiliary entry. */}
            {isReviewWorkspace ? (
              <div className="grid grid-cols-3 gap-2 px-4 py-3 border-b">
                <AppButton
                  type="button"
                  className={`px-2 py-1 text-sm rounded border ${reviewActionDirty && !reviewSaveInProgress ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200'}`}
                  title={reviewActionDirty ? (reviewSaveInProgress ? '正在保存新的审核版本。' : '保存当前审核工作区修改为新的远端审核版本。') : '当前没有审核修改，保存保持锁定。'}
                  disabled={!reviewActionDirty || reviewSaveInProgress}
                  onClick={handleReviewSaveAction}
                >
                  {reviewSaveInProgress ? '保存中…' : '保存'}
                </AppButton>
                <AppButton type="button" aria-pressed={reviewStatusDraft === 'approved'} className={`px-2 py-1 text-sm rounded border bg-green-600 text-white border-green-700 hover:bg-green-700 ${reviewStatusDraft === 'approved' ? 'ring-2 ring-green-300 ring-offset-1' : ''}`} onClick={() => requestReviewStatusDraft('approved', 'approve')}>通过</AppButton>
                <AppButton type="button" aria-pressed={reviewStatusDraft === 'rejected'} className={`px-2 py-1 text-sm rounded border bg-rose-600 text-white border-rose-700 hover:bg-rose-700 ${reviewStatusDraft === 'rejected' ? 'ring-2 ring-rose-300 ring-offset-1' : ''}`} onClick={() => requestReviewStatusDraft('rejected', 'reject')}>打回</AppButton>
                <AppButton type="button" aria-pressed={reviewStatusDraft === 'archived'} className={`px-2 py-1 text-sm rounded border bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 ${reviewStatusDraft === 'archived' ? 'ring-2 ring-slate-300 ring-offset-1' : ''}`} onClick={() => requestReviewStatusDraft('archived', 'archive')}>归档</AppButton>
                <AppButton type="button" aria-pressed={reviewStatusDraft === 'rejected'} className={`px-2 py-1 text-sm rounded border bg-red-50 text-red-700 border-red-200 hover:bg-red-100 ${reviewStatusDraft === 'rejected' ? 'ring-2 ring-rose-300 ring-offset-1' : ''}`} onClick={() => requestReviewStatusDraft('rejected', 'request-changes')}>要求修改</AppButton>
                <AppButton type="button" aria-pressed={reviewStatusDraft === 'pending'} className={`px-2 py-1 text-sm rounded border bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 ${reviewStatusDraft === 'pending' ? 'ring-2 ring-amber-300 ring-offset-1' : ''}`} onClick={() => requestReviewStatusDraft('pending', 'reopen')}>恢复待审</AppButton>

                <AppButton
                  type="button"
                  className={`px-2 py-1 text-sm rounded border ${
                    busy || showMultipartPartLabels || visibleList.length === 0 || (!tempMountAllActive && hasDefaultLayer)
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200'
                      : tempMountAllActive
                        ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'
                        : 'bg-emerald-200 text-emerald-900 border-emerald-300 hover:bg-emerald-300'
                  }`}
                  title={
                    busy
                      ? '当前有要素正在编辑/绘制，请先保存'
                      : showMultipartPartLabels
                        ? '显示部件编号期间锁定临时挂载，以保持部件边界稳定'
                      : visibleList.length === 0
                        ? '暂无图层'
                        : (!tempMountAllActive && hasDefaultLayer)
                          ? '存在默认图层，无法挂载'
                        : tempMountAllActive
                          ? '取消临时挂载（存在即移除）'
                          : '临时挂载所有图层到规则图层，并运行 ID 冲突检查'
                  }
                  disabled={busy || showMultipartPartLabels || visibleList.length === 0 || (!tempMountAllActive && hasDefaultLayer)}
                  onClick={() => void toggleTempMountAllLayers(visibleList, busy)}
                >
                  临挂
                </AppButton>

                <AppButton
                  type="button"
                  className={`px-2 py-1 text-sm rounded border ${busy || !hasRelayExportContent ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white text-gray-800 hover:bg-gray-50 border-gray-300'}`}
                  title={relayExportTitle}
                  disabled={busy || !hasRelayExportContent}
                  onClick={() => { if (!busy && hasRelayExportContent) setRelayPackageExportOpen(true); }}
                >
                  导出
                </AppButton>

                <AppButton
                  type="button"
                  className="px-2 py-1 text-sm rounded border bg-white text-gray-800 hover:bg-gray-50 border-gray-300"
                  title="查看或添加待删除标记"
                  onClick={() => { setDeletePickedCandidate(null); setDeleteMapPickEnabled(false); setDeletePanelOpen(true); }}
                >
                  删除
                </AppButton>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 border-b">
                <AppButton
                  type="button"
                  className={`px-2 py-1 text-sm rounded border ${
                    busy || visibleList.length === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200'
                      : 'bg-white text-gray-800 hover:bg-gray-50 border-gray-300'
                  }`}
                  title={
                    busy
                      ? '当前有要素正在编辑/绘制，无法整体导出'
                      : visibleList.length === 0
                        ? '暂无图层'
                        : '导出图层管理区全部图层 JSON'
                  }
                  disabled={busy || visibleList.length === 0}
                  onClick={() => {
                    if (busy || visibleList.length === 0) return;
                    setJsonExportSubType('__ALL__');
                    setJsonPanelText(getLayersJSONOutputBySubType('__ALL__'));
                    setJsonPanelOpen(true);
                  }}
                >
                  整体JSON
                </AppButton>

                <AppButton
                  type="button"
                  className={`px-2 py-1 text-sm rounded border ${
                    busy || visibleList.length === 0 || hasDefaultLayer
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200'
                      : 'bg-white text-gray-800 hover:bg-gray-50 border-gray-300'
                  }`}
                  title={
                    busy
                      ? '当前有要素正在编辑/绘制，无法导出'
                      : visibleList.length === 0
                        ? '暂无图层'
                        : hasDefaultLayer
                          ? '存在默认图层，无法导出简略CSV'
                          : '导出 Type,Class,World,ID,Name 简略CSV（便于快速维护检查）'
                  }
                  disabled={busy || visibleList.length === 0 || hasDefaultLayer}
                  onClick={() => {
                    if (busy || visibleList.length === 0 || hasDefaultLayer) return;
                    const csv = buildBriefCsvFromLayers(visibleList, currentWorldId);
                    const now = new Date();
                    const y = String(now.getFullYear());
                    const m = String(now.getMonth() + 1).padStart(2, '0');
                    const d = String(now.getDate()).padStart(2, '0');
                    const filename = `brief_${y}${m}${d}.csv`;
                    downloadTextFile(csv, filename, 'text/csv;charset=utf-8');
                  }}
                >
                  简略CSV文件
                </AppButton>

                <AppButton
                  type="button"
                  className={`px-2 py-1 text-sm rounded border ${
                    busy || visibleList.length === 0 || (!tempMountAllActive && hasDefaultLayer)
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200'
                      : tempMountAllActive
                        ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'
                        : 'bg-emerald-200 text-emerald-900 border-emerald-300 hover:bg-emerald-300'
                  }`}
                  title={
                    busy
                      ? '当前有要素正在编辑/绘制，请先保存'
                      : visibleList.length === 0
                        ? '暂无图层'
                        : (!tempMountAllActive && hasDefaultLayer)
                          ? '存在默认图层，无法挂载'
                        : tempMountAllActive
                          ? '取消临时挂载（存在即移除）'
                          : '临时挂载所有图层到规则图层（用于测试显示/去重/关联）'
                  }
                  disabled={busy || visibleList.length === 0 || (!tempMountAllActive && hasDefaultLayer)}
                  onClick={() => void toggleTempMountAllLayers(visibleList, busy)}
                >
                  {tempMountAllActive ? '取消临时挂载' : '临时挂载'}
                </AppButton>

                <AppButton
                  type="button"
                  className={`px-2 py-1 text-sm rounded border ${busy || !hasRelayExportContent ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white text-gray-800 hover:bg-gray-50 border-gray-300'}`}
                  title={relayExportTitle}
                  disabled={busy || !hasRelayExportContent}
                  onClick={() => { if (!busy && hasRelayExportContent) setRelayPackageExportOpen(true); }}
                >
                  导出标准包
                </AppButton>

                <AppButton
                  type="button"
                  className="px-2 py-1 text-sm rounded border bg-white text-gray-800 hover:bg-gray-50 border-gray-300"
                  title="查看待删除标记"
                  onClick={() => { setDeletePickedCandidate(null); setDeleteMapPickEnabled(false); setDeletePanelOpen(true); }}
                >
                  删除要素
                </AppButton>
              </div>
            )}

            <div className="px-4 py-2 border-b text-xs text-gray-600 space-y-1">
              {isReviewWorkspace && reviewPackageLabel ? (
                <div><span className="font-bold">审核包：</span>{reviewPackageLabel}</div>
              ) : null}
              <div><span className="font-bold">标准包状态：</span>{relayDraftStatusLabel(relayPackageDraft.meta.draftStatus)}</div>
              {relayDraftShowsMeta(relayPackageDraft.meta.draftStatus) ? (
                <div><span className="font-bold">Operator：</span>{relayPackageDraft.meta.operator || '-'}</div>
              ) : null}
              {relayDraftShowsMeta(relayPackageDraft.meta.draftStatus) ? (
                <div><span className="font-bold">Note：</span>{relayPackageDraft.meta.note || '-'}</div>
              ) : null}
              <div><span className="font-bold">待删除：</span>{relayPackageDraft.deleteMarks.length}　<span className="font-bold">已绑定图片：</span>{countActiveRelayPictures(relayPackageDraft)}</div>
              <div>
                {relayDraftShowsMeta(relayPackageDraft.meta.draftStatus) ? (
                  <><span className="font-bold">包版本：</span>{relayPackageDraft.meta.packageVersion ?? '-'}　</>
                ) : null}
                <span className="font-bold">更新时间：</span>{relayPackageDraft.meta.updatedAt || '-'}
              </div>
            </div>

            {relayPackageDraft.deleteMarks.length > 0 && (
              <div className="px-4 py-2 border-b text-xs text-gray-700 bg-rose-50/60 space-y-1">
                <div className="font-bold text-rose-800">待删除标记</div>
                <div className="flex flex-wrap gap-1">
                  {relayPackageDraft.deleteMarks.map((it) => (
                    <button
                      key={it.ID}
                      type="button"
                      className="px-2 py-0.5 rounded border border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
                      title={it.ID}
                      onClick={() => setRelayPackageDraft((prev) => ({
                        ...prev,
                        deleteMarks: prev.deleteMarks.filter((x) => x.ID !== it.ID),
                        meta: { ...prev.meta, updatedAt: new Date().toISOString() },
                      }))}
                    >
                      {it.Name || it.ID}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 顶部横向滚动条：始终可见 */}
            <div className="px-3 pt-2">
              <div
                ref={layerMgrTopXRef}
                className="overflow-x-auto overflow-y-hidden h-3 rounded bg-gray-50 border"
                title="左右滑动"
              >
                <div ref={layerMgrSpacerRef} className="h-1" />
              </div>
            </div>

            {/* 列表：纵向滚动 + 横向滚动（与顶部同步） */}
            <div className={isReviewWorkspace ? 'min-h-0 flex-1 px-3 pb-3' : 'px-3 pb-3'}>
              <div
                ref={layerMgrBodyRef}
                className={isReviewWorkspace ? 'h-full overflow-x-auto overflow-y-auto' : 'overflow-y-auto overflow-x-auto'}
                style={isReviewWorkspace ? undefined : { maxHeight: layerMgrListMaxHeight }}
              >
                <div className="min-w-max">
                {visibleList.map((l) => {
                  const entry = getTempMountedEntryByLayer(l.id);
                  const enabled = entry ? Boolean(entry.enabled) : false;

                  // 挂载模式：仅显示 enabled 开关（true/false）与标题
                  if (tempMountAllActive) {
                    return (
                      <div key={l.id} className="flex items-center gap-2 mb-1 whitespace-nowrap min-w-[520px]">
                        <AppButton
                          type="button"
                          className={`px-2 py-1 text-sm rounded border ${
                            enabled
                              ? 'bg-emerald-600 text-white border-emerald-700'
                              : 'bg-gray-200 text-gray-700 border-gray-300'
                          }`}
                          onClick={() => setTempMountedEnabledForLayer(l.id, !enabled)}
                          title="作为规则图层开关：enabled=true/false"
                        >
                          {enabled ? 'enabled=true' : 'enabled=false'}
                        </AppButton>

                        <div className="flex-1 text-sm truncate">
                          {getLayerDisplayTitle(l)}
                          <span className="text-gray-400"> {String(l.jsonInfo?.subType ?? l.mode)}</span>
                        </div>
                      </div>
                    );
                  }

                  // 普通模式：保留原图层管理能力（不再提供单图层“临时挂载”按钮）
                  const toolbarExpanded = Boolean(expandedLayerToolbars[l.id]);
                  return (
                    <div key={l.id} className="flex items-center gap-1 mb-1 whitespace-nowrap min-w-[640px]">
                      <AppButton
                        className="px-2 py-1 text-sm border bg-white"
                        onClick={() => setExpandedLayerToolbars((prev) => ({ ...prev, [l.id]: !prev[l.id] }))}
                        type="button"
                        title={toolbarExpanded ? '收起工具栏' : '展开工具栏'}
                      >
                        {toolbarExpanded ? '<' : '>'}
                      </AppButton>

                      <AppButton
                        className="px-2 py-1 text-sm border bg-white"
                        onClick={() => { setPicturePanelLayerId(l.id); setPicturePanelOpen(true); }}
                        type="button"
                        title="要素绑定图片"
                      >
                        图
                      </AppButton>

                      {toolbarExpanded ? (
                        <>
                          <AppButton
                            className={`px-2 py-1 text-sm ${l.visible ? 'bg-green-300' : 'bg-gray-300'}`}
                            onClick={() => toggleLayerVisible(l.id)}
                            type="button"
                          >
                            {l.visible ? '隐藏' : '显示'}
                          </AppButton>

                          <AppButton className="px-2 py-1 text-sm bg-blue-200" onClick={() => moveLayerUp(l.id)} type="button">↑</AppButton>
                          <AppButton className="px-2 py-1 text-sm bg-blue-200" onClick={() => moveLayerDown(l.id)} type="button">↓</AppButton>

                          <AppButton
                            className={`px-2 py-1 text-sm ${(busy || quickMeasuringActive) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-yellow-300 hover:bg-yellow-400'}`}
                            disabled={busy || quickMeasuringActive}
                            onClick={() => { if (busy || quickMeasuringActive) return; editLayer(l.id); }}
                            type="button"
                            title={busy ? '当前有要素正在编辑/绘制，请先保存' : quickMeasuringActive ? '快捷测绘模式启用时禁止编辑图层（避免图层被转移导致卡死）' : '编辑'}
                          >编辑</AppButton>

                          <AppButton className="px-2 py-1 text-sm bg-red-400 text-white" onClick={() => deleteLayer(l.id)} type="button">删除</AppButton>

                          <AppButton
                            className="px-3 py-1 text-sm bg-purple-400 text-white"
                            onClick={() => { setJsonPanelText(getLayerJSONOutput(l)); setJsonPanelOpen(true); }}
                            type="button"
                          >JSON</AppButton>
                        </>
                      ) : null}

                      <div className="flex-1 text-sm truncate">
                        {getLayerDisplayTitle(l)}
                        <span className="text-gray-400"> {String(l.jsonInfo?.subType ?? l.mode)}</span>
                        <span style={{ color: l.color }} className="ml-1">■</span>
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            </div>
          </>
        );
      })()}
      </div>
    </AppCard>
  );



// 1) 启动按钮节点：允许被外部收纳，但不要影响其它面板渲染
const launcherNode = launcherSlot ? (
  launcherSlot(launcherContent)
) : (
  <div className="hidden sm:block">
    <div className="fixed top-4 right-4 z-[1001]">
      {launcherContent}
    </div>
  </div>
);

// 2) 桌面端图层管理：仅在 measuringActive 时出现（与测绘主面板一致：可拖拽，关闭=退出测绘并清理）
const layerManagerDesktopNode = measuringActive ? (
  <div className="hidden sm:block">
    <DraggablePanel
      id="measuring-layers"
      defaultPosition={{ x: 960, y: 120 }}
      zIndex={1790}
      constrainExpandedToViewport
    >
      {layerPanelCard}
    </DraggablePanel>
  </div>
) : null;

// 3) 合并输出：launcherSlot 只影响 launcher，不再“短路”图层管理
const rightDockNode = (
  <>
    {launcherNode}
    {/*
      The fixed toolbar may deliberately hide the legacy launcher with
      launcherSlot={() => null}. Keep the desktop portal outside that slot so
      an externally-triggered mapping menu remains renderable.
    */}
    {measureDropdownPortal}
    {!measureDropdownDesktop && measureDropdownOpen ? <div className="sm:hidden fixed right-4 top-[40%] z-[2600] max-h-[55vh] overflow-y-auto">{measureDropdownMenu}</div> : null}
    {layerManagerDesktopNode}
  </>
);





const measuringWindowActions = (
  <>
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setFeatureInteractionSuppressionEnabled((v) => !v);
      }}
      className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
        featureInteractionSuppressionEnabled
          ? 'border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100'
          : 'border-gray-200 bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600'
      }`}
      aria-label="要素交互抑制"
      title={featureInteractionSuppressionEnabled ? '要素交互抑制已开启：绘图时不再点开要素信息卡' : '要素交互抑制已关闭：绘图时允许点击要素信息卡'}
    >
      <MousePointerClick className="h-4 w-4" />
    </button>
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setToolPanelDisplaySuppressionEnabled((v) => !v);
      }}
      className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
        toolPanelDisplaySuppressionEnabled
          ? 'border-purple-200 bg-purple-50 text-purple-600 hover:bg-purple-100'
          : 'border-gray-200 bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600'
      }`}
      aria-label="工具栏显示抑制"
      title={toolPanelDisplaySuppressionEnabled ? '工具栏显示抑制已开启：未绘图时隐藏辅助工具区' : '工具栏显示抑制已关闭：辅助工具区始终显示'}
    >
      <EyeOff className="h-4 w-4" />
    </button>
  </>
);





  return (
    <>
      {nativeWorkflowSnapshot ? createPortal(<NativeWorkflowHost key={nativeWorkflowSnapshot.workflow.id} config={nativeWorkflowSnapshot.config} workflow={nativeWorkflowSnapshot.workflow} bridge={workflowBridge} registry={specializedWorkflowRegistry} onCommit={commitNativeWorkflow} onExit={stopWorkflowToSelector} />, nativeHostElement) : null}
      {rightDockNode}

      {/* =========================
          测绘菜单：桌面端（可拖拽）
         ========================= */}
      {measuringActive && (
        <div className="hidden sm:block">
          <DraggablePanel
            id="measuring-main"
            defaultPosition={{ x: 16, y: 240 }}
            zIndex={1800}
            expandedHeaderActions={measuringWindowActions}
          >
            <AppCard className="w-96 max-h-[70vh] overflow-hidden border" data-draggable-proxy-close="true">
              {/* 标题栏（拖拽区域） */}
              <div className="flex items-center px-4 py-3 pr-40 border-b">
                <h3 className="font-bold text-gray-800" data-draggable-title>{isReviewWorkspace ? '审核测绘工作区' : '测绘'}</h3>
                <button
                  type="button"
                  data-draggable-close
                  onClick={closeMeasuringUI}
                  className="sr-only"
                  aria-label="关闭"
                  title="关闭"
                />
              </div>

              {/* 内容区 */}
              <div className="p-3 overflow-y-auto max-h-[calc(70vh-48px)]">

{/* 点/线/面（完整模式） / 工作流选择（快捷模式） */}
{measuringVariant === 'full' ? (
  <div className="flex gap-2 mb-2">
    {(['point', 'polyline', 'polygon'] as const).map((m) => (
      <AppButton
        key={m}
        className={`flex-1 py-1 border ${drawMode === m ? 'bg-blue-300' : ''} ${
          isTempMountReadonly ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={() => handleDrawModeButtonClick(m)}
        type="button"
        disabled={isTempMountReadonly}
      >
        {m === 'point' ? '点' : m === 'polyline' ? '线' : '面'}
      </AppButton>
    ))}
  </div>
) : (
  <div className="flex gap-2 mb-2">
    <select
      className="flex-1 border p-1 rounded"
      value={workflowKey}
      disabled={workflowRunning}
      onChange={(e) => setWorkflowKey(e.target.value as WorkflowKey)}
    >
      {WORKFLOW_SELECT_OPTIONS.filter((item) => !item.hidden).map((item) => (
        <option key={item.key} value={item.key}>
          {item.label}
        </option>
      ))}
    </select>

    <AppButton
      className={`px-3 py-1 rounded border ${workflowRunning || isTempMountReadonly ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
      type="button"
      disabled={workflowRunning || isTempMountReadonly}
      onClick={startWorkflow}
    >
      开始
    </AppButton>

    <AppButton
      className={`px-3 py-1 rounded border ${!workflowRunning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
      type="button"
      disabled={!workflowRunning}
      onClick={stopWorkflowToSelector}
    >
      结束
    </AppButton>
  </div>
)}



                {/* 要素类型下拉 */}
                {measuringVariant === 'full' && drawMode !== 'none' ? renderFullCategoryPicker() : null}

                {/* 颜色 */}
                {drawMode !== 'none' && (
                  <div className="mb-2">
                    <label className="block mb-1 text-sm">颜色</label>
                    <input
                      type="color"
                      value={drawColor}
                      onChange={(e) => setDrawColor(e.target.value)}
                      className="w-full"
                    />
                  </div>
                )}

{drawMode !== 'none' && (
  <div className="flex gap-2 mb-2">
    <AppButton className="bg-yellow-400 text-white px-2 py-1 rounded flex-1" onClick={handleUndo} type="button">
      撤销
    </AppButton>
    <AppButton className="bg-orange-400 text-white px-2 py-1 rounded flex-1" onClick={handleRedo} type="button">
      重做
    </AppButton>

    {measuringVariant === 'full' && !externalEdit && (
      <AppButton
        className={`px-3 py-1 rounded-lg flex-1 ${
          isTempMountReadonly ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-500 text-white'
        }`}
        onClick={finishLayer}
        type="button"
        disabled={isTempMountReadonly}
      >
        {editingLayerId !== null ? '保存编辑图层' : '完成当前图层'}
      </AppButton>
    )}
  </div>
)}


<div className={shouldShowDrawingToolPanel ? '' : 'hidden'} aria-hidden={!shouldShowDrawingToolPanel}>
{/* 显示控制点 / 显示坐标：始终可见（坐标按钮仍只在开启后显示） */}
<div className="flex gap-2 mb-2">
  <AppButton
    type="button"
    className={`flex-1 px-2 py-1 rounded text-sm border ${
      showDraftControlPoints ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
    } ${showDraftControlPointsLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
    onClick={() => {
      if (showDraftControlPointsLocked) return;

      setShowDraftControlPoints((v) => {
        const next = !v;
        if (!next) setShowDraftControlPointCoords(false);
        return next;
      });
    }}
    title={showDraftControlPointsLocked ? '控制点修改/添加中：显示控制点已锁定开启' : '显示/隐藏控制点'}
  >
    显示控制点
  </AppButton>

  {showDraftControlPoints && (
    <AppButton
      type="button"
      className={`flex-1 px-2 py-1 rounded text-sm border ${
        showDraftControlPointCoords ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
      }`}
      onClick={() => setShowDraftControlPointCoords((v) => !v)}
      title="显示/隐藏控制点坐标"
    >
      显示坐标
    </AppButton>
  )}
</div>

{/* 坐标网格模式（点击创建点后立刻生效，可随时切换） */}
<div className="mb-2">
  <GridSnapModeSwitch />
</div>

{/* 手动输入 & 曲线输入：同一行并平分空间 */}
<div className="flex gap-2 mb-2">
  <ManualPointInput
    enabled={measuringActive && drawing && drawMode !== 'none' && !showMultipartPartLabels && !showDraftControlPointsLocked && !drawClickSuppressed && !curveInputFrozen}
    activeMode={drawMode}
    defaultY={-64}
    onSubmit={onManualPointSubmit}
    onOpenChange={setManualPointInputOpen}
    outerClassName="flex-1"
  />

  <CurveInputT
    ref={curveInputTRef}
    enabled={measuringActive && drawing && !showMultipartPartLabels && (drawMode === 'polyline' || drawMode === 'polygon') && !showDraftControlPointsLocked}
    externallySuppressed={drawClickSuppressed || curveInputFrozen}
    mapReady={mapReady}
    leafletMapRef={leafletMapRef}
    projectionRef={projectionRef}
    activeMode={drawMode}
    outerClassName="flex-1"
    // 曲线输入开启时：完全冻结主绘制/编辑交互（不影响 ControlPointsT 的抑制状态）
    onSetDrawClickSuppressed={(v) => setCurveInputFrozenImmediate(v)}
    onOpenChange={setCurveInputOpen}
    filterWorldPointByAssistLine={(p) => {
      const assist = assistLineToolsRef.current;
      if (assist?.isEnabled?.()) {
        const r = assist.transformWorldPoint(p);
        return r?.point ?? p;
      }
      return p;
    }}
    onCommitPoints={(points) => {
      if (!Array.isArray(points) || points.length === 0) return;

      setTempPoints((prev) => {
        const updated = [...prev, ...points];
        if (!acceptActiveMultipartCoords(updated)) return prev;
        if (multipartEnabledRef.current) persistActiveEditorCoords(updated);
        setRedoStack([]);
        drawDraftGeometry(updated, drawMode, drawColorRef.current);
        const last = updated[updated.length - 1];
        if (last) updateLatestEndpointMarker({ x: last.x, z: last.z }, drawColorRef.current);
        return updated;
      });
    }}
  />
</div>


{/* 辅助线 */}
<div className="mb-2">
  <AssistLineTools
    ref={assistLineToolsRef}
    mapReady={mapReady}
    leafletMapRef={leafletMapRef}
    projectionRef={projectionRef}
  />
</div>



{/* 控制点修改/添加/保存*/}
{drawMode !== 'none' && (
  <ControlPointsT
    ref={controlPointsTDesktopRef}
    mapReady={mapReady}
    leafletMapRef={leafletMapRef}
    projectionRef={projectionRef}
    activeMode={drawMode}
    activeColor={drawColor}
    activeCoords={tempPoints}
    validateCandidateCoords={(coords) => validateActiveMultipartCoords(coords)}
    onSessionStateChange={({ busy }) => updateControlPointSessionState('desktop', busy)}
    onApplyActiveCoords={(coords) => {
      if (!acceptActiveMultipartCoords(coords)) return;
      if (multipartEnabledRef.current) persistActiveEditorCoords(coords);
      setTempPoints(coords);
      drawDraftGeometry(coords, drawMode, drawColorRef.current);

      // 控制点编辑/插入保存后：不保留“最新端点临时点”
      draftEndpointRef.current?.clearLayers();
    }}
    onSetDrawClickSuppressed={(v) => {
      updateControlPointDrawSuppression('desktop', v);
    }}
    showControlPointsEnabled={showDraftControlPoints}
    showControlPointsLocked={showDraftControlPointsLocked}
    setShowControlPointsEnabled={(v) => {
      setShowDraftControlPoints(v);
      if (!v) setShowDraftControlPointCoords(false);
    }}
    setShowControlPointsLocked={setShowDraftControlPointsLocked}
    filterWorldPointByAssistLine={(p) => {
      const assist = assistLineToolsRef.current;
      if (assist?.isEnabled?.()) {
        const r = assist.transformWorldPoint(p);
        return r?.point ?? p;
      }
      return p;
    }}
  />
)}

{/* 多部件编辑：tempPoints 始终只指向当前下拉选择的部件（或当前内洞）。 */}
{renderMultipartEditor()}
</div>


{/* 临时输出：默认关闭；仅“默认” subtype 启用 */}
{measuringVariant === 'workflow' ? (
  workflowRunning ? (
    <div
  className="mb-2 border-t pt-2 pointer-events-auto"
  onMouseDownCapture={(e) => e.stopPropagation()}
  onPointerDownCapture={(e) => e.stopPropagation()}
  onTouchStartCapture={(e) => e.stopPropagation()}
>
  {nativeWorkflowSnapshot ? (measureDropdownDesktop ? <div ref={node => { if (node && nativeHostElement.parentElement !== node) node.appendChild(nativeHostElement); }} /> : null) : <WorkflowHost
    workflowKey={workflowKey}
    bridge={workflowBridge}
    registry={workflowRegistry}
    onExit={stopWorkflowToSelector}
  />}
</div>

  ) : null
) : (
  /* 临时输出：默认关闭；仅“默认” subtype 启用 */
  drawMode !== 'none' && subType === '默认' && !isWorkflowStyleEditing && (
    <div className="mb-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold">临时输出</label>
        <AppButton
          type="button"
          className={`px-2 py-1 text-xs rounded border ${
            tempOutputOpen ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => setTempOutputOpen(v => !v)}
        >
          {tempOutputOpen ? '收起' : '展开'}
        </AppButton>
      </div>

      {tempOutputOpen && (
        <textarea readOnly className="w-full h-20 border p-1" value={currentTempOutput()} />
      )}
    </div>
  )
)}



                {/* JSON 输入区 */}
{measuringVariant==='full'&&drawMode!=='none'?renderFullForm():null}

              </div>
            </AppCard>
          </DraggablePanel>
        </div>
      )}

      {/* 测绘菜单：手机端（固定布局，风格一致） */}
      {measuringActive && (
        <div className="sm:hidden fixed top-[240px] left-2 right-2 z-[1800]">
          <AppCard className="overflow-hidden border max-h-[70vh]">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-bold text-gray-800">{isReviewWorkspace ? '审核测绘工作区' : '测绘'}</h3>
              <AppButton
                onClick={closeMeasuringUI}
                className="text-gray-400 hover:text-gray-600"
                aria-label="关闭"
                type="button"
              >
                <X className="w-5 h-5" />
              </AppButton>
            </div>

            <div className="p-3 overflow-y-auto max-h-[calc(70vh-48px)]">
              <div className="flex gap-2 mb-2">
  {(['point', 'polyline', 'polygon'] as const).map((m) => (
    <AppButton
      key={m}
      className={`flex-1 py-1 border ${drawMode === m ? 'bg-blue-300' : ''} ${
        isTempMountReadonly ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={() => handleDrawModeButtonClick(m)}
      type="button"
      disabled={isTempMountReadonly}
    >
      {m === 'point' ? '点' : m === 'polyline' ? '线' : '面'}
    </AppButton>
  ))}
</div>


              {drawMode !== 'none' ? renderFullCategoryPicker() : null}

              {drawMode !== 'none' && (
                <div className="mb-2">
                  <label className="block mb-1 text-sm">颜色</label>
                  <input
                    type="color"
                    value={drawColor}
                    onChange={(e) => setDrawColor(e.target.value)}
                    className="w-full"
                  />
                </div>
              )}

{drawMode !== 'none' && (
  <div className="flex gap-2 mb-2">
    <AppButton className="bg-yellow-400 text-white px-2 py-1 rounded flex-1" onClick={handleUndo} type="button">
      撤销
    </AppButton>
    <AppButton className="bg-orange-400 text-white px-2 py-1 rounded flex-1" onClick={handleRedo} type="button">
      重做
    </AppButton>

    {measuringVariant === 'full' && !externalEdit && (
      <AppButton
        className={`px-3 py-1 rounded-lg flex-1 ${
          isTempMountReadonly ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-500 text-white'
        }`}
        onClick={finishLayer}
        type="button"
        disabled={isTempMountReadonly}
      >
        {editingLayerId !== null ? '保存编辑图层' : '完成当前图层'}
      </AppButton>
    )}
  </div>
)}


{/* 控制点修改/添加/保存 */}
{drawMode !== 'none' && (
  <ControlPointsT
    ref={controlPointsTCompactRef}
    mapReady={mapReady}
    leafletMapRef={leafletMapRef}
    projectionRef={projectionRef}
    activeMode={drawMode}
    activeColor={drawColor}
    activeCoords={tempPoints}
    validateCandidateCoords={(coords) => validateActiveMultipartCoords(coords)}
    onSessionStateChange={({ busy }) => updateControlPointSessionState('compact', busy)}
    onApplyActiveCoords={(coords) => {
      if (!acceptActiveMultipartCoords(coords)) return;
      if (multipartEnabledRef.current) persistActiveEditorCoords(coords);
      setTempPoints(coords);
      drawDraftGeometry(coords, drawMode, drawColorRef.current);

      // 控制点编辑/插入保存后：不保留“最新端点临时点”
      draftEndpointRef.current?.clearLayers();
    }}
    onSetDrawClickSuppressed={(v) => {
      updateControlPointDrawSuppression('compact', v);
    }}
    showControlPointsEnabled={showDraftControlPoints}
    showControlPointsLocked={showDraftControlPointsLocked}
    setShowControlPointsEnabled={(v) => {
      setShowDraftControlPoints(v);
      if (!v) setShowDraftControlPointCoords(false);
    }}
    setShowControlPointsLocked={setShowDraftControlPointsLocked}
    filterWorldPointByAssistLine={(p) => {
      const assist = assistLineToolsRef.current;
      if (assist?.isEnabled?.()) {
        const r = assist.transformWorldPoint(p);
        return r?.point ?? p;
      }
      return p;
    }}
  />
)}

{/* 紧凑面板与桌面面板共用同一套多部件/内部洞编辑器。 */}
{renderMultipartEditor()}



{measuringVariant === 'workflow' ? (
  workflowRunning ? (
    <div
  className="mb-2 border-t pt-2 pointer-events-auto"
  onMouseDownCapture={(e) => e.stopPropagation()}
  onPointerDownCapture={(e) => e.stopPropagation()}
  onTouchStartCapture={(e) => e.stopPropagation()}
>
  {nativeWorkflowSnapshot ? (!measureDropdownDesktop ? <div ref={node => { if (node && nativeHostElement.parentElement !== node) node.appendChild(nativeHostElement); }} /> : null) : <WorkflowHost
    workflowKey={workflowKey}
    bridge={workflowBridge}
    registry={workflowRegistry}
    onExit={stopWorkflowToSelector}
  />}
</div>

  ) : null
) : (
  /* 临时输出：默认关闭；仅“默认” subtype 启用 */
  drawMode !== 'none' && subType === '默认' && !isWorkflowStyleEditing && (
    <div className="mb-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold">临时输出</label>
        <AppButton
          type="button"
          className={`px-2 py-1 text-xs rounded border ${
            tempOutputOpen ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => setTempOutputOpen(v => !v)}
        >
          {tempOutputOpen ? '收起' : '展开'}
        </AppButton>
      </div>

      {tempOutputOpen && (
        <textarea readOnly className="w-full h-20 border p-1" value={currentTempOutput()} />
      )}
    </div>
  )
)}



{measuringVariant==='full'&&drawMode!=='none'?renderFullForm():null}

            </div>
          </AppCard>
        </div>
      )}

      {/* =========================
          导入面板：桌面端（可拖拽）
         ========================= */}
      {importPanelOpen && (
        <div className="hidden sm:block">
          <DraggablePanel id="measuring-import" defaultPosition={{ x: 420, y: 240 }} zIndex={1800}>
            <AppCard className="w-96 overflow-hidden border">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="font-bold text-gray-800">导入矢量数据</h3>
                <AppButton
                  onClick={() => setImportPanelOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                  aria-label="关闭"
                  title="关闭"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </AppButton>
              </div>

              <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                <div className="text-sm font-bold">格式</div>
                <div className="text-xs text-gray-600">批量（JSON）</div>


                <label className="block text-sm font-bold mb-1">数据输入</label>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  className="w-full border rounded p-2 text-sm"
placeholder={'批量 JSON：支持数组或 {items:[...]} / {features:[...]}。也允许多条对象粘贴但外层未包 []（例如 {..},{..} 或 换行分隔）。\n每条必须是“新规范 JSON”(含 Type/Class/World)，且 Class 必须可映射到已支持格式。'}
                  rows={6}
                />

                <AppButton
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg w-full disabled:opacity-60"
                  onClick={handleUploadFileClick}
                  type="button"
                  disabled={importFileBusy}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>上传文件</span>
                  </span>
                </AppButton>
                <input
                  ref={importFileInputRef}
                  type="file"
                  accept=".zip,application/zip,.json,application/json"
                  className="hidden"
                  onChange={handleImportFileSelected}
                />
                <AppButton className="bg-green-600 text-white px-3 py-2 rounded-lg w-full" onClick={handleImport} type="button">
                  导入
                </AppButton>
              </div>
            </AppCard>
          </DraggablePanel>
        </div>
      )}

      {/* 导入面板：手机端（固定） */}
      {importPanelOpen && (
        <div className="sm:hidden fixed bottom-24 left-2 right-2 z-[1800]">
          <AppCard className="overflow-hidden border">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-bold text-gray-800">导入矢量数据</h3>
              <AppButton
                onClick={() => setImportPanelOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                aria-label="关闭"
                title="关闭"
                type="button"
              >
                <X className="w-4 h-4" />
              </AppButton>
            </div>

            <div className="p-4 space-y-3">
              <div className="text-sm font-bold">格式</div>
                <div className="text-xs text-gray-600">批量（JSON）</div>


              <label className="block text-sm font-bold mb-1">数据输入</label>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="w-full border rounded p-2 text-sm"
                rows={6}
              />

                <AppButton
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg w-full disabled:opacity-60"
                  onClick={handleUploadFileClick}
                  type="button"
                  disabled={importFileBusy}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>上传文件</span>
                  </span>
                </AppButton>
                <input
                  ref={importFileInputRef}
                  type="file"
                  accept=".zip,application/zip,.json,application/json"
                  className="hidden"
                  onChange={handleImportFileSelected}
                />
              <AppButton className="bg-green-600 text-white px-3 py-2 rounded-lg w-full" onClick={handleImport} type="button">
                导入
              </AppButton>
            </div>
          </AppCard>
        </div>
      )}

      {/* ======== 图层控制器（手机端） ======== */}
      {measuringActive && (
        <div className="sm:hidden fixed top-20 right-2 left-2 z-[1000]">
          {layerPanelCard}
        </div>
      )}


      {/* ======== JSON 导出窗口（替代 alert/print） ======== */}
{measuringActive && jsonPanelOpen && (
  <DraggablePanel id="measuring-json-export" defaultPosition={{ x: 340, y: 260 }} zIndex={1900}>
    <AppCard className="w-[520px] max-h-[70vh] overflow-hidden border">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-bold text-gray-800">JSON 导出</h3>
        <AppButton
          onClick={() => setJsonPanelOpen(false)}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
          aria-label="关闭"
          title="关闭"
          type="button"
        >
          <X className="w-4 h-4" />
        </AppButton>
      </div>

      <div className="p-3 flex gap-3">
        {/* 左侧：按要素类型分区导出 */}
        <div className="w-28 shrink-0 border rounded p-2 bg-gray-50 max-h-[50vh] overflow-hidden flex flex-col">
          <div className="text-xs text-gray-500 mb-2">导出范围</div>
          <div className="space-y-1 overflow-y-auto flex-1">
            <AppButton
              type="button"
              className={`w-full px-2 py-1 text-sm rounded border ${
                jsonExportSubType === '__ALL__'
                  ? 'bg-blue-600 text-white border-blue-700'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => {
                setJsonExportSubType('__ALL__');
                setJsonPanelText(getLayersJSONOutputBySubType('__ALL__'));
              }}
            >
              全部
            </AppButton>
            {getAvailableSubTypes().map((k) => (
              <AppButton
                key={k}
                type="button"
                className={`w-full px-2 py-1 text-sm rounded border ${
                  jsonExportSubType === k
                    ? 'bg-blue-600 text-white border-blue-700'
                    : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => {
                  setJsonExportSubType(k);
                  setJsonPanelText(getLayersJSONOutputBySubType(k));
                }}
              >
                {k}
              </AppButton>
            ))}
            {getAvailableWorkflowCatalogKeys().length > 0 && (
              <>
                <div className="mt-3 pt-2 border-t border-black/10 text-xs text-black/60">
                  按当前分类
                </div>
                {getAvailableWorkflowCatalogKeys().map((it) => (
                  <AppButton
                    key={it.key}
                    type="button"
                    className={`w-full px-2 py-1 text-sm rounded border ${
                      jsonExportSubType === it.key
                        ? 'bg-blue-600 text-white border-blue-700'
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setJsonExportSubType(it.key);
                      setJsonPanelText(getLayersJSONOutputByWorkflowCatalogKey(it.key));
                    }}
                  >
                    {it.label}
                  </AppButton>
                ))}
              </>
            )}
          </div>

          {/* 红框位置：复制（把原“复制”按钮挪到左侧底部） */}
          <div className="pt-2">
            <AppButton
              className="w-full bg-blue-600 text-white px-2 py-2 rounded-lg"
              onClick={async () => {
                const text = jsonPanelText ?? '';
                try {
                  await navigator.clipboard.writeText(text);
                } catch {
                  // fallback
                  const ta = document.createElement('textarea');
                  ta.value = text;
                  ta.style.position = 'fixed';
                  ta.style.left = '-9999px';
                  document.body.appendChild(ta);
                  ta.focus();
                  ta.select();
                  try {
                    document.execCommand('copy');
                  } finally {
                    document.body.removeChild(ta);
                  }
                }
              }}
              type="button"
            >
              复制
            </AppButton>
          </div>
        </div>

        {/* 右侧：内容 + 操作 */}
        <div className="flex-1 space-y-2">
          <textarea
            readOnly
            className="w-full h-64 border p-2 text-xs font-mono rounded"
            value={jsonPanelText}
          />

          <div className="flex gap-2">
            {/* 原“复制” → 下载(分条) */}
            <AppButton
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg"
              onClick={() => {
                const text = jsonPanelText ?? '';

                const safeName = (s: string) =>
                  String(s)
                    .trim()
                    .replace(/[\\/\s:*?"<>|]+/g, '_')
                    .replace(/_+/g, '_')
                    .slice(0, 120);

                let arr: any[] = [];
                try {
                  const parsed = JSON.parse(text);
                  if (Array.isArray(parsed)) arr = parsed;
                  else if (parsed && typeof parsed === 'object') arr = [parsed];
                } catch {
                  window.alert('无法解析当前 JSON 文本，无法进行分条下载。');
                  return;
                }

                if (!arr.length) {
                  window.alert('当前导出内容为空。');
                  return;
                }

                const files = arr.map((obj, idx) => {
                  const clsGuess = String((obj as any)?.Class ?? (obj as any)?.subType ?? (obj as any)?.Type ?? '').trim();
                  const { idValue } = pickIdFieldValue(obj, clsGuess);
                  const id = String(idValue ?? '').trim();
                  const base = safeName(id || `item_${String(idx + 1).padStart(3, '0')}`);
                  return {
                    name: `${base}.json`,
                    text: stringifyFeatureJson(obj),
                  };
                });

                const zipBlob = buildZipStore(files);
                const now = new Date();
                const y = String(now.getFullYear());
                const m = String(now.getMonth() + 1).padStart(2, '0');
                const d = String(now.getDate()).padStart(2, '0');
                const scopeName = jsonExportSubType === '__ALL__' ? 'ALL' : String(jsonExportSubType);
                const zipName = `${safeName(scopeName)}_${y}${m}${d}_split.zip`;

                try {
                  const url = URL.createObjectURL(zipBlob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = zipName;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                } catch {
                  // ignore
                }
              }}
              type="button"
            >
              下载(分条)
            </AppButton>

            {/* 原“下载” → 下载(完整)（功能不变） */}
            <AppButton
              className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg"
              onClick={() => {
                const text = jsonPanelText ?? '';
                const now = new Date();
                const y = String(now.getFullYear());
                const m = String(now.getMonth() + 1).padStart(2, '0');
                const d = String(now.getDate()).padStart(2, '0');
                const name = jsonExportSubType === '__ALL__' ? 'ALL' : String(jsonExportSubType);
                const filename = `${name}_${y}${m}${d}.json`;
                try {
                  const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = filename;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                } catch {
                  // ignore
                }
              }}
              type="button"
            >
              下载(完整)
            </AppButton>

            <AppButton
              className="flex-1 bg-gray-200 text-gray-800 px-3 py-2 rounded-lg"
              onClick={() => setJsonPanelOpen(false)}
              type="button"
            >
              关闭
            </AppButton>
          </div>
        </div>
      </div>
    </AppCard>
  </DraggablePanel>
)}

{switchWarnOpen && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
    <AppCard className="w-[420px] max-w-[90vw] border">
      <div className="px-4 py-3 border-b font-bold text-sm">
        切换确认
      </div>
      <div className="px-4 py-3 text-sm text-gray-800">
        特殊要素格式附加信息不为空，切换将会丢失所有信息，确定要切换吗？
      </div>
      <div className="px-4 py-3 border-t flex justify-end gap-2">
        <AppButton
          type="button"
          className="px-3 py-1.5 rounded border bg-white text-gray-800 hover:bg-gray-50"
          onClick={cancelExtraSwitch}
        >
          取消
        </AppButton>
        <AppButton
          type="button"
          className="px-3 py-1.5 rounded border bg-blue-600 text-white border-blue-700 hover:bg-blue-700"
          onClick={confirmExtraSwitch}
        >
          确定
        </AppButton>
      </div>
    </AppCard>
  </div>
)}

{tempMountConflictOpen && (
  <>
    {/* 桌面端：可拖动 Panel（固定高度 + 纵向滚动），避免长报告溢出无法交互 */}
    <div className="hidden sm:block">
      <div className="fixed inset-0 z-[9998] bg-black/40" />
      <DraggablePanel id="temp-mount-conflict" defaultPosition={{ x: 420, y: 220 }} zIndex={9999}>
        <AppCard className="w-[560px] max-w-[90vw] max-h-[70vh] overflow-hidden border">
          <div className="px-4 py-3 border-b font-bold text-sm">ID 冲突提示</div>
          <div className="px-4 py-3 text-sm text-gray-800 whitespace-pre-wrap overflow-y-auto max-h-[calc(70vh-96px)]">
            {tempMountConflictText}
          </div>
          <div className="px-4 py-3 border-t flex justify-end gap-2">
            <AppButton
              type="button"
              className="px-3 py-1.5 rounded border bg-white text-gray-800 hover:bg-gray-50"
              onClick={cancelTempMountConflict}
            >
              返回
            </AppButton>
            {tempMountConflictAllowOverride && (
              <AppButton
                type="button"
                className="px-3 py-1.5 rounded border bg-blue-600 text-white border-blue-700 hover:bg-blue-700"
                onClick={confirmTempMountConflictOverride}
              >
                确定
              </AppButton>
            )}
          </div>
        </AppCard>
      </DraggablePanel>
    </div>

    {/* 移动端：底部面板（固定高度 + 纵向滚动） */}
    <div className="sm:hidden fixed inset-0 z-[9999] bg-black/40 flex items-end">
      <AppCard className="w-full max-h-[70vh] overflow-hidden border rounded-t-2xl">
        <div className="px-4 py-3 border-b font-bold text-sm">ID 冲突提示</div>
        <div className="px-4 py-3 text-sm text-gray-800 whitespace-pre-wrap overflow-y-auto max-h-[calc(70vh-96px)]">
          {tempMountConflictText}
        </div>
        <div className="px-4 py-3 border-t flex justify-end gap-2">
          <AppButton
            type="button"
            className="px-3 py-1.5 rounded border bg-white text-gray-800 hover:bg-gray-50"
            onClick={cancelTempMountConflict}
          >
            返回
          </AppButton>
          {tempMountConflictAllowOverride && (
            <AppButton
              type="button"
              className="px-3 py-1.5 rounded border bg-blue-600 text-white border-blue-700 hover:bg-blue-700"
              onClick={confirmTempMountConflictOverride}
            >
              确定
            </AppButton>
          )}
        </div>
      </AppCard>
    </div>
  </>
)}

{tempMountIdCheckOpen && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
    <AppCard className="w-[420px] max-w-[90vw] border">
      <div className="px-4 py-3 border-b font-bold text-sm">加载中</div>
      <div className="px-4 py-3 text-sm text-gray-800">{tempMountIdCheckText}</div>
      <div className="px-4 py-3 border-t">
        <div className="h-2 bg-gray-200 rounded overflow-hidden">
          <div className="h-2 bg-blue-600 rounded animate-pulse" style={{ width: '60%' }} />
        </div>
      </div>
    </AppCard>
  </div>
)}

<BlockingFullscreenModal open={externalClearConfirmation !== null} onBackdropClick={() => resolveExternalClearConfirmation(false)}>
  <AppCard className="w-[440px] max-w-[92vw] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" role="dialog" aria-modal="true" aria-label="清理测绘工作区确认">
    <div className="border-b border-slate-200 px-5 py-4 text-lg font-bold text-slate-900">切换前确认</div>
    <div className="px-5 py-4 text-sm leading-6 text-slate-700">
      {externalClearConfirmation?.mode === 'review-dirty'
        ? `${externalClearConfirmation.label}会清除当前审核工作区的图层、删除标记、图片绑定与未保存编辑。可先保存为新的审核版本，或放弃本次编辑后继续。`
        : `${externalClearConfirmation?.label ?? '此操作'}会关闭当前${isReviewWorkspace ? '审核' : '测绘'}工作区并清除其临时图层、删除标记和图片绑定。当前没有未保存编辑。是否继续？`}
    </div>
    <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-3">
      <AppButton type="button" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => resolveExternalClearConfirmation(false)}>{externalClearConfirmation?.mode === 'review-dirty' ? '继续编辑' : '取消'}</AppButton>
      {externalClearConfirmation?.mode === 'review-dirty' ? <AppButton type="button" disabled={reviewSaveInProgress} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300" onClick={() => { void (async () => { if (await handleReviewSaveAction()) resolveExternalClearConfirmation(true); })(); }}>{reviewSaveInProgress ? '保存中…' : '保存新版本并继续'}</AppButton> : null}
      <AppButton type="button" className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700" onClick={() => resolveExternalClearConfirmation(true)}>{externalClearConfirmation?.mode === 'review-dirty' ? '放弃编辑并继续' : '确认切换'}</AppButton>
    </div>
  </AppCard>
</BlockingFullscreenModal>

<BlockingFullscreenModal open={reviewNotice !== null} onBackdropClick={() => setReviewNotice(null)}>
  <AppCard className="w-[440px] max-w-[92vw] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" role="dialog" aria-modal="true" aria-label="审核工作区提示">
    <div className="border-b border-slate-200 px-5 py-4 text-lg font-bold text-slate-900">审核工作区</div>
    <div className="whitespace-pre-wrap px-5 py-4 text-sm leading-6 text-slate-700">{reviewNotice}</div>
    <div className="flex justify-end border-t border-slate-200 px-5 py-3">
      <AppButton type="button" className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700" onClick={() => setReviewNotice(null)}>知道了</AppButton>
    </div>
  </AppCard>
</BlockingFullscreenModal>

{endMeasuringWarnOpen && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
    <AppCard className="w-[420px] max-w-[90vw] border">
      <div className="px-4 py-3 border-b font-bold text-sm">结束测绘确认</div>
      <div className="px-4 py-3 text-sm text-gray-800">
        结束测绘将清除所有测绘图层，是否确认？
      </div>
      <div className="px-4 py-3 border-t flex justify-end gap-2">
        <AppButton
          type="button"
          className="px-3 py-1.5 rounded border bg-white text-gray-800 hover:bg-gray-50"
          onClick={cancelEndMeasuring}
        >
          返回
        </AppButton>
        <AppButton
          type="button"
          className="px-3 py-1.5 rounded border bg-blue-600 text-white border-blue-700 hover:bg-blue-700"
          onClick={confirmEndMeasuring}
        >
          确认
        </AppButton>
      </div>
    </AppCard>
  </div>
)}


      <RelayPackageExportPanel
        open={relayPackageExportOpen}
        draft={relayPackageDraft}
        featureCount={layers.filter((l) => l.id !== editingLayerId && l.jsonInfo?.featureInfo).length}
        onClose={() => setRelayPackageExportOpen(false)}
        onExport={handleExportRelayPackage}
        onUploadToReview={onReviewPackageUpload ? async ({ blob, filename, note }) => onReviewPackageUpload({ blob, packageName: filename, summary: note }) : undefined}
      />

      <DeleteFeatureSelectionPanel
        open={deletePanelOpen}
        items={relayPackageDraft.deleteMarks}
        candidates={buildDeleteCandidatesFromLayers()}
        currentWorldId={currentWorldId}
        onClose={() => { setDeletePanelOpen(false); setDeleteMapPickEnabled(false); setDeletePickPanelOpen(false); setDeletePickCandidate(null); setDeletePickedCandidate(null); }}
        mapPickEnabled={deleteMapPickEnabled && deletePickPanelOpen}
        pickedItem={deletePickedCandidate}
        onOpenPickPanel={() => { setDeletePickPanelOpen(true); setDeleteMapPickEnabled(true); setDeletePickCandidate(null); }}
        onConfirm={(items) => {
          setRelayPackageDraft((prev) => ({
            ...prev,
            deleteMarks: items.map((x) => ({
              ID: x.ID,
              Name: x.Name || '',
              ...(x.worldId ? { worldId: x.worldId } : { worldId: currentWorldId }),
              ...(x.className ? { classCode: x.className } : {}),
            })),
            meta: { ...prev.meta, updatedAt: new Date().toISOString() },
          }));
          setDeletePanelOpen(false);
          setDeleteMapPickEnabled(false);
          setDeletePickPanelOpen(false);
          setDeletePickCandidate(null);
          setDeletePickedCandidate(null);
        }}
      />

      <DeleteFeaturePickPanel
        open={deletePickPanelOpen}
        active={deleteMapPickEnabled}
        candidate={deletePickCandidate}
        onCancel={() => { setDeletePickPanelOpen(false); setDeleteMapPickEnabled(false); setDeletePickCandidate(null); }}
        onConfirm={(item) => {
          setDeletePickedCandidate(item);
          setDeletePickPanelOpen(false);
          setDeleteMapPickEnabled(false);
          setDeletePickCandidate(null);
        }}
      />

      <FeaturePictureBindingPanel
        open={picturePanelOpen}
        title={getLayerPictureBindingContext(picturePanelLayerId)?.title ?? '图片绑定'}
        pictures={getLayerPictureBindingContext(picturePanelLayerId)?.pictures ?? []}
        onClose={() => setPicturePanelOpen(false)}
        onConfirm={(pictures) => applyPictureBindingForLayer(picturePanelLayerId, pictures)}
      />


  </>
);
});

MappingEditorCore.displayName = 'MappingEditorCore';
export default MappingEditorCore;
