"""Exercise real full-editor and native-workflow single-part controls.
Run only with a dedicated profile and the recorded-data proxy on 5203.
"""
import json, os, time
from pathlib import Path
from browser_check import Browser, APP_URL, OUT
from app_probe import PROBE
if os.environ.get('CAIRNMAP_QA_ISOLATED')!='1':
    raise RuntimeError('A dedicated isolated QA profile is required.')
b=Browser();checks=[]
config=json.loads(Path('src/configStudio/defaults/r11-r7.config.json').read_text(encoding='utf-8'))
config['revision']=100000
for node in config['nodes']:
    if node['path']['class']=='BUD':
        node['geometryProfiles']['Polygon']['allowMultipleParts']=False
        node['geometryProfiles']['Polygon']['anchor']='featureBbox'
fixture=OUT/'single-part-fixture.json';fixture.write_text(json.dumps(config,ensure_ascii=False,indent=2),encoding='utf-8')
b.call('Page.addScriptToEvaluateOnNewDocument',{'source':"window.confirm=()=>true;const original=fetch;window.fetch=(input,options)=>{const url=typeof input==='string'?input:input.url;return original(url.startsWith('https://openriamap-cairn-data-1433163128.cos.ap-shanghai.myqcloud.com/')?'http://127.0.0.1:5203/data/'+url.split('.myqcloud.com/')[1]:input,options);};"})
b.call('Page.navigate',{'url':APP_URL+'/?workspace=config-lab'})
b.wait("!!document.querySelector('header input[type=file]')",30)
root=b.call('DOM.getDocument')['root']['nodeId'];node=b.call('DOM.querySelector',{'nodeId':root,'selector':'header input[type=file]'})['nodeId']
b.call('DOM.setFileInputFiles',{'nodeId':node,'files':[str(fixture)]})
b.wait("document.body.innerText.includes('r100000')",30)
b.click('测绘')
if b.evaluate("[...document.querySelectorAll('button')].some(e=>e.textContent.trim()==='下载并启用')"):
    b.click('下载并启用')
b.wait("[...document.querySelectorAll('button')].some(e=>e.textContent.trim()==='开始测绘(完整)')",30)
b.click('开始测绘(完整)');b.click('面')
b.evaluate("(()=>{const e=[...document.querySelectorAll('select')].find(e=>[...e.options].some(o=>o.textContent==='建筑'));e.value='建筑';e.dispatchEvent(new Event('change',{bubbles:true}));})()")
def fill(selector,value):
    b.evaluate("(()=>{const e="+selector+";Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,"+json.dumps(value)+");e.dispatchEvent(new Event('input',{bubbles:true}));})()")
for key,value in [('Kind','NOM'),('SKind','NOM'),('ID','QA_BUD_SINGLE_HOLE'),('Name','QA single polygon with hole')]:
    fill("[...document.querySelectorAll('input')].find(e=>e.placeholder==="+json.dumps(key)+"&&e.getBoundingClientRect().height)",value)
b.click('多部件和内洞设置')
assert b.evaluate("document.querySelector('select[aria-label=\"部件编号\"]').disabled")
for title in ['添加部件','删除当前部件']:
    assert b.evaluate("[...document.querySelectorAll('button')].find(e=>e.title==="+json.dumps(title)+"&&e.getBoundingClientRect().height).disabled")
b.click('内部空间')
assert not b.evaluate("[...document.querySelectorAll('button')].find(e=>e.title==='添加内部洞'&&e.getBoundingClientRect().height).disabled")
b.evaluate(PROBE);b.evaluate("window.appProbe.map.setView(window.appProbe.projection.locationToLatLng(20000,-64,20000),4,{animate:false});true")
time.sleep(.2)
def click_map(x,y):
    for kind in ['mousePressed','mouseReleased']:
        b.call('Input.dispatchMouseEvent',{'type':kind,'button':'left','clickCount':1,'x':x,'y':y})
    time.sleep(.1)
for point in [(450,350),(750,350),(750,650),(450,650)]:click_map(*point)
b.click('添加内部洞')
for point in [(550,450),(650,450),(650,550),(550,550)]:click_map(*point)
b.click('多部件和内洞设置');assert b.evaluate("!document.querySelector('select[aria-label=\"部件编号\"]')")
b.click('多部件和内洞设置');assert b.evaluate("document.querySelector('select[aria-label=\"内部洞编号\"]').options[0].textContent==='内部洞 1'")
b.screenshot('single-part-hole-controls.png');b.click('完成当前图层');b.evaluate(PROBE)
record=b.evaluate('window.appProbe.measurement.getCommittedFeatures()[0]')
assert len(record['CoordG'])==1 and len(record['CoordG'][0])==2,record
(OUT/'single-part-polygon-with-hole.json').write_text(json.dumps(record,ensure_ascii=False,indent=2),encoding='utf-8')
checks.append('Full editor disables part selector/add/remove, keeps holes available, and saves one Polygon with two rings after panel collapse/reopen.')
# The menu may be behind another floating panel; invoke its existing handler
# rather than moving the user's saved window layout during this test.
b.evaluate("[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='切换到快捷模式').click()")
b.evaluate("(()=>{const e=[...document.querySelectorAll('select')].find(e=>[...e.options].some(o=>o.value==='v3-bud_building'));e.value='v3-bud_building';e.dispatchEvent(new Event('change',{bubbles:true}));})()")
b.click('开始');fill("document.querySelector('input[aria-label=\"填写人\"]')",'browser-qa');b.click('下一页')
for level in ['Kind','SKind']:
    b.wait("!!document.querySelector('select[aria-label=\"工作流分类 "+level+"\"]')")
    b.evaluate("(()=>{const e=document.querySelector('select[aria-label=\"工作流分类 "+level+"\"]');e.value='NOM';e.dispatchEvent(new Event('change',{bubbles:true}));})()")
for label,value in [('名称','QA native single'),('字符简称','QANATIVE')]:
    fill("[...document.querySelectorAll('input')].find(e=>e.parentElement.textContent.trim().startsWith("+json.dumps(label)+")&&e.getBoundingClientRect().height)",value)
b.click('下一页');b.wait("document.querySelector('[data-workflow-step]')?.textContent.includes('固定绘制类型')")
assert not b.evaluate("[...document.querySelectorAll('[data-workflow-step] button')].some(e=>['添加部件','添加孔环'].includes(e.textContent.trim()))")
b.click('多部件和内洞设置')
assert b.evaluate("document.querySelector('select[aria-label=\"部件编号\"]').disabled")
assert b.evaluate("[...document.querySelectorAll('button')].find(e=>e.title==='添加部件').disabled")
b.click('内部空间')
assert not b.evaluate("[...document.querySelectorAll('button')].find(e=>e.title==='添加内部洞').disabled")
assert not b.evaluate("document.body.innerText.includes('采用当前绘制')")
b.screenshot('native-workflow-single-part-hole.png');b.click('退出工作流')
checks.append('Native workflow uses only the original multipart module: selected-class part controls are locked, holes remain available, and the workflow page has no duplicate structure buttons.')
assert not b.errors,b.errors
(OUT/'multipart-browser-result.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors,'isolatedFixtureRevision':100000,'recordFile':'single-part-polygon-with-hole.json'},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'checks':checks,'runtimeErrors':b.errors},ensure_ascii=False))
