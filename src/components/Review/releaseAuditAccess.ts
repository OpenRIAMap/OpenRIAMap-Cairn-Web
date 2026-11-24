import {useCallback,useEffect,useRef,useState} from 'react';
import {openriamapGithubReviewAuth} from './openriamapReviewAuth';
export const canReadReleaseAudit=(session:{status:string;roles?:string[]})=>session.status==='authenticated'&&Boolean(session.roles?.some(role=>['contributor','contributer','reviewer','maintainer','admin'].includes(role.toLowerCase())));
export function useReleaseAuditAccess(){
  const [authorized,setAuthorized]=useState<boolean|null>(null),generation=useRef(0);
  const refresh=useCallback(async()=>{const token=++generation.current;const session=await openriamapGithubReviewAuth.getSession();const result=canReadReleaseAudit(session);if(token===generation.current)setAuthorized(result);return result;},[]);
  useEffect(()=>{
    void refresh();const changed=()=>{setAuthorized(null);void refresh();},focused=()=>{void refresh();};
    window.addEventListener('ria:review-auth-changed',changed);window.addEventListener('focus',focused);
    const timer=window.setInterval(focused,60000);
    return()=>{generation.current++;window.clearInterval(timer);window.removeEventListener('ria:review-auth-changed',changed);window.removeEventListener('focus',focused);};
  },[refresh]);
  return {authorized,refresh};
}
