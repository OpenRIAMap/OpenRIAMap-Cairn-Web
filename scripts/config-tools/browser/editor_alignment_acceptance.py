"""Stress authoring label wrapping and measure controls in each visual row."""
import json
import time
from browser_check import Browser,APP_URL,OUT

b=Browser();b.ws.settimeout(10)
b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/subject-ui-acceptance.html?mode=general&resources=1'})
time.sleep(.5);b.wait("document.querySelector('[role=tab]')!==null")
b.evaluate('window.confirm=()=>true')
for _ in range(6):
    discarded=b.evaluate("(()=>{const e=[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='放弃草稿'&&!e.disabled&&e.getBoundingClientRect().height);if(!e)return false;e.click();return true})()")
    if not discarded:break
    time.sleep(.15)
b.evaluate("[...document.querySelectorAll('[role=tab]')].find(e=>e.textContent==='工作流设计').click()")
b.wait("document.querySelector('select[aria-label=\"已保存工作流\"]')!==null")
b.evaluate("(()=>{const e=document.querySelector('select[aria-label=\"已保存工作流\"]');Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(e,'v3-rod_road');e.dispatchEvent(new Event('change',{bubbles:true}));})()")
b.evaluate("[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='读取').click()")
b.wait("document.querySelector('.cm-aligned-fields')!==null")
results=[]
for width in [1440,600,390]:
    b.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':1000,'deviceScaleFactor':1,'mobile':False})
    for wrapped in [False,True]:
        b.evaluate("(()=>{const p=document.querySelector('.cm-aligned-fields');p.scrollIntoView({block:'center'});p.querySelector('.cm-help-heading').style.maxWidth="+json.dumps('70px' if wrapped else '')+";})()")
        time.sleep(.1)
        data=b.evaluate("(()=>{const p=document.querySelector('.cm-aligned-fields');return {rows:[...p.children].filter(e=>e.matches('label')).map(e=>{const r=e.getBoundingClientRect(),h=e.querySelector('.cm-help-heading').getBoundingClientRect(),c=e.querySelector('input:not([type=checkbox]),select,textarea').getBoundingClientRect();return {row:Math.round(r.top),headingHeight:h.height,controlTop:c.top}}),overflow:document.documentElement.scrollWidth>innerWidth}})()")
        groups={}
        for row in data['rows']:groups.setdefault(row['row'],[]).append(row['controlTop'])
        data['maxTopDifference']=max(max(row)-min(row) for row in groups.values())
        data.update(viewport=width,forcedWrappedHeading=wrapped)
        assert data['maxTopDifference']<=2 and not data['overflow'],data
        if wrapped:assert data['rows'][0]['headingHeight']>20,data
        results.append(data)
        if width==1440 and wrapped:b.screenshot('wrapped-heading-alignment.png')
b.evaluate("document.querySelector('.cm-aligned-fields .cm-help-heading').style.maxWidth=''")
b.evaluate("[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='放弃草稿'&&!e.disabled).click()")
assert not b.errors,b.errors
(OUT/'editor-alignment-result.json').write_text(json.dumps({'measurements':results,'runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'measurements':len(results),'maxTopDifference':max(r['maxTopDifference'] for r in results),'runtimeErrors':b.errors}))
