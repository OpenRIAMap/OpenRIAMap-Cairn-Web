/** Import resource policy, not a file-contract limit. Calibrated against the
 * frozen r11 package and 495-node (~25 MiB pretty JSON) scale fixture. */
export const CONFIG_IMPORT_LIMITS = Object.freeze({ compressedBytes:64*1024*1024, totalBytes:128*1024*1024, fileBytes:64*1024*1024, entries:512, jsonDepth:64 });
export type ConfigImportOptions = {signal?:AbortSignal;onProgress?:(stage:string)=>void};
export function importProgress(options:ConfigImportOptions,stage:string):void {options.signal?.throwIfAborted();options.onProgress?.(stage);}
export function parseConfigJson(text:string):unknown {
  let depth=0,quoted=false,escape=false;
  for(const char of text){if(quoted){if(escape)escape=false;else if(char==='\\')escape=true;else if(char==='"')quoted=false;}else if(char==='"')quoted=true;else if(char==='{'||char==='['){if(++depth>CONFIG_IMPORT_LIMITS.jsonDepth)throw Error(`JSON 嵌套深度超过导入预算 ${CONFIG_IMPORT_LIMITS.jsonDepth}；请离线检查后拆除无效嵌套。`);}else if(char==='}'||char===']')depth--;}
  return JSON.parse(text);
}
export function safeArchivePath(path:string):boolean {return Boolean(path)&&!/[\\\x00-\x1f:]/.test(path)&&!path.startsWith('/')&&path.split('/').every((part,index,parts)=>part!=='.'&&part!=='..'&&(part!==''||index===parts.length-1));}
/** Inspect original central directory before JSZip normalises paths or hides
 * duplicate entries. ZIP64/multidisk are explicitly outside this budget. */
export function inspectConfigZip(bytes:Uint8Array):Map<string,number> {
  const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),names=new Map<string,number>();
  let end=-1;
  for(let at=bytes.length-22;at>=Math.max(0,bytes.length-65557);at--)if(view.getUint32(at,true)===0x06054b50&&at+22+view.getUint16(at+20,true)===bytes.length){end=at;break;}
  if(end<0)throw Error('ZIP 目录损坏。');
  const count=view.getUint16(end+10,true),size=view.getUint32(end+12,true),offset=view.getUint32(end+16,true);
  if(view.getUint16(end+4,true)||view.getUint16(end+6,true)||view.getUint16(end+8,true)!==count||count===65535||offset===0xffffffff||size===0xffffffff)throw Error('不支持多卷或 ZIP64 配置归档；请使用标准配置 ZIP/JSON。');
  if(count>CONFIG_IMPORT_LIMITS.entries)throw Error(`ZIP 条目 ${count} 超过导入预算 ${CONFIG_IMPORT_LIMITS.entries}。`);
  if(offset+size>end)throw Error('ZIP 目录范围无效。');
  let at=offset,total=0;
  for(let index=0;index<count;index++){
    if(at+46>offset+size||view.getUint32(at,true)!==0x02014b50)throw Error('ZIP 条目损坏。');
    const length=view.getUint16(at+28,true),extra=view.getUint16(at+30,true),comment=view.getUint16(at+32,true),fileSize=view.getUint32(at+24,true);
    if(at+46+length+extra+comment>offset+size)throw Error('ZIP 条目名称范围无效。');
    const name=new TextDecoder('utf-8',{fatal:true}).decode(bytes.subarray(at+46,at+46+length));
    if(!safeArchivePath(name)||names.has(name))throw Error(`ZIP 路径不合法或重复：${name}`);
    if(fileSize>CONFIG_IMPORT_LIMITS.fileBytes||(total+=fileSize)>CONFIG_IMPORT_LIMITS.totalBytes)throw Error(`ZIP 解压预算超限：单文件 ${fileSize} / ${CONFIG_IMPORT_LIMITS.fileBytes} 字节，累计 ${total} / ${CONFIG_IMPORT_LIMITS.totalBytes} 字节。请离线检查或调整集中导入策略。`);
    names.set(name,fileSize);at+=46+length+extra+comment;
  }
  if(at!==offset+size)throw Error('ZIP 目录长度不一致。');
  return names;
}
