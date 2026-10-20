import assert from 'node:assert/strict';
import fs from 'node:fs';
import { externalImageAsset, pinheadPath, SYMBOL_ASSET_BUDGET, subscribeSymbolAssets } from '../../src/components/Rules/rendering/symbolAssets';
import { uniqueImageTarget } from '../../src/components/Rules/configRuntime/imageTargetIndex';
import { FeatureStore } from '../../src/components/Rules/data/featureStore';
import type { FeatureRecord } from '../../src/components/Rules/rendering/renderRules';
assert.equal(externalImageAsset('javascript:alert(1)').phase,'failure');assert.equal(pinheadPath('__proto__').phase,'failure');
Object.assign(globalThis,{window:{}});
let network=0, peak=0, notifications=0;
const unsubscribe=subscribeSymbolAssets(()=>notifications++);
class FakeImage {
  onload:(()=>void)|null=null;onerror:(()=>void)|null=null;naturalWidth=24;naturalHeight=24;private ended=false;
  set src(url:string){network++;peak=Math.max(peak,network);setTimeout(()=>{if(this.ended)return;this.ended=true;network--;if(url.includes('fail'))this.onerror?.();else this.onload?.();},3);}
  removeAttribute(){if(!this.ended){this.ended=true;network--;}}
  decode(){return Promise.resolve();}
}
Object.assign(globalThis,{Image:FakeImage,fetch:async(url:string)=>new Response(url.includes('mountain')?'<svg><script>bad</script></svg>':fs.readFileSync('public/icons/pinhead/v25/bus.svg','utf8'))});
assert.equal(pinheadPath('bus').phase,'pending');assert.equal(pinheadPath('mountain').phase,'pending');
const urls=Array.from({length:SYMBOL_ASSET_BUDGET.pending+20},(_,i)=>`https://image.invalid/${i}.png`),states=urls.map(externalImageAsset);
assert(states.some(s=>s.phase==='failure'),'queued+active work is strictly bounded');
await new Promise(resolve=>setTimeout(resolve,180));
assert.equal(pinheadPath('bus').phase,'success');assert.equal(pinheadPath('mountain').phase,'failure','malformed resource cannot become trusted SVG markup');
assert.equal(externalImageAsset(urls[0]).phase,'success');assert(peak<=SYMBOL_ASSET_BUDGET.concurrent);assert(notifications>0);
assert.equal(externalImageAsset('https://image.invalid/fail.png').phase,'pending');await new Promise(resolve=>setTimeout(resolve,650));assert.equal(externalImageAsset('https://image.invalid/fail.png').phase,'failure');
const record=(ID:string,World:string):FeatureRecord=>({uid:World+ID,meta:{Class:'BUD',World,idValue:ID,idField:'ID',Type:'Points',sig:{},signatureKey:ID,groups:{}},featureInfo:{ID,World},type:'Points'});
const local=record('1','zth'), other=record('1','eden'),store=new FeatureStore([local,other]);
assert.equal(uniqueImageTarget(store,local,'zth','1'),local);assert.equal(uniqueImageTarget(store,other,'eden','1'),other);
assert.equal(uniqueImageTarget(new FeatureStore([local,record('1','zth')]),local,'zth','1'),undefined,'same-world duplicate ID cannot choose the first record');
assert.equal(uniqueImageTarget(store,local,'zth','missing'),undefined);unsubscribe();
console.log('r12 assets: pending/success/failure, retry, queue/concurrency budgets, trusted SVG, world partition and ambiguous-ID fallback passed.');
