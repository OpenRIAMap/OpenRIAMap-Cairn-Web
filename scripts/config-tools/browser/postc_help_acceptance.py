import json,os,time
from pathlib import Path
from browser_check import Browser,APP_URL
out=Path(os.environ['CAIRNMAP_ACCEPTANCE_OUT']);checks=[]
# The separate inventory walks actual general/category/workflow editors.
import postc_help_inventory
inventory=json.loads((out/'postc-help-inventory.json').read_text(encoding='utf-8'))
assert all(not scene['missing'] and not scene['fallbacks'] for scene in inventory['scenes']),inventory
checks.append('10 actual editor scenes have complete, semantic per-control explanations; runtime form preview is explicitly outside setting controls')
b=Browser();b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/subject-ui-acceptance.html?mode=general&resources=1&reset=1'})
b.wait("Boolean(document.querySelector('[data-application-section=review]'))")
b.evaluate("[...document.querySelector('[data-application-section=review]').querySelectorAll('button')].find(e=>e.textContent==='读取/编辑').click()")
time.sleep(.2)
selector="[data-application-section=review] label:has(input[readonly]) [data-module-help]"
def rect():
 return b.evaluate("(()=>{const e=document.querySelector("+json.dumps(selector)+");e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()")
def signature():return b.evaluate("JSON.stringify([...document.querySelectorAll('input,select,textarea')].map(e=>[e.value,e.checked]))")
before=signature();point=rect()
b.call('Input.dispatchMouseEvent',{'type':'mouseMoved',**point});b.wait("Boolean(document.querySelector('[role=tooltip]'))")
assert b.evaluate("document.querySelector('[role=tooltip] p').textContent.includes('认证')")
b.call('Input.dispatchKeyEvent',{'type':'keyDown','key':'Escape','code':'Escape'});b.call('Input.dispatchKeyEvent',{'type':'keyUp','key':'Escape','code':'Escape'});b.wait("!document.querySelector('[role=tooltip]')")
b.evaluate('document.querySelector('+json.dumps(selector)+').focus()');b.call('Input.dispatchKeyEvent',{'type':'keyDown','key':'Enter','code':'Enter'});b.wait("Boolean(document.querySelector('[role=tooltip]'))")
assert signature()==before
checks.append('readonly help opens by hover/focus/Enter and closes by Escape without changing any form value')
for width in [320,390,600,900,1440]:
 for scale in [1,1.25,1.5]:
  b.call('Emulation.setDeviceMetricsOverride',{'width':round(width/scale),'height':round(1000/scale),'deviceScaleFactor':scale,'mobile':False})
  b.evaluate("document.querySelector('[role=tooltip] [aria-label=关闭模块说明]')?.click()")
  rect();b.evaluate('document.querySelector('+json.dumps(selector)+').focus()');b.call('Input.dispatchKeyEvent',{'type':'keyDown','key':'Enter','code':'Enter'});b.wait("Boolean(document.querySelector('[role=tooltip]'))")
  assert b.evaluate("(()=>{const r=document.querySelector('[role=tooltip]').getBoundingClientRect();return r.left>=0&&r.top>=0&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1;})()"),(width,scale)
checks.append('tooltip remains inside all five viewport sizes at 100/125/150 percent equivalent layout zoom')
b.evaluate("document.querySelector('[role=tooltip] [aria-label=关闭模块说明]').click()")
b.call('Emulation.setDeviceMetricsOverride',{'width':390,'height':844,'deviceScaleFactor':1,'mobile':True});b.call('Emulation.setTouchEmulationEnabled',{'enabled':True})
point=rect();b.call('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[point]});b.call('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});b.wait("Boolean(document.querySelector('[role=tooltip]'))")
assert signature()==before
checks.append('touch opens readonly help without toggling a setting or creating a draft change')
b.screenshot('postc-help-mobile.png');b.call('Emulation.setTouchEmulationEnabled',{'enabled':False})
b.evaluate("document.querySelector('[role=tooltip] [aria-label=关闭模块说明]').click()")
b.evaluate("[...document.querySelector('[data-application-section=review]').querySelectorAll('button')].find(e=>e.textContent==='放弃草稿').click()")
b.click('要素设计')
# Help remains focusable inside a disabled fieldset, unlike native disabled buttons.
b.evaluate("document.querySelector('[aria-label=\"对照表独立编辑区域\"] details').open=true;document.querySelector('[aria-label=\"对照表独立编辑区域\"] fieldset').disabled=true")
selector="[aria-label='对照表独立编辑区域'] fieldset [data-module-help]"
b.evaluate('document.querySelector('+json.dumps(selector)+').focus()');b.call('Input.dispatchKeyEvent',{'type':'keyDown','key':'Enter','code':'Enter'});b.wait("Boolean(document.querySelector('[role=tooltip]'))")
checks.append('disabled fieldset explanations remain keyboard accessible')
assert not b.errors,b.errors
(out/'postc-help.json').write_text(json.dumps({'checks':checks,'scenes':inventory['scenes'],'runtime_errors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(checks,ensure_ascii=False));b.ws.close()
