import { isNativeConfigRevision } from './contract';
import type { ConfigPackageV3 } from './types';
import { prepareConfigForActivation } from './configActivation';
import type { StudioEditingSession } from './studioSession';

// V32 deliberately uses a separate store so a partial V3.1 adapter package
// can never silently become the active native renderer configuration.
const DB_NAME = 'cairnmap-config-lab-v32';
const STORE = 'packages';
const SUMMARIES = 'history-summaries';
const BACKFILL = 'history-summary-backfill';
const LATEST = 'latest';
const HISTORY_PREFIX = 'revision:';
const RECOVERY_PREFIX = 'recovery:';
export type ConfigRecovery = { key: string; source: string; raw: string; createdAt: string; packageId?: string; revision?: number };
export type ActiveConfigChoice = {kind:'default'|'custom';fingerprint?:string};
export type ConfigHistorySummary = {key:string;packageId:string;projectId:string;revision:number;displayName:{zh:string;en:string};savedAt:string;sha256:string;validation:'validated'|'unchecked'|'unsupported';diagnostic?:string};
export type ConfigHistoryCursor = [number,string];
export type ConfigHistoryPage = {items:ConfigHistorySummary[];next?:ConfigHistoryCursor;pendingBackfill:boolean};
const stable=(value:unknown):string=>JSON.stringify(value,(_key,item)=>item&&typeof item==='object'&&!Array.isArray(item)?Object.fromEntries(Object.entries(item).sort(([a],[b])=>a.localeCompare(b))):item);
async function historySummary(key:string,value:unknown,validated=false):Promise<ConfigHistorySummary>{
  const record=value&&typeof value==='object'?value as Partial<ConfigPackageV3>:{},text=stable(value)??'null';
  const supported=record.schemaVersion==='cairnmap.config-package.v3'&&isNativeConfigRevision(record.contractRevision);
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
  return {key,packageId:typeof record.packageId==='string'?record.packageId:key,projectId:typeof record.projectId==='string'?record.projectId:'',revision:Number.isSafeInteger(record.revision)?record.revision!:0,displayName:{zh:typeof record.displayName?.zh==='string'?record.displayName.zh:'',en:typeof record.displayName?.en==='string'?record.displayName.en:''},savedAt:validated?new Date().toISOString():'',sha256:[...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,'0')).join(''),validation:validated?'validated':supported?'unchecked':'unsupported',...(!supported?{diagnostic:'未知或损坏的历史配置；原始记录已保留，可下载诊断。'}:{})};
}

function packageKey(config: ConfigPackageV3): string {
  return `${HISTORY_PREFIX}${config.packageId}:${config.revision}`;
}

function db(): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
      if (!request.result.objectStoreNames.contains(SUMMARIES)) {
        const store=request.result.createObjectStore(SUMMARIES,{keyPath:'key'});
        store.createIndex('revision-key',['revision','key'],{unique:true});
        store.createIndex('package-revision',['packageId','revision']);
      }
    };
    request.onerror = () => reject(request.error ?? new Error('无法打开本地配置仓库。'));
    request.onsuccess = () => {request.result.onversionchange=()=>request.result.close();resolve(request.result);};
  });
}

export async function loadLatestConfigLabPackage(): Promise<ConfigPackageV3 | undefined> {
  const database = await db();
  return new Promise<ConfigPackageV3 | undefined>((resolve, reject) => {
    const request = database.transaction(STORE, 'readonly').objectStore(STORE).get(LATEST);
    request.onerror = () => reject(request.error ?? new Error('无法读取本地配置。'));
    request.onsuccess = () => {
      const value = request.result as ConfigPackageV3 | undefined;
      try { resolve(value ? prepareConfigForActivation(value) : undefined); }
      catch (error) { reject(error); }
    };
  }).finally(() => database.close());
}

let backfillTask:Promise<boolean>|undefined;
/** Upgrade at most eight old snapshots per request. No validation/compilation,
 * no deletion, and no synchronous scan of the full historical repository. */
export function backfillConfigHistory():Promise<boolean>{
  if(backfillTask)return backfillTask;
  backfillTask=(async()=>{const database=await db();try{
    const batch=await new Promise<{rows:Array<{key:string;value:unknown}>;last?:string;done:boolean}>((resolve,reject)=>{
      const transaction=database.transaction(STORE,'readonly'),store=transaction.objectStore(STORE),state=store.get(BACKFILL),rows:Array<{key:string;value:unknown}>=[];let last:string|undefined,done=false;
      state.onsuccess=()=>{if(state.result?.done){done=true;return;}last=state.result?.last;const range=IDBKeyRange.bound(last??HISTORY_PREFIX,HISTORY_PREFIX+'\uffff',Boolean(last),false),request=store.openCursor(range);
        request.onsuccess=()=>{const cursor=request.result;if(!cursor){done=true;return;}last=String(cursor.key);rows.push({key:last,value:cursor.value});if(rows.length<8)cursor.continue();};};
      transaction.oncomplete=()=>resolve({rows,last,done});transaction.onerror=()=>reject(transaction.error);
    });
    if(!batch.rows.length&&batch.done)return false;
    const summaries=await Promise.all(batch.rows.map(row=>historySummary(row.key,row.value)));
    await new Promise<void>((resolve,reject)=>{const transaction=database.transaction([STORE,SUMMARIES],'readwrite'),store=transaction.objectStore(SUMMARIES);
      for(const summary of summaries){const request=store.get(summary.key);request.onsuccess=()=>{if(!request.result)store.put(summary);};}
      const states=transaction.objectStore(STORE),request=states.get(BACKFILL);request.onsuccess=()=>{const prior=request.result;if(!prior?.done&&(!prior?.last||!batch.last||prior.last<=batch.last))states.put({last:batch.last,done:batch.done},BACKFILL);};
      transaction.oncomplete=()=>resolve();transaction.onerror=()=>reject(transaction.error);
    });return !batch.done;
  }finally{database.close();}})().finally(()=>{backfillTask=undefined;});return backfillTask;
}
/** Summary-only pagination; selecting a version is a separate operation. */
export async function listConfigLabPackageSummaries(options:{after?:ConfigHistoryCursor;limit?:number}={}):Promise<ConfigHistoryPage>{
  const pendingBackfill=await backfillConfigHistory(),database=await db(),limit=Math.min(100,Math.max(1,options.limit??25));
  try{return await new Promise<ConfigHistoryPage>((resolve,reject)=>{
    const items:ConfigHistorySummary[]=[],request=database.transaction(SUMMARIES,'readonly').objectStore(SUMMARIES).index('revision-key').openCursor(options.after?IDBKeyRange.upperBound(options.after,true):undefined,'prev');
    request.onerror=()=>reject(request.error);request.onsuccess=()=>{const cursor=request.result;if(!cursor||items.length===limit){resolve({items,...(cursor&&items.length?{next:[items[items.length-1].revision,items[items.length-1].key] as ConfigHistoryCursor}:{}),pendingBackfill});return;}items.push(cursor.value);cursor.continue();};
  });}finally{database.close();}
}
/** Compatibility name now returns first-page metadata, never complete trees. */
export async function listConfigLabPackages(onRejected?:(diagnostic:string)=>void):Promise<ConfigHistorySummary[]>{const page=await listConfigLabPackageSummaries();page.items.forEach(item=>{if(item.diagnostic)onRejected?.(item.diagnostic);});return page.items;}
export async function readConfigLabHistoryRaw(key:string):Promise<string>{
  if(!key.startsWith(HISTORY_PREFIX))throw Error('不是历史配置版本。');const database=await db();try{return await new Promise<string>((resolve,reject)=>{const request=database.transaction(STORE,'readonly').objectStore(STORE).get(key);request.onerror=()=>reject(request.error);request.onsuccess=()=>{if(request.result===undefined)reject(Error('历史版本不存在。'));else resolve(JSON.stringify(request.result));};});}finally{database.close();}
}
export async function loadConfigLabHistory(key:string):Promise<ConfigPackageV3>{return prepareConfigForActivation(JSON.parse(await readConfigLabHistoryRaw(key)));}

export async function saveConfigLabPackage(config:ConfigPackageV3,selection?:ActiveConfigChoice,clearEditing=false,expected?:{config:ConfigPackageV3;kind:'default'|'custom'}):Promise<void> {
  config=prepareConfigForActivation(config);const summary=await historySummary(packageKey(config),config,true),database=await db();
  return new Promise<void>((resolve,reject)=>{
    const transaction=database.transaction([STORE,SUMMARIES],'readwrite'),store=transaction.objectStore(STORE);
    const reads=[store.get(packageKey(config)),store.get(LATEST),store.get('active-choice')];let ready=0;
    const fail=(error:unknown)=>{transaction.abort();reject(error);};
    reads.forEach(request=>{request.onsuccess=()=>{if(++ready!==reads.length)return;
      try {
        if(expected){const kind=reads[2].result?.kind??'default';if(kind!==expected.kind||kind==='custom'&&(!reads[1].result||stable(prepareConfigForActivation(reads[1].result))!==stable(expected.config)))throw Error('活动主配置在核验后已变化，请重新核验保存。');}
        if(reads[0].result&&stable(prepareConfigForActivation(reads[0].result))!==stable(config))throw Error('此包 ID/revision 已保存不同内容。请在工作台增加 revision 后保存，历史版本不会被覆盖。');
        store.put(config,packageKey(config));transaction.objectStore(SUMMARIES).put(summary);store.put(config,LATEST);if(selection)store.put(selection,'active-choice');if(clearEditing)store.delete('studio-editing-session');
      }catch(error){fail(error);}
    };});
    transaction.oncomplete=()=>resolve();transaction.onerror=()=>reject(transaction.error??Error('无法保存本地配置。'));
  }).finally(()=>database.close());
}

export async function readActiveConfigChoice():Promise<ActiveConfigChoice|undefined> {
  const database=await db();return new Promise<ActiveConfigChoice|undefined>((resolve,reject)=>{const request=database.transaction(STORE,'readonly').objectStore(STORE).get('active-choice');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);}).finally(()=>database.close());
}
/** Read keys only: allocating a new revision must not parse every saved tree. */
export async function highestConfigLabRevision(packageId:string):Promise<number> {
  const database=await db(),prefix=HISTORY_PREFIX+packageId+':';
  return new Promise<number>((resolve,reject)=>{const request=database.transaction(STORE,'readonly').objectStore(STORE).getAllKeys();request.onerror=()=>reject(request.error);request.onsuccess=()=>resolve(request.result.reduce<number>((maximum,key)=>{const text=String(key);if(!text.startsWith(prefix))return maximum;const revision=Number(text.slice(prefix.length));return Number.isSafeInteger(revision)?Math.max(maximum,revision):maximum;},0));}).finally(()=>database.close());
}
export async function saveActiveConfigChoice(choice:ActiveConfigChoice):Promise<void> {
  const database=await db();return new Promise<void>((resolve,reject)=>{const transaction=database.transaction(STORE,'readwrite');transaction.objectStore(STORE).put(choice,'active-choice');transaction.oncomplete=()=>resolve();transaction.onerror=()=>reject(transaction.error);}).finally(()=>database.close());
}

export async function readRawConfigLatest(): Promise<string | undefined> {
  const database=await db();
  return new Promise<string|undefined>((resolve,reject)=>{const request=database.transaction(STORE,'readonly').objectStore(STORE).get(LATEST);request.onsuccess=()=>resolve(request.result===undefined?undefined:JSON.stringify(request.result));request.onerror=()=>reject(request.error);}).finally(()=>database.close());
}
/** Preserve exact old content without activating it or changing latest. */
export async function archiveConfigRecovery(source:string,raw:string):Promise<void> {
  const digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw)))].map(byte=>byte.toString(16).padStart(2,'0')).join('');
  let parsed:Partial<ConfigPackageV3>={};try {parsed=JSON.parse(raw);}catch{/* malformed drafts also remain recoverable */}
  const key=RECOVERY_PREFIX+source+':'+digest,database=await db();
  return new Promise<void>((resolve,reject)=>{const transaction=database.transaction(STORE,'readwrite'),store=transaction.objectStore(STORE),request=store.get(key);request.onsuccess=()=>{if(!request.result)store.put({key,source,raw,createdAt:new Date().toISOString(),packageId:parsed?.packageId,revision:parsed?.revision} satisfies ConfigRecovery,key);};transaction.oncomplete=()=>resolve();transaction.onerror=()=>reject(transaction.error);}).finally(()=>database.close());
}
export async function listConfigRecoveries():Promise<ConfigRecovery[]> {
  const database=await db();
  return new Promise<ConfigRecovery[]>((resolve,reject)=>{const values:ConfigRecovery[]=[];const request=database.transaction(STORE,'readonly').objectStore(STORE).openCursor();request.onerror=()=>reject(request.error);request.onsuccess=()=>{const cursor=request.result;if(!cursor){resolve(values.sort((a,b)=>b.createdAt.localeCompare(a.createdAt)));return;}if(String(cursor.key).startsWith(RECOVERY_PREFIX))values.push({...cursor.value,raw:''});cursor.continue();};}).finally(()=>database.close());
}
export async function readConfigRecovery(key:string):Promise<ConfigRecovery|undefined> {
  if(!key.startsWith(RECOVERY_PREFIX))throw Error('不是配置恢复副本。');const database=await db();
  return new Promise<ConfigRecovery|undefined>((resolve,reject)=>{const request=database.transaction(STORE,'readonly').objectStore(STORE).get(key);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);}).finally(()=>database.close());
}
export async function readStudioEditingSession():Promise<StudioEditingSession|undefined> {
  const database=await db();return new Promise<StudioEditingSession|undefined>((resolve,reject)=>{const request=database.transaction(STORE,'readonly').objectStore(STORE).get('studio-editing-session');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);}).finally(()=>database.close());
}
let sessionWrites:Promise<unknown>=Promise.resolve();
export function saveStudioEditingSession(value:StudioEditingSession|null):Promise<void> {
  const task=sessionWrites.catch(()=>undefined).then(async()=>{const database=await db();return new Promise<void>((resolve,reject)=>{const transaction=database.transaction(STORE,'readwrite'),store=transaction.objectStore(STORE);if(value)store.put(value,'studio-editing-session');else store.delete('studio-editing-session');transaction.oncomplete=()=>resolve();transaction.onerror=()=>reject(transaction.error);}).finally(()=>database.close());});sessionWrites=task;return task;
}
