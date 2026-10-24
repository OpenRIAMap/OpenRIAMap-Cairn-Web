import type {ClassificationPath,ConfigValidationIssue,FieldDefinition,WorkflowDefinition,WorkflowValueCondition} from './types';
import {parseWorkflowExpression,workflowExpressionTokens,evaluateWorkflowExpression,type WorkflowExpression} from './workflowExpression';
import {workflowConditionsCover} from './workflowConditionCoverage';
import {workflowCandidateConstraint,workflowConditionsDisjoint} from './workflowPreflight';
import {emptyFieldValue,fieldValueErrors} from './fieldValueValidation';

type Conditions=Array<WorkflowValueCondition|undefined>;
type Source={possible:boolean;guaranteed:Conditions[];constant?:unknown;known?:boolean;token?:string;properties?:Record<string,Source>;mayEmptyArray?:boolean};
type Supply=Source&{target:string;path:string;when:Conditions};

/** Creation coverage is candidate-specific; dedicated editing retains originals.
 * Constants and required direct inputs can prove coverage. Unknown values cannot. */
export function validateWorkflowSupplies(workflow:WorkflowDefinition,fields:FieldDefinition[],candidate:{outputId:string;classification:ClassificationPath}):ConfigValidationIssue[]{
  const output=workflow.outputs.find(output=>output.id===candidate.outputId)!;
  if(workflow.mode!=='composed'||workflow.editor?.dedicated)return [];
  if(!fields.some(field=>field.key==='ID'))fields=[...fields,{fieldId:'system-ID',key:'ID',type:'string',cardinality:'single',input:'text',labels:{zh:'ID',en:''},description:{zh:'',en:''},required:true}];
  const issues:ConfigValidationIssue[]=[],base=`workflows/${workflow.id}/outputs/${output.id}`;
  const add=(code:string,path:string,message:string,severity:'error'|'warning'='error')=>issues.push({code,path,message,severity});
  const constraint=workflowCandidateConstraint(candidate.classification,workflow.outputs.indexOf(output));
  const constants:Record<string,unknown>={Class:candidate.classification.class,Kind:candidate.classification.kind??'',Skind:candidate.classification.skind??'',Skind2:candidate.classification.skind2??''};
  for(const [key,value]of Object.entries({...constants}))constants[`${key}_${workflow.outputs.indexOf(output)+1}`]=value;
  const controls=workflow.steps.flatMap(step=>(step.controls??[]).map(control=>({step,control})));
  const drawings=workflow.steps.filter(step=>step.kind==='geometry');
  const inputConditionKnown=(condition?:WorkflowValueCondition):boolean=>!condition||!(/^(?:ID|Class|Kind|Skind|Skind2|Creator|WorldPrefix)(?:_\d+)?$/.test(condition.token))&&(condition.all??condition.any??[]).every(inputConditionKnown);
  const source=(node:WorkflowExpression):Source=>{
    const tokens=workflowExpressionTokens(node);
    if(tokens.every(token=>Object.prototype.hasOwnProperty.call(constants,token))){try{const value=evaluateWorkflowExpressionNode(node,constants);return {possible:!emptyFieldValue(value),guaranteed:emptyFieldValue(value)?[]:[[]],known:true,constant:value,mayEmptyArray:Array.isArray(value)&&!value.length};}catch{return {possible:false,guaranteed:[]};}}
    if(node.kind==='token'){
      const own=controls.find(item=>item.control.slot===node.name);
      if(own){const {step,control}=own,conditions=[step.when,control.when,...control.requiredWhen??[]];return {possible:true,token:node.name,guaranteed:control.required&&conditions.every(inputConditionKnown)?[conditions]:[],mayEmptyArray:['group','json'].includes(control.kind)};}
      for(const step of drawings){
        const parent=workflow.outputs.find(item=>item.id===step.outputId)?.when;
        const slots=[step.drawing?.captureSlot,step.drawing?.pointSlot].filter(Boolean) as string[];
        if(slots.some(slot=>[slot,`${slot}_X`,`${slot}_Y`,`${slot}_Z`].includes(node.name)))return {possible:true,guaranteed:[[step.when,parent]]};
      }
      return {possible:true,token:node.name,guaranteed:['World','WorldPrefix'].includes(node.name)?[[]]:node.name==='Creator'&&workflow.steps.some(step=>step.kind==='actor')&&workflow.actor?.required!==false?[[]]:[]};
    }
    if(node.kind==='concat'||node.kind==='join'){
      const parts=node.kind==='concat'?node.parts:node.args.slice(1),sources=parts.map(source);
      return {possible:sources.some(item=>item.possible),guaranteed:sources.flatMap(item=>item.guaranteed)};
    }
    if(node.kind==='call'){
      if(node.name==='coalesce'){
        const sources=node.args.map(source),guaranteed:Conditions[]=[];let blocked=false;
        // coalesce skips null/blank text, but accepts []. A later fallback
        // cannot prove a required value when an earlier argument can be [].
        for(const item of sources){if(!blocked)guaranteed.push(...item.guaranteed);if(item.mayEmptyArray)blocked=true;}
        return {possible:sources.some(item=>item.possible),guaranteed,mayEmptyArray:blocked};
      }
      if(['trim','text','upper','lower'].includes(node.name)){const inner=source(node.args[0]);return {possible:inner.possible,guaranteed:inner.guaranteed};}
      return {possible:true,guaranteed:[[]],...(node.name==='point'?{properties:Object.fromEntries(['x','y','z'].map(axis=>[axis,{possible:true,guaranteed:[[]]}]))}:{})}; // These calls either return a value or reject execution.
    }
    return {possible:true,guaranteed:[]};
  };
  const supplies:Supply[]=[];
  for(const row of output.assignments){try{supplies.push({...source(parseWorkflowExpression(row.expression)),target:row.target,path:base+'/assignments/'+row.id,when:[row.when]});}catch{/* Syntax is diagnosed by the normal expression validator. */}}
  for(const step of drawings){
    const when=[step.when,workflow.outputs.find(item=>item.id===step.outputId)?.when];
    for(const [index,binding]of (step.drawing?.bindings??[]).entries())if(binding.outputId===output.id){
      const height=step.drawing?.heightSlot&&controls.find(item=>item.control.slot===step.drawing!.heightSlot)?.control;
      supplies.push({target:binding.target,path:`workflows/${workflow.id}/steps/${step.id}/drawing/bindings/${index}`,when,possible:true,guaranteed:binding.value==='geometry'?[[]]:height&&height.required?[[...height.requiredWhen??[]]]:[],...(binding.value==='geometry'&&step.drawing?.returnFormat==='pointObject'?{properties:Object.fromEntries(['x','y','z'].map(axis=>[axis,{possible:true,guaranteed:[[]]}]))}:{})});
    }
    if(step.outputId===output.id&&step.geometryRole!=='auxiliary')supplies.push({target:output.geometry.selected==='Point'?'CoordP':output.geometry.selected==='LineString'?'CoordL':'CoordG',path:`workflows/${workflow.id}/steps/${step.id}`,when,possible:true,guaranteed:[[]]});
  }
  const generated:Record<string,unknown>={Class:candidate.classification.class,Kind:candidate.classification.kind,SKind:candidate.classification.skind,SKind2:candidate.classification.skind2,Type:output.geometry.selected==='Point'?'Points':output.geometry.selected==='LineString'?'Polyline':'Polygon'};
  for(const [target,value]of Object.entries(generated))supplies.push({target,path:base,when:[],known:true,constant:value,possible:!emptyFieldValue(value),guaranteed:emptyFieldValue(value)?[]:[[]]});
  for(const target of ['World','CreateTime'])supplies.push({target,path:base,when:[],possible:true,guaranteed:[[]]});
  supplies.push({target:'CreateBy',path:base,when:[],possible:true,guaranteed:workflow.steps.some(step=>step.kind==='actor')&&workflow.actor?.required!==false?[[]]:[]});
  const domains:Conditions=[];
  for(const {step,control}of controls)if(control.slot&&control.required&&!control.requiredWhen?.length&&!step.when&&!control.when&&control.kind==='select'&&control.options?.length){
    const values=control.options.map(item=>control.optionValueType==='number'?Number(item.value):control.optionValueType==='boolean'?item.value==='true':item.value);
    domains.push({token:control.slot,operator:'in',values});
  }
  const context=[constraint,output.when,...domains];
  const suppliesFor=(target:string):Supply[]=>supplies.flatMap(item=>{
      if(workflowConditionsDisjoint(context,item.when)===true)return [];
      if(item.target===target)return [item];
      if(!target.startsWith(item.target+'.'))return [];
      let child:Source=item;
      for(const key of target.slice(item.target.length+1).split('.')){
        if(child.known){const value=child.constant&&typeof child.constant==='object'?(child.constant as Record<string,unknown>)[key]:undefined;child={known:true,constant:value,possible:!emptyFieldValue(value),guaranteed:emptyFieldValue(value)?[]:[[]]};}
        else child=child.properties?.[key]??{possible:true,guaranteed:[]};
      }
      return [{...item,...child,target}];
    });
  for(const field of fields){
    const writes=suppliesFor(field.key);
    const namespace=field.key.startsWith('tags.')?'tags':field.key.startsWith('extensions.')?'extensions':undefined;
    if(namespace)for(const {step,control}of controls.filter(item=>item.control.kind==='tagsExtensions'&&item.control.tagsExtensions?.[namespace==='tags'?'tagsEnabled':'extensionsEnabled']!==false))writes.push({target:field.key,path:`workflows/${workflow.id}/steps/${step.id}/controls/${control.id}`,when:[step.when,control.when],possible:true,guaranteed:[]});
    // A field default only fills undefined, never an explicitly written blank.
    const possible=writes.filter(item=>item.possible).map(item=>item.when);
    const guaranteed=writes.flatMap(item=>item.guaranteed.map(way=>[...item.when,...way]));
    let defaultValue=field.defaultValue;
    if(defaultValue===undefined){
      const parent=fields.filter(parent=>field.key.startsWith(parent.key+'.')&&parent.defaultValue!==undefined).sort((a,b)=>b.key.length-a.key.length)[0];
      if(parent){defaultValue=parent.defaultValue;for(const key of field.key.slice(parent.key.length+1).split('.'))defaultValue=defaultValue&&typeof defaultValue==='object'?(defaultValue as Record<string,unknown>)[key]:undefined;}
    }
    if(defaultValue!==undefined&&!emptyFieldValue(defaultValue)&&!fieldValueErrors(field,defaultValue).length){
      // No declared writer means the field factory supplies this default.
      if(!writes.length){possible.push([]);guaranteed.push([]);}
      else if(!writes.some(item=>item.known&&!item.possible))possible.push([]);
    }
    const requirements:Array<{when:Conditions;unknown?:boolean}>=field.required?[{when:[]}]:[];
    for(const condition of field.requiredWhen??[]){
      if(condition.kind==='always'){requirements.push({when:[]});continue;}
      if(!('field' in condition))continue;
      const driver=suppliesFor(condition.field);
      let token:string|undefined,value:unknown,known=false;
      if(driver.length===1&&workflowConditionsCover(context,[driver[0].when])===true){
        token=driver[0].token;known=Boolean(driver[0].known);value=driver[0].constant;
      }else if(!driver.length){known=true;value=fields.find(item=>item.key===condition.field)?.defaultValue;}
      if(known){
        const active=condition.kind==='fieldPresent'?!emptyFieldValue(value)===condition.present:condition.kind==='fieldEquals'?String(value??'')===condition.value:condition.kind==='fieldIn'?condition.values.includes(String(value??'')):false;
        if(active)requirements.push({when:[]});continue;
      }
      if(token){
        const control=controls.find(item=>item.control.slot===token)?.control;
        if(control&&['group','json'].includes(control.kind)){requirements.push({when:[],unknown:true});continue;}
        const typed=(value:string):string|number|boolean|undefined=>{
          const parsed=control?.kind==='number'||control?.optionValueType==='number'?Number(value):control?.kind==='toggle'||control?.optionValueType==='boolean'?value==='true':value;
          return String(parsed)===value?parsed:undefined;
        };
        if(condition.kind==='fieldPresent')requirements.push({when:[{token,operator:condition.present?'present':'empty'}]});
        else if(condition.kind==='fieldEquals'){
          const driverField=fields.find(item=>item.key===condition.field);
          if(condition.value===''&&driverField?.emptyValue!=='preserve')requirements.push({when:[{token,operator:'empty'}]});
          else {const value=typed(condition.value);if(value!==undefined)requirements.push({when:[{token,operator:'equals',value}]});}
        }else if(condition.kind==='fieldIn'){
          const values=condition.values.map(typed).filter((value):value is string|number|boolean=>value!==undefined);
          const driverField=fields.find(item=>item.key===condition.field);
          const choices:WorkflowValueCondition[]=[];
          if(values.length)choices.push({token,operator:'in',values});
          if(condition.values.includes('')&&driverField?.emptyValue!=='preserve')choices.push({token,operator:'empty'});
          if(choices.length)requirements.push({when:[{token:'',operator:'present',any:choices}]});
        }
      }else requirements.push({when:[],unknown:true});
    }
    for(const requirement of requirements){
      const requiredContext=[...context,...requirement.when];
      if(workflowConditionsCover(requiredContext,guaranteed)===true)continue;
      const possibleCoverage=workflowConditionsCover(requiredContext,possible);
      const mutableCondition=(condition?:WorkflowValueCondition):boolean=>Boolean(condition&&(/^ID(?:_\d+)?$/.test(condition.token)||(condition.all??condition.any??[]).some(mutableCondition)));
      const mutable=field.key!=='ID'&&writes.some(write=>write.when.some(mutableCondition));
      if(possibleCoverage===false&&!requirement.unknown&&!mutable)add('workflow-required-field-unsupplied',base+'/required/'+field.key,`${field.key} 在此分类的可达输出中存在必填但没有有效供值的情况。请补充组装、绘制绑定或合法默认值。`);
      else add('workflow-required-field-coverage-unknown',base+'/required/'+field.key,`${field.key} 的必填供值无法静态确认${requirement.unknown?'（条件依赖动态组装结果）':mutable?'（条件依赖组装中的 ID）':''}；请试运行核对，实际保存仍会严格检查。`,'warning');
      break;
    }
  }
  return issues;
}

function evaluateWorkflowExpressionNode(node:WorkflowExpression,system:Record<string,unknown>):unknown{
  // The evaluator accepts text; all-constant trees are serialized without executing JS.
  const text=(value:WorkflowExpression):string=>value.kind==='literal'?JSON.stringify(value.value):value.kind==='token'?value.name:value.kind==='concat'?value.parts.map(text).join('+'):value.kind==='join'?`join(${value.args.map(text).join(',')})`:`${value.name}(${value.args.map(text).join(',')})`;
  return evaluateWorkflowExpression(text(node),{},system);
}
