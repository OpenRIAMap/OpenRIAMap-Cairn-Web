import fs from 'node:fs';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import {buildConfigPackageArchive,readConfigPackage} from '../../src/configStudio/package';
import {validateConfigPackage} from '../../src/configStudio/runtime';
import {CONFIG_IMPORT_LIMITS,inspectConfigZip,parseConfigJson} from '../../src/configStudio/archivePolicy';
const config=JSON.parse(fs.readFileSync('src/configStudio/defaults/r11-r7.config.json','utf8'));
const packed=await buildConfigPackageArchive(config,validateConfigPackage(config)),original=new Uint8Array(await packed.arrayBuffer());
let cases=0;
async function bad(mutate:(zip:JSZip,manifest:any)=>void|Promise<void>,message:RegExp){const zip=await JSZip.loadAsync(original),manifest=JSON.parse(await zip.file('manifest.json')!.async('string'));await mutate(zip,manifest);const bytes=await zip.generateAsync({type:'uint8array'});await assert.rejects(()=>readConfigPackage(new File([bytes],'bad.zip')),message);cases++;}
const manifestWrite=(zip:JSZip,manifest:any)=>zip.file('manifest.json',JSON.stringify(manifest));
await bad(zip=>zip.file('reports/validation-report.json','{}'),/哈希校验失败/);
await bad(zip=>zip.file('reports/v1-parity-report.json','{}'),/哈希校验失败/);
await bad((zip,m)=>manifestWrite(zip,{...m,schemaVersion:'unknown'}),/manifest 版本/);
for(const key of ['packageId','projectId','revision','contractRevision','sourceManifestSha256'])await bad((zip,m)=>manifestWrite(zip,{...m,[key]:typeof m[key]==='number'?m[key]+1:'other'}),/身份/);
await bad((zip,m)=>{m.files[0].byteLength++;manifestWrite(zip,m);},/byteLength/);
await bad((zip,m)=>{m.files[0].sha256='no';manifestWrite(zip,m);},/摘要格式/);
await bad((zip,m)=>{m.files.push(m.files[0]);manifestWrite(zip,m);},/重复/);
await bad(zip=>zip.remove('reports/validation-report.json'),/缺少声明文件/);
await bad((zip,m)=>{m.files=m.files.filter((row:any)=>row.path!=='reports/validation-report.json');zip.remove('reports/validation-report.json');manifestWrite(zip,m);},/必需文件/);
await bad(zip=>zip.file('extra.json','{}'),/未声明附加文件/);
await bad(zip=>zip.file('../unsafe.json','{}'),/路径不合法/);
// Duplicate central entry, which JSZip would otherwise collapse by name.
const view=new DataView(original.buffer,original.byteOffset,original.byteLength),end=original.length-22,start=view.getUint32(end+16,true),length=46+view.getUint16(start+28,true)+view.getUint16(start+30,true)+view.getUint16(start+32,true),duplicate=new Uint8Array(original.length+length);
duplicate.set(original.subarray(0,end));duplicate.set(original.subarray(start,start+length),end);duplicate.set(original.subarray(end),end+length);
const duplicatedView=new DataView(duplicate.buffer),nextEnd=end+length;duplicatedView.setUint16(nextEnd+8,view.getUint16(end+8,true)+1,true);duplicatedView.setUint16(nextEnd+10,view.getUint16(end+10,true)+1,true);duplicatedView.setUint32(nextEnd+12,view.getUint32(end+12,true)+length,true);
assert.throws(()=>inspectConfigZip(duplicate),/重复/);cases++;
const huge=original.slice(),hugeView=new DataView(huge.buffer);hugeView.setUint32(start+24,CONFIG_IMPORT_LIMITS.fileBytes+1,true);assert.throws(()=>inspectConfigZip(huge),/预算超限/);cases++;
await assert.rejects(()=>readConfigPackage({size:CONFIG_IMPORT_LIMITS.compressedBytes+1} as File),/超过导入预算/);cases++;
assert.throws(()=>parseConfigJson('['.repeat(65)+'0'+']'.repeat(65)),/嵌套深度/);cases++;
const controller=new AbortController();controller.abort();await assert.rejects(()=>readConfigPackage(new File([original],'cancel.zip'),{signal:controller.signal}),{name:'AbortError'});cases++;
const stages:string[]=[];assert.equal((await readConfigPackage(new File([original],'good.zip'),{onProgress:stage=>stages.push(stage)})).revision,config.revision);assert.ok(stages.length>=6);
for(const file of ['r8-r4.config.json','r9-r5.config.json','r10-r6.config.json','r11-r7.config.json']){const value=JSON.parse(fs.readFileSync('src/configStudio/defaults/'+file,'utf8')),zip=await buildConfigPackageArchive(value,validateConfigPackage(value));assert.equal((await readConfigPackage(new File([zip],file+'.zip'))).contractRevision,value.contractRevision);}
console.log(`release-archive: ${cases} malformed/budget/cancellation cases rejected; all declared raw bytes verified, four historical JSON/ZIP contracts readable`);
