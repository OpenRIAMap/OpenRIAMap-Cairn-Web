import json
import time
from browser_check import Browser, OUT, APP_URL

b=Browser()
b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/browser/navigation-runtime.html'})
b.wait('window.navigationAcceptance!==undefined')
b.wait("[...document.querySelectorAll('button')].some(e=>e.title==='图上选取起点')")
for title,x in [('图上选取起点',0),('图上选取终点',100)]:
    b.evaluate("[...document.querySelectorAll('button')].find(e=>e.title===%s).click()"%json.dumps(title))
    b.evaluate("window.dispatchEvent(new CustomEvent('ria:mapClickWorldPoint',{detail:{worldId:'zth',point:{x:%d,y:64,z:0}}}))"%x)
b.wait("[...document.querySelectorAll('button')].some(e=>e.textContent.trim()==='搜索'&&!e.disabled)")
b.evaluate('navigationAcceptance.pause()')
b.click('搜索')
b.evaluate('navigationAcceptance.disable()')
b.wait("![...document.querySelectorAll('button')].some(e=>e.textContent.trim()==='铁路（新）')")
time.sleep(3.3)
assert not b.evaluate("document.body.innerText.includes('正在计算最短路径')")
b.evaluate('navigationAcceptance.resume()')
time.sleep(1)
assert b.evaluate('navigationAcceptance.highlights.every(h=>Array.isArray(h)&&h.length===0)')
checks=['disabling the current mode removes its entry, clears highlights and rejects the delayed calculation result']
b.evaluate('navigationAcceptance.rename()')
b.click('定制道路')
b.click('搜索')
b.wait("[...document.querySelectorAll('button')].some(e=>e.textContent.trim()==='搜索'&&!e.disabled)")
b.wait('navigationAcceptance.highlights.some(h=>!Array.isArray(h)&&h.styledSegments?.length>0)')
assert b.evaluate("document.body.innerText.split('定制道路').length-1")>=2
checks.append('actual road plan renders with configured mode/result names and valid highlights')
b.screenshot('navigation-panel-result.png')
assert not b.errors,b.errors
result={'checks':checks,'runtime_errors':b.errors,'externalBusinessActions':False}
(OUT/'navigation-panel-result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False))
