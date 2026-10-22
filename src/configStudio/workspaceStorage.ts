import type { WorkspaceCheckpoint } from './workspaceTypes';
import type { ConfigPackageV3 } from './types';
import type { StudioEditingSession } from './studioSession';
import { hasStudioDraft } from './studioSession';

const DATABASE='cairnmap-config-lab-v32', STORE='workspace', CHECKPOINT='configuration', TOKEN='write-token', MIGRATED='legacy-migrated-v1';
export type StoredWorkspace={checkpoint?:WorkspaceCheckpoint;token:number};
function open():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const r=indexedDB.open(DATABASE,3);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE);};r.onerror=()=>reject(r.error);r.onsuccess=()=>{r.result.onversionchange=()=>r.result.close();resolve(r.result);};});}
const configShape=(v:unknown):v is ConfigPackageV3=>!!v&&typeof v==='object'&&(v as ConfigPackageV3).schemaVersion==='cairnmap.config-package.v3';
/** One transaction keeps the selected legacy document before removing old
 * history/backups. It never clears other site databases or storage keys. */
export async function initializeWorkspaceStorage(fallback?:{latest?:unknown;choice?:{kind?:string};session?:StudioEditingSession}):Promise<StoredWorkspace>{
  const db=await open();
  try{return await new Promise((resolve,reject)=>{
    const stores=[STORE,...['packages','history-summaries'].filter(name=>db.objectStoreNames.contains(name))];
    const t=db.transaction(stores,'readwrite'),store=t.objectStore(STORE),marker=store.get(MIGRATED);
    let checkpoint:WorkspaceCheckpoint|undefined,token=0;
    marker.onsuccess=()=>{
      if(marker.result){const a=store.get(CHECKPOINT),b=store.get(TOKEN);a.onsuccess=()=>{checkpoint=a.result;};b.onsuccess=()=>{token=b.result??0;};return;}
      if(!stores.includes('packages')){try{
        const editing=fallback?.session;
        const config=hasStudioDraft(editing)&&editing?.baseline?editing.baseline:fallback?.choice?.kind==='custom'?fallback.latest:undefined;
        if(config){checkpoint={schemaVersion:'cairnmap.studio-workspace.v1',config:config as ConfigPackageV3,...(hasStudioDraft(editing)?{session:editing}:{}),generation:1,updatedAt:new Date().toISOString()};token=1;store.put(checkpoint,CHECKPOINT);store.put(token,TOKEN);}
        if(configShape(config)&&Number.isSafeInteger(config.revision))store.put(config.revision,'revision:'+config.packageId);
        store.put(true,MIGRATED);
      }catch(error){t.abort();reject(error);}return;}
      const old=t.objectStore('packages'),keys=old.getAllKeys(),session=old.get('studio-editing-session'),latest=old.get('latest'),choice=old.get('active-choice');let ready=0;
      for(const r of [keys,session,latest,choice])r.onsuccess=()=>{if(++ready!==4)return;try{
        const editing=(session.result??fallback?.session) as StudioEditingSession|undefined;
        const config=hasStudioDraft(editing)&&editing?.baseline?editing.baseline:(choice.result??fallback?.choice)?.kind==='custom'?(latest.result??fallback?.latest):undefined;
        if(config){checkpoint={schemaVersion:'cairnmap.studio-workspace.v1',config,...(hasStudioDraft(editing)?{session:editing}:{}),generation:1,updatedAt:new Date().toISOString()};token=1;store.put(checkpoint,CHECKPOINT);store.put(token,TOKEN);}
        const maxima=new Map<string,number>();
        for(const key of keys.result){const match=/^revision:(.+):(\d+)$/.exec(String(key));if(match)maxima.set(match[1],Math.max(maxima.get(match[1])??0,Number(match[2])));if(/^(recovery:|revision:)/.test(String(key))||['latest','active-choice','studio-editing-session','history-summary-backfill'].includes(String(key)))old.delete(key);}
        if(configShape(config)&&Number.isSafeInteger(config.revision))maxima.set(config.packageId,Math.max(maxima.get(config.packageId)??0,config.revision));
        for(const [id,revision]of maxima)store.put(revision,'revision:'+id);
        if(stores.includes('history-summaries'))t.objectStore('history-summaries').clear();store.put(true,MIGRATED);
        }catch(error){t.abort();reject(error);}
      };
    };
    t.oncomplete=()=>resolve({checkpoint,token});t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error??Error('工作区迁移已中断，原编辑记录保持。'));
  });}finally{db.close();}
}
export async function writeWorkspaceCheckpoint(checkpoint:WorkspaceCheckpoint|undefined,expectedToken:number):Promise<number>{
  const db=await open();try{return await new Promise((resolve,reject)=>{
    const t=db.transaction(STORE,'readwrite'),store=t.objectStore(STORE),r=store.get(TOKEN);let next=expectedToken;
    r.onsuccess=()=>{try{if((r.result??0)!==expectedToken){t.abort();reject(Error('另一窗口已更新工作区，请保留当前页面并重新选择；未覆盖其他窗口的缓存。'));return;}next=expectedToken+1;store.put(next,TOKEN);if(checkpoint)store.put(checkpoint,CHECKPOINT);else store.delete(CHECKPOINT);}catch(error){t.abort();reject(error);}};
    t.oncomplete=()=>resolve(next);t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error??Error('工作区写入冲突或已中断。'));
  });}finally{db.close();}
}
export async function configRevisionHighWater(packageId:string,reserve?:number):Promise<number>{
  const db=await open();try{return await new Promise((resolve,reject)=>{const t=db.transaction(STORE,reserve===undefined?'readonly':'readwrite'),store=t.objectStore(STORE),r=store.get('revision:'+packageId);let value=0;r.onsuccess=()=>{try{value=Math.max(r.result??0,reserve??0);if(!Number.isSafeInteger(value)||value<0)throw Error('本机修订号记录损坏，请先排查；未分配新修订号。');if(reserve!==undefined)store.put(value,'revision:'+packageId);}catch(error){t.abort();reject(error);}};t.oncomplete=()=>resolve(value);t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error??Error('修订号写入已中断。'));});}finally{db.close();}
}
