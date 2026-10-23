import type {FieldDefinition} from './types';
import {validateStructuredValue} from './valueSchema';
import {readMultipartGeometry,validateMultipartGeometry} from '../core/geometry/multipartGeometry';

export const emptyFieldValue=(value:unknown)=>value==null||typeof value==='string'&&!value.trim()||Array.isArray(value)&&!value.length;
export function fieldFormatErrors(field:FieldDefinition,value:unknown):string[]{
  const error=(message:string)=>[`${field.key} ${message}`];
  if(emptyFieldValue(value))return [];
  const values=field.cardinality==='multiple'&&Array.isArray(value)?value:[value];
  if(field.format==='externalLink'&&values.some(item=>{if(typeof item!=='string'||!/^https?:\/\//i.test(item))return true;try{const url=new URL(item);return !['https:','http:'].includes(url.protocol)||!url.hostname;}catch{return true;}}))return error('必须是有效的 HTTP／HTTPS 链接。');
  if(field.format==='date'&&values.some(item=>{
    if(typeof item!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(item))return true;
    const date=new Date(item+'T00:00:00Z');return !Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==item;
  }))return error('必须是有效的 YYYY-MM-DD 日期。');
  if(field.coordinateFormat){
    if(field.coordinateFormat==='pointObject'){
      if(!value||typeof value!=='object'||Array.isArray(value))return error('需要坐标对象 {x,y,z}。');
      const point=value as Record<string,unknown>;
      return ['x','z'].some(axis=>typeof point[axis]!=='number'||!Number.isFinite(point[axis]))||point.y!==undefined&&(typeof point.y!=='number'||!Number.isFinite(point.y))?error('坐标必须为有限数值。'):[];
    }
    const type=field.coordinateFormat==='coordP'?'Point':field.coordinateFormat==='coordL'?'LineString':'Polygon';
    const key=type==='Point'?'CoordP':type==='LineString'?'CoordL':'CoordG';
    const read=readMultipartGeometry({[key]:value},type),invalid=read.error??validateMultipartGeometry(read.geometry);
    if(invalid)return error(`坐标格式不符：${invalid}`);
  }
  return [];
}

/** Shared by actual workflow commits, imports and the pure Node intake kernel. */
export function fieldValueErrors(field:FieldDefinition,value:unknown):string[]{
  if(emptyFieldValue(value))return [];
  const errors:string[]=[];
  if(field.valueSchema)errors.push(...validateStructuredValue(value,field.valueSchema,field.key));
  if(field.cardinality==='multiple'&&!Array.isArray(value))errors.push(`${field.key} 必须是数组。`);
  const values=field.cardinality==='multiple'&&Array.isArray(value)?value:[value];
  if(['string','reference'].includes(field.type)&&values.some(item=>typeof item!=='string'))errors.push(`${field.key} 必须是文本值。`);
  if(field.type==='number'&&values.some(item=>typeof item!=='number'||!Number.isFinite(item)))errors.push(`${field.key} 必须是有限数值。`);
  if(field.type==='boolean'&&values.some(item=>typeof item!=='boolean'))errors.push(`${field.key} 必须是布尔值。`);
  if(field.type==='enum'){
    const type=field.optionValueType??'string';
    if(values.some(item=>typeof item!==type))errors.push(`${field.key} 的选项保存值类型不符。`);
    if(field.options?.length&&values.some(item=>!field.options!.some(option=>option.value===String(item))))errors.push(`${field.key} 不是有效选项值。`);
  }
  if(field.type==='json'&&!field.coordinateFormat&&values.some(item=>item===undefined||typeof item==='function'||typeof item==='symbol'||typeof item==='bigint'))errors.push(`${field.key} 必须为可保存的 JSON 值。`);
  errors.push(...fieldFormatErrors(field,value));
  return errors;
}
