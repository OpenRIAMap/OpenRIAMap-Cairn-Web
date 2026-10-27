import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import {singleEntryDrawingFixture} from './fixtures/single-entry-drawing';
import {validateWorkflowDefinition} from '../../src/configStudio/runtime';
import {captureDrawingSnapshot,serializeDrawingCapture,type WorkflowDrawingCapture} from '../../src/configStudio/workflowDrawing';
import {flattenMultipartCoordinates,type MultipartGeometry} from '../../src/core/geometry/multipartGeometry';
import {drawingAllowsParts} from '../../src/configStudio/multipartPolicy';
import type {ConfigPackageV3} from '../../src/configStudio/types';

const base=JSON.parse(fs.readFileSync('public/configuration/releases/e8f258de720cbcc49938b6edac21e5b6178990cf499fc3c782b495d4cf877036/config.json','utf8')) as ConfigPackageV3;
const before=structuredClone(base);
for(const conditional of [false,true]){
  const config=singleEntryDrawingFixture(base,conditional),flow=config.workflows.find(w=>w.id==='v3-bud_building')!;
  const report=validateWorkflowDefinition(flow,config);assert.ok(report.valid,JSON.stringify(report.issues));
  const tasks=flow.steps.filter(step=>step.kind==='geometry');assert.equal(tasks.length,3);
  const paths=Object.fromEntries(flow.outputs.map(output=>[output.id,{class:'BUD',kind:'NOM'}]));
  assert.equal(drawingAllowsParts(config,flow,tasks[0],paths),true);assert.equal(drawingAllowsParts(config,flow,tasks[2],paths),false);
  const restricted=structuredClone(config);
  for(const node of restricted.nodes)if(node.path.class==='BUD'&&node.path.kind==='SPE'&&node.geometryProfiles.Polygon)node.geometryProfiles.Polygon.allowMultipleParts=false;
  const consumers={...paths,[flow.outputs[1].id]:{class:'BUD',kind:'SPE'}};
  assert.equal(drawingAllowsParts(restricted,flow,tasks[0],consumers),true,'An independent output is not a geometry consumer.');
  // Exercise the existing policy predicate for a geometry binding. Structural
  // workflow validation remains separate from this consumer-policy unit case.
  const shared={...tasks[0],drawing:{...tasks[0].drawing,bindings:[{outputId:flow.outputs[1].id,target:'CoordG',value:'geometry' as const}]}};
  assert.equal(drawingAllowsParts(restricted,flow,shared,consumers),false,'Every actual geometry consumer must allow multiple parts.');
  const p=(x:number,z:number)=>({x,y:64,z});
  const geometry:MultipartGeometry={type:'Polygon',parts:[[[p(0,0),p(70,0),p(70,70),p(0,70)],[p(10,10),p(20,10),p(20,20)]],[[p(100,0),p(150,0),p(150,50),p(100,50)]]]};
  const whole:WorkflowDrawingCapture={geometry,coordinates:flattenMultipartCoordinates(geometry)};
  const auxiliary:WorkflowDrawingCapture={geometry:{type:'Point',parts:[p(4,5)]},coordinates:[p(4,5)],point:p(4,5)};
  let previous={};
  for(let i=0;i<50;i++){
    const result=captureDrawingSnapshot(flow,{AUDIT_SECOND:true},previous,(id)=>id===tasks[2].id?auxiliary:whole);
    for(const task of tasks.slice(0,2))assert.deepEqual(serializeDrawingCapture(task,result.captures[task.outputId!],result.slots).geometry,geometry);
    previous=result.captures;
  }
  const disabled=captureDrawingSnapshot(flow,{AUDIT_SECOND:false},previous,id=>id===tasks[2].id?auxiliary:whole);
  assert.deepEqual(disabled.slots.SINGLE_ENTRY_AUX,p(4,5));
}
assert.deepEqual(base,before,'A regression fixture cannot rewrite the immutable formal package.');
const runner=fs.readFileSync('src/configStudio/V3WorkflowRunner.tsx','utf8');
const source=ts.createSourceFile('runner.tsx',runner,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const scan=(node:ts.Node)=>{
  if(ts.isJsxElement(node)&&node.openingElement.tagName.getText(source)==='button'){
    const label=node.children.filter(ts.isJsxText).map(text=>text.text).join('').trim();
    assert.ok(!['添加部件','添加孔环','采用当前绘制'].includes(label),'Duplicate drawing entrance: '+label);
  }
  ts.forEachChild(node,scan);
};scan(source);
assert.ok(!runner.includes('newPart')&&!runner.includes('mergeDrawingCapture')&&!runner.includes('auxiliaryPoints'));
console.log('single-entry drawing: valid multi-output/auxiliary/conditional fixtures, actual classification policy, 50 repeated complete captures and no duplicate structure entrances: OK');
