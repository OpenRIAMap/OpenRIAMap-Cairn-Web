import assert from 'node:assert/strict';
import { sign, verify } from '../../api/_reviewAuth.mjs';
import configuration from '../../api/configuration.mjs';
import publicationHandler from '../../api/config-publication.mjs';
import oauthStart from '../../api/auth/github/start.mjs';
import oauthCallback from '../../api/auth/github/callback.mjs';
import crypto from 'node:crypto';
import { publicationSession, normalizePublicationCommand, publicationEnabled } from '../../api/_configurationPublication.mjs';
const env={CAIRN_SESSION_SIGNING_SECRET:'unit-test-secret'},snapshot='a'.repeat(64),base='b'.repeat(64),requestId=crypto.randomUUID();
const session={purpose:'configuration-publication',login:'maintainer-test',nonce:crypto.randomUUID(),snapshotSha256:snapshot,baseSha256:base,baseIdentitySha256:'e'.repeat(64),expiresAt:Date.now()+60000};
const req={headers:{cookie:'cairn_configuration_session='+encodeURIComponent(sign(session,env.CAIRN_SESSION_SIGNING_SECRET))}};
assert.equal(publicationSession(req,env).login,session.login);
assert.equal(publicationSession({headers:{cookie:'cairn_review_session='+encodeURIComponent(sign({login:'user',expiresAt:session.expiresAt},env.CAIRN_SESSION_SIGNING_SECRET))}},env),null);
for(const change of [{purpose:'review'},{expiresAt:0},{snapshotSha256:'invalid'}])assert.equal(publicationSession({headers:{cookie:'cairn_configuration_session='+encodeURIComponent(sign({...session,...change},env.CAIRN_SESSION_SIGNING_SECRET))}},env),null);
const prepare={operation:'prepare',requestId,snapshotSha256:snapshot,baseSha256:base,archiveSha256:'c'.repeat(64),byteLength:128,proposedRevision:8,actor:{principalId:'attacker',role:'maintainer'},repository:'attacker'};
const body=normalizePublicationCommand(prepare,session);
assert.deepEqual(body.actor,{principalId:'maintainer-test'});assert.equal(body.request.repository,undefined);assert.equal(body.request.actor,undefined);
for(const change of [{operation:'deploy-code'},{snapshotSha256:'d'.repeat(64)},{baseSha256:'d'.repeat(64)},{byteLength:64*1024*1024+1},{requestId:'../unsafe'}])assert.throws(()=>normalizePublicationCommand({...prepare,...change},session));
assert.equal(publicationEnabled({CAIRN_CONFIGURATION_PUBLICATION_ENABLED:'true'}),true);
assert.equal(publicationEnabled({CAIRN_REVIEW_AUTOMATION_ENABLED:'true',CAIRN_REVIEW_AUTOMATION_STAGE:'staging'}),false);
console.log('configuration-publication-api: separate signed fresh session, expiration/purpose/snapshot binding, actor stripping, controlled operations, size/path guards and independent environment gate passed');

function response(){return {headers:{},setHeader(key,value){this.headers[key]=value;return this;},status(code){this.statusCode=code;return this;},json(body){this.body=body;return this;},send(body){this.body=body;return this;},redirect(code,url){this.statusCode=code;this.url=url;return this;}};}
const oldEnv={...process.env},oldFetch=globalThis.fetch;
try{
  process.env.CAIRN_CONFIGURATION_RUNTIME_ENABLED='true';process.env.CAIRN_CONFIGURATION_PUBLICATION_ENABLED='true';
  process.env.CAIRN_CONTROL_API_BASE='https://dispatcher.example.test';process.env.CAIRN_BROKER_TO_DISPATCHER_SECRET='test-broker-secret';
  process.env.CAIRN_SESSION_SIGNING_SECRET=env.CAIRN_SESSION_SIGNING_SECRET;
  process.env.CAIRN_GITHUB_OAUTH_CLIENT_ID='test-client';process.env.CAIRN_GITHUB_OAUTH_CLIENT_SECRET='test-client-secret';process.env.CAIRN_GITHUB_OAUTH_REDIRECT_URI='https://cairn.example.test/api/auth/github/callback';
  process.env.CAIRN_REVIEW_AUTOMATION_ENABLED='false';
  globalThis.fetch=async(url,options)=>{
    assert.equal(url,'https://dispatcher.example.test/v1/review-intents');
    assert.equal(options.body,JSON.stringify({operation:'configuration-active-read'}));
    const expected=crypto.createHmac('sha256','test-broker-secret').update(options.headers['x-cairn-timestamp']+'.'+options.body).digest('base64url');
    assert.equal(options.headers['x-cairn-signature'],expected);
    return {ok:true,json:async()=>({identity:{configSha256:snapshot}})};
  };
  const active=response();await configuration({method:'GET'},active);assert.equal(active.statusCode,200);assert.equal(active.body.configSha256,snapshot);assert.equal(active.headers['Cache-Control'],'no-store');
  globalThis.fetch=async()=>{throw Error('authority unavailable');};
  const unavailable=response();await configuration({method:'GET'},unavailable);assert.equal(unavailable.statusCode,503,'never silently use seed after an enabled authority fails');
  const query={purpose:'configuration-publication',mode:'popup',nonce:session.nonce,snapshotSha256:snapshot,baseSha256:base,baseIdentitySha256:session.baseIdentitySha256};
  const start=response();oauthStart({query},start);assert.equal(start.statusCode,302);const url=new URL(start.url),state=url.searchParams.get('state');assert.equal(url.searchParams.get('prompt'),'select_account');
  assert.equal(verify(state,env.CAIRN_SESSION_SIGNING_SECRET).baseIdentitySha256,session.baseIdentitySha256);
  const rejected=response();await oauthCallback({query:{state,code:'test-code'},headers:{}},rejected);assert.equal(rejected.statusCode,401);
  const badOrigin=response();await publicationHandler({method:'POST',headers:{origin:'malformed'}},badOrigin);assert.equal(badOrigin.statusCode,403);
  const badCookie=response();await oauthCallback({query:{state,code:'test-code'},headers:{cookie:'cairn_configuration_oauth=%invalid'}},badCookie);assert.equal(badCookie.statusCode,401);
  let tokenRequests=0;globalThis.fetch=async()=>({ok:true,json:async()=>++tokenRequests===1?{access_token:'test-token'}:{login:session.login}});
  const callback=response();await oauthCallback({query:{state,code:'test-code'},headers:{cookie:'cairn_configuration_oauth='+encodeURIComponent(state)}},callback);
  assert.equal(callback.statusCode,200);assert(callback.body.includes('cairn-configuration-auth-complete'));
  assert(callback.headers['Set-Cookie'][0].includes('Path=/api/config-publication; HttpOnly; Secure; SameSite=Lax'));
  const signed=callback.headers['Set-Cookie'][0].split(';')[0].slice('cairn_configuration_session='.length),fresh=verify(decodeURIComponent(signed),env.CAIRN_SESSION_SIGNING_SECRET);
  assert.equal(fresh.purpose,'configuration-publication');assert.equal(fresh.snapshotSha256,snapshot);assert.equal(fresh.baseIdentitySha256,session.baseIdentitySha256);
  console.log('configuration authority and OAuth: signed private-COS proxy, fail-closed authority, nonce/browser state, fresh scoped cookie, independent review gate passed');
}finally{
  globalThis.fetch=oldFetch;for(const key of Object.keys(process.env))if(!(key in oldEnv))delete process.env[key];Object.assign(process.env,oldEnv);
}

await import('./test-configuration-publication-transport.mjs');
