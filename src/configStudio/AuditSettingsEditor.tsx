import type {ApplicationPreferences,ApplicationReview} from '../core/project/applicationTypes';
import {AUDIT_DEFAULT_PRICES,AUDIT_PRICE_LABELS,AUDIT_ENDPOINT_KEYS,AUDIT_ENDPOINT_LABELS} from '../core/audit/auditSettings';
import {HelpLabel} from './SettingHelp';
import {ModuleHelp} from './ModuleHelp';
import {ParameterEditor,type FormValue} from './GeneralParameterEditor';

export function AuditDefaultsEditor({value,onChange}:{value:ApplicationPreferences;onChange:(next:ApplicationPreferences)=>void}){
  return <fieldset className="cm-panel mt-3" data-audit-defaults><legend>审计计算参与值默认设置 <ModuleHelp title="审计计算参与值默认设置" text="新开审计时预填，窗口中的临时报价不会回写。允许 0 和最多 6 位小数；留空保存为 0。"/></legend><div className="cm-flex-grid gap-3">{(Object.keys(AUDIT_DEFAULT_PRICES) as Array<keyof typeof AUDIT_DEFAULT_PRICES>).map(key=><HelpLabel context="AuditDefaults" key={key}>{AUDIT_PRICE_LABELS[key]}<input aria-label={'默认'+AUDIT_PRICE_LABELS[key]} inputMode="decimal" value={value.auditCalculationDefaults?.[key]??'0'} onChange={e=>onChange({...value,auditCalculationDefaults:{...AUDIT_DEFAULT_PRICES,...value.auditCalculationDefaults,[key]:e.target.value}})} onBlur={e=>{if(!e.target.value)onChange({...value,auditCalculationDefaults:{...AUDIT_DEFAULT_PRICES,...value.auditCalculationDefaults,[key]:'0'}});}}/></HelpLabel>)}</div></fieldset>;
}
export function AuditReviewSettingsEditor({value,onChange}:{value:ApplicationReview;onChange:(next:ApplicationReview)=>void}){
  const {serverReferences,...main}=value;
  const simple={...main};for(const key of AUDIT_ENDPOINT_KEYS)delete simple[key];
  return <><ParameterEditor field="review" path="review" value={simple as unknown as FormValue} onChange={next=>onChange({...value,...next as object})}/><fieldset className="cm-panel mt-3"><legend>审计与发布记录读取接口 <ModuleHelp title="读取接口" text="填写已部署、兼容现有 POST/JSON 协议的同源路径。保存配置可以切换服务路径，不会自动部署新的服务。认证和权限检查保持有效。"/></legend><div className="cm-flex-grid gap-3">{AUDIT_ENDPOINT_KEYS.map(key=><HelpLabel context="AuditEndpoints" key={key}>{AUDIT_ENDPOINT_LABELS[key]}<input aria-label={AUDIT_ENDPOINT_LABELS[key]} value={value[key]??''} placeholder="/api/review-control" onChange={e=>onChange({...value,[key]:e.target.value})}/></HelpLabel>)}</div></fieldset><ParameterEditor field="serverReferences" path="review/serverReferences" value={serverReferences} onChange={next=>onChange({...value,serverReferences:next as ApplicationReview['serverReferences']})}/></>;
}
