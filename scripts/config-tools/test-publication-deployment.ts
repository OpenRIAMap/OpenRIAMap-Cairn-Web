import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { checkPublicationWebDeployment } from '../../src/configStudio/publicationDeployment';
import type { ConfigurationIdentity } from '../../src/configRuntime/formalConfiguration';
Object.assign(globalThis,{location:new URL('http://localhost:5202')});
const bytes=Buffer.from('{}'),hash=createHash('sha256').update(bytes).digest('hex');
const expected:ConfigurationIdentity={packageId:'cairnmap-config-v32-semantic',projectId:'openriamap-ria',revision:11,contractRevision:13,releaseId:'config-web-test',configSha256:hash,manifestSha256:'a'.repeat(64),configUrl:`/configuration/releases/${hash}/config.json`};
const fetcher=globalThis.fetch;let pointer=expected,body:Buffer=bytes,status=200,reads=0,changeAfterBody=false;
globalThis.fetch=async input=>{const url=String(input);assert(!url.startsWith('/api/'),'final deployment polling never calls SCF');if(url==='/configuration/current.json'){reads++;return new Response(JSON.stringify(pointer),{status});}if(changeAfterBody)pointer={...expected,revision:12,releaseId:'config-next'};return new Response(body);};
try{
  pointer={...expected,revision:10};assert.equal((await checkPublicationWebDeployment(expected)).state,'waiting');
  pointer=expected;assert.equal((await checkPublicationWebDeployment(expected)).state,'ready');
  body=Buffer.from('wrong');assert.equal((await checkPublicationWebDeployment(expected)).state,'error');body=bytes;
  pointer={...expected,manifestSha256:'b'.repeat(64)};assert.equal((await checkPublicationWebDeployment(expected)).state,'waiting','same config SHA but different full identity cannot confirm');
  pointer={...expected,revision:12};assert.equal((await checkPublicationWebDeployment(expected)).state,'superseded');
  pointer=expected;changeAfterBody=true;assert.equal((await checkPublicationWebDeployment(expected)).state,'superseded','concurrent later release cannot be reported ready');changeAfterBody=false;
  status=503;assert.equal((await checkPublicationWebDeployment(expected)).state,'error');
  console.log(`Publication deployment: old pointer, complete identity, content hash, HTTP failure and concurrent/superseding releases passed (${reads} static reads; zero SCF calls).`);
}finally{globalThis.fetch=fetcher;}
