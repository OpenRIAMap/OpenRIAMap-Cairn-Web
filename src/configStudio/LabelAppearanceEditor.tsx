import { useRef } from 'react';
import type { RenderLabelVisualStyle } from './types';
import { createCustomPill } from './customPill';
import { ColorBindingEditor } from './ColorBindingEditor';
import { NumericSetting, SelectSetting, type SymbolEditorContext } from './SymbolFormControls';
import { HelpLabel } from './SettingHelp';

export function LabelAppearanceEditor({ config, path, fields, value, onChange }: SymbolEditorContext & { value: RenderLabelVisualStyle; onChange: (value: RenderLabelVisualStyle) => void }) {
  const drafts = useRef<Partial<Record<RenderLabelVisualStyle['family'], RenderLabelVisualStyle>>>({});
  const changeFamily = (family: RenderLabelVisualStyle['family']) => {
    drafts.current[value.family] = structuredClone(value);
    const prior = drafts.current[family];
    if (prior) { onChange(structuredClone(prior)); return; }
    const size = Number.isFinite(value.size) && value.size >= 6 && value.size <= 72 ? value.size : 13;
    onChange(family === 'custom_pill_1' ? { family, size, pill: createCustomPill(value.color) } : { family, size, ...(family.startsWith('rle-') ? { color: { mode: 'fixed', color: '#2563eb' } as const } : {}) });
  };
  const pill = value.pill ?? createCustomPill();
  return <div className="space-y-3"><div className="cm-flex-grid gap-2"><SelectSetting label="Label 样式" value={value.family} choices={[["gm-bw", '黑白文字'], ["gm-outline", '描边文字'], ["gm-wtb", '白字黑边'], ["structure-label", '结构文字'], ["bubble-dark", '深色气泡'], ["rle-line-color", '线路颜色文字'], ["rle-pill-color", '线路颜色胶囊'], ...(config.contractRevision >= 12 ? [["custom_pill_1", '自定义胶囊1'] as const] : [])]} onChange={changeFamily} />{value.family !== 'custom_pill_1' ? <NumericSetting label="字号 px" value={value.size} min={6} max={72} onChange={size => onChange({ ...value, size })} /> : null}</div>
  {value.family === 'custom_pill_1' ? <fieldset className="cm-subsection space-y-3"><legend className="px-1 font-medium">胶囊设置</legend><div className="cm-flex-grid gap-2"><NumericSetting label="字号 px" value={value.size} min={6} max={72} onChange={size => onChange({ ...value, size })} />{([['lineHeightRatio', '行高比例'], ['paddingYRatio', '上下内边距比例'], ['paddingXRatio', '左右内边距比例'], ['radiusRatio', '圆角比例']] as const).map(([key, label]) => <NumericSetting key={key} label={label} value={pill[key]} min={key === 'lineHeightRatio' ? 0.0001 : 0} max={10} onChange={number => onChange({ ...value, pill: { ...pill, [key]: number } })} />)}<NumericSetting label="描边宽度 px" value={pill.strokeWidth} min={0} max={72} onChange={strokeWidth => onChange({ ...value, pill: { ...pill, strokeWidth } })} /></div><p className="text-xs text-slate-500">比例以字号计算；字体沿用地图字体，字重 700。零内边距／圆角保留原值。</p>{([['textColor', '文字颜色'], ['backgroundColor', '背景颜色'], ['strokeColor', '描边颜色']] as const).map(([key, label]) => <ColorBindingEditor key={key} config={config} sourcePath={path} fields={fields.map(f => f.key)} label={label} value={pill[key]} onChange={binding => onChange({ ...value, pill: { ...pill, [key]: binding } })} />)}</fieldset> : <>{['gm-bw', 'gm-outline', 'gm-wtb', 'structure-label'].includes(value.family) ? <div className="cm-flags">{(['italic', 'underline'] as const).map(key => <HelpLabel context="LabelAppearanceEditor" className="text-xs" key={key}><input type="checkbox" checked={Boolean(value.modifiers?.[key])} onChange={e => onChange({ ...value, modifiers: { ...value.modifiers, [key]: e.target.checked } })} />{key === 'italic' ? '斜体' : key === 'underline' ? '下划线' : '粗体'}</HelpLabel>)}</div> : null}{value.family.startsWith('rle-') ? <ColorBindingEditor config={config} sourcePath={path} fields={fields.map(f => f.key)} label={value.family === 'rle-pill-color' ? '胶囊背景颜色' : '文字颜色'} value={value.color ?? { mode: 'fixed', color: '#2563eb' }} onChange={color => onChange({ ...value, color })} /> : null}</>}
  </div>;
}
