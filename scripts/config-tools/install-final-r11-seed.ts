import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {migrateConfigToR11} from '../../src/configStudio/r11Migration';
import {validateConfigPackage} from '../../src/configStudio/runtime';
import {buildConfigPackageArchive,readConfigPackage} from '../../src/configStudio/package';
import {stableConfigText} from '../../src/configStudio/defaultConfigProvider';

const base='src/configStudio/defaults',out='docs/90_roadmap-and-history/runtime-v32-postc-v11-20261015';
const sha=(value:string|Uint8Array)=>createHash('sha256').update(value).digest('hex');
const oldBytes=fs.readFileSync(base+'/r10-r6.config.json');
assert.equal(sha(oldBytes),'e42b6047c8459ffd00bbe196cdc8194f220dfc65b2e0ce5963fde4e42b9ef292');
if(!fs.existsSync(base+'/manifest-r10-r6.json')) {
  const prior=JSON.parse(fs.readFileSync(base+'/manifest.json','utf8'));assert.equal(prior.contractRevision,10);
  fs.copyFileSync(base+'/manifest.json',base+'/manifest-r10-r6.json');
}
const old=JSON.parse(fs.readFileSync(base+'/manifest-r10-r6.json','utf8'));
const migration=migrateConfigToR11(JSON.parse(oldBytes.toString('utf8'))),config=migration.config;
config.revision=7;config.displayName={zh:'V3.2：Post-C 完整配置工作台 r7',en:'V3.2 Post-C configurable application r7'};
const report=validateConfigPackage(config);
assert(report.valid,JSON.stringify(report.issues.filter(issue=>issue.severity==='error')));
assert.equal(config.nodes.length,95);assert.equal(config.workflows.length,28);
assert.deepEqual(config.lookupTables!.map(table=>table.id),['teleport-hubs','road-travel-modes','standard-tag-fields']);
const bytes=JSON.stringify(config,null,2)+'\n',{parity:_parity,...content}=config,semanticFingerprint=sha(stableConfigText(content));
fs.writeFileSync(base+'/r11-r7.config.json',bytes);fs.writeFileSync(out+'/OpenRIAMap_V32_PostC_v1_1_r7.config.json',bytes);
const manifest={packageId:config.packageId,seedFile:'r11-r7.config.json',revision:7,contractRevision:11,sha256:sha(bytes),semanticFingerprint,legacyDefaultFingerprints:[...new Set([...old.legacyDefaultFingerprints,old.semanticFingerprint])]};
fs.writeFileSync(base+'/manifest.json',JSON.stringify(manifest,null,2)+'\n');
const zip=await buildConfigPackageArchive(config,report),zipBytes=new Uint8Array(await zip.arrayBuffer()),roundtrip=await readConfigPackage(zip);
assert(stableConfigText(roundtrip)===stableConfigText(config),'r11 ZIP roundtrip must retain the complete configuration');
fs.writeFileSync(out+'/OpenRIAMap_V32_PostC_v1_1_r7.zip',zipBytes);
fs.writeFileSync(out+'/delivery-manifest.json',JSON.stringify({...manifest,jsonSha256:sha(bytes),zipSha256:sha(zipBytes),sourceR10Sha256:sha(oldBytes),nodes:95,workflows:28,tables:config.lookupTables!.length,applicationModules:6,stage:'Post-C v1.1; local implementation only; no upstream sync, remote push or V3 promotion',navigationTableConsumers:'unchanged; deferred until downstream promotion',migration:migration.changes},null,2)+'\n');
fs.writeFileSync(out+'/validation-report.json',JSON.stringify(report,null,2)+'\n');
console.log(`Installed r11/r7 default: ${manifest.sha256}; ZIP ${sha(zipBytes)}; frozen r10/r6 untouched; complete archive roundtrip passed.`);
