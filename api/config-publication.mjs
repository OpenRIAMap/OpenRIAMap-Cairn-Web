import { publicationEnabled, publicationSession, forwardPublication } from './_configurationPublication.mjs';

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(!publicationEnabled())return res.status(503).json({error:'configuration-publication-disabled'});
  if(req.method!=='POST')return res.status(405).json({error:'method-not-allowed'});
  const origin=req.headers?.origin;
  let allowed=false;
  try{allowed=!!origin&&!!process.env.CAIRN_GITHUB_OAUTH_REDIRECT_URI&&new URL(origin).origin===new URL(process.env.CAIRN_GITHUB_OAUTH_REDIRECT_URI).origin;}catch{/* malformed origins are rejected below */}
  if(!allowed)return res.status(403).json({error:'configuration-origin-forbidden'});
  const session=publicationSession(req);if(!session)return res.status(401).json({error:'configuration-fresh-login-required'});
  try{const input=typeof req.body==='string'?JSON.parse(req.body):req.body;const result=await forwardPublication(input,session);return res.status(result.status).json(result.payload);}catch(error){return res.status(400).json({error:error instanceof Error?error.message:'configuration-publication-failed'});}
}
