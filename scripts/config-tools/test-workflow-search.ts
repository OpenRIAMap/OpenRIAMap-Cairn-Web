import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createSharedReadPool } from '../../src/lib/sharedRead';
import { mergeWorkflowSearchPool, type SearchSelectConfig } from '../../src/components/Mapping/Workflow/workflowSearchPool';
import { applicationWorldDataset, datasetMatchesSource, loadWorldRuleDataset, ruleDatasetSourceKey } from '../../src/components/Rules/data/worldRuleDatasetLoader';
import { fetchFormalObject } from '../../src/components/Rules/data/formalObjectAccess';
import type { RuleDataSourceSnapshot } from '../../src/components/Rules/data/formalDataSourceRuntime';

const sleep=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));
const storage=new Map<string,string>();
Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:(key:string)=>storage.get(key)??null,setItem:(key:string,value:string)=>storage.set(key,String(value)),removeItem:(key:string)=>storage.delete(key),clear:()=>storage.clear(),key:(index:number)=>[...storage.keys()][index]??null,get length(){return storage.size;}}});
const pool=createSharedReadPool<number,string>(1000);
let reads=0,aborts=0;
const reader=async(signal:AbortSignal,emit:(s:string)=>void)=>{reads++;signal.addEventListener('abort',()=>aborts++);emit('真实阶段');await sleep(20);return 42;};
const one=new AbortController(),two=new AbortController();
const a=pool('world/source',reader,one.signal),b=pool('world/source',reader,two.signal);
const rejected=assert.rejects(a,/取消/);one.abort(Error('已取消等待'));await rejected;
assert.equal(await b,42);assert.equal(reads,1);assert.equal(aborts,0,'cancel one consumer must retain another consumer’s read');
const last=new AbortController();const pending=pool('other',reader,last.signal);const cancelled=assert.rejects(pending,/取消/);await sleep(0);last.abort(Error('已取消等待'));await cancelled;assert.equal(aborts,1);
assert.equal(await pool('other',reader),42,'a cancelled read must not poison retry');
const short=createSharedReadPool<number>(10);await assert.rejects(short('timeout',async()=>new Promise(()=>{})),/超时/);
const stages:string[]=[];const p=pool('progress',reader);await sleep(0);await Promise.all([p,pool('progress',reader,undefined,s=>stages.push(s))]);assert.deepEqual(stages,['真实阶段'],'late consumers receive latest actual stage');

const cfg:SearchSelectConfig={cacheKey:'test',filter:r=>r.Class==='WRP',getId:r=>r.ID,getName:r=>r.Name,formatOption:(name,id)=>`${name}(${id})`};
const base=[{ID:'a',Class:'WRP',Name:'旧',World:'zth'},{ID:'deleted',Class:'WRP',Name:'删除',World:'zth'}];
const committed=[{ID:'a',Class:'WRP',Name:'修改后',World:'zth'},{ID:'new',Class:'WRP',Name:'新增',World:'zth'},{ID:'foreign',Class:'WRP',Name:'其他世界',World:'eden'}];
assert.deepEqual(mergeWorkflowSearchPool(base,committed,['deleted'],cfg,'zth').map(o=>o.id).sort(),['a','new']);
assert.equal(mergeWorkflowSearchPool(base,committed,[],cfg,'zth').find(o=>o.id==='a')?.name,'修改后');
assert(!mergeWorkflowSearchPool(base,[{ID:'a',Class:'STA',Name:'已改分类',World:'zth'}],[],cfg,'zth').some(o=>o.id==='a'),'an overlay leaving the search scope must remove the stale base candidate');
assert.deepEqual(mergeWorkflowSearchPool(base,committed,[],{...cfg,filter:r=>r.Class==='STA'},'zth'),[],'changed search scope must rebuild results');

const source:RuleDataSourceSnapshot={worldId:'zth',sourceId:'search-fixture',label:'test',readerKind:'formal-release-v2',readerSchemaVersion:'v2',rootUrl:'https://search-fixture.invalid',mediaRootUrl:null,transportId:'fixture',generation:1};
const memory=applicationWorldDataset({worldId:'zth',releaseId:'release-search',mergeVersion:'release-search',sourceId:source.sourceId,transportId:source.transportId,readerSchemaVersion:source.readerSchemaVersion,loadedAt:1,features:base},source,'zth');
assert(datasetMatchesSource(memory,'zth',source));
for(const change of [{sourceId:'other'},{transportId:'other'},{generation:2},{readerSchemaVersion:'v3'},{resourceGroupId:'other'},{remoteWorldId:'other'}])assert(!datasetMatchesSource(memory,'zth',{...source,...change}));
assert(!datasetMatchesSource(memory,'eden',source));assert.notEqual(ruleDatasetSourceKey('zth',source),ruleDatasetSourceKey('zth',{...source,rootUrl:'https://other.invalid'}));

const docs=new Map<string,Buffer>();
const put=(key:string,value:unknown)=>{const bytes=Buffer.from(JSON.stringify(value));docs.set(key,bytes);return {sha256:createHash('sha256').update(bytes).digest('hex'),byteLength:bytes.length};};
const rid='search-release',chunk=`releases/${rid}/data-merge/zth/chunk.json`,catalog=`releases/${rid}/manifests/catalog.json`,manifest=`releases/${rid}/manifests/worlds/zth.json`;
const integrity=put(chunk,{schemaVersion:'openriamap.world-merge-chunk.v2',worldId:'zth',featureCount:base.length,features:base.map(record=>({record}))});
put(catalog,{schemaVersion:'openriamap.world-chunk-catalog.v2',worldId:'zth',releaseId:rid,chunks:[{key:chunk,...integrity,featureCount:base.length}]});
const mh=put(manifest,{schemaVersion:'openriamap.world-release-manifest.v2',worldId:'zth',releaseId:rid,featureCount:base.length,chunkCount:1,chunkCatalogKeys:[catalog]});
put('current/worlds/_release-set.json',{schemaVersion:'openriamap.current-release-set.v2',releaseId:rid,formalVersion:1,worlds:['zth']});
put('current/worlds/zth.json',{schemaVersion:'openriamap.current-world.v2',worldId:'zth',releaseId:rid,formalVersion:1,worldManifestKey:manifest,worldManifestSha256:mh.sha256});
const fetcher=globalThis.fetch;let requests=0;
try{
  globalThis.fetch=async input=>{requests++;const url=new URL(String(input));assert.equal(url.host,'search-fixture.invalid');await sleep(2);return new Response(docs.get(url.pathname.slice(1)),{status:200});};
  const [first,second]=await Promise.all([loadWorldRuleDataset('zth',undefined,source),loadWorldRuleDataset('zth',undefined,source)]);
  assert.equal(first,second);assert.equal(requests,6,'two concurrent cold readers share one complete verified data load');assert(datasetMatchesSource(first,'zth',source));
  globalThis.fetch=async()=>new Response('{}',{status:503});await assert.rejects(fetchFormalObject(source,'current/worlds/zth.json'),/503/);
  globalThis.fetch=async()=>new Response('bad json');await assert.rejects(fetchFormalObject(source,'current/worlds/zth.json'),/JSON/);
  globalThis.fetch=async(_input,options)=>new Promise((_,reject)=>options?.signal?.addEventListener('abort',()=>reject(Error('aborted')),{once:true}));
  await assert.rejects(fetchFormalObject(source,'current/worlds/zth.json',{timeoutMs:5}),/超时/);
}finally{globalThis.fetch=fetcher;}
console.log('Workflow search: verified cold reads shared (6 requests), memory identity isolation, latest stage, independent cancellation, timeout, retry, source/world/config changes and overlay/delete merge passed.');
