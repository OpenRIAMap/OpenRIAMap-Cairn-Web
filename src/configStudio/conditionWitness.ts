import type { FieldDefinition, RenderFieldCondition, RenderFieldGroup } from './types';
import { compileRenderFormula, matchesAtomicCondition, matchesRenderFormula } from './renderBooleanFormula';
import { scalarType } from './renderScalar';

export type PreviewPin = { field: string; value: string | number | boolean };
type Literal = { condition: RenderFieldCondition; positive: boolean };
type Branches = { values: Literal[][]; complete: boolean };
export type WitnessResult = { status: 'satisfiable'; values: Record<string, unknown>; changes: number; minimal: boolean }
  | { status: 'unsatisfiable' | 'unknown'; reason: string };
const MAX_BRANCHES = 128, MAX_TERMS = 4096;
const numericBits = new DataView(new ArrayBuffer(8));
/** Adjacent IEEE-754 finite values: fixed epsilon and integer assumptions are incorrect. */
export function nextNumber(value: number, direction: 1 | -1): number {
  if (!Number.isFinite(value)) return value;
  if (value === 0) return direction * Number.MIN_VALUE;
  numericBits.setFloat64(0, value);
  const bits = numericBits.getBigUint64(0);
  numericBits.setBigUint64(0, (value > 0) === (direction > 0) ? bits + 1n : bits - 1n);
  return numericBits.getFloat64(0);
}
function product(left: Branches, right: Branches): Branches {
  const values: Literal[][] = []; let complete = left.complete && right.complete;
  for (const a of left.values) for (const b of right.values) {
    if (values.length >= MAX_BRANCHES || a.length + b.length > MAX_TERMS) { complete = false; continue; }
    values.push([...a, ...b]);
  }
  return { values, complete };
}
function sum(left: Branches, right: Branches): Branches {
  const all = [...left.values, ...right.values];
  return { values: all.slice(0, MAX_BRANCHES), complete: left.complete && right.complete && all.length <= MAX_BRANCHES };
}
function branches(group: RenderFieldGroup | RenderFieldCondition, positive = true): Branches {
  if (!('op' in group)) return { values: [[{ condition: group, positive }]], complete: true };
  if (group.formula) {
    const terms = new Map(group.formula.terms.map(t => [t.id, t.condition]));
    const visit = (ast: ReturnType<typeof compileRenderFormula>, polarity: boolean): Branches => {
      if (ast.kind === 'term') return { values: [[{ condition: terms.get(ast.id)!, positive: polarity }]], complete: true };
      if (ast.kind === 'not') return visit(ast.child, !polarity);
      return (ast.kind === 'and') === polarity ? product(visit(ast.left, polarity), visit(ast.right, polarity)) : sum(visit(ast.left, polarity), visit(ast.right, polarity));
    };
    return visit(compileRenderFormula(group.formula), positive);
  }
  if (!group.items.length || group.op === 'not' && group.items.length !== 1) throw Error('条件组不完整。');
  if (group.op === 'not') return branches(group.items[0], !positive);
  const isAnd = (group.op === 'all') === positive;
  return group.items.map(item => branches(item, positive)).reduce(isAnd ? product : sum);
}
function readPath(value: Record<string, unknown>, key: string): unknown {
  return key.split('.').reduce<unknown>((node, part) => node && typeof node === 'object' && !['__proto__','prototype','constructor'].includes(part) ? (node as Record<string, unknown>)[part] : undefined, value);
}
function literalsFor(condition: RenderFieldCondition): Array<string | number | boolean> {
  return condition.kind === 'fieldEquals' ? [condition.value] : condition.kind === 'fieldIn' ? condition.values
    : condition.kind === 'fieldCompare' ? condition.values ?? (condition.value !== undefined ? [condition.value] : []) : [];
}
function candidateDomain(field: FieldDefinition | undefined, facts: Literal[], seed: unknown, respectRequired: boolean): { values: unknown[]; complete: boolean } {
  const literals = facts.flatMap(f => literalsFor(f.condition));
  const values: unknown[] = []; if (seed !== undefined) values.push(seed);
  const required = respectRequired && field?.required;
  if (!required) values.push(undefined);
  let complete = true;
  if (field?.cardinality === 'multiple' || field?.type === 'json' || field?.type === 'reference') {
    if (field.type === 'reference') values.push(...literals.filter(value => typeof value === 'string'));
    // Do not fabricate arrays, objects, target IDs or business relations to make a preview pass.
    complete = false;
  } else if (field?.type === 'enum') {
    const type = scalarType(field);
    const options = (field.options ?? []).map(o => type === 'number' ? Number(o.value) : type === 'boolean' ? o.value === 'true' : o.value);
    if (type === 'number') options.sort((a,b) => Number(a)-Number(b));
    if (type === 'boolean') options.sort((a,b) => Number(a)-Number(b));
    values.push(...options);
  } else {
    const type = field ? scalarType(field) : undefined;
    if (!type || type === 'boolean') values.push(false, true);
    if (!type || type === 'number') {
      let lower: number | undefined, strict = false;
      for (const fact of facts) {
        const c = fact.condition;
        if (c.kind !== 'fieldCompare' || typeof c.value !== 'number') continue;
        const bound = fact.positive ? c.operator : ({ lt:'ge', le:'gt', gt:'le', ge:'lt' } as Record<string,string>)[c.operator];
        if (bound !== 'gt' && bound !== 'ge') continue;
        if (lower === undefined || c.value > lower) { lower = c.value; strict = bound === 'gt'; }
        else if (c.value === lower && bound === 'gt') strict = true;
      }
      if (lower !== undefined) values.push(strict ? nextNumber(lower, 1) : lower);
      values.push(0);
      const numbers = literals.flatMap(value => typeof value === 'number' ? [value] : typeof value === 'string' && value.trim() && Number.isFinite(Number(value)) ? [Number(value)] : []);
      for (const number of numbers) values.push(number, nextNumber(number, 1), nextNumber(number, -1));
    }
    if (!type || type === 'string') {
      if (!required) values.push('');
      values.push(...literals.filter(value => typeof value === 'string'), ...literals.filter(value => typeof value !== 'string').map(String));
      let other = 'a'; while (literals.includes(other)) other += 'a'; values.push(other);
    }
    if (!field) complete = false;
  }
  return { values: [...new Set(values)].filter(value => {
    if (typeof value === 'number' && !Number.isFinite(value)) return false;
    if (required && (value === undefined || value === null || typeof value === 'string' && !value.trim())) return false;
    if (value !== undefined && field && field.type !== 'json' && field.cardinality === 'single') {
      if (typeof value !== scalarType(field)) return false;
      if (field.type === 'enum' && !field.options?.some(option => option.value === String(value))) return false;
    }
    return true;
  }), complete };
}
/** Bounded DNF + exact scalar partitions; failure to search is never a contradiction proof. */
export function solveConditionWitness(groups: Array<{ group: RenderFieldGroup; negate?: boolean }>, fields: FieldDefinition[], pins: PreviewPin[] = [], options: { seed?: Record<string, unknown>; respectRequired?: boolean } = {}): WitnessResult {
  let all: Branches = { values: [[]], complete: true };
  try { for (const { group, negate } of groups) all = product(all, branches(group, !negate)); }
  catch (error) { return { status: 'unknown', reason: String(error) }; }
  const facts = pins.map(pin => ({ condition: { kind: 'fieldCompare' as const, field: pin.field, operator: 'eq' as const, value: pin.value }, positive: true }));
  all = product(all, { values: [facts], complete: true });
  const seed = options.seed ?? {}, definitions = new Map(fields.map(f => [f.key, f]));
  let best: Extract<WitnessResult, { status: 'satisfiable' }> | undefined, unknown = !all.complete;
  for (const branch of all.values) {
    const byField = new Map<string, Literal[]>();
    for (const literal of branch) { const field = literal.condition.field; byField.set(field, [...(byField.get(field) ?? []), literal]); }
    const keys = [...byField.keys()];
    if (keys.some(key => !/^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)*$/.test(key) || key.split('.').some(part=>['__proto__','prototype','constructor'].includes(part)))) return { status:'unknown',reason:'条件字段路径无效或不安全。' };
    if (keys.some((key, i) => keys.some((other, j) => i !== j && other.startsWith(key + '.')))) { unknown = true; continue; }
    const values: Record<string, unknown> = Object.create(null); let valid = true, changes = 0;
    for (const [key, conditions] of byField) {
      const original = readPath(seed, key), domain = candidateDomain(definitions.get(key), conditions, original, options.respectRequired !== false);
      const match = domain.values.findIndex(value => conditions.every(literal => matchesAtomicCondition(literal.condition, () => value) === literal.positive));
      if (match < 0) { valid = false; if (!domain.complete) unknown = true; break; }
      values[key] = domain.values[match]; if (!Object.is(values[key], original)) changes++;
    }
    if (valid && (!best || changes < best.changes)) best = { status: 'satisfiable', values, changes, minimal: all.complete };
  }
  return best ?? (unknown ? { status: 'unknown', reason: '当前值域／分支预算内未能安全构造；未证明矛盾。' } : { status: 'unsatisfiable', reason: '字段的实际取值域及全部条件没有共同解。' });
}
export const witnessMatchesFormula = matchesRenderFormula;
