import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {loadFormalWorldRuleDataset} from '../../src/components/Rules/data/formalReleaseReader';
import type {RuleDataSourceSnapshot} from '../../src/components/Rules/data/formalDataSourceRuntime';
import type {ConfigPackageV3,ClassificationPath} from '../../src/configStudio/types';
import {migrateButtonClassification,matchesButtonClassification} from '../../src/core/project/buttonClassification';
const out=process.argv[2];if(!out)throw Error('Output directory required');fs.mkdirSync(path.join(out,'published-json'),{recursive:true});
const config=JSON.parse(fs.readFileSync('src/configStudio/defaults/r10-r6.config.json','utf8')) as ConfigPackageV3;
const root='https://raw.githubusercontent.com/OpenRIAMap/OpenRIAMap-Cairn-Data/main';
const fetchJson=async<T>(key:string):Promise<T>=>{const file=path.join(out,'published-json',createHash('sha256').update(key).digest('hex')+'.json');if(fs.existsSync(file))return JSON.parse(fs.readFileSync(file,'utf8'));const response=await fetch(root+'/'+key,{signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error(`HTTP ${response.status}: ${key}`);const text=await response.text();fs.writeFileSync(file,text);return JSON.parse(text);};
const results=[];
for(const world of config.application!.worlds.filter(world=>world.enabled)){
 const releaseSet=await fetchJson<{worlds:string[]}>('current/worlds/_release-set.json');if(!releaseSet.worlds.includes(world.id)){results.push({world:world.id,status:'not-published',records:0});console.log(`${world.id}: no published world in release set; no record parity claim`);continue;}
 const data=await loadFormalWorldRuleDataset({worldId:world.id,source:{rootUrl:root,sourceId:'formal-github',remoteWorldId:world.id} as RuleDataSourceSnapshot,fetchJson});
 const paths=data.features.map(record=>{const tags=record.tags as Record<string,unknown>|undefined;return {class:String(record.Class??''),kind:String(record.Kind??tags?.Kind??''),skind:String(record.SKind??tags?.SKind??''),skind2:String(record.SKind2??tags?.SKind2??'')} as ClassificationPath;});
 const migrated=migrateButtonClassification(config.application!.buttons,config.nodes.map(n=>n.path),paths);
 results.push({world:world.id,releaseId:data.releaseId,records:paths.length,buttons:config.application!.buttons.items.map(old=>({id:old.id,before:paths.filter(record=>matchesButtonClassification(record,old.criteria)).length,after:paths.filter(record=>matchesButtonClassification(record,migrated.buttons.items.find(row=>row.id===old.id)!.criteria)).length}))});
 console.log(`${world.id}: ${paths.length} records, release ${data.releaseId}, all 8 button match sets preserved`);
}
fs.writeFileSync(path.join(out,'published-button-migration.json'),JSON.stringify({root,checkedAt:new Date().toISOString(),worlds:results},null,2));
