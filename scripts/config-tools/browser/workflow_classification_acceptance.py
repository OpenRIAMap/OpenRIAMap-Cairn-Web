"""Real mouse/keyboard capture and edit against the production V3 runner, locally."""
import base64,json,os,sys,time,re
from urllib.request import build_opener,ProxyHandler,Request
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
from browser_check import Browser,APP_URL,OUT
from c15_render_acceptance import Bidi

class Driver:
 def __init__(self,firefox=False):
  if not firefox:
   port=os.environ['CAIRNMAP_CDP_PORT'];assert port in ('9502','9524') and APP_URL.startswith('http://127.0.0.1:')
   opener=build_opener(ProxyHandler({}));endpoint='http://127.0.0.1:'+port
   page=json.loads(opener.open(Request(endpoint+'/json/new?about:blank',method='PUT')).read())
   for old in json.loads(opener.open(endpoint+'/json').read()):
    if old['type']=='page' and old['id']!=page['id'] and (old['url']=='about:blank' or old['url'].startswith(APP_URL)):opener.open(endpoint+'/json/close/'+old['id']).read()
  self.firefox=firefox;self.raw=Bidi() if firefox else Browser();self.checks=[]
  if firefox:
   self.raw.call('browsingContext.activate',{'context':self.raw.context})
   self.raw.call('browsingContext.setViewport',{'context':self.raw.context,'viewport':{'width':1440,'height':1000},'devicePixelRatio':1})
   self.raw.call('browsingContext.navigate',{'context':self.raw.context,'url':APP_URL+'/scripts/browser/fixtures/workflow-classification.html','wait':'complete'})
  else:
   self.raw.call('Network.enable');self.raw.call('Network.setBlockedURLs',{'urls':['https://*',APP_URL+'/api/*']})
   self.raw.call('Page.navigate',{'url':APP_URL+'/scripts/browser/fixtures/workflow-classification.html'})
  self.wait("typeof window.classificationHarness==='function'",45)
 def evaluate(self,expr):
  return json.loads(self.raw.eval('JSON.stringify(('+expr+'))')) if self.firefox else self.raw.evaluate(expr)
 def wait(self,expr,seconds=20):
  stop=time.time()+seconds
  while time.time()<stop:
   if self.evaluate(expr):return
   time.sleep(.1)
  raise AssertionError('Timed out: '+expr)
 def point(self,expr,dx=.5,dy=.5):
  return self.evaluate("(()=>{const e="+expr+";if(!e)throw Error('missing target');e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return {x:r.x+r.width*"+str(dx)+",y:r.y+r.height*"+str(dy)+"}})()")
 def pointer(self,point):
  if self.firefox:self.raw.call('input.performActions',{'context':self.raw.context,'actions':[{'type':'pointer','id':'mouse','parameters':{'pointerType':'mouse'},'actions':[{'type':'pointerMove','x':round(point['x']),'y':round(point['y']),'duration':0},{'type':'pointerDown','button':0},{'type':'pointerUp','button':0}]}]})
  else:
   self.raw.call('Input.dispatchMouseEvent',{'type':'mousePressed','button':'left','clickCount':1,**point});self.raw.call('Input.dispatchMouseEvent',{'type':'mouseReleased','button':'left','clickCount':1,**point})
 def click(self,selector):
  expr='document.querySelector('+json.dumps(selector)+')';self.wait('Boolean('+expr+'&&!'+expr+'.disabled)');self.pointer(self.point(expr));time.sleep(.12)
 def button(self,text):
  expr="[...document.querySelectorAll('#workflow button')].find(e=>e.textContent.trim()==="+json.dumps(text)+"&&!e.disabled)"
  self.wait('Boolean('+expr+')');self.pointer(self.point(expr));time.sleep(.15)
 def keys(self,keys):
  if self.firefox:
   actions=[]
   for key in keys:actions.extend([{'type':'keyDown','value':key},{'type':'keyUp','value':key}])
   self.raw.call('input.performActions',{'context':self.raw.context,'actions':[{'type':'key','id':'keyboard','actions':actions}]})
  else:
   names={'\ue011':('Home',36),'\ue015':('ArrowDown',40),'\ue007':('Enter',13),'\ue003':('Backspace',8),'\ue00c':('Escape',27)}
   for key in keys:
    name,code=names.get(key,(key,ord(key.upper()) if len(key)==1 else 0));self.raw.call('Input.dispatchKeyEvent',{'type':'keyDown','key':name,'windowsVirtualKeyCode':code});self.raw.call('Input.dispatchKeyEvent',{'type':'keyUp','key':name,'windowsVirtualKeyCode':code})
 def select(self,key):
  selector='#workflow select[aria-label="工作流分类"]';expr='document.querySelector('+json.dumps(selector)+')'
  index=self.evaluate('Array.from('+expr+'.options).findIndex(o=>o.value==='+json.dumps(key)+')');assert index>=0,key
  self.click(selector);self.keys(['\ue00c'])
  if self.firefox:
   # Firefox headless's native popup receives arrow events without moving the
   # selection; native typeahead does perform trusted input/change actions.
   label=self.evaluate(expr+'.options['+str(index)+'].textContent');prefix=re.match(r'[A-Za-z0-9_-]+',label).group(0)
   for _ in range(self.evaluate(expr+'.options.length')):
    time.sleep(1.05);self.keys(list(prefix))
    if self.evaluate(expr+'.value')==key:break
  else:
   time.sleep(.1);self.keys(['\ue011']+['\ue015']*index+['\ue007'])
  self.wait(expr+'.value==='+json.dumps(key))
 def fill(self,selector,text):
  self.click(selector)
  if self.firefox:
   self.raw.call('input.performActions',{'context':self.raw.context,'actions':[{'type':'key','id':'keyboard','actions':[{'type':'keyDown','value':'\ue009'},{'type':'keyDown','value':'a'},{'type':'keyUp','value':'a'},{'type':'keyUp','value':'\ue009'},{'type':'keyDown','value':'\ue003'},{'type':'keyUp','value':'\ue003'}]+[action for char in text for action in ({'type':'keyDown','value':char},{'type':'keyUp','value':char})]}]})
  else:
   self.raw.call('Input.dispatchKeyEvent',{'type':'keyDown','key':'a','windowsVirtualKeyCode':65,'modifiers':2});self.raw.call('Input.dispatchKeyEvent',{'type':'keyUp','key':'a','windowsVirtualKeyCode':65,'modifiers':2});self.raw.call('Input.insertText',{'text':text})
  self.wait('document.querySelector('+json.dumps(selector)+').value==='+json.dumps(text))
 def screenshot(self,name):
  if self.firefox:data=self.raw.call('browsingContext.captureScreenshot',{'context':self.raw.context})['data'];(OUT/name).write_bytes(base64.b64decode(data))
  else:self.raw.screenshot(name)
 def scenario(self,kind='mixed'):
  self.click('#scenario-'+kind);self.wait("window.classificationHarness().pageKind==='actor'");self.button('下一页');self.wait("window.classificationHarness().pageKind==='form'")
 def capture(self,key,name='TestName',switch=None):
  self.scenario()
  self.select(key)
  if switch:self.select(switch)
  self.fill('[data-workflow-control=name] input',name);self.fill('[data-workflow-control=url] input','https://example.org/item');self.button('下一页')
  self.wait("document.querySelector('[data-workflow-step=drawing]')!==null");self.pointer(self.point('document.querySelector("#map")',.4,.4));self.wait('window.classificationHarness().coordinates===1');self.button('确认保存输出');self.wait("document.querySelector('#status').textContent==='采集已保存'")
  return self.evaluate('window.classificationHarness().record')
 def record(self,text):self.checks.append(text);print(json.dumps({'browser':'firefox' if self.firefox else 'chrome','passed':text},ensure_ascii=False),flush=True)
 def close(self):
  if self.firefox:self.raw.close()
  else:
   assert not self.raw.errors,self.raw.errors
   self.raw.ws.close()

def run(firefox=False):
 d=Driver(firefox);browser='firefox' if firefox else 'chrome'
 try:
  d.scenario('water')
  assert d.evaluate("document.querySelectorAll('#workflow select[aria-label=\"工作流分类\"]').length")==1
  assert not d.evaluate("document.querySelector('#workflow select[aria-label=\"工作流分类 Class\"]')!==null")
  style=d.evaluate("(()=>{const s=document.querySelector('#workflow select[aria-label=\"工作流分类\"]'),c=getComputedStyle(s);return {height:s.getBoundingClientRect().height,border:c.borderTopWidth,radius:c.borderRadius,padding:c.paddingLeft,options:[...s.options].map(o=>o.textContent)}})()")
  assert style['height']>=26 and float(style['border'].removesuffix('px'))>=1 and float(style['radius'].removesuffix('px'))>0,style
  assert all(' / ' not in label for label in style['options']),style
  d.select('ISG/NGF/WTB/SEA')
  d.screenshot('classification-water-'+browser+'.png');d.record('formal water flow: one styled selector with compact terminal names')
  controls=d.evaluate("[...document.querySelectorAll('#workflow [data-workflow-control]')].filter(e=>e.querySelector('input')&&/名称|字符简称/.test(e.querySelector('span')?.textContent??'')).map(e=>e.dataset.workflowControl)")
  assert len(controls)==2,controls
  for index,control in enumerate(controls):d.fill('[data-workflow-control='+json.dumps(control)+'] input','WaterTest'+str(index))
  d.button('下一页');d.wait("window.classificationHarness().pageKind==='geometry'")
  for dx,dy in [(.3,.3),(.65,.3),(.65,.65)]:d.pointer(d.point('document.querySelector("#map")',dx,dy))
  d.wait('window.classificationHarness().coordinates===3');d.button('确认保存输出');d.wait("document.querySelector('#status').textContent==='采集已保存'")
  water=d.evaluate('window.classificationHarness().record');assert water['SKind2']=='SEA' and water['CoordG'],water
  d.record('formal water flow: real form input, polygon map capture, generated identity and local save')
  expected=[('WFTEST/A',{'Class':'WFTEST','Kind':'A'}),('WFTEST/GROUP/B',{'Class':'WFTEST','Kind':'GROUP','SKind':'B'}),('WFTEST/DEEP/MID/C',{'Class':'WFTEST','Kind':'DEEP','SKind':'MID','SKind2':'C'}),('WFTEST',{'Class':'WFTEST'}),('OTHER/A',{'Class':'OTHER','Kind':'A'})]
  saved=[]
  for key,path in expected:
   record=d.capture(key)
   assert {name:record[name] for name in ['Class','Kind','SKind','SKind2'] if name in record}==path,record
   assert record['Num']==0 and record['Flag'] is False and record['CoordP'],record
   assert record['ID']=={'WFTEST/A':'WFTEST_A_record','WFTEST/GROUP/B':'WFTEST_GROUP_B_record','WFTEST/DEEP/MID/C':'WFTEST_DEEP_MID_C_record','WFTEST':'WFTEST_record','OTHER/A':'OTHER_A_record'}[key],record
   saved.append(record)
  d.record('all five candidates: mixed depths, exact parent, duplicate names; real map capture and local commit')
  record=d.capture('WFTEST/DEEP/MID/C',switch='WFTEST/A');assert 'SKind' not in record and 'SKind2' not in record and record['ID']=='WFTEST_A_record',record
  d.record('deep-to-shallow switch clears lower classification and generated ID segments')
  d.scenario();d.select('WFTEST/DEEP/MID/C');d.fill('[data-workflow-control=name] input','KeepDraft');d.click('#invalidate')
  d.wait("document.querySelector('#workflow select[aria-label=\"工作流分类\"]').value===''")
  assert d.evaluate("document.querySelector('[data-workflow-control=name] input').value")=='KeepDraft'
  assert d.evaluate("document.querySelector('#workflow').textContent.includes('原分类已不属于当前分类组')")
  d.select('WFTEST/A');d.record('candidate invalidation preserves typed draft and requires explicit reselection')
  d.scenario('single');assert d.evaluate("document.querySelectorAll('#workflow select[aria-label=\"工作流分类\"]').length")==0
  d.fill('[data-workflow-control=name] input','Single');d.button('下一页');d.pointer(d.point('document.querySelector("#map")',.45,.45));d.wait('window.classificationHarness().coordinates===1');d.button('确认保存输出');d.wait("document.querySelector('#status').textContent==='采集已保存'")
  assert d.evaluate('window.classificationHarness().record.Class')=='WFTEST';d.record('single exact category auto-resolves without redundant confirmation')
  d.scenario('polygon');assert d.evaluate("document.querySelectorAll('#workflow select[aria-label=\"工作流分类\"]').length")==0
  d.fill('[data-workflow-control=name] input','AreaOnly');d.button('下一页')
  for dx,dy in [(.3,.3),(.65,.3),(.65,.65)]:d.pointer(d.point('document.querySelector("#map")',dx,dy))
  d.wait('window.classificationHarness().coordinates===3');d.button('确认保存输出');d.wait("document.querySelector('#status').textContent==='采集已保存'")
  polygon=d.evaluate('window.classificationHarness().record');assert polygon['Type']=='Polygon' and polygon['Kind']=='AREA' and polygon['CoordG'],polygon
  d.record('mixed point/line/area tree with fixed Polygon only offers the area and saves canonical CoordG')
  d.capture('WFTEST/DEEP/MID/C');d.click('#edit');d.wait("document.querySelector('[aria-label=\"V3 工作流式编辑\"]')!==null")
  keys=d.evaluate("Array.from(document.querySelector('#workflow select[aria-label=\"工作流分类\"]').options).map(o=>o.value)");assert 'OTHER/A' not in keys and 'WFTEST' in keys,keys
  d.select('WFTEST/GROUP/B');d.fill('[data-edit-control=name] input','EditedName');d.fill('[data-edit-control=url] input','invalid-link');d.click('#save-edit');d.wait("document.querySelector('#error').textContent.includes('HTTP')")
  d.fill('[data-edit-control=url] input','https://example.org/edited');d.click('#save-edit');d.wait("document.querySelector('#status').textContent==='编辑已保存'")
  assert d.evaluate('window.classificationHarness().record.Name')=='EditedName'
  d.select('WFTEST');d.click('#save-edit');d.wait("!('Kind' in window.classificationHarness().record)")
  d.screenshot('classification-edit-'+browser+'.png');d.record('scoped edit: compact choices, final URL validation, save, and removal of stale lower levels')
  metrics=d.evaluate('window.classificationHarness().metrics');assert not metrics['unexpectedRequests'] and metrics['trustedChanges']>10 and metrics['trustedClicks']>10,metrics
  result={'browser':browser,'checks':d.checks,'waterStyle':style,'captured':saved,'finalRecord':d.evaluate('window.classificationHarness().record'),'cloudWrites':len(metrics['unexpectedRequests']),'metrics':metrics,'kernel':d.evaluate('window.classificationHarness().kernel'),'formalIdentity':d.evaluate('window.classificationHarness().formalIdentity')}
  (OUT/('workflow-classification-'+browser+'.json')).write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
 finally:d.close()

if __name__=='__main__':run(sys.argv[-1]=='firefox')
