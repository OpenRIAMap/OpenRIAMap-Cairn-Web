import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type MutableRefObject } from 'react';
import * as L from 'leaflet';
import type { DynmapProjection } from '@/lib/DynmapProjection';
import { DraggablePanel } from '@/components/DraggablePanel/DraggablePanel';
import AppButton from '@/components/ui/AppButton';
import AppCard from '@/components/ui/AppCard';
import { snapWorldPointByMode } from './GridSnapModeSwitch';
import { applyPointEdit, equalPoints, logicalPoints, undoPointEdit, type InputPoint, type PointEditHistory } from './pointSequence';

export type DirectPointEditorHandle = { close: () => boolean; busy: () => boolean };
type Props = {
  mapReady: boolean; leafletMapRef: MutableRefObject<L.Map | null>; projectionRef: MutableRefObject<DynmapProjection | null>;
  points: InputPoint[]; polygon: boolean; color: string; disabled: boolean; readOnly: boolean; contextKey: string;
  validate?: (points: InputPoint[]) => string | undefined;
  apply?: (points: InputPoint[]) => boolean | void;
  filter?: (point: InputPoint) => InputPoint;
  onSession: (busy: boolean) => void;
};

export default forwardRef<DirectPointEditorHandle, Props>(function DirectPointEditor(props, ref) {
  const latest = useRef(props); latest.current = props;
  const [open, setOpen] = useState(false); const openRef = useRef(false);
  const sessionContext = useRef('');
  const [deleting, setDeleting] = useState(false); const deletingRef = useRef(false);
  const [history, setHistory] = useState<PointEditHistory>({ points: [], undo: [], redo: [] });
  const state = useRef(history);
  const [selected, setSelected] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const layer = useRef<L.LayerGroup | null>(null);
  const preview = useRef<L.Polyline | null>(null);
  const markers = useRef<L.Marker[]>([]);
  const dragging = useRef<{ index: number; before: InputPoint[]; mapDragging: boolean; epoch: string } | null>(null);
  const previewFrame = useRef<number | null>(null);
  const pendingPreview = useRef<InputPoint[]>([]);
  const suppressUntil = useRef(0);
  const publish = (next: PointEditHistory) => { state.current = next; setHistory(next); };
  const toLatLng = (p: InputPoint) => latest.current.projectionRef.current!.locationToLatLng(p.x, -64, p.z);
  const paint = (points: InputPoint[]) => {
    const proj = latest.current.projectionRef.current; if (!proj || !preview.current) return;
    const path = latest.current.polygon && points.length ? [...points, points[0]] : points;
    preview.current.setLatLngs(path.map(toLatLng));
  };
  const finishDrag = (cancel: boolean) => {
    const drag = dragging.current; if (!drag) return;
    dragging.current = null;
    if (previewFrame.current !== null) { cancelAnimationFrame(previewFrame.current); previewFrame.current = null; }
    const map = latest.current.leafletMapRef.current;
    if (drag.mapDragging) map?.dragging.enable();
    suppressUntil.current = performance.now() + 250;
    if (cancel) {
      paint(state.current.points);
      const marker = markers.current[drag.index];
      marker?.dragging?.disable();
      if (state.current.points[drag.index] && latest.current.projectionRef.current) marker?.setLatLng(toLatLng(state.current.points[drag.index]));
      if (openRef.current && !latest.current.readOnly && !deletingRef.current) marker?.dragging?.enable();
    }
  };
  const closeNow = () => {
    finishDrag(true); openRef.current = false; setOpen(false); setSelected(null); deletingRef.current = false; setDeleting(false);
    layer.current?.clearLayers(); markers.current = []; preview.current = null; latest.current.onSession(false);
  };
  const close = () => {
    if (dragging.current) return false;
    if (openRef.current && !equalPoints(state.current.points, logicalPoints(latest.current.points, latest.current.polygon)) && !window.confirm('修改未保存，确定关闭并丢弃本次修改吗？')) return false;
    closeNow(); return true;
  };
  useImperativeHandle(ref, () => ({ close, busy: () => openRef.current }));
  const commit = (points: InputPoint[], text: string) => {
    const p = latest.current;
    if (!openRef.current || p.readOnly || p.contextKey !== sessionContext.current) return false;
    const error = p.validate?.(points); if (error) { setMessage(error); return false; }
    publish(applyPointEdit(state.current, points)); setMessage(text); paint(points); return true;
  };
  useEffect(() => {
    const map = props.leafletMapRef.current;
    if (!props.mapReady || !map) return;
    const group = L.layerGroup().addTo(map); layer.current = group;
    const pane = map.getPane('cm-direct-edit') ?? map.createPane('cm-direct-edit'); pane.style.zIndex = '680';
    return () => { finishDrag(true); map.removeLayer(group); layer.current = null; markers.current = []; latest.current.onSession(false); };
  }, [props.mapReady, props.leafletMapRef]);
  useEffect(() => { if (openRef.current) closeNow(); }, [props.contextKey]);
  useEffect(() => { if (props.readOnly) finishDrag(true); }, [props.readOnly]);

  // Marker instances survive every coordinate/selection render, including drag.
  useEffect(() => {
    const group = layer.current; if (!open || !group || !props.projectionRef.current) return;
    if (!preview.current) preview.current = L.polyline([], { color: props.color, dashArray: '6 5', weight: 3, interactive: false }).addTo(group);
    while (markers.current.length > history.points.length) group.removeLayer(markers.current.pop()!);
    for (let i = 0; i < history.points.length; i++) {
      if (!markers.current[i]) {
        const marker = L.marker(toLatLng(history.points[i]), {
          pane: 'cm-direct-edit', draggable: true, bubblingMouseEvents: false,
          icon: L.divIcon({ className: 'cm-direct-vertex', iconSize: [14, 14], iconAnchor: [7, 7], html: '<span></span>' }),
        }).addTo(group);
        marker.on('click', e => {
          L.DomEvent.stop(e.originalEvent);
          if (!openRef.current || latest.current.readOnly || performance.now() < suppressUntil.current || dragging.current) return;
          if (deletingRef.current) {
            const base = state.current.points;
            const minimum = latest.current.polygon ? 3 : 2;
            if (base.length <= minimum) { setMessage(`至少保留 ${minimum} 个控制点`); return; }
            const next = base.slice(); next.splice(i, 1);
            if (commit(next, `已删除控制点 #${i + 1}`)) setSelected(null);
          } else { setSelected(i); setMessage(`已选择 #${i + 1}；可直接拖动`); }
        });
        marker.on('dragstart', () => {
          if (latest.current.readOnly || deletingRef.current || !openRef.current) return;
          const map = latest.current.leafletMapRef.current!;
          dragging.current = { index: i, before: state.current.points.map(p => ({ ...p })), mapDragging: map.dragging.enabled(), epoch: latest.current.contextKey };
          map.dragging.disable(); setSelected(i);
        });
        const candidate = () => {
          const drag = dragging.current, p = latest.current;
          if (!drag || drag.index !== i || drag.epoch !== p.contextKey || p.readOnly || !p.projectionRef.current) return null;
          const loc = p.projectionRef.current.latLngToLocation(marker.getLatLng(), -64);
          const point = snapWorldPointByMode(p.filter ? p.filter({ x: loc.x, z: loc.z }) : { x: loc.x, z: loc.z });
          const next = drag.before.slice(); next[i] = { ...point, y: drag.before[i].y }; return next;
        };
        marker.on('drag', () => { const points = candidate(); if (!points) return; pendingPreview.current = points;
          if (previewFrame.current === null) previewFrame.current = requestAnimationFrame(() => { previewFrame.current = null; paint(pendingPreview.current); });
        });
        marker.on('dragend', () => {
          const points = candidate(); finishDrag(false);
          if (!openRef.current || !latest.current.projectionRef.current) return;
          if (!points || !commit(points, `已移动控制点 #${i + 1}`)) { marker.setLatLng(toLatLng(state.current.points[i])); paint(state.current.points); }
        });
        marker.bindTooltip('', { direction: 'top', offset: [0, -8] }); markers.current.push(marker);
      }
      const marker = markers.current[i];
      if (!dragging.current) marker.setLatLng(toLatLng(history.points[i]));
      marker.setTooltipContent(`#${i + 1}: ${history.points[i].x}, ${history.points[i].z}`);
      const element = marker.getElement(); if (element) { element.style.setProperty('--cm-vertex-color', props.color); element.classList.toggle('cm-selected-vertex', selected === i); }
      if (deleting || props.readOnly) marker.dragging?.disable(); else marker.dragging?.enable();
    }
    paint(history.points);
  }, [open, history.points, selected, deleting, props.color, props.readOnly, props.projectionRef]);

  useEffect(() => {
    const map = props.leafletMapRef.current; if (!open || !map) return;
    const click = (e: L.LeafletMouseEvent) => {
      const p = latest.current;
      if (p.readOnly || deletingRef.current || dragging.current || performance.now() < suppressUntil.current || (e.originalEvent?.detail ?? 0) > 1) return;
      const points = state.current.points; if (!p.projectionRef.current) return;
      const screen = e.containerPoint;
      const projected = points.map(point => map.latLngToContainerPoint(toLatLng(point)));
      const vertex = projected.findIndex(point => point.distanceTo(screen) <= 9);
      if (vertex >= 0) { setSelected(vertex); return; }
      let best = { distance: 8, index: -1, t: 0 };
      for (let i = 0; i < points.length - (p.polygon ? 0 : 1); i++) {
        const a = projected[i], b = projected[(i + 1) % projected.length], dx = b.x - a.x, dy = b.y - a.y;
        const t = Math.max(0, Math.min(1, ((screen.x - a.x) * dx + (screen.y - a.y) * dy) / (dx * dx + dy * dy || 1)));
        const distance = screen.distanceTo(L.point(a.x + dx * t, a.y + dy * t));
        if (distance < best.distance) best = { distance, index: i, t };
      }
      if (best.index < 0) { setSelected(null); return; }
      const a = points[best.index], b = points[(best.index + 1) % points.length], t = best.t;
      const point: InputPoint = snapWorldPointByMode({ x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t });
      if ((point.x === a.x && point.z === a.z) || (point.x === b.x && point.z === b.z)) { setSelected(point.x === a.x && point.z === a.z ? best.index : (best.index + 1) % points.length); return; }
      if (a.y !== undefined || b.y !== undefined) point.y = a.y !== undefined && b.y !== undefined ? a.y + (b.y - a.y) * t : a.y ?? b.y;
      const next = points.slice(); next.splice(best.index + 1, 0, point);
      if (commit(next, `已插入控制点 #${best.index + 2}`)) setSelected(best.index + 1);
    };
    const blur = () => finishDrag(true);
    map.on('click', click); window.addEventListener('blur', blur);
    return () => { map.off('click', click); window.removeEventListener('blur', blur); };
  }, [open, props.leafletMapRef]);

  return <>
    <AppButton type="button" className={`px-2 py-1 border rounded text-xs ${open ? 'bg-blue-600 text-white' : ''}`} disabled={props.disabled && !open} onClick={() => {
      if (open) { close(); return; }
      if (latest.current.disabled || latest.current.readOnly) return;
      sessionContext.current = props.contextKey; publish({ points: logicalPoints(props.points, props.polygon).map(p => ({ ...p })), undo: [], redo: [] });
      deletingRef.current = false; setDeleting(false); setSelected(null); openRef.current = true; setOpen(true); props.onSession(true); setMessage('拖动控制点；点击当前线段插入点');
    }}>修改</AppButton>
    {open && <DraggablePanel id="cpT-edit-panel" constrainToMap constrainExpandedToViewport defaultPosition={{ x: 24, y: 360 }} zIndex={1850}>
      <AppCard className="cm-control-point-panel w-80 overflow-hidden border">
        <div className="flex items-center justify-between border-b p-3"><h3 className="font-bold" data-draggable-title>控制点修改</h3><AppButton aria-label="关闭" onClick={close}>×</AppButton></div>
        <div className="p-3 space-y-3">
          <AppButton className={`border rounded px-3 py-2 ${deleting ? 'bg-rose-600 text-white' : ''}`} aria-pressed={deleting} disabled={props.readOnly} onClick={() => {
            if (dragging.current) return; deletingRef.current = !deletingRef.current; setDeleting(deletingRef.current); setSelected(null);
            setMessage(deletingRef.current ? '点击控制点删除；关闭删除点返回正常修改' : '拖动控制点；点击当前线段插入点');
          }}>删除点：{deleting ? '开' : '关'}</AppButton>
          <p className="text-xs">当前控制点数：{history.points.length}；{selected === null ? '未选择控制点' : `已选 #${selected + 1}`}</p>
          <p className="text-xs" role="status">{message}</p>
          <div className="flex gap-2">
            <AppButton disabled={!history.undo.length || props.readOnly} onClick={() => { if (!dragging.current) { publish(undoPointEdit(state.current)); setSelected(null); } }}>撤回</AppButton>
            <AppButton disabled={!history.redo.length || props.readOnly} onClick={() => { if (!dragging.current) { publish(undoPointEdit(state.current, true)); setSelected(null); } }}>恢复</AppButton>
            <AppButton className="bg-green-600 text-white" disabled={props.readOnly} onClick={() => {
              if (dragging.current || latest.current.contextKey !== sessionContext.current) return; const error = latest.current.validate?.(state.current.points);
              if (error) { setMessage(error); return; }
              const points = state.current.points.map(p => ({ ...p }));
              if (latest.current.polygon && logicalPoints(latest.current.points, true).length < latest.current.points.length && points.length) points.push({ ...points[0] });
              if (latest.current.apply?.(points) !== false) closeNow();
            }}>保存</AppButton>
          </div>
        </div>
      </AppCard>
    </DraggablePanel>}
  </>;
});
