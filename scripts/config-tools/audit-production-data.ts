import {readableClassification} from '../../src/configRuntime/classificationCompatibility';
import fs from 'node:fs/promises';
import path from 'node:path';
import { resolveFormalWorldRelease, loadFormalWorldFeatures } from '../../src/components/Rules/data/formalReleaseReader';
import { validateConfigPackage, hasCategoryNode, hasDescendants, resolveGeometryProfile } from '../../src/configStudio/runtime';
import { recordCategory } from '../../src/configStudio/multipartPolicy';
import { readMultipartGeometry } from '../../src/core/geometry/multipartGeometry';
import {filterLegacyDataset,legacyDataDiagnostics} from '../../legacy-v1/filter-runtime-5b3e9c2.mjs';
import {validateIncomingRecord} from '../../vendor/configuration-r11/r11-validation.mjs';

const output=path.resolve(process.argv[2]??'migration-runs/config-production-data-audit');await fs.mkdir(output,{recursive:true});
const root='https://openriamap-cairn-data-1433163128.cos.ap-shanghai.myqcloud.com';
const requests:Array<{key:string;bytes:number}>=[];
const fetchJson=async <T>(key:string):Promise<T>=>{
  const file=path.join(output,'objects',key);let text:string;
  try{text=await fs.readFile(file,'utf8');}catch{const response=await fetch(root+'/'+key);if(!response.ok)throw Error(`${response.status} ${key}`);text=await response.text();await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,text);}
  requests.push({key,bytes:Buffer.byteLength(text)});return JSON.parse(text);
};
const source={sourceId:'formal-cos',transportId:'direct',readerKind:'formal-release-v2',readerSchemaVersion:'openriamap.formal-release-reader.v2',label:'read-only audit',rootUrl:root,mediaRootUrl:null,generation:0};
const release=await resolveFormalWorldRelease({source,worldId:'zth',fetchJson});
const records=await loadFormalWorldFeatures({source,release,fetchJson});
const config=JSON.parse(await fs.readFile('src/configStudio/defaults/r11-r7.config.json','utf8'));
const issues:Array<{id:unknown;path:unknown;message:string}>=[];
for(const record of records){
  const category=readableClassification(config,recordCategory(record))??recordCategory(record);
  if(!hasCategoryNode(config,category)||config.contractRevision<15&&hasDescendants(config,category)){issues.push({id:record.ID,path:category,message:'Unknown final classification'});continue;}
  const node=config.nodes.find((node:any)=>JSON.stringify(node.path)===JSON.stringify(category));
  const type=node?.geometryType??(['Point','LineString','Polygon'] as const).find(type=>resolveGeometryProfile(config,category,type)?.enabled);
  const geometry=type?readMultipartGeometry(record,type):undefined;
  if(!type||!geometry?.geometry||geometry.error)issues.push({id:record.ID,path:category,message:geometry?.error??'Unsupported geometry'});
}
const legacy=filterLegacyDataset({worldId:'zth',mergeVersion:release.releaseId,loadedAt:Date.now(),features:records});
const report=validateConfigPackage(config,records);
const strictIssues=records.flatMap(record=>{const issues=validateIncomingRecord(config,record,'zth');return issues.length?[{id:record.ID,Class:record.Class,issues}]:[];});
const strictIncoming={readOnly:true,total:records.length,strictIncomingInvalid:strictIssues.length,issues:strictIssues};
const summary={readOnly:true,release,recordCount:records.length,classCounts:Object.fromEntries([...new Set(records.map(row=>String(row.Class)))].map(code=>[code,records.filter(row=>row.Class===code).length])),geometryAndClassificationIssues:issues,existingDataValidation:{valid:report.valid,issues:report.issues},strictIncoming,legacy:{retained:legacy.features.length,...legacyDataDiagnostics},requests};
await fs.writeFile(path.join(output,'summary.json'),JSON.stringify(summary,null,2)+'\n');
await fs.writeFile(path.join(output,'records.json'),JSON.stringify(records)+'\n');
await fs.writeFile(path.join(output,'strict-incoming-audit.json'),JSON.stringify(strictIncoming,null,2)+'\n');
console.log(JSON.stringify({releaseId:release.releaseId,formalVersion:release.formalVersion,records:records.length,blockingReadIssues:issues.length,validationIssues:report.issues.length,strictIncomingInvalid:strictIssues.length,legacy:summary.legacy,requests:requests.length}));
