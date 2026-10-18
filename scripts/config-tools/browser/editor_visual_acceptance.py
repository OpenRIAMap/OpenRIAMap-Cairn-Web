"""Visual-only editor acceptance in a dedicated, disposable browser profile.

Run with CAIRNMAP_APP_URL, CAIRNMAP_CDP_PORT and CAIRNMAP_ACCEPTANCE_OUT.
Never point this at a user's browser: it clears this profile's UI preferences.
"""
import hashlib
import json
import time
from browser_check import Browser, APP_URL, OUT

b=Browser()
checks=[]
metrics=[]

def evaluate(js): return b.evaluate(js)
def click(text,scope='document'):
    evaluate(f"[...{scope}.querySelectorAll('button')].find(e=>e.textContent.trim()==={json.dumps(text)}&&!e.disabled).click()")
    time.sleep(.12)
def select(label,value):
    evaluate(f"(()=>{{const e=[...document.querySelectorAll('select')].find(e=>e.getAttribute('aria-label')==={json.dumps(label)});Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(e,{json.dumps(value)});e.dispatchEvent(new Event('change',{{bubbles:true}}));}})()")
    time.sleep(.12)
def text_value(selector,value):
    evaluate(f"(()=>{{const e=document.querySelector({json.dumps(selector)});const proto=e.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(e,{json.dumps(value)});e.dispatchEvent(new Event('input',{{bubbles:true}}));}})()")
    time.sleep(.12)
def tab(name):
    evaluate(f"[...document.querySelectorAll('[role=tab]')].find(e=>e.textContent==={json.dumps(name)}).click()")
    time.sleep(.12)
def viewport(width,height=1000,scale=1):
    b.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':height,'deviceScaleFactor':scale,'mobile':False})
    time.sleep(.12)
def show(selector,name):
    evaluate(f"(()=>{{const e=document.querySelector({json.dumps(selector)});if(!e)throw Error('Missing screenshot target');if(e.tagName==='DETAILS')e.open=true;for(let p=e.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;e.scrollIntoView({{block:'start'}});}})()")
    time.sleep(.12)
    b.screenshot(name)
def snapshot():
    return hashlib.sha256(evaluate('JSON.stringify(window.applicationAcceptance.snapshot())').encode()).hexdigest()
def boot():
    b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/subject-ui-acceptance.html?mode=general&resources=1'})
    time.sleep(.5)
    b.wait("document.querySelector('[role=tab]')!==null")
    evaluate('window.confirm=()=>true')
    for _ in range(6):
        discarded=evaluate("(()=>{const e=[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='放弃草稿'&&!e.disabled&&e.getBoundingClientRect().height);if(!e)return false;e.click();return true})()")
        if not discarded: break
        time.sleep(.15)
    time.sleep(.4)
    evaluate('localStorage.clear();sessionStorage.clear();window.confirm=()=>true')
    b.call('Page.reload')
    time.sleep(.5)
    b.wait("document.querySelector('[role=tab]')!==null")
    tab('总体规则')
    evaluate('window.confirm=()=>true')
def measure(phase):
    data=evaluate("""(()=>{const pane=document.querySelector('.cm-authoring-pane'),r=pane.getBoundingClientRect();return {viewport:innerWidth,height:innerHeight,document:[document.documentElement.clientWidth,document.documentElement.scrollWidth],pane:[pane.clientWidth,pane.scrollWidth],paneRect:{x:r.x,y:r.y,w:r.width,h:r.height},overflows:[...pane.querySelectorAll('label,article,fieldset,section')].filter(e=>{const r=e.getBoundingClientRect();return !e.closest('details:not([open])')&&r.height&&r.bottom>100&&r.top<innerHeight-40&&e.scrollWidth>e.clientWidth+2}).map(e=>({tag:e.tagName,width:e.clientWidth,scroll:e.scrollWidth,text:e.textContent.slice(0,80)})).slice(0,10)}})()""")
    data['phase']=phase;metrics.append(data)
    assert data['document'][1]<=data['document'][0]+1,data
    assert data['pane'][1]<=data['pane'][0]+1,data
    assert not data['overflows'],data
def feature(code):
    select('编辑分类 Class',code)
    click('读取分类')
    b.wait("document.querySelector('.cm-field-definition')!==null")

boot();base=snapshot()
for section in ['buttons','worlds']:
    scope=f"document.querySelector('[data-application-section={section}]')"
    click('读取/编辑',scope)
    b.wait(f"document.querySelector('[data-application-section={section}] article')!==null")
    for width in [1440,600,390]:
        viewport(width)
        show(f'[data-application-section={section}] article',f'reference-{section}-{width}.png')
        measure('reference-'+section)
    click('放弃草稿',scope)
viewport(1440)
for section in ['sources','modules','review','preferences']:
    scope=f"document.querySelector('[data-application-section={section}]')"
    click('读取/编辑',scope)
    for width in [1440,600,390]:
        viewport(width)
        show(f'[data-application-section={section}]',f'general-{section}-{width}.png')
        measure('general-'+section)
    click('放弃草稿',scope)
viewport(1440)
assert snapshot()==base
checks.append('reference button and world layouts; viewing leaves active package unchanged')

tab('要素设计')
evaluate("document.querySelector('.cm-authoring-pane details').open=true")
for width in [1440,600,390]:
    viewport(width)
    show('.cm-authoring-pane .cm-option-row',f'lookup-table-{width}.png')
    measure('lookup-table')
evaluate("document.querySelector('.cm-authoring-pane details').open=false")
viewport(1440)
checks.append('lookup table local/function columns fit desktop and narrow containers')
feature('ROD')
show('article[aria-label="字段 Name"]','feature-fields-1440.png')
show('section[aria-label="规则适用范围"]','feature-render-1440.png')
show('.cm-card-item','feature-card-1440.png')
assert evaluate("(()=>{const e=[...document.querySelectorAll('.cm-card-item label')].find(e=>e.textContent.startsWith('显示字段'));const input=e.querySelector('input'),h=e.querySelector('.cm-help-heading');return h.querySelectorAll('[data-module-help]').length===1&&h.getBoundingClientRect().bottom<=input.getBoundingClientRect().top+1})()")
checks.append('card path help stays in its field heading; no duplicate help icon')
for width in [1920,1440,1280,900,768,600,390]:
    viewport(width)
    show('article[aria-label="字段 Name"]',f'feature-fields-{width}.png')
    measure('feature-fields')
    geometry=evaluate("(()=>{const p=document.querySelector('.cm-validator-pane').getBoundingClientRect(),e=document.querySelector('.cm-authoring-pane').getBoundingClientRect(),m=document.querySelector('.leaflet-container').getBoundingClientRect();return {preview:{x:p.x,y:p.y,w:p.width,b:p.bottom},editor:{x:e.x,y:e.y,w:e.width,b:e.bottom},mapBottom:m.bottom,overlap:innerWidth<1280?p.bottom-e.y:p.right-e.x}})()")
    metrics.append({'phase':'preview-boundary','viewport':width,**geometry})
    assert geometry['overlap']<=0,geometry
    assert geometry['mapBottom']<=geometry['preview']['b']+1,geometry
viewport(600,650)
measure('short-window')
checks.append('seven feature widths and short window; preview/editor never overlap')
viewport(1440)
click('工作流设计')
assert evaluate("document.querySelector('[role=tab][aria-selected=true]').textContent")=='要素设计'
click('放弃草稿');tab('工作流设计')
b.wait("document.querySelector('select[aria-label=\"已保存工作流\"]')!==null")
select('已保存工作流','v3-rod_road');click('读取')
b.wait("document.querySelector('.cm-workflow-control')!==null")
show('.cm-workflow-form','workflow-pages-1440.png')
repeat="[...document.querySelectorAll('.cm-workflow-control')].find(e=>[...e.querySelectorAll('input')].some(i=>i.value==='P'))"
evaluate(f"{repeat}.querySelector('details').open=true")
evaluate(f"{repeat}.scrollIntoView({{block:'start'}})")
b.screenshot('workflow-repeat-1440.png')
assert evaluate("[...document.querySelectorAll('.cm-group-field > header')].some(e=>e.textContent.includes('mode'))&&[...document.querySelectorAll('.cm-group-field > header')].some(e=>e.textContent.includes('tgt'))")
for width in [1920,1440,1280,900,768,600,390]:
    viewport(width)
    evaluate(f"{repeat}.scrollIntoView({{block:'start'}})")
    measure('workflow-repeat')
    if width in [900,600,390]:b.screenshot(f'workflow-repeat-{width}.png')
viewport(1440)
show('.cm-drawing-settings','workflow-drawing-1440.png')
show('.cm-expression-editor','workflow-expression-1440.png')
formula=evaluate("(()=>{const e=document.querySelector('.cm-expression-editor'),t=e.querySelector('textarea');return {builderWidth:e.clientWidth,formulaWidth:t.getBoundingClientRect().width}})()")
metrics.append({'phase':'formula-width',**formula})
assert formula['formulaWidth']>=formula['builderWidth']*.9,formula
checks.append('workflow page/control/repeat boundaries and full-width expression editor')

# Layout changes must preserve node identity, focus and calculator history.
evaluate("(()=>{const e=document.querySelector('.cm-workflow-control textarea[placeholder=\"控件标题\"]:not(:disabled)');window.visualTitleNode=e;e.focus();})()")
text_value('.cm-workflow-control textarea[placeholder="控件标题"]:not(:disabled)','视觉验收标题')
assert evaluate("window.visualTitleNode===document.querySelector('.cm-workflow-control textarea[placeholder=\"控件标题\"]:not(:disabled)')&&document.activeElement===window.visualTitleNode")
expression_before=evaluate("document.querySelector('.cm-expression-editor textarea').value")
click('插入固定文本',"document.querySelector('.cm-expression-editor')")
click('撤销',"document.querySelector('.cm-expression-editor')")
assert evaluate("document.querySelector('.cm-expression-editor textarea').value")==expression_before
click('重做',"document.querySelector('.cm-expression-editor')")
click('撤销',"document.querySelector('.cm-expression-editor')")
assert evaluate("document.querySelector('.cm-expression-editor textarea').value")==expression_before
checks.append('input node/focus survive heading updates; calculator undo/redo preserved')

evaluate("document.querySelector('.cm-design-preview').open=true")
b.wait("document.querySelector('.cm-runtime-surface input')!==null")
runtime=evaluate("""(()=>{const root=document.querySelector('main'),nodes=[...document.querySelector('.cm-runtime-surface').querySelectorAll('h2,h3,label,input,select,textarea,button')],props=['fontSize','fontWeight','lineHeight','minHeight','paddingTop','paddingBottom','display'];const read=()=>nodes.map(e=>{const s=getComputedStyle(e);return Object.fromEntries(props.map(p=>[p,s[p]]))});const styled=read();root.classList.remove('cm-editor-design');const original=read();root.classList.add('cm-editor-design');return {count:nodes.length,differences:styled.flatMap((s,i)=>JSON.stringify(s)===JSON.stringify(original[i])?[]:[{tag:nodes[i].tagName,styled:s,original:original[i]}])}})()""")
metrics.append({'phase':'embedded-runtime-style',**runtime})
assert not runtime['differences'],runtime
checks.append('embedded runtime form typography and control styles unchanged')
evaluate("(()=>{const e=document.querySelector('.cm-workflow-control [data-module-help]');e.scrollIntoView({block:'center'});e.focus()})()")
b.call('Input.dispatchKeyEvent',{'type':'keyDown','key':'Enter','code':'Enter'})
b.call('Input.dispatchKeyEvent',{'type':'keyUp','key':'Enter','code':'Enter'})
b.wait("document.querySelector('[role=tooltip]')!==null")
b.call('Input.dispatchKeyEvent',{'type':'keyDown','key':'Escape','code':'Escape'})
b.call('Input.dispatchKeyEvent',{'type':'keyUp','key':'Escape','code':'Escape'})
b.wait("document.querySelector('[role=tooltip]')===null")
checks.append('diamond help keyboard open and Escape close')
assert snapshot()==base
click('放弃草稿');click('新建')
b.wait("document.querySelector('[role=dialog]')!==null")
for width in [1440,600,390]:
    viewport(width)
    dialog=evaluate("(()=>{const d=document.querySelector('[role=dialog]');return {client:d.clientWidth,scroll:d.scrollWidth,visible:!!d.querySelector('input[aria-label=\"新工作流 ID\"]')}})()")
    assert dialog['client']>=dialog['scroll']-1 and dialog['visible'],dialog
    b.screenshot(f'new-workflow-dialog-{width}.png')
b.call('Input.dispatchKeyEvent',{'type':'keyDown','key':'Escape','code':'Escape'})
b.call('Input.dispatchKeyEvent',{'type':'keyUp','key':'Escape','code':'Escape'})
time.sleep(.15)
if evaluate("document.querySelector('[role=dialog]')!==null"):
    b.call('Input.dispatchKeyEvent',{'type':'keyDown','key':'Escape','code':'Escape'})
    b.call('Input.dispatchKeyEvent',{'type':'keyUp','key':'Escape','code':'Escape'})
b.wait("document.querySelector('[role=dialog]')===null")
checks.append('new workflow dialog fits three widths and preserves Escape close')

# Browser-zoom equivalent CSS viewport coverage, separate from native zoom.
tab('要素设计');feature('ROD')
for factor in [1,1.25,1.5,2]:
    viewport(round(1440/factor),round(1000/factor),factor)
    measure('zoom-equivalent-'+str(factor))
assert snapshot()==base
checks.append('100/125/150/200 percent equivalent CSS viewports; active config unchanged')
viewport(1440)
click('放弃草稿');tab('工作流设计')
for flow in ['v3-tpp_teleport','external-railway-integrated','external-trp-integrated']:
    # Use the current registry's TRP ID, keeping the audit independent of captions.
    if flow=='external-trp-integrated':
        flow=evaluate("[...document.querySelector('select[aria-label=\"已保存工作流\"]').options].find(o=>/external.*trp/.test(o.value))?.value")
        if not flow: continue
    select('已保存工作流',flow);click('读取')
    b.wait("document.querySelector('[aria-label=\"工作流用途与编辑\"]')!==null")
    target='.cm-auxiliary-definition' if flow=='v3-tpp_teleport' else '[aria-label="工作流用途与编辑"]'
    show(target,f'workflow-{flow}-1440.png')
    for width in [1440,600,390]:
        viewport(width);measure('workflow-'+flow)
    click('放弃草稿');viewport(1440)
assert snapshot()==base
checks.append('TPP extra drawing and registered external workflow settings fit narrow panels')
result={'checks':checks,'metrics':metrics,'activeConfigSha256':base,'runtimeErrors':b.errors,'nativeBrowserZoom':False,'zoomMethod':'physical 1440x1000 / factor CSS viewport, device scale factor=factor'}
assert not b.errors,b.errors
(OUT/'editor-visual-browser-result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'checks':checks,'measurementCount':len(metrics),'runtimeErrors':len(b.errors)},ensure_ascii=False))
