"""Full workbench c16->c17, regional save, ZIP import/export and explicit resume.
Only a disposable localhost profile is used; no login, upload or publication.
"""
import json,time,zipfile,os,urllib.request
from pathlib import Path
from browser_check import Browser,APP_URL,OUT

assert APP_URL.startswith('http://127.0.0.1:')
endpoint='http://127.0.0.1:'+os.environ.get('CAIRNMAP_CDP_PORT','9238')
opener=urllib.request.build_opener(urllib.request.ProxyHandler({}))
fresh=json.load(opener.open(urllib.request.Request(endpoint+'/json/new?about:blank',method='PUT')))
for page in json.load(opener.open(endpoint+'/json')):
 if page['type']=='page' and page['id']!=fresh['id'] and (page['url']=='about:blank' or page['url'].startswith(APP_URL)):opener.open(endpoint+'/json/close/'+page['id']).read()
b=Browser();checks=[]
root='[...document.querySelectorAll("details")].find(e=>e.querySelector(":scope>summary")?.textContent.includes("渲染规则 1"))'
def put(expression,value):
 b.wait('Boolean('+expression+')')
 b.evaluate('(()=>{const e='+expression+';Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"value").set.call(e,'+json.dumps(value)+');e.dispatchEvent(new Event("change",{bubbles:true}));})()');time.sleep(.15)
def select_path():
 for code in ['RIL','PLF']:
  prefix=json.dumps(code+'（')
  expression=f"[...document.querySelectorAll('select')].find(e=>e.getClientRects().length&&[...e.options].some(o=>o.text.startsWith({prefix})))"
  b.wait('Boolean('+expression+')');value=b.evaluate(f'[...({expression}).options].find(o=>o.text.startsWith({prefix})).value');put(expression,value)
def label(label):return '[...('+root+').querySelectorAll("label")].find(e=>e.textContent.trim().startsWith('+json.dumps(label)+')).querySelector("select")'
def open_rule():
 b.wait('Boolean('+root+')')
 if not b.evaluate(root+'.open'):b.click(b.evaluate(root+'.querySelector(":scope>summary").textContent.trim()'))
def save_candidate():
 b.click('核验整包草稿');b.click('保存整包草稿');b.wait('!document.body.innerText.includes("整包候选 ·")')

try:
 b.call('Storage.clearDataForOrigin',{'origin':APP_URL,'storageTypes':'all'})
 b.call('Page.navigate',{'url':APP_URL+'/?workspace=config-studio&tab=features'})
 b.wait('document.body.innerText.includes("下载并启用")||Boolean(document.querySelector("nav[aria-label=设计工作区]"))',60)
 if b.evaluate('document.body.innerText.includes("下载并启用")'):b.click('下载并启用')
 b.wait('Boolean(document.querySelector("nav[aria-label=设计工作区]"))',60);b.evaluate('window.confirm=()=>true');b.errors=[]
 target=b.evaluate('(async()=> (await import("/src/configStudio/contract.ts")).NATIVE_CONFIG_REVISION)()');assert target>=17
 if '契约 c16' in b.evaluate('document.body.innerText')[:500]:
  b.click('迁移到 c'+str(target)+' 草稿');b.wait('document.body.innerText.includes("整包候选 ·")');checks.append('fresh actual workbench keeps c16 until explicit migration');b.click('放弃整包草稿')
 # The frozen source keeps this regression valid after the production pointer
 # advances or the user's current taxonomy changes.
 source=Path('public/configuration/releases/d11e0537c8756dcb7d58326675171a06aa47d71dfe7a4213acde9eb550f3b778/config.json').resolve()
 b.click('导入本地配置');document=b.call('DOM.getDocument');upload=b.call('DOM.querySelector',{'nodeId':document['root']['nodeId'],'selector':'header input[type=file]'})['nodeId'];b.call('DOM.setFileInputFiles',{'nodeId':upload,'files':[str(source)]})
 b.wait('document.body.innerText.includes("已导入隔离候选")',45);assert '契约 c'+str(target) in b.evaluate('document.body.innerText')[:500];checks.append('normal UI import migrates an immutable c16 JSON source without changing the source')
 select_path();b.click('读取分类');open_rule();put(label('显示种类'),'geometry');put(label('点状显示'),'externalImage');put(label('来源形式'),'library')
 b.click('从图片库选择');b.wait('Boolean(document.querySelector("[role=dialog][aria-label=图片库]"))');b.click('选择图片 N1.png');b.wait('!([...document.querySelectorAll("[role=dialog] button")].find(e=>e.textContent.trim()==="确认选择").disabled)');b.click('确认选择')
 b.click('核验');b.wait('document.body.innerText.includes("核验通过 ·")');b.click('保存');checks.append('actual category read, display edit, gallery choice, validation and regional save')
 save_candidate();b.click('全局核验');b.click('整包下载/上传');checks.append('candidate validation/save and top-level validation open normal package controls')
 directory=OUT/'studio-downloads';directory.mkdir(parents=True,exist_ok=True);previous={p.name:p.stat().st_mtime_ns for p in directory.glob('*.zip')}
 b.call('Browser.setDownloadBehavior',{'behavior':'allow','downloadPath':str(directory.resolve())});b.click('下载配置整包')
 deadline=time.time()+25;new=[]
 while not new and time.time()<deadline:
  new=[p for p in directory.glob('*.zip') if p.name not in previous or p.stat().st_mtime_ns>previous[p.name]];time.sleep(.1)
 assert new,'download was not produced';archive=max(new,key=lambda p:p.stat().st_mtime_ns)
 with zipfile.ZipFile(archive) as zip:config=json.loads(zip.read('config.json'))
 image=next(n for n in config['nodes'] if n['path']=={'class':'RIL','kind':'PLF'})['geometryProfiles']['Point']['zoomPriority']['rules'][0]['style']['pointSymbol']['image']
 assert config['contractRevision']==target and image['sourceForm']=='library' and image['url']=='/image-library/N1.png';checks.append('normal workbench ZIP download contains the current contract and explicit library intent')
 b.wait('!document.body.innerText.includes("下载配置整包")');b.click('导入本地配置');document=b.call('DOM.getDocument');upload=b.call('DOM.querySelector',{'nodeId':document['root']['nodeId'],'selector':'header input[type=file]'})['nodeId'];assert upload
 b.call('DOM.setFileInputFiles',{'nodeId':upload,'files':[str(archive.resolve())]});b.wait('document.body.innerText.includes("已导入隔离候选")',45)
 select_path();b.click('读取分类');open_rule();assert b.evaluate(label('来源形式')+'.value')=='library';assert b.evaluate(root+'.innerText.includes("图片选择：N1.png")');checks.append('normal file input import and category reopen retain gallery selection')
 b.click('放弃草稿');save_candidate();b.click('全局核验')
 b.call('Page.reload');b.wait('document.body.innerText.includes("继续编辑")',45);b.click('继续编辑');b.wait('Boolean(document.querySelector("nav[aria-label=设计工作区]"))');assert '契约 c'+str(target) in b.evaluate('document.body.innerText')[:500]
 select_path();b.click('读取分类');open_rule();assert b.evaluate(label('来源形式')+'.value')=='library';assert b.evaluate(root+'.innerText.includes("图片选择：N1.png")');checks.append('reload requires explicit checkpoint decision and restores actual c17 selection')
 decoded=b.evaluate('''(async()=>{const {libraryImages}=await import('/src/configStudio/imageLibraryCatalogue.ts');return await Promise.all(libraryImages.map(row=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>image.decode().then(()=>resolve(row.name),reject);image.onerror=()=>reject(Error(row.name));image.src=row.url;})));})()''')
 assert len(decoded)>=25;checks.append('all initial 25 original images decode in a real browser')
 assert not b.errors,b.errors
 b.screenshot('c17-main-roundtrip-restored.png');(OUT/'c17-studio-result.json').write_text(json.dumps({'checks':checks,'archive':str(archive),'contractRevision':config['contractRevision'],'revision':config['revision'],'image':image,'decodedImages':decoded,'runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(checks,ensure_ascii=False,indent=2))
except Exception:
 b.screenshot('c17-studio-failure.png');(OUT/'c17-studio-failure.json').write_text(json.dumps({'checks':checks,'text':b.evaluate('document.body.innerText'),'errors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8');raise
