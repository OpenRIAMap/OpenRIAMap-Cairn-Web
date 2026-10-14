"""Actual Studio nested editing surfaces at viewport and zoom-equivalent sizes."""
import json,time
from browser_check import Browser,APP_URL,OUT
b=Browser();checks=[]
def value(selector,text):
 b.evaluate("(()=>{const e=document.querySelector("+json.dumps(selector)+");if(!e)throw Error('Missing select');Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(e,"+json.dumps(text)+");e.dispatchEvent(new Event('change',{bubbles:true}));})()")
for kind,code in [('features','BUD'),('features','RLE'),('workflows','v3-tpp_teleport'),('workflows','v3-rod_road')]:
 b.navigate('?workspace=config-studio&configMode=v3&tab='+kind)
 if b.evaluate("[...document.querySelectorAll('button')].some(e=>e.textContent.trim()==='放弃草稿'&&!e.disabled&&e.getBoundingClientRect().height)"):
  b.click('放弃草稿')
  b.navigate('?workspace=config-studio&configMode=v3&tab='+kind)
 if kind=='features':
  value('select[aria-label="编辑分类 Class"]',code);b.click('读取分类')
 else:
  value('section[aria-label="工作流编辑区域"] select',code);b.click('读取')
 b.evaluate("document.querySelectorAll('details').forEach(e=>e.open=true);true")
 for width in [320,390,600,900,1440]:
  for scale in [1,1.25,1.5]:
   # Scale CSS layout and physical pixel density together. This is equivalent
   # viewport coverage, not a claim that a native browser menu was operated.
   css_width=round(width/scale)
   b.call('Emulation.setDeviceMetricsOverride',{'width':css_width,'height':round(1000/scale),'deviceScaleFactor':scale,'mobile':False});time.sleep(.1)
   bad=b.evaluate("[...document.querySelectorAll('.config-editor input,.config-editor select,.config-editor textarea')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&(r.x< -1||r.right>innerWidth+1)}).map(e=>({tag:e.tagName,label:e.getAttribute('aria-label'),placeholder:e.getAttribute('placeholder'),x:e.getBoundingClientRect().x,right:e.getBoundingClientRect().right}))")
   assert not bad,(kind,code,width,scale,bad[:8])
   checks.append({'surface':kind,'code':code,'physicalWidth':width,'scaleEquivalent':scale,'cssWidth':css_width,'controlsWithinViewport':True})
 b.call('Emulation.setDeviceMetricsOverride',{'width':900,'height':1000,'deviceScaleFactor':1,'mobile':False})
 b.screenshot('subject-editor-'+code+'.png')
 b.click('放弃草稿')
assert not b.errors,b.errors
(OUT/'subject-editor-surfaces.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors,'scope':'60 actual nested feature/workflow editor surfaces, 100/125/150 percent equivalent layout; native browser zoom remains a short manual check'},ensure_ascii=False,indent=2),encoding='utf-8')
print('Editor surfaces: '+str(len(checks))+' viewport/scale-equivalent combinations passed')
