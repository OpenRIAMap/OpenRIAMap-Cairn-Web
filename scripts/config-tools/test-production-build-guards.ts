import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
import JSZip from 'jszip';
import { buildConfigPackageArchive } from '../../src/configStudio/package';
import { validateConfigPackage } from '../../src/configStudio/runtime';
import { migrateConfigToR12 } from '../../src/configStudio/r12Migration';
import { migrateConfigToR13 } from '../../src/configStudio/r13Migration';
import { validateProductionBuild } from './validate-production-build';
import type { ConfigPackageV3 } from '../../src/configStudio/types';
const sha=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const old=JSON.parse(await fs.readFile('src/configStudio/defaults/r11-r7.config.json','utf8')) as ConfigPackageV3;
const root=await fs.mkdtemp(path.join(os.tmpdir(),'cairn-build-guards-'));
const removeFixture=async(target:string)=>{
  const resolved=path.resolve(target),temporary=path.resolve(os.tmpdir())+path.sep;
  assert(root.startsWith(temporary)&&path.basename(root).startsWith('cairn-build-guards-'));
  assert(resolved===root||resolved.startsWith(root+path.sep),'cleanup must stay in this new temporary fixture');
  await fs.rm(resolved,{recursive:true});
};
async function release(config:ConfigPackageV3,mutate?:(c:any)=>void){
  const zip=await JSZip.loadAsync(await (await buildConfigPackageArchive(config,validateConfigPackage(config))).arrayBuffer());
  if(mutate){
    const changed=JSON.parse(await zip.file('config.json')!.async('string'));mutate(changed);
    const bytes=Buffer.from(JSON.stringify(changed)),manifest=JSON.parse(await zip.file('manifest.json')!.async('string'));
    zip.file('config.json',bytes);const entry=manifest.files.find((r:any)=>r.path==='config.json');entry.sha256=sha(bytes);entry.byteLength=bytes.length;zip.file('manifest.json',JSON.stringify(manifest));
  }
  const raw=await zip.file('config.json')!.async('nodebuffer'),manifest=await zip.file('manifest.json')!.async('nodebuffer'),archive=await zip.generateAsync({type:'nodebuffer'});
  const identity={releaseId:'config-guard-r'+config.contractRevision,packageId:config.packageId,projectId:config.projectId,revision:config.revision,contractRevision:config.contractRevision,configSha256:sha(raw),manifestSha256:sha(manifest),configUrl:`/configuration/releases/${sha(raw)}/config.json`};
  const dir=path.join(root,'configuration/releases',identity.configSha256);await fs.mkdir(dir,{recursive:true});
  for(const [name,bytes] of [['config.json',raw],['manifest.json',manifest],['package.zip',archive],['release.json',Buffer.from(JSON.stringify({schemaVersion:'cairnmap.configuration-release.v1',identity,archiveSha256:sha(archive)}))]] as const)await fs.writeFile(path.join(dir,name),bytes);
  return {dir,identity};
}
try{
  const seed=await release(old);await fs.writeFile(path.join(root,'configuration/current.json'),JSON.stringify(seed.identity));
  const r12=migrateConfigToR12(old).config,r13=migrateConfigToR13(old).config;
  await release(r12);await release(r13);
  assert.equal((await validateProductionBuild(root)).verifiedReleases,3,'unactivated r12/r13 candidates are verified beside r11 current');
  const renamed=JSON.parse(JSON.stringify(r13).replaceAll('class-sbp','legitimate-building-node'));renamed.revision=55;assert(validateConfigPackage(renamed).valid);
  const changed=await release(renamed);await fs.writeFile(path.join(root,'configuration/current.json'),JSON.stringify(changed.identity));assert.equal((await validateProductionBuild(root)).current.revision,55,'legal internal-ID changes cannot block production builds');
  await fs.writeFile(path.join(root,'configuration/current.json'),JSON.stringify({...changed.identity,contractRevision:14}));await assert.rejects(()=>validateProductionBuild(root),/identity/);
  await fs.writeFile(path.join(root,'configuration/current.json'),JSON.stringify(changed.identity));
  const original=await fs.readFile(path.join(changed.dir,'config.json'));await fs.appendFile(path.join(changed.dir,'config.json'),' ');await assert.rejects(()=>validateProductionBuild(root),/digest/);await fs.writeFile(path.join(changed.dir,'config.json'),original);
  const archive=await fs.readFile(path.join(changed.dir,'package.zip'));await fs.writeFile(path.join(changed.dir,'package.zip'),archive.subarray(0,100));await assert.rejects(()=>validateProductionBuild(root));await fs.writeFile(path.join(changed.dir,'package.zip'),archive);
  for(const mutate of [(c:any)=>c.nodes[0].children.push('missing-node'),(c:any)=>c.resources.iconLibraries[0].manifestSha256='0'.repeat(64)]){
    const invalid=await release(r13,mutate);await assert.rejects(()=>validateProductionBuild(root),'invalid staged package must fail while current stays valid');await removeFixture(invalid.dir);
  }
  console.log('Production build guards: r11/r12/r13, unactivated candidates, legal node-ID rename, unknown contract, digest/ZIP damage, references and resource incompatibility passed.');
}finally{await removeFixture(root);}
