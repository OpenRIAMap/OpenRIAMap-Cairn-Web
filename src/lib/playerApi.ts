import { getApplicationSettings, moduleEnabled, worldUsesSharedInterfaces } from '@/core/project/applicationRuntime';
/**
 * 玩家数据 API
 * 支持代理链路（/api/dynmap）与直连链路（https://satellite.ria.red/map）双通道读取
 */

import type { Player } from '@/types';

interface DynmapUpdateResponse {
  currentcount: number;
  hasStorm: boolean;
  isThundering: boolean;
  servertime: number;
  confighash: number;
  players: Array<{
    world: string;
    armor: number;
    name: string;
    x: number;
    y: number;
    z: number;
    health: number;
    sort: number;
    type: string;
    account: string;
  }>;
  updates: Array<{
    type: string;
    name: string;
    timestamp: number;
  }>;
}

export type PlayerFetchMode = 'direct' | 'proxy';
export interface PlayerFetchResult {
  players: Player[];
  source: PlayerFetchMode | null;
  error: string | null;
}

function mapPlayers(data: DynmapUpdateResponse): Player[] {
  return (data.players || []).map((p) => ({
    name: p.name,
    account: p.account,
    x: p.x,
    y: p.y,
    z: p.z,
    health: p.health,
    armor: p.armor,
    world: p.world,
  }));
}

async function tryFetchPlayers(url: string, source: PlayerFetchMode): Promise<PlayerFetchResult> {
  const res = await fetch(url, {
    signal:AbortSignal.timeout(getApplicationSettings().modules.players.requestTimeoutMs),
    cache: 'no-store',
    mode: source === 'proxy' ? 'same-origin' : 'cors',
    credentials: 'omit',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`玩家接口返回 ${res.status}（${source}）`);
  }
  const data: DynmapUpdateResponse = await res.json();
  return {
    players: mapPlayers(data),
    source,
    error: null,
  };
}

export async function fetchPlayersDetailed(worldId: string): Promise<PlayerFetchResult> {
  if(!moduleEnabled('players'))return {players:[],source:null,error:null};
  if(!worldUsesSharedInterfaces(worldId))return {players:[],source:null,error:'此来源组尚未绑定玩家服务。'};
  const settings=getApplicationSettings().modules.players, timestamp=Date.now();
  const build=(template:string)=>template.replace('{world}',encodeURIComponent(worldId)).replace('{timestamp}',String(timestamp));
  const candidates:Array<{source:PlayerFetchMode;url:string}>=settings.mode==='proxy'?[{source:'proxy',url:build(settings.endpoint)}]:[{source:'direct',url:build(settings.directEndpoint)},{source:'proxy',url:build(settings.endpoint)}];
  let lastError: string | null = null;
  for (const candidate of candidates) {
    try {
      return await tryFetchPlayers(candidate.url, candidate.source);
    } catch (error) {
      lastError = String((error as Error)?.message ?? error ?? '玩家接口请求失败');
    }
  }

  return {
    players: [],
    source: null,
    error: lastError ?? '玩家接口不可用',
  };
}

export async function fetchPlayers(worldId: string): Promise<Player[]> {
  const result = await fetchPlayersDetailed(worldId);
  return result.players;
}
