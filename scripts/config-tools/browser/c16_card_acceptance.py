"""Configured card dispatch in desktop/mobile viewports; localhost only."""
import os,json,time,urllib.request
from browser_check import Browser,APP_URL,OUT
assert APP_URL.startswith('http://127.0.0.1:')
port=os.environ['CAIRNMAP_CDP_PORT'];endpoint='http://127.0.0.1:'+port;opener=urllib.request.build_opener(urllib.request.ProxyHandler({}));fresh=json.load(opener.open(urllib.request.Request(endpoint+'/json/new?about:blank',method='PUT')))
for page in json.load(opener.open(endpoint+'/json')):
 if page['type']=='page' and page['id']!=fresh['id'] and (page['url']=='about:blank' or page['url'].startswith(APP_URL)):opener.open(endpoint+'/json/close/'+page['id']).read()
b=Browser();b.call('Page.navigate',{'url':APP_URL+'/scripts/browser/fixtures/c16-card.html'});b.wait('!!document.querySelector("#card")',45);b.errors=[]
assert '原生地理单元' in b.evaluate('document.body.innerText')
b.evaluate('[...document.querySelectorAll("span")].find(e=>e.textContent==="原生地理单元").click()');assert 'native-land|' in b.evaluate('document.querySelector("#clicked").textContent');b.screenshot('c16-card-desktop.png')
b.call('Emulation.setDeviceMetricsOverride',{'width':390,'height':844,'deviceScaleFactor':1,'mobile':True});assert '原生地理单元' in b.evaluate('document.body.innerText');b.screenshot('c16-card-mobile.png')
b.evaluate('document.querySelector("#native").click()');time.sleep(.2);assert '原生普通卡片' in b.evaluate('document.body.innerText');assert '交易列表' not in b.evaluate('document.querySelector("#card").innerText');assert not b.errors,b.errors
result={'checks':['desktop/mobile native reference source and link event','ordinary/component card dispatch shares current configuration'],'runtimeErrors':b.errors};(OUT/'c16-card-result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(result,ensure_ascii=False))
