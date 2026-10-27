"""Actual c17 editor/picker/map/codec operations in an isolated local browser."""
import json, time, os, urllib.request
from pathlib import Path
from browser_check import Browser, APP_URL, OUT

assert APP_URL.startswith('http://127.0.0.1:')
b=Browser();checks=[]

def visible(expression):return '('+expression+').filter(e=>e.getClientRects().length&&!e.closest("[inert]"))'
def label_select(label):return visible('[...document.querySelectorAll("label")]')+'.find(e=>e.textContent.trim().startsWith('+json.dumps(label)+')).querySelector("select")'
def rows():return '[...document.querySelectorAll("button")].filter(e=>e.textContent.trim()==="删除图片行").map(e=>e.closest("section.cm-item"))'
def put(expression,value):
 b.wait('Boolean('+expression+')')
 b.evaluate('(()=>{const e='+expression+';if(e.disabled)throw Error("Control disabled");Object.getOwnPropertyDescriptor(e.tagName==="SELECT"?HTMLSelectElement.prototype:HTMLInputElement.prototype,"value").set.call(e,'+json.dumps(str(value))+');e.dispatchEvent(new Event(e.tagName==="SELECT"?"change":"input",{bubbles:true}));})()')
 time.sleep(.12)
def image():return b.evaluate('window.imageLibraryAcceptance.config.nodes.find(n=>n.nodeId==="image-library-test").geometryProfiles.Point.zoomPriority.rules[0].style.pointSymbol.image')
def open_rule():
 expr='[...document.querySelectorAll("details")].find(e=>e.querySelector(":scope > summary")?.textContent.includes("渲染规则 1"))'
 b.wait('Boolean('+expr+')')
 if not b.evaluate(expr+'.open'):b.click(b.evaluate(expr+'.querySelector(":scope > summary").textContent.trim()'))
def navigate(query=''):
 b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/image-library-acceptance.html'+query})
 b.wait('Boolean(window.imageLibraryAcceptance?.config)',60);b.errors=[];open_rule()
def pick(name,confirm=True,entry=None):
 if entry is None:b.click('图片选择：'+image()['url'].split('/')[-1] if image().get('url') else '从图片库选择')
 else:
  expr='[...('+rows()+'['+str(entry)+']).querySelectorAll("button")].find(e=>e.textContent.includes("图片选择：")||e.textContent.trim()==="从图片库选择")'
  b.evaluate(expr+'.click()')
 b.wait('Boolean(document.querySelector("[role=dialog]"))')
 put('document.querySelector("input[type=search]")',name)
 b.click('选择图片 '+name)
 b.wait('!([...document.querySelectorAll("[role=dialog] button")].find(e=>e.textContent.trim()==="确认选择").disabled)')
 b.click('确认选择' if confirm else '取消')
 b.wait('!document.querySelector("[role=dialog]")')

try:
 navigate();assert image()['sourceForm']=='library';initial_presentation=image()['presentation']
 b.click('图片选择：N1.png');b.wait('Boolean(document.querySelector("[role=dialog]"))')
 put('document.querySelector("input[type=search]")','does-not-exist-in-library');assert b.evaluate('document.querySelector("[role=dialog]").innerText.includes("没有符合条件的图片")')
 put('document.querySelector("input[type=search]")','N2 PNG')
 assert b.evaluate('document.querySelectorAll("[role=dialog] button[aria-pressed]").length')==1
 b.screenshot('c17-gallery-search.png')
 b.click('选择图片 N2.png');b.click('取消');assert image()['url']=='/image-library/N1.png';checks.append('search is case-insensitive and token-based; cancel preserves original')
 pick('N2.png');assert image()['url']=='/image-library/N2.png' and image()['sourceForm']=='library';assert image()['presentation']==initial_presentation
 b.wait("[...document.querySelectorAll('section[aria-label=\"图片实际预览\"] .leaflet-marker-icon')].some(e=>e.getAttribute('src')?.endsWith('/image-library/N2.png'))",20)
 checks.append('confirmed choice retains presentation and renders actual image in validator')
 b.screenshot('c17-selected-preview.png')
 put('document.querySelector("select[aria-label=来源形式]")','url');put('document.querySelector("input[aria-label^=图片]")','/image-library/N3.png')
 b.click('验收：重开当前配置');open_rule();assert image()['sourceForm']=='url';assert b.evaluate('document.querySelector("select[aria-label=来源形式]").value')=='url';checks.append('URL intent survives a full editor remount even for library-shaped paths')
 put('document.querySelector("select[aria-label=来源形式]")','library');assert image()['url']=='';pick('N4.png')
 put('document.querySelector("select[aria-label=来源形式]")','url');assert image()['url']=='/image-library/N3.png'
 put('document.querySelector("select[aria-label=来源形式]")','library');assert image()['url']=='/image-library/N4.png';assert image()['presentation']==initial_presentation;checks.append('source-form toggles retain independent temporary addresses and all external presentation settings')
 b.click('图片选择：N4.png');b.wait('Boolean(document.querySelector("[role=dialog]"))');b.call('Input.dispatchKeyEvent',{'type':'keyDown','key':'Escape','code':'Escape','windowsVirtualKeyCode':27});b.call('Input.dispatchKeyEvent',{'type':'keyUp','key':'Escape','code':'Escape','windowsVirtualKeyCode':27});b.wait('!document.querySelector("[role=dialog]")');assert image()['url']=='/image-library/N4.png';checks.append('Escape cancels without mutation and releases modal isolation')
 put(label_select('图片来源'),'valueMap');put(label_select('图片映射字段'),'Choice');b.click('添加图片映射行');b.click('添加图片映射行')
 assert len(image()['entries'])==2
 for index,key in enumerate(['a','b']):put(rows()+'['+str(index)+'].querySelector("input")',key)
 put(rows()+'[0].querySelector("select[aria-label=来源形式]")','library');pick('N1.png',entry=0)
 put(rows()+'[1].querySelector("input[aria-label^=图片]")','/image-library/N2.png')
 assert [row['sourceForm'] for row in image()['entries']]==['library','url'];checks.append('mapping rows independently mix image-library and URL sources')
 b.click('显示第 1 行');b.wait("[...document.querySelectorAll('section[aria-label=\"图片实际预览\"] .leaflet-marker-icon')].some(e=>e.getAttribute('src')?.endsWith('/image-library/N1.png'))",20)
 b.click('显示第 2 行');b.wait("[...document.querySelectorAll('section[aria-label=\"图片实际预览\"] .leaflet-marker-icon')].some(e=>e.getAttribute('src')?.endsWith('/image-library/N2.png'))",20);checks.append('real mapping preview injects each saved scalar and displays corresponding image')
 # Inspect row control labels to click the actual reorder action.
 controls=b.evaluate(rows()+'[0].querySelectorAll("button").length')
 move=rows()+'[0].querySelector("button[aria-label*=下移]")'
 b.wait('Boolean('+move+')');b.evaluate(move+'.click()');time.sleep(.2)
 assert [row['value'] for row in image()['entries']]==['b','a'];assert [row['sourceForm'] for row in image()['entries']]==['url','library'];checks.append('reordering preserves source forms and image values with their rows')
 mapping_snapshot=image();put(label_select('图片来源'),'fixed');assert image()['sourceForm']=='library' and image()['url']=='/image-library/N4.png';assert image()['presentation']==initial_presentation
 put(label_select('图片来源'),'fieldUrl');put(label_select('图标 URL 字段'),'Name');assert 'sourceForm' not in image() and b.evaluate('document.querySelector("select[aria-label=来源形式]")===null')
 put(label_select('图片来源'),'externalFieldUrl');put(label_select('目标要素 ID 所在字段'),'Name');put('[...document.querySelectorAll("label")].find(e=>e.textContent.startsWith("目标要素的图片 URL 字段路径")).querySelector("input")','extensions.image');assert 'sourceForm' not in image()
 put(label_select('图片来源'),'valueMap');assert image()==mapping_snapshot;checks.append('all four source modes retain their own drafts; dynamic fields never acquire source-form tags')
 for attempt in range(5):pick('N2.png',False,entry=1)
 assert image()==mapping_snapshot and b.evaluate('!document.querySelector("[role=dialog]")&&!document.getElementById("image-library-acceptance").inert');checks.append('repeated open/select/cancel releases modal locks and leaves row data unchanged')
 b.screenshot('c17-mapping-rows.png')
 snapshot=image();b.click('验收：重开当前配置');open_rule();assert image()==snapshot
 directory=OUT/'downloads';directory.mkdir(parents=True,exist_ok=True)
 previous={p.name:p.stat().st_mtime_ns for p in directory.glob('*.zip')}
 b.call('Browser.setDownloadBehavior',{'behavior':'allow','downloadPath':str(directory.resolve())});b.click('验收：导出配置')
 deadline=time.time()+20
 new=[]
 while not new and time.time()<deadline:
  new=[p for p in directory.glob('*.zip') if p.name not in previous or p.stat().st_mtime_ns>previous[p.name]];time.sleep(.1)
 assert new,'download was not produced';download=max(new,key=lambda p:p.stat().st_mtime_ns)
 document=b.call('DOM.getDocument');upload=b.call('DOM.querySelector',{'nodeId':document['root']['nodeId'],'selector':'input[aria-label="验收：重新导入"]'})['nodeId'];b.call('DOM.setFileInputFiles',{'nodeId':upload,'files':[str(download.resolve())]})
 b.wait('document.body.innerText.includes("已通过正式配置读取入口导入")');open_rule();assert image()==snapshot;checks.append('actual ZIP download and file-input reimport retain c17 and every per-row form')
 # A new loose image appears by directory scan; no catalogue or application code changes.
 library=Path('public/image-library');added=library/'验收新增 图片.png';assert not added.exists();added.write_bytes((library/'N1.png').read_bytes())
 try:
  put(rows()+'[0].querySelector("select[aria-label=来源形式]")','library');pick('验收新增 图片.png',entry=0)
  assert image()['entries'][0]['url'].endswith('%E9%AA%8C%E6%94%B6%E6%96%B0%E5%A2%9E%20%E5%9B%BE%E7%89%87.png');checks.append('adding a Chinese/spaced file is automatically enumerated without an index edit')
 finally:added.unlink()
 b.wait('document.body.innerText.includes("图片不存在于当前图片库")');assert image()['entries'][0]['sourceForm']=='library';checks.append('file deletion preserves explicit library intent and URL with an availability warning')
 assert not b.errors,b.errors
 navigate('?legacy=1');assert b.evaluate('document.querySelector("select[aria-label=来源形式]")===null');assert 'sourceForm' not in image();checks.append('legacy c16 is readable without silent migration or new field writes')
 navigate('?missing=1');b.wait('document.body.innerText.includes("图片不存在于当前图片库")');time.sleep(1.5)
 assert image()['sourceForm']=='library' and image()['url'].endswith('not-deployed.png')
 assert not b.evaluate("[...document.querySelectorAll('section[aria-label=\"图片实际预览\"] .leaflet-marker-icon')].some(e=>e.getAttribute('src')?.includes('not-deployed.png'))")
 b.screenshot('c17-missing-image-fallback.png');checks.append('missing static resource (HTML fallback) cannot render as an image or change source form')
 assert not b.errors,b.errors
 (OUT/'c17-image-library-result.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(checks,ensure_ascii=False,indent=2))
except Exception:
 b.screenshot('c17-image-library-failure.png');(OUT/'c17-image-library-failure.json').write_text(json.dumps({'checks':checks,'text':b.evaluate('document.body.innerText'),'errors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8');raise
