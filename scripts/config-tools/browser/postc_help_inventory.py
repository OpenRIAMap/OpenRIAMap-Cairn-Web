import json,time,os
from pathlib import Path
from browser_check import Browser,APP_URL
b=Browser();results=[]
def collect(scene):
 data=b.evaluate("(()=>{const controls=[...document.querySelectorAll('.config-editor input,.config-editor select,.config-editor textarea')].filter(e=>!['file','hidden'].includes(e.type)&&!e.classList.contains('hidden')&&!e.closest('[data-workflow-step]'));return {controls:controls.length,missing:controls.filter(e=>!e.dataset.configSetting).map(e=>e.outerHTML.slice(0,160)),fallbacks:[...new Set(controls.filter(e=>e.dataset.helpKind==='context').map(e=>e.dataset.configSetting))]};})()")
 results.append({'scene':scene,**data});print(scene,data['controls'],json.dumps(data['fallbacks'],ensure_ascii=False), 'missing',len(data['missing']))
 if scene in ['general-all','feature-ROD'] or scene.startswith('workflow-v3-rod_'):
  for width in [320,390,600,900,1440]:
   b.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':1000,'deviceScaleFactor':1,'mobile':False});time.sleep(.1)
   overflow=b.evaluate("[...document.querySelectorAll('.config-editor input,.config-editor select,.config-editor textarea')].filter(e=>e.getBoundingClientRect().width>0 && !e.closest('[data-workflow-step]')).filter(e=>e.getBoundingClientRect().right>innerWidth+2||e.getBoundingClientRect().left<0).map(e=>({setting:e.dataset.configSetting,right:Math.round(e.getBoundingClientRect().right),width:Math.round(e.getBoundingClientRect().width)}))")
   assert not overflow,(scene,width,overflow[:15])
   assert b.evaluate("document.querySelector('h1').getBoundingClientRect().width>200"),(scene,width,'compressed header')
  b.call('Emulation.setDeviceMetricsOverride',{'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False})
def action(section,text):
 b.evaluate("[...document.querySelector("+json.dumps(section)+").querySelectorAll('button')].find(e=>e.textContent.trim()==="+json.dumps(text)+").click()")
 time.sleep(.2)
def select(label,value):
 b.evaluate("(()=>{const e=document.querySelector("+json.dumps('select[aria-label="'+label+'"]')+");Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(e,"+json.dumps(value)+");e.dispatchEvent(new Event('change',{bubbles:true}));})()")
 time.sleep(.2)
b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/subject-ui-acceptance.html?mode=general&resources=1&reset=1'})
b.wait("Boolean(document.querySelector('[data-application-section=worlds]'))")
for section in ['worlds','buttons','sources','modules','review','preferences']:action('[data-application-section='+section+']','读取/编辑')
collect('general-all')
for section in ['worlds','buttons','sources','modules','review','preferences']:action('[data-application-section='+section+']','放弃草稿')
b.click('要素设计')
for code in ['BUD','ROD','ISG','RLE','ISP']:
 select('编辑分类 Class',code)
 b.click('读取分类');time.sleep(.2);collect('feature-'+code)
 b.evaluate('window.confirm=()=>true');b.click('放弃草稿')
b.click('工作流设计')
for flow in ['v3-rod_standard','v3-tpp_teleport','v3-isg_ngf_wtb','v3-trp_trade']:
 options=b.evaluate("[...document.querySelector('select[aria-label=已保存工作流]').options].map(o=>o.value)")
 if flow not in options:
  flow=next((o for o in options if flow.split('_')[0] in o),options[1])
 select('已保存工作流',flow);action('section[aria-label="工作流编辑区域"]','读取');collect('workflow-'+flow);action('section[aria-label="工作流编辑区域"]','放弃草稿')
out=Path(os.environ['CAIRNMAP_ACCEPTANCE_OUT']);(out/'postc-help-inventory.json').write_text(json.dumps({'scenes':results,'runtime_errors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8');print('runtime errors',len(b.errors));b.ws.close()
