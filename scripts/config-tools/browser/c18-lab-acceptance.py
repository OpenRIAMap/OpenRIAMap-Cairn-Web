"""Real standalone lab import/switch/reload and protected studio handoff."""
import json,time
from browser_check import Browser,APP_URL,OUT
b=Browser();checks=[]
def record(name):
 checks.append(name);(OUT/'c18-lab-browser.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf8')
def navigate(path):
 origin=b.evaluate('performance.timeOrigin');b.call('Page.navigate',{'url':APP_URL+path});b.wait('performance.timeOrigin>'+str(origin))
def snapshot():
 return b.evaluate("(async()=>{const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('cairnmap-config-lab-v32',3);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});try{return await new Promise((resolve,reject)=>{const t=db.transaction('workspace','readonly'),s=t.objectStore('workspace'),r=s.getAll(),k=s.getAllKeys();t.oncomplete=()=>resolve(JSON.stringify([k.result,r.result]));t.onerror=()=>reject(t.error)})}finally{db.close()}})()")
def frame_config():
 return b.evaluate("document.querySelector('iframe').contentWindow.eval(\"(async()=>{const r=await import('/src/configRuntime/runtimeDataView.ts');const c=r.getRuntimeConfiguration();return c?{r:c.revision,c:c.contractRevision,name:c.displayName.zh}:null})()\")")
def lab_ready():
 b.wait("!!document.querySelector('[aria-label=\"运行配置版本\"] option')",60)
 b.wait("!!document.querySelector('iframe')?.contentWindow.document.querySelector('.leaflet-container')",60)
def import_file(path):
 root=b.call('DOM.getDocument',{'depth':1})['root']['nodeId'];node=b.call('DOM.querySelector',{'nodeId':root,'selector':'input[type=file]'})['nodeId']
 b.call('DOM.setFileInputFiles',{'nodeId':node,'files':[str(path)]})

navigate('/?workspace=config-studio')
b.wait("document.body.innerText.includes('继续编辑')||!!document.querySelector('nav[aria-label=\"设计工作区\"]')",60)
if b.evaluate("document.body.innerText.includes('继续编辑')"):b.click('继续编辑')
b.wait("!!document.querySelector('nav[aria-label=\"设计工作区\"]')",60)
# Keep a real uncommitted module draft as the neighbouring workspace fixture.
b.click('要素设计')
if not b.evaluate("!![...document.querySelectorAll('button')].find(e=>e.textContent==='放弃草稿'&&!e.disabled)"):
 for level,value in [('Class','TPT'),('Kind','WRP'),('SKind','ZTH'),('SKind2','LAKz')]:
  b.evaluate("(()=>{const e=[...document.querySelectorAll('select')].find(e=>e.getAttribute('aria-label')==="+json.dumps('编辑分类 '+level)+");e.value="+json.dumps(value)+";e.dispatchEvent(new Event('change',{bubbles:true}))})()");time.sleep(.1)
 b.click('读取分类')
b.evaluate("(async()=>{const w=await import('/src/configStudio/workspaceController.ts');await w.flushWorkspace();w.permitWorkspaceUnload()})()")
before=snapshot();cookies=b.evaluate('document.cookie')
navigate('/?workspace=config-lab');lab_ready()
assert frame_config()['c']==17,frame_config()
assert b.evaluate("[...document.querySelector('header').querySelectorAll('button')].map(e=>e.textContent)")==['编辑','导入本地配置','关闭']
assert snapshot()==before
record('A17: lab opens the formal c17 snapshot independently of the neighbouring c18 module draft; toolbar contains only edit/import/close')

candidate=OUT.parent/'delivery/config-r151-c18-candidate.json'
variant=json.loads(candidate.read_text(encoding='utf8'));variant['displayName']['zh']='实验室第二配置';variant_path=OUT/'lab-second-c18.json';variant_path.write_text(json.dumps(variant,ensure_ascii=False),encoding='utf8')
for index,path in enumerate([candidate,variant_path]):
 import_file(path);b.wait("document.querySelectorAll('[aria-label=\"运行配置版本\"] option').length=="+str(index+2),60)
 b.wait("document.querySelector('header [role=status]').textContent.includes('已添加')",60)
 b.wait("!!document.querySelector('iframe')?.contentWindow.document.querySelector('.leaflet-container')",60)
 assert frame_config()['c']==18
assert frame_config()['name']=='实验室第二配置'
b.evaluate("(()=>{const e=document.querySelector('[aria-label=\"运行配置版本\"]');e.value='formal';e.dispatchEvent(new Event('change',{bubbles:true}))})()")
b.wait("document.querySelector('header [role=status]').textContent.includes('已添加')",15);time.sleep(.8)
assert frame_config()['c']==17
assert snapshot()==before
assert b.evaluate('document.cookie')==cookies
record('A17: two actual file imports create process-local choices; switching restores the corresponding iframe runtime without changing studio storage or map cookies')
b.screenshot('c18-lab-isolated.png')
navigate('/?workspace=config-lab');lab_ready()
assert b.evaluate("document.querySelectorAll('[aria-label=\"运行配置版本\"] option').length")==1
assert snapshot()==before
record('A17: lab reload resets its version pool to formal while retaining the independent studio draft')
b.click('编辑');b.wait("document.body.innerText.includes('继续编辑')||!!document.querySelector('nav[aria-label=\"设计工作区\"]')",60)
if b.evaluate("document.body.innerText.includes('继续编辑')"):b.click('继续编辑')
b.wait("document.body.innerText.includes('实验室配置等待接收')",60)
assert snapshot()==before
record('A17: explicit edit handoff respects existing unsaved studio drafts and does not overwrite them')
assert not b.errors,b.errors
print(json.dumps({'checks':checks,'runtimeErrors':b.errors},ensure_ascii=False))
