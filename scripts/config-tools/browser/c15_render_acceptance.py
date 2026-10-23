import json,os,time,sys
from pathlib import Path
from urllib.request import build_opener,ProxyHandler,Request
import websocket
sys.path.insert(0,str(Path(__file__).resolve().parent))
from browser_check import Browser,APP_URL,OUT

def chrome():
 assert os.environ.get('CAIRNMAP_CDP_PORT') in ('9502','9514') and APP_URL.startswith('http://127.0.0.1:')
 opener=build_opener(ProxyHandler({}));cdp='http://127.0.0.1:'+os.environ['CAIRNMAP_CDP_PORT']
 opener.open(Request(cdp+'/json/new?about:blank',method='PUT')).read()
 for page in json.loads(opener.open(cdp+'/json').read()):
  if page['type']=='page' and page['url']!='about:blank':opener.open(cdp+'/json/close/'+page['id']).read()
 b=Browser();b.ws.settimeout(180)
 try:
  b.call('Network.enable');b.call('Network.setBlockedURLs',{'urls':['https://*',APP_URL+'/api/*']})
  b.call('Page.navigate',{'url':APP_URL+'/scripts/browser/fixtures/c15-render.html'});b.wait("typeof window.runC15RenderChecks==='function'",45)
  result=b.evaluate('window.runC15RenderChecks()')
  result['cleanupHeap']=[]
  for _ in range(3):
   b.evaluate('window.runC15RenderChecks(false)');b.call('HeapProfiler.collectGarbage');result['cleanupHeap'].append({'heap':b.call('Runtime.getHeapUsage'),'dom':b.call('Memory.getDOMCounters')})
  b.call('Emulation.setDeviceMetricsOverride',{'width':1440,'height':1000,'deviceScaleFactor':2,'mobile':False})
  b.call('Page.navigate',{'url':APP_URL+'/scripts/browser/fixtures/c15-render.html?dpr=2'});b.wait("location.search==='?dpr=2'&&typeof window.runC15RenderChecks==='function'",45)
  result['dpr2']=b.evaluate('window.runC15RenderChecks(false)')
  assert not b.errors,b.errors
  (OUT/'c15-render-chrome.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
  assert all(value['creationTarget'] and value['interactionTarget'] for value in result['summary'].values()),result['summary']
  b.screenshot('c15-render-chrome.png')
  print(json.dumps({'browser':'chrome','checks':result['checks'],'performance':result['summary']},ensure_ascii=False))
 finally:b.ws.close()

class Bidi:
 def __init__(self):
  self.ws=websocket.create_connection('ws://127.0.0.1:'+os.environ.get('CAIRNMAP_BIDI_PORT','9515')+'/session',timeout=180,suppress_origin=True);self.id=0
  self.call('session.new',{'capabilities':{}})
  self.context=self.call('browsingContext.create',{'type':'tab'})['context']
 def call(self,method,params):
  self.id+=1;ident=self.id;self.ws.send(json.dumps({'id':ident,'method':method,'params':params}))
  while True:
   data=json.loads(self.ws.recv())
   if data.get('id')!=ident:continue
   if data['type']=='error':raise RuntimeError(data)
   return data['result']
 def eval(self,expr):
  data=self.call('script.evaluate',{'expression':expr,'target':{'context':self.context},'awaitPromise':True})
  if data['type']=='exception':raise RuntimeError(data)
  return data['result'].get('value')
 def close(self):
  self.call('browsingContext.close',{'context':self.context});self.call('session.end',{});self.ws.close()

def firefox():
 b=Bidi()
 try:
  b.call('browsingContext.setViewport',{'context':b.context,'viewport':{'width':1440,'height':1000},'devicePixelRatio':1})
  b.call('browsingContext.navigate',{'context':b.context,'url':APP_URL+'/scripts/browser/fixtures/c15-render.html','wait':'complete'})
  deadline=time.time()+40
  while not b.eval("typeof window.runC15RenderChecks==='function'"):
   assert time.time()<deadline;time.sleep(.15)
  result=json.loads(b.eval('window.runC15RenderChecks().then(value=>JSON.stringify(value))'))
  b.call('browsingContext.setViewport',{'context':b.context,'viewport':{'width':1440,'height':1000},'devicePixelRatio':2})
  b.call('browsingContext.reload',{'context':b.context,'wait':'complete'})
  deadline=time.time()+40
  while not b.eval("typeof window.runC15RenderChecks==='function'"):
   assert time.time()<deadline;time.sleep(.15)
  result['dpr2']=json.loads(b.eval('window.runC15RenderChecks(false).then(value=>JSON.stringify(value))'))
  (OUT/'c15-render-firefox.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
  assert all(value['creationTarget'] and value['interactionTarget'] for value in result['summary'].values()),result['summary']
  print(json.dumps({'browser':'firefox','checks':result['checks'],'performance':result['summary']},ensure_ascii=False))
 finally:b.close()

if __name__=='__main__':
 if sys.argv[-1]=='firefox':firefox()
 else:chrome()
