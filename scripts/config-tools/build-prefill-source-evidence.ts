/** Explicit project evidence generation, never a read/activation migration. */
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {resolveEffectiveFields} from '../../src/configStudio/runtime';
import type {ClassificationPath,ConfigPackageV3} from '../../src/configStudio/types';
const [targetFile,tableFile]=process.argv.slice(2);
if(!targetFile||!tableFile)throw Error('Usage: tsx build-prefill-source-evidence.ts <verified-target-config.json> <approved-migration-table.md>');
const sourceFile='src/configStudio/defaults/r11-r7.config.json',raw=fs.readFileSync(sourceFile),targetRaw=fs.readFileSync(targetFile),table=fs.readFileSync(tableFile),old=JSON.parse(raw.toString()) as ConfigPackageV3,target=JSON.parse(targetRaw.toString()) as ConfigPackageV3;
const mappings=new Map([...table.toString().matchAll(/\| `([^`]+)` \| `([^`]+)` \|/g)].map(match=>[match[1],match[2]])),paths=new Set<string>();
const pathText=(path:ClassificationPath)=>[path.class,path.kind,path.skind,path.skind2].filter(Boolean).join('/');
const pathValue=(path:string)=>Object.fromEntries(path.split('/').map((value,index)=>[['class','kind','skind','skind2'][index],value])) as ClassificationPath;
function visit(value:unknown){if(Array.isArray(value))value.forEach(visit);else if(value&&typeof value==='object'){const row=value as Record<string,any>;if(row.prefillAudit)paths.add(pathText(row.prefillAudit.source.path));Object.values(row).forEach(visit);}}
visit(target);
const rows=[];
for(const path of [...paths].sort()){
 const to=mappings.get(path);if(!to||to===path||!old.nodes.some(node=>pathText(node.path)===path)||!target.nodes.some(node=>pathText(node.path)===to))continue;
 const after=resolveEffectiveFields(target,pathValue(to));
 for(const field of resolveEffectiveFields(old,pathValue(path))){const matches=after.filter(value=>value.key===field.key);if(matches.length===1)rows.push({beforePath:pathValue(path),afterPath:pathValue(to),beforeField:field,afterFieldId:matches[0].fieldId});}
}
const sha=(value:Buffer)=>createHash('sha256').update(value).digest('hex');
const evidence={projectId:target.projectId,evidence:'Approved classification-restructure-20261024 migration table; template field IDs explicitly paired; full effective field definitions (including inherited/public sources) compared before repair.',sourceSnapshot:sourceFile,sourceSha256:sha(raw),migrationTable:tableFile.split(/[\\/]/).pop(),migrationTableSha256:sha(table),targetSnapshotSha256:sha(targetRaw),rows};
fs.writeFileSync('docs/90_roadmap-and-history/c18-followup-20261106/prefillSourceMigrationEvidence.json',JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify({identities:rows.length,paths:new Set(rows.map(row=>pathText(row.beforePath))).size}));
