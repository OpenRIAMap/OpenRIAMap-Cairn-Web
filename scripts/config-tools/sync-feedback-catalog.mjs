import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
const args=process.argv.slice(2),pipeline=args[args.indexOf('--pipeline')+1];
if(!args.includes('--pipeline')||!pipeline)throw Error('Usage: node scripts/config-tools/sync-feedback-catalog.mjs --pipeline <checkout> [--check]');
const source=resolve(import.meta.dirname,'../../src/feedback'),target=resolve(pipeline,'vendor/feedback');
const bytes=await readFile(resolve(source,'remoteFeedbackCatalog.json'));
const catalog=JSON.parse(bytes);for(const [code,row] of Object.entries(catalog))if(!row.zh?.trim()||typeof row.en!=='string')throw Error('Missing zh/en feedback: '+code);
const contract=JSON.parse(await readFile(resolve(source,'contract.json'),'utf8'));contract.catalogSha256=createHash('sha256').update(bytes).digest('hex');
const manifest=Buffer.from(JSON.stringify(contract,null,2)+'\n');
for(const [directory,name,body] of [[source,'contract.json',manifest],[target,'contract.json',manifest],[target,'remoteFeedbackCatalog.json',bytes]]){
 const path=resolve(directory,name);if(args.includes('--check')){if(!body.equals(await readFile(path)))throw Error('Feedback catalog is not synchronized: '+path);}else await writeFile(path,body);
}
console.log('Feedback catalog synchronized: '+contract.catalogSha256);
