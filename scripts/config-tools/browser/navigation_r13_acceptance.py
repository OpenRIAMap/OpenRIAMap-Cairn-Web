"""Real Config Studio interaction checks in an isolated local Edge profile."""
import json
from browser_check import Browser, OUT

b = Browser()
checks = []
b.call('Page.navigate', {'url':'about:blank'})
b.call('Storage.clearDataForOrigin', {'origin':'http://127.0.0.1:5271','storageTypes':'all'})
b.call('Page.navigate', {'url': 'http://127.0.0.1:5271/?workspace=config-studio'})
b.wait('document.body.innerText.length > 30')
if b.evaluate("document.body.innerText.includes('下载并启用')"):
    b.click('下载并启用')
b.wait("document.querySelector('nav[aria-label=\"设计工作区\"]') !== null", 40)
b.evaluate('window.confirm = () => true')
if not b.evaluate("document.body.innerText.includes('放弃整包候选')"):
    b.click('迁移到 r13 草稿')
b.wait("document.body.innerText.includes('整包候选')")
b.click('总体规则')
b.wait("document.querySelector('[data-application-section=navigation]') !== null")

def button(section, label):
    b.evaluate("""(() => {const root=document.querySelector('[data-application-section=%s]');
      const el=[...root.querySelectorAll('button')].find(e=>e.textContent.trim()===%s);if(!el||el.disabled)throw Error('section button unavailable');el.click();})()""" % (section, json.dumps(label)))

button('navigation', '读取/编辑')
b.wait("document.querySelector('[data-navigation-settings-editor]') !== null")
assert b.evaluate("document.querySelectorAll('[data-navigation-settings-editor] > section').length") == 4
assert b.evaluate("[...document.querySelectorAll('[data-navigation-settings-editor] input[type=number]')].map(i=>i.value)") == ['3', '16', '1', '5', '40', '4.317']
assert b.evaluate("[...document.querySelectorAll('[data-navigation-settings-editor] select')].filter(s=>s.value==='teleport-hubs'||s.value==='road-travel-modes').length") == 2
checks.append('four navigation modules, preserved rail parameters, unified speeds and functional-table bindings')
element = b.evaluate("(() => {const el=document.querySelector('[data-navigation-settings-editor] input[type=number]');el.scrollIntoView({block:'center'});return true;})()")
b.screenshot('navigation-editor.png')

# Native input event: clear required speed, verify; restore and stage section.
def speed(value):
    b.evaluate("""(() => {const el=document.querySelector('[data-navigation-settings-editor] input[type=number]');
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,%s);el.dispatchEvent(new Event('input',{bubbles:true}));})()""" % json.dumps(value))
speed('0')
button('navigation', '核验')
b.wait("document.querySelector('[data-application-section=navigation] [role=alert]') !== null")
checks.append('invalid speed blocks section validation')
speed('3')
button('navigation', '核验')
b.wait("document.querySelector('[data-application-section=navigation]').innerText.includes('核验通过')")
button('navigation', '保存')
b.wait("document.querySelector('[data-navigation-settings-editor]') === null")
button('preferences', '读取/编辑')
b.wait("document.querySelector('[aria-label=\"共享铁路角色定义\"]') !== null")
assert b.evaluate("document.querySelector('[aria-label=\"共享铁路角色定义\"]').innerText.includes('供全站')||document.querySelector('[aria-label=\"共享铁路角色定义\"]').innerText.includes('线路要素指定')")
b.evaluate("document.querySelector('[aria-label=\"共享铁路角色定义\"]').scrollIntoView({block:'start'})")
b.screenshot('shared-railway-roles.png')
button('preferences', '放弃草稿')
checks.append('shared role definition has independent preference lifecycle, candidate permits switching areas')
b.click('要素设计')
b.click('预留对照表格')
assert b.evaluate("[...document.querySelectorAll('[data-lookup-tables] > details')].every(t=>!t.open)")
b.click('添加对照')
b.wait("document.querySelector('[data-lookup-tables] > details[id^=lookup-table-table-]') !== null")
assert b.evaluate("document.querySelector('[data-lookup-tables] > details[id^=lookup-table-table-]').open")
checks.append('existing tables initially collapsed; new table opens independently')
b.click('核验表格')
b.wait("document.querySelector('[aria-label=\"对照表核验报告\"]') !== null")
assert b.evaluate("document.querySelector('[data-lookup-tables]').open")
b.click('放弃表格草稿')
b.wait("!document.querySelector('[data-lookup-tables] > details[id^=lookup-table-table-]')")
checks.append('table validation locates errors; discard preserves original tables')
b.evaluate("document.querySelector('[data-lookup-tables]').scrollIntoView({block:'start'})")
b.screenshot('lookup-tables-collapsed.png')
assert not b.errors, b.errors
result = {'checks': checks, 'runtime_errors': b.errors, 'productionChanged': False, 'businessActionsExercised': False}
(OUT / 'navigation-browser-result.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(result, ensure_ascii=False))
