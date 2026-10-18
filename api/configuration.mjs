import baseline from '../public/configuration/current.json' with { type: 'json' };
import {signDispatcherRequest} from './review-relay-transfer.mjs';

/** Trusted deployment binding, deliberately independent of uploaded review settings. */
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'method-not-allowed' });
  if(process.env.CAIRN_CONFIGURATION_RUNTIME_ENABLED==='true'){
    try{
      const base=process.env.CAIRN_CONTROL_API_BASE,secret=process.env.CAIRN_BROKER_TO_DISPATCHER_SECRET;
      if(!base||!secret)throw Error('configuration-broker-not-configured');
      const body={operation:'configuration-active-read'},signed=signDispatcherRequest(body,secret);
      const response=await fetch(`${base.replace(/\/$/,'')}/v1/review-intents`,{method:'POST',headers:{'content-type':'application/json','x-cairn-timestamp':signed.timestamp,'x-cairn-signature':signed.signature},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
      const value=await response.json();if(!response.ok||!value.identity?.configSha256)throw Error('configuration-authority-unavailable');
      return res.status(200).json(value.identity);
    }catch{return res.status(503).json({error:'formal-configuration-unavailable'});}
  }
  const target = process.env.CAIRN_CONFIGURATION_ACTIVE_URL;
  if (!target) return process.env.CAIRN_CONFIGURATION_PUBLICATION_ENABLED==='true' ? res.status(503).json({error:'formal-configuration-binding-required'}) : res.status(200).json(baseline);
  try {
    const url = new URL(target);
    if (url.protocol !== 'https:') throw Error('unsafe deployment binding');
    const response = await fetch(url, { signal: AbortSignal.timeout(10000), cache: 'no-store', redirect: 'error' });
    if (!response.ok) throw Error('active pointer unavailable');
    const active = await response.json();
    if (active.schemaVersion !== 'cairnmap.configuration-active.v1' || !active.identity?.configSha256) throw Error('unsupported active pointer');
    return res.status(200).json(active.identity);
  } catch { return res.status(503).json({ error: 'formal-configuration-unavailable' }); }
}
