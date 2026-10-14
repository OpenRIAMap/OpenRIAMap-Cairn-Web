import { getApplicationSettings, subscribeApplication } from '@/core/project/applicationRuntime';
const offset=()=>getApplicationSettings().preferences.map.leafletOffset;
export let MAP_ZOOM_BOUNDS={minZoom:offset(),maxZoom:offset()+8};
export let TILE_ZOOM_BOUNDS={...MAP_ZOOM_BOUNDS,minNativeZoom:-2,maxNativeZoom:3};
subscribeApplication(()=>{MAP_ZOOM_BOUNDS={minZoom:offset(),maxZoom:offset()+8};const world=getApplicationSettings().worlds.find(world=>world.enabled&&world.default)!;TILE_ZOOM_BOUNDS={...MAP_ZOOM_BOUNDS,minNativeZoom:world.tiles.minNativeZoom,maxNativeZoom:world.tiles.maxNativeZoom};});
export function toZoomLevel(zoom:number):number{return Math.max(0,Math.min(8,Math.round(zoom-offset())));}
export function toLeafletZoom(level:number):number{return Math.max(offset(),Math.min(offset()+8,Math.round(Number(level))+offset()));}
