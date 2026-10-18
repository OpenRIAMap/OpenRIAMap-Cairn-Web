import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {buildConfigPackageArchive,readConfigPackage} from '../../src/configStudio/package';
import {validateConfigPackage} from '../../src/configStudio/runtime';
import assert from 'node:assert/strict';
const out='docs/90_roadmap-and-history/runtime-v32-release-repair-20261017';fs.mkdirSync(out,{recursive:true});
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const inputs=['src/configStudio/defaults/r11-r7.config.json','src/configStudio/defaults/r10-r6.config.json','src/configStudio/defaults/r9-r5.config.json','src/configStudio/defaults/r8-r4.config.json','src/configStudio/native-contract-schema.generated.json'].map(file=>{const raw=fs.readFileSync(file);return {file,bytes:raw.length,sha256:hash(raw)};});
assert.equal(inputs[0].sha256,'982e1c0b6dc004dd90ee1ff92cd502dfb0f77a9ef4c53bb5a707a2c188460d7e');
const old='docs/90_roadmap-and-history/runtime-v32-release-audit-20261016',manifest=JSON.parse(fs.readFileSync(path.join(old,'evidence-manifest.json'),'utf8'));
for(const file of manifest.files)assert.equal(hash(fs.readFileSync(path.join(old,file.file))),file.sha256,`Original evidence changed: ${file.file}`);
const config=JSON.parse(fs.readFileSync(inputs[0].file,'utf8')),filename='r11-r7.initial.cairn-config-v3.zip',target=path.join(out,filename);
// Once created, a baseline ZIP is immutable; repeated verification reads it.
if(!fs.existsSync(target)){const blob=await buildConfigPackageArchive(config,validateConfigPackage(config));fs.writeFileSync(target,new Uint8Array(await blob.arrayBuffer()));}
assert.deepEqual(await readConfigPackage(new File([fs.readFileSync(target)],filename)),config);
const archive=fs.readFileSync(target);
fs.writeFileSync(path.join(out,'initial-baseline.json'),JSON.stringify({productBaseline:'955030f',auditBaseline:'754f111',blueprint:'ebb6aac',contractRevision:11,revision:7,inputs,zip:{file:filename,bytes:archive.length,sha256:hash(archive)},originalEvidenceFilesVerified:manifest.files.length,policy:'Keep these tracked inputs immutable; add new revision files and explicit migrations. The ZIP is a functional archive of the same JSON content; its config.json is canonical compact text, while the source JSON SHA refers to the original source bytes.'},null,2)+'\n');
console.log('Initial r11 JSON/ZIP/schema frozen; original audit evidence unchanged');
