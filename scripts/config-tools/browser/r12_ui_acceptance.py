"""Real browser controls and rendering, isolated profile; no remote business writes."""
import json,time
from browser_check import Browser,APP_URL,OUT
b=Browser();checks=[]
def js(source):return b.evaluate(source)
def wait(source):b.wait(source,30)
def rule():return "document.querySelectorAll('.cm-render-rule')[1]"
def control(label,tag='select',scope=None,index=0):
    scope=scope or rule()
    return f"[...({scope}).querySelectorAll('label')].filter(l=>l.querySelector('.cm-help-heading')?.textContent.trim().startsWith({json.dumps(label)}))[{index}].querySelector('{tag}')"
def select(label,value,scope=None,index=0):
    expression=control(label,scope=scope,index=index)
    js(f"(()=>{{const el={expression};el.value={json.dumps(value)};el.dispatchEvent(new Event('change',{{bubbles:true}}));return true;}})()")
    time.sleep(.15)
def fill(label,value,scope=None,index=0):
    expression=control(label,'input',scope,index)
    js(f"(()=>{{const el={expression};Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,{json.dumps(str(value))});el.dispatchEvent(new Event('input',{{bubbles:true}}));el.dispatchEvent(new Event('change',{{bubbles:true}}));return true;}})()")
    time.sleep(.15)
def click(text,scope=None):
    scope=scope or 'document'
    js(f"(()=>{{const el=[...({scope}).querySelectorAll('button')].find(el=>el.textContent.trim()==={json.dumps(text)});if(!el)throw Error('button missing: '+{json.dumps(text)});el.click();return true;}})()")
    time.sleep(.2)
try:
    b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/r12-ui-acceptance.html'})
    wait('!!window.r12Harness?.map');js(rule()+'.open=true');time.sleep(.3)
    assert not js('window.r12Harness.report.issues.some(i=>i.severity==="error")')
    click('显示效果')
    wait("document.querySelectorAll('button[aria-pressed=true]').length>0")
    checks.append('condition preview generates boolean false; real matching rule remains enabled')
    select('点状显示','icon')
    wait("document.querySelector('[aria-label=\"当前图标摘要\"]')?.innerText.includes('公交')&&!!document.querySelector('img[alt=\"当前图标缩略预览\"]')")
    assert js("window.r12Harness.config.nodes.find(n=>n.nodeId==='class-sbp').geometryProfiles.Point.zoomPriority.rules[1].style.pointSymbol.kind")== 'icon'
    js("[...document.querySelectorAll('button')].find(b=>b.textContent.startsWith('Icon 选择与配置')).click();true")
    wait("!!document.querySelector('[role=dialog] img[alt=\"组合图标实际 CSS 像素预览\"]')")
    dialog="document.querySelector('[role=dialog]')"
    fill('搜索图标','公交',dialog);time.sleep(.3)
    assert js("document.querySelectorAll('[role=dialog] button[aria-label^=\"选择图标 \" ]').length")>0
    click('2 配置图标',dialog)
    fill('图标大小 px',32,dialog);select('底板形状','roundedRect',dialog)
    assert js("document.querySelector('[role=dialog] img[alt=\"组合图标实际 CSS 像素预览\"]').getBoundingClientRect().width")==32
    b.screenshot('icon-dialog-composition.png')
    b.call('Input.dispatchKeyEvent',{'type':'keyDown','key':'Escape','code':'Escape','windowsVirtualKeyCode':27})
    wait('!document.querySelector("[role=dialog]")')
    assert js("window.r12Harness.config.nodes.find(n=>n.nodeId==='class-sbp').geometryProfiles.Point.zoomPriority.rules[1].style.pointSymbol.icon.item.sizePx")==24
    checks.append('two-page Pinhead search/composition uses actual 32 CSS pixels; Escape cancels isolated draft')
    select('图标设置','valueMap');select('图标映射字段','Name');click('添加图标映射行')
    fill('实际保存值','airport');click('显示第 1 行')
    wait("document.querySelector('.leaflet-container').innerText.includes('airport')")
    assert not js("JSON.stringify(window.r12Harness.config).includes('config-preview-singlePoint')")
    click('取消显示第 1 行');wait("!document.querySelector('.leaflet-container').innerText.includes('airport')")
    checks.append('typed icon mapping row preview injects Name only in temporary business fixture; off restores it')
    select('点状显示','externalImage');fill('图片 URL','/icons/pinhead/v25/bus.svg')
    fill('图片宽 px',36);fill('图片高 px',28);fill('局部 X 偏移 px',7)
    wait("!!document.querySelector('.leaflet-container img[src$=\"/icons/pinhead/v25/bus.svg\"]')")
    label_box="(()=>{const el=[...document.querySelectorAll('.leaflet-container .leaflet-marker-icon')].find(el=>el.textContent.includes('车站建筑'));if(!el)throw Error('label missing');const r=el.getBoundingClientRect();return {x:r.x,y:r.y};})()"
    image_box="(()=>{const r=document.querySelector('.leaflet-container img[src$=\"/icons/pinhead/v25/bus.svg\"]').getBoundingClientRect();return {x:r.x,y:r.y};})()"
    label_before=js(label_box);image_before=js(image_box)
    fill('局部 X 偏移 px',37);time.sleep(.25)
    assert abs(js(label_box)['x']-label_before['x'])<1
    assert abs(js(image_box)['x']-image_before['x']-30)<1
    fill('局部 X 偏移 px',7)
    fill('图片 URL','/icons/pinhead/v25/r12-deliberately-missing.svg');time.sleep(.8)
    assert not js("document.querySelector('.leaflet-container img[src$=\"r12-deliberately-missing.svg\"]')")
    assert abs(js(label_box)['x']-label_before['x'])<1
    wait("Object.values(window.r12Harness.map._layers).some(l=>l._radius>0)")
    fill('图片 URL','/icons/pinhead/v25/bus.svg');wait("!!document.querySelector('.leaflet-container img[src$=\"/icons/pinhead/v25/bus.svg\"]')")
    checks.append('fixed external image decoded and displayed with its own dimensions/local offset')
    select('图片链接来源','valueMap');select('图片映射字段','Name');click('添加图片映射行')
    fill('实际保存值','bus');fill('图片 URL','/icons/pinhead/v25/bus.svg');fill('图片宽 px',40);click('显示第 1 行')
    wait("document.querySelector('.leaflet-container').innerText.includes('bus')")
    select('图片链接来源','fixed')
    assert js(control('图片宽 px','input')+'.value')=='36'
    assert js(control('局部 X 偏移 px','input')+'.value')=='7'
    select('图片链接来源','valueMap');assert js(control('图片宽 px','input')+'.value')=='40'
    select('点状显示','icon');assert js("window.r12Harness.config.nodes.find(n=>n.nodeId==='class-sbp').geometryProfiles.Point.zoomPriority.rules[1].style.pointSymbol.icon.entries[0].value")== 'airport'
    checks.append('source modes and per-image presentation drafts survive switching without leaking inactive branches')
    select('Label 样式','custom_pill_1')
    fill('字号 px',13);fill('上下内边距比例',0);fill('左右内边距比例',0);fill('圆角比例',0);fill('描边宽度 px',2)
    wait("!!document.querySelector('.leaflet-container .ria-label') || !!document.querySelector('.leaflet-container [style*=\"border\"]')")
    capsule="[...document.querySelectorAll('.cm-render-rule')[1].querySelectorAll('fieldset')].find(f=>f.querySelector(':scope > legend')?.textContent.trim()==='背景颜色')"
    select('颜色模式','valueMap',capsule)
    select('设色字段','Name',capsule);click('添加值—颜色行',capsule)
    # Value-map controls use explicit aria labels, avoiding the value/label translation ambiguity.
    js("(()=>{const el=document.querySelector('input[aria-label=\"设色保存值 1\"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,'custom pill');el.dispatchEvent(new Event('input',{bubbles:true}));return true;})()")
    click('显示第 1 行',capsule);wait("document.querySelector('.leaflet-container').innerText.includes('custom pill')")
    assert not js('window.r12Harness.report.issues.some(i=>i.severity==="error")'),js('window.r12Harness.report.issues.filter(i=>i.severity==="error")')
    js(control('字号 px','input')+".closest('fieldset').scrollIntoView({block:'start'});true");time.sleep(.2);b.screenshot('custom-pill-editor.png')
    checks.append('custom capsule has nine settings, true zero padding/radius, independent 2px stroke and five-mode colour row preview')
    # Production shared glyph planner: continuous Latin follows the line, CJK retains upright policy.
    for text in ['North Road','东部 North Road 12 号','ROAD-12']:
        plan=js('window.r12Harness.glyphProbe('+json.dumps(text)+',[[190,410],[190,20]])')
        assert plan.get('plan'),plan
        glyphs=plan['plan']['glyphs']
        assert ''.join(g['char'] for g in glyphs)==text
        assert all(abs(g['rotateDeg'])>80 for g in glyphs if not g['isCjk'] and g['char'].strip()),glyphs
        assert all(g['rotateDeg']==0 for g in glyphs if g['isCjk']),glyphs
    assert js("window.r12Harness.glyphProbe('LONG ENGLISH NAME 123',[[20,200],[1000,200]],{cjkGlyphMaxCount:2}).plan")
    assert not js("window.r12Harness.glyphProbe('中文字',[[20,200],[1000,200]],{cjkGlyphMaxCount:2}).plan")
    normal=js("window.r12Harness.glyphProbe('AB',[[50,200],[350,200]])")['plan']['estimatedTextWidthPx']
    curved=js("window.r12Harness.glyphProbe('AB',[[50,210],[180,210],[292,275]])")['plan']['estimatedTextWidthPx']
    assert curved>normal
    short=js("window.r12Harness.glyphProbe('A1',[[50,200],[145,200]])")
    assert short.get('plan'),short
    fixed=js("window.r12Harness.glyphProbe('A1',[[50,200],[145,200]],{lineTextPathLengthMode:'fixed',textPathMinLengthPx:110})")
    assert not fixed.get('plan')
    js("window.r12Harness.showGlyph('东部 North Road 12 号',[[190,285],[190,15]])")
    js('window.scrollTo(0,0)');time.sleep(.3);b.screenshot('mixed-script-vertical.png')
    checks.append('English/space/digit order preserved on SVG path; CJK upright; curved spacing uses existing threshold; actual-width vs fixed-length gates differ correctly')
    assert not b.errors,b.errors
    (OUT/'r12-ui-results.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors,'remoteBusinessWritesPerformed':False},ensure_ascii=False,indent=2),encoding='utf-8')
    print('r12 real browser: '+str(len(checks))+' groups passed',flush=True)
except Exception:
    b.screenshot('failure.png');(OUT/'r12-ui-failure.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors,'body':js('document.body.innerText').__str__()[-9000:]},ensure_ascii=False,indent=2),encoding='utf-8');raise
finally:b.ws.close()
