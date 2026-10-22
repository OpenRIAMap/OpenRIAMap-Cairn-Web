import {stableConfigText} from '../configRuntime/configurationFingerprint';
export {stableConfigText} from '../configRuntime/configurationFingerprint';
import {setRuntimeConfiguration} from '../configRuntime/runtimeDataView';
import { applyApplicationSettings, checkApplicationTransition } from '../core/project/applicationRuntime';
import manifest from './defaults/manifest.json';
import type { ConfigPackageV3 } from './types';
import type { StudioEditingSession } from './studioSession';
import { hasStudioDraft } from './studioSession';
import { readStudioEditingSession, saveStudioEditingSession } from './configLabStorage';
import { prepareConfigForActivation } from './configActivation';
import { fetchFormalDefaultConfig } from './formalDefault';
import { highestConfigLabRevision, readRawConfigLatest, saveConfigLabPackage, archiveConfigRecovery, listConfigRecoveries, readConfigRecovery, readActiveConfigChoice, saveActiveConfigChoice, type ConfigRecovery } from './configLabStorage';

const CHOICE = 'cairnmap-config-active-choice-v1';
const SAVED = 'cairnmap-config-studio-saved';
const LEGACY_DRAFT = 'cairnmap-config-studio-draft';
type ProviderState={active?:ConfigPackageV3;editingSession?:StudioEditingSession;defaultPromise?:Promise<ConfigPackageV3>;activePromise?:Promise<ConfigPackageV3>;writes:Promise<unknown>};
const slot=Symbol.for('cairnmap.config.active-provider');
const providers=globalThis as unknown as Record<symbol,ProviderState>;
const state=providers[slot]??={writes:Promise.resolve()};

async function hash(text: string): Promise<string> {return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(byte=>byte.toString(16).padStart(2,'0')).join('');}
async function fingerprint(config: ConfigPackageV3): Promise<string> {const {parity:_parity,...content}=config;return hash(stableConfigText(content));}
function choice(): {kind:'default'|'custom';fingerprint?:string} | undefined {try {return JSON.parse(localStorage.getItem(CHOICE)??'null')??undefined;}catch{return undefined;}}
function mirror(config: ConfigPackageV3) {try {const json=JSON.stringify(config);sessionStorage.setItem(SAVED,json);sessionStorage.setItem(LEGACY_DRAFT,json);}catch{/* Persistence is handled by IndexedDB, not the mirror. */}}
async function preserveSessionDrafts(candidate:ConfigPackageV3) {
  const selected=await fingerprint(candidate);
  for(const key of [SAVED,LEGACY_DRAFT]) {const raw=sessionStorage.getItem(key);if(!raw)continue;let matches=false;try{matches=await fingerprint(JSON.parse(raw))===selected;}catch{/* Preserve malformed content too. */}if(!matches)await archiveConfigRecovery(key,raw);}
}

export function loadDefaultConfig(): Promise<ConfigPackageV3> {
  if(state.defaultPromise)return state.defaultPromise;
  const task=fetchFormalDefaultConfig().catch(error=>{if(state.defaultPromise===task)state.defaultPromise=undefined;throw error;});
  return state.defaultPromise=task;
}
export function getActiveConfigSnapshot(): ConfigPackageV3 {if(!state.active)throw Error('活动配置尚未加载。');return state.active;}
export function getStudioSessionSnapshot():StudioEditingSession|undefined{return state.editingSession;}
export async function persistStudioEditingSession(session:StudioEditingSession|null):Promise<void>{await saveStudioEditingSession(session);state.editingSession=session??undefined;}

export function loadActiveConfig(): Promise<ConfigPackageV3> {
  return state.activePromise??=(async()=>{
    const selected=await readActiveConfigChoice()??choice();
    state.editingSession=await readStudioEditingSession();
    let latest:ConfigPackageV3|undefined;
    const latestRaw=await readRawConfigLatest();
    try {if(latestRaw)latest=prepareConfigForActivation(JSON.parse(latestRaw));}catch{if(latestRaw)await archiveConfigRecovery('rejected-local-latest',latestRaw);}
    const latestFingerprint=latest?await fingerprint(latest):undefined;
    const untouchedPreviousDefault=latestFingerprint!==undefined&&manifest.legacyDefaultFingerprints.includes(latestFingerprint);
    if(selected?.kind==='custom'&&latest&&(!selected.fingerprint||latestFingerprint===selected.fingerprint)) {await preserveSessionDrafts(latest);state.active=latest;setRuntimeConfiguration(state.active);applyApplicationSettings(state.active.application);mirror(state.active);return state.active;}
    // A new formal publication must not rebase a persisted, unfinished edit.
    if(hasStudioDraft(state.editingSession)) {
      const baseline=prepareConfigForActivation(state.editingSession!.baseline);
      await preserveSessionDrafts(baseline);state.defaultPromise=Promise.resolve(baseline);state.active=baseline;
      setRuntimeConfiguration(baseline);applyApplicationSettings(baseline.application);mirror(baseline);return baseline;
    }
    const seed=await loadDefaultConfig();
    if(selected?.kind!=='default') {
      if(latest&&latestFingerprint!==await fingerprint(seed))await archiveConfigRecovery(untouchedPreviousDefault?'previous-default-seed':'previous-local-latest',JSON.stringify(latest));
    }
    await preserveSessionDrafts(seed);await saveActiveConfigChoice({kind:'default'});state.active=seed;setRuntimeConfiguration(seed);applyApplicationSettings(seed.application);try{localStorage.setItem(CHOICE,JSON.stringify({kind:'default'}));}catch{/* durable pointer is in IndexedDB */}setRuntimeConfiguration(state.active);applyApplicationSettings(state.active.application);mirror(state.active);return state.active;
  })();
}

/** User save/import/selection is one serial durable operation for Studio and Lab. */
export function persistActiveConfig(value: ConfigPackageV3, increment=false, expected?:{config:ConfigPackageV3;kind:'default'|'custom'}): Promise<ConfigPackageV3> {
  const task=state.writes.catch(()=>undefined).then(async()=>{
    let candidate=value;
    if(increment&&state.active?.packageId===value.packageId&&stableConfigText(state.active)!==stableConfigText(value))candidate={...value,revision:Math.max(value.revision,state.active.revision+1)};
    let config=prepareConfigForActivation(candidate);
    if(config.application)await checkApplicationTransition(config.application);
    for(let attempt=0;;attempt++) {
      try {await saveConfigLabPackage(config,{kind:'custom',fingerprint:await fingerprint(config)},true,expected);break;}catch(error){const savingDefault=Boolean(state.defaultPromise&&await fingerprint(value)===await fingerprint(await state.defaultPromise));if((!increment&&!savingDefault)||attempt>=3||!(error instanceof Error)||!error.message.includes('ID/revision'))throw error;config=prepareConfigForActivation({...config,revision:Math.max(config.revision+1,(await highestConfigLabRevision(config.packageId))+1)});}
    }
    try{localStorage.setItem(CHOICE,JSON.stringify({kind:'custom',fingerprint:await fingerprint(config)}));}catch{/* durable pointer is in IndexedDB */}state.active=config;setRuntimeConfiguration(config);applyApplicationSettings(config.application);state.editingSession=undefined;mirror(config);return config;
  });
  state.writes=task;return task;
}
export function restoreApplicationDefault():Promise<void> {
  const task=state.writes.catch(()=>undefined).then(async()=>{
    const assertNoDraft=async()=>{if(hasStudioDraft(state.editingSession)||hasStudioDraft(await readStudioEditingSession()))throw Error('请先保存或放弃当前编辑草稿，再恢复当前正式配置。');};
    await assertNoDraft();
    const next=await fetchFormalDefaultConfig();
    if(next.application)await checkApplicationTransition(next.application);
    await assertNoDraft();
    if(state.active&&await fingerprint(state.active)!==await fingerprint(next))await archiveConfigRecovery('before-restore-default',JSON.stringify(state.active));
    await saveActiveConfigChoice({kind:'default'},true);state.editingSession=undefined;
    state.defaultPromise=Promise.resolve(next);state.activePromise=Promise.resolve(next);state.active=next;
    setRuntimeConfiguration(next);applyApplicationSettings(next.application);
    try{localStorage.setItem(CHOICE,JSON.stringify({kind:'default'}));}catch{/* durable pointer is in IndexedDB */}
    mirror(next);
  });
  state.writes=task;return task;
}
export async function restoreConfigRecovery(key:string):Promise<void> {const raw=await readConfigRecovery(key);if(!raw)throw Error('恢复副本不存在。');await persistActiveConfig(JSON.parse(raw.raw),true);}
export async function downloadConfigRecovery(key:string):Promise<void> {const entry=await readConfigRecovery(key);if(!entry)throw Error('恢复副本不存在。');const url=URL.createObjectURL(new Blob([entry.raw],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='cairnmap-recovery-'+entry.source+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export const getConfigRecoveries=():Promise<ConfigRecovery[]>=>listConfigRecoveries();

export async function readDurableActiveConfig():Promise<{config:ConfigPackageV3;kind:'default'|'custom'}> {
  const selected=await readActiveConfigChoice();if(selected?.kind!=='custom')return {config:await loadDefaultConfig(),kind:'default'};
  const raw=await readRawConfigLatest();if(!raw)throw Error('当前活动配置记录不存在。');return {config:prepareConfigForActivation(JSON.parse(raw)),kind:'custom'};
}
