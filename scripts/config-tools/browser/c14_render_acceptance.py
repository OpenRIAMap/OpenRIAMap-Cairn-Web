"""Actual SVG/DOM rendering and dense-map measurement on an isolated local fixture."""
import json,os
from urllib.request import build_opener,ProxyHandler,Request
from browser_check import Browser,APP_URL,OUT
assert APP_URL.startswith('http://127.0.0.1:') and os.environ.get('CAIRNMAP_CDP_PORT') in ('9502','9514')
opener=build_opener(ProxyHandler({}));cdp='http://127.0.0.1:'+os.environ['CAIRNMAP_CDP_PORT']
opener.open(Request(cdp+'/json/new?about:blank',method='PUT')).read()
for page in json.loads(opener.open(cdp+'/json').read()):
    if page['type']=='page' and page['url']!='about:blank':opener.open(cdp+'/json/close/'+page['id']).read()
b=Browser()
try:
    b.call('Network.enable');b.call('Network.setBlockedURLs',{'urls':['https://*',APP_URL+'/api/*']})
    b.call('Page.navigate',{'url':APP_URL+'/scripts/browser/fixtures/c14-render.html'})
    b.wait("typeof window.runC14RenderChecks==='function'",45)
    result=b.evaluate('window.runC14RenderChecks()')
    b.call('Emulation.setDeviceMetricsOverride',{'width':1440,'height':1000,'deviceScaleFactor':2,'mobile':False})
    result['highDpi']=b.evaluate('window.runC14RenderChecks()')
    assert not b.errors,b.errors
    result.update({'runtimeErrors':b.errors,'cloudWrites':0})
    (OUT/'c14-render-browser.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(result,ensure_ascii=False))
finally:b.ws.close()
