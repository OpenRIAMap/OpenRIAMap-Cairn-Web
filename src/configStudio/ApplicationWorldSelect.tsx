import {HelpControl} from './SettingHelp';
import type {ConfigPackageV3} from './types';
export function ApplicationWorldSelect({config,value,onChange}:{config:ConfigPackageV3;value:string;onChange:(value:string)=>void}){
 const worlds=config.application?.worlds.filter(w=>w.enabled)??[];
 return <HelpControl context="ApplicationWorldSelect"><select aria-label="世界" className="mt-1 w-full min-w-0 rounded border px-2 py-1" value={value} onChange={e=>onChange(e.target.value)}><option value="">选择世界</option>{value&&!worlds.some(w=>w.id===value)?<option value={value}>历史世界：{value}（请核对）</option>:null}{worlds.map(w=><option value={w.id} key={w.id}>{w.label.zh||w.label.en||w.id}</option>)}</select></HelpControl>;
}
