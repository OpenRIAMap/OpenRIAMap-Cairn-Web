// Isolated QA transport only: public JSON GETs, no authentication or writes.
import http from 'node:http';
import fs from 'node:fs/promises';
import {resolve,sep,dirname} from 'node:path';
const folder=resolve(process.argv[2]);
const report=JSON.parse(await fs.readFile(resolve(folder,'live-reader-result.json'),'utf8'));
const roots=new Map(report.reports.map(source=>[source.id,source.rootUrl]));
http.createServer(async(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:5204');res.setHeader('Cache-Control','no-store');
  if(req.method==='OPTIONS'){res.setHeader('Access-Control-Allow-Headers','*');res.end();return;}
  if(req.method!=='GET'){res.statusCode=405;res.end();return;}
  try{
    const parts=decodeURIComponent(new URL(req.url,'http://localhost').pathname).split('/').filter(Boolean),id=parts.shift(),key=parts.join('/');
    if(!roots.has(id)||parts.some(part=>part==='..'||part==='.'||part.includes('\\'))||!key.endsWith('.json')||!(/^(Current|Release_Metadata|Data_Merge|Picture_Index)\//.test(key)||/^current\/worlds\//.test(key)||/^releases\/[A-Za-z0-9-]+\/(manifests|data-merge|media-index-merge)\//.test(key)))throw Error('not public data');
    const base=resolve(folder,'objects',id),file=resolve(base,key);if(!file.startsWith(base+sep))throw Error('path escape');
    let bytes;try{bytes=await fs.readFile(file);}catch{const response=await fetch(roots.get(id)+'/'+key,{signal:AbortSignal.timeout(15000)});if(!response.ok){res.statusCode=response.status;res.end('{}');return;}bytes=Buffer.from(await response.arrayBuffer());await fs.mkdir(dirname(file),{recursive:true});await fs.writeFile(file,bytes);}
    res.setHeader('Content-Type','application/json; charset=utf-8');res.end(bytes);
  }catch{res.statusCode=404;res.end('{}');}
}).listen(5211,'127.0.0.1',()=>console.log('Read-only QA data transport at http://127.0.0.1:5211'));
