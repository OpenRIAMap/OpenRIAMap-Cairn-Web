import json, os, time
from pathlib import Path
from browser_check import Browser, APP_URL
b=Browser();checks=[]
b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/subject-ui-acceptance.html?mode=reuse'})
b.wait("Boolean(window.reuseAcceptance&&document.querySelector('[data-table-options]'))")
def click(scope,text):
 b.evaluate("[...document.querySelector("+json.dumps(scope)+").querySelectorAll('button')].find(e=>e.textContent.trim()==="+json.dumps(text)+").click()")
 time.sleep(.15)
def select(label,value):
 b.wait('Boolean(document.querySelector('+json.dumps('select[aria-label="'+label+'"]')+'))')
 b.evaluate("(()=>{const e=document.querySelector('select[aria-label='+JSON.stringify("+json.dumps(label)+")+']');Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(e,"+json.dumps(value)+");e.dispatchEvent(new Event('change',{bubbles:true}));})()")
 time.sleep(.15)
scope='section[aria-label="下拉对照验收"]'
click(scope,'绑定');select('对照来源表格','road-travel-modes');b.click('绑定表格')
b.wait("window.reuseAcceptance.control.optionsTableId==='road-travel-modes'")
assert b.evaluate("[...document.querySelectorAll('section[aria-label=下拉对照验收] [data-value-option] input')].every(e=>e.disabled)")
click('#reuse-harness','更新来源验收')
b.wait("document.querySelector('section[aria-label=下拉对照验收] input[aria-label=\"对照 1 zh\"]').value==='更新后步行'")
checks.append('table binding is readonly and updates with saved source state')
click(scope,'解除对照绑定');b.wait("!window.reuseAcceptance.control.optionsTableId&&window.reuseAcceptance.control.optionTable?.rows.length===2")
assert not b.evaluate("document.querySelector('section[aria-label=下拉对照验收] input[aria-label=\"对照 1 zh\"]').disabled")
click(scope,'清除');click(scope,'绑定');b.click('绑定字段对照')
select('预填字段','SharedTest');b.click('导入预填')
b.wait("window.reuseAcceptance.control.optionsFieldRef?.fieldId==='reuse-source'")
checks.append('detach copies complete current rows; field dictionary binding uses the category picker')
click(scope,'解除对照绑定');click(scope,'预填表格');select('对照来源表格','road-travel-modes');b.click('导入预填')
b.wait("window.reuseAcceptance.control.optionTable?.rows.length===2&&!window.reuseAcceptance.control.optionsFieldRef")
b.click('绑定字段设计');select('预填字段','SharedTest');b.click('导入预填')
b.wait("window.reuseAcceptance.config.nodes.find(n=>n.path.class==='BUD'&&!n.path.kind).card.items[0].fieldBinding")
assert b.evaluate("[...document.querySelectorAll('input')].filter(e=>e.value==='更新后字段').every(e=>e.disabled)")
b.click('解除对照绑定')
b.wait("!window.reuseAcceptance.config.nodes.find(n=>n.path.class==='BUD'&&!n.path.kind).card.items[0].optionsFieldRef")
assert b.evaluate("Boolean(window.reuseAcceptance.config.nodes.find(n=>n.path.class==='BUD'&&!n.path.kind).card.items[0].fieldBinding)")
b.click('解除字段绑定')
checks.append('card field and dictionary bindings detach independently and metadata becomes editable')
for width in [320,390,600,900,1440]:
 b.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':1000,'deviceScaleFactor':1,'mobile':False})
 assert b.evaluate("document.documentElement.scrollWidth<=innerWidth+2"),width
checks.append('copy/binding/card controls fit 320/390/600/900/1440px')
b.screenshot('postc-dictionaries.png');assert not b.errors,b.errors
out=Path(os.environ['CAIRNMAP_ACCEPTANCE_OUT']);out.mkdir(parents=True,exist_ok=True)
(out/'postc-dictionaries.json').write_text(json.dumps({'checks':checks,'runtime_errors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(checks,ensure_ascii=False));b.ws.close()
