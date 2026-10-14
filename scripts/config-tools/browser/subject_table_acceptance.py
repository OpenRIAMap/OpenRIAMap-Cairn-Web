import json,os,time
from pathlib import Path
from browser_check import Browser,APP_URL

b=Browser();checks=[]
def set_value(selector,value):
 b.evaluate("(()=>{const e=document.querySelector("+json.dumps(selector)+");const p=e.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(p,'value').set.call(e,"+json.dumps(value)+");e.dispatchEvent(new Event(e.tagName==='SELECT'?'change':'input',{bubbles:true}));})()")
def click(text):
 b.evaluate("[...document.querySelectorAll('#table-harness button')].find(e=>e.textContent==="+json.dumps(text)+").click()")
 time.sleep(.15)
b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/subject-ui-acceptance.html'})
b.wait("document.querySelector('#table-harness [data-table-options]')!==null")
b.evaluate("document.querySelector('#table-harness details').open=true")
assert b.evaluate("document.querySelectorAll('#table-harness textarea').length")==0
click('使用既有表格');set_value('#table-harness [aria-label="使用表格"]','road-travel-modes')
b.wait("window.tableAcceptance.field.optionsTableId==='road-travel-modes'")
assert b.evaluate("[...document.querySelectorAll('#table-harness [data-table-options] input')].every(e=>e.disabled)")
click('删除表格') # first table is unreferenced; its removal must succeed
b.wait("window.tableAcceptance.config.lookupTables.length===1")
click('删除表格');assert b.evaluate("document.querySelector('#table-harness [role=alert]').textContent.includes('仍被引用')")
checks.append('binding locks rows; referenced table deletion blocked with owning field')
click('解除绑定，保留本地副本')
assert b.evaluate("!window.tableAcceptance.field.optionsTableId&&window.tableAcceptance.field.options[0].value==='WALK'")
assert b.evaluate("[...document.querySelectorAll('#table-harness [data-table-options] input')].every(e=>!e.disabled)")
checks.append('unbind retains editable options, labels and stored values')
for width in [320,390,600,900,1440]:
 b.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':1000,'deviceScaleFactor':1,'mobile':False})
 assert b.evaluate("(()=>{const r=document.querySelector('#table-harness').getBoundingClientRect();return [...document.querySelectorAll('#table-harness input,#table-harness select')].every(e=>e.getBoundingClientRect().right<=r.right+1);})()"),width
checks.append('tables/options contain at 320/390/600/900/1440px; typed functional values have no raw JSON editor')
b.screenshot('subject-table-acceptance.png')
assert not b.errors,b.errors
out=Path(os.getenv('CAIRNMAP_ACCEPTANCE_OUT','.cache/main-update'));out.mkdir(parents=True,exist_ok=True);(out/'subject-table-acceptance.json').write_text(json.dumps({'checks':checks,'runtime_errors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'checks':checks,'runtime_errors':b.errors},ensure_ascii=False));b.ws.close()
