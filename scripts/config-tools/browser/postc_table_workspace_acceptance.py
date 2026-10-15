import json, os, time
from pathlib import Path
from browser_check import Browser, APP_URL

b = Browser()
checks = []
b.call('Page.navigate', {'url': APP_URL + '/scripts/config-tools/subject-ui-acceptance.html?mode=general'})
b.wait("document.querySelector('[data-application-section=worlds]')!==null")
b.evaluate('window.applicationAcceptance.restoreDefault()')
origin = b.evaluate('performance.timeOrigin')
b.call('Page.reload')
b.wait('performance.timeOrigin!=='+str(origin)+"&&document.querySelector('[data-application-section=worlds]')!==null")
assert b.evaluate("[...document.querySelectorAll('[role=tab]')].every(e=>!e.className.includes('[object')&&getComputedStyle(e).backgroundColor!=='rgba(0, 0, 0, 0)')")
checks.append('all three tabs have real background styles while general workspace is active')
b.click('要素设计')
scope = 'section[aria-label="对照表独立编辑区域"]'
b.wait('document.querySelector('+json.dumps(scope)+')!==null')
b.click('预留对照表格')
count = b.evaluate('document.querySelectorAll('+json.dumps(scope+' .cm-field-card')+').length')
b.click('添加对照')
b.wait('document.querySelectorAll('+json.dumps(scope+' .cm-field-card')+').length==='+str(count+1))
assert b.evaluate("[...document.querySelectorAll('button')].find(e=>e.textContent==='保存表格').disabled===false")
b.evaluate("(()=>{const rows=document.querySelectorAll("+json.dumps(scope+' .cm-field-card')+");[...rows[rows.length-1].querySelectorAll('button')].find(e=>e.textContent==='删除表格').click();})()")
b.wait("[...document.querySelectorAll('button')].find(e=>e.textContent==='保存表格').disabled")
b.click('工作流设计')
assert b.evaluate("document.querySelector('[role=tab][aria-selected=true]').textContent") == '工作流设计'
b.click('要素设计')
checks.append('add then delete clears table draft and permits switching tabs')

def edit_name(value):
    b.evaluate("(()=>{const e=document.querySelector("+json.dumps(scope+' details article label input')+");Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,"+json.dumps(value)+");e.dispatchEvent(new Event('input',{bubbles:true}));})()")
    time.sleep(.2)

edit_name('独立表格保存验收')
b.click('工作流设计')
assert b.evaluate("document.querySelector('[role=tab][aria-selected=true]').textContent") == '要素设计'
b.click('核验表格')
b.click('保存表格')
b.wait("window.applicationAcceptance.snapshot().lookupTables[0].label.zh==='独立表格保存验收'")
b.wait("[...document.querySelectorAll('button')].find(e=>e.textContent==='保存表格').disabled")
checks.append('table draft blocks tab switch; region validation/save commits and ends only the table draft')
edit_name('等待恢复的表格草稿')
time.sleep(.6)
origin = b.evaluate('performance.timeOrigin')
b.call('Page.reload')
b.wait('performance.timeOrigin!=='+str(origin)+'&&document.querySelector('+json.dumps(scope)+')!==null')
assert b.evaluate("document.querySelector('[role=tab][aria-selected=true]').textContent") == '要素设计'
b.evaluate('document.querySelector('+json.dumps(scope+' details')+').open=true')
assert b.evaluate('document.querySelector('+json.dumps(scope+' details article label input')+').value') == '等待恢复的表格草稿'
assert b.evaluate("window.applicationAcceptance.snapshot().lookupTables[0].label.zh") == '独立表格保存验收'
b.click('放弃表格草稿')
assert b.evaluate('document.querySelector('+json.dumps(scope+' details article label input')+').value') == '独立表格保存验收'
checks.append('reload returns to the owner of the recovered draft; discard restores last saved table')
for width in [320, 390, 600, 900, 1440]:
    b.call('Emulation.setDeviceMetricsOverride', {'width':width,'height':1000,'deviceScaleFactor':1,'mobile':False})
    assert b.evaluate("(()=>{const s=document.querySelector("+json.dumps(scope)+");const p=s.getBoundingClientRect();return [...s.querySelectorAll('input,select')].every(e=>{const r=e.getBoundingClientRect();return !r.width||r.right<=p.right+1;});})()"), width
checks.append('table inputs stay within the region at 320/390/600/900/1440px')
b.screenshot('postc-table-workspace.png')
assert not b.errors, b.errors
out=Path(os.environ['CAIRNMAP_ACCEPTANCE_OUT']);out.mkdir(parents=True,exist_ok=True)
(out/'postc-table-workspace.json').write_text(json.dumps({'checks':checks,'runtime_errors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(checks,ensure_ascii=False))
b.evaluate('window.applicationAcceptance.restoreDefault()')
b.ws.close()
