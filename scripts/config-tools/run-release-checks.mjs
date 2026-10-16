import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const out=process.env.CAIRNMAP_RELEASE_REPAIR_OUT??'migration-runs/release-repair-20261017/checks';fs.mkdirSync(out,{recursive:true});
const results=[];
for(const command of pkg.scripts['verify:config-v32'].split(' && ')){
  const name=command.replace('npm run ',''),args=pkg.scripts[name].split(' ').slice(1);let output='',ok=true;
  try{output=execFileSync(process.execPath,['./node_modules/tsx/dist/cli.mjs',...args],{encoding:'utf8',maxBuffer:8*1024*1024});}catch(error){ok=false;output=(error.stdout??'')+(error.stderr??'');}
  fs.writeFileSync(path.join(out,name.replace(':','-')+'.log'),output.replace(/\r\n/g,'\n'));results.push({name,ok});console.log(ok?'PASS':'FAIL',name);if(!ok)console.log(output.slice(-5000));
}
fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2)+'\n');
console.log(`Complete: ${results.filter(row=>row.ok).length}/${results.length}`);if(results.some(row=>!row.ok))process.exitCode=1;
