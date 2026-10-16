import type { ClassificationPath, ConfigValidationIssue, FieldDefinition, WorkflowControl, WorkflowDefinition, WorkflowGroupField, WorkflowValueCondition } from './types';
import { evaluateWorkflowExpression, parseWorkflowExpression, workflowExpressionTokens, WORKFLOW_SYSTEM_TOKENS, type WorkflowExpression } from './workflowExpression';

type Scalar = string | number | boolean;
type Clause = WorkflowValueCondition[];
const CONDITION_BUDGET = 128;
/** Bounded DNF, using precisely the runtime's empty/present and strict scalar equality. */
function clauses(condition?: WorkflowValueCondition, depth = 0, budget={remaining:2048}, unstable=new Set<string>()): Clause[] {
  if (depth > 32 || --budget.remaining<0) throw new Error('condition budget');
  if (!condition) return [[]];
  if (condition.any) {
    const result = condition.any.flatMap(child => clauses(child, depth + 1,budget,unstable));
    if (result.length > CONDITION_BUDGET) throw new Error('condition budget');
    return result;
  }
  if (condition.all) return condition.all.reduce<Clause[]>((result, child) => {
    const next = clauses(child, depth + 1,budget,unstable);
    if (result.length * next.length > CONDITION_BUDGET) throw new Error('condition budget');
    return result.flatMap(left => next.map(right => [...left, ...right]));
  }, [[]]);
  return unstable.has(condition.token)?[[]]:[[condition]];
}
const isEmpty = (value: unknown) => value == null || typeof value === 'string' && !value.trim();
function impossible(clause: Clause): boolean {
  const constraints = new Map<string, { presence?: boolean; values?: Scalar[] }>();
  for (const item of clause) {
    const prior = constraints.get(item.token) ?? {};
    const presence = item.operator === 'empty' ? false : item.operator === 'present' ? true : undefined;
    if (presence !== undefined) {
      if (prior.presence !== undefined && prior.presence !== presence) return true;
      prior.presence = presence;
    } else {
      const values = item.operator === 'equals' && item.value !== undefined ? [item.value] : item.operator === 'in' ? item.values : undefined;
      if (!values) throw new Error('unknown condition');
      prior.values = prior.values ? prior.values.filter(value => values.includes(value)) : values;
    }
    if (prior.values && !prior.values.some(value => prior.presence === undefined || !isEmpty(value) === prior.presence)) return true;
    constraints.set(item.token, prior);
  }
  return false;
}
export function workflowConditionsDisjoint(left: Array<WorkflowValueCondition | undefined>, right: Array<WorkflowValueCondition | undefined>,unstable=new Set<string>()): boolean | undefined {
  try {
    const items = [...left, ...right].filter(Boolean) as WorkflowValueCondition[];
    const combined = clauses({ all: items } as WorkflowValueCondition,0,{remaining:2048},unstable);
    return combined.every(impossible);
  } catch { return undefined; }
}

type Kind = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null' | 'unknown';
type Shape = { kinds: Kind[]; item?: Shape; constants?: unknown[] };
const shape = (...kinds: Kind[]): Shape => ({ kinds });
function constant(value: unknown): Shape {
  const result = shape(value == null ? 'null' : Array.isArray(value) ? 'array' : typeof value as Kind);
  result.constants = [value];
  if (Array.isArray(value)) result.item = value.length ? union(value.map(constant)) : shape('unknown');
  return result;
}
function union(values: Shape[]): Shape {
  return { kinds: [...new Set(values.flatMap(value => value.kinds))],
    ...(values.every(value => value.constants) ? { constants: values.flatMap(value => value.constants!) } : {}),
    ...(values.some(value => value.item) ? { item: union(values.flatMap(value => value.item ? [value.item] : [])) } : {}) };
}
function fieldShape(field?: FieldDefinition): Shape {
  if (!field) return shape('unknown');
  const type = field.type === 'enum' ? field.optionValueType ?? 'string' : field.type === 'reference' ? 'string' : field.type;
  const result = type === 'json' ? field.coordinateFormat ? shape(field.coordinateFormat==='pointObject'?'object':'array') : shape('unknown') : shape(type as Kind);
  if (field.cardinality === 'multiple') return { kinds: ['array'], item: result };
  return result;
}

/** Pure AST analysis shared by module, package, export and activation validation.
 * Unknown JSON remains a warning; known incompatible values cannot be enabled. */
export function validateWorkflowWrites(workflow: WorkflowDefinition, fields: (path: ClassificationPath) => FieldDefinition[]): ConfigValidationIssue[] {
  const issues: ConfigValidationIssue[] = [];
  const base = `workflows/${workflow.id}`;
  const add = (code: string, path: string, message: string, severity: 'error' | 'warning' = 'error') => issues.push({ severity, code, path, message });
  const tokens = new Map<string, Shape>();
  for (const token of WORKFLOW_SYSTEM_TOKENS) {
    tokens.set(token, shape('string'));
    workflow.outputs.forEach((_, index) => tokens.set(`${token}_${index + 1}`, shape('string')));
  }
  const controlShape = (control: WorkflowControl | WorkflowGroupField): Shape => {
    if (control.kind === 'group' && 'group' in control) return { kinds: ['array'], item: control.group?.storage === 'scalar' ? controlShape(control.group.itemFields[0]) : shape('object') };
    if (control.kind === 'json' || control.kind === 'runtimeValue' || control.kind === 'component') return shape('unknown');
    if (control.kind === 'select') {
      const type = control.optionValueType ?? 'string';
      const options = control.options?.map(option => type === 'number' ? Number(option.value) : type === 'boolean' ? option.value === 'true' : option.value);
      return { kinds: [type], ...(options?.length ? { constants: options } : {}) };
    }
    if (control.valueNormalization === 'trim' || control.valueNormalization === 'abbr') return shape('string');
    if (control.kind === 'number' || control.valueNormalization === 'number') return shape('number');
    if (control.kind === 'toggle') return shape('boolean');
    if ((control.kind === 'featureSearch' || control.kind === 'coarseSearch') && control.search) return fieldShape(fields(control.search.target).find(field => field.key === control.search!.returnField));
    return shape('string');
  };
  for (const step of workflow.steps) {
    for (const control of step.controls ?? []) {
      for(const leaf of [control,...(control.group?.itemFields??[])])if(leaf.kind==='toggle'&&leaf.valueNormalization&&leaf.valueNormalization!=='none')add('workflow-value-normalization-kind-conflict',`${base}/steps/${step.id}/controls/${control.id}`,'布尔控件应保存布尔值，不能残留文字或数值规范化。需要数值时请在组装表达式中显式转换。');
      if (control.slot) tokens.set(control.slot, controlShape(control));
    }
    for (const slot of [step.drawing?.pointSlot, step.drawing?.captureSlot, ...(step.drawing?.auxiliaryPoints ?? []).map(point => point.slot)]) if (slot) {
      tokens.set(slot, step.drawing?.returnFormat === 'pointObject' ? shape('object') : { kinds: ['array'], item: shape('array', 'number') });
      for (const dimension of ['X', 'Y', 'Z', 'HEIGHT']) tokens.set(`${slot}_${dimension}`, shape('number'));
    }
  }
  const infer = (node: WorkflowExpression): Shape => {
    if (node.kind === 'literal') return constant(node.value);
    if (node.kind === 'token') return tokens.get(node.name) ?? shape('unknown');
    if (node.kind === 'concat' || node.kind === 'join') return shape('string');
    if (['text', 'trim', 'upper', 'lower'].includes(node.name)) return shape('string');
    if (node.name === 'coalesce') {const parts=node.args.map(infer).filter(part=>!part.constants?.every(isEmpty));return parts.length?union(parts):shape('null');}
    if (node.name === 'point') return shape('object');
    return shape('number');
  };
  for (const output of workflow.outputs) {
    type Writer = { target: string; path: string; conditions: Array<WorkflowValueCondition | undefined> };
    const writers: Writer[] = [];
    const targetFields = fields(output.classification);
    for (const assignment of output.assignments) {
      const path = `${base}/outputs/${output.id}/assignments/${assignment.id}`;
      writers.push({ target: assignment.target, path, conditions: [output.when, assignment.when] });
      const field = targetFields.find(field => field.key === assignment.target);
      try {
        const ast = parseWorkflowExpression(assignment.expression);
        const actual = workflowExpressionTokens(ast).length ? infer(ast) : constant(evaluateWorkflowExpression(assignment.expression, {}, {}));
        if (!field || field.type === 'json' && field.cardinality==='single' && !field.coordinateFormat) continue;
        // Optional empties retain the existing finalizer's omit/preserve rules.
        if (actual.constants?.every(isEmpty)) continue;
        const expected = fieldShape(field);
        const actualKinds = actual.kinds.filter(kind => kind !== 'null');
        const incompatible = actualKinds.some(kind => kind !== 'unknown' && !expected.kinds.includes(kind)) ||
          actual.kinds.includes('array') && expected.item && !expected.item.kinds.includes('unknown') && actual.item?.kinds.some(kind => kind !== 'unknown' && !expected.item!.kinds.includes(kind));
        if (incompatible) add('workflow-expression-type-conflict', path, `表达式返回 ${actual.kinds.join('/')}，目标 ${field.key} 需要 ${field.cardinality === 'multiple' ? '多值 ' : '单值 '}${field.type}。请调整表达式或控件保存类型。`);
        else if (actualKinds.includes('unknown') || actual.item?.kinds.includes('unknown')) add('workflow-expression-type-unknown', path, `目标 ${field.key} 的动态结果类型无法静态确定，请使用试运行核对；提交前仍会检查实际记录。`, 'warning');
        const constants=actual.constants??(actual.kinds.length===1&&actual.kinds[0]==='array'?actual.item?.constants:undefined);
        if (field.type === 'enum' && constants) {
          const allowed = new Set(field.options?.map(option => field.optionValueType === 'number' ? Number(option.value) : field.optionValueType === 'boolean' ? option.value === 'true' : option.value));
          if (constants.flatMap(value => Array.isArray(value) ? value : [value]).some(value => !isEmpty(value) && !allowed.has(value as Scalar))) add('workflow-expression-enum-conflict', path, `表达式包含目标 ${field.key} 对照表不允许的保存值。`);
        }
      } catch (error) {
        // Parse failures are already reported by the syntax validator; constant
        // evaluation failures (division by zero, number("bad"), etc.) are not.
        try { parseWorkflowExpression(assignment.expression); add('workflow-expression-result-invalid', path, error instanceof Error ? error.message : '表达式无法产生有效结果。'); } catch { /* syntax diagnostic already present */ }
      }
    }
    for (const step of workflow.steps) for (const [index, binding] of (step.drawing?.bindings ?? []).entries()) if (binding.outputId === output.id) writers.push({ target: binding.target, path: `${base}/steps/${step.id}/drawing/bindings/${index}`, conditions: [output.when, step.when, workflow.outputs.find(item => item.id === step.outputId)?.when] });
    const indexed=new Map<string,Writer[]>();
    for(const writer of writers)indexed.set(writer.target,[...(indexed.get(writer.target)??[]),writer]);
    for(const group of indexed.values()){
      let comparisons=0;
      pairs:for (let a = 0; a < group.length; a++) for (let b = a + 1; b < group.length; b++) {
        const left = group[a], right = group[b];
        if(++comparisons>2048){add('workflow-target-write-conflict',right.path,`目标 ${right.target} 的重复写入数量超过互斥分析预算，无法证明安全。请合并组装行。`);break pairs;}
        // ID is updated between assembly rows. Conditions on that mutable token
        // cannot prove mutual exclusion for two writers of ID itself.
        const unstable=right.target==='ID'?new Set(['ID',`ID_${workflow.outputs.indexOf(output)+1}`]):undefined;
        const disjoint = workflowConditionsDisjoint(left.conditions, right.conditions,unstable);
        if (disjoint !== true) add('workflow-target-write-conflict', right.path, `目标 ${right.target} 同时由 ${left.path} 与 ${right.path} 写入${disjoint === undefined ? '，条件超出分析预算，无法证明互斥' : '，执行条件不能证明互斥'}。请合并组装或设置互斥条件。`);
      }
    }
    for(const writer of writers){const parts=writer.target.split('.');for(let at=1;at<parts.length;at++){const parent=parts.slice(0,at).join('.');if(indexed.has(parent))add('workflow-target-path-overlap',writer.path,`父子路径 ${parent} / ${writer.target} 可能发生覆盖，请核对组装意图。`,'warning');}}
  }
  return issues;
}
