import type {WorkflowStep,WorkflowControl,WorkflowLayoutItem,WorkflowDefinition} from './types';

/** c21's effective grouping order, also used by the explicit c22 migration. */
export function legacyWorkflowLayout(step:WorkflowStep):WorkflowLayoutItem[]{
  const result:WorkflowLayoutItem[]=[],seen=new Set<string>();
  for(const control of step.controls??[]){
    if(!control.sectionId){result.push({kind:'control',controlId:control.id});continue;}
    if(!step.sections?.some(section=>section.id===control.sectionId))throw Error(`控件 ${control.id} 引用了不存在的分栏 ${control.sectionId}`);
    if(seen.has(control.sectionId))continue;seen.add(control.sectionId);
    result.push({kind:'section',sectionId:control.sectionId,children:(step.controls??[]).filter(item=>item.sectionId===control.sectionId).map(item=>({kind:'control',controlId:item.id}))});
  }
  const empty=(step.sections??[]).filter(s=>!seen.has(s.id)).map(s=>({kind:'section' as const,sectionId:s.id,children:[]}));
  const tags=result.findIndex(item=>item.kind==='control'&&step.controls?.find(c=>c.id===item.controlId)?.kind==='tagsExtensions');
  result.splice(tags<0?result.length:tags,0,...empty);return result;
}
export const workflowLayout=(step:WorkflowStep):WorkflowLayoutItem[]=>step.layout??legacyWorkflowLayout(step);
export function orderedWorkflowControls(step:WorkflowStep):WorkflowControl[]{
  const byId=new Map((step.controls??[]).map(c=>[c.id,c]));
  return workflowLayout(step).flatMap(item=>item.kind==='control'?[item]:item.children).flatMap(item=>{const c=byId.get(item.controlId);return c?[c]:[];});
}
/** Layout is authoritative in c22; preserve historical flat validation order otherwise. */
export const workflowControlsInOrder=(step:WorkflowStep):WorkflowControl[]=>step.layout?orderedWorkflowControls(step):step.controls??[];
export function migrateWorkflowLayout(workflow:WorkflowDefinition):WorkflowDefinition{
  const next=structuredClone(workflow);
  for(const step of next.steps)if(step.kind==='form'){
    step.layout=legacyWorkflowLayout(step);
    for(const control of step.controls??[])delete control.sectionId;
  }
  return next;
}
/** Only reconcile deliberate editor additions/deletions; import validation never repairs a layout. */
export function reconcileWorkflowLayout(step:WorkflowStep):WorkflowStep{
  const ids=new Set((step.controls??[]).map(c=>c.id)),sections=new Set((step.sections??[]).map(s=>s.id));
  const layout=(step.layout??[]).flatMap<WorkflowLayoutItem>(item=>item.kind==='control'?(ids.has(item.controlId)?[item]:[]):sections.has(item.sectionId)?[{...item,children:item.children.filter(c=>ids.has(c.controlId))}]:item.children.filter(c=>ids.has(c.controlId)));
  const present=new Set(layout.flatMap(item=>item.kind==='control'?[item.controlId]:item.children.map(c=>c.controlId)));
  for(const c of step.controls??[])if(!present.has(c.id)){
    const tags=layout.findIndex(item=>item.kind==='control'&&step.controls?.find(x=>x.id===item.controlId)?.kind==='tagsExtensions');
    layout.splice(tags<0?layout.length:tags,0,{kind:'control',controlId:c.id});
  }
  for(const s of step.sections??[])if(!layout.some(item=>item.kind==='section'&&item.sectionId===s.id))layout.push({kind:'section',sectionId:s.id,children:[]});
  return {...step,layout};
}
export function workflowLayoutProblems(step:WorkflowStep):string[]{
  const errors:string[]=[],controls=new Map((step.controls??[]).map(c=>[c.id,c])),sections=new Set((step.sections??[]).map(s=>s.id)),seen=new Set<string>(),seenSections=new Set<string>();
  if(!Array.isArray(step.layout))return ['c22 信息页必须包含 layout。'];
  const control=(item:{kind:string;controlId?:string},inside:boolean)=>{
    if(item.kind!=='control'||!item.controlId||!controls.has(item.controlId)){errors.push('布局存在悬空或非法控件引用。');return;}
    if(seen.has(item.controlId))errors.push('布局控件重复：'+item.controlId);seen.add(item.controlId);
    if(inside&&['classificationPicker','tagsExtensions'].includes(controls.get(item.controlId)!.kind))errors.push('分类和标签扩展系统单元必须在页顶层。');
  };
  for(const item of step.layout){
    if(item.kind==='control')control(item,false);
    else if(item.kind==='section'){
      if(!sections.has(item.sectionId)||seenSections.has(item.sectionId))errors.push('分栏引用不存在或重复。');seenSections.add(item.sectionId);
      if(!Array.isArray(item.children))errors.push('分栏内部必须是控件引用列表。');else for(const child of item.children)control(child,true);
    }else errors.push('布局仅允许控件和单层分栏。');
  }
  for(const c of controls.values()){if(!seen.has(c.id))errors.push('控件未加入布局：'+c.id);if(c.sectionId!==undefined)errors.push('c22 不允许旧 sectionId 归属。');}
  for(const id of sections)if(!seenSections.has(id))errors.push('分栏未加入布局：'+id);
  return errors;
}

export type LayoutMove={from:string;to:string;after:boolean;fromContainer:string;toContainer:string;into?:'start'|'end'};
export const layoutItemId=(item:WorkflowLayoutItem)=>item.kind==='control'?item.controlId:item.sectionId;
export const layoutContainer=(pageId:string,sectionId?:string)=>JSON.stringify([pageId,sectionId??null]);
/** Pure move transaction: arrows stay in one list; drag can move across lists/pages. */
export function moveWorkflowLayout(forms:WorkflowStep[],move:LayoutMove):WorkflowStep[]{
  const next=structuredClone(forms);
  const locate=(container:string)=>{let parts:unknown;try{parts=JSON.parse(container);}catch{return;}
    if(!Array.isArray(parts))return;const page=next.find(p=>p.id===parts[0]);if(!page?.layout)return;
    const section=parts[1]?page.layout.find(i=>i.kind==='section'&&i.sectionId===parts[1]):undefined;
    if(parts[1]&&section?.kind!=='section')return;
    return {page,list:section?.kind==='section'?section.children:page.layout,inside:!!parts[1]};
  };
  const a=locate(move.fromContainer),b=locate(move.toContainer);if(!a||!b)return forms;
  const index=a.list.findIndex(item=>layoutItemId(item)===move.from),item=a.list[index];if(!item||move.from===move.to&&move.fromContainer===move.toContainer)return forms;
  if(item.kind==='section'&&a.page!==b.page&&b.page.sections?.some(s=>s.id===item.sectionId))return forms;
  const ids=item.kind==='control'?[item.controlId]:item.children.map(c=>c.controlId);
  if(b.inside&&(item.kind==='section'||ids.some(id=>['classificationPicker','tagsExtensions'].includes(a.page.controls?.find(c=>c.id===id)?.kind??''))))return forms;
  if(item.kind==='section'&&move.toContainer===layoutContainer(a.page.id,item.sectionId))return forms;
  const targetIndex=move.to?b.list.findIndex(i=>layoutItemId(i)===move.to):-1;if(move.to&&targetIndex<0)return forms;
  a.list.splice(index,1);
  const at=move.to?b.list.findIndex(i=>layoutItemId(i)===move.to)+(move.after?1:0):move.into==='start'?0:b.list.length;
  (b.list as WorkflowLayoutItem[]).splice(at,0,item);
  if(a.page!==b.page){
    const moved=(a.page.controls??[]).filter(c=>ids.includes(c.id));a.page.controls=(a.page.controls??[]).filter(c=>!ids.includes(c.id));b.page.controls=[...b.page.controls??[],...moved];
    if(item.kind==='section'){const section=a.page.sections?.find(s=>s.id===item.sectionId);if(section){a.page.sections=a.page.sections?.filter(s=>s.id!==section.id);b.page.sections=[...b.page.sections??[],section];}}
  }
  return next;
}
