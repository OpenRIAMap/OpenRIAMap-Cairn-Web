import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import JSZip from 'jszip';
import {validateConfigPackage} from '../../src/configStudio/runtime';
import {readRawNativePackage} from '../../src/configStudio/nativeArchive';
import {verifyPublishedMirror} from './productionMirror';
const hash=(bytes:string|Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const bytes=await fs.readFile('src/configStudio/defaults/r11-r7.config.json'),config=JSON.parse(bytes.toString('utf8'));
if(hash(bytes)!=='982e1c0b6dc004dd90ee1ff92cd502dfb0f77a9ef4c53bb5a707a2c188460d7e')throw Error('Frozen r11/r7 changed');
const createdAt='2026-10-17T00:00:00.000Z',report={...validateConfigPackage(config),createdAt};if(!report.valid)throw Error('Seed semantic validation failed');
const files=[{path:'config.json',body:bytes},{path:'reports/validation-report.json',body:Buffer.from(JSON.stringify(report,null,2)+'\n')},{path:'reports/v1-parity-report.json',body:Buffer.from(JSON.stringify(config.parity,null,2)+'\n')}];
const manifest={schemaVersion:'cairnmap.config-package-manifest.v3',packageId:config.packageId,projectId:config.projectId,contractRevision:11,revision:7,createdAt,sourceManifestSha256:config.sourceManifestSha256,files:files.map(file=>({path:file.path,sha256:hash(file.body),byteLength:file.body.length}))};
const manifestBody=Buffer.from(JSON.stringify(manifest,null,2)+'\n'),zip=new JSZip();
for(const file of [...files,{path:'manifest.json',body:manifestBody}])zip.file(file.path,file.body,{date:new Date(createdAt),createFolders:false});
const archive=await zip.generateAsync({type:'uint8array',compression:'DEFLATE',compressionOptions:{level:6}});
await readRawNativePackage(new File([archive],'seed.zip'));
const identity={releaseId:'v3-r11-r7-seed',packageId:config.packageId,projectId:config.projectId,revision:7,contractRevision:11,configSha256:hash(bytes),manifestSha256:hash(manifestBody),configUrl:`/configuration/releases/${hash(bytes)}/config.json`};
const folder=path.join('public','configuration','releases',identity.configSha256),outputs=new Map<string,Uint8Array>([
  [path.join(folder,'config.json'),bytes],[path.join(folder,'manifest.json'),manifestBody],[path.join(folder,'package.zip'),archive],
  [path.join(folder,'release.json'),Buffer.from(JSON.stringify({schemaVersion:'cairnmap.configuration-release.v1',identity,archiveSha256:hash(archive),rulesVersion:'cairnmap-r11-production-1',createdAt},null,2)+'\n')],
]);
for(const [file,body] of outputs){if(process.argv.includes('--check')){if(!Buffer.from(await fs.readFile(file)).equals(Buffer.from(body)))throw Error('Registered seed artifact changed: '+file);}else{await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,body);}}
try{await fs.access('public/configuration/current.json');}catch{if(process.argv.includes('--check'))throw Error('Published mirror pointer missing');await fs.writeFile('public/configuration/current.json',JSON.stringify(identity,null,2)+'\n');}
const current=await verifyPublishedMirror();
console.log(`Registered r11/r7 seed ${process.argv.includes('--check')?'verified':'prepared'}: original JSON unchanged; archive ${archive.length} bytes; manifest ${identity.manifestSha256}`);
console.log(`Published mirror verified independently: r${current.identity.revision}, ${current.identity.releaseId}.`);
