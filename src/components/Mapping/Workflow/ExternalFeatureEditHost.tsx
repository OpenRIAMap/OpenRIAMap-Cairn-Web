import {specializedFormView} from './specialized/registration';
import type {ConfigPackageV3,WorkflowDefinition} from '@/configStudio/types';
import type {TrpExternalEditSession} from '@/configStudio/trpExternalEditing';
import type {MultipartGeometry} from '@/core/geometry/multipartGeometry';
import {validateExternalEditBinding} from '@/configStudio/externalEditRegistry';
import {WorkflowAnnotationsInput} from '@/configStudio/WorkflowAnnotationsInput';
import {workflowCategoryOptions} from '@/configStudio/workflowCategoryOptions';
import {externalRolePaths} from '@/configStudio/externalBindings';
import {pathMatchesScope,classificationPathKey} from '@/configStudio/runtime';
import type {ClassificationPath} from '@/configStudio/types';
import {recordClassification} from '@/configStudio/workflowEditing';
import {CLASSIFICATION_DRAFT_KEY} from '@/components/Common/workflowEditorParser';
import WorkflowStyleEditPanel from '../Editor/WorkflowStyleEditPanel';
import type {WorkflowBridge} from './WorkflowHost';
export type ExternalFeatureEditContext={initialRecord:Record<string,unknown>;featureIdentity:{layerId:number;originalId:string};activeWorld:string;originalGeometry:MultipartGeometry;currentGeometry?:MultipartGeometry;editor:string;onEditorChange:(editor:string)=>void;onUpdate:()=>void;onCancel:()=>void};
export function ExternalFeatureEditHost({config,workflow,session,onDraftChange,context,bridge,hideClassification=false,onClassificationChange}:{hideClassification?:boolean;config:ConfigPackageV3;workflow:WorkflowDefinition;session:TrpExternalEditSession;onDraftChange:(session:TrpExternalEditSession)=>void;context:ExternalFeatureEditContext;bridge:WorkflowBridge;onClassificationChange?:(path:ClassificationPath)=>void}) {
 const errors=validateExternalEditBinding(workflow);if(errors.length)return <p role="alert">{errors.join('\n')}</p>;
 const captureBridge:WorkflowBridge={...bridge,getCaptureContext:()=>({config,workflow})};
 const scope=workflow.editor!.scope??workflow.target!,encoded=String(session.values[CLASSIFICATION_DRAFT_KEY]??''),[kind,skind,skind2]=encoded.split('||'),path={class:scope.class,...(kind?{kind}:{}),...(skind?{skind}:{}),...(skind2?{skind2}:{})};
 const annotationControl=session.annotationPlan.controls[0];
 const options=workflowCategoryOptions(config,externalRolePaths(config,workflow,'tradePoint').filter(p=>pathMatchesScope(p,scope)));
 return <section aria-label="TRP 外部工作流式编辑" className="config-editor rounded border bg-white p-3"><strong>TRP 外部编辑完成品 · v{workflow.external?.version}</strong><p className="mt-1 text-xs text-slate-600">编辑原记录 {context.featureIdentity.originalId}；几何已恢复，保存替换原图层。</p><WorkflowStyleEditPanel view={session.view} values={session.values} unparsedEntries={session.unparsed} onChangeValue={(key,value)=>onDraftChange({...session,values:{...session.values,[key]:value}})} onChangeUnparsedEntries={unparsed=>onDraftChange({...session,unparsed})} bridge={captureBridge} editorId={context.editor} onChangeEditorId={context.onEditorChange} idFirst classificationContent={hideClassification?<p className="text-xs">分类由上方四级选择树指定。</p>:<label className="block text-xs">交易点类型<select aria-label="工作流分类" className="mt-1 w-full rounded border px-2 py-1" disabled={options.length===1} value={classificationPathKey(kind?path:recordClassification(context.initialRecord))} onChange={event=>{const selected=options.find(option=>option.key===event.target.value)?.path;if(!selected)return;if(onClassificationChange)onClassificationChange(selected);else onDraftChange({...session,view:specializedFormView(config,workflow,selected,'tradePoint'),values:{...session.values,[CLASSIFICATION_DRAFT_KEY]:[selected.kind??'',selected.skind??'',selected.skind2??''].join('||')}});}}>{options.map(option=><option key={option.key} value={option.key}>{option.label}</option>)}</select></label>} extraContent={<WorkflowAnnotationsInput config={config} workflow={session.annotationPlan.workflow} control={annotationControl} classifications={{[session.annotationPlan.workflow.outputs[0].id]:path}} value={{[session.annotationPlan.workflow.outputs[0].id]:session.annotations[session.annotationPlan.workflow.outputs[0].id]}} onChange={annotations=>onDraftChange({...session,annotations})}/>} />
 <div className="mt-3 flex justify-between"><button type="button" className="rounded border px-3 py-1" onClick={context.onCancel}>放弃要素编辑</button><button type="button" className="rounded bg-emerald-600 px-3 py-1 text-white" onClick={context.onUpdate}>保存编辑图层</button></div></section>;
}
