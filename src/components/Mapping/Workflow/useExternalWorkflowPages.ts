import {useEffect,useRef,useState,type MutableRefObject} from 'react';
import {requestReviewConfirmation} from '@/components/Review/ReviewConfirmationHost';
import type {WorkflowBridge,WorkflowDrawingDraft} from './WorkflowHost';
import type {ExternalWorkflowJournal} from './externalWorkflowJournal';

export function useExternalWorkflowPages<Step extends string,State extends object>({step,setStep,state,restore,order,fields,bridge,journal}:{
  step:Step;setStep:(step:Step)=>void;state:State;
  restore:(state:State,target:Step,draft:WorkflowDrawingDraft|null)=>void;
  order:readonly Step[];fields:Partial<Record<Step,readonly (keyof State)[]>>;
  bridge:MutableRefObject<WorkflowBridge>;journal:ExternalWorkflowJournal;
}){
  const [initial]=useState(()=>structuredClone(state));
  const snapshots=useRef(new Map<Step,{state:State;draft:WorkflowDrawingDraft|null}>());
  const pendingDraft=useRef<WorkflowDrawingDraft|null>(null),busy=useRef(false);
  const latest=useRef({step,state,restore,order,fields,setStep});latest.current={step,state,restore,order,fields,setStep};journal.page=step;
  useEffect(()=>{if(!pendingDraft.current)return;const draft=pendingDraft.current;pendingDraft.current=null;const frame=requestAnimationFrame(()=>bridge.current.restoreDrawingDraft?.(draft));return()=>cancelAnimationFrame(frame);},[step]);
  const go=async(next:Step)=>{
    if(busy.current)return;const current=latest.current,from=current.order.indexOf(current.step),to=current.order.indexOf(next);
    if(to<0||next===current.step)return;
    if(to<from){
      busy.current=true;
      try{
        const snapshot=snapshots.current.get(next);if(!snapshot)throw Error('目标页快照不存在，已保留当前填写。');
        const confirmed=await requestReviewConfirmation({title:'返回上一步',message:'回到上一步会清除后面部分的所有填写内容，需要重新填写，是否确认？',confirmLabel:'确认返回',tone:'orange'});
        if(!confirmed)return;
        if(bridge.current.prepareDrawingTransition?.()===false)return;
        const affected=current.order.slice(to),restored=structuredClone(snapshot.state);
        for(const page of current.order.slice(to+1))for(const key of current.fields[page]??[])restored[key]=structuredClone(initial[key]);
        // The owner either restores every affected layer or throws before any UI changes.
        journal.rollback(bridge.current,affected);
        current.restore(restored,next,snapshot.draft);pendingDraft.current=snapshot.draft;
        for(const page of affected)if(page!==next)snapshots.current.delete(page);
        bridge.current.clearWorkflowPreview();
        for(const page of current.order.slice(0,to)){
          const draft=snapshots.current.get(page)?.draft;if(!draft?.geometry)continue;
          bridge.current.upsertWorkflowPreview('checkpoint:'+page,draft.geometry.type==='Point'?'point':draft.geometry.type==='Polygon'?'polygon':'polyline',draft.coordinates,{interactive:false},draft.geometry);
        }
        current.setStep(next);
      }catch(error){window.alert(error instanceof Error?error.message:'回退失败，当前填写已保留。');}
      finally{busy.current=false;}
      return;
    }
    snapshots.current.set(current.step,{state:structuredClone(current.state),draft:journal.lastDraft(current.step)??bridge.current.getDrawingDraft?.()??null});
    current.setStep(next);
  };
  return {go};
}
