import assert from 'node:assert/strict';
import fs from 'node:fs';
import seed from '../../src/configStudio/defaults/r9-r5.config.json';
import {prepareConfigForActivation} from '../../src/configStudio/configActivation';
import {resolveGeometryProfile,hasCategoryNode} from '../../src/configStudio/runtime';
import {prepareNativeFeatureImport} from '../../src/configStudio/nativeFeatureImport';
import {prepareDownstreamNativeImport} from '../../src/components/Mapping/Workflow/downstreamNativeImport';
import {recordClassification,findEditingWorkflow} from '../../src/configStudio/workflowEditing';
import {resolveConfigRuntimeRule,resolveConfigRuntimeCardOverride} from '../../src/components/Rules/configRuntime/configPackageAdapter';
import {FeatureStore} from '../../src/components/Rules/data/featureStore';
import {buildFeatureMeta,type FeatureRecord} from '../../src/components/Rules/rendering/renderRules';
import {geometryTypeFromFeatureType,readMultipartGeometry,firstMultipartCoordinate,flattenMultipartCoordinates} from '../../src/core/geometry/multipartGeometry';
import type {ConfigPackageV3} from '../../src/configStudio/types';

const features:Record<string,unknown>[]=JSON.parse(fs.readFileSync('.cache/sync01-data/features.json','utf8'));
const config=prepareConfigForActivation(seed as ConfigPackageV3);
const failures:{id:unknown;stage:string;message:string}[]=[],importRejections:typeof failures=[];
const records:FeatureRecord[]=features.flatMap((featureInfo,index)=>{
 const kind=geometryTypeFromFeatureType(featureInfo.Type);
 if(!kind){failures.push({id:featureInfo.ID,stage:'type',message:String(featureInfo.Type)});return [];}
 const read=readMultipartGeometry(featureInfo,kind);
 if(!read.geometry){failures.push({id:featureInfo.ID,stage:'geometry',message:read.error??'missing'});return [];}
 const type=kind==='Point'?'Points':kind==='LineString'?'Polyline':'Polygon',cls=String(featureInfo.Class);
 const record:FeatureRecord={uid:`sync01#${index}`,featureInfo,type,meta:buildFeatureMeta(featureInfo,cls,type,'formal'),multipartGeometry:read.geometry};
 if(kind==='Point')record.p3=firstMultipartCoordinate(read.geometry)??undefined;else record.coords3=flattenMultipartCoordinates(read.geometry);
 const path=recordClassification(featureInfo);
 if(!config.nodes.some(node=>node.path.class===path.class&&!node.path.kind))failures.push({id:featureInfo.ID,stage:'class',message:JSON.stringify(path)});
 if(!resolveGeometryProfile(config,path,kind)?.enabled)failures.push({id:featureInfo.ID,stage:'geometry-profile',message:kind});
 try{prepareNativeFeatureImport(config,featureInfo,'zth');}catch(error){importRejections.push({id:featureInfo.ID,stage:'strict-native-import',message:String(error)});}
 return [record];
});
const store=new FeatureStore(records);let evaluations=0,cards=0,editRoutes=0;
const visibleByZoom:Record<number,number>={};
for(let zoom=0;zoom<=8;zoom++){
 let visible=0;
 for(const record of records){
  const ctx:any={worldId:'zth',zoomLevel:zoom,leafletZoom:zoom-3,inFloorView:false,activeBuildingUid:null,activeFloorSelector:null,activeBuildingFloorRefSet:null};
  const rule=resolveConfigRuntimeRule(config,record,ctx,null,store);
  if(rule)visible++;
  JSON.stringify(rule,(_key,value)=>{if(typeof value==='number')assert(Number.isFinite(value),`nonfinite ${record.featureInfo.ID}`);return value;});
  evaluations++;
 }
 visibleByZoom[zoom]=visible;
}
for(const record of records){if(resolveConfigRuntimeCardOverride(config,record))cards++;if(findEditingWorkflow(config,record.featureInfo))editRoutes++;}
let publishedImports=0;
for(const record of features){prepareDownstreamNativeImport(config,record,'zth',features);publishedImports++;}
for(const rejected of importRejections){const original=features.find(record=>record.ID===rejected.id)!;assert.throws(()=>prepareDownstreamNativeImport(config,{...original,Name:String(original.Name)+' changed'},'zth',features),'a modified legacy record must not inherit the import exception');assert.throws(()=>prepareDownstreamNativeImport(config,original,'eden',features),'world isolation');}
const legacyClassifications=features.filter(record=>!hasCategoryNode(config,recordClassification(record))).map(record=>({id:record.ID,classification:recordClassification(record)}));
const summary={records:records.length,evaluations,visibleByZoom,cards,editRoutes,failures,publishedImports,legacyClassifications,strictNativeImportAccepted:features.length-importRejections.length,strictNativeImportRejections:importRejections};
fs.writeFileSync('.cache/sync01-data/runtime-audit.json',JSON.stringify(summary,null,2));
console.log(JSON.stringify({...summary,strictNativeImportRejections:importRejections.slice(0,10)},null,2));
assert.equal(records.length,features.length,'all actual records need readable geometry');
assert.equal(failures.length,0,'current data must resolve classification and geometry');
