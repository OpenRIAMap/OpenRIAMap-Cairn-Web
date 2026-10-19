import { verify } from './_reviewAuth.mjs';
import { signDispatcherRequest } from './review-relay-transfer.mjs';
import { ConfigurationPublicationForwardError } from './_configurationPublicationFailure.mjs';

export const publicationEnabled = (env=process.env) => env.CAIRN_CONFIGURATION_PUBLICATION_ENABLED === 'true';
export function publicationSession(req, env=process.env) {
  const cookie = String(req.headers?.cookie ?? '').split(';').map(value=>value.trim()).find(value=>value.startsWith('cairn_configuration_session='));
  let session;try {session=verify(decodeURIComponent(cookie?.slice('cairn_configuration_session='.length)??''),env.CAIRN_SESSION_SIGNING_SECRET);}catch{return null;}
  return session?.purpose==='configuration-publication' && /^[a-f0-9]{64}$/.test(session.snapshotSha256??'') && /^[a-f0-9]{64}$/.test(session.baseSha256??'') && /^[a-f0-9]{64}$/.test(session.baseIdentitySha256??'') && /^[A-Za-z0-9-]+$/.test(session.login??'') && session.expiresAt>Date.now() ? session : null;
}
export function normalizePublicationCommand(input, session) {
  if(!['prepare','preflight','confirm','status'].includes(input?.operation))throw Error('invalid-configuration-operation');
  const request={operation:input.operation,requestId:input.requestId};
  if(!/^[a-f0-9-]{36}$/i.test(request.requestId??''))throw Error('invalid-configuration-request-id');
  if(input.operation==='prepare'){
    if(input.snapshotSha256!==session.snapshotSha256||input.baseSha256!==session.baseSha256||!/^[a-f0-9]{64}$/.test(input.archiveSha256??'')||!Number.isSafeInteger(input.byteLength)||input.byteLength<1||input.byteLength>64*1024*1024||!Number.isSafeInteger(input.proposedRevision)||input.proposedRevision<1)throw Error('configuration-snapshot-mismatch');
    Object.assign(request,{snapshotSha256:session.snapshotSha256,baseSha256:session.baseSha256,archiveSha256:input.archiveSha256,byteLength:input.byteLength,proposedRevision:input.proposedRevision});
  }else{
    if(!/^[a-zA-Z0-9-]{1,100}$/.test(input.jobId??''))throw Error('invalid-configuration-job');
    request.jobId=input.jobId;
    if(input.operation==='confirm'){if(typeof input.receipt!=='string'||input.receipt.length>4096)throw Error('invalid-configuration-preflight-receipt');request.receipt=input.receipt;request.warningsAccepted=input.warningsAccepted===true;}
  }
  return {operation:'configuration-publication',request,actor:{principalId:session.login},authentication:{purpose:session.purpose,nonce:session.nonce,snapshotSha256:session.snapshotSha256,baseSha256:session.baseSha256,baseIdentitySha256:session.baseIdentitySha256,expiresAt:session.expiresAt}};
}
export async function forwardPublication(input,session,env=process.env,fetcher=fetch){
  if(!env.CAIRN_CONTROL_API_BASE||!env.CAIRN_BROKER_TO_DISPATCHER_SECRET)throw Error('configuration-publisher-not-configured');
  const body=normalizePublicationCommand(input,session),signed=signDispatcherRequest(body,env.CAIRN_BROKER_TO_DISPATCHER_SECRET);
  let response;
  try {
    response=await fetcher(`${env.CAIRN_CONTROL_API_BASE.replace(/\/$/,'')}/v1/review-intents`,{method:'POST',headers:{'content-type':'application/json','x-cairn-timestamp':signed.timestamp,'x-cairn-signature':signed.signature},body:JSON.stringify(body),signal:AbortSignal.timeout(25000)});
  } catch (error) { throw new ConfigurationPublicationForwardError(error, 'request'); }
  try { return {status:response.status,payload:await response.json()}; }
  catch (error) { throw new ConfigurationPublicationForwardError(error, 'response', response.status); }
}
