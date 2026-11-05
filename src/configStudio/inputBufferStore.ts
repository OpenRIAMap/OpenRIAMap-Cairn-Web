/** UI text is recoverable workspace state; never part of config or edit-audit. */
let values:Record<string,string>={};
const listeners=new Set<()=>void>();
export const readInputBuffers=()=>({...values});
export const subscribeInputBuffers=(listener:()=>void)=>{listeners.add(listener);return()=>{listeners.delete(listener);};};
export function restoreInputBuffers(next?:Record<string,string>){values={...next};for(const listener of listeners)listener();}
export function writeInputBuffer(key:string,value?:string){if(!key)return;if(value===undefined)delete values[key];else values[key]=value;for(const listener of listeners)listener();}
export const readInputBuffer=(key:string)=>values[key];
export function inputBufferKey(element:HTMLElement):string{
 const parents:string[]=[];for(let parent=element.parentElement;parent;parent=parent.parentElement){const key=parent.dataset.bufferScope??parent.dataset.foldKey??parent.dataset.applicationSection??parent.dataset.workflowPath;if(key)parents.unshift(key);}
 const label=element.closest('[data-setting-help]'),controls=label?Array.from(label.querySelectorAll('input,textarea')):[];
 return [...parents,element.dataset.configSetting??element.getAttribute('aria-label')??element.getAttribute('placeholder')??'control',String(controls.indexOf(element))].join('|');
}

export function inputBufferScope(element:HTMLElement):string{const parts:string[]=[];for(let node:HTMLElement|null=element;node;node=node.parentElement){const key=node.dataset.bufferScope??node.dataset.foldKey??node.dataset.applicationSection??node.dataset.workflowPath;if(key)parts.unshift(key);}return parts.join('|')+'|';}
export function discardInputBuffers(scope:string){for(const key of Object.keys(values))if(key.startsWith(scope))delete values[key];for(const listener of listeners)listener();if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('cairn:discard-input-buffers',{detail:scope}));}
