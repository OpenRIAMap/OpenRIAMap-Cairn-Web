"""Zoom-out and re-entry regression, using the actual Leaflet renderer."""
import json,os,time
from pathlib import Path
from browser_check import Browser,APP_URL,OUT

b=Browser();results=[];root=Path(__file__).resolve().parents[3]
config=json.loads((root/'src/configStudio/defaults/r11-r7.config.json').read_text(encoding='utf-8'))
audit=json.loads((OUT/'configuration-audit.json').read_text(encoding='utf-8'))
variants=[{'direction':'3','Level':0,'Connect':False},{'direction':'0','Level':1,'Connect':True},{'direction':'1','Level':2,'Connect':False},{'direction':'3','Level':3,'Connect':True},{'direction':'3','Level':4,'Connect':False},{'direction':'3','Level':5,'Connect':True},{'direction':'3','Level':6,'Connect':False}]
cases={}
for row in audit['rows']:
 for high,low in row['disabledTransitions']:cases.setdefault((row['path'],high,low),row['variant'])

def navigate(mode):
 b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/render-acceptance.html?subject=1&class=RLE&scenario=singleLine&mode='+mode})
 b.wait('!!window.acceptance?.map');time.sleep(.3)

def zoom(level):
 b.evaluate('window.acceptance.map.setZoom('+str(level-3)+',{animate:false});true');b.wait('window.RIA?.debug.lineLabels?.()?.zoomLevel==='+str(level)+'&&!window.acceptance.map._animatingZoom',8);time.sleep(.2)

def labels():
 return b.evaluate("[...document.querySelectorAll('.leaflet-marker-icon')].map(e=>e.textContent.trim()).filter(t=>t&&!/^[.·•●○]+$/.test(t))")

def dataset(records):
 b.evaluate('window.acceptance.setDataset({features:'+json.dumps(records)+'});true');time.sleep(.35)

def feature(path,variant=0):
 node=next(n for n in config['nodes'] if n['path']==path)
 geometry=node.get('geometryType') or next(iter(node['geometryProfiles']))
 row={'ID':'lifecycle-fixture','World':'zth','Class':path['class'],'Kind':path.get('kind',''),'SKind':path.get('skind',''),'SKind2':path.get('skind2',''),'Name':'生命周期核验','bureau':'T','line':'1','color':'#e6007e',**variants[variant]}
 if geometry=='Point':row['CoordP']=[[0,-64,0]]
 elif geometry=='LineString':row['CoordL']=[[[-1600,-64,0],[1600,-64,0]]]
 else:row['CoordG']=[[[[-1600,-64,-400],[1600,-64,-400],[1600,-64,400],[-1600,-64,400]]]]
 return row

# Each configured on -> off boundary must agree with a cold target render.
# V1 runs independently on the identical records and camera.
for mode in ['main','v1']:
 navigate(mode)
 for (path_text,high,low),variant in cases.items():
  path=json.loads(path_text);row=feature(path,variant)
  dataset([]);zoom(low);dataset([row]);cold=labels()
  assert not cold,(mode,path,low,'cold off target',cold)
  zoom(high);on=labels();zoom(low);off=labels()
  assert off==cold,(mode,path,high,low,'history-dependent labels',on,off,cold)
  b.evaluate('window.acceptance.map.panBy([210,90],{animate:false});true');time.sleep(.17)
  assert not labels(),(mode,path,'off labels reappeared on pan')
  b.evaluate('window.acceptance.map.setView([0,0],'+str(high-3)+',{animate:false});true');time.sleep(.17)
  reentry=labels();assert bool(reentry)==bool(on),(mode,path,'failed re-entry',on,reentry)
  results.append({'mode':mode,'path':path,'variant':variant,'high':high,'low':low,'highLabels':on,'offLabels':off,'reentryLabels':reentry})
 print(mode+': '+str(len(cases))+' classification/Zoom boundaries passed',flush=True)

for mode in ['main','preview']:
 navigate(mode);rail=feature({'class':'RLE'});dataset([rail])
 for level in [4,3,2,1,0,2,0,4,1,5,1]:
  zoom(level)
  if level<2:assert not labels(),(mode,level,labels())
  elif level<5:assert labels()==['T1'],(mode,level,labels())
  else:assert labels(),(mode,level,'formal name missing')
 if mode=='main':
  zoom(2);b.evaluate("window.acceptance.map.panBy([310,100],{animate:false});true");time.sleep(.2);zoom(0);assert not labels()
 # Field conditions and multi-part bundles also exit through the same path.
 b.evaluate("(()=>{const c=structuredClone(window.acceptance.config),g=c.nodes.find(n=>n.path.class==='RLE'&&!n.path.kind).geometryProfiles.LineString;g.anchor='perPart';window.acceptance.setConfig(c);})()")
 rail['CoordL']=[[[-1600,-64,-200],[1600,-64,-200]],[[-1600,-64,200],[1600,-64,200]]]
 dataset([rail]);zoom(2);assert labels(),(mode,'multipart on')
 rail['direction']='0';dataset([rail]);assert not labels(),(mode,'field-condition exit',labels())
 rail['direction']='3';dataset([rail]);assert labels(),(mode,'field-condition re-entry')
 zoom(1);assert not labels(),(mode,'multipart off')
 b.screenshot('lifecycle-'+mode+'-low.png')
 results.append({'mode':mode,'rleDescendingAndReentry':True,'fieldConditionAndMultipart':True})

# Controlled density extension: empty frames cannot reserve old placements.
navigate('main')
b.evaluate("(()=>{const c=structuredClone(window.acceptance.config);for(const n of c.nodes.filter(n=>n.path.class==='RLE'))for(const r of n.geometryProfiles.LineString?.zoomPriority.rules??[]){if(r.label)r.label.collision.role='optional';r.extensions={...r.extensions,density:{mode:'override',enabled:true,gridSizePx:10000,maxLabelsPerGrid:1,preserveRequired:false,preserveSelected:false,reduceOrder:['hideOptionalLabels']},collision:{...r.extensions?.collision,allowOverlap:true}};}window.acceptance.setConfig(c);})()")
rails=[]
for i in range(5):
 row=feature({'class':'RLE'});row.update(ID='density-'+str(i),line=str(i));row['CoordL']=[[[-1600,-64,-320+i*160],[1600,-64,-320+i*160]]];rails.append(row)
dataset(rails);zoom(2);first=labels();assert len(first)==1,first
zoom(0);assert not labels()
rails.reverse();dataset(rails);zoom(2);assert len(labels())==1
zoom(0);dataset([]);zoom(2);assert not labels()
results.append({'densityEmptyAndReentry':True,'limit':1,'initial':first})
assert not b.errors,b.errors
(OUT/'browser-lifecycle.json').write_text(json.dumps({'checks':results,'boundaryCount':len(cases),'highLabelsVisible':sum(bool(r.get('highLabels')) for r in results),'runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8')
print('Descending, empty frames, field conditions, multipart, density and main/validator regression passed',flush=True);b.ws.close()
