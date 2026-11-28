const KEY='cairnmap.user-prefill.v1';
const EVENT='cairnmap:user-prefill-changed';
let sessionUser='';

export function cachedUser():string{
  try{return typeof localStorage==='undefined'?'':localStorage.getItem(KEY)?.trim()??'';}catch{return '';}
}
/** Only the settings Cache action calls this writer. Empty input clears it. */
export function cacheUser(value:string):void{
  const text=value.trim();
  if(/[\r\n\u0000-\u001f]/u.test(text))throw Error('用户名不能包含换行或控制字符。');
  if(text)localStorage.setItem(KEY,text);else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}
export function rememberSessionUser(value:string){if(!cachedUser()&&value.trim())sessionUser=value.trim();}
export function prefillUser(current='',fallback=''):string{return current.trim()?current:cachedUser()||fallback||sessionUser;}
export function subscribeUserPrefill(listener:()=>void){
  const storage=(event:StorageEvent)=>{if(event.key===KEY||event.key===null)listener();};
  window.addEventListener(EVENT,listener);window.addEventListener('storage',storage);
  return()=>{window.removeEventListener(EVENT,listener);window.removeEventListener('storage',storage);};
}
