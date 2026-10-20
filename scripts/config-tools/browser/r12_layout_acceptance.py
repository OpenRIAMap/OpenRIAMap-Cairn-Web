import json,time
from browser_check import Browser,APP_URL,OUT
b=Browser();checks=[];panels=[]
def navigate(mode):
    previous=b.evaluate('performance.timeOrigin');b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/r12-ui-acceptance.html?mode='+mode});b.wait('performance.timeOrigin!=='+str(previous)+'&&!!window.r12Harness',30)
def click(label):b.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==="+json.dumps(label)+").click();true");time.sleep(.25)
try:
    navigate('panel');b.wait('!!document.querySelector('+json.dumps('[data-rule-panel-ready="2"]')+')')
    for width in [1440,1024,680]:
        b.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':900,'deviceScaleFactor':1,'mobile':False})
        for count in [2,9,18,40]:
            click('数量 '+str(count));b.wait('!!document.querySelector('+json.dumps('[data-rule-panel-ready="'+str(count)+'"]')+')');time.sleep(.1)
            row=b.evaluate("""(()=>{const outer=document.querySelector('[data-rule-panel-ready]'),card=outer.firstElementChild,r=card.getBoundingClientRect(),world=document.querySelector('[data-map-world-controls]').getBoundingClientRect(),buttons=[...card.querySelectorAll('button')].map(b=>b.getBoundingClientRect().width);return {width:r.width,height:r.height,left:r.left,right:r.right,top:r.top,bottom:r.bottom,buttons,overlapsWorld:r.left<world.right&&r.top<world.bottom&&r.right>world.left&&r.bottom>world.top,horizontalOverflow:card.scrollWidth-card.clientWidth};})()""")
            row.update({'viewport':width,'count':count});panels.append(row)
            assert len(row['buttons'])==count+1,row
            assert min(row['buttons'])>=32 and row['right']<=width+1 and row['left']>=0,row
            assert not row['overlapsWorld'] and row['horizontalOverflow']<=1,row
            if count==2:assert row['width']<300,row
        b.screenshot('panel-'+str(width)+'.png')
    click('切换左右');time.sleep(.3)
    assert b.evaluate("document.querySelector('[data-desktop-map-toolbar]').getBoundingClientRect().top>=document.querySelector('[data-map-world-controls]').getBoundingClientRect().bottom")
    click('切换移动端');assert abs(b.evaluate("document.querySelector('[data-rule-panel-ready]').firstElementChild.getBoundingClientRect().width")-172)<=2
    checks.append('2/9/18/40 buttons at1440/1024/680px: content width, fixed button size, wrap/vertical scrolling, world controls unobstructed, left placement and172px mobile retained')
    navigate('title');b.wait('!!document.querySelector("[data-title-probe] span[title]")')
    for width in [600,270,180]:
        b.evaluate("document.querySelector('[data-title-probe]').style.width='"+str(width)+"px';true");time.sleep(.2)
        result=b.evaluate("(()=>{const el=document.querySelector('[data-title-probe] span[title]');return {height:el.getBoundingClientRect().height,line:parseFloat(getComputedStyle(el).lineHeight),text:el.textContent,title:el.title,accessible:el.getAttribute('aria-label')};})()")
        assert result['height']<=result['line']*2+.5 and result['text'].endswith('...'),result
        assert result['title']==result['accessible'] and 'Name' in result['title'] and len(result['title'])>len(result['text'])
    b.screenshot('two-line-title-narrow.png');checks.append('literal ... at two measured lines; full conditions in tooltip and accessible name; responds to resize')
    b.call('Emulation.setDeviceMetricsOverride',{'width':390,'height':844,'deviceScaleFactor':1,'mobile':True})
    navigate('studio');b.wait("!!document.querySelector('nav[aria-label=\"设计工作区\"]')",40)
    assert b.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
    b.screenshot('full-studio-mobile.png')
    b.call('Emulation.setDeviceMetricsOverride',{'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False});time.sleep(.3);b.screenshot('full-studio-desktop.png')
    checks.append('full Studio loads the upgraded native package;390px page has no horizontal document overflow')
    assert not b.errors,b.errors
    (OUT/'r12-layout-results.json').write_text(json.dumps({'checks':checks,'panels':panels,'runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8')
    print('r12 layout browser: '+str(len(checks))+' groups passed',flush=True)
except Exception:
    b.screenshot('layout-failure.png');(OUT/'r12-layout-failure.json').write_text(json.dumps({'checks':checks,'panels':panels,'runtimeErrors':b.errors,'body':b.evaluate('document.body.innerText')[-4000:]},ensure_ascii=False,indent=2),encoding='utf-8');raise
finally:b.ws.close()
