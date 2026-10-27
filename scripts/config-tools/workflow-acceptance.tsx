import {getRuleDataSourceSnapshot} from '../../src/components/Rules/data/formalDataSourceRuntime';
import {c16AcceptanceConfig} from './fixtures/c16-acceptance-config';
import subjectSeed from '../../src/configStudio/defaults/r11-r7.config.json';
import {createTrpEditingWorkflow} from '../../src/configStudio/externalEditRegistry';
import {installRailEditingWorkflows} from '../../src/configStudio/railEditingTemplates';
import {migrateConfigToR9} from '../../src/configStudio/r9Migration';
import finalSeed from '../../src/configStudio/defaults/r9-r5.config.json';
import type {ConfigPackageV3} from '../../src/configStudio/types';
// Isolated production MeasuringModule acceptance, never imported by the app.
import { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MapContainer, useMap } from 'react-leaflet';
import type * as L from 'leaflet';
import '../../src/styles/index.css';
import 'leaflet/dist/leaflet.css';
import { useRuleDataStore } from '../../src/store/ruleDataStore';
import MeasuringModule, { type MeasuringModuleHandle } from '../../src/components/Mapping/core/MeasuringModule';
import { createEditableConfigPackageFromCurrentProject as createConfigPackageFromCurrentProject } from '../../src/configStudio/renderRuleTemplates';
import { compileConfigRuntime } from '../../src/configStudio/runtime';
import { DynmapProjection, createDynmapCRS, ZTH_FLAT_CONFIG } from '../../src/lib/DynmapProjection';
import { MAP_ZOOM_BOUNDS } from '../../src/lib/mapZoom';
import {preferredExternalCapturePaths} from '../../src/configStudio/externalCapturePaths';
const classificationSeed:ConfigPackageV3|undefined=location.search.includes('c16=1')?await fetch('/configuration/releases/44e87b2a96db47e7b2b8abaf1bd19f1e1c3bc54fb501bc0df6a28c18bb756d07/config.json').then(r=>r.json()).then(c16AcceptanceConfig):location.search.includes('classification=1')?await (async()=>{
  // Immutable actual UI-authored A snapshot; future active configs cannot
  // silently change this regression's classification fixture.
  const config:ConfigPackageV3=await fetch('/configuration/releases/fdf0b20f0b1a8efef813b3525b4d95232c9bf372ca8c9800aec67c143282db5b/config.json').then(r=>r.json());
  for(const workflow of config.workflows){
    if(workflow.external&&['railwayWorkflow','stationWorkflow'].includes(workflow.external.componentKey))workflow.external.coveredClassifications=preferredExternalCapturePaths(config,workflow.external.componentKey);
    const role=/^v3-editor-(rle|sta|plf|pfb|stb|sbp|stf)$/.exec(workflow.id)?.[1].toUpperCase();
    if(role){const path={class:'RIL',kind:role};workflow.editor={...workflow.editor,enabled:true,scope:path};for(const output of workflow.outputs)output.classificationGroup={selectors:[{id:output.id+'-test-path',path,mode:'self'}]};}
  }
  return config;
})():undefined;
function Ready({ onReady }: { onReady: (map: L.Map) => void }) { const map = useMap(); useEffect(() => onReady(map), [map, onReady]); return null; }
function Harness() {
  const [world, setWorld] = useState('zth');
  const [config, setConfig] = useState(()=>{if(classificationSeed)return classificationSeed;if(location.search.includes('subject=1'))return structuredClone(subjectSeed) as ConfigPackageV3;if(location.search.includes('final=1'))return structuredClone(finalSeed) as ConfigPackageV3;const config=createConfigPackageFromCurrentProject();if(!location.search.includes('edit=1'))return config;const edited=migrateConfigToR9(config);for(const workflow of edited.workflows)if(workflow.mode==='composed'&&workflow.id!=='v3-tpp_teleport')workflow.editor={enabled:true};const withRail=installRailEditingWorkflows(edited);withRail.workflows.push(createTrpEditingWorkflow());return withRail;});
  const runtimeConfig = useMemo(() => compileConfigRuntime(config), [config]);
  useEffect(()=>{if(!location.search.includes('c16=1'))return;const source=getRuleDataSourceSnapshot('zth');useRuleDataStore.setState({datasets:{zth:{worldId:'zth',remoteWorldId:source.remoteWorldId,resourceGroupId:source.resourceGroupId,sourceId:source.sourceId,transportId:source.transportId,readerSchemaVersion:source.readerSchemaVersion,sourceGeneration:source.generation,mergeVersion:'c16-local-fixture',releaseId:'c16-local-fixture',loadedAt:Date.now(),features:[{ID:'C16_LAND',Name:'C16Land',Class:'NGF',Kind:'LAD',SKind:'SBC',World:'zth'},{ID:'C16_WRONG',Name:'C16Land wrong classification',Class:'BUD',Kind:'NOM',World:'zth'},{ID:'C16_FOREIGN',Name:'C16Land foreign world',Class:'NGF',Kind:'LAD',SKind:'SBC',World:'eden'}]}}});},[]);
  const [map, setMap] = useState<L.Map | null>(null);
  const mapRef = useRef<L.Map | null>(null); mapRef.current = map;
  const projection = useMemo(() => new DynmapProjection(ZTH_FLAT_CONFIG), []);
  const projectionRef = useRef(projection);
  const measurementRef = useRef<MeasuringModuleHandle | null>(null);
  useEffect(() => { (window as any).workflowAcceptance = { map, config, setConfig, world, setWorld, setRecords: (features: unknown[]) => useRuleDataStore.setState({ datasets: { zth: { worldId: 'zth', features } as any } }), screenPointAt: (x: number, z: number) => { const p = map!.latLngToContainerPoint(projection.locationToLatLng(x,64,z)); const r = map!.getContainer().getBoundingClientRect(); return { x: p.x + r.x, y: p.y + r.y }; }, measurement: measurementRef.current }; }, [map, config, world]);
  return <main style={{ height: 900, width: 1200, margin: 20 }}><MapContainer style={{ height: '100%', width: '100%' }} center={[0, 0]} zoom={3} {...MAP_ZOOM_BOUNDS} crs={createDynmapCRS(ZTH_FLAT_CONFIG)}><Ready onReady={setMap} /></MapContainer>
    {map ? <MeasuringModule ref={measurementRef} mapReady leafletMapRef={mapRef} projectionRef={projectionRef} currentWorldId={world} configRuntime={runtimeConfig} disablePackageUpload={!location.search.includes('edit=1')} /> : null}
  </main>;
}
createRoot(document.getElementById('root')!).render(<Harness />);
