import catalog from './remoteFeedbackCatalog.json';
export type FeedbackLanguage='zh'|'en';
const entries:Record<string,{zh:string;en:string}>=catalog;
/** Presentation only: never rewrite a report or any signed/hash-pinned bytes. */
export function remoteFeedback(code:string,raw='',language:FeedbackLanguage='zh'):string{
 return entries[code]?.[language]?.trim()||raw.trim()||(language==='zh'?'服务端返回了未识别的诊断，请查看原始详情。':'Unrecognized server diagnostic. See original details.');
}
export function remoteError(raw:unknown,language:FeedbackLanguage='zh'):string{
 const text=raw instanceof Error?raw.message:String(raw),code=text.replace(/^Error:\s*/,'').match(/^[A-Za-z][A-Za-z0-9_-]+/)?.[0]??'';
 const translated=remoteFeedback(code,text,language);
 return translated===text?text:translated+' ['+code+']\n'+text;
}
export function remoteState(code:string,language:FeedbackLanguage='zh'){return remoteFeedback(code,code,language);}
