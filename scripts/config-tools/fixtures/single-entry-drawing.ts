import {syncWorkflowClassification} from '../../../src/configStudio/systemClassification';
import type {ConfigPackageV3,WorkflowStep} from '../../../src/configStudio/types';

/** Isolated local regression definition; never a production config/default. */
export function singleEntryDrawingFixture(base:ConfigPackageV3,conditional=false):ConfigPackageV3 {
  const config=structuredClone(base),index=config.workflows.findIndex(w=>w.id==='v3-bud_building'),flow=config.workflows[index];
  flow.editor={...flow.editor,enabled:false};
  const first=flow.outputs[0],second=structuredClone(first);
  second.id=first.id+'-second';
  const id=second.assignments.find(row=>row.target==='ID')!;id.expression+=' + "_SECOND"';
  const when={token:'AUDIT_SECOND',operator:'equals' as const,value:true};
  if(conditional){
    second.when=when;
    flow.steps.find(step=>step.kind==='form')!.controls!.push({id:'audit-second-enabled',slot:'AUDIT_SECOND',kind:'toggle',columns:1,label:{zh:'第二输出',en:''},defaultValue:true});
  }
  flow.outputs.push(second);
  const original=flow.steps.find(step=>step.kind==='geometry')!,drawing=structuredClone(original);
  drawing.id=original.id+'-second';drawing.outputId=second.id;drawing.label={zh:'第二个面',en:''};
  if(conditional)drawing.when=when;
  const auxiliary:WorkflowStep={id:'single-entry-auxiliary',kind:'geometry',geometryRole:'auxiliary',geometry:['Point'],label:{zh:'辅助坐标',en:''},drawing:{captureSlot:'SINGLE_ENTRY_AUX',returnFormat:'pointObject',multiple:false,enabledFromThisPage:true,allowBack:true,keepDrawingWhenBack:true,bindings:[]}};
  flow.steps.push(drawing,auxiliary);
  config.workflows[index]=syncWorkflowClassification(config,flow);
  return config;
}
