// Local UI fixture. Authentication, uploads and server publication are mocked.
import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import JSZip from 'jszip';
import '../../../src/styles/index.css';
import seed from '../../../src/configStudio/defaults/r11-r7.config.json';
import {migrateConfigToR13} from '../../../src/configStudio/r13Migration';
import {persistActiveConfig} from '../../../src/configStudio/defaultConfigProvider';
import {GlobalPackageControls} from '../../../src/configStudio/GlobalPackageControls';
import {sha256Bytes,type ConfigurationIdentity} from '../../../src/configRuntime/formalConfiguration';
let config=migrateConfigToR13(seed as any).config;
config=await persistActiveConfig(config,true);
const bytes=new TextEncoder().encode(JSON.stringify(config));
let current:ConfigurationIdentity={releaseId:'config-browser-base',packageId:config.packageId,projectId:config.projectId,revision:config.revision,contractRevision:13,configSha256:await sha256Bytes(bytes),manifestSha256:'a'.repeat(64),configUrl:''};current.configUrl=`/configuration/releases/${current.configSha256}/config.json`;
let candidate:ConfigurationIdentity|undefined,candidateBytes:Uint8Array,revision=0,archiveSha256='',server:any;
const operations:string[]=[];
(window as any).publicationFixture={deploy:()=>{current=candidate!;window.dispatchEvent(new Event('focus'));},operations};
window.fetch=async(input,options)=>{
  const url=String(input);
  if(url==='/configuration/current.json')return Response.json(current);
  if(candidate&&url===candidate.configUrl)return new Response(candidateBytes);
  if(url==='https://publication-browser.invalid/package'){
    const blob=options!.body as Blob,raw=new Uint8Array(await blob.arrayBuffer()),zip=await JSZip.loadAsync(raw);candidateBytes=await zip.file('config.json')!.async('uint8array');
    const hash=await sha256Bytes(candidateBytes),manifestHash=await sha256Bytes(await zip.file('manifest.json')!.async('uint8array'));archiveSha256=await sha256Bytes(raw);
    candidate={...current,releaseId:'config-browser-candidate',revision,configSha256:hash,manifestSha256:manifestHash,configUrl:`/configuration/releases/${hash}/config.json`};return new Response('',{status:200});
  }
  if(url==='/api/config-publication'){
    const body=JSON.parse(String(options?.body)),operation=body.operation;operations.push(operation);
    if(operation==='prepare'){revision=body.proposedRevision;return Response.json({jobId:'config-browser-candidate',revision,upload:{url:'https://publication-browser.invalid/package'}});}
    if(operation==='preflight')server={jobId:'config-browser-candidate',state:'validated',actor:'Fixture',revision,identity:candidate,report:{valid:true,issues:[]},receipt:'local-fixture-only',configSha256:candidate!.configSha256,manifestSha256:candidate!.manifestSha256,archiveSha256};
    if(operation==='confirm')server={...server,state:'complete',receipt:undefined};
    return Response.json(server);
  }
  throw Error('Unexpected fixture fetch: '+url);
};
window.open=()=>{
  const popup={closed:false,location:{assign:(url:string)=>setTimeout(()=>{
    const event=new Event('message');Object.defineProperties(event,{origin:{value:location.origin},source:{value:popup},data:{value:{type:'cairn-configuration-auth-complete',nonce:new URL(url).searchParams.get('nonce'),status:'ok'}}});window.dispatchEvent(event);
  },0)}};
  return popup as any;
};
function Harness(){const [message,setMessage]=useState('');return <main style={{margin:24,maxWidth:1000}}><GlobalPackageControls config={config} records={[]} hasDraft={false} onSaved={()=>{}} onMessage={setMessage}/><p>{message}</p></main>;}
createRoot(document.getElementById('root')!).render(<Harness/>);
