// Run before importing any frozen module. This document has its own globals,
// cookies, local/session preferences, IndexedDB and cache namespace.
async function enter() {
document.getElementById('root')!.removeAttribute('style');
document.getElementById('root')!.replaceChildren();
const prefix = 'cairnmap-v1-5b3e9c2:';
const nativeKey=Storage.prototype.key,nativeRemove=Storage.prototype.removeItem;
const nativeLength=Object.getOwnPropertyDescriptor(Storage.prototype,'length')!.get!;
const ownKeys=(storage:Storage)=>Array.from({length:nativeLength.call(storage)},(_,index)=>nativeKey.call(storage,index)!).filter(key=>key.startsWith(prefix));
Storage.prototype.clear=function(){for(const key of ownKeys(this))nativeRemove.call(this,key);};
Storage.prototype.key=function(index:number){return ownKeys(this)[index]?.slice(prefix.length)??null;};
Object.defineProperty(Storage.prototype,'length',{get(){return ownKeys(this).length;}});
for (const key of ['getItem', 'setItem', 'removeItem'] as const) {
  const original = Storage.prototype[key];
  Object.defineProperty(Storage.prototype, key, { value(this: Storage, name: string, ...args: string[]) {
    return (original as (...args: string[]) => unknown).call(this, prefix + name, ...args);
  } });
}
const open = IDBFactory.prototype.open;
IDBFactory.prototype.open = function(name: string, version?: number) { return open.call(this, prefix + name, version); };
const remove = IDBFactory.prototype.deleteDatabase;
IDBFactory.prototype.deleteDatabase = function(name: string) { return remove.call(this, prefix + name); };

try { await import('./main'); } catch {
  const root=document.getElementById('root')!;root.textContent='V1 兼容分包加载失败。';
  const retry=document.createElement('button');retry.textContent='重新加载';retry.onclick=()=>location.reload();root.append(retry);
}
}
let admitted=false;
try {admitted=JSON.parse(localStorage.getItem('ria_feature_modules_v1')??'{}').modules?.['legacy-v1']?.enabledByUser===true;}catch{/* direct link asks for admission */}
if(admitted)void enter();else{
  const root=document.getElementById('root')!;
  Object.assign(root.style,{fontFamily:'sans-serif',padding:'2rem',maxWidth:'36rem',margin:'10vh auto',border:'1px solid #cbd5e1',borderRadius:'1rem'});
  const title=document.createElement('h1');title.textContent='V1 兼容分包';
  const detail=document.createElement('p');detail.textContent='加载固定版本的 V1 地图、界面和测绘功能，在独立页面中运行。';
  const load=document.createElement('button');load.textContent='确认加载';load.onclick=()=>{load.disabled=true;void enter();};
  const cancel=document.createElement('a');cancel.href='/';cancel.textContent='返回正式地图';cancel.style.marginLeft='1rem';
  root.append(title,detail,load,cancel);
}
