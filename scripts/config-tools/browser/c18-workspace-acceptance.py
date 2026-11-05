import json,time
from browser_check import Browser,APP_URL,OUT
b=Browser();checks=[]
def result(name):
 checks.append(name);(OUT/'c18-workspace-browser.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf8')
def evaluate(source):return b.evaluate(source)
def select(label,value):
 evaluate("(()=>{const e=[...document.querySelectorAll('select')].find(e=>e.getAttribute('aria-label')==="+json.dumps(label)+");e.value="+json.dumps(value)+";e.dispatchEvent(new Event('change',{bubbles:true}));})()");time.sleep(.15)
def click_expr(source):
 rect=evaluate("(()=>{const e="+source+";e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()")
 for kind in ['mousePressed','mouseReleased']:b.call('Input.dispatchMouseEvent',{'type':kind,'button':'left','clickCount':1,**rect})
 time.sleep(.2)
def resume():
 b.wait("document.body.innerText.includes('继续编辑')||!!document.querySelector('nav[aria-label=\"设计工作区\"]')",50)
 if evaluate("document.body.innerText.includes('继续编辑')"):b.click('继续编辑')
 b.wait("!!document.querySelector('nav[aria-label=\"设计工作区\"]')",50);evaluate('window.confirm=()=>true')

if not evaluate("!!document.querySelector('nav[aria-label=\"设计工作区\"]')"):
 if not evaluate("document.body.innerText.includes('继续编辑')"):
  origin=evaluate('performance.timeOrigin');b.call('Page.navigate',{'url':APP_URL+'/?workspace=config-studio'});b.wait('performance.timeOrigin>'+str(origin))
 resume()
if evaluate("!![...document.querySelectorAll('button')].find(e=>e.offsetHeight&&!e.disabled&&e.textContent==='放弃草稿')"):b.click('放弃草稿')
b.click('要素设计')
for level,value in [('Class','TPT'),('Kind','WRP'),('SKind','ZTH'),('SKind2','LAKz')]:select('编辑分类 '+level,value)
b.click('读取分类')
assert evaluate("[...document.querySelectorAll('input')].filter(e=>['传送','Warp点','ZTH'].includes(e.value)&&e.dataset.configSetting==='ConfigStudio/名称（zh）').every(e=>e.disabled)")
assert evaluate("!![...document.querySelectorAll('input')].find(e=>e.value==='零洲地标'&&!e.disabled)")
result('A15: actual four-level classification editor locks ancestor names and enables the selected name')
b.screenshot('c18-classification-label-lock.png')
click_expr("[...document.querySelectorAll('input')].find(e=>e.value==='零洲地标'&&!e.disabled)")
b.call('Input.dispatchKeyEvent',{'type':'keyDown','key':'a','code':'KeyA','modifiers':2,'windowsVirtualKeyCode':65});b.call('Input.dispatchKeyEvent',{'type':'keyUp','key':'a','code':'KeyA','modifiers':2,'windowsVirtualKeyCode':65})
b.call('Input.insertText',{'text':'未离焦缓存验收 ABC'})
evaluate("(async()=>{const cache=await import('/src/components/Rules/data/worldRuleCache.ts'),runtime=await import('/src/components/Rules/data/formalDataSourceRuntime.ts');for(const world of ['zth','eden','naraku','houtu']){const source=runtime.getRuleDataSourceSnapshot(world);cache.writeRuleWorldCache({...source,worldId:world,releaseId:'c18-browser-cache-probe'},{worldId:world,mergeVersion:'c18-browser-cache-probe',formalVersion:world==='zth'?25:1,loadedAt:1,features:[{ID:world+'-probe'}]});}await(await import('/src/configStudio/workspaceController.ts')).flushWorkspace();})()")
for attempt in range(3):
 evaluate("(async()=>{const w=await import('/src/configStudio/workspaceController.ts');await w.flushWorkspace();w.permitWorkspaceUnload();})()")
 origin=evaluate('performance.timeOrigin');b.call('Page.reload');b.wait('performance.timeOrigin>'+str(origin));resume()
 assert evaluate("!![...document.querySelectorAll('input')].find(e=>e.value==='未离焦缓存验收 ABC'&&!e.disabled)")
 cached=evaluate("(async()=>{const cache=await import('/src/components/Rules/data/worldRuleCache.ts'),runtime=await import('/src/components/Rules/data/formalDataSourceRuntime.ts');return ['zth','eden','naraku','houtu'].map(world=>({world,meta:cache.readRuleWorldMeta(world,runtime.getRuleDataSourceSnapshot(world)),data:cache.readRecoverableRuleWorldCache(world,runtime.getRuleDataSourceSnapshot(world))?.dataset.formalVersion}));})()")
 assert len([row for row in cached if row['meta'] and row['data'] in [1,25]])==4,cached
result('A01/A18: three actual reloads retain all four world caches and restore focused uncommitted text after explicit admission')
b.click('放弃草稿');time.sleep(.4);b.click('读取分类')
assert evaluate("!![...document.querySelectorAll('input')].find(e=>e.value==='零洲地标'&&!e.disabled)")
result('A18: explicit discard clears the category input buffer; reread restores saved text')
b.click('放弃草稿');b.click('工作流设计')
assert evaluate("!!document.querySelector('[aria-label=\"各世界工作流设置\"]')")
click_expr("document.querySelector('[aria-label=\"各世界工作流设置\"] button')")
evaluate("document.querySelector('[aria-label=\"各世界工作流设置\"] details').open=true")
was_checked=evaluate("document.querySelector('[aria-label=\"各世界工作流设置\"] details input[type=checkbox]').checked")
world_id=evaluate("(async()=>{const w=await import('/src/configStudio/workspaceController.ts');return w.getActiveConfigSnapshot().application.worlds[0].id})()")
before=evaluate("[...document.querySelector('[aria-label=\"各世界工作流设置\"] details').querySelectorAll('input[type=checkbox]')].filter(e=>e.checked).length")
click_expr("document.querySelector('[aria-label=\"各世界工作流设置\"] details input[type=checkbox]')")
b.click('核验并保存');b.wait("!document.querySelector('[aria-label=\"各世界工作流设置\"] details')",40)
saved=evaluate("(async()=>{const w=await import('/src/configStudio/workspaceController.ts');return {r:w.getActiveConfigSnapshot().revision,worlds:w.getActiveConfigSnapshot().application.workflowAvailability,audit:w.getWorkspaceState().editAudit.checkpoints.length}})()")
assert saved['r']==151
assert len(saved['worlds'][world_id])==before+(-1 if was_checked else 1)
result('A05/A10: actual per-world quick-workflow toggle validates and saves with an audit checkpoint; formal r remains 151')
b.screenshot('c18-world-workflow-settings.png')
assert not b.errors,b.errors
print(json.dumps({'checks':checks,'runtimeErrors':b.errors},ensure_ascii=False))
