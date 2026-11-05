import {ClassificationScopeEditor} from './ClassificationScopeEditor';
import type {ClassificationRange} from './classificationScope';
import type { ConfigPackageV3 } from './types';
import type { NavigationSettings, RailwaySelectors, SharedRailwayRoles } from '../core/project/navigationTypes';
import { RAILWAY_ROLES } from '../core/project/navigationDefinition';
import { SettingField } from './SettingField';
import { ModuleHelp } from './ModuleHelp';

const input='mt-1 w-full min-w-0 rounded border bg-white px-2 py-1';
const roleNames={lines:'线路',platforms:'站台',stationAreas:'站场',stations:'车站'};
function ClassificationRows({config,title,rows,onChange,shared}:{config:ConfigPackageV3;title:string;rows:ClassificationRange;onChange:(rows:ClassificationRange)=>void;shared?:ClassificationRange}){
 return <section className="cm-subsection mt-3 rounded-lg border bg-white p-3"><h4 className="font-semibold">{title}</h4>{shared?<p className="text-xs text-slate-500">导航范围需处于同角色共享范围内，保存时核验。</p>:null}<ClassificationScopeEditor config={config} label={title} value={rows} onChange={onChange}/></section>;
}
function RailwayRows({config,value,onChange,shared,navigation=false}:{config:ConfigPackageV3;value:RailwaySelectors;onChange:(value:RailwaySelectors)=>void;shared?:RailwaySelectors;navigation?:boolean}){
  return <>{RAILWAY_ROLES.map(role=><ClassificationRows key={role} config={config} title={`${roleNames[role]}${navigation?'导航参与范围':'要素指定'}`} rows={value[role]} shared={shared?.[role]} onChange={rows=>onChange({...value,[role]:rows})}/>)}</>;
}
export function SharedRailwayRolesEditor({config,value,onChange}:{config:ConfigPackageV3;value:SharedRailwayRoles;onChange:(value:SharedRailwayRoles)=>void}){
  return <section aria-label="共享铁路角色定义" className="cm-field-card mt-4 rounded-lg border-2 border-slate-300 bg-slate-50 p-3"><h3 className="font-semibold">共享铁路角色定义<ModuleHelp title="共享铁路角色定义" text="定义全站可解析的铁路角色，供搜索、信息卡及导航使用。寻路参与范围在路径规划设置中进一步筛选。关闭铁路导航不会停用此能力。"/></h3><p className="my-2 text-xs text-slate-600">修改这里会影响全部铁路关系调用方；移除导航正在使用的范围时需协调修复。</p><RailwayRows config={config} value={value.selectors} onChange={selectors=>onChange({...value,selectors})}/></section>;
}
function Numeric({title,value,onChange,zero=false}:{title:string;value:number;onChange:(value:number)=>void;zero?:boolean}){
  return <SettingField title={title} help={zero?'非负有限数，单位秒；允许零。':'必须是正有限数；速度单位为方块/秒，成本除数无单位。'}><input type="number" step="any" min={zero?0:0.000001} className={input} value={Number.isFinite(value)?value:''} onChange={e=>onChange(e.target.value.trim()?Number(e.target.value):NaN)}/></SettingField>;
}
export function NavigationSettingsEditor({config,value,onChange}:{config:ConfigPackageV3;value:NavigationSettings;onChange:(value:NavigationSettings)=>void}){
  const tableSelect=(key:'teleport'|'road')=>{
    const teleport=key==='teleport',id=teleport?value.teleport.hubTableId:value.road.travelModesTableId,kind=teleport?'teleportHub':'speed';
    return <SettingField title={teleport?'返回主城绑定表格':'出行方式绑定表格'} help="直接引用功能表，表格保存后自动同步；不复制独立行。"><select className={input} value={id} onChange={e=>onChange(teleport?{...value,teleport:{...value.teleport,hubTableId:e.target.value}}:{...value,road:{...value.road,travelModesTableId:e.target.value}})}><option value="">选择表格</option>{(config.lookupTables??[]).filter(t=>t.functionKind===kind).map(t=><option key={t.id} value={t.id}>{t.label.zh||t.label.en}（{t.id}）</option>)}{id&&!config.lookupTables?.some(t=>t.id===id&&t.functionKind===kind)?<option value={id}>无效绑定：{id}</option>:null}</select></SettingField>;
  };
  return <div data-navigation-settings-editor className="space-y-4">{(['rail','teleport','road'] as const).map(key=><section key={key} className="cm-field-card rounded-lg border-2 border-slate-300 bg-slate-50 p-3"><header className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b pb-2"><h3 className="font-semibold">{key==='rail'?'铁路导航模块':key==='teleport'?'传送导航设计':'道路导航设计'}</h3><SettingField title="启用" help="控制该导航入口及计算；关闭后清除对应导航结果，不关闭共享铁路关系。"><input type="checkbox" checked={value[key].enabled} onChange={e=>onChange({...value,[key]:{...value[key],enabled:e.target.checked}})}/></SettingField></header><div className="cm-flex-grid gap-3">{(['zh','en'] as const).map(language=><SettingField key={language} title={`显示名称 ${language}`} help="仅修改界面名称；稳定模块 ID 不改变，至少填写一种语言。"><input className={input} value={value[key].name[language]} onChange={e=>onChange({...value,[key]:{...value[key],name:{...value[key].name,[language]:e.target.value}}})}/></SettingField>)}{key!=='rail'?tableSelect(key):null}</div>
    {key==='rail'?<><div className="cm-flex-grid mt-3 gap-3">{(['transferWalkSpeed','railRideSpeed','transferCostFactor','normalPlatformTransferCost'] as const).map((p,i)=><Numeric key={p} title={['站内步行速度（方块/秒）','铁路乘坐速度（方块/秒）','换乘距离成本除数','普通同台换乘成本（秒）'][i]} value={value.rail.parameters[p]} zero={p==='normalPlatformTransferCost'} onChange={n=>onChange({...value,rail:{...value.rail,parameters:{...value.rail.parameters,[p]:n}}})}/>)}</div><RailwayRows config={config} navigation value={value.rail.selectors} shared={config.application?.preferences.railwayRoles?.selectors} onChange={selectors=>onChange({...value,rail:{...value.rail,selectors}})}/></>:key==='teleport'?<>{(['teleportPoints','warpPoints'] as const).map(role=><ClassificationRows key={role} config={config} title={role==='teleportPoints'?'传送点要素指定':'Warp 点要素指定'} rows={value.teleport.selectors[role]} onChange={rows=>onChange({...value,teleport:{...value.teleport,selectors:{...value.teleport.selectors,[role]:rows}}})}/>)}</>:<ClassificationRows config={config} title="道路要素指定" rows={value.road.selectors.roads} onChange={roads=>onChange({...value,road:{...value.road,selectors:{roads}}})}/>}</section>)}
    <section className="cm-field-card rounded-lg border-2 border-slate-300 bg-slate-50 p-3"><h3 className="font-semibold">通用设置<ModuleHelp title="通用速度" text="用于独立步行和外围接驳；铁路站内速度与道路出行方式速度另行设置。"/></h3><div className="cm-flex-grid mt-3 gap-3">{(['elytraSpeed','walkSpeed'] as const).map(p=><Numeric key={p} title={p==='elytraSpeed'?'鞘翅速度（方块/秒）':'步行速度（方块/秒）'} value={value.common[p]} onChange={n=>onChange({...value,common:{...value.common,[p]:n}})}/>)}</div></section>
  </div>;
}
