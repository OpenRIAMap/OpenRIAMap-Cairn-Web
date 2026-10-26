import { build } from 'esbuild';
import { resolve } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root=resolve(import.meta.dirname,'../..');
const target=resolve(process.argv.slice(2).find(value=>!value.startsWith('--'))??resolve(root,'vendor/configuration-r11'));
const checking=process.argv.includes('--check');
const result=await build({absWorkingDir:root,entryPoints:[resolve(root,'scripts/config-tools/server-validation-entry.ts')],outfile:resolve(target,'r11-validation.mjs'),write:false,bundle:true,preserveSymlinks:true,format:'esm',platform:'node',target:'node20',packages:'bundle',alias:{'@':resolve(root,'src')},metafile:true,plugins:[{name:'no-browser-validator',setup(build){build.onResolve({filter:/^(react|react-dom|leaflet|zustand)(\/|$)/},args=>{throw Error(`Browser dependency in server validator: ${args.path} from ${args.importer}`);});}}]});
const files=Object.keys(result.metafile.inputs).sort(),sources={};
if(files.some(file=>/^(?:\.\.[\\/]|[A-Za-z]:|\/)/.test(file)))throw Error('Validation kernel includes an external workspace path; build must be reproducible from this repository.');
for(const file of files)sources[file.replaceAll('\\','/')]=createHash('sha256').update((await readFile(resolve(root,file),'utf8')).replaceAll('\r\n','\n')).digest('hex');
const body=Buffer.from(result.outputFiles[0].contents),manifest=Buffer.from(JSON.stringify({schemaVersion:'cairnmap.validation-kernel.v1',rulesVersion:'cairnmap-c16-production-1',sha256:createHash('sha256').update(body).digest('hex'),sourceTextEol:'LF',sources},null,2)+'\n');
if(checking){
  for(const [name,bytes] of [['r11-validation.mjs',body],['manifest.json',manifest]])if(!bytes.equals(await readFile(resolve(target,name))))throw Error('Validation kernel is stale: '+resolve(target,name));
}else{await mkdir(target,{recursive:true});await writeFile(resolve(target,'r11-validation.mjs'),body);await writeFile(resolve(target,'manifest.json'),manifest);}
console.log(`${checking?'Verified':'Built'} pure Node c11–c16 validator: ${files.length} inputs, ${body.length} bytes; no React/Leaflet/Zustand.`);
