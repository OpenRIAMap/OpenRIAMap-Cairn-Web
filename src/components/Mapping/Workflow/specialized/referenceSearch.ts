import {displaySearchTemplate} from '@/configStudio/workflowKernel';
import {expandBindingGroup,resolveExternalReference} from '@/configStudio/externalBindings';
import {classificationPathKey} from '@/configStudio/runtime';
import {recordCategory} from '@/configStudio/multipartPolicy';
import {getByPath} from '@/components/Common/formProjection';
import type {SearchSelectConfig} from '../workflowSearchPool';
import type {WorkflowBridge} from '../WorkflowHost';
export function specializedReferenceSearch(bridge:WorkflowBridge,bindingId:string):SearchSelectConfig{
 const context=bridge.getCaptureContext?.();
 if(!context)return {cacheKey:'missing-reference:'+bindingId,error:'专用引用缺少当前配置。',filter:()=>false,getId:()=>'',getName:()=>'',formatOption:()=>''};
 try{
  const binding=resolveExternalReference(context.config,context.workflow,bindingId),paths=new Set(expandBindingGroup(context.config,binding.classificationGroup).map(classificationPathKey)),idField=binding.search.returnField??'ID';
  const read=(record:Record<string,unknown>,field:string)=>String(getByPath(record,field)??'');
  return {cacheKey:context.workflow.id+':'+context.config.revision+':'+bindingId+':'+JSON.stringify({binding,paths:[...paths]}),worldScope:binding.search.cacheScope,strictFields:true,matcher:binding.search.matcher,minQueryLength:binding.search.minQueryLength??1,maxResults:binding.search.maxResults??30,debounceMs:binding.search.debounceMs??120,formatRecord:record=>displaySearchTemplate(binding.search.displayTemplate??'{{Name}} ({{ID}})',record),filter:record=>paths.has(classificationPathKey(recordCategory(record))),getId:record=>read(record,idField),getName:record=>read(record,'Name')||read(record,idField),formatOption:(name,id)=>(binding.search.displayTemplate??'{Name}（{ID}）').split('{Name}').join(name).split('{ID}').join(id),searchFields:binding.search.queryFields,returnFields:[idField],displayFields:['Name',idField]};
 }catch(error){return {cacheKey:'invalid-reference:'+bindingId,error:error instanceof Error?error.message:String(error),filter:()=>false,getId:()=>'',getName:()=>'',formatOption:()=>''};}
}
