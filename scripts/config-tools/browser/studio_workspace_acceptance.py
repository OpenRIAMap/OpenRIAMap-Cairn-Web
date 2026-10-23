"""Real local UI + IndexedDB acceptance. Use an explicitly disposable profile."""
import json, os, time, base64
from pathlib import Path
from browser_check import Browser, APP_URL, OUT

assert APP_URL.startswith('http://127.0.0.1:')
assert os.environ.get('CAIRNMAP_CDP_PORT') in ('9502','9514','9524')
class AcceptanceBrowser(Browser):
    def __init__(self):
        self.dialogs=[]
        super().__init__()
    def call(self,method,params=None):
        self.seq+=1;ident=self.seq
        self.ws.send(json.dumps({'id':ident,'method':method,'params':params or {}}))
        while True:
            result=json.loads(self.ws.recv())
            if result.get('method')=='Runtime.exceptionThrown':self.errors.append(result['params'])
            if result.get('method')=='Page.javascriptDialogOpening':
                self.dialogs.append(result['params']['type']);self.seq+=1
                self.ws.send(json.dumps({'id':self.seq,'method':'Page.handleJavaScriptDialog','params':{'accept':True}}))
            if result.get('id')!=ident:continue
            if 'error'in result:raise RuntimeError(result['error'])
            return result.get('result',{})
b=AcceptanceBrowser();checks=[]
downloads=OUT.parent/'downloads';downloads.mkdir(parents=True,exist_ok=True)
nav_count=0
def blank():
    b.call('Page.navigate',{'url':'about:blank'});b.wait("location.href==='about:blank'&&document.readyState==='complete'")
def nav():
    global nav_count
    nav_count+=1
    url=APP_URL+'/?workspace=config-studio&tab=features&acceptanceLoad='+str(nav_count)
    b.call('Page.navigate',{'url':url});b.wait('location.href==='+json.dumps(url)+'&&document.readyState==="complete"',40)
    b.wait("Boolean(document.querySelector('nav[aria-label=\"设计工作区\"]')) || Boolean(document.querySelector('[aria-label=\"检测到本机编辑缓存\"]')) || Array.from(document.querySelectorAll('button')).some(x=>x.textContent==='下载并启用')",40)
    if b.evaluate("Array.from(document.querySelectorAll('button')).some(x=>x.textContent==='下载并启用')"):
        b.click('下载并启用');b.wait("Boolean(document.querySelector('nav[aria-label=\"设计工作区\"]')) || Boolean(document.querySelector('[aria-label=\"检测到本机编辑缓存\"]'))",40)
def editor():b.wait("Boolean(document.querySelector('nav[aria-label=\"设计工作区\"]'))",40)
def disabled(text):return b.evaluate('Array.from(document.querySelectorAll("main header button")).find(x=>x.textContent.trim()==='+json.dumps(text)+')?.disabled')
def snapshot():return b.evaluate("(async()=>{const s=await import('/src/configStudio/workspaceStorage.ts');return s.initializeWorkspaceStorage()})()")
def state():return b.evaluate("(async()=>{const s=await import('/src/configStudio/workspaceController.ts');return {...s.getWorkspaceState(),session:s.getStudioSessionSnapshot(),config:s.getActiveConfigSnapshot()}})()")
def fill(selector,value):
    b.evaluate("(()=>{const e="+selector+";if(!e)throw Error('Input missing');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,"+json.dumps(str(value))+");e.dispatchEvent(new Event('input',{bubbles:true}));})()")
def upload(path):
    root=b.call('DOM.getDocument')['root']['nodeId'];node=b.call('DOM.querySelector',{'nodeId':root,'selector':'main header input[type=file]'})['nodeId'];b.call('DOM.setFileInputFiles',{'nodeId':node,'files':[str(path.resolve())]})
def click_inside(selector,text):
    b.evaluate("Array.from(document.querySelector("+json.dumps(selector)+").querySelectorAll('button')).find(x=>x.textContent.trim()==="+json.dumps(text)+").click()")
def wait_zip(previous):
    until=time.time()+30
    while time.time()<until:
        import zipfile
        files=[p for p in downloads.glob('*.zip') if (p.name not in previous or p.stat().st_mtime_ns!=previous[p.name]) and zipfile.is_zipfile(p)]
        if files:return files[-1]
        time.sleep(.1)
    raise RuntimeError('No downloaded ZIP')
try:
    b.call('Network.enable');b.call('Network.setBlockedURLs',{'urls':['https://*',APP_URL+'/api/*','http://analysis.602007.xyz/*']})
    b.call('Browser.setDownloadBehavior',{'behavior':'allow','downloadPath':str(downloads.resolve())})
    blank();b.call('Storage.clearDataForOrigin',{'origin':APP_URL,'storageTypes':'all'})
    nav();editor();time.sleep(.7)
    assert not snapshot().get('checkpoint'),'pure default must not create a recovery cache'
    assert disabled('临时保存和下载') and disabled('整包下载/上传')
    assert not b.evaluate("document.body.innerText.includes('已保留旧配置恢复副本')")
    checks.append('fresh current formal document; no legacy backup panel, meaningless cache or prevalidated outputs')

    b.click('引擎参数');original=state()['config']['engine']['contextView']['activationRadiusPx']
    fill("Array.from(document.querySelectorAll('label')).find(x=>x.textContent.includes('激活半径 px')).querySelector('input')",original+3)
    b.wait("Array.from(document.querySelectorAll('button')).find(x=>x.textContent==='保存引擎')?.disabled===false")
    assert disabled('全局核验') and disabled('临时保存和下载')
    b.click('关闭');b.wait("Boolean(document.querySelector('[aria-label=\"退出配置编辑\"]'))")
    b.click('确认，缓存并退出');b.wait("!location.search.includes('workspace=')",40)
    stored=snapshot();assert stored['checkpoint']['session']['engineDraft']['value']['contextView']['activationRadiusPx']==original+3
    token=stored['token'];nav();assert b.evaluate("Boolean(document.querySelector('[aria-label=\"检测到本机编辑缓存\"]'))")
    assert not b.evaluate("Boolean(document.querySelector('nav[aria-label=\"设计工作区\"]'))")
    blank();nav();assert snapshot()['token']==token,'closing before choosing must not touch checkpoint'
    b.click('继续编辑');editor();assert state()['session']['engineDraft']['value']['contextView']['activationRadiusPx']==original+3
    assert b.evaluate("Array.from(document.querySelectorAll('label')).find(x=>x.textContent.includes('激活半径 px')).querySelector('input').value")==str(original+3)
    b.click('关闭');b.click('取消缓存，清除并退出');b.wait("!location.search.includes('workspace=')",40)
    time.sleep(.8);assert not snapshot().get('checkpoint');nav();editor();assert state()['config']['engine']['contextView']['activationRadiusPx']==original
    checks.append('unfinished engine edit: cache-and-exit, no silent activation, unchosen close, exact restore and discard without resurrection')

    config=state()['config'];config['application']['preferences']['search']['homepageLimit']=0
    invalid=OUT/'invalid-editable-config.json';invalid.write_text(json.dumps(config,ensure_ascii=False),encoding='utf-8');upload(invalid)
    b.wait("Boolean(document.querySelector('[aria-label=\"整包草稿操作\"]'))")
    assert disabled('临时保存和下载')
    b.click('全局核验');b.wait("Array.from(document.querySelectorAll('main header button')).find(x=>x.textContent==='临时保存和下载').disabled===false",30)
    assert disabled('整包下载/上传');before={p.name:p.stat().st_mtime_ns for p in downloads.glob('*.zip')}
    b.click('临时保存和下载');b.click('确认临时保存并下载');temporary=wait_zip(before)
    b.wait("!document.querySelector('[aria-label=\"临时保存和下载\"]')")
    b.click('放弃整包草稿');upload(temporary);b.wait("document.body.innerText.includes('上次导出核验报告')")
    assert disabled('临时保存和下载') and disabled('整包下载/上传'),'imported report cannot grant current output permission'
    b.click('总体规则');click_inside('[data-application-section=preferences]','读取/编辑')
    b.wait("Boolean(document.querySelector('label[data-setting-help*=homepageLimit] input'))")
    fill("document.querySelector('label[data-setting-help*=homepageLimit] input')",8)
    assert disabled('全局核验')
    click_inside('[data-application-section=preferences]','核验');click_inside('[data-application-section=preferences]','保存')
    b.wait("Array.from(document.querySelectorAll('main header button')).find(x=>x.textContent==='全局核验').disabled===false")
    b.click('全局核验');b.wait("Array.from(document.querySelectorAll('button')).find(x=>x.textContent==='保存整包草稿').disabled===false",30)
    b.click('保存整包草稿');b.wait("!document.querySelector('[aria-label=\"整包草稿操作\"]')",30)
    if disabled('整包下载/上传'):b.click('全局核验')
    b.wait("Array.from(document.querySelectorAll('main header button')).find(x=>x.textContent==='整包下载/上传').disabled===false",30)
    before={p.name:p.stat().st_mtime_ns for p in downloads.glob('*.zip')};b.click('整包下载/上传');b.click('下载配置整包');formal=wait_zip(before)
    import zipfile
    with zipfile.ZipFile(temporary)as z:
        assert 'reports/temporary-validation.json'in z.namelist();assert not json.loads(z.read('reports/temporary-validation.json'))['report']['valid']
    with zipfile.ZipFile(formal)as z:assert 'reports/temporary-validation.json'not in z.namelist()
    checks.append('real failed global validation → temporary download → import historical report → repair/stage → formal download without temporary report')

    b.click('要素设计');b.click('新增分类')
    fill("document.querySelector('input[aria-label=\"新分类代码\"]')",'TESTLOCAL')
    fill("document.querySelector('input[aria-label=\"新分类名称 zh\"]')",'未完成分类')
    b.evaluate("(async()=>{await(await import('/src/configStudio/workspaceController.ts')).flushWorkspace()})()")
    blank();nav();b.click('继续编辑');editor()
    assert b.evaluate("document.querySelector('input[aria-label=\"新分类代码\"]').value")=='TESTLOCAL'
    b.click('取消新增分类');b.click('工作流设计');b.click('新建')
    fill("document.querySelector('input[aria-label=\"新工作流 ID\"]')",'unfinished-workflow')
    b.evaluate("(async()=>{await(await import('/src/configStudio/workspaceController.ts')).flushWorkspace()})()")
    blank();nav();b.click('继续编辑');editor()
    assert b.evaluate("document.querySelector('input[aria-label=\"新工作流 ID\"]').value")=='unfinished-workflow'
    b.screenshot('workspace-restored-workflow.png')
    checks.append('new-category and new-workflow forms restore unsaved input; native leave confirmation is handled without interpreting cancel as clear')

    # Clear the disposable origin and seed its old v2 database, including
    # recovery history and an unrelated localStorage sentinel.
    blank();b.call('Storage.clearDataForOrigin',{'origin':APP_URL,'storageTypes':'all'})
    b.call('Page.navigate',{'url':APP_URL+'/scripts/browser/fixtures/studio-formal-default.html'});b.wait("document.title==='Studio storage acceptance'")
    legacy=json.dumps(config,ensure_ascii=False)
    b.evaluate("(async()=>{localStorage.setItem('unrelated-drawing-sentinel','keep');const c="+legacy+";c.application.preferences.search.homepageLimit=8;await new Promise((resolve,reject)=>{const r=indexedDB.open('cairnmap-config-lab-v32',2);r.onupgradeneeded=()=>{r.result.createObjectStore('packages');r.result.createObjectStore('history-summaries')};r.onsuccess=()=>{const db=r.result,t=db.transaction(['packages','history-summaries'],'readwrite'),s=t.objectStore('packages');s.put(c,'latest');s.put({kind:'custom'},'active-choice');s.put(c,'revision:'+c.packageId+':999');s.put({raw:'discard old backup'},'recovery:old');t.objectStore('history-summaries').put({huge:'old history'},'old');t.oncomplete=()=>{db.close();resolve()};t.onerror=()=>reject(t.error)}})})()")
    nav();assert b.evaluate("Boolean(document.querySelector('[aria-label=\"检测到本机编辑缓存\"]'))")
    old=b.evaluate("(async()=>{return await new Promise(resolve=>{const r=indexedDB.open('cairnmap-config-lab-v32',3);r.onsuccess=()=>{const db=r.result,t=db.transaction(['packages','history-summaries'],'readonly'),a=t.objectStore('packages').getAllKeys(),d=t.objectStore('history-summaries').getAllKeys();t.oncomplete=()=>{db.close();resolve({keys:a.result,summary:d.result})}}})})()")
    assert old=={'keys':[],'summary':[]};assert b.evaluate("localStorage.getItem('unrelated-drawing-sentinel')")=='keep'
    assert b.evaluate("(async()=>await(await import('/src/configStudio/workspaceStorage.ts')).configRevisionHighWater('cairnmap-config-v32-semantic'))()")>=999
    stored=snapshot();b.evaluate("(async()=>{const s=await import('/src/configStudio/workspaceStorage.ts');const a=await s.initializeWorkspaceStorage();await s.writeWorkspaceCheckpoint(a.checkpoint,a.token);try{await s.writeWorkspaceCheckpoint(a.checkpoint,a.token);throw Error('Stale write passed')}catch(e){if(!String(e).includes('另一窗口'))throw e}})()")
    assert snapshot()['checkpoint']==stored['checkpoint']
    blank();nav();b.click('恢复默认');editor()
    b.screenshot('workspace-current-final.png')
    checks.append('legacy backups/history removed, latest document retained behind chooser, high-water and unrelated state preserved; stale writer rejected')

    # A checkpoint failure must not trap a valid in-memory edit behind the
    # region-save gate; users can still download an explicit diagnostic copy.
    b.click('引擎参数')
    fill("Array.from(document.querySelectorAll('label')).find(x=>x.textContent.includes('激活半径 px')).querySelector('input')",original+2)
    b.evaluate("window.originalWorkspacePut=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(value,key){if(this.name==='workspace'&&key==='configuration')throw new DOMException('Acceptance quota','QuotaExceededError');return window.originalWorkspacePut.call(this,value,key)}")
    b.click('核验引擎');b.click('保存引擎')
    b.wait("Array.from(document.querySelectorAll('main header button')).find(x=>x.textContent==='全局核验').disabled===false")
    b.click('全局核验');b.wait("Array.from(document.querySelectorAll('main header button')).find(x=>x.textContent==='临时保存和下载').disabled===false",30)
    before={p.name:p.stat().st_mtime_ns for p in downloads.glob('*.zip')};b.click('临时保存和下载');b.click('确认临时保存并下载')
    b.wait("document.body.innerText.includes('仅下载副本')");b.click('仅下载副本');wait_zip(before)
    b.evaluate("IDBObjectStore.prototype.put=window.originalWorkspacePut;(async()=>{await(await import('/src/configStudio/workspaceController.ts')).flushWorkspace()})()")
    b.wait("!document.body.innerText.includes('本地缓存失败：')")
    before_bfcache=snapshot()['token'];b.evaluate("window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))")
    b.wait("Boolean(document.querySelector('[aria-label=\"检测到本机编辑缓存\"]'))")
    assert snapshot()['token']==before_bfcache;b.click('继续编辑');editor()
    checks.append('quota failure preserves editable memory and download-only escape; BFCache admission requires a new explicit choice without changing the pending checkpoint')

    # An old session mirror can outlive its IndexedDB database. Preserve its
    # current candidate before removing that mirror, even without old stores.
    blank();b.call('Storage.clearDataForOrigin',{'origin':APP_URL,'storageTypes':'all'})
    b.call('Page.navigate',{'url':APP_URL+'/scripts/browser/fixtures/studio-formal-default.html'});b.wait("document.title==='Studio storage acceptance'")
    b.evaluate("(()=>{const c="+legacy+";c.application.preferences.search.homepageLimit=8;const d=structuredClone(c);d.application.preferences.search.homepageLimit=0;sessionStorage.setItem('cairnmap-config-studio-saved',JSON.stringify(c));sessionStorage.setItem('cairnmap-config-studio-draft',JSON.stringify(d));return true})()")
    nav();assert b.evaluate("Boolean(document.querySelector('[aria-label=\"检测到本机编辑缓存\"]'))")
    mirror=snapshot()['checkpoint'];assert mirror['session']['packageCandidate']['config']['application']['preferences']['search']['homepageLimit']==0
    assert b.evaluate("sessionStorage.getItem('cairnmap-config-studio-draft')") is None
    b.click('继续编辑');editor();assert state()['session']['packageCandidate']['config']['application']['preferences']['search']['homepageLimit']==0
    checks.append('legacy session mirrors survive missing old database: candidate is migrated before mirror cleanup and remains isolated until selected')
    assert not b.errors,b.errors
    result={'checks':checks,'runtimeErrors':b.errors,'nativeDialogs':b.dialogs,'temporaryFile':str(temporary),'formalFile':str(formal),'cloudWrites':0}
    (OUT/'workspace-browser.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(result,ensure_ascii=False))
finally:b.ws.close()
