import React from 'react';
import {createRoot} from 'react-dom/client';
import '../../../src/styles/index.css';
import ReviewConfirmationHost from '../../../src/components/Review/ReviewConfirmationHost';
import {getFormalConfiguration,loadFormalConfiguration} from '../../../src/configRuntime/formalConfiguration';
import {getRuleDataSourceSnapshot} from '../../../src/components/Rules/data/formalDataSourceRuntime';

await loadFormalConfiguration();
const {useRuleDataStore}=await import('../../../src/store/ruleDataStore');
const source=getRuleDataSourceSnapshot('eden'),dataReleaseId='data-eden-first';
const manifest={schemaVersion:'openriamap.world-release-manifest.v2',worldId:'eden',releaseId:dataReleaseId,chunkCatalogKeys:[],featureCount:0,chunkCount:0};
const manifestText=JSON.stringify(manifest);
const manifestSha256=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(manifestText))),value=>value.toString(16).padStart(2,'0')).join('');
let version=24,prepared:any;
const current=()=>({schemaVersion:'openriamap.current-release-set.v3',releaseId:'review-batch-24',formalVersion:24,publicationId:'review-batch-24',publicationVersion:24,indexRevision:version===24?1:2,worlds:['eden'],worldBindings:[{
  worldId:'eden',authorityGroupId:'openriamap-ria-formal',worldVersion:version,bindingRevision:version===24?1:2,dataReleaseId,
  worldManifestKey:`releases/${dataReleaseId}/manifests/worlds/eden.json`,worldManifestSha256:manifestSha256,contentSha256:'b'.repeat(64),operationId:'world-version-settings',updatedAt:'2026-10-30T00:00:00Z',
}]});
const dataset=(formalVersion:number)=>({worldId:'eden',mergeVersion:dataReleaseId,releaseId:dataReleaseId,formalVersion,bindingRevision:formalVersion===24?1:2,sourceId:source.sourceId,transportId:source.transportId,readerSchemaVersion:source.readerSchemaVersion,sourceGeneration:source.generation,loadedAt:1,features:[]});
useRuleDataStore.setState({datasets:{eden:dataset(24)},ensureWorldLoaded:async()=>{
  const updated=dataset(1);useRuleDataStore.setState({datasets:{eden:updated}});
  // The store update renders before the later remote status response arrives.
  await new Promise(resolve=>setTimeout(resolve,25));return updated;
}});
const response=(value:unknown)=>new Response(JSON.stringify(value),{headers:{'content-type':'application/json'}});
const original=window.fetch.bind(window);
window.fetch=async(input,init)=>{
  const url=String(input);
  if(url.startsWith('/api/configuration?purpose=business'))return new Response(JSON.stringify(getFormalConfiguration()!.identity),{headers:{'content-type':'application/json','x-cairn-configuration-authority':'scf'}});
  if(url.includes('_release-set.json')){
    if(version===1)await new Promise(resolve=>setTimeout(resolve,350));
    return response(current());
  }
  if(url.includes(`/manifests/worlds/eden.json`)||url.includes('/Release_Metadata/worlds/eden.json'))return new Response(manifestText,{headers:{'content-type':'application/json'}});
  if(url.includes('review-control')&&init?.body){
    const body=JSON.parse(String(init.body));if(body.operation!=='world-version')throw Error('Unexpected management request');
    const request=body.request;let value:unknown;
    if(request.action==='inspect')value={initialized:true,active:null,current:current()};
    if(request.action==='precheck'){
      prepared={operationId:'world-version-11111111-1111-4111-8111-111111111111',planSha256:'a'.repeat(64),publicationVersion:24,plan:{
        action:'reassign',worldId:'eden',targetVersion:1,reason:request.request.reason,expiresAt:Date.now()+300000,
        before:{worldVersion:24,dataReleaseId,contentSha256:'b'.repeat(64)},
      }};value=prepared;
    }
    if(request.action==='confirm')value={operationId:prepared.operationId,state:'queued'};
    if(request.action==='progress'){version=1;value={operationId:request.operationId,state:'completed'};}
    return response(value);
  }
  // All data and management ports in this fixture are isolated; local assets only.
  if(/^https?:/.test(url)&&!url.startsWith(location.origin))throw Error(`Unexpected remote request: ${url}`);
  return original(input,init);
};
(window as any).worldVersionSettingsFixture={localVersion:()=>useRuleDataStore.getState().datasets.eden?.formalVersion};
const auth={getSession:async()=>({status:'authenticated' as const,principalId:'fixture-maintainer',roles:['maintainer']}),beginLogin:async()=>{},logout:async()=>{}};
const {SettingsPanel}=await import('../../../src/components/Settings/SettingsPanel');
createRoot(document.getElementById('root')!).render(<><SettingsPanel onClose={()=>{}} reviewAuth={auth}/><ReviewConfirmationHost/></>);
