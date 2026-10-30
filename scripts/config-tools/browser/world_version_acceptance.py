"""Exercise the real maintainer modal with isolated service ports; never production."""
import json
from browser_check import Browser, APP_URL, OUT
assert APP_URL.startswith('http://127.0.0.1:')
b = Browser()
checks = []
def fill(tag, label, value):
    b.evaluate("(()=>{const e=document.querySelector("+json.dumps(tag+'[aria-label="'+label+'"]')+");Object.getOwnPropertyDescriptor("+('HTMLTextAreaElement' if tag=='textarea' else 'HTMLInputElement')+".prototype,'value').set.call(e,"+json.dumps(value)+");e.dispatchEvent(new Event('input',{bubbles:true}));})()")
for scenario in ['viewer', 'adjust', 'occupied', 'initialize']:
    b.call('Page.navigate', {'url': APP_URL+'/scripts/browser/fixtures/world-version.html?scenario='+scenario})
    b.wait('Boolean(window.worldVersionFixture)', 40)
    assert b.evaluate('window.worldVersionFixture.calls.length') == 0
    if scenario == 'viewer':
        assert not b.evaluate("[...document.querySelectorAll('button')].some(e=>e.textContent.includes('调拨当前版本'))")
        checks.append('viewer has no operation; mounting does not call SCF')
        continue
    b.click('调拨当前版本')
    b.wait("Boolean(document.querySelector('[aria-label=\"世界版本管理\"]'))")
    fill('textarea','调整原因','首次采集世界编号修正，保留审计')
    b.click('预检')
    if scenario == 'occupied':
        b.wait("document.body.innerText.includes('已被本世界占用')")
        assert b.evaluate("[...document.querySelectorAll('button')].find(e=>e.textContent==='确认执行').disabled")
        checks.append('occupied target blocks confirmation with specific reason')
        continue
    b.wait("[...document.querySelectorAll('button')].some(e=>e.textContent==='确认执行'&&!e.disabled)")
    if scenario == 'adjust':
        fill('input','目标世界版本','2')
        assert b.evaluate("[...document.querySelectorAll('button')].find(e=>e.textContent==='确认执行').disabled")
        fill('input','目标世界版本','1');b.click('预检')
        b.wait("[...document.querySelectorAll('button')].some(e=>e.textContent==='确认执行'&&!e.disabled)")
    b.click('确认执行')
    b.wait("document.body.innerText.includes('确认调拨世界版本')||document.body.innerText.includes('确认初始化世界版本')")
    b.evaluate("[...document.querySelectorAll('button')].filter(e=>e.textContent==='确认执行'&&!e.disabled).at(-1).click()")
    b.wait("document.body.innerText.includes('已排队')")
    b.click('查询进度')
    b.wait("document.body.innerText.includes('任务已完成')")
    assert b.evaluate('window.worldVersionFixture.changed') == 1
    assert b.evaluate('window.worldVersionFixture.version') == (24 if scenario=='initialize' else 1)
    b.screenshot('world-version-'+scenario+'.png')
    checks.append(scenario+': explicit preview, confirmation, progress and identity refresh')
assert not b.errors, b.errors
(OUT/'world-version-result.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(checks,ensure_ascii=False))
