import {HelpLabel} from './SettingHelp';
import type { ZoomPriorityRule } from './types';
export function LabelPlacementSettings({ rule, onChange, allowDecoration }: { rule: ZoomPriorityRule; onChange: (rule: ZoomPriorityRule) => void; allowDecoration: boolean }) {
  const anchor = rule.extensions?.anchor ?? {};
  return <div className="mt-2 flex flex-wrap gap-3 rounded border p-2 text-xs">
    <HelpLabel context="LabelPlacementSettings">候选位移方式<select className="ml-1 rounded border px-2 py-1" value={anchor.candidatePlacement ?? 'relativeToPlacement'} onChange={event => onChange({ ...rule, extensions: { ...rule.extensions, anchor: { ...anchor, candidatePlacement: event.target.value as typeof anchor.candidatePlacement } } })}><option value="relativeToPlacement">相对配置方向</option><option value="aroundAnchor">围绕几何锚点</option></select></HelpLabel>
    {allowDecoration && rule.label ? <><HelpLabel context="LabelPlacementSettings"><input type="checkbox" checked={Boolean(rule.label.withDot)} onChange={event => onChange({ ...rule, label: { ...rule.label!, withDot: event.target.checked } })} /> 标签附加圆点</HelpLabel><HelpLabel context="LabelPlacementSettings">圆点布局<select className="ml-1 rounded border px-2 py-1" value={rule.label.dotAnchorMode ?? 'inline'} onChange={event => onChange({ ...rule, label: { ...rule.label!, dotAnchorMode: event.target.value as 'inline' | 'anchorRight' } })}><option value="inline">标签内部</option><option value="anchorRight">锚点右侧</option></select></HelpLabel></> : null}
    {rule.label?.style ? <HelpLabel context="LabelPlacementSettings"><input type="checkbox" checked={rule.label.style.modifiers?.bold ?? false} onChange={event => onChange({ ...rule, label: { ...rule.label!, style: { ...rule.label!.style!, modifiers: { ...rule.label!.style?.modifiers, bold: event.target.checked } } } })} />粗体</HelpLabel> : null}
  </div>;
}
