import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {loadFormalWorldRuleDataset} from '../../src/components/Rules/data/formalReleaseReader';
import {formalObjectPath,formalObjectUrl} from '../../src/components/Rules/data/formalObjectAccess';
import {loadFormalMediaAssets} from '../../src/components/Rules/data/formalMediaReader';
import {readWorldPublicationStatuses} from '../../src/components/Rules/data/formalSourceStatus';
import {buildDataToolSchema} from '../../src/components/Common/buildDataToolSchema';
import {readReviewSessionResponse} from '../../src/components/Review/openriamapReviewAuth';
import {readRuleWorldMeta,readRuleWorldCache,writeRuleWorldCache,removeRuleWorldCachesForSource} from '../../src/components/Rules/data/worldRuleCache';
import type {RuleDataSourceSnapshot} from '../../src/components/Rules/data/formalDataSourceRuntime';
import type {ConfigPackageV3} from '../../src/configStudio/types';

const source:RuleDataSourceSnapshot={sourceId:'formal-github',label:'Mirror',readerKind:'formal-release-v2',readerSchemaVersion:'openriamap.formal-release-reader.v2',rootUrl:'https://fixture.invalid/data',mediaRootUrl:'https://fixture.invalid/media',transportId:'test:github-stable-v1',objectLayout:'github-stable-v1',generation:1,worldId:'zth'};
const body=(value:unknown)=>JSON.stringify(value)+'\n';
const sha=(value:string)=>createHash('sha256').update(value).digest('hex');
function fixture(version:number){
  const releaseId=`release-${version}`,root=`releases/${releaseId}/`,files:Record<string,string>={};
  const chunk=body({schemaVersion:'openriamap.world-merge-chunk.v2',worldId:'zth',featureCount:1,features:[{record:{ID:`feature-${version}`,Class:'BUD',World:0}}]});
  const catalog=body({schemaVersion:'openriamap.world-chunk-catalog.v2',worldId:'zth',releaseId,chunks:[{key:root+'data-merge/zth/chunk.json',sha256:sha(chunk),byteLength:Buffer.byteLength(chunk),featureCount:1}]});
  const manifest=body({schemaVersion:'openriamap.world-release-manifest.v2',worldId:'zth',releaseId,chunkCount:1,featureCount:1,chunkCatalogKeys:[root+'manifests/chunk-catalog/zth.json']});
  files['Current/_release-set.json']=body({schemaVersion:'openriamap.current-release-set.v2',releaseId,formalVersion:version,worlds:['zth']});
  files['Current/zth.json']=body({schemaVersion:'openriamap.current-world.v2',worldId:'zth',releaseId,formalVersion:version,worldManifestKey:root+'manifests/worlds/zth.json',worldManifestSha256:sha(manifest)});
  files['Release_Metadata/worlds/zth.json']=manifest;files['Release_Metadata/chunk-catalog/zth.json']=catalog;files['Data_Merge/zth/chunk.json']=chunk;
  files['Picture_Index/zth/feature-index/BUD/INDEX.json']=body({schemaVersion:'openriamap.world-media-feature-index.v1',releaseId,worldId:'zth',category:'BUD',assetsByFeature:{}});
  return {files,releaseId};
}
const originalFetch=globalThis.fetch;let objects=fixture(20).files;let calls:string[]=[];
globalThis.fetch=async(input)=>{const key=new URL(String(input)).pathname.replace(/^\/data\//,'');calls.push(key);return new Response(objects[key]??'missing',{status:key in objects?200:404,headers:{'Content-Type':'application/json'}});};
try{
  const dataset=await loadFormalWorldRuleDataset({source,worldId:'zth'});
  assert.equal(dataset.formalVersion,20);assert.equal(dataset.features[0].ID,'feature-20');
  assert(calls.includes('Current/_release-set.json'));assert(calls.includes('Data_Merge/zth/chunk.json'));assert(!calls.some(key=>key.startsWith('current/')));
  assert.equal(formalObjectPath(source,'releases/release-20/media-index-merge/zth/INDEX.json','release-20'),'Picture_Index/zth/INDEX.json');
  assert.equal(formalObjectUrl({...source,objectLayout:'cos-release-v2'},'current/worlds/zth.json'),'https://fixture.invalid/data/current/worlds/zth.json');
  for(const key of ['../outside','current/worlds/../zth.json','https://other.invalid/file','releases/release-19/data-merge/zth/chunk.json'])assert.throws(()=>formalObjectPath(source,key,'release-20'));
  const corrupted=fixture(20);corrupted.files['Data_Merge/zth/chunk.json']+=' ';objects=corrupted.files;
  await assert.rejects(loadFormalWorldRuleDataset({source,worldId:'zth'}),/字节长度/);
  objects=fixture(20).files;objects['Data_Merge/zth/chunk.json']=objects['Data_Merge/zth/chunk.json'].replace('feature-20','feature-21');
  await assert.rejects(loadFormalWorldRuleDataset({source,worldId:'zth'}),/SHA256/);
  objects=fixture(20).files;objects['Current/zth.json']=objects['Current/zth.json'].replace('release-20/manifests/','release-19/manifests/');
  await assert.rejects(loadFormalWorldRuleDataset({source,worldId:'zth'}),/清单路径/);
  const first=fixture(20),second=fixture(21);let setReads=0;
  globalThis.fetch=async(input)=>{const key=new URL(String(input)).pathname.replace(/^\/data\//,'');if(key==='Current/_release-set.json')setReads++;const files=setReads>=2?second.files:first.files;return new Response(files[key]??'missing',{status:key in files?200:404});};
  const restarted=await loadFormalWorldRuleDataset({source,worldId:'zth'});assert.equal(restarted.releaseId,'release-21');assert.equal(restarted.features.length,1);assert.equal(restarted.features[0].ID,'feature-21');assert(setReads>=4);
  // A stable mirror can replace its catalogs after its pointer/manifest.
  let catalogReads=0;
  globalThis.fetch=async(input)=>{const key=new URL(String(input)).pathname.replace(/^\/data\//,'');const files=key==='Release_Metadata/chunk-catalog/zth.json'&&++catalogReads===1?first.files:second.files;return new Response(files[key]??'missing',{status:key in files?200:404});};
  const catalogRestart=await loadFormalWorldRuleDataset({source,worldId:'zth'});assert.equal(catalogRestart.features[0].ID,'feature-21');assert.equal(catalogReads,2);
  await assert.rejects(loadFormalMediaAssets({source,worldId:'zth',releaseId:'release-20',classCode:'BUD',kindPath:[],featureId:'feature-20'}),/发布已更新/);
  objects=first.files;calls=[];globalThis.fetch=async(input)=>{const key=new URL(String(input)).pathname.replace(/^\/data\//,'');calls.push(key);return new Response(objects[key]??'missing',{status:key in objects?200:404});};
  await loadFormalMediaAssets({source,worldId:'zth',releaseId:'release-20',classCode:'BUD',kindPath:[],featureId:'feature-20'});assert(calls.includes('Picture_Index/zth/feature-index/BUD/INDEX.json'));
  const statuses=await readWorldPublicationStatuses([{id:'zth',enabled:true},{id:'eden',enabled:true},{id:'disabled',enabled:false}],()=>source);
  // The remote alias is absent here: each requested world retains its own ID.
  assert.equal(statuses[0].state,'published');assert.equal(statuses[1].state,'unpublished');assert.equal(statuses[2].state,'disabled');
  globalThis.fetch=async()=>new Response('denied',{status:403});
  const denied=await readWorldPublicationStatuses([{id:'zth',enabled:true}],()=>source);assert.equal(denied[0].state,'error');assert.match(denied[0].message??'',/权限/);
}finally{globalThis.fetch=originalFetch;}

const config=JSON.parse(fs.readFileSync(new URL('../../src/configStudio/defaults/r11-r7.config.json',import.meta.url),'utf8')) as ConfigPackageV3;
const localValues=new Map<string,string>(),oldStorage=globalThis.localStorage;
Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{get length(){return localValues.size;},getItem:(key:string)=>localValues.get(key)??null,setItem:(key:string,value:string)=>localValues.set(key,value),removeItem:(key:string)=>localValues.delete(key),key:(index:number)=>[...localValues.keys()][index]??null}});
try{
  const a={sourceId:'formal-github',transportId:'server-a:stable',worldId:'zth',releaseId:'release-20',readerSchemaVersion:'openriamap.formal-release-reader.v2'},b={...a,transportId:'server-b:stable'};
  localValues.set('studio-draft','keep');writeRuleWorldCache(a,{...a,mergeVersion:a.releaseId,loadedAt:1,features:[{ID:'a'}]});writeRuleWorldCache(b,{...b,mergeVersion:b.releaseId,loadedAt:2,features:[{ID:'b'}]});
  assert.equal(readRuleWorldMeta('zth',a)?.transportId,a.transportId);assert.equal(readRuleWorldCache({...a,transportId:'server-a:legacy'}),null);
  removeRuleWorldCachesForSource('zth',a);assert.equal(readRuleWorldCache(a),null);assert.equal(readRuleWorldCache(b)?.features[0].ID,'b');assert.equal(localValues.get('studio-draft'),'keep');
}finally{Object.defineProperty(globalThis,'localStorage',{configurable:true,value:oldStorage});}
const schema=buildDataToolSchema(config);assert.equal(schema.schemaVersion,'1.1.0');assert.deepEqual(new Set(schema.featureClasses),new Set(config.nodes.map(node=>node.path.class)));assert.equal(schema.worlds.zth,0);assert.equal(schema.classToDrawMode.RLE,'polyline');assert.throws(()=>buildDataToolSchema(),/正式V3/);
const changed=structuredClone(config);changed.nodes=changed.nodes.filter(node=>node.path.class!=='RLE');assert(!buildDataToolSchema(changed).featureClasses.includes('RLE'));
const jsonResponse=(value:unknown,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json'}});
assert.equal((await readReviewSessionResponse(jsonResponse({status:'anonymous'}),true)).status,'anonymous');
assert.equal((await readReviewSessionResponse(jsonResponse({status:'authenticated',principalId:'tester',roles:['maintainer']}),true)).status,'authenticated');
assert.match((await readReviewSessionResponse(new Response('<html>SPA</html>',{headers:{'Content-Type':'text/html'}}),true)).message??'',/本地预览未接入/);
assert.match((await readReviewSessionResponse(new Response('<html>SPA</html>',{headers:{'Content-Type':'text/html'}}),false)).message??'',/接口返回异常/);
assert.equal((await readReviewSessionResponse(jsonResponse({},401))).status,'expired');
assert.equal((await readReviewSessionResponse(jsonResponse({status:'unexpected'}))).status,'unavailable');
assert.equal((await readReviewSessionResponse(new Response('{',{headers:{'Content-Type':'application/json'}}))).status,'unavailable');
console.log('Deployment finalization: stable layout, integrity, snapshot restart, media, publication status, V3 Schema and auth regressions PASS');
