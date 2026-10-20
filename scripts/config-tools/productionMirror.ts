import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import JSZip from 'jszip';
import {readRawNativePackage} from '../../src/configStudio/nativeArchive';
import {validateConfigPackage} from '../../src/configStudio/runtime';
import {stableConfigText} from '../../src/configRuntime/configurationFingerprint';
const sha=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
/** The registered seed is immutable; the published mirror's current pointer
 * is deliberately mutable. Both must remain independently verifiable. */
export async function verifyPublishedMirror(publicRoot=path.resolve('public')){
  const identity=JSON.parse(await fs.readFile(path.join(publicRoot,'configuration/current.json'),'utf8'));
  if(![11,12].includes(identity.contractRevision)||identity.packageId!=='cairnmap-config-v32-semantic'||identity.projectId!=='openriamap-ria'||!Number.isSafeInteger(identity.revision)||identity.revision<1||!/^[A-Za-z0-9][A-Za-z0-9._-]{2,127}$/.test(identity.releaseId??'')||!/^[a-f0-9]{64}$/.test(identity.configSha256??'')||!/^[a-f0-9]{64}$/.test(identity.manifestSha256??'')||identity.configUrl!==`/configuration/releases/${identity.configSha256}/config.json`)throw Error('Published mirror identity invalid');
  const folder=path.join(publicRoot,'configuration/releases',identity.configSha256);
  const read=async(name:string,max:number)=>{const file=path.join(folder,name);if((await fs.stat(file)).size>max)throw Error('Published mirror byte budget');return fs.readFile(file);};
  const [raw,manifest,archive,releaseBody]=await Promise.all([read('config.json',64*1024*1024),read('manifest.json',1024*1024),read('package.zip',64*1024*1024),read('release.json',1024*1024)]);
  if(sha(raw)!==identity.configSha256||sha(manifest)!==identity.manifestSha256)throw Error('Published mirror digest mismatch');
  const config=await readRawNativePackage(new File([archive],'published.zip'));
  if(config.packageId!==identity.packageId||config.projectId!==identity.projectId||config.contractRevision!==identity.contractRevision||config.revision!==identity.revision||!validateConfigPackage(config).valid)throw Error('Published mirror package invalid');
  const zip=await JSZip.loadAsync(archive);
  if(!raw.equals(await zip.file('config.json')!.async('nodebuffer'))||!manifest.equals(await zip.file('manifest.json')!.async('nodebuffer')))throw Error('Published mirror archive files disagree');
  const release=JSON.parse(releaseBody.toString('utf8'));
  if(release.schemaVersion!=='cairnmap.configuration-release.v1'||stableConfigText(release.identity)!==stableConfigText(identity)||release.archiveSha256!==sha(archive))throw Error('Published mirror release identity mismatch');
  return {identity,config};
}
