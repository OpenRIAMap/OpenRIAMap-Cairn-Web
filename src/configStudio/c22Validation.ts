import type {ConfigPackageV3} from './types';
import {workflowLayoutProblems} from './workflowLayout';
import {AUDIT_DEFAULT_PRICES,AUDIT_ENDPOINT_KEYS} from '../core/audit/auditSettings';
import {priceMicros} from '../core/audit/contributionContract.mjs';
export function c22ConfigurationProblems(config:ConfigPackageV3):Array<{path:string;message:string}>{
  const result:Array<{path:string;message:string}>=[],fail=(path:string,message:string)=>result.push({path,message});
  const c22=config.contractRevision>=22;
  for(const w of config.workflows)for(const s of w.steps){
    const path=`workflows/${w.id}/steps/${s.id}`;
    if(c22&&s.kind==='form')for(const message of workflowLayoutProblems(s))fail(path+'/layout',message);
    else if(s.layout!==undefined)fail(path+'/layout','页内布局最低要求 c22 信息页。');
  }
  const app=config.application;if(!app)return result;
  const prices=app.preferences.auditCalculationDefaults;
  if(!c22){if(prices||AUDIT_ENDPOINT_KEYS.some(key=>key in app.review))fail('application','审计默认值和独立读取接口最低要求 c22。');return result;}
  for(const key of Object.keys(AUDIT_DEFAULT_PRICES)){
    const value=prices?.[key as keyof typeof AUDIT_DEFAULT_PRICES];
    try{if(typeof value!=='string'||!value.length)throw Error();priceMicros(value);}catch{fail('application/preferences/auditCalculationDefaults/'+key,'价格须为非负十进制文本，最多 12 位整数与 6 位小数。');}
  }
  if(prices&&Object.keys(prices).some(key=>!(key in AUDIT_DEFAULT_PRICES)))fail('application/preferences/auditCalculationDefaults','存在未知的参与值。');
  for(const key of AUDIT_ENDPOINT_KEYS){const value=app.review[key];if(typeof value!=='string'||(app.review.enabled&&!value)||value&&(!value.startsWith('/')||value.startsWith('//')||value.includes('..')||/[?#\\\s]/.test(value)))fail('application/review/'+key,'接口须为同源绝对路径，审核启用时不可为空。');}
  return result;
}
