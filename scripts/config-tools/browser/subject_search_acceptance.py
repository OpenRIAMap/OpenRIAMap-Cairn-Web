import json,os,time
from pathlib import Path
import sync01_transport
sync01_transport.install()
from browser_check import Browser,APP_URL
b=Browser();checks=[]
def fill(selector,value):
 b.evaluate("(()=>{const e=document.querySelector("+json.dumps(selector)+");e.focus();Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,"+json.dumps(value)+");e.dispatchEvent(new Event('input',{bubbles:true}));})()")
b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/subject-ui-acceptance.html?mode=search'})
b.wait("document.querySelector('#main-search input')!==null")
fill('#main-search input','302');b.wait("document.querySelector('#main-search').textContent.includes('楼层(原建筑)')")
b.wait("document.querySelector('#navigation-search input[placeholder*=搜索起点]')!==null")
fill('#navigation-search input[placeholder*=搜索起点]','302');b.wait("document.querySelector('#navigation-search').textContent.includes('楼层(原建筑)')")
checks.append('production homepage and navigation searches share the same subtype/parent subtitle and result source')
b.evaluate("[...document.querySelectorAll('#search-harness button')].find(e=>e.textContent==='更新建筑名验收').click()")
b.wait("document.querySelector('#navigation-search').textContent.includes('楼层(更新后建筑)')")
b.evaluate("document.querySelector('#main-search input').focus()")
b.wait("document.querySelector('#main-search').textContent.includes('楼层(更新后建筑)')")
assert not b.evaluate("document.querySelector('#main-search').textContent.includes('原建筑')")
assert not b.evaluate("document.querySelector('#navigation-search').textContent.includes('原建筑')")
checks.append('temporary/data snapshot replacement refreshes both open result panels without world switching or typing again')
for width in [390,600,900,1440]:
 b.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':1000,'deviceScaleFactor':1,'mobile':False})
 assert b.evaluate("document.querySelector('#main-search input').getBoundingClientRect().right<=innerWidth+1"),width
b.screenshot('subject-search-acceptance.png')
assert not b.errors,b.errors
out=Path(os.getenv('CAIRNMAP_ACCEPTANCE_OUT','.cache/main-update'));out.mkdir(parents=True,exist_ok=True);(out/'subject-search-acceptance.json').write_text(json.dumps({'checks':checks,'runtime_errors':b.errors,'transport':'exact frozen public COS responses fulfilled in CDP; not proof of live backend/CORS'},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'checks':checks,'runtime_errors':b.errors},ensure_ascii=False));b.ws.close()
