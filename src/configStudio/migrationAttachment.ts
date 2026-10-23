import type {MigrationReport} from './contractMigration';
export type ImportOriginal={name:string;type:string;bytes:Uint8Array;sha256:string};
export type MigrationAttachment={original?:ImportOriginal;report?:MigrationReport;resultSha256?:string};
export async function captureImportOriginal(file:File):Promise<ImportOriginal>{
  if(file.size>50*1024*1024)throw Error('导入原件超过 50 MiB，未替换当前工作区。');
  const bytes=new Uint8Array(await file.arrayBuffer());
  const digest=await crypto.subtle.digest('SHA-256',bytes);
  return {name:file.name,type:file.type,bytes,sha256:Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('')};
}
export function downloadOriginal(value:ImportOriginal):void{
  const url=URL.createObjectURL(new Blob([value.bytes],{type:value.type||'application/octet-stream'}));
  const anchor=document.createElement('a');anchor.href=url;anchor.download=value.name;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function readMigrationReport(value:unknown):MigrationReport|undefined{
  const v=value as MigrationReport;
  if(!v||v.schemaVersion!=='cairnmap.contract-migration.v1'||!Number.isSafeInteger(v.source)||!Number.isSafeInteger(v.target)||!Array.isArray(v.steps)||!v.steps.every(x=>typeof x==='string')||typeof v.migratorVersion!=='string'||!Array.isArray(v.changes)||v.changes.length>100000||!Array.isArray(v.dismissed)||!v.dismissed.every(x=>typeof x==='string'))return;
  if(v.changes.some(row=>!row||!['default','converted','removed','optional','unresolved'].includes(row.kind)||[row.id,row.path,row.message,row.component].some(x=>typeof x!=='string')))return;
  return structuredClone(v);
}
