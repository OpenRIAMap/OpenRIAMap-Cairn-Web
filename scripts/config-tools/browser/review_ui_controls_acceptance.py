"""Production review UI with delayed local ports; never calls a remote publisher."""
import json
import time
from browser_check import APP_URL, OUT, Browser

assert APP_URL.startswith('http://127.0.0.1:')
b=Browser()
b.call('Page.bringToFront')
b.call('Emulation.setFocusEmulationEnabled',{'enabled':True})
checks=[]

def click_selector(selector):
    q='document.querySelector('+json.dumps(selector)+')'
    b.wait('Boolean('+q+')')
    rect=b.evaluate('(()=>{const e='+q+';e.scrollIntoView({block:"center"});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()')
    for typ,extra in [('mouseMoved',{}),('mousePressed',{'button':'left','buttons':1,'clickCount':1}),('mouseReleased',{'button':'left','buttons':0,'clickCount':1})]:
        b.call('Input.dispatchMouseEvent',{'type':typ,**rect,**extra})

publish="[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='发布')"
card0='[data-review-package="submission-0"]'
card1='[data-review-package="submission-1"]'
box0=card0+' input[type=checkbox]'
close='[data-panel-id="review-package-detail"] button[title="关闭"]'

try:
    b.call('Page.navigate',{'url':APP_URL+'/scripts/browser/fixtures/review-ui-controls.html'})
    b.wait("!!document.querySelector('[data-review-package]')")
    b.click('深色情景')
    b.click('全选可发布包')
    b.click('发布前检查')
    b.wait("document.body.innerText.includes('发布前检查报告')")
    click_selector(box0)
    b.wait("document.body.innerText.includes('当前选择或状态版本已变化')")
    b.wait("document.body.innerText.includes('LOCAL_799')",30)
    assert b.evaluate(publish+'.disabled')
    calls=json.loads(b.evaluate("document.querySelector('#fixture-calls').textContent"))
    assert calls['unique']==1 and len(calls['calls'])==3,calls
    assert all(len(call['ids'])==18 for call in calls['calls']),calls
    checks.append('checkbox change preserves original polling, immutable request and 800-item report')
    b.click('全选可发布包')
    b.wait('!'+publish+'.disabled')
    assert json.loads(b.evaluate("document.querySelector('#fixture-calls').textContent"))==calls
    checks.append('restoring identical scope reuses completed report without another request')

    region='[aria-label="发布前检查报告明细"]'
    metrics=b.evaluate('(()=>{const e=document.querySelector('+json.dumps(region)+');e.scrollIntoView({block:"center"});const r=e.getBoundingClientRect();return {height:e.clientHeight,content:e.scrollHeight,x:r.x+25,y:r.y+100,outer:document.querySelector(".cm-workspace-panel-list").scrollTop};})()')
    assert 0<metrics['height']<=450 and metrics['content']>metrics['height'],metrics
    b.call('Input.dispatchMouseEvent',{'type':'mouseWheel','x':metrics['x'],'y':metrics['y'],'deltaX':0,'deltaY':600})
    b.wait('document.querySelector('+json.dumps(region)+').scrollTop>0')
    assert b.evaluate('document.querySelector(".cm-workspace-panel-list").scrollTop')==metrics['outer']
    scroll=b.evaluate('document.querySelector('+json.dumps(region)+').scrollTop')
    click_selector(box0)
    assert b.evaluate('document.querySelector('+json.dumps(region)+').scrollTop')==scroll
    b.screenshot('review-bounded-report-dark.png')
    checks.append('real wheel scrolls bounded report and unrelated checkbox updates preserve its scroll')

    click_selector(card0)
    b.wait('document.querySelector('+json.dumps(card0)+').getAttribute("aria-current")==="true"')
    click_selector(card1+' input[type=checkbox]')
    assert b.evaluate('document.querySelector('+json.dumps(card0)+').getAttribute("aria-current")==="true"')
    click_selector(card1)
    b.wait('document.querySelector('+json.dumps(card1)+').getAttribute("aria-current")==="true"')
    assert b.evaluate('document.querySelectorAll("[data-review-package][aria-current=true]").length')==1
    b.screenshot('review-current-detail-dark.png')
    click_selector(close)
    b.wait('!document.querySelector("[data-review-package][aria-current=true]")')
    click_selector(card0)
    b.click('切换工作区绑定')
    click_selector(card1)
    assert b.evaluate('document.querySelector('+json.dumps(card0)+').getAttribute("aria-current")==="true"')
    click_selector(close)
    assert b.evaluate('document.querySelector('+json.dumps(card0)+').getAttribute("aria-current")==="true"')
    b.click('切换允许关闭')
    click_selector(close)
    b.wait('!document.querySelector("[data-review-package][aria-current=true]")')
    checks.append('detail marker follows actual open/switch/close and preserves blocked switch or cancelled close')

    b.click('更新状态板版本')
    b.wait('document.body.innerText.includes("当前选择或状态版本已变化")')
    assert b.evaluate(publish+'.disabled')
    checks.append('board version changes preserve report while invalidating publishing')

    b.call('Page.navigate',{'url':APP_URL+'/scripts/browser/fixtures/review-ui-controls.html?scenario=retry'})
    b.wait('!!document.querySelector("[data-review-package]")')
    b.click('全选可发布包');b.click('发布前检查')
    b.wait('document.body.innerText.includes("fixture-network-interrupted")')
    b.click('发布前检查')
    b.wait('document.body.innerText.includes("LOCAL_799")',30)
    retried=json.loads(b.evaluate("document.querySelector('#fixture-calls').textContent"))
    assert retried['unique']==1 and len(retried['calls'])==3,retried
    checks.append('retry after network interruption uses original idempotency identity')

    b.call('Page.navigate',{'url':APP_URL+'/scripts/browser/fixtures/review-ui-controls.html?scenario=resume'})
    b.wait('!!document.querySelector("[data-review-package]")')
    b.click('全选可发布包');b.click('发布前检查')
    b.wait('document.body.innerText.includes("发布前检查报告")')
    click_selector('[data-panel-id="review-status-board"] button[title="关闭"]')
    b.wait('!document.querySelector("[data-panel-id=review-status-board]")')
    b.click('重开面板')
    b.wait('!!document.querySelector("[data-review-package]")')
    b.click('全选可发布包');b.click('发布前检查')
    b.wait('document.body.innerText.includes("LOCAL_799")',30)
    resumed=json.loads(b.evaluate("document.querySelector('#fixture-calls').textContent"))
    assert resumed['unique']==1 and len(resumed['calls'])==3,resumed
    checks.append('closing and reopening resumes the same task with no duplicate identity')

    b.click('发布前检查')
    b.wait('document.body.innerText.includes("发布前检查报告")')
    before_identity=json.loads(b.evaluate("document.querySelector('#fixture-calls').textContent"))
    b.click('切换测试身份')
    b.wait('!document.querySelector("[data-review-precheck-scope]")')
    time.sleep(1.5)
    assert json.loads(b.evaluate("document.querySelector('#fixture-calls').textContent"))==before_identity
    assert not b.evaluate('document.body.innerText.includes("发布前检查报告")')
    assert b.evaluate(publish+'.disabled')
    checks.append('identity change stops old polling and removes the old actor report and permission')
    assert not b.errors,b.errors
    (OUT/'review-ui-controls-result.json').write_text(json.dumps({'success':True,'checks':checks,'calls':calls,'retry':retried,'runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(checks,ensure_ascii=False),flush=True)
except Exception as error:
    b.screenshot('review-ui-controls-failure.png')
    (OUT/'review-ui-controls-result.json').write_text(json.dumps({'success':False,'checks':checks,'error':str(error),'text':b.evaluate('document.body.innerText.slice(-5000)'),'runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8')
    raise
