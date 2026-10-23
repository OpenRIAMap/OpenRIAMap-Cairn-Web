import {outputAcceptsClassification} from './workflowClassificationGroup';
import type {ClassificationPath,ConfigPackageV3,FieldDefinition,ValueSchema} from './types';
import {pathMatchesScope,readRecordPath,resolveEffectiveFields} from './runtime';

/** Only an entirely blank value is absent. Do not trim authored nonblank text,
 * treat 0/false as empty, or remove positions from an array. */
export function isBlankFieldValue(value:unknown):boolean {
  return value==null||typeof value==='string'&&value.trim()==='';
}

export function recordFieldRequired(field:FieldDefinition,record:Record<string,unknown>):boolean {
  const empty=(value:unknown)=>isBlankFieldValue(value)||Array.isArray(value)&&value.length===0;
  return Boolean(field.required||field.requiredWhen?.some(condition=>
    condition.kind==='always'
    ||condition.kind==='fieldPresent'&&!empty(readRecordPath(record,condition.field))===condition.present
    ||condition.kind==='fieldEquals'&&String(readRecordPath(record,condition.field)??'')===condition.value
    ||condition.kind==='fieldIn'&&condition.values.includes(String(readRecordPath(record,condition.field)??''))));
}

const plain=(value:unknown):value is Record<string,unknown>=>Boolean(value)&&typeof value==='object'&&!Array.isArray(value);
const safePath=(path:string)=>path.split('.').every(key=>key&&!['__proto__','prototype','constructor'].includes(key));
function replacePath(record:Record<string,unknown>,path:string,value:unknown):void {
  if(!safePath(path))return;
  const keys=path.split('.');let node=record;
  for(const key of keys.slice(0,-1)){if(!plain(node[key]))return;node=node[key] as Record<string,unknown>;}
  if(value===undefined)delete node[keys[keys.length-1]];else node[keys[keys.length-1]]=value;
}

/** Keep every possibly required property in compatible schema branches. This
 * cleans optional object properties, never whole rows or scalar array items. */
function schemaBranches(schema:ValueSchema,value:unknown):ValueSchema[] {
  if(schema.type&&(schema.type==='array'?!Array.isArray(value):schema.type==='object'?!plain(value):typeof value!==schema.type))return [];
  return [schema,...(schema.anyOf??[]).flatMap(branch=>schemaBranches(branch,value))];
}
function cleanStructured(value:unknown,schemas:ValueSchema[],path:string,protectedPaths:Set<string>):unknown {
  const branches=schemas.flatMap(schema=>schemaBranches(schema,value));
  if(Array.isArray(value)){
    const items=branches.flatMap(schema=>schema.items?[schema.items]:[]);
    return items.length?value.map(item=>cleanStructured(item,items,path,protectedPaths)):value;
  }
  if(!plain(value))return value;
  const required=new Set(branches.flatMap(schema=>schema.required??[]));
  for(const key of Object.keys(value)){
    const children=branches.flatMap(schema=>schema.properties&&Object.prototype.hasOwnProperty.call(schema.properties,key)?[schema.properties[key]]:[]);
    if(!children.length)continue; // Unknown/custom values are not declared optional.
    const childPath=`${path}.${key}`;
    if(!required.has(key)&&!protectedPaths.has(childPath)&&isBlankFieldValue(value[key]))delete value[key];
    else value[key]=cleanStructured(value[key],children,childPath,protectedPaths);
  }
  return value;
}

/** Group controls also declare nested fields in r11/r12 packages, before
 * valueSchema existed. Only direct slot-to-field bindings are reversible. */
function groupSchemas(config:ConfigPackageV3,path:ClassificationPath):Map<string,ValueSchema[]> {
  const schemas=new Map<string,ValueSchema[]>();
  for(const workflow of config.workflows)for(const output of workflow.outputs){
    if(config.contractRevision>=15?!outputAcceptsClassification(config,output,path):!output.classification||!pathMatchesScope(path,output.classification))continue;
    for(const assignment of output.assignments){
      const control=workflow.steps.flatMap(step=>step.controls??[]).find(item=>item.kind==='group'&&item.slot===assignment.expression.trim());
      if(!control?.group||control.group.storage==='scalar')continue;
      const properties=Object.fromEntries(control.group.itemFields.map(field=>[field.key,{}]));
      // Conditional group requirements stay strict when their runtime slots
      // are unavailable during raw-record import.
      const required=control.group.itemFields.filter(field=>field.required||field.requiredWhen?.length).map(field=>field.key);
      const schema:ValueSchema={type:'array',items:{type:'object',properties,required}};
      schemas.set(assignment.target,[...(schemas.get(assignment.target)??[]),schema]);
    }
  }
  return schemas;
}

/** Shared write-boundary cleanup. The original snapshot, geometry, metadata,
 * unknown properties, and explicitly preserved empty fields remain intact. */
export function omitOptionalFieldValues(config:ConfigPackageV3,path:ClassificationPath,raw:Record<string,unknown>):Record<string,unknown> {
  const record=structuredClone(raw),fields=resolveEffectiveFields(config,path),groups=groupSchemas(config,path);
  const protectedPaths=new Set(fields.filter(field=>field.emptyValue==='preserve'||recordFieldRequired(field,raw)).map(field=>field.key));
  for(const field of fields){
    if(!safePath(field.key))continue;
    const value=readRecordPath(record,field.key),required=recordFieldRequired(field,raw);
    // A blank condition driver may itself be removed. Do not let that switch
    // off a requirement that was already active in the incoming record.
    if(required&&field.requiredWhen?.length&&isBlankFieldValue(readRecordPath(raw,field.key)))throw Error(`${field.key} 为必填项。`);
    if(field.emptyValue==='preserve'&&isBlankFieldValue(value))continue;
    if(!required&&isBlankFieldValue(value)){replacePath(record,field.key,undefined);continue;}
    const schemas=[...(field.valueSchema?[field.valueSchema]:[]),...(groups.get(field.key)??[])];
    if(schemas.length)replacePath(record,field.key,cleanStructured(value,schemas,field.key,protectedPaths));
  }
  return record;
}
