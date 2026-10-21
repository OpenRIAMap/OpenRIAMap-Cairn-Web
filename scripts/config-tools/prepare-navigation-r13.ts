import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import JSZip from 'jszip';
import {migrateConfigToR13} from '../../src/configStudio/r13Migration';
import {validateConfigPackage} from '../../src/configStudio/runtime';
import {buildConfigPackageArchive,readConfigPackage} from '../../src/configStudio/package';
import {validateConfigurationArchive} from '../../vendor/configuration-r11/r11-validation.mjs';

const out=path.resolve(process.argv[2]??'.artifacts/navigation-r13');
const identity=JSON.parse(await fs.readFile('public/configuration/current.json','utf8'));
const source=await fs.readFile('public'+identity.configUrl);
const hash=(value:Uint8Array)=>createHash('sha256').update(value).digest('hex');
if(hash(source)!==identity.configSha256)throw Error('Source identity mismatch');
const original=JSON.parse(source.toString('utf8'));
const {config,changes,unresolved}=migrateConfigToR13(original);
const report=validateConfigPackage(config);
if(!report.valid||unresolved.length)throw Error(JSON.stringify({unresolved,errors:report.issues.filter(i=>i.severity==='error')}));
const bytes=Buffer.from(await (await buildConfigPackageArchive(config,report)).arrayBuffer());
const imported=await readConfigPackage(new File([bytes],'navigation-r13.zip'));
if(JSON.stringify(imported)!==JSON.stringify(config)){
  // Archive sorting changes insertion order, never data.
  const stable=(v:unknown):string=>JSON.stringify(v,(_k,row)=>row&&typeof row==='object'&&!Array.isArray(row)?Object.fromEntries(Object.entries(row).sort(([a],[b])=>a.localeCompare(b))):row);
  if(stable(imported)!==stable(config))throw Error('Roundtrip differs');
}
await validateConfigurationArchive(bytes);
const zip=await JSZip.loadAsync(bytes);
await fs.mkdir(out,{recursive:true});
await fs.writeFile(path.join(out,'navigation-r13-candidate.zip'),bytes);
for(const entry of ['config.json','manifest.json','reports/validation-report.json','reports/application-dependencies.json'])await fs.writeFile(path.join(out,path.basename(entry)),await zip.file(entry)!.async('nodebuffer'));
const diff={source:identity,candidate:{revision:config.revision,contractRevision:config.contractRevision},unpublished:true,changes,unresolved,changedNodes:config.nodes.filter((n:any)=>JSON.stringify(n)!==JSON.stringify(original.nodes.find((v:any)=>v.nodeId===n.nodeId))).map((n:any)=>n.nodeId),workflowsUnchanged:JSON.stringify(config.workflows)===JSON.stringify(original.workflows),lookupTablesUnchanged:JSON.stringify(config.lookupTables)===JSON.stringify(original.lookupTables),dataLevelValidation:'not executed: no worlds mounted',serverArchiveValidated:true,zipSha256:hash(bytes)};
await fs.writeFile(path.join(out,'migration-diff.json'),JSON.stringify(diff,null,2)+'\n');
const hashes:Record<string,string>={};for(const file of await fs.readdir(out))if(file!=='SHA256.json'&&(file.endsWith('.json')||file.endsWith('.zip')))hashes[file]=hash(await fs.readFile(path.join(out,file)));
await fs.writeFile(path.join(out,'SHA256.json'),JSON.stringify(hashes,null,2)+'\n');
console.log(JSON.stringify({out,...diff}));
