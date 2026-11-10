export {validateMediaPolicy} from '../../src/configStudio/mediaPolicy';
import {CONTRACT_CAPABILITIES,supportsContract} from '../../src/configStudio/contract';
export {CONTRACT_CAPABILITIES};
import {recordClassificationEligible} from '../../src/configStudio/workflowClassificationGroup';
import { validateNavigationRecords } from '../../src/configStudio/navigationValidation';
export {stableConfigText as configurationSnapshotText} from '../../src/configRuntime/configurationFingerprint';
import {readableClassification} from '../../src/configRuntime/classificationCompatibility';
import {geometryTypeFromFeatureType} from '../../src/core/geometry/multipartGeometry';
import { File } from 'node:buffer';
import { createHash } from 'node:crypto';
import JSZip from 'jszip';
import { readRawNativePackage } from '../../src/configStudio/nativeArchive';
import { validateConfigPackage, resolveGeometryProfile, hasCategoryNode, readRecordPath } from '../../src/configStudio/runtime';
import { readMultipartGeometry, validateMultipartGeometry } from '../../src/core/geometry/multipartGeometry';
import { recordCategory } from '../../src/configStudio/multipartPolicy';
import {validateV3WorkflowRecords} from '../../src/configStudio/workflowKernel';
import {assertStructureTargets} from '../../src/configStudio/structureCommit';
import {resolveNodeFieldSettings} from '../../src/configStudio/nodeFieldSettings';
import type { ConfigPackageV3, MountedFeatureRecord } from '../../src/configStudio/types';

export const rulesVersion='cairnmap-c19-production-1';
export const validateConfiguration=validateConfigPackage;
export async function validateConfigurationArchive(bytes:Uint8Array) {
  const config=await readRawNativePackage(new File([bytes], 'configuration.zip') as unknown as globalThis.File) as ConfigPackageV3;
  if(!supportsContract('publication',config.contractRevision))throw Error('Publication requires supported contracts '+CONTRACT_CAPABILITIES.publication.map(v=>'c'+v).join(', ')+'.');
  const report=validateConfigPackage(config);
  if(!report.valid)throw Object.assign(Error('configuration-semantic-validation-failed'),{report});
  const zip=await JSZip.loadAsync(bytes),configBody=await zip.file('config.json')!.async('uint8array'),manifestBody=await zip.file('manifest.json')!.async('uint8array');
  return {config,report,configBody,manifestBody,configSha256:createHash('sha256').update(configBody).digest('hex'),manifestSha256:createHash('sha256').update(manifestBody).digest('hex'),rulesVersion};
}
export function validatePublishedRecords(config:ConfigPackageV3,records:MountedFeatureRecord[]){return validateConfigPackage(config,records);}
export function validateRecordGeometry(config:ConfigPackageV3,record:MountedFeatureRecord):string[] {
  const raw=recordCategory(record),path=readableClassification(config,raw)??raw,node=config.nodes.find(node=>JSON.stringify(node.path)===JSON.stringify(path));
  if(!hasCategoryNode(config,path)||!node)return ['configuration-unknown-final-classification'];
  const type=node.geometryType??geometryTypeFromFeatureType(record.Type);
  if(!type)return ['configuration-geometry-not-defined'];
  if(!recordClassificationEligible(config,path,type))return ['configuration-unknown-final-classification'];
  if(geometryTypeFromFeatureType(record.Type)!==type)return ['configuration-record-type-mismatch'];
  const profile=resolveGeometryProfile(config,path,type),read=readMultipartGeometry(record,type);
  const error=read.error??validateMultipartGeometry(read.geometry);
  return [...(!profile?.enabled?['configuration-geometry-disabled']:[]),...(error?[error]:[]),...(read.geometry&&read.geometry.parts.length>1&&!profile?.allowMultipleParts?['configuration-single-part-required']:[])];
}
function worldId(config:ConfigPackageV3,value:unknown):string|undefined {
  return config.application?.worlds.find(world=>[world.id,String(world.numericCode),world.prefix,world.label.zh,world.label.en].includes(String(value)))?.id;
}
export function validateIncomingRecord(config:ConfigPackageV3,record:MountedFeatureRecord,expectedWorld?:string):string[] {
  const errors=validateRecordGeometry(config,record);if(errors.length)return errors;
  const world=worldId(config,record.World);if(!world||expectedWorld&&world!==expectedWorld)return ['configuration-record-world-mismatch'];
  const raw=recordCategory(record),classification=readableClassification(config,raw)??raw,geometry=config.nodes.find(node=>JSON.stringify(node.path)===JSON.stringify(classification))!.geometryType??geometryTypeFromFeatureType(record.Type)!;
  const output={id:'incoming-record',...(config.contractRevision>=15?{classificationGroup:{selectors:[{id:'record',mode:'self' as const,path:classification}]}}:{classification}),geometry:{selected:geometry},assignments:[]};
  return validateV3WorkflowRecords(config,{outputs:[output]} as any,[{outputId:output.id,classification,geometry,record}] as any).map(issue=>issue.message);
}
export function validateIncomingBatch(config:ConfigPackageV3,created:MountedFeatureRecord[],existing:MountedFeatureRecord[],deletes:Array<{worldId:string;classCode:string;featureId:string}>=[],options:{checkAffectedStructures?:boolean}={}):void {
  const identity=(record:MountedFeatureRecord)=>`${worldId(config,record.World)}:${record.ID}`;
  const writes=new Map<string,MountedFeatureRecord>();
  for(const record of created){
    const key=identity(record);
    if(writes.has(key))throw Error('configuration-record-id-duplicate');
    writes.set(key,record);
  }
  const removed=new Set(deletes.map(item=>JSON.stringify([item.worldId,item.classCode,item.featureId])));
  const surviving=existing.filter(record=>readableClassification(config,recordCategory(record))&&!removed.has(JSON.stringify([worldId(config,record.World),record.Class,record.ID]))).filter(record=>{
    const update=writes.get(identity(record));if(update&&update.Class!==record.Class)throw Error('configuration-record-id-collision');return !update;
  });
  const final=[...surviving,...created];
  if(options.checkAffectedStructures){
    const touched=new Set([...writes.keys(),...deletes.map(item=>`${item.worldId}:${item.featureId}`)]);
    const issues=final.flatMap(record=>{
      const role=resolveNodeFieldSettings(config,recordCategory(record)).value.structure;
      if(!role?.enabled||role.role!=='member')return [];
      const target=role.hostField?readRecordPath(record,role.hostField):undefined;
      const targetId=typeof target==='string'?target:undefined;
      const world=worldId(config,record.World);
      if(writes.get(identity(record))!==record&&!touched.has(`${world}:${targetId}`))return [];
      try {assertStructureTargets(config,[record],final.filter(row=>row!==record));return [];}
      catch(error){return [{message:(error as Error).message,worldId:world,targetId,businessKey:targetId,affectedFeatures:[{id:String(record.ID)}]}];}
    });
    if(issues.length)throw Object.assign(Error('configuration-batch-structure-invalid'),{issues});
  }else assertStructureTargets(config,created,surviving);
  const navigationIssues=validateNavigationRecords(config,final,options.checkAffectedStructures).filter(issue=>issue.severity==='error');
  if(navigationIssues.length)throw Object.assign(Error('configuration-navigation-relations-invalid'),{issues:navigationIssues});
}
