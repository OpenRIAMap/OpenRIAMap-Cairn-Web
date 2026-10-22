import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {validateConfiguration,validateIncomingRecord,rulesVersion,CONTRACT_CAPABILITIES} from '../../vendor/configuration-r11/r11-validation.mjs';

const root=path.resolve(import.meta.dirname,'../..');
const hash=body=>crypto.createHash('sha256').update(body).digest('hex');
/** A CLI task pins the checked-out published mirror once. SCF tasks pin the
 * same authority through configuration-context; local drafts are never read. */
export function readFormalRelayContext(projectId,{publicRoot=path.join(root,'public'),identity:pinnedIdentity}={}){
  const identity=pinnedIdentity??JSON.parse(fs.readFileSync(path.join(publicRoot,'configuration/current.json'),'utf8'));
  if(identity.projectId!==projectId||!CONTRACT_CAPABILITIES.publication.includes(identity.contractRevision)||!/^[a-f0-9]{64}$/.test(identity.configSha256??'')||identity.configUrl!==`/configuration/releases/${identity.configSha256}/config.json`)throw Error('formal-relay-configuration-identity-invalid');
  const file=path.join(publicRoot,identity.configUrl.slice(1));
  if(fs.statSync(file).size>64*1024*1024)throw Error('formal-relay-configuration-budget');
  const bytes=fs.readFileSync(file),manifest=fs.readFileSync(path.join(path.dirname(file),'manifest.json'));
  if(hash(bytes)!==identity.configSha256||hash(manifest)!==identity.manifestSha256)throw Error('formal-relay-configuration-hash-mismatch');
  const config=JSON.parse(bytes),report=validateConfiguration(config);
  if(!report.valid||config.projectId!==identity.projectId||config.packageId!==identity.packageId||config.contractRevision!==identity.contractRevision||config.revision!==identity.revision)throw Error('formal-relay-configuration-invalid');
  const items=config.application.worlds,byId=new Map(items.map(item=>[item.id,item])),byNumeric=new Map(items.map(item=>[item.numericCode,item]));
  const classConfigs=new Map(config.nodes.filter(node=>!node.path.kind).map(node=>[node.path.class,{filePath:file,data:{classCode:node.path.class,identity:{idField:'ID'},classField:'Class',worldField:'World',classification:{kindField:'Kind',skindField:'SKind',skind2Field:'SKind2',options:config.nodes.filter(child=>child.path.class===node.path.class).map(child=>({kind:child.path.kind,skind:child.path.skind,skind2:child.path.skind2}))}}}]));
  return {projectId,worlds:{items,byId,byNumeric},classConfigs,configuration:config,configurationIdentity:identity,rulesVersion,validateRecord:(record,worldId)=>validateIncomingRecord(config,record,worldId)};
}
