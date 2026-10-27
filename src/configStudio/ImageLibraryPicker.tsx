import { useEffect, useMemo, useState } from 'react';
import { libraryImages, subscribeImageLibrary } from './imageLibraryCatalogue';
import { ConfigDialog } from './ConfigDialog';
import { HelpLabel } from './SettingHelp';
import { imageLibraryFilename, type LibraryImage } from './imageLibrary';

const checkerboard = { backgroundImage: 'conic-gradient(#e2e8f0 25%,white 0 50%,#e2e8f0 0 75%,white 0)', backgroundSize: '16px 16px' };
const button = 'rounded border bg-white px-3 py-1 text-sm';
export default function ImageLibraryPicker({ url, onConfirm, onClose }: { url: string; onConfirm: (url: string) => void; onClose: () => void }) {
  const [catalogue, setCatalogue] = useState<LibraryImage[]>(libraryImages), [query, setQuery] = useState(''), [limit, setLimit] = useState(60);
  const [selected, setSelected] = useState(url), [decoded, setDecoded] = useState<{ url: string; width: number; height: number }>();
  const [problem, setProblem] = useState(''), [attempt, setAttempt] = useState(0);
  useEffect(() => subscribeImageLibrary(setCatalogue), []);
  const matches = useMemo(() => {
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return catalogue.filter(image => tokens.every(token => image.name.toLowerCase().includes(token)));
  }, [catalogue, query]);
  const chosen = catalogue.find(image => image.url === selected);
  useEffect(() => {
    setDecoded(undefined); setProblem('');
    if (!chosen) return;
    let alive = true;
    const image = new Image();
    const timer = window.setTimeout(() => { if (alive) setProblem('图片加载超时，请重试或选择其他图片。'); alive = false; }, 12000);
    image.onload = async () => {
      try {
        await image.decode();
        if (!image.naturalWidth || !image.naturalHeight) throw Error('图片尺寸无效');
        if (alive) { setDecoded({ url: chosen.url, width: image.naturalWidth, height: image.naturalHeight }); setProblem(''); }
      } catch { if (alive) setProblem('图片无法解码，请重试或选择其他图片。'); }
      finally { window.clearTimeout(timer); }
    };
    image.onerror = () => { window.clearTimeout(timer); if (alive) setProblem('图片加载失败，请重试或选择其他图片。'); };
    image.src = chosen.url;
    return () => { alive = false; window.clearTimeout(timer); image.onload = null; image.onerror = null; };
  }, [chosen?.url, attempt]);
  return <ConfigDialog open title="图片库" onClose={onClose}>
    <HelpLabel context="ImageLibraryPicker" className="grid gap-1 text-sm">搜索文件名<input autoFocus aria-label="搜索图片文件名" type="search" className="rounded border px-2 py-1" placeholder="输入文件名，可用空格分隔关键词" value={query} onChange={event => { setQuery(event.target.value); setLimit(60); }} /></HelpLabel>
    <p className="text-xs text-slate-600">共 {catalogue.length} 张图片，找到 {matches.length} 张。选择图片后，尺寸、锚点和 Halo 继续在外部设置。</p>
    <div className="grid max-h-[40vh] grid-cols-3 gap-2 overflow-auto sm:grid-cols-4" aria-label="图片文件列表">
      {matches.slice(0, limit).map(image => <button type="button" key={image.url} aria-label={`选择图片 ${image.name}`} aria-pressed={selected === image.url} className={`min-w-0 rounded border p-2 text-xs ${selected === image.url ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-500' : 'bg-white'}`} onClick={() => setSelected(image.url)}>
        <span className="flex h-20 items-center justify-center rounded" style={checkerboard}><img loading="lazy" src={image.url} alt="" className="max-h-16 max-w-full object-contain" /></span><span className="mt-1 block break-all">{image.name}</span>
      </button>)}
    </div>
    {!matches.length ? <p role="status" className="text-sm text-slate-600">没有符合条件的图片。</p> : null}
    {matches.length > limit ? <button type="button" className={button} onClick={() => setLimit(value => value + 60)}>显示更多图片</button> : null}
    {selected && !chosen ? <p role="alert" className="text-sm text-amber-800">图片不存在于当前图片库：{imageLibraryFilename(selected) ?? selected}。原引用会保留，取消不会替换图片。</p> : null}
    {chosen ? <div className="flex items-center gap-3 rounded border bg-slate-50 p-2"><span className="flex h-20 w-24 shrink-0 items-center justify-center rounded" style={checkerboard}><img src={chosen.url} alt="所选图片" className="max-h-20 max-w-full object-contain" /></span><p className="min-w-0 break-all text-sm">{chosen.name}<br />{decoded?.url === selected ? `${decoded.width} × ${decoded.height} px（原始尺寸）` : '正在读取图片…'}</p></div> : null}
    {problem ? <p role="alert" className="text-sm text-rose-700">{problem} <button type="button" className={button} onClick={() => setAttempt(value => value + 1)}>重试图片</button></p> : null}
    <div className="flex justify-end gap-2"><button type="button" className={button} onClick={onClose}>取消</button><button type="button" className="rounded bg-violet-600 px-3 py-1 text-sm text-white disabled:opacity-40" disabled={!chosen || decoded?.url !== selected || Boolean(problem)} onClick={() => onConfirm(selected)}>确认选择</button></div>
  </ConfigDialog>;
}
