import assert from 'node:assert/strict';
import fs from 'node:fs';
import { businessIdentitiesMatch, checkBusinessConfiguration } from '../../src/configRuntime/businessConfiguration';
import type { ConfigurationIdentity } from '../../src/configRuntime/formalConfiguration';
const web=JSON.parse(fs.readFileSync('public/configuration/current.json','utf8')) as ConfigurationIdentity;
Object.assign(globalThis,{location:new URL('https://cmap.ria9.top/')});
let requests=0;
const fetcher=(async(url,options)=>{requests++;assert.equal(url,'/api/configuration?purpose=business');assert.equal(options?.cache,'no-store');assert(options?.signal);return new Response(JSON.stringify(web),{headers:{'x-cairn-configuration-authority':'scf'}});}) as typeof fetch;
await checkBusinessConfiguration(fetcher,web);await checkBusinessConfiguration(fetcher,web);assert.equal(requests,2,'a previous pass cannot authorize later operations permanently');
for(const key of ['projectId','packageId','contractRevision','revision','configSha256','manifestSha256','releaseId'] as const){
  const changed={...web,[key]:typeof web[key]==='number'?Number(web[key])+1:key.endsWith('Sha256')?'0'.repeat(64):'different'} as ConfigurationIdentity;
  if(key==='configSha256')changed.configUrl=`/configuration/releases/${changed.configSha256}/config.json`;
  assert(!businessIdentitiesMatch(web,changed));
  await assert.rejects(()=>checkBusinessConfiguration((async()=>new Response(JSON.stringify(changed),{headers:{'x-cairn-configuration-authority':'scf'}})) as typeof fetch,web),/不一致/);
}
await assert.rejects(()=>checkBusinessConfiguration((async()=>new Response(JSON.stringify(web))) as typeof fetch,web),/无法确认/,'a Web fallback is not SCF authority proof');
await assert.rejects(()=>checkBusinessConfiguration((async()=>{throw Error('timeout');}) as typeof fetch,web),/阻断/);
await assert.rejects(()=>checkBusinessConfiguration(fetcher,undefined),/没有已核验/);
console.log('r12 business boundary: complete identity comparison, explicit SCF authority, no pass cache, no captured-package revision gate, fail-closed remote operations passed.');
