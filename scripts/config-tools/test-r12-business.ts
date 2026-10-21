import assert from 'node:assert/strict';
import fs from 'node:fs';
import { businessIdentitiesMatch, checkBusinessConfiguration } from '../../src/configRuntime/businessConfiguration';
import { assertConfigurationIdentity, type ConfigurationIdentity } from '../../src/configRuntime/formalConfiguration';
const published=JSON.parse(fs.readFileSync('public/configuration/current.json','utf8')) as ConfigurationIdentity;
Object.assign(globalThis,{location:new URL('https://cmap.ria9.top/')});
assertConfigurationIdentity(published);
// Exercise all supported contracts regardless of which one the publication
// pointer currently selects. Identity-only fixtures never fetch config bytes.
for (const contractRevision of [11,12,13]) {
const web={...published,contractRevision};
assertConfigurationIdentity(web);
let requests=0;
const fetcher=(async(url,options)=>{requests++;assert.equal(url,'/api/configuration?purpose=business');assert.equal(options?.cache,'no-store');assert(options?.signal);return new Response(JSON.stringify(web),{headers:{'x-cairn-configuration-authority':'scf'}});}) as typeof fetch;
await checkBusinessConfiguration(fetcher,web);await checkBusinessConfiguration(fetcher,web);assert.equal(requests,2,'a previous pass cannot authorize later operations permanently');
for(const key of ['projectId','packageId','contractRevision','revision','configSha256','manifestSha256','releaseId'] as const){
  const changed={...web,[key]:key==='contractRevision'?(contractRevision===11?12:11):typeof web[key]==='number'?Number(web[key])+1:key.endsWith('Sha256')?'0'.repeat(64):'different'} as ConfigurationIdentity;
  if(key==='configSha256')changed.configUrl=`/configuration/releases/${changed.configSha256}/config.json`;
  assertConfigurationIdentity(changed);
  assert(!businessIdentitiesMatch(web,changed));
  await assert.rejects(()=>checkBusinessConfiguration((async()=>new Response(JSON.stringify(changed),{headers:{'x-cairn-configuration-authority':'scf'}})) as typeof fetch,web),/当前 Web 与 SCF 的生效配置不一致/);
}
await assert.rejects(()=>checkBusinessConfiguration((async()=>new Response(JSON.stringify({...web,contractRevision:14}),{headers:{'x-cairn-configuration-authority':'scf'}})) as typeof fetch,web),/正式配置索引身份无效/,'unsupported contracts must fail identity validation, not the supported-version mismatch check');
await assert.rejects(()=>checkBusinessConfiguration((async()=>new Response(JSON.stringify(web))) as typeof fetch,web),/无法确认/,'a Web fallback is not SCF authority proof');
await assert.rejects(()=>checkBusinessConfiguration((async()=>{throw Error('timeout');}) as typeof fetch,web),/阻断/);
await assert.rejects(()=>checkBusinessConfiguration(fetcher,undefined),/没有已核验/);
}
console.log('r12 business boundary: r11/r12/r13 active identities, valid mismatches, unsupported-contract rejection, explicit SCF authority, no pass cache, no captured-package revision gate, fail-closed remote operations passed.');
