import JSZip from 'jszip';
import { readRawNativePackage } from './nativeArchive';
import { CONFIG_IMPORT_LIMITS, parseConfigJson, type ConfigImportOptions } from './archivePolicy';
import { TEMPORARY_REPORT_PATH } from './temporaryDiagnostic';

/** Keep the shared server reader and its fingerprint unchanged. The editor
 * reads optional diagnostic data only AFTER the existing complete integrity
 * boundary has accepted every declared file and path. */
export async function readEditorNativeContents(file:File,options:ConfigImportOptions={}):Promise<{config:unknown;configBytes:Uint8Array;temporary?:unknown;diagnosticIssue?:string}>{
  if(file.size>CONFIG_IMPORT_LIMITS.compressedBytes)throw Error('配置文件超过导入预算。');
  const bytes=new Uint8Array(await file.arrayBuffer());
  const config=await readRawNativePackage({size:bytes.byteLength,arrayBuffer:async()=>bytes.buffer} as File,options);
  if(bytes[0]!==0x50||bytes[1]!==0x4b)return {config,configBytes:bytes};
  const zip=await JSZip.loadAsync(bytes),configBytes=await zip.file('config.json')!.async('uint8array'),entry=zip.file(TEMPORARY_REPORT_PATH);
  let temporary:unknown,diagnosticIssue:string|undefined;
  if(entry)try{temporary=parseConfigJson(await entry.async('string'));}catch{diagnosticIssue='临时报告格式无法读取，确认后将重新核验配置。';}
  return {config,configBytes,temporary,diagnosticIssue};
}
