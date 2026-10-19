import { randomUUID } from 'node:crypto';
import { publicationEnabled, publicationSession, forwardPublication } from './_configurationPublication.mjs';
import { publicationFailure } from './_configurationPublicationFailure.mjs';

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(!publicationEnabled())return res.status(503).json({error:'configuration-publication-disabled'});
  if(req.method!=='POST')return res.status(405).json({error:'method-not-allowed'});
  const origin=req.headers?.origin;
  let allowed=false;
  try{allowed=!!origin&&!!process.env.CAIRN_GITHUB_OAUTH_REDIRECT_URI&&new URL(origin).origin===new URL(process.env.CAIRN_GITHUB_OAUTH_REDIRECT_URI).origin;}catch{/* malformed origins are rejected below */}
  if(!allowed)return res.status(403).json({error:'configuration-origin-forbidden'});
  const session=publicationSession(req);if(!session)return res.status(401).json({error:'configuration-fresh-login-required'});
  const diagnosticId=randomUUID(),started=Date.now();
  res.setHeader('X-Cairn-Diagnostic-Id',diagnosticId);
  let input;
  try {
    if(typeof req.body==='string'){
      try{input=JSON.parse(req.body);}catch{throw Error('invalid-configuration-json');}
    }else input=req.body;
    const result=await forwardPublication(input,session);
    return res.status(result.status).json(result.payload);
  }catch(error){
    const failure=publicationFailure(error,diagnosticId);
    console.error(JSON.stringify({
      event:'cairn-configuration-publication-failed',diagnosticId,
      ...(['prepare','preflight','confirm','status'].includes(input?.operation)?{operation:input.operation}:{}),
      ...(/^[a-f0-9-]{36}$/i.test(input?.requestId??'')?{requestId:input.requestId}:{}),
      ...(/^config-[a-f0-9-]{36}$/i.test(input?.jobId??'')?{jobId:input.jobId}:{}),
      elapsedMs:Date.now()-started,status:failure.status,error:failure.payload.error,...failure.diagnostic,
    }));
    return res.status(failure.status).json(failure.payload);
  }
}
