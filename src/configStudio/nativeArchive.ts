import JSZip from 'jszip';
import {CONFIG_IMPORT_LIMITS,importProgress,inspectConfigZip,parseConfigJson,safeArchivePath,type ConfigImportOptions} from './archivePolicy';
const isRecord=(value:unknown):value is Record<string,any>=>!!value&&typeof value==='object'&&!Array.isArray(value);
async function sha256(value:Uint8Array):Promise<string>{return [...new Uint8Array(await crypto.subtle.digest('SHA-256',value as BufferSource))].map(byte=>byte.toString(16).padStart(2,'0')).join('');}
export async function readRawNativePackage(file: File, options:ConfigImportOptions={}): Promise<unknown> {
  importProgress(options,'读取配置文件');
  if(file.size>CONFIG_IMPORT_LIMITS.compressedBytes)throw Error(`配置文件 ${file.size} 字节，超过导入预算 ${CONFIG_IMPORT_LIMITS.compressedBytes} 字节。请离线检查或调整集中导入策略。`);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b;
  if (!isZip) {importProgress(options,'检查 JSON 结构与版本');return parseConfigJson(new TextDecoder().decode(bytes));}
  const entries=inspectConfigZip(bytes);
  importProgress(options,'检查归档目录');
  const zip = await JSZip.loadAsync(bytes);
  const manifestRaw = await zip.file('manifest.json')?.async('string');
  if (!manifestRaw || !zip.file('config.json')) throw new Error('配置包缺少 manifest.json 或 config.json。');
  const manifest = parseConfigJson(manifestRaw);
  if(!isRecord(manifest)||manifest.schemaVersion!=='cairnmap.config-package-manifest.v3')throw Error('不支持此配置 manifest 版本；请使用兼容版本升级后重新导出。');
  const manifestKeys=new Set(['schemaVersion','contractRevision','packageId','projectId','revision','createdAt','sourceManifestSha256','files']);
  if(Object.keys(manifest).some(key=>!manifestKeys.has(key)))throw Error('manifest 包含当前 schema 未定义的属性。');
  if(!Array.isArray(manifest.files)||!manifest.files.length||manifest.files.length>CONFIG_IMPORT_LIMITS.entries||typeof manifest.packageId!=='string'||typeof manifest.projectId!=='string'||!Number.isSafeInteger(manifest.revision)||!Number.isSafeInteger(manifest.contractRevision)||typeof manifest.createdAt!=='string'||!Number.isFinite(Date.parse(manifest.createdAt)))throw Error('配置 manifest 结构或身份无效。');
  const declared=new Set<string>(),bodies=new Map<string,Uint8Array>();
  for(const item of manifest.files){
    if(!isRecord(item)||Object.keys(item).some(key=>!['path','sha256','byteLength'].includes(key))||typeof item.path!=='string'||!safeArchivePath(item.path)||item.path.endsWith('/')||item.path==='manifest.json'||declared.has(item.path)||typeof item.sha256!=='string'||!/^[0-9a-f]{64}$/i.test(item.sha256)||!Number.isSafeInteger(item.byteLength)||Number(item.byteLength)<0)throw Error('manifest 文件声明存在无效属性、路径、重复或摘要格式错误。');
    declared.add(item.path);importProgress(options,`核对文件完整性：${item.path}`);
    const entry=zip.file(item.path);if(!entry)throw Error(`配置包缺少声明文件 ${item.path}。`);
    const body=await entry.async('uint8array');
    if(body.byteLength!==item.byteLength||body.byteLength!==entries.get(item.path)||await sha256(body)!==item.sha256.toLowerCase())throw Error(`配置包 ${item.path} 哈希校验失败或 byteLength 不一致。`);
    bodies.set(item.path,body);
  }
  for(const required of ['config.json','reports/validation-report.json','reports/v1-parity-report.json'])if(!declared.has(required))throw Error(`manifest 缺少必需文件 ${required}。`);
  for(const name of entries.keys())if(name!=='manifest.json'&&!name.endsWith('/')&&!declared.has(name))throw Error(`配置包包含未声明附加文件 ${name}；请重新导出，不能将其隐式应用。`);
  const raw=parseConfigJson(new TextDecoder('utf-8',{fatal:true}).decode(bodies.get('config.json')));
  if(!isRecord(raw)||['packageId','projectId','revision','contractRevision','sourceManifestSha256'].some(key=>manifest[key]!==raw[key]))throw Error('manifest 与 config 的包身份、revision 或契约不一致。');
  importProgress(options,'迁移与检查配置结构');
  return raw;
}
