import {getClassTagRegistryEntries} from '../core/project/classMetadata';
import type {ClassificationPath,ConfigPackageV3,FieldDefinition,LookupTable,SelectOption,TagFieldMetadata} from './types';
import {effectiveOptionTable} from './lookupTables';
import {resolveEffectiveFields} from './runtime';
export const STANDARD_TABLE_IDS=['teleport-hubs','road-travel-modes','standard-tag-fields'] as const;
export const isStandardTable=(id:string)=>(STANDARD_TABLE_IDS as readonly string[]).includes(id);
export function tagMetadata(field:FieldDefinition):TagFieldMetadata {
  const type=field.type==='enum'||field.input==='select'?'select':field.type==='number'?'number':field.type==='boolean'?'bool':'text';
  return {kind:'tagField',type,...(field.format==='externalLink'||field.format==='date'?{format:field.format}:{}),...(type==='select'?{valueTable:{valueType:field.optionValueType??'string',rows:structuredClone(field.options??[])}}:{})};
}
const stable=(value:unknown):string=>JSON.stringify(value);
export function createStandardTagTable(config:ConfigPackageV3):LookupTable {
  const entries=new Map<string,{row:LookupTable['rows'][number];origins:string[]}>(),conflicts:string[]=[];
  const add=(key:string,label:SelectOption['label'],metadata:TagFieldMetadata,origin:string)=>{if(key==='__other__')throw Error('其他字段不能作为目录行。');const previous=entries.get(key);if(previous){if(stable(previous.row.functionValue)!==stable(metadata))conflicts.push(`${key}：${previous.origins.join('、')} 与 ${origin} 的类型／值选项不同`);previous.origins.push(origin);return;}entries.set(key,{row:{value:key,label:structuredClone(label),functionValue:metadata},origins:[origin]});};
  for(const entry of getClassTagRegistryEntries())add(entry.key,{zh:entry.label,en:''},{kind:'tagField',type:entry.type,...(entry.type==='select'?{valueTable:{valueType:'string',rows:(entry.options??[]).map(row=>({value:row.value,label:{zh:row.label,en:''}}))}}:{})},'V1 分类目录');
  for(const [key,label,type] of [['category','分类(category)','text'],['level','等级(level)','number'],['status','状态(status)','text'],['source','来源(source)','text']] as const)add(key,{zh:label,en:''},{kind:'tagField',type},'V1 兼容目录');
  for(const node of config.nodes)for(const field of resolveEffectiveFields(config,node.path).filter(field=>field.key.startsWith('tags.')))add(field.key.slice(5),field.labels,tagMetadata(field),Object.values(node.path).join('/'));
  if(conflicts.length)throw Error(`标准标签目录存在定义冲突，未采用首项覆盖：\n${[...new Set(conflicts)].join('\n')}`);
  return {id:'standard-tag-fields',label:{zh:'标准标签字段',en:'Standard tag fields'},valueType:'string',functionKind:'tagField',rows:[...entries.values()].map(entry=>entry.row)};
}
export function standardTagFields(config:ConfigPackageV3,path:ClassificationPath):FieldDefinition[]{
  const fields=resolveEffectiveFields(config,path).filter(field=>field.key.startsWith('tags.'));
  if(config.contractRevision<11)return fields;
  const table=config.lookupTables?.find(table=>table.id==='standard-tag-fields');if(!table||table.functionKind!=='tagField')throw Error('标准标签字段目录不存在或格式无效。');
  const result=table.rows.map(row=>{const meta=row.functionValue;if(!meta||typeof meta!=='object'||!('kind' in meta)||meta.kind!=='tagField')throw Error(`标签 ${row.value} 缺少受控类型。`);const options=meta.type==='select'?effectiveOptionTable(config,{optionTable:meta.valueTable,optionsTableId:meta.valueTableId}):undefined;
    return {fieldId:`tag-catalog-${row.value}`,key:`tags.${row.value}`,scope:'tags',type:meta.type==='select'?'enum':meta.type==='number'?'number':meta.type==='bool'?'boolean':'string',input:meta.type==='select'?'select':meta.type==='bool'?'toggle':'text',cardinality:'single',labels:row.label,description:{zh:'',en:''},format:meta.format,options:options?.rows,optionValueType:options?.valueType} as FieldDefinition;
  });
  for(const field of fields){const index=result.findIndex(row=>row.key===field.key);if(index>=0)result[index]=field;else result.push(field);}
  return result;
}
export function tagRecordErrors(config:ConfigPackageV3,path:ClassificationPath,record:Record<string,unknown>):string[]{
  if(config.contractRevision<11||!record.tags||typeof record.tags!=='object')return [];
  const fields=standardTagFields(config,path),tags=record.tags as Record<string,unknown>,errors:string[]=[];
  for(const field of fields){const value=tags[field.key.slice(5)];if(value===undefined||value===null)continue;const values=field.cardinality==='multiple'&&Array.isArray(value)?value:[value],type=field.type==='number'?'number':field.type==='boolean'?'boolean':field.type==='enum'?field.optionValueType??'string':'string';if(values.some(value=>typeof value!==type||field.type==='enum'&&!field.options?.some(option=>option.value===String(value))))errors.push(`${field.key} 与标准目录／分类字段的类型或可选值不符。`);}
  return errors;
}
export function standardTagTableErrors(config:ConfigPackageV3):Array<{path:string;message:string}>{
  if(config.contractRevision<11)return [];
  const errors:Array<{path:string;message:string}>=[],fail=(path:string,message:string)=>errors.push({path,message});
  for(const [id,kind] of [['teleport-hubs','teleportHub'],['road-travel-modes','speed'],['standard-tag-fields','tagField']]){const table=config.lookupTables?.find(table=>table.id===id);if(!table||table.functionKind!==kind||table.valueType!=='string')fail(`lookupTables/${id}`,'系统标准表缺失，或其固定 ID、用途、保存值类型被修改。');}
  for(const table of config.lookupTables??[])if(table.functionKind==='tagField'){
    if(table.valueType!=='string')fail(`lookupTables/${table.id}`,'标签名称目录必须以文本 key 保存。');
    for(const row of table.rows){const path=`lookupTables/${table.id}/${row.value}`,meta=row.functionValue;
      if(row.value==='__other__'||!/^[A-Za-z][A-Za-z0-9_]*$/.test(row.value))fail(path,'标签 key 无效；其他字段入口不能存入目录。');
      if(!meta||typeof meta!=='object'||!('kind' in meta)||meta.kind!=='tagField'){fail(path,'标签目录需要受控的标签类型功能值。');continue;}
      if(meta.type!=='select'&&(meta.valueTable||meta.valueTableId))fail(path,'只有下拉标签可以设置值选项。');
      if(meta.type==='select'){
        if(meta.valueTable&&meta.valueTableId)fail(path,'标签值副本与表格引用不能并存。');
        const source=meta.valueTableId?config.lookupTables?.find(table=>table.id===meta.valueTableId):undefined;
        if(meta.valueTableId&&(!source||source.functionKind==='tagField'))fail(path,'标签值对照不能引用名称目录或缺失表格，防止循环。');
        const values=effectiveOptionTable(config,{optionTable:meta.valueTable,optionsTableId:meta.valueTableId});
        if(!values.rows.length)fail(path,'下拉标签至少需要一个有效值选项。');
        const keys=new Set<string>();for(const value of values.rows){const key=values.valueType==='number'?String(Number(value.value)):value.value;if(!value.value.trim()||keys.has(key)||!(value.label.zh.trim()||value.label.en.trim())||values.valueType==='number'&&!Number.isFinite(Number(value.value))||values.valueType==='boolean'&&!['true','false'].includes(value.value))fail(path,'标签值对照存在重复、空名称或无效保存值。');keys.add(key);}
      }
    }
  }
  const table=config.lookupTables?.find(table=>table.id==='standard-tag-fields');
  for(const node of config.nodes)for(const field of resolveEffectiveFields(config,node.path).filter(field=>field.key.startsWith('tags.'))){const row=table?.rows.find(row=>row.value===field.key.slice(5)),meta=row?.functionValue;if(meta&&typeof meta==='object'&&'kind' in meta&&meta.kind==='tagField'){
    const definition=tagMetadata(field),dictionary=meta.type==='select'?effectiveOptionTable(config,{optionTable:meta.valueTable,optionsTableId:meta.valueTableId}):undefined;
    if(meta.type!==definition.type||dictionary&&stable(dictionary)!==stable(definition.valueTable))fail(`nodes/${node.nodeId}/fields/${field.fieldId}`,'分类专用标签与标准目录的类型／值选项存在冲突，请明确修复。');
  }}return errors;
}
