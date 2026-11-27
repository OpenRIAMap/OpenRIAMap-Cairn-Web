import { forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState, type MutableRefObject } from 'react';
import * as L from 'leaflet';
import type { DynmapProjection } from '@/lib/DynmapProjection';
import { DraggablePanel } from '@/components/DraggablePanel/DraggablePanel';
import { WorkspaceSidebarContext } from '@/components/DraggablePanel/WorkspaceSidebarContext';
import AppButton from '@/components/ui/AppButton';
import AppCard from '@/components/ui/AppCard';
import { snapWorldPointByMode } from './GridSnapModeSwitch';
import { newShape, rotatePoint, sampleShape, shapeInputError, shapeVertices, worldShapePoints, type ShapeKind, type ShapeModel } from './shapeInputGeometry';
import type { InputPoint } from './pointSequence';
export type ShapeInputHandle = { requestCloseAndClear: () => void; isOpen: () => boolean };
type Props = {
  enabled: boolean; mapReady: boolean; leafletMapRef: MutableRefObject<L.Map | null>; projectionRef: MutableRefObject<DynmapProjection | null>;
  polygon: boolean; defaultY?: number; getInputToken: () => string;
  onOpenChange: (open: boolean) => void;
  filterWorldPoint?: (point: InputPoint) => InputPoint;
  candidate: (points: InputPoint[]) => InputPoint[];
  validate: (points: InputPoint[], token: string) => string | undefined;
  commit: (points: InputPoint[], token: string) => boolean;
};
const names: Record<ShapeKind, string> = { circle: '圆', ellipse: '椭圆', square: '正方形', rectangle: '矩形', polygon: '正多边形' };
export default forwardRef<ShapeInputHandle, Props>(function ShapeInputT(props, ref) {
  const sidebar = useContext(WorkspaceSidebarContext);
  const latest = useRef(props); latest.current = props;
  const [open, setOpen] = useState(false); const openRef = useRef(false);
  const [model, setModel] = useState(() => newShape('circle', { x: 0, z: 0, y: -64 })); const modelRef = useRef(model); modelRef.current = model;
  const [count, setCount] = useState(32), [placing, setPlacing] = useState(false), [message, setMessage] = useState('');
  const placingRef = useRef(false), token = useRef(''), start = useRef<InputPoint>({ x: 0, z: 0 });
  const group = useRef<L.LayerGroup | null>(null), outline = useRef<L.Polygon | null>(null), candidatePath = useRef<L.Polyline | null>(null), samples = useRef<L.LayerGroup | null>(null);
  const handles = useRef(new Map<string, L.Marker>());
  const drag = useRef<{ key: string; base: ShapeModel; mapDragging: boolean } | null>(null);
  const modelFrame = useRef<number | null>(null);
  const clearBodyDrag = useRef<(() => void) | null>(null);
  const inputPending = useRef(false), suppressUntil = useRef(0);
  const update = (next: ShapeModel) => {
    modelRef.current = next;
    if (!drag.current) setModel(next);
    else if (modelFrame.current === null) modelFrame.current = requestAnimationFrame(() => { modelFrame.current = null; setModel(modelRef.current); });
  };
  const endDrag = () => {
    if (drag.current?.mapDragging) latest.current.leafletMapRef.current?.dragging.enable();
    if (modelFrame.current !== null) { cancelAnimationFrame(modelFrame.current); modelFrame.current = null; setModel(modelRef.current); }
    drag.current = null; clearBodyDrag.current?.(); clearBodyDrag.current = null; suppressUntil.current = performance.now() + 220;
  };
  const close = () => {
    endDrag(); openRef.current = false; placingRef.current = false; setPlacing(false); setOpen(false); latest.current.onOpenChange(false);
    group.current?.clearLayers(); outline.current = null; candidatePath.current = null; samples.current = null; handles.current.clear();
  };
  useImperativeHandle(ref, () => ({ requestCloseAndClear: close, isOpen: () => openRef.current }));
  const output = useMemo(() => {
    try { return { points: sampleShape(model, count, !props.polygon), error: '' }; }
    catch (e) { return { points: [] as InputPoint[], error: e instanceof Error ? e.message : String(e) }; }
  }, [model, count, props.polygon]);
  const candidateError = open && !output.error ? props.validate(output.points, token.current) : '';
  useEffect(() => {
    const map = props.leafletMapRef.current; if (!props.mapReady || !map) return;
    const pane = map.getPane('cm-shape-input') ?? map.createPane('cm-shape-input'); pane.style.zIndex = '675';
    group.current = L.layerGroup().addTo(map);
    const click = (e: L.LeafletMouseEvent) => {
      if (!openRef.current || !placingRef.current || performance.now() < suppressUntil.current) return;
      const proj = latest.current.projectionRef.current; if (!proj) return;
      const world = proj.latLngToLocation(e.latlng, -64), point = { x: world.x, z: world.z };
      const filtered = latest.current.filterWorldPoint?.(point) ?? point;
      const center = { ...snapWorldPointByMode(filtered), y: modelRef.current.center.y };
      start.current = center; update({ ...modelRef.current, center }); placingRef.current = false; setPlacing(false); setMessage('拖动中心移动；拖动外侧手柄旋转和调整形状');
    };
    const blur = () => endDrag(); map.on('click', click); window.addEventListener('blur', blur);
    return () => { endDrag(); map.off('click', click); window.removeEventListener('blur', blur); group.current?.remove(); group.current = null; latest.current.onOpenChange(false); };
  }, [props.mapReady, props.leafletMapRef]);

  useEffect(() => {
    const map = props.leafletMapRef.current, proj = props.projectionRef.current, g = group.current;
    if (!open || !map || !proj || !g || shapeInputError(model, count)) return;
    const ll = (p: InputPoint) => proj.locationToLatLng(p.x, -64, p.z);
    if (!outline.current) {
      outline.current = L.polygon([], { pane: 'cm-shape-input', color: '#14b8a6', fillOpacity: 0.14, bubblingMouseEvents: false }).addTo(g);
      outline.current.on('mousedown', event => {
        if (!openRef.current || placingRef.current || drag.current) return;
        L.DomEvent.stop(event.originalEvent);
        const base = structuredClone(modelRef.current), origin = proj.latLngToLocation(event.latlng, -64);
        drag.current = { key: 'body', base, mapDragging: map.dragging.enabled() }; map.dragging.disable();
        const move = (e: MouseEvent) => {
          if (!drag.current || drag.current.key !== 'body') return;
          const current = proj.latLngToLocation(map.mouseEventToLatLng(e), -64);
          update({ ...base, center: { ...snapWorldPointByMode({ x: base.center.x + current.x - origin.x, z: base.center.z + current.z - origin.z }), y: base.center.y } });
        };
        const up = () => endDrag();
        document.addEventListener('mousemove', move); document.addEventListener('mouseup', up);
        clearBodyDrag.current = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
      });
    }
    if (!candidatePath.current) candidatePath.current = L.polyline([], { pane: 'cm-shape-input', color: '#a78bfa', dashArray: '5 5', weight: 2, interactive: false }).addTo(g);
    if (!samples.current) samples.current = L.layerGroup().addTo(g);
    const raw = worldShapePoints(model);
    outline.current.setLatLngs(raw.map(ll)); outline.current.setStyle({ color: output.error || candidateError ? '#fb7185' : '#14b8a6' });
    const candidate = output.points.length ? latest.current.candidate(output.points) : [];
    candidatePath.current.setLatLngs((props.polygon && candidate.length ? [...candidate, candidate[0]] : candidate).map(ll));
    samples.current.clearLayers(); output.points.forEach(p => L.circleMarker(ll(p), { pane: 'cm-shape-input', radius: 2.5, color: '#fbbf24', weight: 1, interactive: false }).addTo(samples.current!));
    const local = shapeVertices(model), extentX = Math.max(...local.map(p => Math.abs(p.x))), extentZ = Math.max(...local.map(p => Math.abs(p.z)));
    const centerPixel = map.latLngToContainerPoint(ll(model.center));
    const handleGapWorld = Math.abs(proj.latLngToLocation(map.containerPointToLatLng(centerPixel.add(L.point(30, 0))), -64).x - model.center.x) || 2;
    const desired = new Map<string, InputPoint>();
    desired.set('center', { x: 0, z: 0 }); desired.set('rotate', { x: 0, z: -extentZ - handleGapWorld });
    if (model.kind === 'circle' || model.kind === 'ellipse') {
      desired.set('axis-x', { x: extentX, z: 0 }); desired.set('axis-z', { x: 0, z: extentZ });
    } else {
      [[1, 1], [-1, 1], [-1, -1], [1, -1]].forEach(([x, z], i) => desired.set(`size-${i}`, { x: extentX * x, z: extentZ * z }));
      if (model.kind === 'rectangle') { desired.set('edge-x', { x: extentX, z: 0 }); desired.set('edge-z', { x: 0, z: extentZ }); }
      if (model.kind === 'polygon') local.forEach((p, i) => desired.set(`vertex-${i}`, p));
    }
    for (const [key, marker] of handles.current) if (!desired.has(key)) { g.removeLayer(marker); handles.current.delete(key); }
    for (const [key, localPoint] of desired) {
      const world = worldShapePoints(model, [localPoint])[0];
      let marker = handles.current.get(key);
      if (!marker) {
        marker = L.marker(ll(world), { pane: 'cm-shape-input', draggable: true, bubblingMouseEvents: false, icon: L.divIcon({ className: `cm-shape-handle cm-shape-${key.split('-')[0]}`, html: '<span></span>', iconSize: [16, 16], iconAnchor: [8, 8] }) }).addTo(g);
        const owned = marker;
        marker.bindTooltip(key === 'center' ? '拖动移动图形' : key === 'rotate' ? '拖动旋转' : key.startsWith('vertex') ? '拖动调整顶点' : '拖动调整尺寸');
        marker.on('click', e => L.DomEvent.stop(e.originalEvent));
        marker.on('dragstart', () => { drag.current = { key, base: structuredClone(modelRef.current), mapDragging: map.dragging.enabled() }; map.dragging.disable(); });
        marker.on('drag', () => {
          const current = drag.current; if (!current || !openRef.current || current.key !== key) return;
          const loc = proj.latLngToLocation(owned.getLatLng(), -64), base = current.base;
          const position = { x: loc.x, z: loc.z };
          if (key === 'center') { update({ ...base, center: { ...snapWorldPointByMode(position), y: base.center.y } }); return; }
          if (key === 'rotate') { update({ ...base, angle: Math.atan2(position.z - base.center.z, position.x - base.center.x) * 180 / Math.PI + 90 }); return; }
          const relative = rotatePoint({ x: position.x - base.center.x, z: position.z - base.center.z }, -base.angle);
          const x = Math.max(.1, Math.abs(relative.x)), z = Math.max(.1, Math.abs(relative.z));
          if (key.startsWith('vertex-')) {
            const vertices = shapeVertices(base).map(p => ({ ...p })); vertices[Number(key.slice(7))] = relative; update({ ...base, vertices });
          } else if (base.kind === 'circle') update({ ...base, radius: Math.max(.1, Math.hypot(relative.x, relative.z)) });
          else if (base.kind === 'ellipse') update({ ...base, rx: key === 'axis-x' ? x : base.rx, rz: key === 'axis-z' ? z : base.rz });
          else if (base.kind === 'square') update({ ...base, radius: Math.max(x, z) });
          else if (base.kind === 'rectangle') update({ ...base, width: key === 'edge-z' ? base.width : 2 * x, height: key === 'edge-x' ? base.height : 2 * z });
          else {
            const vertices = shapeVertices(base), bx = Math.max(...vertices.map(p => Math.abs(p.x))), bz = Math.max(...vertices.map(p => Math.abs(p.z)));
            update({ ...base, vertices: vertices.map(p => ({ x: p.x * x / bx, z: p.z * z / bz })) });
          }
        });
        marker.on('dragend', endDrag); handles.current.set(key, marker);
      }
      if (drag.current?.key !== key) marker.setLatLng(ll(world));
    }
  }, [open, model, count, output, candidateError, props.polygon, props.projectionRef, props.leafletMapRef]);

  const numberInput = (label: string, value: number, set: (value: number) => void, min?: number) => <label className="block text-xs">{label}<input aria-label={label} className="w-full border rounded p-1.5 mt-1" type="number" value={Number.isFinite(value) ? value : ''} min={min} step="any" onChange={e => set(e.target.value === '' ? NaN : Number(e.target.value))} /></label>;
  const setParam = (key: 'radius' | 'rx' | 'rz' | 'width' | 'height' | 'angle', value: number) => {
    const next = { ...modelRef.current, [key]: value };
    if (key === 'radius' && next.vertices && Number.isFinite(value)) next.vertices = next.vertices.map(p => ({ ...p, x: p.x * value / modelRef.current.radius, z: p.z * value / modelRef.current.radius }));
    update(next);
  };
  return <div className="flex-1 min-w-0">
    <AppButton className="w-full border rounded px-2 py-1 text-sm" disabled={!props.enabled && !open} onClick={() => {
      if (open) { close(); return; }
      const map = props.leafletMapRef.current, proj = props.projectionRef.current; if (!props.enabled || !map || !proj) return;
      const rect = map.getContainer().getBoundingClientRect(), right = sidebar?.mapRight ?? rect.right;
      const loc = proj.latLngToLocation(map.containerPointToLatLng(L.point(Math.max(0, Math.min(rect.width, right - rect.left)) / 2, rect.height / 2)), -64);
      const center = { x: loc.x, z: loc.z, y: props.defaultY ?? -64 };
      start.current = center; token.current = props.getInputToken(); update(newShape(model.kind, center, Number.isFinite(model.radius) && model.radius > 0 ? model.radius : 10));
      setCount(model.kind === 'polygon' ? 6 : ['circle', 'ellipse'].includes(model.kind) ? 32 : 4); setMessage('设置参数后点击放置，或直接拖动预览'); openRef.current = true; setOpen(true); props.onOpenChange(true);
    }}>图形输入</AppButton>
    {open && <DraggablePanel id="shape-input" constrainToMap constrainExpandedToViewport defaultPosition={{ x: 24, y: 130 }} zIndex={1870}>
      <AppCard className="cm-control-point-panel w-80 overflow-hidden border">
        <div className="flex items-center justify-between border-b p-3"><h3 data-draggable-title className="font-bold">图形输入</h3><AppButton aria-label="关闭" onClick={close}>×</AppButton></div>
        <div className="p-3 space-y-3">
          <label className="block text-sm">图形<select aria-label="图形类型" className="border rounded p-2 w-full" value={model.kind} onChange={e => {
            if (drag.current) return; const kind = e.target.value as ShapeKind; update(newShape(kind, { ...start.current, y: model.center.y }, model.radius, model.sides));
            setCount(['circle', 'ellipse'].includes(kind) ? 32 : kind === 'polygon' ? model.sides : 4); placingRef.current = false; setPlacing(false);
          }}>{Object.entries(names).map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>
          <div className="grid grid-cols-2 gap-2">
            {numberInput(model.kind === 'square' ? '半边长 R' : '基础半径 R', model.radius, value => setParam('radius', value), .1)}
            {model.kind === 'ellipse' && <>{numberInput('X 半轴 Rx', model.rx, value => setParam('rx', value), .1)}{numberInput('Z 半轴 Rz', model.rz, value => setParam('rz', value), .1)}</>}
            {model.kind === 'rectangle' && <>{numberInput('宽 W', model.width, value => setParam('width', value), .1)}{numberInput('高 H', model.height, value => setParam('height', value), .1)}</>}
            {model.kind === 'polygon' && numberInput('多边形边数', model.sides, value => { update({ ...model, sides: value, vertices: undefined }); if (Number.isInteger(value)) setCount(value); }, 3)}
            {numberInput('中心 X', model.center.x, value => update({ ...model, center: { ...model.center, x: value } }))}
            {numberInput('中心 Z', model.center.z, value => update({ ...model, center: { ...model.center, z: value } }))}
            {numberInput('高度 Y', model.center.y ?? -64, value => update({ ...model, center: { ...model.center, y: value } }))}
            {numberInput('旋转角度', model.angle, value => setParam('angle', value))}
          </div>
          <AppButton className="border rounded px-3 py-1" aria-pressed={placing} onClick={() => { placingRef.current = !placingRef.current; setPlacing(placingRef.current); }}>{placing ? '正在放置：点击地图选择中心' : '放置'}</AppButton>
          {model.vertices && <p className="text-xs">已调整顶点；切换图形或更改边数将重置轮廓</p>}
          {numberInput('输出控制点数量', count, setCount, 3)}
          <p className="text-xs" role="status">{output.error || candidateError || message}；{props.polygon ? `${count} 个逻辑点` : `${count} 个逻辑点／${count + 1} 条坐标`}</p>
          <AppButton className="bg-green-600 text-white w-full rounded p-2" disabled={!!output.error || !!candidateError || placing} onClick={() => {
            if (drag.current || inputPending.current || !openRef.current) return; inputPending.current = true;
            try { const error = latest.current.validate(output.points, token.current); if (error) { setMessage(error); return; } if (latest.current.commit(output.points, token.current)) close(); }
            finally { inputPending.current = false; }
          }}>输入</AppButton>
        </div>
      </AppCard>
    </DraggablePanel>}
  </div>;
});
