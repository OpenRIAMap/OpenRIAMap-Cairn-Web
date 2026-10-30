import React from 'react';
import {createRoot} from 'react-dom/client';
import '../../../src/styles/index.css';
import {WorldVersionControl} from '../../../src/components/Settings/WorldVersionControl';
import ReviewConfirmationHost from '../../../src/components/Review/ReviewConfirmationHost';
import {getFormalConfiguration,loadFormalConfiguration} from '../../../src/configRuntime/formalConfiguration';
await loadFormalConfiguration();
const scenario=new URLSearchParams(location.search).get('scenario')??'adjust';
let calls:any[]=[],version=24,revision=1,prepared:any=null,changed=0;
const state=()=>({initialized:scenario!=='initialize',active:null,current:{schemaVersion:'openriamap.current-release-set.v3',releaseId:'review-batch-24',formalVersion:24,publicationId:'review-batch-24',publicationVersion:24,indexRevision:revision,worlds:['zth','eden','naraku','houtu'],worldBindings:[{worldId:'eden',authorityGroupId:'openriamap-ria-formal',worldVersion:version,bindingRevision:revision,dataReleaseId:'data-eden-first'}]}});
const original=window.fetch.bind(window);
window.fetch=async(input,init)=>{
  const url=String(input);
  if(url.startsWith('/api/configuration?purpose=business'))return new Response(JSON.stringify(getFormalConfiguration()!.identity),{headers:{'content-type':'application/json','x-cairn-configuration-authority':'scf'}});
  if(url.includes('review-control')&&init?.body){
    const body=JSON.parse(String(init.body));if(body.operation!=='world-version')return original(input,init);
    calls.push(body);const request=body.request;let result:any;
    if(request.action==='inspect')result=state();
    if(request.action==='precheck'){
      if(scenario==='occupied')return new Response(JSON.stringify({error:'world-version-target-occupied'}),{status:409,headers:{'content-type':'application/json'}});
      prepared={operationId:'world-version-11111111-1111-4111-8111-111111111111',planSha256:'a'.repeat(64),publicationVersion:24,plan:{action:request.request.action,worldId:'eden',targetVersion:request.request.targetVersion,reason:request.request.reason,expiresAt:Date.now()+300000,before:{worldVersion:24,dataReleaseId:'data-eden-first',contentSha256:'b'.repeat(64)}}};result=prepared;
    }
    if(request.action==='confirm')result={operationId:prepared.operationId,state:'queued'};
    if(request.action==='progress'){version=scenario==='initialize'?24:1;revision++;result={operationId:request.operationId,state:'completed'};}
    (window as any).worldVersionFixture={calls,version,changed};
    return new Response(JSON.stringify(result),{headers:{'content-type':'application/json'}});
  }
  return original(input,init);
};
(window as any).worldVersionFixture={calls,version,changed};
createRoot(document.getElementById('root')!).render(<><WorldVersionControl worldId="eden" name="伊甸" canManage={scenario!=='viewer'} onChanged={async()=>{changed++;(window as any).worldVersionFixture={calls,version,changed};}}/><ReviewConfirmationHost/></>);
