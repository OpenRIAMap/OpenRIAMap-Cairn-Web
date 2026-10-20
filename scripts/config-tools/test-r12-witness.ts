import assert from 'node:assert/strict';
import { nextNumber, solveConditionWitness } from '../../src/configStudio/conditionWitness';
import { matchesRenderFields } from '../../src/configStudio/renderRuleConditions';
import type { FieldDefinition, RenderFieldCondition, RenderFieldGroup } from '../../src/configStudio/types';
const fields = [
  { fieldId:'number',key:'x',type:'number',cardinality:'single',required:false,labels:{zh:'数字',en:''},inheritance:'overridable' },
  { fieldId:'boolean',key:'flag',type:'boolean',cardinality:'single',required:false,labels:{zh:'开关',en:''},inheritance:'overridable' },
  { fieldId:'status',key:'status',type:'string',cardinality:'single',required:false,labels:{zh:'状态',en:''},inheritance:'overridable' },
] as FieldDefinition[];
const compare = (field:string,operator:Extract<RenderFieldCondition,{kind:'fieldCompare'}>['operator'],value?:number|string|boolean):RenderFieldCondition=>({kind:'fieldCompare',field,operator,...(value!==undefined?{value}:{})});
const group=(...items:RenderFieldCondition[]):RenderFieldGroup=>({op:'all',items});
function witness(g:RenderFieldGroup,pins:Array<{field:string;value:string|number|boolean}>=[]){const r=solveConditionWitness([{group:g}],fields,pins);assert.equal(r.status,'satisfiable');if(r.status!=='satisfiable')throw Error(r.reason);assert(matchesRenderFields(g,key=>r.values[key]));return r.values;}
assert.equal(witness(group(compare('x','ge',3),compare('x','le',8))).x,3);
assert.equal(witness(group(compare('x','ge',-5))).x,-5);
const above=nextNumber(1,1);
assert.equal(witness(group(compare('x','gt',1),compare('x','le',above))).x,above);
assert.equal(solveConditionWitness([{group:group(compare('x','gt',1),compare('x','lt',above))}],fields).status,'unsatisfiable');
assert.equal(witness(group(compare('x','lt',5))).x,0);
assert.equal(witness(group(compare('flag','eq',false))).flag,false);
assert.equal(witness(group({kind:'fieldEquals',field:'flag',value:'false'})).flag,false);
assert.equal(witness(group(compare('x','ge',3)),[{field:'x',value:4}]).x,4);
assert.equal(solveConditionWitness([{group:group(compare('x','ge',3))}],fields,[{field:'x',value:1}]).status,'unsatisfiable');
const either:RenderFieldGroup={op:'any',items:[compare('status','eq','a'),compare('status','eq','b')]};
assert.equal(witness(either,[{field:'status',value:'b'}]).status,'b');
const not:RenderFieldGroup={op:'not',items:[group(compare('x','ge',10))]};assert.equal(witness(not).x,undefined,'absence is the minimal legal NOT witness');
assert.equal(witness({op:'all',items:[not,compare('x','present')]}).x,0);
assert.equal(witness(group(compare('flag','present'),compare('flag','eq',false))).flag,false);
const empty=witness(group(compare('x','empty')));assert(Object.hasOwn(empty,'x'));assert.equal(empty.x,undefined);
assert.equal(solveConditionWitness([{group:group(compare('x','gt',Number.MAX_VALUE))}],fields).status,'unsatisfiable');
assert.equal(solveConditionWitness([{group:group(compare('x','eq','0'))}],fields).status,'unsatisfiable','wrong seed/literal type cannot fake numeric data');
assert.equal(solveConditionWitness([{group:group(compare('x','eq',0),compare('x.child','present'))}],fields).status,'unknown');
const terms=Array.from({length:30},(_,i)=>compare('x','eq',i));
const big:RenderFieldGroup={op:'all',items:[{op:'any',items:terms},{op:'any',items:terms}]};
assert.equal(solveConditionWitness([{group:big}],fields,[{field:'x',value:29}]).status,'unknown','truncated search cannot prove impossible');
console.log('r12 witness: exact scalar partitions, IEEE boundaries, boolean/legacy values, OR/NOT, pins, safe paths and bounded unknown passed.');
