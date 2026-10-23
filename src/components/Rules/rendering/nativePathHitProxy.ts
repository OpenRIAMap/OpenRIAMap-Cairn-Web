import L from 'leaflet';
import type {FeatureRecord} from './renderRules';
export function createNativePathHitProxy(
  type: FeatureRecord['type'],
  lineLatLngs: L.LatLngExpression[],
  polygonLatLngs: L.LatLngExpression[],
  pane: string,
  visibleWeight: number,
  tolerance: number,
  targets?:{boundary?:boolean;interior?:boolean},
): L.Layer {
  const style: L.PathOptions = {
    pane,
    color: '#000000',
    weight: Math.max(1, visibleWeight + tolerance * 2),
    opacity: 0.001,
    fillColor: '#000000',
    fillOpacity: 0.001,
    interactive: true,
    className: 'ria-config-hit-proxy',
    ...(type==='Polygon'&&targets&&(targets.boundary!==undefined||targets.interior!==undefined)?{stroke:Boolean(targets.boundary),fill:Boolean(targets.interior)}:{}),
  };
  return type === 'Polyline'
    ? L.polyline(lineLatLngs, style)
    : L.polygon(polygonLatLngs, style);
}
