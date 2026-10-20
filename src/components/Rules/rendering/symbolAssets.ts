import { acceptableImageUrl, supportedIconId } from '../../../configStudio/pointSymbol';
export type SymbolAsset<T = string> = { phase: 'pending' | 'success' | 'failure'; value?: T; reason?: string };
export const SYMBOL_ASSET_BUDGET = { cached: 1024, pending: 128, concurrent: 8, deadlineMs: 12000 } as const;
const assets = new Map<string, SymbolAsset>(), accessed = new Map<string, number>(), listeners = new Set<() => void>();
const queue: Array<() => Promise<void>> = [];
let epoch = 0, scheduled = false, running = 0, pending = 0;
export const symbolAssetEpoch = () => epoch;
export const subscribeSymbolAssets = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
function publish() {
  if (scheduled) return; scheduled = true;
  const dispatch = () => { scheduled = false; epoch++; for (const listener of listeners) listener(); };
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(dispatch); else queueMicrotask(dispatch);
}
function settle(key: string, value: SymbolAsset) {
  if (assets.get(key)?.phase !== 'pending') return; // Late timeout/decode callbacks cannot resurrect a terminal asset.
  pending--; assets.set(key, value); publish();
}
function runQueue() {
  while (running < SYMBOL_ASSET_BUDGET.concurrent && queue.length) {
    const task = queue.shift()!; running++;
    void task().finally(() => { running--; runQueue(); });
  }
}
const unavailable = (): SymbolAsset => ({ phase: 'failure', reason: '图像资源超过当前加载预算，使用规则回退' });
function reserve(key: string): SymbolAsset | undefined {
  if (pending >= SYMBOL_ASSET_BUDGET.pending) return undefined;
  if (assets.size >= SYMBOL_ASSET_BUDGET.cached) {
    const oldest = [...accessed].sort((a,b) => a[1]-b[1]).find(([key,time]) => assets.get(key)?.phase !== 'pending' && Date.now()-time>1000);
    if (!oldest) return undefined;
    assets.delete(oldest[0]); accessed.delete(oldest[0]);
  }
  const value: SymbolAsset = { phase:'pending' }; assets.set(key,value);accessed.set(key,Date.now()); pending++;return value;
}
function lookup(key: string) { const hit=assets.get(key);if(hit)accessed.set(key,Date.now());return hit; }
export function pinheadPath(id: string): SymbolAsset {
  if (!supportedIconId(id)) return { phase:'failure',reason:'图标 ID 不在固定图库中' };
  const key='pinhead:'+id, hit=lookup(key);if(hit)return hit;
  if(typeof window==='undefined')return {phase:'failure',reason:'图标资源仅在浏览器加载'};
  const state=reserve(key);if(!state)return unavailable();
  const controller=new AbortController(),timer=setTimeout(()=>{controller.abort();settle(key,{phase:'failure',reason:'图标资源加载超时'});},SYMBOL_ASSET_BUDGET.deadlineMs);
  queue.push(async()=>{
    if(assets.get(key)?.phase!=='pending'){clearTimeout(timer);return;}
    try {
      const response=await fetch('/icons/pinhead/v25/'+id+'.svg',{signal:controller.signal,cache:'force-cache'});
      if(!response.ok)throw Error('图标资源 '+response.status);
      const svg=await response.text(),match=/^<svg[^>]+viewBox="0 0 15 15"[^>]*>\s*<path d="([Mm0-9., A-Za-z+\-]+)"\s*\/>\s*<\/svg>\s*$/.exec(svg);
      if(!match)throw Error('图标内容不符合固定资源格式');settle(key,{phase:'success',value:match[1]});
    }catch(error){settle(key,{phase:'failure',reason:String(error)});}finally{clearTimeout(timer);}
  });runQueue();return state;
}
function loadImage(url:string):Promise<boolean> {
  return new Promise(resolve=>{
    const image=new Image();let done=false;
    const timer=setTimeout(()=>finish(false),5000);
    function finish(ok:boolean){if(done)return;done=true;clearTimeout(timer);image.onload=image.onerror=null;if(!ok)image.removeAttribute('src');resolve(ok);}
    image.onerror=()=>finish(false);
    image.onload=()=>{if(!image.naturalWidth||!image.naturalHeight){finish(false);return;}if(image.decode)void image.decode().then(()=>finish(true),()=>finish(false));else finish(true);};
    image.src=url;
  });
}
export function externalImageAsset(url:string):SymbolAsset {
  if(!acceptableImageUrl(url))return {phase:'failure',reason:'图片来源为空或地址不合法'};
  const key='image:'+url,hit=lookup(key);if(hit)return hit;
  if(typeof Image==='undefined')return {phase:'failure',reason:'图片仅在浏览器加载'};
  const state=reserve(key);if(!state)return unavailable();
  const timer=setTimeout(()=>settle(key,{phase:'failure',reason:'图片加载／队列超时，使用规则回退'}),SYMBOL_ASSET_BUDGET.deadlineMs);
  queue.push(async()=>{
    if(assets.get(key)?.phase!=='pending'){clearTimeout(timer);return;}
    try {
      let ok=await loadImage(url);
      if(!ok&&assets.get(key)?.phase==='pending'){await new Promise(resolve=>setTimeout(resolve,500));if(assets.get(key)?.phase==='pending')ok=await loadImage(url);}
      settle(key,ok?{phase:'success',value:url}:{phase:'failure',reason:'图片加载或解码失败，已使用规则回退'});
    }catch(error){settle(key,{phase:'failure',reason:String(error)});}finally{clearTimeout(timer);}
  });runQueue();return state;
}
