import React,{useCallback,useState} from 'react';
import {createRoot} from 'react-dom/client';
import '../../../src/styles/index.css';
import '../../../src/styles/colorScheme.css';
import '../../../src/styles/workspaceSidebar.css';
import {ReviewStatusBoardPanel,type ReviewStatusBoardPanelProps} from '../../../src/components/Review/ReviewStatusBoardPanel';
import {WorkspaceSidebarContext} from '../../../src/components/DraggablePanel/WorkspaceSidebarContext';
import type {ReviewReleaseControlRequest,ReviewReleaseGateSnapshot} from '../../../src/components/Review/contracts';
import type {ReviewPackageSession} from '../../../src/components/Review/reviewPackageSession';

// Local fixture ports only: the production panel, clicks and polling are unchanged.
const scenario=new URLSearchParams(location.search).get('scenario');
let principalId='reviewer-test';
const actor=()=>({principalId,roles:['maintainer']});
const time='2026-11-27T00:00:00Z';
const submissions=Array.from({length:18},(_,i)=>({submissionId:`submission-${i}`,packageName:`测试审核包 ${i}.zip`,state:'pending',stateVersion:1,currentRevisionId:`revision-${i}`,revisions:[{revisionId:`revision-${i}`,createdAt:time,package:{featureCount:1,deleteCount:0,pictureCount:0}}]}));
let boardVersion=7;
const board=()=>({schemaVersion:'cairn.review-status-board.v1',boardVersion,updatedAt:time,entries:submissions.map(s=>({submissionId:s.submissionId,state:'approved',decisionRevisionId:s.currentRevisionId,decisionAction:'approve',updatedAt:time,updatedBy:actor()}))});
let gate:ReviewReleaseGateSnapshot={state:'idle',gateVersion:1,attemptId:null};
const calls:ReviewReleaseControlRequest[]=[];
const countByRequest=new Map<string,number>();
let notifyUpload:()=>void=()=>{};
const diagnostics=()=>{document.querySelector('#fixture-calls')!.textContent=JSON.stringify({calls:calls.map(c=>({id:c.request.idempotencyKey,ids:c.selectedSubmissionIds,actor:c.request.actor.principalId})),unique:countByRequest.size});};
const props={
  auth:{getSession:async()=>({status:'authenticated',...actor()})},
  submissionAdapter:{listSubmissions:async()=>submissions,getStatusBoard:async()=>board()},
  releaseControl:{
    getReleaseGate:async()=>gate,
    runReleasePrecheck:async(request:ReviewReleaseControlRequest)=>{
      calls.push(structuredClone(request));
      const n=(countByRequest.get(request.request.idempotencyKey)??0)+1;
      countByRequest.set(request.request.idempotencyKey,n);diagnostics();
      await new Promise(resolve=>setTimeout(resolve,350));
      gate={attemptId:request.request.idempotencyKey,gateVersion:2,state:n<3?'prechecking':'awaiting-confirmation',owner:request.request.actor,leaseExpiresAt:new Date(Date.now()+120000).toISOString()};
      if(scenario==='legacy-resume'&&n===1){
        const storageKey='cairnmap-review-precheck:'+request.request.actor.principalId;
        const saved=JSON.parse(sessionStorage.getItem(storageKey)??'null');
        saved.key=board().entries.filter(entry=>request.selectedSubmissionIds.includes(entry.submissionId)).map(entry=>entry.submissionId+':'+entry.decisionRevisionId).join('|')+':'+boardVersion;
        sessionStorage.setItem(storageKey,JSON.stringify(saved));
      }
      if(scenario==='retry'&&n===1)throw Error('fixture-network-interrupted');
      if(n<3)return {decision:'pending',gate,report:{findings:[{code:'BATCH_CONFIGURATION_PENDING',severity:'info',message:`检查阶段 ${n}`}]}};
      return {decision:'warning-confirmation-required',gate,report:{reportSha256:'a'.repeat(64),findings:Array.from({length:800},(_,i)=>({code:'UPSERT_OVERWRITES_CURRENT',severity:'warning',message:`报告条目 ${i}：此项将覆盖同世界、同分类、同 ID 的要素。`,target:{worldId:'zth',classCode:'BUD',featureId:`LOCAL_${i}`}}))}};
    },
    confirmRelease:async()=>{throw Error('This fixture must never publish');},
  },
  subscribeToSubmissionUpload:(listener:()=>void)=>{notifyUpload=listener;return()=>{notifyUpload=()=>{};};},
  onDownloadRevision:()=>{},onLoadRevision:()=>{},onLocalPrecheck:()=>({decision:'ready'}),isRevisionCached:()=>true,
} as unknown as Omit<ReviewStatusBoardPanelProps,'onClose'>;

function Fixture(){
  const [target,setTarget]=useState<HTMLDivElement|null>(null),[docked,setDocked]=useState(true),[opened,setOpened]=useState(true),[bound,setBound]=useState(false),[canClose,setCanClose]=useState(false);
  const registerPanel=useCallback(()=>()=>{},[]);
  return <>
    <nav className="flex gap-3 p-2" aria-label="本地测试情景">
      <button onClick={()=>{document.documentElement.dataset.colorScheme='dark';}}>深色情景</button>
      <button onClick={()=>{document.documentElement.dataset.colorScheme='light';}}>浅色情景</button>
      <button onClick={()=>setDocked(v=>!v)}>切换容器</button>
      <button aria-pressed={bound} onClick={()=>setBound(v=>!v)}>切换工作区绑定</button>
      <button aria-pressed={canClose} onClick={()=>setCanClose(v=>!v)}>切换允许关闭</button>
      <button onClick={()=>{boardVersion++;notifyUpload();}}>更新状态板版本</button>
      <button onClick={()=>{principalId=principalId==='reviewer-test'?'another-reviewer':'reviewer-test';notifyUpload();}}>切换测试身份</button>
      <button onClick={()=>setOpened(true)}>重开面板</button>
    </nav>
    <WorkspaceSidebarContext.Provider value={{enabled:docked,target,mapRight:docked?window.innerWidth-650:window.innerWidth,registerPanel}}>
      {opened?<ReviewStatusBoardPanel {...props} activeWorkspaceSession={bound?{submissionContext:{submissionId:'submission-0'}} as ReviewPackageSession:null} onCloseActiveWorkspace={()=>canClose} onClose={()=>setOpened(false)}/>:null}
      <aside className="cm-workspace-sidebar" style={{width:650,top:50}}><div ref={setTarget} className="cm-workspace-panel-list"/></aside>
    </WorkspaceSidebarContext.Provider>
    <output id="fixture-calls" hidden/>
  </>;
}
document.documentElement.dataset.panelLayout='cards';
createRoot(document.getElementById('root')!).render(<Fixture/>);
