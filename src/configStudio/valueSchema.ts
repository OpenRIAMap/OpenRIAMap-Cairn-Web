import type { ValueSchema } from './types';

const text: ValueSchema = { type: 'string' }, number: ValueSchema = { type: 'number' }, bool: ValueSchema = { type: 'boolean' };
const object = (properties: Record<string, ValueSchema>, required: string[] = []): ValueSchema => ({ type: 'object', properties, required });
const array = (items: ValueSchema): ValueSchema => ({ type: 'array', items });
const id = { anyOf: [text, object({ ID: text }, ['ID'])] } satisfies ValueSchema;
const roadId = { anyOf: [text, { type: 'array', items: text, minItems: 1 }, ...['tgt', 'ID', 'id'].map(key => object({ [key]: text }, [key]))] } satisfies ValueSchema;
export const VALUE_SCHEMA_TEMPLATES: Record<string, { label: string; schema: ValueSchema }> = {
  'rail-lines': { label: '站台线路引用', schema: array({ anyOf: [text, object({ ID: text, Avaliable: bool, Available: bool, NotAvaliable: bool, getin: bool, getout: bool, Overtaking: bool, NextOT: bool, stationDistance: number, bureau: text, line: text }, ['ID'])] }) },
  'rail-platforms': { label: '站场站台引用', schema: array(id) },
  'rail-stations': { label: '车站站场引用', schema: array(id) },
  'road-modes': { label: '道路出行方式', schema: array({ anyOf: [text, { type: 'array', items: text, minItems: 1 }, ...['code', 'tgt', 'ID', 'id'].map(key => object({ [key]: text }, [key]))] }) },
  'road-connections': { label: '道路连接关系', schema: array({ anyOf: [...['mode','Lot'].flatMap(mode => ['tgt','Tgt'].map(target => object({ [mode]: { type: 'string', enum: ['endpoint', 'middle'] }, [target]: text }, [mode,target])))] }) },
  'road-blacklist': { label: '道路连接排除', schema: array(roadId) },
  'target-point': { label: '传送目标坐标', schema: object({ x: number, y: number, z: number }, ['x', 'z']) },
};
export const valueSchemaTemplate = (name: string): ValueSchema => structuredClone(VALUE_SCHEMA_TEMPLATES[name].schema);
export function validateValueSchema(schema: ValueSchema): string[] {
  let budget = 512;
  const visit = (s: ValueSchema, depth: number): string[] => {
    if (--budget < 0 || depth > 12) return ['值结构超过深度或规模限制。'];
    if (!s || typeof s !== 'object' || Array.isArray(s)) return ['值结构必须为对象。'];
    if (Object.keys(s).some(key => !['type','anyOf','properties','required','items','enum','minItems','maxItems','minimum','exclusiveMinimum'].includes(key))) return ['值结构包含不支持的属性。'];
    if (!s.type && !s.anyOf?.length) return ['值结构必须指定类型或兼容分支。'];
    if (s.anyOf && (!s.anyOf.length || s.anyOf.length > 16)) return ['值结构兼容分支数量无效。'];
    if (s.required?.some(key => !s.properties?.[key] || ['__proto__','prototype','constructor'].includes(key))) return ['必需属性未定义或名称不安全。'];
    if (s.properties && Object.keys(s.properties).some(key => ['__proto__','prototype','constructor'].includes(key))) return ['值结构属性名称不安全。'];
    if (s.enum && (!s.enum.length || s.enum.length > 512 || s.enum.some(v => !['string','number','boolean'].includes(typeof v) || typeof v === 'number' && !Number.isFinite(v)))) return ['值结构枚举无效。'];
    if ([s.minimum,s.exclusiveMinimum].some(v => v !== undefined && !Number.isFinite(v))) return ['值结构数值边界无效。'];
    if ([s.minItems,s.maxItems].some(v => v !== undefined && (!Number.isSafeInteger(v) || v < 0 || v > 100000)) || s.minItems !== undefined && s.maxItems !== undefined && s.minItems > s.maxItems) return ['值结构数组长度边界无效。'];
    return [...(s.anyOf ?? []), ...Object.values(s.properties ?? {}), ...(s.items ? [s.items] : [])].flatMap(child => visit(child, depth + 1));
  };
  return visit(schema, 0).slice(0, 20);
}
export function validateStructuredValue(value: unknown, schema: ValueSchema, path = 'value'): string[] {
  if (validateValueSchema(schema).length) return [`${path}：字段值结构声明无效。`];
  let budget = 20000;
  const visit = (v: unknown, s: ValueSchema, p: string, depth: number): string[] => {
    if (--budget < 0 || depth > 24) return [`${p}：值检查超过规模限制。`];
    if (s.anyOf && !s.anyOf.some(branch => visit(v, branch, p, depth + 1).length === 0)) return [`${p}：不符合任何允许的结构。`];
    if (s.type && (s.type === 'array' ? !Array.isArray(v) : s.type === 'object' ? !v || typeof v !== 'object' || Array.isArray(v) : typeof v !== s.type)) return [`${p}：需要 ${s.type}。`];
    if (typeof v === 'number' && (!Number.isFinite(v) || s.minimum !== undefined && v < s.minimum || s.exclusiveMinimum !== undefined && v <= s.exclusiveMinimum)) return [`${p}：数值无效或越界。`];
    if (s.enum && !s.enum.includes(v as string | number | boolean)) return [`${p}：值不在允许枚举中。`];
    if (Array.isArray(v)) {
      if (s.minItems !== undefined && v.length < s.minItems || s.maxItems !== undefined && v.length > s.maxItems) return [`${p}：数组长度不符合要求。`];
      if (v.length > 100000) return [`${p}：数组过大。`];
      return s.items ? v.flatMap((item, i) => visit(item, s.items!, `${p}/${i}`, depth + 1)).slice(0, 20) : [];
    }
    if (v && typeof v === 'object') {
      const row = v as Record<string, unknown>;
      return [...(s.required ?? []).filter(key => row[key] === undefined).map(key => `${p}/${key}：缺少必需属性。`), ...Object.entries(s.properties ?? {}).flatMap(([key, child]) => row[key] === undefined ? [] : visit(row[key], child, `${p}/${key}`, depth + 1))].slice(0, 20);
    }
    return [];
  };
  return visit(value, schema, path, 0);
}
