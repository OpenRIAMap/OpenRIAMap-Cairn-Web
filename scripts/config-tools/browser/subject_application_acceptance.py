import json,os,time
from pathlib import Path
from browser_check import Browser,APP_URL
b=Browser();checks=[]
def action(section,text):
 b.evaluate("[...document.querySelectorAll('[data-application-section="+section+"] button')].find(e=>e.textContent.trim()==="+json.dumps(text)+").click()")
 time.sleep(.2)
def field(section,name,value):
 b.evaluate("(()=>{const label=[...document.querySelectorAll('[data-application-section="+section+"] label')].find(e=>e.firstChild?.textContent.trim()==="+json.dumps(name)+");if(!label)throw Error('Missing label');const e=label.querySelector('input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,"+json.dumps(value)+");e.dispatchEvent(new Event('input',{bubbles:true}));})()")
b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/subject-ui-acceptance.html?mode=general'})
b.wait("document.querySelector('[data-application-section=worlds]')!==null")
b.evaluate('window.applicationAcceptance.restoreDefault()');origin=b.evaluate('performance.timeOrigin');b.call('Page.reload');b.wait("performance.timeOrigin!=="+str(origin)+"&&Boolean(window.applicationAcceptance)&&document.querySelector('[data-application-section=worlds]')!==null");
assert b.evaluate("document.querySelectorAll('[role=tab]').length")==3
assert not b.evaluate("document.body.textContent.includes('显示规则验证器')")
assert not b.evaluate("[...document.querySelectorAll('button')].some(e=>e.textContent.trim()==='显示验证器')")
action('worlds','读取/编辑');field('worlds','名称 zh','总体规则验收世界')
b.click('工作流设计');assert b.evaluate("document.querySelector('[role=tab][aria-selected=true]').textContent")== '总体规则'
assert b.evaluate("document.body.textContent.includes('请先保存或放弃')")
checks.append('general workspace has six isolated modules, no map validator; unfinished module blocks tab switch')
action('preferences','读取/编辑');field('preferences','主页结果数量','12')
action('worlds','保存');b.wait("window.applicationAcceptance.snapshot().application?.worlds[0].label.zh==='总体规则验收世界'")
assert b.evaluate("document.querySelector('[data-application-section=preferences] input[type=number]').value")=='12'
assert b.evaluate("window.applicationAcceptance.snapshot().application.preferences.search.homepageLimit")!=12
checks.append('saving one module preserves another unsaved draft; durable activity contains only saved module')
action('preferences','保存');b.wait("window.applicationAcceptance.snapshot().application.preferences.search.homepageLimit===12")
origin=b.evaluate('performance.timeOrigin');b.call('Page.reload');b.wait("performance.timeOrigin!=="+str(origin)+"&&Boolean(window.applicationAcceptance)&&document.querySelector('[data-application-section=worlds]')!==null")
assert b.evaluate("window.applicationAcceptance.snapshot().application.worlds[0].label.zh")== '总体规则验收世界'
assert b.evaluate("window.applicationAcceptance.snapshot().application.preferences.search.homepageLimit")==12
action('buttons','读取/编辑');action('sources','读取/编辑');action('modules','读取/编辑');action('review','读取/编辑');action('worlds','读取/编辑')
for width in [320,390,600,900,1440]:
 b.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':1000,'deviceScaleFactor':1,'mobile':False});time.sleep(.25)
 overflow=b.evaluate("[...document.querySelectorAll('[data-application-section] input,[data-application-section] select,[data-application-section] textarea')].filter(e=>{const r=e.getBoundingClientRect(),p=e.closest('[data-application-section]').getBoundingClientRect();return r.width&& (r.right>p.right+2||r.left<p.left-2)}).map(e=>e.outerHTML.slice(0,140))")
 assert not overflow, (width,overflow[:4])
checks.append('structured inputs in all six modules remain inside their containers at 320/390/600/900/1440px')
b.call('Emulation.setDeviceMetricsOverride',{'width':900,'height':1000,'deviceScaleFactor':1,'mobile':False});b.evaluate("document.querySelector('[data-application-section=buttons]').scrollIntoView()")
b.screenshot('subject-application-editor.png')
for section in ['worlds','buttons','sources','modules','review']:action(section,'放弃草稿')
b.click('要素设计');assert b.evaluate("document.querySelector('[role=tab][aria-selected=true]').textContent")=='要素设计'
assert not b.errors,b.errors
Path(os.environ['CAIRNMAP_ACCEPTANCE_OUT'],'subject-application-acceptance.json').write_text(json.dumps({'checks':checks,'runtime_errors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(checks,ensure_ascii=False))
