"""Native Edge zoom checks; requires a disposable CDP browser profile."""
import hashlib
import base64
import json
import os
import time
import urllib.request
import websocket
from browser_check import Browser,APP_URL,OUT

b=Browser();b.ws.settimeout(10);port=os.environ.get('CAIRNMAP_CDP_PORT','9245')
target=b.call('Target.createTarget',{'url':'edge://settings/appearance'})['targetId']
time.sleep(.5)
opener=urllib.request.build_opener(urllib.request.ProxyHandler({}))
page=next(p for p in json.loads(opener.open(f'http://127.0.0.1:{port}/json').read()) if p['id']==target)
settings=Browser.__new__(Browser)
settings.ws=websocket.create_connection(page['webSocketDebuggerUrl'],origin=f'http://127.0.0.1:{port}',timeout=30)
settings.seq=0;settings.errors=[];settings.call('Runtime.enable')
def zoom(value):
    error=settings.evaluate(f"new Promise(resolve=>chrome.settingsPrivate.setDefaultZoom({value},()=>resolve(chrome.runtime.lastError?.message??'')))")
    assert not error,error
    time.sleep(.3)
    return settings.evaluate('new Promise(resolve=>chrome.settingsPrivate.getDefaultZoom(resolve))')
def click(text):
    b.evaluate(f"[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==={json.dumps(text)}&&!e.disabled).click()")
    time.sleep(.12)
def choose(label,value):
    b.evaluate(f"(()=>{{const e=[...document.querySelectorAll('select')].find(e=>e.getAttribute('aria-label')==={json.dumps(label)});Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(e,{json.dumps(value)});e.dispatchEvent(new Event('change',{{bubbles:true}}));}})()")
    time.sleep(.12)
results=[]
try:
    zoom(1)
    b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/subject-ui-acceptance.html?mode=general&resources=1'})
    time.sleep(.5);b.wait("document.querySelector('[role=tab]')!==null")
    b.evaluate('window.confirm=()=>true')
    for _ in range(6):
        discarded=b.evaluate("(()=>{const e=[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='放弃草稿'&&!e.disabled&&e.getBoundingClientRect().height);if(!e)return false;e.click();return true})()")
        if not discarded:break
        time.sleep(.15)
    initial=b.evaluate('JSON.stringify(window.applicationAcceptance.snapshot())')
    click('要素设计');choose('编辑分类 Class','ROD');click('读取分类')
    window=b.call('Browser.getWindowForTarget')['windowId']
    b.call('Emulation.clearDeviceMetricsOverride')
    b.call('Browser.setWindowBounds',{'windowId':window,'bounds':{'width':1440,'height':1000}})
    b.call('Page.bringToFront')
    for phase in ['feature','workflow']:
        if phase=='workflow':
            click('放弃草稿');click('工作流设计');choose('已保存工作流','v3-rod_road');click('读取')
        for factor in [1,1.25,1.5,2]:
            actual=zoom(factor);assert abs(actual-factor)<.001
            selector='.cm-field-definition' if phase=='feature' else '.cm-workflow-control'
            b.evaluate(f"document.querySelector({json.dumps(selector)}).scrollIntoView({{block:'start'}})")
            data=b.evaluate("(()=>{const e=document.querySelector('.cm-authoring-pane');return {innerWidth,innerHeight,outerWidth,outerHeight,devicePixelRatio,document:[document.documentElement.clientWidth,document.documentElement.scrollWidth],pane:[e.clientWidth,e.scrollWidth]}})()")
            data.update(phase=phase,nativeZoom=actual);results.append(data)
            assert data['document'][1]<=data['document'][0]+1,data
            assert data['pane'][1]<=data['pane'][0]+1,data
            assert abs(data['devicePixelRatio']-factor)<.01,data
            b.call('Page.bringToFront')
            data=b.call('Page.captureScreenshot',{'format':'png','fromSurface':True})['data']
            (OUT/f'native-zoom-{phase}-{factor}.png').write_bytes(base64.b64decode(data))
    assert b.evaluate('JSON.stringify(window.applicationAcceptance.snapshot())')==initial
    click('放弃草稿')
    assert not b.errors,b.errors
    result={'method':'Edge settingsPrivate.setDefaultZoom; device metrics cleared; native 1440x1000 browser window','measurements':results,'activeConfigSha256':hashlib.sha256(initial.encode()).hexdigest(),'runtimeErrors':b.errors}
    (OUT/'editor-native-zoom-result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(result,ensure_ascii=False))
finally:
    zoom(1)
    b.call('Target.closeTarget',{'targetId':target})
