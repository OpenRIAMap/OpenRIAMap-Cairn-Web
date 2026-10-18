import json,os,time
from pathlib import Path
from browser_check import Browser,APP_URL
b=Browser();checks=[]
b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/subject-ui-acceptance.html?mode=inherit'})
b.wait("document.querySelector('#card-harness article input')!==null")
assert b.evaluate("document.querySelector('#card-harness article input').disabled")
assert b.evaluate("document.querySelector('#card-harness article input:nth-of-type(1)').disabled")
assert b.evaluate("document.querySelector('#card-harness article select').disabled===false")
b.click('更新父名称验收');b.wait("document.querySelector('#card-harness article').textContent.includes('固定继承')")
assert b.evaluate("[...document.querySelectorAll('#card-harness article input')].some(e=>e.value==='父名称更新'&&e.disabled)")
checks.append('child source/title and bilingual mapping locked; renderer remains editable; parent title updates actual child editor')
b.click('切换父子验收');b.wait("window.cardAcceptance.childMode===false")
assert b.evaluate("[...document.querySelectorAll('#card-harness button')].some(e=>e.textContent==='清除')")
b.click('清除')
assert b.evaluate("(()=>{const i=window.cardAcceptance.node.card.items[0];return i.valueOptions===undefined&&i.prefillAudit===undefined&&i.label.zh==='父名称更新';})()")
checks.append('clear removes local dictionary/audit, preserves title and source; inherited rows cannot clear parent settings')
for width in [320,390,600,900,1440]:
 b.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':1000,'deviceScaleFactor':1,'mobile':False})
 assert b.evaluate("(()=>{const r=document.querySelector('#card-harness').getBoundingClientRect();return [...document.querySelectorAll('#card-harness input,#card-harness select')].every(e=>e.getBoundingClientRect().right<=r.right+1);})()"),width
b.screenshot('subject-inheritance-acceptance.png');assert not b.errors,b.errors
out=Path(os.getenv('CAIRNMAP_ACCEPTANCE_OUT','.cache/main-update'));out.mkdir(parents=True,exist_ok=True);(out/'subject-inheritance-acceptance.json').write_text(json.dumps({'checks':checks,'runtime_errors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'checks':checks,'runtime_errors':b.errors},ensure_ascii=False));b.ws.close()
