import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {resolve,relative,dirname,sep} from 'node:path';
import {createHash} from 'node:crypto';
import JSZip from 'jszip';
const root=resolve(import.meta.dirname,'../..'),folder=resolve(root,'legacy-v1'),destination=resolve(root,'dist/legacy-v1/runtime');
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
if(process.argv.includes('--freeze')){
  await import('./build-legacy-v1.mjs');
  const zip=new JSZip(),files=[];
  async function walk(directory){for(const item of await readdir(directory,{withFileTypes:true})){const file=resolve(directory,item.name);if(item.isDirectory())await walk(file);else{
    const path=relative(destination,file).split(sep).join('/'),bytes=await readFile(file);files.push({path,sha256:digest(bytes),byteLength:bytes.length});zip.file(path,bytes,{createFolders:false,date:new Date('2026-10-17T00:00:00Z')});
  }}}await walk(destination);
  files.sort((a,b)=>a.path.localeCompare(b.path));
  const bytes=await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE',compressionOptions:{level:6}}),snapshot=JSON.parse(await readFile(resolve(folder,'manifest.json'),'utf8'));
  const adapters={};for(const file of ['App.tsx','filter.ts','isolation.ts'])adapters[file]=digest(await readFile(resolve(folder,file)));
  await writeFile(resolve(folder,'runtime-5b3e9c2.zip'),bytes);
  const auditFilter=await readFile(resolve(root,'node_modules/.cache/cairnmap-legacy-v1/legacy-filter.mjs'));
  await writeFile(resolve(folder,'filter-runtime-5b3e9c2.mjs'),auditFilter);
  await writeFile(resolve(folder,'runtime-manifest.json'),JSON.stringify({schemaVersion:'cairnmap.legacy-v1.runtime.v1',baseCommit:'5b3e9c2',sourceArchiveSha256:snapshot.archiveSha256,archiveSha256:digest(bytes),auditFilterSha256:digest(auditFilter),dependencyLockSha256:digest(await readFile(resolve(root,'package-lock.json'))),adapters,files},null,2)+'\n');
  console.log(`Frozen V1 runtime: ${files.length} files, ${bytes.length} bytes.`);
}else{
  const manifest=JSON.parse(await readFile(resolve(folder,'runtime-manifest.json'),'utf8')),bytes=await readFile(resolve(folder,'runtime-5b3e9c2.zip'));
  if(digest(bytes)!==manifest.archiveSha256)throw Error('Frozen V1 runtime archive digest mismatch');
  if(digest(await readFile(resolve(folder,'source-5b3e9c2.zip')))!==manifest.sourceArchiveSha256)throw Error('Frozen V1 source archive digest mismatch');
  for(const [file,expected] of Object.entries(manifest.adapters))if(digest(await readFile(resolve(folder,file)))!==expected)throw Error('V1 adapter changed without an explicit freeze: '+file);
  if(digest(await readFile(resolve(folder,'filter-runtime-5b3e9c2.mjs')))!==manifest.auditFilterSha256)throw Error('Frozen V1 audit filter digest mismatch');
  const zip=await JSZip.loadAsync(bytes);if(Object.values(zip.files).filter(file=>!file.dir).length!==manifest.files.length)throw Error('Frozen V1 runtime layout mismatch');
  for(const entry of manifest.files){
    if(entry.path.split('/').some(part=>!part||part==='..'||part==='.')||/[\\:\x00-\x1f]/.test(entry.path))throw Error('Unsafe V1 runtime path');
    const body=await zip.file(entry.path)?.async('nodebuffer');if(!body||body.length!==entry.byteLength||digest(body)!==entry.sha256)throw Error('Frozen V1 runtime file changed: '+entry.path);
    const target=resolve(destination,entry.path);await mkdir(dirname(target),{recursive:true});await writeFile(target,body);
  }
  console.log(`Installed verified frozen V1 runtime: ${manifest.files.length} files; current dependencies cannot change its code or CSS.`);
}
