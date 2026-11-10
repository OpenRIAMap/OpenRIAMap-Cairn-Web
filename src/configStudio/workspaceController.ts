import {readInputBuffers,restoreInputBuffers,subscribeInputBuffers} from './inputBufferStore';
import {appendEditCheckpoint,type EditAudit,readEditAudit} from './editAudit';
import {readFormalIdentity,type ConfigurationIdentity} from '../configRuntime/formalConfiguration';
import type {MigrationAttachment} from './migrationAttachment';
import {readMigrationReport} from './migrationAttachment';
import { stableConfigText } from '../configRuntime/configurationFingerprint';
import { setRuntimeConfiguration } from '../configRuntime/runtimeDataView';
import { applyApplicationSettings, checkApplicationTransition } from '../core/project/applicationRuntime';
import { prepareConfigForActivation } from './configActivation';
import { fetchFormalDefaultConfig } from './formalDefault';
import { hasStudioDraft, type StudioEditingSession } from './studioSession';
import { initializeWorkspaceStorage, writeWorkspaceCheckpoint, type StoredWorkspace } from './workspaceStorage';
import { currentValidation } from './workspaceValidation';
import type { ConfigPackageV3 } from './types';
import type { WorkspaceCheckpoint, WorkspaceValidation } from './workspaceTypes';
import {readTemporaryDiagnostic,type TemporaryDiagnostic} from './temporaryDiagnostic';
import { validateNativeStructure } from './nativeContractValidation';

export { stableConfigText } from '../configRuntime/configurationFingerprint';
type WorkspaceView={importedEditAudit?:WorkspaceCheckpoint['importedEditAudit'];editAudit?:EditAudit;generation:number;validation?:WorkspaceValidation;importedDiagnostic?:TemporaryDiagnostic;migration?:MigrationAttachment;modified:boolean;hasDraft:boolean;savedAt?:string;writeError:string};
type State={importedEditAudit?:WorkspaceCheckpoint['importedEditAudit'];editAudit?:EditAudit;baselineIdentity?:ConfigurationIdentity;active?:ConfigPackageV3;session?:StudioEditingSession;validation?:WorkspaceValidation;importedDiagnostic?:TemporaryDiagnostic;migration?:MigrationAttachment;generation:number;modified:boolean;signature:string;token:number;enabled:boolean;initial?:Promise<StoredWorkspace>;defaultPromise?:Promise<ConfigPackageV3>;writes:Promise<unknown>;timer?:ReturnType<typeof setTimeout>;savedAt?:string;writeError:string;view?:WorkspaceView;listeners?:Set<()=>void>};
const slot=Symbol.for('cairnmap.studio.workspace.v1'),global=globalThis as unknown as Record<symbol,State>;
const state=global[slot]??={generation:0,modified:false,signature:'',token:0,enabled:false,writes:Promise.resolve(),writeError:''};
const listeners=state.listeners??=new Set<()=>void>();
let allowUnload=false;
export const permitWorkspaceUnload=()=>{allowUnload=true;};
export const subscribeWorkspace=(listener:()=>void)=>{listeners.add(listener);return()=>{listeners.delete(listener);};};
export const getWorkspaceState=():WorkspaceView=>state.view??=( {importedEditAudit:state.importedEditAudit,editAudit:state.importedEditAudit?.audit??state.editAudit,generation:state.generation,validation:state.validation,importedDiagnostic:state.importedDiagnostic,migration:state.migration,modified:state.modified,hasDraft:hasStudioDraft(state.session),savedAt:state.savedAt,writeError:state.writeError} );
function notify(){state.view=undefined;getWorkspaceState();for(const listener of listeners)listener();}
function signature(config:ConfigPackageV3,session?:StudioEditingSession):string{return stableConfigText({config:session?.packageCandidate?.config??config,draft:session?.draft??null,tree:session?.tree?.staged??null,lookup:session?.lookupDraft??null,engine:session?.engineDraft??null,general:session?.generalDrafts??{},workflow:session?.workflowSession?.draft||session?.workflowSession?.creation||session?.workflowSession?.availability?{draft:session.workflowSession.draft,tables:session.workflowSession.tables,creation:session.workflowSession.creation,availability:session.workflowSession.availability}:null,categoryCreation:session?.categoryCreation??null,registryCreation:session?.registryCreation??null});}
function changed(){if(!state.active)return;const next=signature(state.active,state.session);if(state.signature!==next){state.signature=next;state.generation++;state.modified=true;allowUnload=false;}notify();schedule();}
function activate(config:ConfigPackageV3){state.active=config;setRuntimeConfiguration(config);applyApplicationSettings(config.application);}
function checkpoint():WorkspaceCheckpoint {if(!state.active)throw Error('编辑工作区尚未打开。');return {schemaVersion:'cairnmap.studio-workspace.v1',config:state.active,inputBuffers:readInputBuffers(),editAudit:state.editAudit,importedEditAudit:state.importedEditAudit,baselineIdentity:state.baselineIdentity,session:state.session,validation:state.validation,importedDiagnostic:state.importedDiagnostic,migration:state.migration,generation:state.generation,updatedAt:new Date().toISOString()};}
function schedule(){if(!state.enabled||!state.modified)return;if(state.timer)clearTimeout(state.timer);state.timer=setTimeout(()=>{state.timer=undefined;void flushWorkspace().catch(()=>undefined);},500);}
export async function initializeWorkspace():Promise<StoredWorkspace>{
  return state.initial??=(async()=>{
    let latest:ConfigPackageV3|undefined,draft:ConfigPackageV3|undefined,choice:{kind?:string}|undefined;
    try{latest=JSON.parse(sessionStorage.getItem('cairnmap-config-studio-saved')??'null')??undefined;draft=JSON.parse(sessionStorage.getItem('cairnmap-config-studio-draft')??'null')??undefined;choice=JSON.parse(localStorage.getItem('cairnmap-config-active-choice-v1')??'null')??undefined;}catch{/* An unreadable mirror cannot be silently activated. */}
    const session=latest&&draft&&stableConfigText(latest)!==stableConfigText(draft)?{baseline:latest,draft:null,tree:null,selectedId:'',editing:false,packageCandidate:{baseline:latest,config:draft,source:'recovery' as const}}:undefined;
    const saved=await initializeWorkspaceStorage({latest,choice,session});state.token=saved.token;
    try{localStorage.removeItem('cairnmap-config-active-choice-v1');for(const key of ['cairnmap-config-studio-saved','cairnmap-config-studio-draft','cairnmap-config-studio-recovery-issue'])sessionStorage.removeItem(key);}catch{/* Optional legacy mirrors; the durable migration already completed. */}
    return saved;
  })();
}
export function loadDefaultConfig():Promise<ConfigPackageV3>{if(state.defaultPromise)return state.defaultPromise;const task=fetchFormalDefaultConfig().catch(error=>{if(state.defaultPromise===task)state.defaultPromise=undefined;throw error;});return state.defaultPromise=task;}
export async function startDefaultWorkspace():Promise<ConfigPackageV3>{
  await initializeWorkspace();const next=await fetchFormalDefaultConfig();state.baselineIdentity=await readFormalIdentity();state.editAudit=undefined;state.importedEditAudit=undefined;if(next.application)await checkApplicationTransition(next.application);
  await clearWorkspace();restoreInputBuffers();state.session=undefined;state.validation=undefined;state.importedDiagnostic=undefined;state.migration=undefined;state.generation=0;state.modified=false;state.defaultPromise=Promise.resolve(next);activate(next);state.signature=signature(next);state.enabled=true;notify();return next;
}
export async function reopenWorkspaceAdmission():Promise<StoredWorkspace>{
  state.enabled=false;if(state.timer){clearTimeout(state.timer);state.timer=undefined;}
  await state.writes.catch(()=>undefined);state.initial=undefined;state.active=undefined;state.session=undefined;state.modified=false;state.validation=undefined;allowUnload=false;notify();return initializeWorkspace();
}
function safeDocument(config:ConfigPackageV3){if(!config||config.schemaVersion!=='cairnmap.config-package.v3'||!Array.isArray(config.nodes)||!Array.isArray(config.workflows)||typeof config.packageId!=='string'||!Number.isSafeInteger(config.contractRevision))throw Error('缓存文档结构无法安全读取；原检查点保留，可选择恢复默认。');}
export async function resumeWorkspace(value:WorkspaceCheckpoint):Promise<ConfigPackageV3>{
  if(value.schemaVersion!=='cairnmap.studio-workspace.v1'||!Number.isSafeInteger(value.generation)||value.generation<0)throw Error('此缓存格式不受支持；未更改原缓存。');
  safeDocument(value.config);let config:ConfigPackageV3,session=value.session;
  try{config=prepareConfigForActivation(value.config);}catch(error){
    if(validateNativeStructure(value.config).length)throw error;
    config=await fetchFormalDefaultConfig();session={...session,baseline:config,draft:session?.draft??null,tree:session?.tree??null,selectedId:session?.selectedId??'',editing:session?.editing??false,packageCandidate:session?.packageCandidate??{baseline:config,config:value.config,source:'recovery'}};
  }
  if(session){if(!session.baseline||typeof session.editing!=='boolean')throw Error('缓存区域状态无法安全读取。');if(session.draft)safeDocument(session.draft);if(session.packageCandidate)safeDocument(session.packageCandidate.config);if(session.tree)safeDocument(session.tree.staged);}
  if(config.application)await checkApplicationTransition(config.application);
  state.baselineIdentity=value.baselineIdentity??await readFormalIdentity();state.editAudit=await readEditAudit(value.editAudit,value.config);
  state.importedEditAudit=value.importedEditAudit?{audit:(await readEditAudit(value.importedEditAudit.audit,value.importedEditAudit.sourceConfig))!,sourceConfig:value.importedEditAudit.sourceConfig}:undefined;
  activate(config);state.session=session;state.validation=value.validation;state.importedDiagnostic=readTemporaryDiagnostic(value.importedDiagnostic);state.migration=value.migration?{original:value.migration.original,report:readMigrationReport(value.migration.report),...(/^[a-f0-9]{64}$/.test(value.migration.resultSha256??'')?{resultSha256:value.migration.resultSha256}:{})}:undefined;state.generation=value.generation;state.modified=true;state.signature=signature(config,session);state.enabled=true;restoreInputBuffers(value.inputBuffers);state.savedAt=value.updatedAt;notify();return config;
}
export async function loadActiveConfig():Promise<ConfigPackageV3>{if(state.active)return state.active;const saved=await initializeWorkspace();if(saved.checkpoint)throw Error('存在本机工作区缓存，请先选择继续编辑或恢复默认。');return startDefaultWorkspace();}
export function getActiveConfigSnapshot():ConfigPackageV3{if(!state.active)throw Error('编辑工作区尚未打开。');return state.active;}
export const getStudioSessionSnapshot=()=>state.session;
export async function persistStudioEditingSession(session:StudioEditingSession|null):Promise<void>{if(!state.enabled)return;state.session=session??undefined;changed();}
export function recordWorkspaceValidation(run:WorkspaceValidation){if(run.generation!==state.generation)throw Error('核验期间编辑内容已变化，请重新核验。');state.validation=run;notify();schedule();}
export function invalidateWorkspaceValidation(){if(state.validation?.generation===state.generation){state.generation++;notify();schedule();}}
let migrationStamp=0;
export function setMigrationAttachment(value?:MigrationAttachment,result?:unknown,source?:unknown){
  if(result===undefined&&value?.original&&!value.report)migrationStamp++;
  state.migration=value;if(value?.report&&value.original)value.report={...value.report,sourceSha256:value.original.sha256};notify();schedule();
  if(result!==undefined&&value){const stamp=++migrationStamp;const hash=async(value:unknown)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(stableConfigText(value)))),n=>n.toString(16).padStart(2,'0')).join('');
    void Promise.all([hash(result),source===undefined?Promise.resolve(value.original?.sha256):hash(source)]).then(([resultSha256,sourceSha256])=>{if(stamp!==migrationStamp||!state.migration)return;state.migration={...state.migration,resultSha256,...(state.migration.report?{report:{...state.migration.report,resultSha256,sourceSha256}}:{})};notify();schedule();}).catch(error=>{state.writeError='迁移结果摘要计算失败：'+String(error);notify();});
  }else if(!value)migrationStamp++;
}
export function setImportedDiagnostic(value?:TemporaryDiagnostic){state.importedDiagnostic=value;notify();schedule();}
export const needsWorkspaceExitPrompt=()=>!allowUnload&&state.modified&&(!currentValidation(state.validation,state.generation)||state.validation?.report.valid!==true||hasStudioDraft(state.session)||Object.keys(readInputBuffers()).length>0||Boolean(state.writeError));
export async function flushWorkspace():Promise<void>{
  if(state.timer){clearTimeout(state.timer);state.timer=undefined;}
  const task=state.writes.catch(()=>undefined).then(async()=>{if(!state.enabled||!state.modified)return;try{const value=checkpoint();state.token=await writeWorkspaceCheckpoint(value,state.token);state.savedAt=value.updatedAt;state.writeError='';notify();}catch(error){state.writeError=String(error);notify();throw error;}});state.writes=task;await task;
}
export async function clearWorkspace():Promise<void>{
  const previous=state.enabled;state.enabled=false;if(state.timer){clearTimeout(state.timer);state.timer=undefined;}
  await state.writes.catch(()=>undefined);
  try{state.token=await writeWorkspaceCheckpoint(undefined,state.token);state.modified=false;state.writeError='';notify();}
  catch(error){state.enabled=previous;state.writeError=String(error);notify();throw error;}
}
export async function persistActiveConfig(value:ConfigPackageV3,increment=false,expected?:{config:ConfigPackageV3;kind:'default'|'custom'}):Promise<ConfigPackageV3>{
  if(expected&&stableConfigText(expected.config)!==stableConfigText(state.active))throw Error('本机编辑基线已变化，请重新核验保存。');
  const baseline=state.baselineIdentity??await readFormalIdentity();
  const next={...value,revision:baseline.revision};
  const config=prepareConfigForActivation(next);if(config.application)await checkApplicationTransition(config.application);
  const previous=state.active??config,generation=state.generation;
  const editAudit=await appendEditCheckpoint(state.importedEditAudit?.audit??state.editAudit,baseline,state.importedEditAudit?.sourceConfig??previous,config);
  void increment; // Kept for legacy callers; every validated global checkpoint is audited.
  await state.writes.catch(()=>undefined);
  if(state.generation!==generation)throw Error('保存期间编辑稿发生变化，未覆盖当前工作区。');
  const signatureValue=signature(config),changedValue=state.signature!==signatureValue;
  const updatedAt=new Date().toISOString(),nextGeneration=generation+(changedValue?1:0);
  const valueToWrite:WorkspaceCheckpoint={schemaVersion:'cairnmap.studio-workspace.v1',config,generation:nextGeneration,updatedAt,editAudit,baselineIdentity:baseline,migration:state.migration,importedDiagnostic:state.importedDiagnostic};
  if(state.timer){clearTimeout(state.timer);state.timer=undefined;}
  let token=state.token,writeError='';
  try{token=await writeWorkspaceCheckpoint(valueToWrite,state.token);}catch(error){
    // A quota failure preserves one complete in-memory config/checkpoint/audit.
    // Cross-tab conflicts never enter this escape and cannot overwrite a peer.
    if(!(error instanceof DOMException)||!['QuotaExceededError','NS_ERROR_DOM_QUOTA_REACHED'].includes(error.name))throw error;
    writeError=String(error);
  }
  state.token=token;state.editAudit=editAudit;state.importedEditAudit=undefined;state.baselineIdentity=baseline;state.session=undefined;state.generation=nextGeneration;state.signature=signatureValue;state.modified=true;state.savedAt=writeError?state.savedAt:updatedAt;state.writeError=writeError;
  activate(config);notify();

  return config;
}
export async function readDurableActiveConfig():Promise<{config:ConfigPackageV3;kind:'default'|'custom'}>{return {config:getActiveConfigSnapshot(),kind:state.modified?'custom':'default'};}
/** Retire unpublished audit only after this exact local content is confirmed on Web. */
export async function acknowledgePublishedWorkspace(identity:ConfigurationIdentity,published:ConfigPackageV3):Promise<ConfigPackageV3>{
  const current=getActiveConfigSnapshot(),generation=state.generation;
  if(identity.packageId!==published.packageId||identity.revision!==published.revision||identity.contractRevision!==published.contractRevision||stableConfigText({...current,revision:published.revision})!==stableConfigText(published))throw Error('发布后本机内容已变化，保留编辑审计；请先比较当前正式配置。');
  if(hasStudioDraft(state.session)||Object.keys(readInputBuffers()).length)throw Error('仍有未保存输入，保留当前工作区和审计。');
  const config=prepareConfigForActivation(published);
  await state.writes.catch(()=>undefined);
  if(state.generation!==generation)throw Error('确认正式身份期间编辑稿发生变化，未清除审计。');
  if(state.timer){clearTimeout(state.timer);state.timer=undefined;}
  const token=await writeWorkspaceCheckpoint(undefined,state.token);
  state.token=token;if(state.generation!==generation){await flushWorkspace();throw Error('确认期间有新输入，已保留原工作区和审计。');}state.baselineIdentity=identity;state.editAudit=undefined;state.importedEditAudit=undefined;state.session=undefined;state.validation=undefined;state.importedDiagnostic=undefined;
  state.generation++;state.modified=false;state.savedAt=undefined;state.signature=signature(config);state.defaultPromise=Promise.resolve(config);state.writeError='';activate(config);notify();return config;
}
export async function restoreApplicationDefault():Promise<void>{if(hasStudioDraft(state.session))throw Error('请先保存或放弃当前编辑草稿，再恢复当前正式配置。');await startDefaultWorkspace();}

export function setImportedEditAudit(value?:EditAudit,sourceConfig?:ConfigPackageV3){if(value&&sourceConfig){const audit=structuredClone(value),source=audit.staged?.sourceConfig??sourceConfig;delete audit.staged;state.importedEditAudit={audit,sourceConfig:source};}else state.importedEditAudit=undefined;notify();schedule();}

subscribeInputBuffers(()=>{if(!state.enabled)return;state.modified=true;state.generation++;allowUnload=false;notify();schedule();});
