"""Production build acceptance in the task's isolated CDP browser only.

Uses the exact recorded public Data objects through production_qa_proxy.mjs.
It exercises local export/storage; it never calls online publication.
"""
import json, os, re
from browser_check import Browser, APP_URL, OUT
from app_probe import PROBE

if os.environ.get('CAIRNMAP_QA_ISOLATED') != '1':
    raise RuntimeError('Set CAIRNMAP_QA_ISOLATED=1 for a dedicated test profile.')
b=Browser(); checks=[]
INIT="""window.confirm=()=>true;
const originalFetch=window.fetch;
window.fetch=(input,options)=>{const url=typeof input==='string'?input:input.url;
return originalFetch(url.startsWith('https://openriamap-cairn-data-1433163128.cos.ap-shanghai.myqcloud.com/')?
'http://127.0.0.1:5203/data/'+url.split('.myqcloud.com/')[1]:input,options);};"""
b.call('Page.addScriptToEvaluateOnNewDocument',{'source':INIT})
def record(message):
    checks.append(message);print(message,flush=True)
    (OUT/'promotion-browser-result.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors,'dataTransport':'exact recorded COS objects, localhost read-only proxy','onlinePublicationTested':False},ensure_ascii=False,indent=2),encoding='utf-8')
def go(query=''):
    b.call('Page.navigate',{'url':APP_URL+'/'+query})
def button(text):
    return "[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==="+json.dumps(text)+")"
def main():
    go();b.wait(PROBE+"&&window.appProbe.records.length===489",40)
    assert b.evaluate(PROBE)['packageRevision']==7
    assets=b.evaluate("performance.getEntriesByType('resource').filter(e=>e.name.includes('/assets/')&&/\\.js($|\\?)/.test(e.name)).map(e=>e.name.split('/').at(-1))")
    assert not any(any(name in item for name in ['MeasuringModule','configurationEntry','V3WorkflowRunner','legacy-v1']) for item in assets),assets
    return assets

assets=main();record('Main pins formal r11/r7 and 489 readable records; no authoring/measuring/V1 UI is eagerly requested.')
b.evaluate("localStorage.setItem('promotion-main-storage-probe','keep');sessionStorage.setItem('promotion-main-session-probe','keep')")
# Direct frozen entry must ask before importing the full frozen application.
b.evaluate("(()=>{const state=JSON.parse(localStorage.getItem('ria_feature_modules_v1'));state.modules['legacy-v1']={enabledByUser:false,lastLoadedVersion:null};localStorage.setItem('ria_feature_modules_v1',JSON.stringify(state));})()")
go('legacy-v1/runtime/index.html');b.wait("document.body.innerText.includes('确认加载')")
assert not b.evaluate("!!document.querySelector('.leaflet-container')")
b.click('确认加载');b.wait("!!document.querySelector('.leaflet-pane path')",40)
assert b.evaluate("localStorage.getItem('promotion-main-storage-probe')") is None
assert b.evaluate("sessionStorage.getItem('promotion-main-session-probe')") is None
b.screenshot('legacy-v1-final.png')
b.evaluate("localStorage.clear();sessionStorage.clear();true")
main()
assert b.evaluate("localStorage.getItem('promotion-main-storage-probe')")=='keep'
assert b.evaluate("sessionStorage.getItem('promotion-main-session-probe')")=='keep'
record('Direct V1 entry asks for admission; frozen page has isolated JS/CSS and Storage.clear cannot clear main state.')
go('legacy-v1/');b.wait("document.body.innerText.includes('下载并启用')")
b.click('取消');b.wait("location.pathname==='/'",20)
record('Cancelling the V1 feature gate returns to the formal main page.')

go('?workspace=config-studio');b.wait("!!document.querySelector('nav[aria-label=\"设计工作区\"]')",30)
b.click('恢复应用默认配置');b.wait("document.querySelector('header')?.innerText.includes('配置 r7')",30)
assert b.evaluate(button('整包下载/上传')+'.disabled')
b.evaluate("(()=>{const s=document.querySelector('select[aria-label=\"编辑分类 Class\"]');s.value='BUD';s.dispatchEvent(new Event('change',{bubbles:true}));})()")
b.wait("!!"+button('读取分类'));b.click('读取分类')
assert b.evaluate(button('全局核验')+'.disabled')
assert b.evaluate(button('整包下载/上传')+'.disabled')
b.click('核验');assert b.evaluate(button('整包下载/上传')+'.disabled')
b.click('放弃草稿');record('Unsaved category/module drafts block global export; module validation does not unlock it.')
b.click('全局核验');b.wait('!'+button('整包下载/上传')+'.disabled',30)
b.click('整包下载/上传');b.wait("!!document.querySelector('[role=dialog]')")
assert b.evaluate("document.querySelectorAll('[role=dialog] input[type=number]').length")==0
b.screenshot('studio-global-export-gate.png')
b.call('Browser.setDownloadBehavior',{'behavior':'allow','downloadPath':str(OUT/'downloads')})
b.click('下载配置整包');b.wait("!document.querySelector('[role=dialog]')",30)
revision=int(re.search(r'配置 r(\d+)',b.evaluate("document.querySelector('header').innerText")).group(1))
assert revision>7 and b.evaluate(button('整包下载/上传')+'.disabled')
record('Global verification unlocks export; export allocates revision r'+str(revision)+' automatically and invalidates the gate after saving.')
b.click('全局核验');b.wait('!'+button('整包下载/上传')+'.disabled',30)
b.call('Emulation.setDeviceMetricsOverride',{'width':390,'height':844,'deviceScaleFactor':1,'mobile':False})
b.click('整包下载/上传');b.wait("!!document.querySelector('[role=dialog]')")
assert b.evaluate("document.documentElement.scrollWidth<=window.innerWidth")
b.screenshot('studio-export-mobile-390.png')
b.call('Input.dispatchKeyEvent',{'type':'keyDown','key':'Escape','code':'Escape','windowsVirtualKeyCode':27})
b.call('Input.dispatchKeyEvent',{'type':'keyUp','key':'Escape','code':'Escape','windowsVirtualKeyCode':27})
b.wait("!document.querySelector('[role=dialog]')")
record('The 390px export dialog fits the viewport and closes with Escape without losing the saved configuration.')
b.call('Emulation.setDeviceMetricsOverride',{'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False})
main();b.screenshot('formal-main-final.png')
assert not b.errors,b.errors
record('A local exported revision still does not replace the formal main r7; no application Runtime exceptions occurred.')
