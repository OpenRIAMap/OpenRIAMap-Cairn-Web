import type { HaloSettings, PointSymbol, RenderColorBinding, RenderStyle } from './types';

export const HALO_WIDTH_LIMIT = 72;
export const defaultHalo = (): HaloSettings => ({enabled:false,widthPx:2,color:{mode:'fixed',color:'#ffffff'}});
export const haloWidth = (value?: HaloSettings): number => value?.enabled && Number.isFinite(value.widthPx) ? Math.max(0,Math.min(HALO_WIDTH_LIMIT,value.widthPx)) : 0;
export function haloProblems(value: HaloSettings | undefined, required = false): string[] {
  if (!value) return required ? ['缺少 c14 Halo 设置；请使用明确迁移入口升级来源配置。'] : [];
  return [
    ...(typeof value.enabled !== 'boolean' ? ['Halo 开关必须为布尔值。'] : []),
    ...(!Number.isFinite(value.widthPx) || value.widthPx<0 || value.widthPx>HALO_WIDTH_LIMIT ? [`Halo 粗细必须是 0～${HALO_WIDTH_LIMIT}px 的有限数字。`] : []),
    ...(!value.color ? ['Halo 缺少颜色设置。'] : []),
  ];
}
export function symbolHalos(symbol?: PointSymbol): Array<{path:string;value?:HaloSettings}> {
  if (!symbol) return [];
  if (symbol.kind==='shape') return [{path:'shape/halo',value:symbol.shape.halo}];
  const rows:Array<{path:string;value?:HaloSettings}>=[{path:'fallback/halo',value:symbol.fallback.halo}];
  if(symbol.kind==='icon') {
    if(symbol.icon.mode==='single')rows.push({path:'icon/item/halo',value:symbol.icon.item.halo});
    else symbol.icon.entries.forEach((row,i)=>rows.push({path:`icon/entries/${i}/item/halo`,value:row.item.halo}));
  } else if(symbol.image.mode==='valueMap')symbol.image.entries.forEach((row,i)=>rows.push({path:`image/entries/${i}/presentation/halo`,value:row.presentation.halo}));
  else rows.push({path:'image/presentation/halo',value:symbol.image.presentation.halo});
  return rows;
}
export function haloColorBindings(style?: RenderStyle): Array<{path:string;value:RenderColorBinding}> {
  return [{path:'halo',value:style?.halo},...symbolHalos(style?.pointSymbol)].flatMap(row=>row.value?[{path:row.path+'/color',value:row.value.color}]:[]);
}
