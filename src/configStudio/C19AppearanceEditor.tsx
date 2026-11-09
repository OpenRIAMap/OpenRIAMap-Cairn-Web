import type { ReactNode } from 'react';
import { LabelAppearanceEditor } from './LabelAppearanceEditor';
import { LabelSourceEditor } from './LabelSourceEditor';
import { HelpLabel } from './SettingHelp';
import { MappingPreviewButton, useMappingPreview, usePreviewRowKeys } from './RuntimePreviewContext';
import { MappingValue, SelectSetting, SymbolFieldSelect, type SymbolEditorContext } from './SymbolFormControls';
import { defaultSymbolBehavior, labelModifierCapabilities } from './c19Render';
import type { AppearanceMapping, GeometryKind, RenderLabelAppearance, RenderLabelStyle, RenderRuleExtensions, SymbolBehavior } from './types';

export function SymbolBehaviorEditor({ value, onChange }: { value?: SymbolBehavior; onChange:(value:SymbolBehavior)=>void }) {
  const behavior = value ?? defaultSymbolBehavior();
  return <fieldset className="cm-subsection"><legend>符号位置与可见性</legend><div className="cm-flex-grid gap-2">
    {(['x','y'] as const).map(axis=><HelpLabel context="NativeSymbolSettings" key={axis}>符号 {axis.toUpperCase()} 偏移 px<input type="number" step="any" value={behavior.offsetPx[axis]} onChange={e=>onChange({...behavior,offsetPx:{...behavior.offsetPx,[axis]:Number(e.target.value)}})}/></HelpLabel>)}
    <SelectSetting label="符号锚点" value={behavior.anchor} choices={ [['geometry','几何锚点'],['label','跟随 Label 候选']] } onChange={anchor=>onChange({...behavior,anchor})}/>
    <SelectSetting label="符号可见性" value={behavior.visibility} choices={ [['independent','独立'],['withLabel','与 Label 同显隐']] } onChange={visibility=>onChange({...behavior,visibility})}/>
  </div></fieldset>;
}

export function AppearanceRows<T>({ fields, value, onChange, create, render }: Pick<SymbolEditorContext,'fields'> & {
  value: AppearanceMapping<T>; onChange:(value:AppearanceMapping<T>)=>void; create:()=>T;
  render:(item:T,onChange:(item:T)=>void)=>ReactNode;
}) {
  const field = fields.find(item=>item.key===value.field);
  const keys = usePreviewRowKeys(value.entries);
  const preview = useMappingPreview(value.entries.map((row,index)=>({id:keys[index],pins:[{field:value.field,value:row.value}]})));
  const replace = (index:number,row:AppearanceMapping<T>['entries'][number])=>onChange({...value,entries:value.entries.map((current,i)=>i===index?row:current)});
  return <div className="space-y-2">
    <SymbolFieldSelect label="映射字段" fields={fields} value={value.field} onChange={key=>onChange({field:key,entries:[]})}/>
    {value.entries.map((row,index)=><fieldset className="cm-subsection space-y-2" key={keys[index]}>
      <legend>映射行 {index+1}</legend>
      <div className="flex flex-wrap items-end gap-2"><MappingValue field={field} value={row.value} onChange={savedValue=>replace(index,{...row,value:savedValue})}/>
        <MappingPreviewButton preview={preview} row={keys[index]} index={index}/>
        <button type="button" className="text-rose-700" onClick={()=>onChange({...value,entries:value.entries.filter((_,i)=>i!==index)})}>删除</button></div>
      {render(row.item,item=>replace(index,{...row,item}))}
    </fieldset>)}
    <button type="button" className="rounded border px-2 py-1" disabled={!field} onClick={()=>{
      const type=field?.optionValueType??field?.type;
      onChange({...value,entries:[...value.entries,{value:type==='number'?0:type==='boolean'?false:'',item:create()}]});
    }}>添加映射</button>
  </div>;
}

function LabelEffect({ context, geometry, extensions, appearance, collision, onChange }: {
  context:SymbolEditorContext; geometry:GeometryKind; extensions?:RenderRuleExtensions; appearance:RenderLabelAppearance;
  collision:RenderLabelStyle['collision']; onChange:(appearance:RenderLabelAppearance)=>void;
}) {
  const visual=appearance.style??{family:'gm-outline' as const,size:14};
  const allowed=labelModifierCapabilities(geometry,appearance,extensions);
  const patch=(values:Partial<RenderLabelAppearance>)=>onChange({...appearance,...values});
  const changeStyle=(style:typeof visual)=>{
    const support=labelModifierCapabilities(geometry,{...appearance,style},extensions);
    patch({style:{...style,modifiers:{bold:support.bold&&Boolean(style.modifiers?.bold),italic:support.italic&&Boolean(style.modifiers?.italic),underline:support.underline&&Boolean(style.modifiers?.underline)}}});
  };
  return <div className="space-y-2">
    <LabelAppearanceEditor {...context} value={visual} onChange={changeStyle} capabilities={allowed}/>
    {Object.values(allowed).includes(false)?<p className="text-xs text-slate-600">此样式或文字算法不支持的修饰已关闭。</p>:null}
    <LabelSourceEditor label={{...appearance,collision}} fields={context.fields.map(field=>field.key)} onChange={patch}/>
    <div className="cm-flex-grid gap-2">
      <HelpLabel context="C19AppearanceEditor">回退来源（逗号分隔，按顺序）<input value={appearance.fallbackSources?.join(', ')??''} onChange={e=>patch({fallbackSources:e.target.value.split(',').map(value=>value.trim()).filter(Boolean)})}/></HelpLabel>
      <SelectSetting label="主来源格式" value={appearance.valueFormat??'plain'} choices={ [['plain','原文'],['floorLabel','楼层号格式']] } onChange={valueFormat=>patch({valueFormat})}/>
      <SelectSetting label="标签位置" value={appearance.placement??(geometry==='LineString'?'aboveLine':'center')} choices={ [['center','中心'],['N','上'],['S','下'],['E','右'],['W','左'],['NE','右上'],['NW','左上'],['SE','右下'],['SW','左下'],['aboveLine','线上侧'],['belowLine','线下侧'],['near','附近']] } onChange={placement=>patch({placement})}/>
      {(['offsetX','offsetY'] as const).map(key=><HelpLabel context="C19AppearanceEditor" key={key}>{key==='offsetX'?'X':'Y'} 偏移 px<input type="number" step="any" value={appearance[key]??''} onChange={e=>patch({[key]:e.target.value===''?undefined:Number(e.target.value)})}/></HelpLabel>)}
      <SelectSetting label="候选位移方式" value={appearance.candidatePlacement??'relativeToPlacement'} choices={ [['relativeToPlacement','相对配置方向'],['aroundAnchor','围绕锚点']] } onChange={candidatePlacement=>patch({candidatePlacement})}/>
      {geometry==='Point'?<><HelpLabel context="C19AppearanceEditor"><input type="checkbox" checked={Boolean(appearance.withDot)} onChange={e=>patch({withDot:e.target.checked})}/>标签附加圆点</HelpLabel>
        {appearance.withDot?<SelectSetting label="圆点布局" value={appearance.dotAnchorMode??'inline'} choices={ [['inline','标签内部'],['anchorRight','锚点旁']] } onChange={dotAnchorMode=>patch({dotAnchorMode})}/>:null}</>:null}
    </div>
  </div>;
}

export function C19LabelEditor({ context, geometry, extensions, label, onChange }: {
  context:SymbolEditorContext; geometry:GeometryKind; extensions?:RenderRuleExtensions; label:RenderLabelStyle; onChange:(label:RenderLabelStyle)=>void;
}) {
  const { collision, mapping, mode, ...fallback } = label;
  const effect=(appearance:RenderLabelAppearance,change:(appearance:RenderLabelAppearance)=>void)=>
    <LabelEffect context={context} geometry={geometry} extensions={extensions} appearance={appearance} collision={collision} onChange={change}/>;
  return <section className="cm-subsection space-y-3"><h5 className="font-medium">Label 效果</h5>
    <HelpLabel context="C19AppearanceEditor"><input type="checkbox" checked={label.visible} onChange={e=>onChange({...label,visible:e.target.checked})}/>显示 Label</HelpLabel>
    {label.visible?<><SelectSetting label="Label 设置" value={mode??'fixed'} choices={ [['fixed','固定'],['valueMap','字段分类映射']] } onChange={mode=>onChange({...label,mode,mapping:mode==='valueMap'?{field:'',entries:[]}:undefined})}/>
      {mapping?<AppearanceRows fields={context.fields} value={mapping} onChange={value=>onChange({...label,mapping:value})}
        create={()=>structuredClone(fallback)} render={(item,change)=><><HelpLabel context="C19AppearanceEditor"><input type="checkbox" checked={item.visible} onChange={e=>change({...item,visible:e.target.checked})}/>显示此映射 Label</HelpLabel>{item.visible?effect(item,change):null}</>}/>:null}
      {mapping?<h6 className="font-medium">全局默认 Label 回退</h6>:null}
      {effect(fallback,appearance=>onChange({...appearance,collision,mode:mode??'fixed',mapping}))}
    </>:null}
  </section>;
}
