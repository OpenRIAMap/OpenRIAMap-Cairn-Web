import json,os,time
from pathlib import Path
from browser_check import Browser,APP_URL
b=Browser();checks=[]
def set_select(selector,value):
 b.evaluate("(()=>{const e=document.querySelector("+json.dumps(selector)+");Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(e,"+json.dumps(value)+");e.dispatchEvent(new Event('change',{bubbles:true}));})()")
 time.sleep(.1)
b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/subject-ui-acceptance.html?mode=role'})
b.wait("document.querySelector('#role-harness [aria-label=\"通用包含关系绑定\"]')!==null")
role='#role-harness [aria-label="通用包含关系绑定"]'
assert b.evaluate("window.roleAcceptance.node.fieldSettings.structure.role")=='member'
assert b.evaluate("document.querySelector("+json.dumps(role)+").textContent.includes('指向主单元字段（必填）')")
assert not b.evaluate("[...document.querySelectorAll("+json.dumps(role+' select')+")].some(e=>[...e.options].some(o=>o.value==='BUD'||o.value==='STB'))")
set_select(role+' select','main')
assert b.evaluate("window.roleAcceptance.node.fieldSettings.structure.hostField===undefined&&window.roleAcceptance.node.fieldSettings.structure.selectorField===undefined")
assert b.evaluate("document.querySelector("+json.dumps(role)+").textContent.includes('指向附属单元字段（可选）')")
set_select(role+' select','member')
checks.append('role editor has no opposite Class restriction; changing identity clears incompatible fields; required/optional fields match role')
for width in [320,390,600,900,1440]:
 b.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':1000,'deviceScaleFactor':1,'mobile':False})
 assert b.evaluate("(()=>{const r=document.querySelector('#role-harness').getBoundingClientRect();return [...document.querySelectorAll('#role-harness select,#role-harness input:not([type=checkbox])')].every(e=>e.getBoundingClientRect().right<=r.right+1);})()"),width
checks.append('search and structure modules have distinct headers and contain at all five widths')
b.screenshot('subject-role-editor-acceptance.png');assert not b.errors,b.errors
out=Path(os.getenv('CAIRNMAP_ACCEPTANCE_OUT','.cache/main-update'));out.mkdir(parents=True,exist_ok=True);(out/'subject-role-editor-acceptance.json').write_text(json.dumps({'checks':checks,'runtime_errors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'checks':checks,'runtime_errors':b.errors},ensure_ascii=False));b.ws.close()
