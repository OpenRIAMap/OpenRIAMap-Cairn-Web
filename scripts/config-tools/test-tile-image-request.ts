import assert from 'node:assert/strict';
import { requestTileImage } from '../../src/lib/tileImageRequest';
const delay=()=>new Promise(resolve=>setTimeout(resolve,12));
function fakeImage(){return {onload:null as (()=>void)|null,onerror:null as (()=>void)|null,src:'',removed:false,removeAttribute(){this.removed=true;}};}
for(const maxRetries of [0,1,3]){
  const image=fakeImage();let errors=0,loaded=0;
  requestTileImage(image as unknown as HTMLImageElement,'https://tile.invalid/original.jpg',{maxRetries,retryDelay:0},()=>loaded++,()=>errors++);
  for(let i=0;i<maxRetries;i++){image.onerror!();await delay();assert(image.src.includes('_retry='+String(i+1)));assert.equal(errors,0);}
  image.onerror!();assert.equal(errors,1);assert.equal(loaded,0);assert.equal(image.onerror,null);assert.equal(image.onload,null);
}
const image=fakeImage();let events=0;
const cancel=requestTileImage(image as unknown as HTMLImageElement,'https://tile.invalid/a.jpg',{maxRetries:3,retryDelay:10},()=>events++,()=>events++);
const lateLoad=image.onload!,lateError=image.onerror!;image.onerror!();cancel();await delay();lateLoad();lateError();
assert.equal(events,0);assert(image.removed);assert.equal(image.src,'https://tile.invalid/a.jpg','cancelled retry cannot replace tile URL');
const success=fakeImage();requestTileImage(success as unknown as HTMLImageElement,'https://tile.invalid/b.jpg',{maxRetries:3,retryDelay:5},()=>events++,()=>events++);success.onload!();assert.equal(events,1);assert.equal(success.onerror,null);
console.log('tile-image-request: 0/1/3 bounded retries, single terminal callback, success cleanup, unload cancellation and stale callbacks passed');
