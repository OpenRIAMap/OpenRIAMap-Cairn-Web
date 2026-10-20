import type { ConfigurationIdentity } from './formalConfiguration';
export type ValidationReceipt = { configSha256: string; contractRevision: number; validatorFingerprint: string; resourceFingerprint: string };
export type FormalCacheRecord = { identity: ConfigurationIdentity; bytes: Uint8Array; receipt: ValidationReceipt; savedAt: string };
const databaseName = 'cairnmap-formal-configuration-v2', storeName = 'verified-snapshots';
async function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);
    let settled=false;const fail=(error:unknown)=>{if(settled)return;settled=true;clearTimeout(timer);reject(error);};
    const timer=setTimeout(()=>fail(Error('正式配置缓存暂时不可读')),500);
    request.onblocked=()=>fail(Error('正式配置缓存被其他页面占用'));
    request.onupgradeneeded = () => { request.result.createObjectStore(storeName); };
    request.onsuccess = () => {if(settled){request.result.close();return;}settled=true;clearTimeout(timer);request.result.onversionchange=()=>request.result.close();resolve(request.result);};
    request.onerror = () => fail(request.error);
  });
}
export async function readFormalCache(): Promise<FormalCacheRecord | undefined> {
  const db = await database();
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction(storeName, 'readonly').objectStore(storeName).get('active');
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
  } finally { db.close(); }
}
export async function writeFormalCache(record: FormalCacheRecord): Promise<void> {
  const db = await database();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      // Raw bytes and receipt only: no indexes, draft, preview or runtime objects.
      transaction.objectStore(storeName).put(record, 'active');
      transaction.oncomplete = () => resolve(); transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error ?? Error('Formal cache write aborted'));
    });
  } finally { db.close(); }
}
