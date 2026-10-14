import type { RenderLabelStyle } from './types';

export type LabelToken = { kind: 'field' | 'literal'; value: string };
const cache = new WeakMap<RenderLabelStyle, readonly LabelToken[]>();
const forbidden = new Set(['__proto__', 'prototype', 'constructor']);
export function parseLabelTemplate(template: string): readonly LabelToken[] {
  if (!template || template.length > 8192) throw Error('组合来源必须填写，且不能超过 8192 字符。');
  const tokens: LabelToken[] = []; let literal = '';
  const push = (kind: LabelToken['kind'], value: string) => { if (value) tokens.push({kind,value}); if (tokens.length > 256) throw Error('组合来源不能超过 256 个片段。'); };
  const escaped = (value: string) => value === 'n' ? '\n' : value === 't' ? '\t' : value === '"' || value === '\\' ? value : (() => { throw Error('仅支持 \\"、\\\\、\\n、\\t 转义。'); })();
  for (let i=0;i<template.length;i++) {
    const char=template[i];
    if (char==='\\') { if (++i>=template.length) throw Error('转义不完整。'); literal+=escaped(template[i]); continue; }
    if (char!=='"') { literal+=char; continue; }
    push('literal',literal);literal='';let path='';let closed=false;
    while (++i<template.length) { if(template[i]==='"'){closed=true;break;} if(template[i]==='\\')throw Error('字段引用内不能转义；路径请使用实际字段名。');path+=template[i]; }
    if(!closed)throw Error('字段引用缺少结束双引号。');
    if(!/^[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*$/.test(path)||path.split('.').some(part=>forbidden.has(part)))throw Error(`非法字段路径：${path}`);
    push('field',path);
  }
  push('literal',literal);if(!tokens.some(token=>token.kind==='field'))throw Error('组合来源至少引用一个字段。');return Object.freeze(tokens);
}
export function labelTemplateTokens(label:RenderLabelStyle):readonly LabelToken[]{
  if(Object.isFrozen(label)){let tokens=cache.get(label);if(!tokens){tokens=parseLabelTemplate(label.template??'');cache.set(label,tokens);}return tokens;}
  return parseLabelTemplate(label.template??'');
}
export function labelScalar(value:unknown):string|undefined {
  if(value===null||value===undefined)return undefined;
  if(typeof value!=='string'&&typeof value!=='number'&&typeof value!=='boolean')return undefined;
  if(typeof value==='number'&&!Number.isFinite(value))return undefined;
  const result=String(value).trim();return result||undefined;
}
export function evaluateLabelTemplate(tokens:readonly LabelToken[],read:(path:string)=>unknown):string|undefined {
  let result='';for(const token of tokens){const text=token.kind==='literal'?token.value:labelScalar(read(token.value));if(text===undefined)return undefined;result+=text;if(result.length>16384)return undefined;}return result.trim()||undefined;
}
/** All native geometry, collision and click plans receive this one resolved text. */
export function resolveLabelText(label:RenderLabelStyle,read:(path:string)=>unknown,format:(value:string,kind?:'plain'|'floorLabel')=>string,fallback:()=>string):string {
  if(label.sourceMode==='combined'){
    const text=evaluateLabelTemplate(labelTemplateTokens(label),read);if(text!==undefined)return format(text,label.valueFormat);
  } else {
    if(!label.source)return 'Null';const text=labelScalar(read(label.source));if(text!==undefined)return format(text,label.valueFormat);
  }
  for(const source of label.fallbackSources??[]){const text=labelScalar(read(source));if(text!==undefined)return format(text,label.fallbackValueFormats?.[source]??label.valueFormat);}
  return fallback();
}
