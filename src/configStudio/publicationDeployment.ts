import { assertConfigurationIdentity, sha256Bytes, type ConfigurationIdentity } from '../configRuntime/formalConfiguration';
import { stableConfigText } from '../configRuntime/configurationFingerprint';

export type PublicationWebState = { state:'ready'|'waiting'|'superseded'|'error'; message:string };
/** Only static Web files. Server completion and final deployment are separate. */
export async function checkPublicationWebDeployment(expected: ConfigurationIdentity, signal?: AbortSignal): Promise<PublicationWebState> {
  try {
    assertConfigurationIdentity(expected);
    const requestSignal=signal?AbortSignal.any([signal,AbortSignal.timeout(10000)]):AbortSignal.timeout(10000);
    const read=async()=>{
      const response=await fetch('/configuration/current.json',{cache:'no-store',signal:requestSignal});
      if(!response.ok)throw Error(`Web current 读取失败（HTTP ${response.status}）。`);
      const identity:unknown=await response.json();assertConfigurationIdentity(identity);return identity;
    };
    const mismatch=(identity:ConfigurationIdentity):PublicationWebState => identity.packageId===expected.packageId&&identity.projectId===expected.projectId&&identity.revision>expected.revision
      ? {state:'superseded',message:`Web 已进入后续发布 r${identity.revision}；本任务的最终 Web 身份未确认，请核对当前正式发布。`}
      : {state:'waiting',message:`服务端发布完成；Web 当前仍是配置 r${identity.revision}／契约 c${identity.contractRevision}，等待最终生产部署。`};
    const current=await read();
    if(stableConfigText(current)!==stableConfigText(expected))return mismatch(current);
    const response=await fetch(current.configUrl,{cache:'no-store',signal:requestSignal});
    if(!response.ok)throw Error(`Web 配置读取失败（HTTP ${response.status}）。`);
    if(Number(response.headers.get('content-length'))>64*1024*1024)throw Error('Web 配置超过读取大小限制。');
    const bytes=new Uint8Array(await response.arrayBuffer());
    if(bytes.byteLength>64*1024*1024||await sha256Bytes(bytes)!==expected.configSha256)throw Error('Web 配置字节与正式摘要不一致。');
    const after=await read();
    if(stableConfigText(after)!==stableConfigText(expected))return mismatch(after);
    return {state:'ready',message:`最终 Web 部署已确认：配置 r${expected.revision}／契约 c${expected.contractRevision}，完整身份及配置摘要一致。`};
  }catch(error){return {state:'error',message:`最终 Web 部署尚未确认：${error instanceof Error?error.message:String(error)} 可重试检查，原发布任务保持。`};}
}
