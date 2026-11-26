import {useEffect,useRef,useState} from 'react';
import type {ConfigPackageV3} from '@/configStudio/types';
import {readLatestVerifiedFormalConfiguration} from '@/configRuntime/formalConfiguration';
import {AUDIT_DEFAULT_PRICES} from './auditSettings';
import {priceMicros} from './contributionContract.mjs';

export type AuditPrices=typeof AUDIT_DEFAULT_PRICES;
const keys=Object.keys(AUDIT_DEFAULT_PRICES) as Array<keyof AuditPrices>;
export function auditPricesFromConfiguration(config?:ConfigPackageV3):AuditPrices{
  const prices={...AUDIT_DEFAULT_PRICES,...config?.application?.preferences.auditCalculationDefaults};
  for(const value of Object.values(prices))priceMicros(value);
  return prices;
}
/** One opening owns its defaults; neither focus nor a new map render reprices it. */
export function useAuditPriceDefaults(configuration?:ConfigPackageV3,formal=true){
  const [source]=useState(()=>({configuration,formal}));
  const [prices,setPrices]=useState<AuditPrices>(()=>Object.fromEntries(keys.map(key=>[key,''])) as AuditPrices);
  const [pending,setPending]=useState(true),[notice,setNotice]=useState('正在读取默认值…');
  const edited=useRef(new Set<keyof AuditPrices>());
  useEffect(()=>{
    let disposed=false;const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(Error('默认值读取超时')),15000);
    const apply=(value:AuditPrices,text:string)=>{if(disposed)return;setPrices(old=>({...old,...Object.fromEntries(keys.filter(key=>!edited.current.has(key)).map(key=>[key,value[key]]))}));setNotice(text);setPending(false);};
    const read=async()=>{
      if(!source.formal){apply(auditPricesFromConfiguration(source.configuration),`默认参与值：预览配置${source.configuration?' r'+source.configuration.revision:''}`);return;}
      const aborted=new Promise<never>((_,reject)=>controller.signal.addEventListener('abort',()=>reject(controller.signal.reason),{once:true}));
      const current=await Promise.race([readLatestVerifiedFormalConfiguration(controller.signal),aborted]);
      apply(auditPricesFromConfiguration(current.config),`默认参与值：正式配置 r${current.identity.revision}`);
    };
    void read().catch(()=>{
      try{apply(auditPricesFromConfiguration(source.configuration),`默认值暂不可读，使用${source.configuration?'当前已核验配置 r'+source.configuration.revision:'兼容默认值'}；可手动修改。`);}
      catch{apply({...AUDIT_DEFAULT_PRICES},'默认值无效，使用兼容默认值；请核对配置或手动修改。');}
    }).finally(()=>clearTimeout(timeout));
    return()=>{disposed=true;clearTimeout(timeout);controller.abort();};
  },[source]);
  const updatePrice=(key:string,value:string)=>{if(!keys.includes(key as keyof AuditPrices))return;edited.current.add(key as keyof AuditPrices);setPrices(old=>({...old,[key]:value}));};
  return {prices:prices as Record<string,string>,pending,notice,updatePrice};
}
