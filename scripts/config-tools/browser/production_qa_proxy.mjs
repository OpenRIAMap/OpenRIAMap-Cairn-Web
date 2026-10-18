// Read-only browser QA transport for the exact six captured public Data objects.
// This avoids localhost CORS restrictions; it never changes their JSON bytes.
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
const root=resolve(process.argv[2]);
http.createServer(async(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Cache-Control','no-store');
  if(req.method==='OPTIONS'){res.setHeader('Access-Control-Allow-Headers','*');res.end();return;}
  try{
    const path=new URL(req.url,'http://localhost').pathname;if(!path.startsWith('/data/'))throw Error();
    const file=resolve(root,decodeURIComponent(path.slice('/data/'.length)));
    if(!file.startsWith(root+sep))throw Error();const bytes=await readFile(file);
    res.setHeader('Content-Type','application/json');res.end(bytes);
  }catch{res.statusCode=404;res.end('{}');}
}).listen(5203,'127.0.0.1',()=>console.log('Read-only recorded Data transport: http://127.0.0.1:5203'));
