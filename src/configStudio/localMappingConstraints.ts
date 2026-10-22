import type { FieldDefinition, IconItem, RenderColorBinding, ZoomPriorityRule } from './types';
import type { PreviewPin } from './conditionWitness';
import { solveConditionWitness } from './conditionWitness';
export type LocalMappingConstraint = { path: string; pins: PreviewPin[] };
export function unreachableLocalMappingRows(rule:ZoomPriorityRule,fields:FieldDefinition[],parents:PreviewPin[]=[]):LocalMappingConstraint[] {
  return localMappingConstraints(rule).filter(row=>solveConditionWitness(rule.when?.fields?[{group:rule.when.fields}]:[],fields,[...parents,...row.pins]).status==='unsatisfiable');
}
/** Explicit local rows only. Shared dictionaries are not pruned for each consumer. */
export function localMappingConstraints(rule: ZoomPriorityRule): LocalMappingConstraint[] {
  const rows: LocalMappingConstraint[] = [];
  const colors = (color: RenderColorBinding | undefined, path: string, parents: PreviewPin[] = []) => {
    if (color?.mode === 'valueMap') color.entries.forEach((row, i) => rows.push({ path: `${path}/entries/${i}`, pins: [...parents, { field: color.field, value: row.value }] }));
  };
  const icon = (item: IconItem, path: string, parents: PreviewPin[]) => {
    colors(item.foreground, path + '/foreground', parents);
    colors(item.halo?.color,path+'/halo/color',parents);
    colors(item.plate?.fill, path + '/plate/fill', parents); colors(item.plate?.stroke, path + '/plate/stroke', parents);
  };
  const symbol = rule.style?.pointSymbol;
  if (symbol) {
    const base = symbol.kind === 'shape' ? symbol.shape : symbol.fallback;
    colors(base.stroke, 'style/pointSymbol/' + (symbol.kind === 'shape' ? 'shape' : 'fallback') + '/stroke');
    colors(base.fill, 'style/pointSymbol/' + (symbol.kind === 'shape' ? 'shape' : 'fallback') + '/fill');
    colors(base.halo?.color,'style/pointSymbol/'+(symbol.kind==='shape'?'shape':'fallback')+'/halo/color');
    if (symbol.kind === 'icon') {
      if (symbol.icon.mode === 'single') icon(symbol.icon.item, 'style/pointSymbol/icon/item', []);
      else {
        const source = symbol.icon;
        source.entries.forEach((row, i) => {
          const pins = [{ field: source.field, value: row.value }], path = `style/pointSymbol/icon/entries/${i}`;
          rows.push({ path, pins }); icon(row.item, path + '/item', pins);
        });
      }
    } else if (symbol.kind === 'externalImage' && symbol.image.mode === 'valueMap') {
      const source = symbol.image;
      source.entries.forEach((row,i)=>{const path=`style/pointSymbol/image/entries/${i}`,pins=[{field:source.field,value:row.value}];rows.push({path,pins});colors(row.presentation.halo?.color,path+'/presentation/halo/color',pins);});
    } else if(symbol.kind==='externalImage'&&symbol.image.mode!=='valueMap'){
      colors(symbol.image.presentation.halo?.color,'style/pointSymbol/image/presentation/halo/color');
    }
  } else { colors(rule.style?.stroke, 'style/stroke'); colors(rule.style?.fill, 'style/fill'); }
  colors(rule.style?.halo?.color,'style/halo/color');
  colors(rule.label?.style?.color, 'label/style/color');
  const pill = rule.label?.style?.pill;
  if (pill) for (const key of ['textColor','backgroundColor','strokeColor'] as const) colors(pill[key], 'label/style/pill/' + key);
  for (const [state, value] of Object.entries(rule.extensions?.interaction ?? {})) if (value?.enabled) colors(value.strokeColorBinding, `extensions/interaction/${state}/strokeColorBinding`);
  return rows;
}
