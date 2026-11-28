import type {ReactNode} from 'react';
import type {WorkflowStep,WorkflowControl,WorkflowDefinition,WorkflowLayoutItem} from './types';
import {WorkflowFold} from './WorkflowFold';
import {HelpLabel} from './SettingHelp';
import {FoldOrderControls,FoldDropArea} from './FoldOrderControls';
import {layoutContainer,layoutItemId,moveWorkflowLayout,type LayoutMove} from './workflowLayout';

export function WorkflowLayoutEditor({workflow,step,forms,onChange,renderControl}:{workflow:WorkflowDefinition;step:WorkflowStep;forms:WorkflowStep[];onChange:(forms:WorkflowStep[])=>void;renderControl:(control:WorkflowControl,order:ReactNode)=>ReactNode}){
  const scope='workflow-controls:'+workflow.id,move=(value:LayoutMove)=>onChange(moveWorkflowLayout(forms,value));
  const patch=(next:WorkflowStep)=>onChange(forms.map(page=>page.id===step.id?next:page));
  const render=(items:WorkflowLayoutItem[],sectionId?:string):ReactNode=>{
    const container=layoutContainer(step.id,sectionId);
    return <FoldDropArea scope={scope} container={container} sectionContainer={!!sectionId} onMove={move}>{items.map((item,index)=>{
      const id=layoutItemId(item),order=<FoldOrderControls layoutMode scope={scope} container={container} id={id} index={index} count={items.length} section={item.kind==='section'} sectionContainer={item.kind==='section'?layoutContainer(step.id,item.sectionId):undefined} topLevelOnly={item.kind==='control'&&['classificationPicker','tagsExtensions'].includes(step.controls?.find(c=>c.id===item.controlId)?.kind??'')} label={item.kind==='section'?'分栏':'控件'} onMove={move} onStep={offset=>{const target=items[index+offset];if(target)move({from:id,to:layoutItemId(target),after:offset>0,fromContainer:container,toContainer:container});}}/>;
      if(item.kind==='control'){const control=step.controls?.find(c=>c.id===item.controlId);return control?<div key={'control:'+id} className="contents">{renderControl(control,order)}</div>:null;}
      const section=step.sections?.find(s=>s.id===item.sectionId);if(!section)return null;
      return <WorkflowFold key={'section:'+id} section title={'分栏 · '+(section.label.zh||section.label.en)} foldKey={'section:'+step.id+':'+id} path={'steps/'+step.id+'/sections/'+id} order={order}>
        <div className="cm-flex-grid gap-2"><HelpLabel context="V3WorkflowEditor">分栏标题<input aria-label="分栏标题" value={section.label.zh} onChange={e=>patch({...step,sections:step.sections?.map(s=>s.id===id?{...s,label:{...s.label,zh:e.target.value}}:s)})}/></HelpLabel><HelpLabel context="V3WorkflowEditor"><input type="checkbox" checked={section.initialOpen===true} onChange={e=>patch({...step,sections:step.sections?.map(s=>s.id===id?{...s,initialOpen:e.target.checked}:s)})}/>初始展开</HelpLabel><button type="button" onClick={()=>patch({...step,sections:step.sections?.filter(s=>s.id!==id),layout:step.layout?.flatMap(row=>row.kind==='section'&&row.sectionId===id?row.children:[row])})}>删除分栏（保留控件）</button></div>
        <div className="cm-section-children mt-3 border-t pt-3" aria-label={'分栏内部 '+section.label.zh}>{render(item.children,id)}</div>
      </WorkflowFold>;
    })}</FoldDropArea>;
  };
  return <div data-workflow-layout={step.id}>{render(step.layout??[])}</div>;
}
