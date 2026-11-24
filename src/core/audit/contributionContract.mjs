/** Pure RIA contribution rules. The Pipeline vendors this exact file. */
export const AUDIT_RULES_VERSION = 'ria-contribution-audit.v1';
export const CLASSIFICATION_FIELDS = ['Class', 'Kind', 'SKind', 'SKind2', 'Skind', 'Skind2'];
export const SYSTEM_FIELDS = ['ID', 'Type', 'World', 'CreateBy', 'CreateTime', 'ModifityBy', 'ModifityTime'];
export const COUNT_KEYS = ['featuresCreated', 'optionalAdded', 'requiredEdited', 'optionalEdited'];
const own = (object, key) => Object.prototype.hasOwnProperty.call(object ?? {}, key);
export function validBehaviorDate(value) {
  if (typeof value !== 'string' || !/^\d{8}$/.test(value) || value.slice(0, 4) === '0000') return false;
  const iso = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6)}`;
  const date = new Date(iso + 'T00:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === iso;
}
export const behaviorDay = value => validBehaviorDate(value) ? `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6)}` : null;
export function validDay(value) { return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && validBehaviorDate(value.replaceAll('-', '')); }
export function validateContributionMetadata(record, location = {}) {
  const errors = [];
  const add = (code, field, message) => errors.push({ ...location, featureId: String(record?.ID ?? location.featureId ?? ''), classCode: String(record?.Class ?? location.classCode ?? ''), field, value: record?.[field] ?? null, code, message });
  const text = value => typeof value === 'string' && value.trim().length > 0;
  if (!own(record, 'CreateBy')) add('CREATE_BY_REQUIRED', 'CreateBy', '缺少创建人 CreateBy。');
  else if (!text(record.CreateBy)) add('CREATE_BY_INVALID', 'CreateBy', 'CreateBy 必须为非空文本。');
  if (!own(record, 'CreateTime')) add('CREATE_TIME_REQUIRED', 'CreateTime', '缺少创建日期 CreateTime。');
  else if (!validBehaviorDate(record.CreateTime)) add('CREATE_TIME_INVALID', 'CreateTime', 'CreateTime 必须是有效的 YYYYMMDD 日期文本。');
  const by = own(record, 'ModifityBy') && record.ModifityBy !== undefined, time = own(record, 'ModifityTime') && record.ModifityTime !== undefined;
  if (by !== time) add('MODIFITY_PAIR_INVALID', by ? 'ModifityTime' : 'ModifityBy', 'ModifityBy 和 ModifityTime 可同时不填，填写时必须成对存在。');
  if (by && !text(record.ModifityBy)) add('MODIFITY_BY_INVALID', 'ModifityBy', 'ModifityBy 必须为非空文本。');
  if (time && !validBehaviorDate(record.ModifityTime)) add('MODIFITY_TIME_INVALID', 'ModifityTime', 'ModifityTime 必须是有效的 YYYYMMDD 日期文本。');
  if (time && validBehaviorDate(record.ModifityTime) && validBehaviorDate(record.CreateTime) && record.ModifityTime < record.CreateTime) add('MODIFITY_TIME_BEFORE_CREATE_TIME', 'ModifityTime', '编辑日期不能早于创建日期。');
  return errors;
}
export function validateContributionFeatures(features) {
  return features.flatMap(feature => validateContributionMetadata(feature.record, {worldId: feature.worldId, classCode: feature.classCode, featureId: feature.featureId, path: feature.path ?? `Data_Spilt/${feature.worldId}/${feature.classCode}/${feature.featureId}.json`}));
}
export function metadataValidationError(issues) {
  return Object.assign(new Error(`要素元数据校验失败：${issues.length} 项错误。\n${issues.slice(0, 5).map(row => `${row.featureId} · ${row.field}：${row.message}`).join('\n')}`), {code: 'CONTRIBUTION_METADATA_INVALID', issues});
}
export const emptyValue = value => value == null || typeof value === 'string' && !value.trim() || Array.isArray(value) && !value.length || typeof value === 'object' && !Array.isArray(value) && !Object.keys(value).length;
export function stableText(value) {
  if (value === undefined) return 'null';
  if (Array.isArray(value)) return '[' + value.map(stableText).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + stableText(value[key])).join(',') + '}';
  return JSON.stringify(value);
}
export function readPath(object, path) {
  let value = object;
  for (const key of path.split('.')) {
    if (['__proto__', 'prototype', 'constructor'].includes(key) || !own(value, key)) return undefined;
    value = value[key];
  }
  return value;
}

/** Small SQL predicate parser, never eval/Function. Positions are one-based. */
export function parseAuditExpression(source = '', allowedFields) {
  if (typeof source !== 'string' || source.length > 4096) throw Error('条件表达式最长 4096 字符。');
  const tokens = []; let offset = 0;
  const invalid = position => { throw Error(`条件表达式第 ${position + 1} 个字符无效。`); };
  while (offset < source.length) {
    const tail = source.slice(offset), space = /^\s+/.exec(tail);
    if (space) { offset += space[0].length; continue; }
    const match = /^(?:'(?:[^']|'')*'|"(?:[^"\\]|\\.)*"|>=|<=|!=|<>|[=><(),]|-?\d+(?:\.\d+)?|[A-Za-z_][A-Za-z0-9_.]*)/.exec(tail);
    if (!match) invalid(offset);
    tokens.push({raw: match[0], pos: offset}); offset += match[0].length;
    if (tokens.length > 256) throw Error('条件表达式过于复杂。');
  }
  let cursor = 0, depth = 0;
  const peek = raw => tokens[cursor]?.raw.toUpperCase() === raw;
  const take = raw => { if (peek(raw)) { cursor++; return true; } return false; };
  const expect = raw => { if (!take(raw)) throw Error(`条件表达式第 ${(tokens[cursor]?.pos ?? source.length) + 1} 个字符需要 ${raw}。`); };
  const literal = () => {
    const token = tokens[cursor++]; if (!token) invalid(source.length);
    const value = token.raw;
    if (value.startsWith("'")) return value.slice(1, -1).replaceAll("''", "'");
    if (value.startsWith('"')) { try { return JSON.parse(value); } catch { invalid(token.pos); } }
    if (/^-?\d+(?:\.\d+)?$/.test(value)) { const n = Number(value); if (!Number.isFinite(n)) invalid(token.pos); return n; }
    if (/^(true|false|null)$/i.test(value)) return JSON.parse(value.toLowerCase());
    throw Error(`第 ${token.pos + 1} 个字符需要字符串、数字、布尔值或 NULL。`);
  };
  const primary = () => {
    if (++depth > 20) throw Error('条件括号嵌套过深。');
    let node;
    if (take('NOT')) node = {op: 'NOT', child: primary()};
    else if (take('(')) { node = or(); expect(')'); }
    else {
      const token = tokens[cursor++], field = token?.raw;
      if (!field || !/^[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*$/.test(field) || field.split('.').some(k => ['__proto__','prototype','constructor'].includes(k))) invalid(token?.pos ?? source.length);
      if (allowedFields && !allowedFields.includes(field)) throw Error(`不支持查询字段 ${field}。`);
      if (take('IS')) { const not = take('NOT'); expect('NULL'); node = {op: not ? 'IS NOT NULL' : 'IS NULL', field}; }
      else if (take('IN')) { expect('('); const values = [literal()]; while (take(',')) values.push(literal()); expect(')'); node = {op: 'IN', field, values}; }
      else {
        const op = tokens[cursor++]?.raw;
        if (!['=', '!=', '<>', '>', '<', '>=', '<='].includes(op)) throw Error(`字段 ${field} 后需要比较运算符。`);
        node = {op, field, value: literal()};
      }
    }
    depth--; return node;
  };
  const and = () => { let node = primary(); while (take('AND')) node = {op: 'AND', left: node, right: primary()}; return node; };
  const or = () => { let node = and(); while (take('OR')) node = {op: 'OR', left: node, right: and()}; return node; };
  if (!tokens.length) return null;
  const result = or(); if (cursor !== tokens.length) invalid(tokens[cursor].pos); return result;
}
export function matchesAuditExpression(node, record) {
  if (!node) return true;
  if (node.op === 'AND') return matchesAuditExpression(node.left, record) && matchesAuditExpression(node.right, record);
  if (node.op === 'OR') return matchesAuditExpression(node.left, record) || matchesAuditExpression(node.right, record);
  if (node.op === 'NOT') return !matchesAuditExpression(node.child, record);
  const a = readPath(record, node.field), b = node.value;
  if (node.op === 'IS NULL') return a == null;
  if (node.op === 'IS NOT NULL') return a != null;
  if (a == null) return false;
  if (node.op === 'IN') return node.values.some(value => value === a);
  if (b == null || typeof a !== typeof b) return false;
  if (node.op === '=') return a === b;
  if (node.op === '!=' || node.op === '<>') return a !== b;
  if (!['number','string'].includes(typeof a)) return false;
  return node.op === '>' ? a > b : node.op === '<' ? a < b : node.op === '>=' ? a >= b : a <= b;
}
export function priceMicros(value) {
  const text = value == null || value === '' ? '0' : String(value);
  if (!/^\d{1,12}(?:\.\d{1,6})?$/.test(text)) throw Error('价格必须为非负数，最多 12 位整数和 6 位小数。');
  const [whole, fraction = ''] = text.split('.'); return BigInt(whole) * 1000000n + BigInt(fraction.padEnd(6, '0'));
}
export function formatMicros(value) {
  const whole = value / 1000000n, fraction = String(value % 1000000n).padStart(6, '0').replace(/0+$/, '');
  return String(whole) + (fraction ? '.' + fraction : '');
}
export function countAuditOperations(operations, options = {}) {
  const groups = new Map(), identities = new Set();
  const empty = () => ({featuresCreated:0, optionalAdded:0, requiredEdited:0, optionalEdited:0, deleted:0, operations:0, unclassified:0, backfilled:0, geometryPoints:0,geometryChanged:0,geometryAddedEstimate:0,geometryRemovedEstimate:0});
  const total = empty();
  for (const operation of operations) {
    const counts = groups.get(operation.actor ?? '未归属') ?? empty();
    groups.set(operation.actor ?? '未归属', counts);
    const add = (key, number=1) => { counts[key] += number; total[key] += number; };
    identities.add(operation.worldId + '\0' + operation.featureId); add('operations');
    if (operation.kind === 'create') add('featuresCreated');
    if (operation.kind === 'delete') add('deleted');
    if (operation.origin === 'backfill') add('backfilled');
    add('geometryPoints', operation.geometry?.afterPoints ?? 0);
    if(operation.geometry?.changed)add('geometryChanged');
    add('geometryAddedEstimate',operation.geometry?.addedEstimate??0);add('geometryRemovedEstimate',operation.geometry?.removedEstimate??0);
    if (operation.kind === 'delete') continue;
    for (const field of operation.fields ?? []) {
      if (field.group === 'system' && !options.includeSystem || field.group === 'classification' && !options.includeClassification) continue;
      if (field.required == null) { add('unclassified'); continue; }
      if (operation.kind === 'create' && field.required) continue;
      add(field.change === 'add' && !field.required ? 'optionalAdded' : field.required ? 'requiredEdited' : 'optionalEdited');
    }
  }
  const prices = COUNT_KEYS.map(key => priceMicros(options.prices?.[key]));
  const result = counts => {
    const products = Object.fromEntries(COUNT_KEYS.map((key,i) => [key, formatMicros(BigInt(counts[key]) * prices[i])]));
    return {...counts, products, amount: formatMicros(COUNT_KEYS.reduce((sum,key,i) => sum + BigInt(counts[key]) * prices[i],0n))};
  };
  return {total: result(total), actors: [...groups].map(([actor,counts]) => ({actor,...result(counts)})), features: identities.size};
}
