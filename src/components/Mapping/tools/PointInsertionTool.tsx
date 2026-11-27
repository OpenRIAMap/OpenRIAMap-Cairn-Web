import { useEffect, useRef, type MutableRefObject } from 'react';
import * as L from 'leaflet';
import type { DynmapProjection } from '@/lib/DynmapProjection';
import { DraggablePanel } from '@/components/DraggablePanel/DraggablePanel';
import AppButton from '@/components/ui/AppButton';
import AppCard from '@/components/ui/AppCard';
import { logicalPoints, type PointSequence } from './pointSequence';
type Props = {
  sequence: PointSequence; open: boolean; picking: boolean; disabled: boolean; polygon: boolean; revision: number; contextKey: string;
  mapReady: boolean; leafletMapRef: MutableRefObject<L.Map | null>; projectionRef: MutableRefObject<DynmapProjection | null>;
  onOpen: (open: boolean) => void; onPicking: (picking: boolean) => void; onChange: () => void;
};
export default function PointInsertionTool(props: Props) {
  const latest = useRef(props); latest.current = props;
  useEffect(() => {
    const map = props.leafletMapRef.current, proj = props.projectionRef.current;
    if (!map || !proj || !props.mapReady || !props.picking || props.disabled) return;
    const pane = map.getPane('cm-insertion-points') ?? map.createPane('cm-insertion-points'); pane.style.zIndex = '680';
    const group = L.layerGroup().addTo(map);
    const cursor = map.getContainer().style.cursor; map.getContainer().style.cursor = 'crosshair';
    logicalPoints(props.sequence.points, props.polygon).forEach((point, index) => {
      L.circleMarker(proj.locationToLatLng(point.x, -64, point.z), { pane: 'cm-insertion-points', className: 'cm-insertion-point', radius: 7, color: '#fbbf24', fillColor: '#2563eb', fillOpacity: 1, weight: 2, bubblingMouseEvents: false })
        .bindTooltip(`选择控制点 #${index + 1}`)
        .on('click', e => {
          L.DomEvent.stop(e.originalEvent);
          const p = latest.current; if (!p.picking || p.disabled || p.contextKey !== props.contextKey) return;
          if (p.sequence.select(index)) { p.onPicking(false); p.onChange(); }
        }).addTo(group);
    });
    return () => { map.removeLayer(group); map.getContainer().style.cursor = cursor; };
  }, [props.mapReady, props.picking, props.disabled, props.revision, props.polygon, props.contextKey, props.leafletMapRef, props.projectionRef]);
  const stop = () => { props.sequence.stop(); props.onPicking(false); props.onChange(); };
  return <>
    <AppButton type="button" className={`border rounded px-2 py-1 text-xs ${props.sequence.active ? 'bg-blue-600 text-white' : ''}`} disabled={props.disabled && !props.sequence.active} onClick={() => {
      if (props.sequence.active) stop(); else props.onOpen(true);
    }}>{props.sequence.active ? '插入启用' : '插入'}</AppButton>
    {props.open && <DraggablePanel id="cpT-insertion-panel" constrainToMap constrainExpandedToViewport defaultPosition={{ x: 28, y: 320 }} zIndex={1860}>
      <AppCard className="cm-control-point-panel w-80 overflow-hidden border">
        <div className="flex items-center justify-between border-b p-3"><h3 className="font-bold" data-draggable-title>控制点插入</h3><AppButton aria-label="关闭" onClick={() => { props.onPicking(false); props.onOpen(false); }}>×</AppButton></div>
        <div className="p-3 space-y-3">
          <p className="text-sm" role="status">{props.picking ? '正在选择控制点；原目标保留至新选择成功' : props.sequence.active ? `插入已启用：起点 #${props.sequence.anchorIndex + 1}，当前游标 #${props.sequence.index + 1}` : '请选择插入起点'}</p>
          <div className="flex gap-2">
            <AppButton className="border rounded p-2" disabled={props.disabled || !props.sequence.points.length} onClick={() => props.onPicking(true)}>{props.sequence.active ? '重新选择插入点' : '选择插入点'}</AppButton>
            <AppButton className="border rounded p-2" onClick={stop}>清除选择</AppButton>
          </div>
          <p className="text-xs">关闭窗口保留插入；点击“插入启用”或“清除选择”才恢复末端追加。</p>
        </div>
      </AppCard>
    </DraggablePanel>}
  </>;
}
