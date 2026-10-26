import {NativeWorkflowEditPanel} from '../Workflow/NativeWorkflowEditPanel';
import {compileWorkflowEditPlan,type WorkflowEditDraft,type WorkflowEditPlan} from '@/configStudio/workflowEditing';
import {initializeFullEditor,fullEditorWorkflow,prepareFullEditorCreate} from '@/configStudio/fullEditor';
import {externalRolePaths} from '@/configStudio/externalBindings';
import {EXTERNAL_ROLES} from '@/configStudio/externalCapabilities';
import type {ConfigPackageV3,ExternalRole} from '@/configStudio/types';
import type {MultipartGeometry} from '@/core/geometry/multipartGeometry';
export type DraftBundle={config:ConfigPackageV3;plan:WorkflowEditPlan;draft:WorkflowEditDraft;role:ExternalRole};
export function createMergeDraft(config:ConfigPackageV3,role:ExternalRole):DraftBundle{
 const candidates=config.workflows.filter(workflow=>workflow.mode==='external'&&workflow.external?.purpose!=='edit').flatMap(workflow=>{try{return externalRolePaths(config,workflow,role).map(path=>({workflow,path}));}catch{return [];}});
 if(candidates.length!==1)throw Error(EXTERNAL_ROLES[role].label+'需要唯一、明确的专用采集角色绑定；不能自动采用首项。');
 const snapshot=structuredClone(config),path=candidates[0].path,workflow=fullEditorWorkflow(snapshot,path,EXTERNAL_ROLES[role].geometry);
 if(workflow.mode!=='composed')throw Error('此合并角色需要可用的标准编辑表单。');
 const plan=compileWorkflowEditPlan(workflow,snapshot);
 return {config:snapshot,plan,draft:initializeFullEditor(snapshot,plan,path),role};
}
export function prepareMergeDraft(bundle:DraftBundle,geometry:MultipartGeometry,world:string,actor:string,others:Record<string,unknown>[]){
 if(bundle.role==='stationBuilding'&&geometry.parts.length>1)throw Error('车站建筑仅允许单部件；完整几何不能截断。');
 return prepareFullEditorCreate(bundle.config,bundle.plan.workflow,bundle.draft,geometry,world,actor,others);
}
export type MergeFormProps={config:ConfigPackageV3;world:string;editor:string;onEditorChange:(value:string)=>void;records:Record<string,unknown>[]};
export function NativeMergeForm({bundle,onChange,onRemove,world,editor,onEditorChange,records}:MergeFormProps&{bundle:DraftBundle;onChange:(bundle:DraftBundle)=>void;onRemove:()=>void}){
 return <NativeWorkflowEditPanel config={bundle.config} plan={bundle.plan} draft={bundle.draft} world={world} records={records} editor={editor} onEditorChange={onEditorChange} onChange={draft=>onChange({...bundle,draft})} onCancel={onRemove} mode="create" hideClassification/>;
}
