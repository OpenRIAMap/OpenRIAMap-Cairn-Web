import type {TableDefinition} from './types';
export const TABLE_LIMITS={columns:16,rows:500,cellLength:10000} as const;
const blank=(v:unknown)=>v==null||typeof v==='string'&&!v.trim();
/** Only invoke when a user changes a table. Untouched imported rows remain intact. */
export function normalizeTableRows(value:unknown):unknown {
 if(!Array.isArray(value))return value;
 return value.filter(row=>!row||typeof row!=='object'||Array.isArray(row)||Object.values(row).some(v=>!blank(v)))
  .map(row=>row&&typeof row==='object'&&!Array.isArray(row)?Object.fromEntries(Object.entries(row).filter(([,v])=>!blank(v))):row);
}
export function tableDefinitionErrors(table:TableDefinition|undefined):string[]{
 if(!table||!Array.isArray(table.columns)||!table.columns.length||table.columns.length>TABLE_LIMITS.columns)return ['表格必须有 1–16 列。'];
 const keys=new Set<string>(),errors:string[]=[];
 for(const c of table.columns){if(!/^[A-Za-z][A-Za-z0-9_]*$/.test(c.key)||['constructor','prototype','__proto__'].includes(c.key)||keys.has(c.key))errors.push('表格列键必须安全、稳定且唯一。');keys.add(c.key);if(!(c.label.zh.trim()||c.label.en.trim()))errors.push('表格列需要名称。');}
 if(table.maxRows!==undefined&&(!Number.isInteger(table.maxRows)||table.maxRows<1||table.maxRows>TABLE_LIMITS.rows))errors.push('表格行数上限应为 1–500。');
 if(table.maxCellLength!==undefined&&(!Number.isInteger(table.maxCellLength)||table.maxCellLength<1||table.maxCellLength>TABLE_LIMITS.cellLength))errors.push('单元格长度上限应为 1–10000。');
 return errors;
}
export function tableValueErrors(table:TableDefinition|undefined,value:unknown,required=false):string[]{
 const errors=tableDefinitionErrors(table);if(errors.length)return errors;
 if(value==null||Array.isArray(value)&&!value.length)return required?['表格至少需要一条有效行。']:[];
 if(!Array.isArray(value))return ['表格必须保存为 JSON 行数组；原值已保留，请修整。'];
 if(value.length>(table!.maxRows??TABLE_LIMITS.rows))errors.push('表格超过允许行数；未截断数据。');
 for(const [i,row] of value.entries()){
  if(!row||typeof row!=='object'||Array.isArray(row)){errors.push(`第 ${i+1} 行必须为对象。`);continue;}
  for(const key of Object.keys(row))if(!table!.columns.some(c=>c.key===key))errors.push(`第 ${i+1} 行含历史未知列 ${key}，原值已保留。`);
  for(const c of table!.columns){const v=row[c.key],at=`第 ${i+1} 行 / ${c.label.zh||c.key}`;if(blank(v)){if(c.required)errors.push(at+' 为必填。');continue;}
   if(c.type==='number'?(typeof v!=='number'||!Number.isFinite(v)):typeof v!=='string')errors.push(at+' 类型不符。');
   if(typeof v==='string'&&v.length>(table!.maxCellLength??TABLE_LIMITS.cellLength))errors.push(at+' 超过允许长度；未截断。');
  }
 }
 return errors;
}
