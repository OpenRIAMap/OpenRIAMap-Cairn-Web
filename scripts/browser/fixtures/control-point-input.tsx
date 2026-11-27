import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../../src/styles/index.css';
import ControlPointsT from '../../../src/components/Mapping/tools/ControlPointsT';
import PointInsertionTool from '../../../src/components/Mapping/tools/PointInsertionTool';
import ShapeInputT from '../../../src/components/Mapping/tools/ShapeInputT';
import ManualPointInput from '../../../src/components/Mapping/tools/ManualPointInput';
import CurveInputT from '../../../src/components/Mapping/tools/CurveInputT';
import { PointSequence, type InputPoint, type SequenceSnapshot } from '../../../src/components/Mapping/tools/pointSequence';
import type { DynmapProjection } from '../../../src/lib/DynmapProjection';

function Fixture() {
  const mapRef = useRef<L.Map | null>(null);
  const projection = useRef({ locationToLatLng: (x: number, _y: number, z: number) => L.latLng(-z, x), latLngToLocation: (p: L.LatLng, y: number) => ({ x: p.lng, y, z: -p.lat }) } as DynmapProjection);
  const [ready, setReady] = useState(false), [points, setPoints] = useState<InputPoint[]>(() => new URLSearchParams(location.search).has('empty') ? [] : new URLSearchParams(location.search).has('many') ? Array.from({ length: 800 }, (_,i) => ({x:130*Math.cos(i*Math.PI/400),z:130*Math.sin(i*Math.PI/400),y:-64})) : [{ x: -80, z: -50, y: -64 }, { x: 80, z: -50, y: -64 }, { x: 80, z: 50, y: -64 }, { x: -80, z: 50, y: -64 }]);
  const sequence = useRef(new PointSequence()), [revision, setRevision] = useState(0), [busy, setBusy] = useState(false), [frozen, setFrozen] = useState(false), [picking, setPicking] = useState(false), [open, setOpen] = useState(false), [context, setContext] = useState(0);
  const [visible, setVisible] = useState(false), [locked, setLocked] = useState(false);
  const history = useRef<{ undo: SequenceSnapshot[]; redo: SequenceSnapshot[] }>({ undo: [], redo: [] });
  const live = useRef({ busy, frozen, picking }); live.current = { busy, frozen, picking };
  sequence.current.sync(points);
  const token = () => JSON.stringify([context, sequence.current.ids, sequence.current.anchor, sequence.current.cursor]);
  const commit = (additions: InputPoint[], expected?: string) => {
    if (expected !== undefined && expected !== token()) return false;
    history.current.undo.push(sequence.current.snapshot()); history.current.redo = [];
    const next = sequence.current.append(additions, true); setPoints(next.slice()); setRevision(v => v + 1); return true;
  };
  const handler = useRef<(p: InputPoint) => void>(() => {}); handler.current = p => { if (!live.current.busy && !live.current.frozen && !live.current.picking) commit([p]); };
  useEffect(() => {
    const map = L.map('fixture-map', { crs: L.CRS.Simple, zoomControl: false }).setView([0, 0], 1); mapRef.current = map;
    map.on('click', e => handler.current({ x: e.latlng.lng, z: -e.latlng.lat, y: -64 })); setReady(true);
    return () => { map.remove(); };
  }, []);
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const layer = L.polygon(points.map(p => projection.current!.locationToLatLng(p.x, -64, p.z)), { color: '#2563eb', interactive: false }).addTo(mapRef.current);
    return () => { layer.remove(); };
  }, [points, ready]);
  const setCoordinates = (next: InputPoint[]) => { history.current.undo.push(sequence.current.snapshot()); history.current.redo = []; sequence.current.sync(next); setPoints(next); setRevision(v => v + 1); };
  return <><div id="fixture-map" style={{ position: 'fixed', inset: 0, background: '#d4d4d4' }} /><section style={{ position: 'fixed', top: 10, right: 10, width: 330, background: 'white', padding: 12, zIndex: 1000 }}>
    <p>真实组件／本地坐标，无远端数据或发布接口</p>
    <div className="flex gap-2"><ManualPointInput enabled={!busy && !frozen} activeMode="polygon" onSubmit={p => commit([p])} onSubmitBatch={p => commit(p)} outerClassName="flex-1" />
      <CurveInputT enabled={!busy} externallySuppressed={frozen} mapReady={ready} leafletMapRef={mapRef} projectionRef={projection} activeMode="polygon" onSetDrawClickSuppressed={setFrozen} getInputToken={token} onCommitPoints={(p,t) => commit(p,t)} outerClassName="flex-1" />
      <ShapeInputT enabled={!busy && !frozen} mapReady={ready} leafletMapRef={mapRef} projectionRef={projection} polygon getInputToken={token} onOpenChange={setFrozen} candidate={p => sequence.current.candidate(p,true).points} validate={(_p,t) => t !== token() ? '上下文已变化' : undefined} commit={commit} />
    </div>
    <ControlPointsT contextKey={String(context)} mapReady={ready} leafletMapRef={mapRef} projectionRef={projection} activeMode="polygon" activeColor="#2563eb" activeCoords={points} readOnly={sequence.current.active || frozen || picking} onApplyActiveCoords={setCoordinates} onSessionStateChange={s => setBusy(s.busy)} onSetDrawClickSuppressed={setBusy} showControlPointsEnabled={visible} showControlPointsLocked={locked} setShowControlPointsEnabled={setVisible} setShowControlPointsLocked={setLocked}
      additionalControls={<PointInsertionTool contextKey={String(context)} sequence={sequence.current} open={open} picking={picking} disabled={busy || frozen} polygon revision={revision} mapReady={ready} leafletMapRef={mapRef} projectionRef={projection} onOpen={setOpen} onPicking={setPicking} onChange={() => setRevision(v => v + 1)} />} />
    <button disabled={busy || frozen} onClick={() => { const last = history.current.undo.pop(); if (!last) return; history.current.redo.push(sequence.current.snapshot()); sequence.current.restore(last); setPoints(sequence.current.points.slice()); setRevision(v => v + 1); }}>主撤销</button>
    <button disabled={busy || frozen} onClick={() => { const last = history.current.redo.pop(); if (!last) return; history.current.undo.push(sequence.current.snapshot()); sequence.current.restore(last); setPoints(sequence.current.points.slice()); setRevision(v => v + 1); }}>主重做</button>
    <button onClick={() => { setContext(v => v + 1); sequence.current.reset(points); setOpen(false); setPicking(false); }}>切换上下文</button>
    <pre id="fixture-points" style={{ maxHeight: 140, overflow: 'auto' }}>{JSON.stringify(points)}</pre><output id="fixture-state">{JSON.stringify({ count: points.length, busy, frozen, picking, active: sequence.current.active, index: sequence.current.index })}</output>
  </section></>;
}
createRoot(document.querySelector('#root')!).render(<React.StrictMode><Fixture /></React.StrictMode>);
