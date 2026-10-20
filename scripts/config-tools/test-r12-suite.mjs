import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const root=path.resolve(import.meta.dirname,'../..'), out=path.resolve(process.argv[2]??'../../migration-runs/point-label-startup-v12-20261020');
fs.mkdirSync(out,{recursive:true});
const files=fs.readdirSync(import.meta.dirname).filter(name=>/^test-.*\.(ts|mjs)$/.test(name)&&name!=='test-r12-suite.mjs').sort().filter(name=>process.argv.length<=3||process.argv.slice(3).includes(name));
const rows=process.argv.length>3&&fs.existsSync(path.join(out,'web-tests.json'))?JSON.parse(fs.readFileSync(path.join(out,'web-tests.json'),'utf8')).rows.filter(row=>!files.includes(row.name)):[];
for(const name of files){
  const args=name.endsWith('.ts')?['node_modules/tsx/dist/cli.mjs','--tsconfig','tsconfig.app.json',`scripts/config-tools/${name}`]:[`scripts/config-tools/${name}`];
  const started=Date.now(), result=spawnSync(process.execPath,args,{cwd:root,encoding:'utf8',timeout:240000,windowsHide:true,maxBuffer:4*1024*1024});
  const row={name,passed:result.status===0,durationMs:Date.now()-started,exitCode:result.status,output:result.stdout+result.stderr+(result.error?String(result.error):'')};rows.push(row);
  if(!row.passed)console.log(`FAILED ${name}\n${row.output.slice(-2400)}`);
  if(rows.length%10===0)console.log(`Web regressions: ${rows.length}/${files.length}, failures ${rows.filter(row=>!row.passed).length}`);
  fs.writeFileSync(path.join(out,'web-tests.json'),JSON.stringify({generatedAt:new Date().toISOString(),rows},null,2)+'\n');
}
console.log(`Web regression results: ${rows.filter(row=>row.passed).length}/${rows.length} passed.`);
if(rows.some(row=>!row.passed))process.exitCode=1;
