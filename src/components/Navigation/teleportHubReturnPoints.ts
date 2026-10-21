import { captureNavigationContext, navigationTable, type NavigationContext } from '../../core/project/navigationRuntime';
import type { Coordinate } from '@/types';

/**
 * “返回主城”备选点表（按 worldId 分组）
 *
 * 说明：
 * - 你可以在这里维护每个世界的“回城点/枢纽点”列表。
 * - 每个回城点绑定一个 hub 名称；当玩家当前位置落在该点附近的方形范围内时，
 *   视为处于该 hub 内，从而让导航起点可候选该 hub 内全部 TPP 传送点。
 */

export type HubReturnPoint = {
  id: string;
  name: string;
  hub: string;
  coord: Coordinate;
  /** 方形范围半径（默认 100：即 |dx|<=100 且 |dz|<=100） */
  range?: number;
};

export const DEFAULT_HUB_RANGE = 100;

/**
 * 你可以在此处按世界维护回城点。
 *
 * 例：
 * zth: [
 *   { id:'zth_main_1', name:'主城-中心', hub:'zth_main', coord:{x:0,z:0} },
 *   { id:'zth_main_2', name:'主城-南门', hub:'zth_main', coord:{x:120,z:-80} },
 * ]
 */
export const HUB_RETURN_POINTS: Record<string, HubReturnPoint[]> = {
  zth: [
{ id:'zth_main_1', name:'初生水殿', hub:'zthspawn', coord:{x:-644,y:35,z:-1562} },
{ id:'zth_main_2', name:'海风湾', hub:'hfw', coord:{x:8455,y:66,z:-1161} },
{ id:'zth_main_1_1', name:'图书馆', hub:'zthspawn', coord:{x:-760,y:71,z:-1556} },
{ id:'zth_main_2_1', name:'鱼子小雕', hub:'hfw', coord:{x:8601,y:97,z:-1366} },
  ],
  eden: [],
  naraku: [],
  houtu: [],
  laputa: [],
};

export function listHubReturnPoints(worldId: string, context=captureNavigationContext()): HubReturnPoint[] {
  if(!context.settings.teleport.enabled)return [];
  const canonical=(value:string)=>context.configuration?.application?.worlds.find(w=>[w.id,w.prefix,String(w.numericCode),w.label.zh,w.label.en].includes(value))?.id??value;
  if(context.native)return navigationTable(context,context.settings.teleport.hubTableId,'teleportHub').rows.flatMap(row=>{const hub=row.functionValue;if(!hub||typeof hub!=='object'||!('world' in hub)||canonical(hub.world)!==canonical(worldId))return [];return hub.returnPoints.map(p=>({id:p.id,name:p.label[context.language]||p.label.zh||p.label.en||p.id,hub:row.value,coord:{x:p.x,y:p.y,z:p.z},range:hub.range}));});
  return HUB_RETURN_POINTS[worldId] ?? [];
}

export function getHubReturnPoint(worldId: string, id: string, context?: NavigationContext): HubReturnPoint | undefined {
  if (!id) return;
  return listHubReturnPoints(worldId,context).find((p) => p.id === id);
}

export function detectHubByProximity(worldId: string, coord: Coordinate, context?: NavigationContext): { hub: string; point: HubReturnPoint } | null {
  const list = listHubReturnPoints(worldId,context);
  for (const p of list) {
    const r = Number.isFinite(p.range as any) ? (p.range as number) : DEFAULT_HUB_RANGE;
    if (Math.abs(coord.x - p.coord.x) <= r && Math.abs(coord.z - p.coord.z) <= r) {
      return { hub: p.hub, point: p };
    }
  }
  return null;
}
