"""Real pointer drags on production geometry tools; local fixture ports only."""
import json
import os
import time
from browser_check import APP_URL, OUT, Browser
import base64

b=Browser(); checks=[]
try:
    window=b.call('Browser.getWindowForTarget')['windowId'];b.call('Browser.setWindowBounds',{'windowId':window,'bounds':{'windowState':'normal'}})
except RuntimeError:pass
def ev(code): return b.evaluate(code)
def points(): return json.loads(ev('document.querySelector("#fixture-points").textContent'))
def state(): return json.loads(ev('document.querySelector("#fixture-state").textContent'))
def rect(selector,index=0):
    return ev('(()=>{const e=document.querySelectorAll('+json.dumps(selector)+')['+str(index)+'];if(!e)throw Error("Missing target");const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()')
def mouse(x,y,kind='mouseMoved',buttons=0):
    args={'type':kind,'x':x,'y':y,'buttons':buttons}
    if kind in ['mousePressed','mouseReleased']:args.update(button='left',clickCount=1)
    b.call('Input.dispatchMouseEvent',args)
def click_at(p):
    mouse(**p);mouse(**p,kind='mousePressed',buttons=1);mouse(**p,kind='mouseReleased');time.sleep(.25)
def click_button(label):
    expr='[...document.querySelectorAll("button")].find(e=>[e.textContent.trim(),e.getAttribute("aria-label"),e.title].includes('+json.dumps(label)+')&&!e.disabled&&e.checkVisibility())'
    b.wait('!!('+expr+')')
    p=ev('(()=>{const e='+expr+';e.scrollIntoView({block:"center"});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()')
    click_at(p)
b.click=click_button
def screenshot(name):
    data=b.call('Page.captureScreenshot',{'format':'png','fromSurface':not bool(os.environ.get('CAIRNMAP_CDP_TARGET'))})['data'];(OUT/name).write_bytes(base64.b64decode(data))
b.screenshot=screenshot
def drag(selector,dx,dy,index=0):
    drag_at(rect(selector,index),dx,dy)
def drag_at(p,dx,dy):
    mouse(**p);mouse(**p,kind='mousePressed',buttons=1)
    for n in range(1,13):mouse(p['x']+dx*n/12,p['y']+dy*n/12,buttons=1);time.sleep(.025)
    mouse(p['x']+dx,p['y']+dy,kind='mouseReleased');time.sleep(.35)
def close(panel): click_at(rect('[data-panel-id="'+panel+'"] button[aria-label="关闭"], [data-panel-id="'+panel+'"] button[title="关闭"]'))
def value(selector,text,index=0):
    ev('(()=>{const e=document.querySelectorAll('+json.dumps(selector)+')['+str(index)+'];Object.getOwnPropertyDescriptor(e.tagName==="SELECT"?HTMLSelectElement.prototype:e.tagName==="TEXTAREA"?HTMLTextAreaElement.prototype:HTMLInputElement.prototype,"value").set.call(e,'+json.dumps(str(text))+');e.dispatchEvent(new Event(e.tagName==="SELECT"?"change":"input",{bubbles:true}))})()');time.sleep(.2)
def load(query=''):
    b.call('Page.navigate',{'url':APP_URL+'/scripts/browser/fixtures/control-point-input.html'+query})
    b.wait('!!document.querySelector("#fixture-points")&&!!document.querySelector(".leaflet-container")');time.sleep(.3)
try:
    load(); original=points();b.click('修改');b.wait('document.querySelectorAll(".cm-direct-vertex").length===4')
    drag('.cm-direct-vertex',30,20)
    assert points()==original,'preview must not write the primary draft'
    a,c=rect('.cm-direct-vertex',0),rect('.cm-direct-vertex',1)
    click_at({'x':(a['x']+c['x'])/2,'y':(a['y']+c['y'])/2})
    b.wait('document.querySelectorAll(".cm-direct-vertex").length===5')
    b.click('删除点：关');click_at(rect('.cm-direct-vertex',3));b.wait('document.querySelectorAll(".cm-direct-vertex").length===4')
    for _ in range(3):b.click('撤回')
    assert ev('document.querySelectorAll(".cm-direct-vertex").length')==4
    for _ in range(3):b.click('恢复')
    b.click('保存');assert len(points())==4 and points()!=original
    checks.append('direct native drag, segment insertion, delete substate and shared 3-step history; Save applies once')
    b.screenshot('direct-edit.png')

    load();original=points();b.click('插入');b.click('选择插入点');click_at(rect('.cm-insertion-point',0))
    b.wait('document.body.innerText.includes("插入启用")');close('cpT-insertion-panel')
    click_at({'x':650,'y':390});click_at({'x':700,'y':410})
    assert len(points())==6 and points()[3:]==original[1:]
    inserted=points()[1:3]
    assert inserted[0]!=inserted[1] and state()['index']==2
    b.click('主撤销');assert len(points())==5 and points()[1]==inserted[0]
    b.click('主重做');assert len(points())==6 and points()[1:3]==inserted
    b.click('插入启用');click_at({'x':620,'y':680});assert len(points())==7 and points()[3:6]==original[1:]
    checks.append('hidden insertion panel preserves ordered routing; middle undo/redo; stop resumes tail append')
    b.click('插入');b.click('选择插入点');click_at(rect('.cm-insertion-point',1));old=state()['index']
    b.click('重新选择插入点');close('cpT-insertion-panel');assert state()['active'] and not state()['picking'] and state()['index']==old
    checks.append('cancel pending re-selection preserves previous anchor and cursor')

    load();original=points();b.click('插入');b.click('选择插入点');click_at(rect('.cm-insertion-point',0));close('cpT-insertion-panel')
    b.click('手动输入');value('[data-panel-id="manual-point-input"] input:nth-of-type(1)',-75)
    # X and Z share sibling wrappers; use their explicit existing placeholders.
    value('input[placeholder="例如 20 / 20.1"]',-45);b.click('完成')
    value('[data-panel-id="manual-point-input"] textarea','-70,-64,-42;-65,-64,-38;');b.click('按序录入')
    assert len(points())==7 and [p['x'] for p in points()[1:4]]==[-75,-70,-65] and points()[4:]==original[1:]
    close('manual-point-input')
    b.click('曲线输入');inputs='[data-panel-id="curve-input"]'
    value(inputs+' input[placeholder="X(0.1)"]',-60);value(inputs+' input[placeholder="Z(0.1)"]',-35);b.click('设起点')
    value(inputs+' input[placeholder="X(0.1)"]',-40,1);value(inputs+' input[placeholder="Z(0.1)"]',-20,1);b.click('设终点');value(inputs+' input[placeholder="例如 12"]',20)
    b.click('点选朝向');click_at({'x':1000,'y':600});b.click('输出')
    assert len(points())==14 and points()[-3:]==original[1:] and state()['active']
    checks.append('manual single/batch and curve output remain available and append in order within the selected gap')

    load('?empty=1');b.click('图形输入');b.wait('!!document.querySelector(".cm-shape-center")')
    click_at({'x':1000,'y':800});assert points()==[],'shape preview must own map input despite the closed curve editor'
    assert points()==[]
    old_x=float(ev('document.querySelector('+json.dumps('input[aria-label="中心 X"]')+').value'))
    drag('.cm-shape-center',60,30)
    assert float(ev('document.querySelector('+json.dumps('input[aria-label="中心 X"]')+').value'))!=old_x
    drag('.cm-shape-rotate',35,15);assert points()==[]
    value('select[aria-label="图形类型"]','rectangle')
    assert abs(float(ev("document.querySelector("+json.dumps('input[aria-label="旋转角度"]')+").value")))<1e-8
    value('input[aria-label="宽 W"]',70);value('input[aria-label="高 H"]',35)
    body=ev('(()=>{const r=document.querySelector(".leaflet-cm-shape-input-pane path.leaflet-interactive").getBoundingClientRect();return {x:r.x+r.width*.25,y:r.y+r.height*.33}})()')
    drag_at(body,15,10);assert points()==[]
    drag('.cm-shape-size',20,10);value('input[aria-label="输出控制点数量"]',12)
    b.screenshot('shape-preview.png');b.click('输入');assert len(points())==12
    b.click('主撤销');assert points()==[]
    b.click('主重做');assert len(points())==12
    checks.append('shape center and rotation native drags; switch resets; rectangle handles; exact 12-point atomic output')
    for kind,count in [('circle',32),('ellipse',32),('square',4),('polygon',6)]:
        load('?empty=1');b.click('图形输入');value('select[aria-label="图形类型"]',kind)
        if kind=='polygon':drag('.cm-shape-vertex',8,4)
        b.click('输入');assert len(points())==count,(kind,points())
    checks.append('all five shape presets output; polygon vertex handle changes outline')

    load('?many=1');b.click('修改');b.wait('document.querySelectorAll(".cm-direct-vertex").length===800')
    drag('.cm-direct-vertex',10,15,300);b.click('保存');assert len(points())==800
    checks.append('800-vertex native pointer drag survives renders without losing marker')
    assert not b.errors,b.errors
    (OUT/'control-point-input-result.json').write_text(json.dumps({'success':True,'checks':checks,'runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'success':True,'checks':checks},ensure_ascii=False))
except Exception:
    (OUT/'control-point-input-failure.json').write_text(json.dumps({'checks':checks,'text':ev('document.body.innerText'),'errors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8')
    raise
finally:b.ws.close()
