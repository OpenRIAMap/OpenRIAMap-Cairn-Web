import json, os, time
from pathlib import Path
from browser_check import Browser, APP_URL
b=Browser();checks=[]
b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/subject-ui-acceptance.html?mode=general&resources=1&reset=1'})
b.wait("window.applicationAcceptance?.snapshot().contractRevision===11&&document.querySelector('[data-application-section=worlds]')!==null")
def action(section,text):
 b.evaluate("[...document.querySelectorAll('[data-application-section="+section+"] button')].find(e=>e.textContent.trim()==="+json.dumps(text)+").click()")
 time.sleep(.2)
def field(scope,title,value):
 b.evaluate("(()=>{const p=document.querySelector("+json.dumps(scope)+");const label=[...p.querySelectorAll('label')].find(e=>{const text=e.cloneNode(true);text.querySelectorAll('[data-module-help],input,select,textarea').forEach(x=>x.remove());return (e.getAttribute('data-setting-field')??text.textContent.trim())==="+json.dumps(title)+";});if(!label)throw Error('Missing field '+"+json.dumps(title)+");const e=label.querySelector('input,select');const proto=e.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(e,"+json.dumps(value)+");e.dispatchEvent(new Event(e.tagName==='SELECT'?'change':'input',{bubbles:true}));})()")
 time.sleep(.15)
def save(section,predicate):
 action(section,'保存')
 button="document.querySelector('button[aria-label=\"Confirm application changes\"]')"
 b.wait('('+predicate+')||Boolean('+button+')')
 if b.evaluate('Boolean('+button+')'):b.evaluate(button+'.click()')
 b.wait(predicate)
action('worlds','读取/编辑')
assert b.evaluate("(()=>{const s=document.querySelector('[data-application-section=worlds]');return !s.textContent.includes('世界→地图参数')&&!s.textContent.includes('地图→世界参数')&&!s.textContent.includes('额外放大');})()")
assert b.evaluate("document.querySelectorAll('[data-application-section=worlds] input').length>0")
checks.append('world editor uses preset explanation, remote key and group selector without repeated matrices/tile parameters')
action('worlds','放弃草稿');action('sources','读取/编辑')
b.click('添加独立世界群配置')
group='article[aria-label="来源配置组 server-1"]'
b.wait('document.querySelector('+json.dumps(group)+')!==null')
field(group,'名称 zh','服务器 B 验收')
field(group,'原图地址模板',APP_URL+'/fake-B/{world}/')
field(group,'滤镜取图方式','direct')
b.evaluate('document.querySelector('+json.dumps(group+' details')+').open=true')
field(group,'数据根地址',APP_URL+'/data-B')
field(group,'媒体根地址',APP_URL+'/media-B')
field('[data-application-section=sources]','伊甸（eden）','server-1')
save('sources',"window.applicationAcceptance.snapshot().application.sources.bindings.eden==='server-1'")
assert b.evaluate("window.applicationAcceptance.resourceWorld('eden').tiles.baseUrl")==APP_URL+'/fake-B/eden/'
assert b.evaluate("window.applicationAcceptance.resourceWorld('eden').tiles.filteredBaseUrl")==APP_URL+'/fake-B/eden/'
assert b.evaluate("window.applicationAcceptance.resourceSource('eden').rootUrl")==APP_URL+'/data-B'
assert b.evaluate("window.applicationAcceptance.resourceSource('eden').mediaRootUrl")==APP_URL+'/media-B'
assert b.evaluate("window.applicationAcceptance.resourceWorld('zth').tiles.baseUrl.includes('satellite.ria.red')")
checks.append('new complete server group and world membership save atomically; actual runtime data/media/tiles resolve B while default worlds remain A')
action('worlds','读取/编辑')
world="[data-application-section=worlds] article:nth-of-type(2)"
field(world,'名称 zh','伊甸原子保存验收');field(world,'来源配置组','')
assert b.evaluate("[...document.querySelectorAll('[data-application-section=sources] button')].find(e=>e.textContent==='读取/编辑').disabled")
save('worlds',"!window.applicationAcceptance.snapshot().application.sources.bindings.eden&&window.applicationAcceptance.snapshot().application.worlds[1].label.zh==='伊甸原子保存验收'")
checks.append('world editor saves world metadata and owned group-reference patch in one transaction; source module cannot overwrite linked draft')
action('worlds','读取/编辑');action('sources','读取/编辑')
for width in [320,390,600,900,1440]:
 b.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':1000,'deviceScaleFactor':1,'mobile':False})
 overflow=b.evaluate("[...document.querySelectorAll('[data-application-section=worlds] input,[data-application-section=worlds] select,[data-application-section=sources] input,[data-application-section=sources] select')].filter(e=>{const r=e.getBoundingClientRect(),p=e.closest('[data-application-section]').getBoundingClientRect();return r.width&&(r.right>p.right+2||r.left<p.left-2);}).map(e=>e.outerHTML.slice(0,120))")
 assert not overflow,(width,overflow[:4])
checks.append('both resource editors contain controls at 320/390/600/900/1440px')
b.call('Emulation.setDeviceMetricsOverride',{'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False})
b.evaluate("document.querySelector('[data-application-section=sources]').scrollIntoView()")
b.screenshot('postc-resource-groups.png')
action('worlds','放弃草稿');action('sources','放弃草稿')
assert not b.errors,b.errors
out=Path(os.environ['CAIRNMAP_ACCEPTANCE_OUT']);out.mkdir(parents=True,exist_ok=True)
(out/'postc-resource-groups.json').write_text(json.dumps({'checks':checks,'runtime_errors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(checks,ensure_ascii=False));b.evaluate('window.applicationAcceptance.restoreDefault()');b.ws.close()
