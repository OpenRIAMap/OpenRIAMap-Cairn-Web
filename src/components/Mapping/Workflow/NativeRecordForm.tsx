import {workflowConditionMatches} from '@/configStudio/workflowExpression';
import {workflowConditionContext} from '@/configStudio/c21Workflow';
import {RequiredFieldsHint} from '@/configStudio/RequiredFieldsHint';
import {classificationPathKey} from '@/configStudio/runtime';
import {FeatureEditActions} from '../Editor/FeatureEditActions';
import {useEffect,useRef,useState} from 'react';
import {WorkflowFormLayout} from '@/configStudio/WorkflowFormLayout';
import {datasetOptions,workflowControlActive} from '@/configStudio/c21Workflow';
import type {ConfigPackageV3,MountedFeatureRecord,ClassificationPath,WorkflowControl} from '@/configStudio/types';
import {workflowClassificationCaption,workflowCategoryOptions} from '@/configStudio/workflowCategoryOptions';
import {ControlInput} from '@/configStudio/V3WorkflowRunner';
import {WorkflowAnnotationsInput} from '@/configStudio/WorkflowAnnotationsInput';
import {workflowEditClassifications,type WorkflowEditDraft,type WorkflowEditPlan} from '@/configStudio/workflowEditing';
export function NativeRecordForm({config,plan,draft,onChange,records,world,editor,onEditorChange,onCancel,onSave,saveDisabled=false,mode='edit',hideClassification=false,onClassificationChange}:{
 config:ConfigPackageV3;plan:WorkflowEditPlan;draft:WorkflowEditDraft;onChange:(draft:WorkflowEditDraft)=>void;records:MountedFeatureRecord[];world:string;editor:string;onEditorChange:(value:string)=>void;onCancel:()=>void;onSave?:()=>void;saveDisabled?:boolean;mode?:'create'|'edit';hideClassification?:boolean;onClassificationChange?:(path:ClassificationPath)=>void;
}){
 const [errors,setErrors]=useState<string[]>([]),[errorRevision,setErrorRevision]=useState(0);
 useEffect(()=>{const handler=(event:Event)=>{const detail=(event as CustomEvent<{workflowId:string;controlIds:string[]}>).detail;if(detail.workflowId===plan.workflow.id){setErrors(detail.controlIds);setErrorRevision(n=>n+1);}};window.addEventListener('cairn:workflow-input-errors',handler);return()=>window.removeEventListener('cairn:workflow-input-errors',handler);},[plan.workflow.id]);
 const change=(key:string,value:unknown)=>{setErrors(current=>current.filter(id=>!controls.some(c=>c.id===id&&(c.slot??c.id)===key)));onChange({...draft,slots:{...draft.slots,[key]:value}});};
 const fallbackClassification=plan.controls.some(c=>c.kind==='classificationPicker')?undefined:{id:'edit-classification',kind:'classificationPicker',label:{zh:'类型',en:''},columns:1,outputId:plan.workflow.outputs[0].id} as WorkflowControl;
 const originalControls=fallbackClassification?[fallbackClassification,...plan.controls]:plan.controls;
 const controls=originalControls.filter((c,i,all)=>c.kind!=='classificationPicker'||all.findIndex(v=>v.kind==='classificationPicker')===i);
 const classificationOptions=workflowCategoryOptions(config,config.contractRevision>=21?workflowEditClassifications(plan,draft.classification,mode):plan.classifications,plan.classifications);
 const datasetContext=useRef('');
 useEffect(()=>{const key=JSON.stringify([world,draft.classification,config.lookupTables?.find(t=>t.functionKind==='dataset')]);if(datasetContext.current&&datasetContext.current!==key){const slots={...draft.slots};let dirty=false;for(const c of controls.filter(c=>c.kind==='dataset')){const slot=c.slot??c.id;if(slots[slot]&&!datasetOptions(config,world,draft.classification).some(o=>o.value===slots[slot])){delete slots[slot];dirty=true;}}if(dirty)onChange({...draft,slots});}datasetContext.current=key;},[world,draft.classification,config.lookupTables,draft,onChange]);
 const renderControl=(control:WorkflowControl)=><fieldset disabled={control.kind==='classificationPicker'&&plan.classifications.length===1} key={control.id} data-edit-control={control.id} data-input-invalid={errors.includes(control.id)||undefined} className="space-y-1 text-sm">
   {control.kind!=='tagsExtensions'?<span>{control.kind==='classificationPicker'?workflowClassificationCaption(config,control,plan.workflow.outputs[0]):control.label.zh}{control.required&&(!control.requiredWhen?.length||control.requiredWhen.every(condition=>workflowConditionMatches(condition,workflowConditionContext(plan.workflow,draft.slots,{[plan.workflow.outputs[0].id]:draft.classification}))))?' *':''}</span>:null}
   {control.kind==='classificationPicker'?<select aria-label="工作流分类" className="w-full rounded border px-2 py-1" value={classificationPathKey(draft.classification)} onChange={event=>{const option=classificationOptions.find(o=>o.key===event.target.value);if(!option)return;if(onClassificationChange)onClassificationChange(option.path);else onChange({...draft,classification:option.path,slots:{...draft.slots,[control.slot??control.id]:option.value}});}}>{classificationOptions.map(option=><option key={option.key} value={option.key}>{option.label}</option>)}</select>:control.kind==='tagsExtensions'?<WorkflowAnnotationsInput invalid={errors.includes(control.id)} validationSignal={errorRevision} config={config} workflow={plan.workflow} control={control} value={draft.slots[control.id]} classifications={{[plan.workflow.outputs[0].id]:draft.classification}} onChange={value=>change(control.id,value)}/>:<ControlInput classificationPaths={[draft.classification]} output={plan.workflow.outputs[0]} control={control} value={draft.slots[control.slot??control.id]} config={config} records={records} world={world} fixedGeometry={plan.workflow.outputs[0].geometry.selected} onChange={value=>change(control.slot??control.id,value)}/>}
  </fieldset>;
 return <section aria-label="V3 工作流式编辑" className="config-editor space-y-3 rounded border bg-white p-3">
  <h4 className="font-medium">{plan.workflow.label.zh} · {mode==='create'?'新建':'编辑'}</h4><RequiredFieldsHint/>
  <label className="block text-sm">ID<input aria-label={mode==='create'?'新建要素 ID':'编辑要素 ID'} className="mt-1 w-full rounded border px-2 py-1" value={String(draft.slots.EDIT_ID??'')} onChange={event=>change('EDIT_ID',event.target.value)}/></label>
  <p className="text-xs text-slate-600">{mode==='create'?'使用编辑方案填写新要素；保存时生成创建信息。':'原几何已恢复。保存替换当前图层；未修改字段和创建信息保留。'}</p>
  {/* Legacy editors synthesize this UI control; it is not a persisted layout reference. */}
  {fallbackClassification&&!hideClassification?renderControl(fallbackClassification):null}
  <WorkflowFormLayout validationSignal={errorRevision} step={plan.workflow.steps.find(s=>s.kind==='form')!} errors={errors} controls={controls.filter(control=>(!hideClassification||control.kind!=='classificationPicker')&&workflowControlActive(plan.workflow,control,draft.slots,{[plan.workflow.outputs[0].id]:draft.classification}))} render={renderControl}/>
  <label className="block text-sm">{mode==='create'?'填写人':'编辑人'}<input aria-label="工作流编辑人" className="mt-1 w-full rounded border px-2 py-1" value={editor} onChange={event=>onEditorChange(event.target.value)}/></label>
  {onSave?<FeatureEditActions mode={mode} onCancel={onCancel} onSave={onSave} saveDisabled={saveDisabled}/>:<button type="button" className="rounded border px-3 py-1" onClick={onCancel}>{mode==='create'?'放弃此新建':'放弃要素编辑'}</button>}
 </section>;
}
