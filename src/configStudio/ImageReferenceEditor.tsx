import { useEffect, useRef, useState, type ComponentType } from 'react';
import type { ImageReference, ImageSourceForm } from './types';
import { imageLibraryFilename } from './imageLibrary';
import { HelpLabel } from './SettingHelp';
import { symbolInput } from './SymbolFormControls';

type PickerProps = { url: string; onConfirm: (url: string) => void; onClose: () => void };
/** Selection intent is explicit; URL shape is never used to choose the mode. */
export function ImageReferenceEditor({ value, contractRevision, onChange }: { value: ImageReference; contractRevision: number; onChange: (value: ImageReference) => void }) {
  const drafts = useRef<Partial<Record<ImageSourceForm, string>>>({});
  const [Picker, setPicker] = useState<ComponentType<PickerProps>>(), [open, setOpen] = useState(false), [loading, setLoading] = useState(false);
  const [loadProblem, setLoadProblem] = useState(''), [resourceProblem, setResourceProblem] = useState('');
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    let alive = true, unsubscribe: (() => void) | undefined;
    setResourceProblem('');
    if (contractRevision >= 17 && value.sourceForm === 'library' && value.url) {
      import('./imageLibraryCatalogue').then(({ subscribeImageLibrary }) => {
        if (alive) unsubscribe = subscribeImageLibrary(catalogue => setResourceProblem(catalogue.some(image => image.url === value.url) ? '' : '图片不存在于当前图片库，原引用已保留；加载失败时使用全局回退。'));
      }).catch(error => { if (alive) setResourceProblem(`无法读取图片库列表：${String(error)}`); });
    }
    return () => { alive = false; unsubscribe?.(); };
  }, [contractRevision, value.sourceForm, value.url]);
  const choose = async () => {
    if (Picker) { setOpen(true); return; }
    setLoading(true); setLoadProblem('');
    try { const module = await import('./ImageLibraryPicker'); if (mounted.current) { setPicker(() => module.default); setOpen(true); } }
    catch (error) { if (mounted.current) setLoadProblem(`无法打开图片库，请重试：${String(error)}`); }
    finally { if (mounted.current) setLoading(false); }
  };
  const sourceForm = contractRevision >= 17 ? value.sourceForm : 'url';
  return <section className="space-y-2" aria-label="图片来源形式设置">
    {contractRevision >= 17 ? <HelpLabel context="ImageReferenceEditor" className="text-xs">来源形式<select aria-label="来源形式" disabled={loading} className={symbolInput} value={sourceForm ?? ''} onChange={event => {
      if (sourceForm === 'url' || sourceForm === 'library') drafts.current[sourceForm] = value.url;
      const next = event.target.value as ImageSourceForm;
      onChange({ ...value, sourceForm: next, url: drafts.current[next] ?? '' });
    }}>
      {sourceForm !== 'url' && sourceForm !== 'library' ? <option value="">请选择来源形式（待核验）</option> : null}
      <option value="url">URL</option><option value="library">图片库</option>
    </select></HelpLabel> : <p className="text-xs text-slate-500">当前契约使用 URL；图片库选择需先迁移至 c17。</p>}
    {sourceForm === 'library' ? <>
      <button type="button" disabled={loading} className="flex w-full items-center gap-2 rounded border border-violet-300 bg-violet-50 px-3 py-2 text-sm text-violet-800 disabled:opacity-40" onClick={choose}>
        {value.url && imageLibraryFilename(value.url) ? <img src={value.url} alt="" className="h-9 w-9 shrink-0 object-contain" onError={() => setResourceProblem('图片加载失败，原引用已保留；使用全局回退。')} /> : null}
        <span className="min-w-0 break-all">{loading ? '正在打开图片库…' : value.url ? `图片选择：${imageLibraryFilename(value.url) ?? value.url}` : '从图片库选择'}</span>
      </button>
      {resourceProblem ? <p role="status" className="text-xs text-amber-800">{resourceProblem}</p> : null}
    </> : sourceForm === 'url' ? <HelpLabel context="ImageReferenceEditor" className="text-xs">图片 URL<input aria-label="图片 URL" className={symbolInput} value={value.url} placeholder="https://… 或同站相对地址" onChange={event => onChange({ ...value, url: event.target.value })} /></HelpLabel> : <p role="alert" className="text-xs text-rose-700">缺少有效的来源形式，请明确选择；不会根据地址推断。</p>}
    {loadProblem ? <p role="alert" className="text-xs text-rose-700">{loadProblem} <button type="button" className="rounded border px-2 py-1" onClick={choose}>重试打开图片库</button></p> : null}
    {open && Picker ? <Picker url={value.url} onClose={() => setOpen(false)} onConfirm={url => { onChange({ ...value, sourceForm: 'library', url }); setOpen(false); }} /> : null}
  </section>;
}
