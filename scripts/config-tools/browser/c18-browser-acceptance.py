"""Real DOM inputs/blur/click/drag and actual shared React components in Edge."""
import json,time
from browser_check import Browser,APP_URL,OUT

b=Browser();checks=[]
def record(name):
    checks.append(name)
    (OUT/'c18-browser-components.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf8')
def click(selector):
    rect=b.evaluate("(()=>{const e=document.querySelector("+json.dumps(selector)+");e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()")
    for event in ['mousePressed','mouseReleased']:b.call('Input.dispatchMouseEvent',{'type':event,'button':'left','clickCount':1,**rect})
    time.sleep(.12)
def fill(selector,text):
    click(selector)
    b.call('Input.dispatchKeyEvent',{'type':'keyDown','key':'a','code':'KeyA','modifiers':2,'windowsVirtualKeyCode':65})
    b.call('Input.dispatchKeyEvent',{'type':'keyUp','key':'a','code':'KeyA','modifiers':2,'windowsVirtualKeyCode':65})
    b.call('Input.insertText',{'text':text})

b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/browser/c18-harness.html'})
b.wait('window.__c18?.ready===true')
b.evaluate('window.__c18.showInputs()');b.wait('!!document.querySelector("[aria-label=buffered-text]")')
click('[aria-label=buffered-text]')
initial=b.evaluate('window.__c18.commits')
for character in 'ABCDEFGHIJKLMNOPQRST':b.call('Input.insertText',{'text':character})
assert b.evaluate('window.__c18.state.text')==''
assert b.evaluate('window.__c18.commits')==initial
click('[aria-label=buffered-json]')
assert b.evaluate('window.__c18.state.text')=='ABCDEFGHIJKLMNOPQRST'
record('A18: twenty native input events cause zero configuration commits; blur commits once')
fill('[aria-label=buffered-json]','{invalid')
b.click('保存验收')
assert b.evaluate('window.__c18.state.saves')==0
assert b.evaluate('Object.values(window.__c18.buffers()).includes("{invalid")')
fill('[aria-label=buffered-json]','{"ok":1}')
b.click('保存验收')
assert b.evaluate('window.__c18.state.saves')==1
assert b.evaluate('window.__c18.state.json')=='{"ok":1}'
record('A18: invalid JSON retained and blocks action; repaired final text is saved by direct click')
b.screenshot('c18-input-buffer-real.png')

fill('[aria-label="富文本验收 正文"]','Style and safe link')
b.evaluate("(()=>{const e=document.querySelector('[aria-label=\"富文本验收 正文\"]');const r=document.createRange();r.selectNodeContents(e);const s=getSelection();s.removeAllRanges();s.addRange(r);e.dispatchEvent(new MouseEvent('mouseup',{bubbles:true}));})()")
b.click('粗体');b.click('斜体');b.click('下划线')
assert b.evaluate('window.__c18.state.rich.paragraphs[0].runs.some(run=>run.bold&&run.italic&&run.underline)')
b.click('普通文本')
assert not b.evaluate('window.__c18.state.rich.paragraphs[0].runs.some(run=>run.bold||run.italic||run.underline)')
record('A13: selected rich text formatting persists; normal style removes inherited emphasis')

fill('[aria-label=buffered-number]','1e')
b.click('保存验收')
assert b.evaluate('window.__c18.state.number')==14
assert b.evaluate('Object.values(window.__c18.buffers()).includes("1e")')
fill('[aria-label=buffered-number]','1.25');b.click('保存验收')
assert b.evaluate('window.__c18.state.number')==1.25
record('A18: incomplete numeric exponent remains visible and recoverable; finite decimal repairs and commits')
b.evaluate('window.__c18.showOrder()');b.wait('!!document.querySelector("[data-test-row=a]")')
click('[data-test-row=a] summary');b.wait('document.querySelector("[data-test-row=a] button").disabled')
click('[data-test-row=a] summary');b.wait('!document.querySelector("[data-test-row=a] button").disabled')
b.evaluate("(()=>{const source=document.querySelector('[data-test-row=a] button'),target=document.querySelector('[data-test-row=c]');target.open=true;window.__dragData=new DataTransfer();source.dispatchEvent(new DragEvent('dragstart',{bubbles:true,dataTransfer:window.__dragData}));const r=target.getBoundingClientRect();target.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,clientY:r.top+1,dataTransfer:window.__dragData}));})()")
assert b.evaluate('document.querySelector("[data-test-row=c]").dataset.orderInsert')=='before'
assert not b.evaluate('document.querySelector("[data-test-row=c]").open')
b.screenshot('c18-order-insertion.png')
b.evaluate("document.querySelector('[data-test-row=c]').dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:window.__dragData}))")
assert b.evaluate('window.__c18.order.find(row=>row.id==="a").page')=='two'
assert b.evaluate('document.querySelector("[data-test-row=c]").open')
assert b.evaluate('[...document.querySelectorAll("button")].find(e=>e.getAttribute("aria-label")==="a 上移").disabled')
record('A11: collapsed handle, auto-collapse, insertion marker, cross-page drop, restored expansion, local arrow bounds')
b.evaluate("(()=>{const source=document.querySelector('[data-test-row=b] button');source.dispatchEvent(new DragEvent('dragstart',{bubbles:true,dataTransfer:new DataTransfer()}));source.dispatchEvent(new DragEvent('dragend',{bubbles:true}));})()")
assert b.evaluate('window.__c18.order.find(row=>row.id==="b").page')=='one'
record('A11: cancelled drag leaves original data and expansion unchanged')

now=str(time.time())
items=[{'id':'once-'+now,'title':'单次验收','enabled':True,'mode':'once','content':{'paragraphs':[{'runs':[{'text':'单次正文','bold':True}]}]}}, {'id':'always-'+now,'title':'持续验收','enabled':True,'mode':'always','content':{'paragraphs':[{'runs':[{'text':'持续正文','link':'https://wiki.ria.red/'}]}]}}]
b.evaluate('window.__c18.showNotices('+json.dumps(items)+',false)')
assert not b.evaluate('!!document.querySelector("[data-announcement]")')
b.evaluate('window.__c18.showNotices('+json.dumps(items)+',true)');b.wait('!!document.querySelector("[data-announcement]")')
assert not b.evaluate('!![...document.querySelectorAll("button")].find(e=>e.textContent==="不再提醒")')
b.click('关闭');b.wait('!!document.querySelector("[aria-label=持续验收]")')
b.screenshot('c18-announcement.png');b.click('不再提醒')
b.wait('!document.querySelector("[data-announcement]")')
assert b.evaluate('Object.keys(localStorage).filter(key=>key.includes('+json.dumps(now)+')).length')==2
record('A13: readiness, queued once/always notices, explicit dismiss and durable do-not-remind keys')

b.evaluate('window.__c18.showDiagnostics()');b.wait('document.body.innerText.includes("real-error")')
assert b.evaluate('document.querySelectorAll("details").length')<15
assert b.evaluate('[...document.querySelectorAll("details")].find(e=>e.textContent.includes("real-error")).open')
record('A15: 120 diagnostics grouped and bounded; actual errors remain expanded')
b.screenshot('c18-diagnostics-grouped.png')
assert not b.errors,b.errors
print(json.dumps({'checks':checks,'runtimeErrors':b.errors},ensure_ascii=False))
