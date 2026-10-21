/** Share reads, not cancellation: the last departing consumer owns abort. */
export function createSharedReadPool<T, P = never>(timeoutMs = 60000) {
  type Entry = { controller: AbortController; promise: Promise<T>; listeners: Map<symbol, ((progress: P) => void) | undefined>; latest?: P };
  const pending = new Map<string, Entry>();
  return (key: string, load: (signal: AbortSignal, emit: (progress: P) => void) => Promise<T>, signal?: AbortSignal, progress?: (value: P) => void): Promise<T> => {
    if (signal?.aborted) return Promise.reject(signal.reason ?? Error('已取消读取。'));
    let entry = pending.get(key);
    if (!entry) {
      const controller = new AbortController();
      const created: Entry = { controller, promise: undefined!, listeners: new Map() };
      const timer = setTimeout(() => controller.abort(Error('数据读取超时，请重试。')), timeoutMs);
      let rejectAbort: (reason: unknown) => void;
      const aborted = new Promise<never>((_, reject) => { rejectAbort = reject; });
      const onAbort = () => rejectAbort(controller.signal.reason ?? Error('已取消读取。'));
      controller.signal.addEventListener('abort', onAbort, { once: true });
      created.promise = Promise.race([Promise.resolve().then(() => load(controller.signal, value => {
        created.latest = value;
        for (const listener of created.listeners.values()) listener?.(value);
      })), aborted]).finally(() => {
        clearTimeout(timer); controller.signal.removeEventListener('abort', onAbort);
        if (pending.get(key) === created) pending.delete(key);
      });
      entry = created; pending.set(key, created);
    }
    const shared = entry, token = Symbol(); shared.listeners.set(token, progress);
    if (shared.latest !== undefined) progress?.(shared.latest);
    return new Promise<T>((resolve, reject) => {
      const leave = () => {
        signal?.removeEventListener('abort', cancel); shared.listeners.delete(token);
        if (!shared.listeners.size && pending.get(key) === shared) { pending.delete(key); shared.controller.abort(Error('已取消读取。')); }
      };
      const cancel = () => { leave(); reject(signal?.reason ?? Error('已取消读取。')); };
      signal?.addEventListener('abort', cancel, { once: true });
      shared.promise.then(value => { leave(); resolve(value); }, error => { leave(); reject(error); });
    });
  };
}
