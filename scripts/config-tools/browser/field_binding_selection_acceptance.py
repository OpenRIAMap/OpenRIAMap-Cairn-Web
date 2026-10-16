"""Check real listbox clicks after search, plus binding-specific UI copy."""
import json
import time
from browser_check import Browser, APP_URL, OUT

b = Browser()
checks = []
top = "[...document.querySelectorAll('[role=dialog]')].at(-1)"
workflow = "document.querySelector('section[aria-label=\"下拉对照验收\"]')"
card = "document.querySelector('.cm-card-item')"

def click(text, scope='document'):
    b.evaluate(f"[...({scope}).querySelectorAll('button')].find(e=>e.textContent.trim()==={json.dumps(text)}&&!e.disabled).click()")
    time.sleep(.12)

def set_value(label, value):
    b.evaluate(f"(()=>{{const e=[...({top}).querySelectorAll('input,select')].find(e=>e.getAttribute('aria-label')==={json.dumps(label)});const p=e.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(p,'value').set.call(e,{json.dumps(value)});e.dispatchEvent(new Event(e.tagName==='SELECT'?'change':'input',{{bubbles:true}}));}})()")
    time.sleep(.12)

def click_option(key):
    # Dispatch actual pointer input. Setting .value then firing change would
    # conceal the native auto-highlight bug reported by the user.
    rect = b.evaluate(f"(()=>{{const s=({top}).querySelector('select[size]'),o=[...s.options].find(e=>e.value==={json.dumps(key)});o.scrollIntoView({{block:'center'}});const r=o.getBoundingClientRect();return {{x:r.x+r.width/2,y:r.y+r.height/2}};}})()")
    for event in ['mousePressed', 'mouseReleased']:
        b.call('Input.dispatchMouseEvent', {'type':event,'button':'left','clickCount':1,**rect})
    time.sleep(.15)

def expect_binding_title(title):
    assert b.evaluate(f"({top}).getAttribute('aria-label')") == title
    assert not b.evaluate(f"({top}).innerText.includes('预填')")

def expect_unselected():
    assert b.evaluate(f"({top}).querySelector('select[size]').value===''" )
    assert b.evaluate(f"[...({top}).querySelectorAll('button')].find(e=>e.textContent.trim()==='确认绑定').disabled")

b.call('Page.navigate', {'url':APP_URL+'/scripts/config-tools/subject-ui-acceptance.html?mode=reuse&resources=1'})
time.sleep(.6)
b.wait('!!window.reuseAcceptance')
b.evaluate("document.querySelector('#reuse-harness').classList.add('cm-editor-design','cm-authoring-pane')")
snapshot = b.evaluate('JSON.stringify(window.reuseAcceptance)')
click('绑定', workflow)
set_value('对照来源表格', 'road-travel-modes')
styles = b.evaluate(f"(()=>{{const buttons=[...({top}).querySelectorAll('button')],a=buttons.find(e=>e.textContent==='绑定表格'),c=buttons.find(e=>e.textContent==='绑定字段对照表');return {{confirm:getComputedStyle(a).backgroundColor,launcher:getComputedStyle(c).backgroundColor}}}})()")
assert styles['confirm'] != styles['launcher']
for width in [390,1440]:
    b.call('Emulation.setDeviceMetricsOverride', {'width':width,'height':1000,'deviceScaleFactor':1,'mobile':False})
    assert b.evaluate(f"({top}).scrollWidth<=({top}).clientWidth")
    b.screenshot(f'bind-source-actions-{width}.png')
click('绑定字段对照表', top)
expect_binding_title('绑定字段对照表')
set_value('绑定来源 Class', 'RLE')
set_value('绑定字段搜索', 'directi')
expect_unselected()
click_option('direction')
assert b.evaluate(f"![...({top}).querySelectorAll('button')].find(e=>e.textContent.trim()==='确认绑定').disabled")
assert b.evaluate(f"({top}).innerText.includes('3 → 展示线')")
b.screenshot('workflow-searched-direction-enabled.png')
assert b.evaluate('JSON.stringify(window.reuseAcceptance)') == snapshot
click('确认绑定', top)
assert b.evaluate("window.reuseAcceptance.control.optionsFieldRef?.fieldId===window.reuseAcceptance.config.nodes.find(n=>n.path.class==='RLE'&&!n.path.kind).fields.find(f=>f.key==='direction').fieldId")
checks.append('workflow: one searched direction result responds to a real click and binds the original field reference')
click('解除对照绑定', workflow)

click('绑定', card)
click('绑定字段对照表', top)
set_value('绑定字段搜索', 'SharedTest')
expect_unselected()
click_option('SharedTest')
click('确认绑定', top)
assert b.evaluate("window.reuseAcceptance.config.nodes.find(n=>n.path.class==='BUD'&&!n.path.kind).card.items[0].optionsFieldRef?.fieldId==='reuse-source'")
click('解除对照绑定', card)
checks.append('information card dictionary binding also accepts a single searched result')

click('绑定字段设计', card)
expect_binding_title('绑定字段设计')
set_value('绑定字段搜索', 'SharedTest')
expect_unselected()
click_option('SharedTest')
# Filtering away the selection must never leave a different field looking selected.
set_value('绑定字段搜索', 'Name')
expect_unselected()
set_value('绑定字段搜索', 'no-such-field')
expect_unselected()
set_value('绑定字段搜索', 'SharedTest')
assert b.evaluate(f"({top}).querySelector('select[size]').value==='SharedTest'")
click('确认绑定', top)
assert b.evaluate("window.reuseAcceptance.config.nodes.find(n=>n.path.class==='BUD'&&!n.path.kind).card.items[0].fieldBinding?.fieldId==='reuse-source'")
click('解除字段绑定', card)
click('解除对照绑定', card)
checks.append('field-design binding has accurate copy; changed/no-match queries cannot confirm a phantom selection')

click('预填', card)
assert b.evaluate(f"({top}).getAttribute('aria-label')==='字段预填'")
set_value('预填字段搜索', 'SharedTest')
assert b.evaluate(f"({top}).querySelector('select[size]').value===''")
click_option('SharedTest')
assert b.evaluate(f"({top}).innerText.includes('导入只预填当前模块，不建立来源关系')")
click('导入预填', top)
assert b.evaluate("!window.reuseAcceptance.config.nodes.find(n=>n.path.class==='BUD'&&!n.path.kind).card.items[0].fieldBinding")
checks.append('ordinary prefill still imports an independent copy using its original labels and callback')

click('绑定字段设计', card)
set_value('绑定字段搜索', '')
expect_unselected()
click_option('ID')
assert b.evaluate(f"![...({top}).querySelectorAll('button')].find(e=>e.textContent.trim()==='确认绑定').disabled")
click('关闭', top)
assert b.evaluate("document.querySelectorAll('[role=dialog]').length===0 && document.querySelectorAll('[inert]').length===0")
checks.append('first unfiltered field remains selectable; closing still exits without applying')
assert not b.errors,b.errors
result = {'checks':checks,'actionStyles':styles,'runtimeErrors':b.errors}
(OUT/'field-binding-selection-result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False))
