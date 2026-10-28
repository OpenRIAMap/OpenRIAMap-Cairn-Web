import {canonicalGeometryField,readMultipartGeometry,serializeMultipartGeometry,validateMultipartGeometry,validateMultipartHoleDraft,type MultipartCoord,type MultipartGeometry} from '@/core/geometry/multipartGeometry';
import type {WorkflowDrawingDraft} from '../Workflow/WorkflowHost';

const emptyPoint=():MultipartCoord=>({x:NaN,y:NaN,z:NaN});
const pending=(p:MultipartCoord)=>Number.isNaN(p.x)&&Number.isNaN(p.y)&&Number.isNaN(p.z);
/** Draft checks deliberately permit incomplete paths, never malformed coordinates. */
export function validateEditingGeometry(g:MultipartGeometry):string|undefined{
  const paths=g.type==='Point'?g.parts.map(p=>pending(p)?[]:[p]):g.type==='LineString'?g.parts:g.parts.flat();
  if(paths.some(path=>path.some(p=>![p.x,p.y,p.z].every(Number.isFinite))))return '已有坐标必须是有限数字。';
  if(g.type!=='Polygon')return;
  for(const [i,part]of g.parts.entries()){
    if(!part.length)return `第 ${i+1} 部件缺少外环结构。`;
    if(part[0].length>=3){const error=validateMultipartGeometry({type:'Polygon',parts:[[part[0]]]});if(error)return `第 ${i+1} 部件：${error}`;}
    for(const [j,hole]of part.slice(1).entries()){
      if(!hole.length)continue;
      const error=validateMultipartHoleDraft(g,i,j,hole);if(error)return error;
      if(hole.length>=3){const full=validateMultipartGeometry({type:'Polygon',parts:[[part[0],hole]]});if(full)return `第 ${i+1} 部件内洞 ${j+1}：${full}`;}
    }
  }
}
export function convertEditingGeometry(g:MultipartGeometry,type:MultipartGeometry['type'],allowParts:boolean):MultipartGeometry{
  if(g.parts.length>1&&!allowParts)throw Error(`当前有 ${g.parts.length} 个部件，目标分类禁止多部件。`);
  const error=validateEditingGeometry(g);if(error)throw Error(error);
  if(g.type===type)return structuredClone(g);
  if(g.type==='Polygon'&&g.parts.some(p=>p.length>1))throw Error('当前包含内洞或内洞占位，目标类型不能承接；请先通过原多部件和内洞设置处理。');
  const paths=g.type==='Point'?g.parts.map(p=>pending(p)?[]:[p]):g.type==='LineString'?g.parts:g.parts.map(p=>p[0]);
  if(type==='Point'&&paths.some(p=>p.length>1))throw Error('目标点类型要求每个部件最多 1 个点，不能截断现有路径。');
  return structuredClone(type==='Point'?{type,parts:paths.map(p=>p[0]??emptyPoint())}:type==='LineString'?{type,parts:paths}:{type,parts:paths.map(p=>[p])}) as MultipartGeometry;
}
/** Lexical checks must precede the canonical reader, which also reads historical numeric text. */
export function parseCompleteArray(text:string,type:MultipartGeometry['type'],allowParts:boolean):MultipartGeometry{
  let raw:unknown;try{raw=JSON.parse(text);}catch{throw Error('当前内容不是合法 JSON 数组。');}
  const field=canonicalGeometryField(type);
  const array=(v:unknown,path:string):unknown[]=>{if(!Array.isArray(v))throw Error(`${path} 必须是数组。`);return v;};
  const coord=(v:unknown,path:string)=>{const tuple=array(v,path);if(tuple.length!==3)throw Error(`${path} 必须严格为 [x,y,z] 三元数组。`);tuple.forEach((n,i)=>{if(typeof n!=='number'||!Number.isFinite(n))throw Error(`${path}[${i}]（${['X','Y','Z'][i]}）必须是有限数字。`);});};
  const parts=array(raw,field);if(!parts.length)throw Error(`${field} 至少需要一个部件。`);
  parts.forEach((part,i)=>{const p=`${field}[${i}]`;if(type==='Point')coord(part,p);else array(part,p).forEach((ring,j)=>{if(type==='LineString')coord(ring,`${p}[${j}]`);else array(ring,`${p}[${j}]`).forEach((v,k)=>coord(v,`${p}[${j}][${k}]`));});});
  const result=readMultipartGeometry({[field]:raw},type);if(!result.geometry||result.error)throw Error(result.error??`${field} 结构不完整。`);
  if(parts.length>1&&!allowParts)throw Error('当前分类禁止多部件，不能通过完整数组绕过。');
  const error=validateMultipartGeometry(result.geometry);if(error)throw Error(error);
  return result.geometry;
}
export function completeArrayText(g:MultipartGeometry):string{
  const format=(value:unknown,depth=0):string=>{
    if(!Array.isArray(value))return JSON.stringify(value);
    if(!value.length)return '[]';
    if(value.length===3&&value.every(v=>typeof v==='number'||v===null))return JSON.stringify(value);
    return '[\n'+value.map(v=>'  '.repeat(depth+1)+format(v,depth+1)).join(',\n')+'\n'+'  '.repeat(depth)+']';
  };
  return format(serializeMultipartGeometry(g));
}
/** Array order defines part and hole numbering, including after insertion or reordering. */
export function replaceDraftGeometry(draft:WorkflowDrawingDraft,geometry:MultipartGeometry):WorkflowDrawingDraft{
  const next=structuredClone(draft),part=Math.min(draft.editor.part,Math.max(0,geometry.parts.length-1));
  const holes=geometry.type==='Polygon'?geometry.parts[part]?.slice(1)??[]:[];
  const editingHole=draft.editor.editingHole&&draft.editor.hole<holes.length;
  const coords=geometry.type==='Point'?(geometry.parts[part]&&!pending(geometry.parts[part])?[geometry.parts[part]]:[]):geometry.type==='LineString'?geometry.parts[part]??[]:geometry.parts[part]?.[editingHole?draft.editor.hole+1:0]??[];
  next.geometry=structuredClone(geometry);next.coordinates=structuredClone(coords);next.redo=[];
  next.editor={...next.editor,multipart:geometry.parts.length>1||geometry.type==='Polygon'&&geometry.parts.some(p=>p.length>1)||draft.editor.multipart,part,editingHole,hole:editingHole?draft.editor.hole:0,innerSpace:holes.length>0};
  next.representatives=geometry.parts.flatMap((_,i)=>{const p=geometry.type==='Point'?geometry.parts[i]:geometry.type==='LineString'?geometry.parts[i]?.[0]:geometry.parts[i]?.[0]?.[0];return p&&!pending(p)?[[i,structuredClone(p)] as [number,MultipartCoord]]:[];});next.point=next.representatives[0]?.[1];
  return next;
}
