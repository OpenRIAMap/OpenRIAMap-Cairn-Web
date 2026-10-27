// Local-only harness: actual production editor, preview and package codecs.
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RenderRuleEditor } from '../../src/configStudio/ConfigStudio';
import { RuntimePreviewProvider, ConnectedConfigRuntimePreview, PreviewNameSelector } from '../../src/configStudio/RuntimePreviewContext';
import { validateConfigPackage } from '../../src/configStudio/runtime';
import { buildConfigPackageArchive, readConfigPackage, downloadConfigPackage } from '../../src/configStudio/package';
import { applyApplicationSettings } from '../../src/core/project/applicationRuntime';
import { imageLibraryFixture } from './fixtures/image-library-config';
import type { ConfigPackageV3 } from '../../src/configStudio/types';
import '../../src/styles/index.css';

const source = await fetch('/configuration/releases/d11e0537c8756dcb7d58326675171a06aa47d71dfe7a4213acde9eb550f3b778/config.json').then(response => response.json());
const initial = imageLibraryFixture(source);
const initialImage=initial.nodes.find(node=>node.nodeId==='image-library-test')!.geometryProfiles.Point!.zoomPriority.rules[0].style!.pointSymbol;
if(initialImage?.kind==='externalImage'&&initialImage.image.mode==='fixed'){
  if(location.search.includes('legacy=1')){initial.contractRevision=16;delete initialImage.image.sourceForm;}
  if(location.search.includes('missing=1'))initialImage.image.url='/image-library/not-deployed.png';
}
applyApplicationSettings(initial.application);
function Harness() {
  const [config, setConfig] = useState(initial), [epoch, setEpoch] = useState(0), [notice, setNotice] = useState('');
  const node = config.nodes.find(node => node.nodeId === 'image-library-test')!;
  const report = validateConfigPackage(config);
  Object.assign(window, { imageLibraryAcceptance: { config, report } });
  return <div className="config-editor cm-editor-design min-h-screen bg-slate-100 p-4">
    <div className="mb-3 flex flex-wrap gap-2"><button className="rounded border bg-white p-2" onClick={() => { setConfig(JSON.parse(JSON.stringify(config))); setEpoch(value => value + 1); }}>验收：重开当前配置</button><button className="rounded border bg-white p-2" onClick={async () => {
      const blob = await buildConfigPackageArchive(config, report); downloadConfigPackage(blob, config); setNotice('已通过正式配置归档入口导出');
    }}>验收：导出配置</button><label className="rounded border bg-white p-2">验收：重新导入<input aria-label="验收：重新导入" type="file" accept=".zip" onChange={async event => { const file=event.target.files?.[0];if(file){const next=await readConfigPackage(file);setConfig(next);setEpoch(value=>value+1);setNotice('已通过正式配置读取入口导入');} }} /></label></div>
    <p role="status" className="mb-2 text-sm">契约 c{config.contractRevision} · {report.valid ? '核验通过' : '存在核验问题'} · {notice}</p>
    <RuntimePreviewProvider key={epoch} config={config} node={node} scenario="singlePoint" onShow={() => undefined}>
      <div style={{display:'grid',gridTemplateColumns:innerWidth>1024?'420px minmax(0,1fr)':'minmax(0,1fr)',gap:16,alignItems:'start'}}><section className="sticky top-3 h-[600px] min-w-0 rounded-xl border bg-white p-3" aria-label="图片实际预览"><h2>显示规则验证器</h2><PreviewNameSelector /><div className="h-[480px]"><ConnectedConfigRuntimePreview config={config} node={node} scenario="singlePoint" /></div></section>
        <main className="min-w-0"><RenderRuleEditor config={config} path={node.path} geometry="Point" profile={node.geometryProfiles.Point!} onChange={profile => setConfig({ ...config, nodes: config.nodes.map(item => item.nodeId === node.nodeId ? { ...item, geometryProfiles: { ...item.geometryProfiles, Point: profile } } : item) })} /></main>
      </div>
    </RuntimePreviewProvider>
  </div>;
}
createRoot(document.getElementById('image-library-acceptance')!).render(<Harness />);
