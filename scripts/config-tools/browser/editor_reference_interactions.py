"""Exercise existing prefill/binding controls under the new authoring styles."""
import json
import time
from browser_check import Browser, APP_URL, OUT

b=Browser()
def click(text,scope='document'):
    b.evaluate(f"[...{scope}.querySelectorAll('button')].find(e=>e.textContent.trim()==={json.dumps(text)}&&!e.disabled).click()")
    time.sleep(.15)
def select(label,value):
    b.evaluate(f"(()=>{{const e=[...document.querySelectorAll('select')].find(e=>e.getAttribute('aria-label')==={json.dumps(label)});Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(e,{json.dumps(value)});e.dispatchEvent(new Event('change',{{bubbles:true}}));}})()")
    time.sleep(.15)

b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/subject-ui-acceptance.html?mode=reuse&resources=1'})
time.sleep(.5)
b.wait('!!window.reuseAcceptance')
b.evaluate("document.querySelector('#reuse-harness').classList.add('cm-editor-design','cm-authoring-pane')")
scope="document.querySelector('section[aria-label=\"下拉对照验收\"]')"
click('绑定',scope)
b.wait("document.querySelector('[role=dialog]')!==null")
select('对照来源表格','road-travel-modes')
click('绑定表格',"document.querySelector('[role=dialog]')")
assert b.evaluate("window.reuseAcceptance.control.optionsTableId==='road-travel-modes'")
assert b.evaluate(f"[...{scope}.querySelectorAll('[data-value-option] input')].every(e=>e.disabled)")
click('更新来源验收')
assert b.evaluate(f"[...{scope}.querySelectorAll('input')].some(e=>e.value==='更新后步行')")
click('解除对照绑定',scope)
assert b.evaluate("!window.reuseAcceptance.control.optionsTableId&&window.reuseAcceptance.control.optionTable.rows[0].label.zh==='更新后步行'")
assert b.evaluate(f"[...{scope}.querySelectorAll('[data-value-option] input')].every(e=>!e.disabled)")
click('绑定字段设计',"document.querySelector('.cm-card-item')")
b.wait("document.querySelector('[role=dialog]')!==null")
select('绑定字段','SharedTest')
click('确认绑定',"document.querySelector('[role=dialog]')")
assert b.evaluate("!!window.reuseAcceptance.config.nodes.find(n=>n.path.class==='BUD'&&!n.path.kind).card.items[0].fieldBinding")
assert b.evaluate("(()=>{const e=[...document.querySelectorAll('.cm-card-item label')].find(e=>e.textContent.startsWith('显示字段'));return e.querySelector('input').disabled})()")
for width in [1440,600,390]:
    b.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':1000,'deviceScaleFactor':1,'mobile':False})
    b.evaluate("document.querySelector('.cm-card-item').scrollIntoView({block:'start'})")
    time.sleep(.1)
    assert b.evaluate('document.documentElement.scrollWidth<=innerWidth')
    b.screenshot(f'bound-card-{width}.png')
click('解除字段绑定',"document.querySelector('.cm-card-item')")
assert b.evaluate("!window.reuseAcceptance.config.nodes.find(n=>n.path.class==='BUD'&&!n.path.kind).card.items[0].fieldBinding")
assert b.evaluate("(()=>{const e=[...document.querySelectorAll('.cm-card-item label')].find(e=>e.textContent.startsWith('显示字段'));return !e.querySelector('input').disabled})()")
assert not b.errors,b.errors
result={'checks':['workflow table binding locks option cells','source update is immediately reflected in bound options','detach clones current table and enables independent editing','card field binding locks source/name inputs','bound card fits 1440/600/390 widths','detach field binding re-enables source editing'],'runtimeErrors':b.errors}
(OUT/'editor-reference-browser-result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False))
