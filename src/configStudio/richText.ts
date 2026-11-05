export type RichTextRun={text:string;fontSize?:number;bold?:boolean;italic?:boolean;underline?:boolean;color?:string;link?:string};
export type RichTextDocument={paragraphs:Array<{runs:RichTextRun[]}>};
export const emptyRichText=():RichTextDocument=>({paragraphs:[{runs:[{text:''}]}]});
export function safeRichTextLink(value:string):boolean {try{const url=new URL(value);return ['https:','http:','mailto:'].includes(url.protocol)&&!url.username&&!url.password;}catch{return false;}}
export function richTextProblems(value:RichTextDocument):string[]{
  const errors:string[]=[];let size=0,runs=0;
  if(value.paragraphs.length>500)errors.push('富文本最多 500 段。');
  for(const paragraph of value.paragraphs)for(const run of paragraph.runs){size+=run.text.length;runs++;if(run.fontSize!==undefined&&(!Number.isFinite(run.fontSize)||run.fontSize<8||run.fontSize>72))errors.push('字号必须为 8–72px。');if(run.color!==undefined&&!/^#[a-f\d]{6}$/i.test(run.color))errors.push('文字颜色必须为六位十六进制颜色。');if(run.link&&!safeRichTextLink(run.link))errors.push('链接仅允许无凭据的 HTTP、HTTPS 或 mailto 地址。');}
  if(size>100000||runs>5000)errors.push('富文本超过长度或格式片段数量限制。');
  return [...new Set(errors)];
}
export type Announcement={id:string;title:string;enabled:boolean;mode:'once'|'always';content:RichTextDocument};
