import type {ClassificationPath,ConfigPackageV3,WorkflowDefinition,WorkflowOutput} from './types';
import {classificationPathKey,resolveEffectiveFields,resolveGeometryProfile} from './runtime';
import {finalizeV3WorkflowRecord} from './workflowRecord';
import {validateV3WorkflowRecords,normalizeV3WorldId} from './workflowKernel';
import {categoryAllowsParts} from './multipartPolicy';
import {validateMultipartGeometry,type MultipartGeometry} from '../core/geometry/multipartGeometry';
import {EXTERNAL_ROLES} from './externalCapabilities';
import {externalRolePaths} from './externalBindings';
import type {ExternalRole} from './types';
import {standardTagFields} from './standardTagFields';

export const nativeSelfOutput=(config:ConfigPackageV3,path:ClassificationPath,geometry:MultipartGeometry['type']):WorkflowOutput=>({
 id:'native-record',...(config.contractRevision>=15?{classificationGroup:{selectors:[{id:'native-record',mode:'self' as const,path}]}}:{classification:path}),geometry:{selected:geometry},assignments:[],
});
/** One creation boundary for full editing and private executors. Geometry is never flattened for storage. */
export function prepareNativeRecordCreate(config:ConfigPackageV3,path:ClassificationPath,geometry:MultipartGeometry,raw:Record<string,unknown>,world:string,actor:string,others:Record<string,unknown>[]=[],now=new Date()){
 const error=validateMultipartGeometry(geometry);if(error)throw Error(error);
 if(!resolveGeometryProfile(config,path,geometry.type)?.enabled)throw Error('目标分类未启用当前几何。');
 if(geometry.parts.length>1&&!categoryAllowsParts(config,path,geometry.type))throw Error('当前分类禁止多部件；完整草稿保留，请先处理部件。');
 if(!actor.trim())throw Error('填写人不能为空。');
 const id=String(raw.ID??'').trim();if(!id)throw Error('ID 不能为空。');
 if(others.some(record=>normalizeV3WorldId(record.World)===normalizeV3WorldId(world)&&String(record.ID??'')===id))throw Error('ID 已存在：'+id);
 const cleanRaw={...raw};for(const key of ['Class','Kind','SKind','SKind2','Skind','Skind2'])delete cleanRaw[key];
 const output=nativeSelfOutput(config,path,geometry.type),workflow:WorkflowDefinition={id:'native-record-submit',label:{zh:'原生要素保存',en:''},mode:'composed',steps:[],outputs:[output]};
 const record=finalizeV3WorkflowRecord(config,{...output,classification:path},{...cleanRaw,ID:id,World:world,Class:path.class,...(path.kind?{Kind:path.kind}:{}),...(path.skind?{SKind:path.skind}:{}),...(path.skind2?{SKind2:path.skind2}:{}),Creator:actor.trim()},{coords:[],geometry,now});
 const issues=validateV3WorkflowRecords(config,workflow,[{outputId:output.id,classification:path,geometry:geometry.type,record}]);
 if(issues.length)throw Error(issues.map(issue=>issue.message).join('\n'));
 return record;
}
export function assembleDraftGroups(config:ConfigPackageV3,path:ClassificationPath,groups:Record<string,unknown[]>){
 const result:Record<string,unknown>={},tags:Record<string,unknown>={},extensions:Record<string,Record<string,unknown>>={};
 const fields=standardTagFields(config,path);
 for(const [key,rows]of Object.entries(groups)){
  if(key==='tags')for(const raw of rows){const row=raw as Record<string,unknown>,tag=String(row.tagKey==='__other__'?row.tagKeyOther:row.tagKey??'').trim();if(!tag)continue;const value=row.tagValue;if(value===undefined||value===null||typeof value==='string'&&!value.trim())continue;const field=fields.find(field=>field.key==='tags.'+tag);tags[tag]=field?.type==='number'?Number(value):field?.type==='boolean'?value===true||value==='true':value;}
  else if(key==='extensions')for(const raw of rows){const row=raw as Record<string,unknown>,group=String(row.extGroup??'').trim(),name=String(row.extKey??'').trim();if(!group||!name||['__proto__','constructor','prototype'].includes(group)||['__proto__','constructor','prototype'].includes(name))continue;const value=row.extValue;if(row.extType!=='null'&&(value===undefined||value===null||typeof value==='string'&&!value.trim()))continue;(extensions[group]??={})[name]=row.extType==='null'?null:row.extType==='number'?Number(value):row.extType==='bool'?value===true||value==='true':value;}
  else result[key]=structuredClone(rows);
 }
 if(Object.keys(tags).length)result.tags=tags;if(Object.keys(extensions).length)result.extensions=extensions;
 return result;
}
export function prepareSpecializedCapture(config:ConfigPackageV3,workflow:WorkflowDefinition,role:ExternalRole,geometry:MultipartGeometry,values:Record<string,unknown>,groups:Record<string,unknown[]>,world:string,actor:string,others:Record<string,unknown>[]=[],selection?:ClassificationPath){
 const paths=externalRolePaths(config,workflow,role),path=selection??(paths.length===1?paths[0]:undefined);
 if(!path||!paths.some(candidate=>classificationPathKey(candidate)===classificationPathKey(path)))throw Error('请为 '+EXTERNAL_ROLES[role].label+' 选择有效目标分类。');
 if(EXTERNAL_ROLES[role].geometry!==geometry.type)throw Error('专用角色与完整几何类型不一致。');
 if(role==='stationBuilding'&&geometry.parts.length>1)throw Error('车站建筑仅允许一个面部件；不能截断完整几何。');
 const raw={...values,...assembleDraftGroups(config,path,groups)};
 // Private controls may carry text input for numeric fields, but whitespace never becomes zero.
 for(const field of resolveEffectiveFields(config,path))if(!field.key.includes('.')&&field.type==='number'&&typeof raw[field.key]==='string'&&String(raw[field.key]).trim())raw[field.key]=Number(raw[field.key]);
 return prepareNativeRecordCreate(config,path,geometry,raw,world,actor,others);
}

/** Delete-and-recreate permission is exact. A bare ID must never hide another class/world. */
export function recordsAfterExactDeletes(records:Record<string,unknown>[],marks:readonly {ID:string;worldId?:string;classCode?:string}[]){
 return records.filter(record=>!marks.some(mark=>Boolean(mark.worldId&&mark.classCode)&&mark.ID===String(record.ID??'')&&mark.classCode===record.Class&&normalizeV3WorldId(mark.worldId)===normalizeV3WorldId(record.World)));
}
