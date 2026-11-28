import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from 'react';
import * as L from 'leaflet';
import type { DynmapProjection } from '@/lib/DynmapProjection';
import { DraggablePanel } from '@/components/DraggablePanel/DraggablePanel';
import { Undo2, Redo2, X, ArrowLeftRight } from 'lucide-react';
import AppButton from '@/components/ui/AppButton';
import AppCard from '@/components/ui/AppCard';
import DirectPointEditor, { type DirectPointEditorHandle } from './DirectPointEditor';
import { logicalPoints, type InputPoint } from './pointSequence';
export type WorldPoint = InputPoint;
export type ControlPointsTHandle = {
  isBusy: () => boolean;
  getMode: () => 'none' | 'edit' | 'add' | 'delete';
  requestCloseAndClear: () => boolean;
};
type ControlPointsTProps = {
  readOnly?: boolean; onOpenCompleteArray?: () => void; contextKey?: string; additionalControls?: ReactNode;
  mapReady: boolean; leafletMapRef: MutableRefObject<L.Map | null>; projectionRef: MutableRefObject<DynmapProjection | null>;
  activeMode: 'none' | 'point' | 'polyline' | 'polygon'; activeColor: string; activeCoords: WorldPoint[];
  onApplyActiveCoords?: (coords: WorldPoint[]) => boolean | void;
  validateCandidateCoords?: (coords: WorldPoint[]) => string | undefined;
  onSessionStateChange?: (state: { busy: boolean; mode: 'none' | 'edit' | 'add' | 'delete' | 'array' }) => void;
  onSetDrawClickSuppressed?: (suppressed: boolean) => void;
  showControlPointsEnabled?: boolean; showControlPointsLocked?: boolean;
  setShowControlPointsEnabled?: (value: boolean) => void; setShowControlPointsLocked?: (value: boolean) => void;
  filterWorldPointByAssistLine?: (point: WorldPoint) => WorldPoint;
};
type GeometryTypeForArrayEditor = 'point' | 'polyline' | 'polygon';
type ParsedArrayCoords = { coords: WorldPoint[]; geometryType: GeometryTypeForArrayEditor; defaultY: number };
function getGeometryTypeForArrayEditor(activeMode: ControlPointsTProps['activeMode']): GeometryTypeForArrayEditor | null {
  if (activeMode === 'point' || activeMode === 'polyline' || activeMode === 'polygon') return activeMode;
  return null;
}

function getMinimumCountForGeometryType(type: GeometryTypeForArrayEditor) {
  if (type === 'point') return 1;
  if (type === 'polyline') return 2;
  return 3;
}

function inferDefaultY(coords: WorldPoint[]) {
  const y = coords.find((p) => typeof p.y === 'number' && Number.isFinite(p.y))?.y;
  return typeof y === 'number' ? y : 0;
}

function buildArrayEditorCoords(coords: WorldPoint[], defaultY?: number): WorldPoint[] {
  const yFallback = Number.isFinite(defaultY ?? NaN) ? Number(defaultY) : inferDefaultY(coords);
  return coords.map((p) => ({ x: p.x, y: typeof p.y === 'number' && Number.isFinite(p.y) ? p.y : yFallback, z: p.z }));
}

function stringifyArrayEditorCoords(coords: WorldPoint[]) {
  const lines = coords.map((p) => `  [${p.x},${typeof p.y === 'number' ? p.y : 0},${p.z}]`);
  if (!lines.length) return '[]';
  return `[\n${lines.join(',\n')}\n]`;
}

function parseArrayEditorCoords(
  rawText: string,
  geometryType: GeometryTypeForArrayEditor,
  defaultY: number
): ParsedArrayCoords {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error('当前内容不是合法 JSON，请检查中括号、逗号和数字格式。');
  }

  if (!Array.isArray(parsed)) {
    throw new Error('当前内容必须是 JSON 数组，格式应为 [[x,y,z],[x,y,z]]。');
  }

  const coords: WorldPoint[] = [];
  for (let i = 0; i < parsed.length; i++) {
    const item = parsed[i];
    if (!Array.isArray(item) || item.length !== 3) {
      throw new Error(`第 ${i + 1} 个坐标必须严格为 [x,y,z] 三元数组。`);
    }
    const [x, y, z] = item;
    if (![x, y, z].every((n) => typeof n === 'number' && Number.isFinite(n))) {
      throw new Error(`第 ${i + 1} 个坐标存在非法数值，x / y / z 都必须是有限数字。`);
    }
    coords.push({ x, y, z });
  }

  const minCount = getMinimumCountForGeometryType(geometryType);
  if (coords.length < minCount) {
    const name = geometryType === 'point' ? '点' : geometryType === 'polyline' ? '线' : '面';
    throw new Error(`${name}要素至少需要 ${minCount} 个控制点，当前仅有 ${coords.length} 个。`);
  }

  return { coords, geometryType, defaultY: Number.isFinite(defaultY) ? defaultY : 0 };
}

export default forwardRef<ControlPointsTHandle, ControlPointsTProps>(function ControlPointsT(props, ref) {
  const { activeMode, activeColor, activeCoords, readOnly = false, onApplyActiveCoords, validateCandidateCoords, onSetDrawClickSuppressed } = props;
  const latest = useRef(props); latest.current = props;
  const readOnlyRef = useRef(readOnly); readOnlyRef.current = readOnly;
  const editor = useRef<DirectPointEditorHandle | null>(null);
  const [editing, setEditing] = useState(false);
  const editingRef = useRef(false);
  const [arrayEditorOpen, setArrayEditorOpen] = useState(false);
  const arrayContext = useRef<string | undefined>();
  const arrayOpenRef = useRef(false); arrayOpenRef.current = arrayEditorOpen;
  const [statusText, setStatusText] = useState('');
  const [arrayText, setArrayText] = useState('');
  const [arrayUndoStack, setArrayUndoStack] = useState<string[]>([]);
  const [arrayRedoStack, setArrayRedoStack] = useState<string[]>([]);
  const [arrayValidated, setArrayValidated] = useState(false);
  const [arrayValidatedCoords, setArrayValidatedCoords] = useState<WorldPoint[] | null>(null);
  const [arrayAppliedText, setArrayAppliedText] = useState('');
  const [arrayDefaultY, setArrayDefaultY] = useState(0);
  const arrayGeometryType = getGeometryTypeForArrayEditor(activeMode);
  const arrayDirty = arrayText !== arrayAppliedText;
  const prevShow = useRef<{ enabled: boolean; locked: boolean } | null>(null);
  const report = (edit: boolean, array = arrayOpenRef.current) => {
    const p = latest.current;
    p.onSetDrawClickSuppressed?.(edit || array);
    p.onSessionStateChange?.({ busy: edit || array, mode: edit ? 'edit' : array ? 'array' : 'none' });
  };
  const onEditSession = (busy: boolean) => {
    editingRef.current = busy; setEditing(busy);
    const p = latest.current;
    if (busy && !prevShow.current) {
      prevShow.current = { enabled: Boolean(p.showControlPointsEnabled), locked: Boolean(p.showControlPointsLocked) };
      p.setShowControlPointsEnabled?.(true); p.setShowControlPointsLocked?.(true);
    } else if (!busy && prevShow.current) {
      p.setShowControlPointsEnabled?.(prevShow.current.enabled); p.setShowControlPointsLocked?.(prevShow.current.locked); prevShow.current = null;
    }
    report(busy);
  };
  const resetArrayEditorState = useCallback(() => { arrayOpenRef.current = false; setArrayEditorOpen(false); setArrayText(''); setArrayUndoStack([]); setArrayRedoStack([]); setArrayValidated(false); setArrayValidatedCoords(null); setArrayAppliedText(''); }, []);
  const recordArrayTextChange = useCallback((nextText: string) => {
    setArrayText((current) => {
      if (nextText === current) return current;
      setArrayUndoStack((u) => [...u, current]);
      setArrayRedoStack([]);
      setArrayValidated(false);
      setArrayValidatedCoords(null);
      return nextText;
    });
  }, []);

  const openArrayEditor = useCallback(() => {
    if(readOnlyRef.current)return;
    if (arrayEditorOpen) return;
    if (!arrayGeometryType) {
      setStatusText('数组编辑：当前没有可编辑的要素类型');
      return;
    }
    if (editing) {
      setStatusText('数组编辑开启前，请先结束控制点修改、添加或删除');
      return;
    }
    if (!activeCoords.length) {
      setStatusText('数组编辑：当前没有可导入的控制点');
      return;
    }

    const defaultY = inferDefaultY(activeCoords);
    const importedCoords = buildArrayEditorCoords(activeCoords, defaultY);
    const importedText = stringifyArrayEditorCoords(importedCoords);

    arrayContext.current = latest.current.contextKey;
    setArrayDefaultY(defaultY);
    setArrayText(importedText);
    setArrayAppliedText(importedText);
    setArrayUndoStack([]);
    setArrayRedoStack([]);
    setArrayValidated(true);
    setArrayValidatedCoords(importedCoords);
    setArrayEditorOpen(true);
    onSetDrawClickSuppressed?.(true);
    setStatusText('数组编辑已开启：当前控制点数组已导入并标记为“已校验”');
  }, [arrayEditorOpen, arrayGeometryType, editing, activeCoords, onSetDrawClickSuppressed]);

  const closeArrayEditorNow = useCallback(() => {
    resetArrayEditorState();
    if (!(editing)) {
      onSetDrawClickSuppressed?.(false);
    }
  }, [resetArrayEditorState, editing, onSetDrawClickSuppressed]);

  const tryCloseArrayEditor = useCallback(() => {
    if (arrayDirty) {
      const ok = window.confirm('数组编辑中存在未应用的修改，确定关闭并放弃这些修改吗？');
      if (!ok) return false;
    }
    closeArrayEditorNow();
    return true;
  }, [arrayDirty, closeArrayEditorNow]);

  const validateArrayEditor = useCallback(() => {
    if (!arrayGeometryType) {
      window.alert('当前没有可校验的要素类型。');
      return;
    }

    try {
      const parsed = parseArrayEditorCoords(arrayText, arrayGeometryType, arrayDefaultY);
      const error = validateCandidateCoords?.(parsed.coords);
      if (error) throw new Error(error);
      setArrayValidated(true);
      setArrayValidatedCoords(parsed.coords);
      setStatusText(`数组校验通过：当前控制点数 ${parsed.coords.length}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : '数组校验失败';
      setArrayValidated(false);
      setArrayValidatedCoords(null);
      window.alert(message);
    }
  }, [arrayGeometryType, arrayText, arrayDefaultY, validateCandidateCoords]);

  const applyArrayEditorToDraft = useCallback(() => {
    if(readOnlyRef.current||arrayContext.current!==latest.current.contextKey)return false;
    if (!arrayValidated || !arrayValidatedCoords) return false;

    const applied = arrayValidatedCoords.map((p) => ({ ...p }));
    const error = validateCandidateCoords?.(applied);
    if (error) {
      setStatusText(`数组未应用：${error}`);
      return false;
    }
    if (onApplyActiveCoords?.(applied) === false) return false;
    setArrayAppliedText(arrayText);
    setStatusText(`已应用数组编辑结果：当前控制点数 ${applied.length}`);
    return true;
  }, [arrayValidated, arrayValidatedCoords, onApplyActiveCoords, arrayText, validateCandidateCoords]);

  const finishArrayEditor = useCallback(() => {
    if (!arrayValidated) return;
    if (arrayDirty) {
      const ok = applyArrayEditorToDraft();
      if (!ok) return;
    }
    closeArrayEditorNow();
  }, [arrayValidated, arrayDirty, applyArrayEditorToDraft, closeArrayEditorNow]);

  const doArrayUndo = useCallback(() => {
    setArrayUndoStack((u) => {
      if (!u.length) return u;
      const last = u[u.length - 1];
      setArrayText((current) => {
        setArrayRedoStack((r) => [...r, current]);
        return last;
      });
      setArrayValidated(false);
      setArrayValidatedCoords(null);
      return u.slice(0, u.length - 1);
    });
  }, []);

  const doArrayRedo = useCallback(() => {
    setArrayRedoStack((r) => {
      if (!r.length) return r;
      const last = r[r.length - 1];
      setArrayText((current) => {
        setArrayUndoStack((u) => [...u, current]);
        return last;
      });
      setArrayValidated(false);
      setArrayValidatedCoords(null);
      return r.slice(0, r.length - 1);
    });
  }, []);

  const canArrayReverse = useMemo(() => {
    return Boolean(arrayValidated && arrayValidatedCoords && arrayValidatedCoords.length >= 2);
  }, [arrayValidated, arrayValidatedCoords]);

  const doArrayReverse = useCallback(() => {
    if (!canArrayReverse || !arrayValidatedCoords) return;
    const reversed = arrayValidatedCoords.slice().reverse();
    setArrayUndoStack((u) => [...u, arrayText]);
    setArrayRedoStack([]);
    setArrayText(stringifyArrayEditorCoords(reversed));
    setArrayValidated(false);
    setArrayValidatedCoords(null);
    setStatusText('数组编辑：已执行反转，请重新校验后再应用');
  }, [canArrayReverse, arrayValidatedCoords, arrayText]);


  useEffect(() => { report(editing, arrayEditorOpen); }, [editing, arrayEditorOpen]);
  useEffect(() => () => { latest.current.onSetDrawClickSuppressed?.(false); latest.current.onSessionStateChange?.({ busy: false, mode: 'none' }); }, []);
  useEffect(() => { resetArrayEditorState(); }, [props.contextKey, resetArrayEditorState]);
  useImperativeHandle(ref, () => ({ isBusy: () => editingRef.current || arrayOpenRef.current, getMode: () => editingRef.current ? 'edit' : 'none', requestCloseAndClear: () => {
    if (editor.current && !editor.current.close()) return false;
    return !arrayOpenRef.current || tryCloseArrayEditor();
  } }));
  const canArrayEdit = !readOnly && Boolean(arrayGeometryType) && activeCoords.length > 0 && !editing;
  const canReverse = !readOnly && (activeMode === 'polyline' || activeMode === 'polygon') && activeCoords.length > 1 && !editing && !arrayEditorOpen;
  return <div className="space-y-2">
    <div className="flex flex-wrap items-center gap-2" aria-label="控制点工具">
      <span className="text-xs">控制点工具</span>
      <DirectPointEditor ref={editor} mapReady={props.mapReady} leafletMapRef={props.leafletMapRef} projectionRef={props.projectionRef}
        points={activeCoords} polygon={activeMode === 'polygon'} color={activeColor} readOnly={readOnly}
        contextKey={props.contextKey ?? activeMode} disabled={readOnly || arrayEditorOpen || !['polyline','polygon'].includes(activeMode) || !activeCoords.length}
        validate={validateCandidateCoords} apply={onApplyActiveCoords} filter={props.filterWorldPointByAssistLine} onSession={onEditSession} />
      {props.additionalControls}
      <AppButton type="button" className="border rounded px-2 py-1 text-xs" disabled={!canReverse} onClick={() => {
        if (!canReverse || readOnlyRef.current) return;
        const next = logicalPoints(activeCoords, activeMode === 'polygon').slice().reverse();
        const error = validateCandidateCoords?.(next); if (error) { setStatusText(error); return; } onApplyActiveCoords?.(next);
      }}>反转</AppButton>
      <AppButton type="button" className="border rounded px-2 py-1 text-xs" disabled={!canArrayEdit || arrayEditorOpen} onClick={openArrayEditor}>数组</AppButton>
      <AppButton type="button" className="border rounded px-2 py-1 text-xs" disabled={readOnly || editing || arrayEditorOpen} onClick={props.onOpenCompleteArray}>完整数组</AppButton>
    </div>
      {arrayEditorOpen && (
        <DraggablePanel id="cpT-array-editor-panel" constrainToMap constrainExpandedToViewport defaultPosition={{ x: 392, y: 320 }} zIndex={1860}>
          <AppCard className="cm-control-point-panel w-[420px] overflow-hidden border">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800">数组编辑</h3>
                {arrayValidated && <span className="text-[11px] px-2 py-0.5 rounded bg-green-100 text-green-700">已校验</span>}
              </div>
              <AppButton
                onClick={tryCloseArrayEditor}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                aria-label="关闭"
                title="关闭"
                type="button"
              >
                <X className="w-4 h-4" />
              </AppButton>
            </div>

            <div className="p-3 space-y-3">
              <AppButton
                type="button"
                className={`px-3 py-2 rounded text-sm border flex items-center justify-center gap-1 ${
                  canArrayReverse ? 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50' : 'opacity-50 cursor-not-allowed bg-white text-gray-800 border-gray-300'
                }`}
                onClick={() => {
                  if (!canArrayReverse) return;
                  doArrayReverse();
                }}
                disabled={!canArrayReverse}
                title="反转"
              >
                <ArrowLeftRight size={14} />
                反转
              </AppButton>

              <textarea
                value={arrayText}
                onChange={(e) => recordArrayTextChange(e.target.value)}
                className="cm-bounded-scroll w-full h-56 px-3 py-2 border rounded text-sm font-mono"
                placeholder="请输入严格 JSON 数组，例如：[[1,-64,2],[3,-64,4]]"
              />

              <div className="flex gap-2">
                <AppButton
                  className={`flex-1 px-2 py-2 rounded-lg text-sm bg-yellow-400 text-white flex items-center justify-center gap-2 ${
                    arrayUndoStack.length ? '' : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={doArrayUndo}
                  disabled={!arrayUndoStack.length}
                  type="button"
                >
                  <Undo2 className="w-4 h-4" />
                  撤回
                </AppButton>

                <AppButton
                  className={`flex-1 px-2 py-2 rounded-lg text-sm bg-orange-400 text-white flex items-center justify-center gap-2 ${
                    arrayRedoStack.length ? '' : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={doArrayRedo}
                  disabled={!arrayRedoStack.length}
                  type="button"
                >
                  <Redo2 className="w-4 h-4" />
                  恢复
                </AppButton>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <AppButton
                  className={`px-2 py-2 rounded-lg text-sm ${arrayValidated ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
                  onClick={validateArrayEditor}
                  disabled={arrayValidated}
                  type="button"
                >
                  校验
                </AppButton>

                <AppButton
                  className={`px-2 py-2 rounded-lg text-sm ${arrayValidated ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                  onClick={applyArrayEditorToDraft}
                  disabled={!arrayValidated}
                  type="button"
                >
                  应用
                </AppButton>

                <AppButton
                  className={`px-2 py-2 rounded-lg text-sm ${arrayValidated ? 'bg-emerald-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                  onClick={finishArrayEditor}
                  disabled={!arrayValidated}
                  type="button"
                >
                  完成
                </AppButton>
              </div>

              <div className="text-[11px] text-gray-500">
                仅支持严格 [x,y,z] JSON 数组；点/线/面的最小控制点数会在校验时检查。
              </div>
              {statusText && <div className="text-xs text-gray-700">{statusText}</div>}
            </div>
          </AppCard>
        </DraggablePanel>
      )}
  </div>;
});
