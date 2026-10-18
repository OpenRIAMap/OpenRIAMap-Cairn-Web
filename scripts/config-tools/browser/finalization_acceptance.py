"""Production-build UI checks in a dedicated, empty CDP profile; no cloud writes."""
import json, os, time
from pathlib import Path
from browser_check import Browser, APP_URL, OUT
from app_probe import PROBE

if os.environ.get('CAIRNMAP_QA_ISOLATED') != '1':
    raise RuntimeError('Use the isolated finalization profile only.')
evidence=Path(os.environ['CAIRNMAP_FINALIZATION_LIVE'])
live=json.loads((evidence/'live-reader-result.json').read_text(encoding='utf-8'))
expected=live['reports'][0]['featureCount']
roots={item['rootUrl']:item['id'] for item in live['reports']}
b=Browser();checks=[]
init="""(()=>{const roots=ROOTS;const original=window.fetch;window.finalizationRequests=[];
window.fetch=(input,options)=>{const url=typeof input==='string'?input:(input instanceof URL?input.href:input.url);const root=Object.keys(roots).find(root=>url.startsWith(root+'/'));if(root){window.finalizationRequests.push(url);return original('http://127.0.0.1:5211/'+roots[root]+'/'+url.slice(root.length+1),options);}return original(input,options);};
window.confirm=()=>true;for(const key of Object.keys(localStorage))if(key.startsWith('openriamap_formal_data_source_v1')||key.startsWith('cairnmap_source_link_mode_v1'))localStorage.removeItem(key);localStorage.setItem('finalization-user-draft','preserve');
if(!sessionStorage.getItem('finalization-cache-seeded')){const scope={sourceId:'formal-github',transportId:'legacy-v16-layout',releaseId:'legacy-v16',worldId:'zth',readerSchemaVersion:'openriamap.formal-release-reader.v2'};localStorage.setItem('ria-rule-meta-v3:legacy-layout-test',JSON.stringify({...scope,cachedAt:Date.now()+999999,schemaVersion:'3.0.0'}));localStorage.setItem('ria-rule-cache-v3:legacy-layout-test',JSON.stringify({...scope,mergeVersion:'legacy-v16',formalVersion:16,loadedAt:1,features:[{ID:'old'}]}));sessionStorage.setItem('finalization-cache-seeded','1');}
})();""".replace('ROOTS',json.dumps(roots))
b.call('Page.addScriptToEvaluateOnNewDocument',{'source':init})
b.call('Browser.setDownloadBehavior',{'behavior':'allow','downloadPath':str(OUT/'downloads')})
def record(text):
    checks.append(text);print(text,flush=True)
    (OUT/'browser-result.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors,'expectedFeatures':expected,'initialBuildAssets':assets,'transport':'exact captured public bytes through local GET-only proxy','onlineLoginOrPublicationTested':False},ensure_ascii=False,indent=2),encoding='utf-8')
def body():return b.evaluate('document.body.innerText')
def count_ready():b.wait(PROBE+'&&window.appProbe.records.length==='+str(expected),50)
def settings():
    if b.evaluate('innerWidth<640'):
        b.click('工具栏')
    b.evaluate("(()=>{const el=[...document.querySelectorAll('button')].find(el=>el.getBoundingClientRect().height>0&&((el.getAttribute('aria-label')||'')==='设置'||(el.getAttribute('title')||'')==='设置'||el.textContent.trim()==='设置'));if(!el)throw Error('Settings button unavailable');el.click();})()")
    b.wait("document.body.innerText.includes('实际运行来源')")
def select(value):
    b.evaluate("(()=>{const el=[...document.querySelectorAll('select')].find(el=>[...el.options].some(o=>o.value==="+json.dumps(value)+"));if(!el)throw Error('source select unavailable');el.value="+json.dumps(value)+";el.dispatchEvent(new Event('change',{bubbles:true}));})()")
def apply_nearest(value):
    b.evaluate("(()=>{const el=[...document.querySelectorAll('select')].find(el=>[...el.options].some(o=>o.value==="+json.dumps(value)+"));const button=el.parentElement.querySelector('button');if(!button||button.disabled)throw Error('Apply not ready');button.click();})()")

b.call('Page.navigate',{'url':APP_URL+'/'})
count_ready();assert b.evaluate(PROBE)['packageRevision']==7
assets=b.evaluate("performance.getEntriesByType('resource').filter(e=>e.name.includes('/assets/')&&/\\.js($|\\?)/.test(e.name)).map(e=>e.name)")
assert not any('configurationEntry-' in asset or 'MeasuringModule-' in asset or 'V3WorkflowRunner-' in asset for asset in assets)
record('Production main loads frozen r11/r7 and '+str(expected)+' records, preserving lazy authoring/measuring packages.')
settings();b.wait("document.body.innerText.includes('尚未发布')&&document.body.innerText.includes('本地预览未接入审核服务')",40)
assert 'invalid session' not in body();assert '远端读取失败' not in body()
assert body().count('尚未发布')>=4
assert '正式配置身份' in body() and 'COS发布目录' in body()
b.screenshot('settings-cos-1440.png')
record('Settings distinguish unpublished worlds, show formal/source identity, and explain the missing local authentication API in Chinese.')
select('formal-github');apply_nearest('formal-github');count_ready()
b.wait("document.body.textContent.includes('GitHub稳定镜像')&&document.body.textContent.includes('Current/_release-set.json')",30)
assert not any('/current/worlds/' in url for url in b.evaluate('window.finalizationRequests') if 'Cairn-Data/main/' in url)
b.click('比较权威来源与镜像');b.wait("document.body.innerText.includes('发布身份一致。')",30)
b.evaluate("[...document.querySelectorAll('p')].find(el=>el.textContent==='实际运行来源').scrollIntoView({block:'center'})")
b.screenshot('settings-github-cdn-1440.png')
record('Explicit GitHub/CDN selection reads Current and stable metadata/data paths, loads v20 over the old v16 cache, and compares equal authority identity.')
select('github_raw');apply_nearest('github_raw');count_ready()
b.wait("(()=>{const s=[...document.querySelectorAll('select')].find(el=>[...el.options].some(o=>o.value==='github_raw'));return s?.value==='github_raw'&&!s.disabled;})()",30)
assert any('raw.githubusercontent.com' in url and '/Current/' in url for url in b.evaluate('window.finalizationRequests'))
b.call('Emulation.setDeviceMetricsOverride',{'width':390,'height':844,'deviceScaleFactor':1,'mobile':False})
time.sleep(.3)
if '实际运行来源' not in body():settings()
b.wait("!![...document.querySelectorAll('p')].find(el=>el.textContent==='实际运行来源')")
b.evaluate("[...document.querySelectorAll('p')].find(el=>el.textContent==='实际运行来源')?.scrollIntoView({block:'center'})")
layout=b.evaluate("(()=>{const title=[...document.querySelectorAll('h2')].find(el=>el.textContent==='设置'),card=title.parentElement.parentElement,r=card.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width,scroll:card.scrollWidth,client:card.clientWidth,viewport:innerWidth};})()")
assert layout['width']<=390 and layout['left']>=-1 and layout['right']<=391 and layout['scroll']<=layout['client']+1,layout
b.screenshot('settings-github-raw-390.png')
record('Official Raw selection works; long source identities and addresses fit the 390px settings panel.')
b.call('Emulation.setDeviceMetricsOverride',{'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False})
time.sleep(.3)
if '实际运行来源' not in body():settings()
b.click('导出 Data Schema');b.wait("document.body.innerText.includes('已从当前正式V3配置导出兼容Schema')")
for _ in range(60):
    files=list((OUT/'downloads').glob('data_tool_schema*.json'))
    if files:break
    time.sleep(.1)
assert files
schema=json.loads(files[-1].read_text(encoding='utf-8'));assert schema['schemaVersion']=='1.1.0' and 'RLE' in schema['featureClasses']
assert b.evaluate("localStorage.getItem('finalization-user-draft')")=='preserve'
record('Data Tool Schema exports from the actual formal V3 configuration and user draft storage survives source and transport changes.')
assert not b.errors,b.errors
b.screenshot('settings-final-1440.png')
record('No browser Runtime exceptions occurred; cloud login, publication and SCF deployment remain unexecuted.')
