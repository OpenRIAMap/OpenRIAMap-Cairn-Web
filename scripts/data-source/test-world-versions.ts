import assert from 'node:assert/strict';
import {resolveFormalWorldRelease,assertFormalReleaseCurrent,loadFormalWorldFeatures,formalReleaseMetadata,type FormalReleaseFetchJson} from '../../src/components/Rules/data/formalReleaseReader';
import {formalObjectPath} from '../../src/components/Rules/data/formalObjectAccess';
import {readRuleWorldCache,writeRuleWorldCache} from '../../src/components/Rules/data/worldRuleCache';
import type {RuleDataSourceSnapshot} from '../../src/components/Rules/data/formalDataSourceRuntime';
import {normalizeReviewControlRequest} from '../../api/review-control.mjs';

const source:RuleDataSourceSnapshot={sourceId:'test-cos',label:'test',readerKind:'formal-release-v2',readerSchemaVersion:'openriamap.formal-release-reader.v2',rootUrl:'https://example.invalid',mediaRootUrl:null,transportId:'direct:test',generation:0};
const binding=(worldId:string,worldVersion:number,dataReleaseId:string)=>({worldId,worldVersion,dataReleaseId,authorityGroupId:'openriamap-ria-formal',bindingRevision:1,worldManifestKey:`releases/${dataReleaseId}/manifests/worlds/${worldId}.json`,worldManifestSha256:'a'.repeat(64),contentSha256:'b'.repeat(64),operationId:'world-version-initial',updatedAt:'2026-10-30T00:00:00Z'});
const set={schemaVersion:'openriamap.current-release-set.v3',releaseId:'global-batch-24',formalVersion:24,publicationId:'global-batch-24',publicationVersion:24,indexRevision:1,worlds:['zth','eden'],worldBindings:[binding('zth',24,'data-zero-24'),binding('eden',24,'data-eden-first')]};
const objects:Record<string,unknown>={
  'current/worlds/_release-set.json':set,
  'releases/data-eden-first/manifests/worlds/eden.json':{schemaVersion:'openriamap.world-release-manifest.v2',worldId:'eden',releaseId:'data-eden-first',chunkCatalogKeys:['releases/data-eden-first/manifests/chunk-catalog/eden-00.json'],featureCount:1,chunkCount:1},
  'releases/data-eden-first/manifests/chunk-catalog/eden-00.json':{schemaVersion:'openriamap.world-chunk-catalog.v2',releaseId:'data-eden-first',worldId:'eden',chunks:[{key:'releases/data-eden-first/data-merge/eden/eden-chunk-001.json',sha256:'c'.repeat(64),byteLength:100,featureCount:1}]},
  'releases/data-eden-first/data-merge/eden/eden-chunk-001.json':{schemaVersion:'openriamap.world-merge-chunk.v2',worldId:'eden',featureCount:1,features:[{record:{ID:'eden-landmark',World:'eden',Class:'WRP',Type:'Point',CoordP:['1,64,2']}}]},
};
const calls:string[]=[],fetchJson:FormalReleaseFetchJson=async<T>(key:string)=>{calls.push(key);assert.ok(key in objects,key);return structuredClone(objects[key]) as T;};
const original=await resolveFormalWorldRelease({source,worldId:'eden',fetchJson});
assert.equal(original.releaseId,'data-eden-first');assert.equal(original.formalVersion,24);assert.equal(original.publicationVersion,24);
assert.ok(!calls.some(key=>key==='current/worlds/eden.json'),'v3 must read atomic binding, not a possibly unfinished projection');
assert.equal((await loadFormalWorldFeatures({source,release:original,fetchJson}))[0].ID,'eden-landmark');
set.indexRevision++;set.worldBindings[0]={...binding('zth',25,'data-zero-25'),bindingRevision:2};
await assertFormalReleaseCurrent({source,release:original,fetchJson});
set.indexRevision++;set.worldBindings[1]={...set.worldBindings[1],worldVersion:1,bindingRevision:2,operationId:'world-version-adjust'};
await assert.rejects(()=>assertFormalReleaseCurrent({source,release:original,fetchJson}),/该世界版本绑定已更新/);
const adjusted=await resolveFormalWorldRelease({source,worldId:'eden',fetchJson});
assert.equal(adjusted.formalVersion,1);assert.equal(adjusted.releaseId,original.releaseId);assert.equal(adjusted.contentSha256,original.contentSha256);
const memory=new Map<string,string>();
Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:(key:string)=>memory.get(key)??null,setItem:(key:string,value:string)=>memory.set(key,value),removeItem:(key:string)=>memory.delete(key),key:(index:number)=>[...memory.keys()][index]??null,get length(){return memory.size;}}});
const scope={sourceId:source.sourceId,transportId:source.transportId,releaseId:original.releaseId,worldId:'eden',readerSchemaVersion:source.readerSchemaVersion,effectiveReaderProtocol:original.effectiveReaderProtocol,contentSha256:original.contentSha256};
writeRuleWorldCache(scope,{worldId:'eden',mergeVersion:original.releaseId,formalVersion:24,loadedAt:1,features:[{ID:'retained'}],...formalReleaseMetadata(original)});
const cached=readRuleWorldCache(scope)!;assert.equal(cached.formalVersion,24);
writeRuleWorldCache(scope,{...cached,formalVersion:adjusted.formalVersion??undefined,...formalReleaseMetadata(adjusted)});
assert.equal(readRuleWorldCache(scope)?.formalVersion,1);assert.equal(readRuleWorldCache(scope)?.features[0].ID,'retained');
assert.equal(readRuleWorldCache({...scope,contentSha256:'f'.repeat(64)}),null);
assert.equal(readRuleWorldCache({...scope,effectiveReaderProtocol:undefined,contentSha256:undefined}),null);
const mirror={...source,objectLayout:'github-stable-v1' as const};
assert.equal(formalObjectPath(mirror,adjusted.worldManifest.mediaIndexKey as string||'releases/data-eden-first/media-index-merge/eden/INDEX.json',adjusted.releaseId),'Picture_Index/eden/INDEX.json');
const actor={principalId:'real-login'};
const normalized=normalizeReviewControlRequest({operation:'world-version',actor:{principalId:'forged'},request:{action:'precheck',request:{action:'reassign',worldId:'eden',targetVersion:1,reason:'首次发布编号修正',readerProtocol:'openriamap.formal-release-reader.v3',actor:'forged'}}},actor);
assert.deepEqual(normalized.actor,actor);assert.ok(!('actor' in normalized.request.request));
assert.throws(()=>normalizeReviewControlRequest({operation:'world-version',request:{action:'precheck',request:{action:'reassign',worldId:'eden',targetVersion:1.5,reason:'x',readerProtocol:'openriamap.formal-release-reader.v3'}}},actor));
const bad=structuredClone(set);bad.worldBindings[1].worldManifestKey='releases/data-zero-25/manifests/worlds/eden.json';
await assert.rejects(()=>resolveFormalWorldRelease({source,worldId:'eden',fetchJson:async<T>(key:string)=>(key==='current/worlds/_release-set.json'?bad:objects[key]) as T}),/绑定无效/);
console.log('world versions: independent snapshots, target-only read guard, 24→1 cache reuse, mirror paths and broker validation PASS');
