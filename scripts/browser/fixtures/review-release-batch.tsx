import React from 'react';
import {createRoot} from 'react-dom/client';
import '../../../src/styles/index.css';
import {ReviewStatusBoardPanel} from '../../../src/components/Review/ReviewStatusBoardPanel';
import type {ReviewStatusBoardPanelProps} from '../../../src/components/Review/ReviewStatusBoardPanel';

const scenario=new URLSearchParams(location.search).get('scenario');
const actor={principalId:'reviewer-test',roles:['maintainer']};
const timestamp='2026-11-11T00:00:00Z';
const digest='a'.repeat(64);
const submissions=['a','b'].map(letter=>({
  submissionId:'submission-'+letter,packageName:'Release batch '+letter.toUpperCase()+'.zip',state:'pending',stateVersion:1,
  currentRevisionId:'revision-'+letter,revisions:[{revisionId:'revision-'+letter,createdAt:timestamp}],
}));
const board={schemaVersion:'cairn.review-status-board.v1',boardVersion:7,updatedAt:timestamp,entries:submissions.map(submission=>({
  submissionId:submission.submissionId,state:'approved',decisionRevisionId:submission.currentRevisionId,
  decisionAction:'approve',updatedAt:timestamp,updatedBy:actor,
}))};
let gate:{state:string;gateVersion:number;attemptId:string|null;owner?:{principalId:string}}={state:'idle',gateVersion:1,attemptId:null};
const result=document.createElement('output');
result.id='release-result';
document.body.append(result);
let calls=0;
const props={
  auth:{getSession:async()=>({status:'authenticated',...actor})},
  submissionAdapter:{listSubmissions:async()=>submissions,getStatusBoard:async()=>board},
  releaseControl:{
    getReleaseGate:async()=>gate,
    runReleasePrecheck:async(request:{selectedSubmissionIds:string[];replaceAttemptId?:string})=>{
      calls++;
      if(request.selectedSubmissionIds.length===1){
        if(scenario!=='duplicate'&&request.replaceAttemptId!==gate.attemptId)throw Error('fixture-replacement-attempt-missing');
        gate={attemptId:'replacement',gateVersion:gate.gateVersion+1,state:'awaiting-confirmation',owner:actor};
        return {gate,decision:'ready',report:{reportSha256:digest}};
      }
      const blocked=scenario==='duplicate';
      const pending=!blocked&&calls===1;
      gate={attemptId:'batch-attempt',gateVersion:gate.gateVersion+1,state:blocked?'rebase-required':pending?'prechecking':'awaiting-confirmation',owner:actor};
      if(pending)return {gate,decision:'pending',report:{findings:[{code:'BATCH_CONFIGURATION_PENDING',severity:'info'}]}};
      const target={worldId:'zth',classCode:'BUD',featureId:'ZTEST'};
      const finding={
        code:blocked?'BATCH_DUPLICATE_UPSERT_ID':'BATCH_UPDATE_DELETE_CONFLICT',severity:blocked?'blocker':'warning',target,
        operations:submissions.map((submission,index)=>({...target,submissionId:submission.submissionId,revisionId:submission.currentRevisionId,
          packageName:submission.packageName,action:!blocked&&index?'delete':'update'})),
      };
      return {gate,decision:blocked?'blocked':'warning-confirmation-required',report:{reportSha256:digest,requiresWriteDeleteConfirmation:!blocked,findings:[finding]}};
    },
    confirmRelease:async(request:unknown)=>{
      result.textContent=JSON.stringify(request);
      return {decision:'queued',gate:{state:'running',gateVersion:gate.gateVersion+1,attemptId:gate.attemptId}};
    },
  },
  onDownloadRevision:()=>{},onLoadRevision:()=>{},onLocalPrecheck:()=>({decision:'ready'}),
  isRevisionCached:()=>true,onClose:()=>{},
} as unknown as ReviewStatusBoardPanelProps;
createRoot(document.getElementById('root')!).render(<ReviewStatusBoardPanel {...props}/>);
