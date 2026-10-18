import type { RuleDataSourceSnapshot } from './formalDataSourceRuntime';

export type FormalObjectLayout = 'cos-release-v2' | 'github-stable-v1';
export type FormalObjectIntegrity = { sha256?: string; byteLength?: number };
export const FORMAL_OBJECT_ADAPTER_VERSION = 'formal-layout-20261018';
const requests = new Map<AbortController, string | undefined>();
const segment = /^[A-Za-z0-9_][A-Za-z0-9._-]*$/;

export class FormalObjectError extends Error {
  constructor(message: string, readonly code: 'http' | 'integrity' | 'path' | 'aborted' | 'response', readonly status?: number) {
    super(message); this.name = 'FormalObjectError';
  }
}
export function formalObjectLayout(source: RuleDataSourceSnapshot): FormalObjectLayout {
  return source.objectLayout ?? 'cos-release-v2';
}
export function safeFormalObjectKey(key: string): string {
  if (!key || key.split('/').some(part => !segment.test(part) || part === '.' || part === '..') || key.includes('\\')) {
    throw new FormalObjectError('正式对象路径无效。', 'path');
  }
  return key;
}
export function formalObjectPath(source: RuleDataSourceSnapshot, key: string, releaseId?: string): string {
  safeFormalObjectKey(key);
  if (releaseId && !segment.test(releaseId)) throw new FormalObjectError('发布身份无效。', 'path');
  if (key.startsWith('releases/') && (!releaseId || !key.startsWith(`releases/${releaseId}/`))) {
    throw new FormalObjectError('对象不属于当前选定发布。', 'path');
  }
  if (formalObjectLayout(source) === 'cos-release-v2') return key;
  if (/^current\/worlds\/[A-Za-z0-9_][A-Za-z0-9._-]*\.json$/.test(key)) return `Current/${key.slice('current/worlds/'.length)}`;
  const root = `releases/${releaseId}/`;
  for (const [logical, physical] of [['manifests/', 'Release_Metadata/'], ['data-merge/', 'Data_Merge/'], ['media-index-merge/', 'Picture_Index/']]) {
    if (releaseId && key.startsWith(root + logical)) return physical + key.slice((root + logical).length);
  }
  throw new FormalObjectError('该对象不在GitHub稳定镜像的读取范围内。', 'path');
}
export function formalObjectUrl(source: RuleDataSourceSnapshot, key: string, releaseId?: string): string {
  return `${source.rootUrl.replace(/\/+$/, '')}/${formalObjectPath(source, key, releaseId)}`;
}
export async function formalBytesSha256(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', bytes as BufferSource);
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}
export async function fetchFormalObject<T>(source: RuleDataSourceSnapshot, key: string, options: { releaseId?: string; integrity?: FormalObjectIntegrity } = {}): Promise<T> {
  const url = formalObjectUrl(source, key, options.releaseId), controller = new AbortController();
  requests.set(controller, source.worldId);
  try {
    const response = await fetch(url, { cache: 'no-store', signal: controller.signal });
    if (!response.ok) throw new FormalObjectError(`正式数据请求失败（HTTP ${response.status}）。`, 'http', response.status);
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > 64 * 1024 * 1024) throw new FormalObjectError('正式对象超出读取大小限制。', 'integrity');
    const expected = options.integrity;
    if (expected?.byteLength !== undefined && bytes.byteLength !== expected.byteLength) throw new FormalObjectError('正式对象字节长度与清单不符。', 'integrity');
    if (expected?.sha256 && await formalBytesSha256(bytes) !== expected.sha256) throw new FormalObjectError('正式对象SHA256与清单不符。', 'integrity');
    try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)) as T; }
    catch { throw new FormalObjectError('正式数据接口未返回有效JSON。', 'response'); }
  } catch (error) {
    if (controller.signal.aborted) throw new FormalObjectError('已取消过期的数据读取。', 'aborted');
    throw error;
  } finally { requests.delete(controller); }
}
export function abortFormalObjectRequests(worldIds?: readonly string[]): void {
  for (const [controller, worldId] of requests) {
    if (!worldIds || worldId && worldIds.includes(worldId)) { controller.abort(); requests.delete(controller); }
  }
}
