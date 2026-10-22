import assert from 'node:assert/strict';
import fs from 'node:fs';
import JSZip from 'jszip';
import { createHash } from 'node:crypto';
import { migrateConfigToR13 } from '../../src/configStudio/r13Migration';
import { buildConfigPackageArchive, buildTemporaryConfigArchive, readConfigPackage, readConfigPackageWithDiagnostics } from '../../src/configStudio/package';
import { validateConfigPackage } from '../../src/configStudio/runtime';
import { prepareConfigForActivation } from '../../src/configStudio/configActivation';
import { validateWorkspace, currentValidation } from '../../src/configStudio/workspaceValidation';
import { TEMPORARY_REPORT_PATH } from '../../src/configStudio/temporaryDiagnostic';

Object.assign(globalThis,{location:new URL('http://localhost:5298')});
const config=migrateConfigToR13(JSON.parse(fs.readFileSync('src/configStudio/defaults/r11-r7.config.json','utf8'))).config;
const broken=structuredClone(config);broken.application!.preferences.search.homepageLimit=0;
const run=await validateWorkspace(broken,[],4);assert(!run.report.valid);assert(currentValidation(run,4));assert(!currentValidation(run,5));
await assert.rejects(()=>buildConfigPackageArchive(broken,run.report),/配置无效/);
assert.throws(()=>prepareConfigForActivation(broken),/无效配置/);
await assert.rejects(()=>buildTemporaryConfigArchive(broken,run,5),/核验已失效/);
await assert.rejects(()=>buildTemporaryConfigArchive(config,run,4),/核验已失效/);
const archive=await buildTemporaryConfigArchive(broken,run,4),bytes=await archive.arrayBuffer(),zip=await JSZip.loadAsync(bytes);
assert(zip.file(TEMPORARY_REPORT_PATH));
const imported=await readConfigPackageWithDiagnostics(new File([bytes],'temporary.zip'));
assert.equal(imported.config.application!.preferences.search.homepageLimit,0);assert.equal(imported.config.revision,broken.revision);
assert.equal(imported.recheckReason,undefined);assert.deepEqual(imported.diagnostic!.report,run.report);
assert.equal(imported.diagnostic!.scope.mountedData,false);assert.equal(validateConfigPackage(await readConfigPackage(new File([bytes],'compat.zip'))).valid,false,'compatible reader permits isolated editing, never activation');
async function editReport(edit:(report:any)=>void|boolean){
  const copy=await JSZip.loadAsync(bytes),manifest=JSON.parse(await copy.file('manifest.json')!.async('string'));
  const body=JSON.parse(await copy.file(TEMPORARY_REPORT_PATH)!.async('string'));
  if(edit(body)===false){copy.remove(TEMPORARY_REPORT_PATH);manifest.files=manifest.files.filter((file:any)=>file.path!==TEMPORARY_REPORT_PATH);}
  else{const text=JSON.stringify(body),entry=manifest.files.find((file:any)=>file.path===TEMPORARY_REPORT_PATH);entry.sha256=createHash('sha256').update(text).digest('hex');entry.byteLength=Buffer.byteLength(text);copy.file(TEMPORARY_REPORT_PATH,text);}
  copy.file('manifest.json',JSON.stringify(manifest));return new File([await copy.generateAsync({type:'uint8array'})],'edited.zip');
}
assert.equal((await readConfigPackageWithDiagnostics(await editReport(()=>false))).diagnostic,undefined,'temporary report is optional');
assert.match((await readConfigPackageWithDiagnostics(await editReport(body=>{body.configuration.contractRevision=12;}))).recheckReason!,/契约/);
assert.match((await readConfigPackageWithDiagnostics(await editReport(body=>{body.validator.fingerprint='outdated';}))).recheckReason!,/核验器/);
assert.match((await readConfigPackageWithDiagnostics(await editReport(body=>{body.configuration.configSha256='0'.repeat(64);}))).recheckReason!,/摘要/);
assert.match((await readConfigPackageWithDiagnostics(await editReport(body=>{body.report.valid=true;}))).recheckReason!,/格式无效/,'a forged pass report cannot authorize a failed configuration');
const damaged=await JSZip.loadAsync(bytes);damaged.remove(TEMPORARY_REPORT_PATH);
const damagedBytes=await damaged.generateAsync({type:'uint8array'});
await assert.rejects(()=>readConfigPackageWithDiagnostics(new File([damagedBytes],'missing-declared-report.zip')),/缺少声明文件/);
const passed=validateConfigPackage(config),formal=await buildConfigPackageArchive(config,passed),formalZip=await JSZip.loadAsync(await formal.arrayBuffer());
assert.equal(formalZip.file(TEMPORARY_REPORT_PATH),null);assert(formalZip.file('reports/validation-report.json'));
assert.equal((await readConfigPackageWithDiagnostics(new File([formal],'formal.zip'))).diagnostic,undefined);
assert.equal((await readConfigPackageWithDiagnostics(new File([JSON.stringify(config)],'config.json'))).config.contractRevision,13);
console.log('Temporary packages: failed full validation, strict formal gate, normal config bytes/revision, optional report, identity/rules mismatch, forged report, manifest damage, JSON/ZIP compatibility and clean formal re-export passed.');
