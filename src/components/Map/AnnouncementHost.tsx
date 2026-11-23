import {useEffect,useState} from 'react';
import {openriamapGithubReviewAuth} from '../Review/openriamapReviewAuth';
import BlockingFullscreenModal from '../Common/BlockingFullscreenModal';
import {RichTextView} from '@/configStudio/RichTextComponents';
import type {ConfigPackageV3} from '@/configStudio/types';
import type {Announcement} from '@/configStudio/richText';
const session=new Set<string>();
export const announcementKey=(project:string,id:string)=>`cairnmap:announcement:${encodeURIComponent(project)}:${encodeURIComponent(id)}`;
export function AnnouncementHost({config,ready}:{config:ConfigPackageV3;ready:boolean}){
 const [item,setItem]=useState<Announcement>(),[step,setStep]=useState(0);
 const [authenticated,setAuthenticated]=useState(false);
 useEffect(()=>{let live=true,serial=0;const refresh=async()=>{const request=++serial;setAuthenticated(false);const result=await openriamapGithubReviewAuth.getSession({includeRoles:false});if(live&&request===serial)setAuthenticated(result.status==='authenticated');};if(config.application?.review.enabled)void refresh();window.addEventListener('ria:review-auth-changed',refresh);return()=>{live=false;window.removeEventListener('ria:review-auth-changed',refresh);};},[config.application?.review]);
 useEffect(()=>{const previous=document.title;document.title=config.application?.titles?.tabTitle||'CairnMap - OpenRIAMap Profile';return()=>{document.title=previous;};},[config.application?.titles?.tabTitle]);
 useEffect(()=>{
  if(!ready||item)return;
  const attempt=()=>{if(document.querySelector('[data-blocking-modal], [aria-modal="true"], [data-announcement]'))return;const next=config.application?.announcements?.items.find(notice=>{const key=announcementKey(config.projectId,notice.id);if(!notice.enabled||notice.loginOnly&&!authenticated||session.has(key))return false;try{return !localStorage.getItem(key);}catch{return true;}});if(next)setItem(next);};
  attempt();const observer=new MutationObserver(attempt);observer.observe(document.body,{childList:true,subtree:true});return()=>observer.disconnect();
 },[config,ready,item,step,authenticated]);
 if(!ready||!item)return null;
 const close=(silence=false)=>{const key=announcementKey(config.projectId,item.id);session.add(key);if(item.mode==='once'||silence)try{localStorage.setItem(key,new Date().toISOString());}catch{/* This session still remembers. */}setItem(undefined);setStep(value=>value+1);};
 return <BlockingFullscreenModal open><section data-announcement role="dialog" aria-modal="true" aria-label={item.title||'公告'} className="w-[min(42rem,calc(100vw-2rem))] overflow-hidden rounded-2xl bg-white shadow-xl"><header className="border-b px-5 py-4 text-xl font-bold">{item.title||'公告'}</header><div className="max-h-[65vh] overflow-auto p-5"><RichTextView value={item.content}/></div><footer className="flex justify-end gap-2 border-t p-4"><button className="rounded border px-4 py-2" onClick={()=>close()}>关闭</button>{item.mode==='always'?<button className="rounded bg-violet-600 px-4 py-2 text-white" onClick={()=>close(true)}>不再提醒</button>:null}</footer></section></BlockingFullscreenModal>;
}
