"""Real relay export/delete controls, with a large local source-data fixture."""
import json
import os
import time
import urllib.request
import zipfile
from browser_check import APP_URL, OUT, Browser

assert APP_URL.startswith('http://127.0.0.1:')
endpoint = 'http://127.0.0.1:' + os.environ.get('CAIRNMAP_CDP_PORT', '9338')
opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
fresh = json.load(opener.open(urllib.request.Request(endpoint + '/json/new?about:blank', method='PUT')))
for page in json.load(opener.open(endpoint + '/json')):
    if page['type'] == 'page' and page['id'] != fresh['id'] and (page['url'] == 'about:blank' or page['url'].startswith(APP_URL)):
        opener.open(endpoint + '/json/close/' + page['id']).read()
b = Browser()
checks = []


def value(selector, text):
    b.evaluate('''(() => {
      const e = [...document.querySelectorAll(%s)].find(e=>e.getBoundingClientRect().height&&!e.closest('[inert]'));
      const proto = e.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(e, %s);
      e.dispatchEvent(new Event(e.tagName === 'SELECT' ? 'change' : 'input', {bubbles:true}));
    })()''' % (json.dumps(selector), json.dumps(text)))
    time.sleep(.1)


def click_element(expression):
    rect = b.evaluate('''(() => {const e=%s; e.scrollIntoView({block:'center'});
      const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};})()''' % expression)
    for event in ['mousePressed', 'mouseReleased']:
        b.call('Input.dispatchMouseEvent', {'type': event, 'button': 'left', 'clickCount': 1, **rect})
    time.sleep(.04)


try:
    b.call('Page.navigate', {'url': APP_URL + '/scripts/config-tools/workflow-acceptance.html?c16=1&edit=1'})
    b.wait('Boolean(window.workflowAcceptance?.measurement)', 60)
    # Fixture initialization only. Every deletion/export below uses the actual UI.
    b.evaluate('''window.workflowAcceptance.setRecords(Array.from({length:80},(_,i)=>({
      ID:'DELETE_'+String(i).padStart(3,'0'),Name:'待删除测试要素'+i,Class:'BUD',Kind:'NOM',World:'zth'
    })));window.confirm=()=>true;window.alerts=[];window.alert=x=>window.alerts.push(x);''')
    b.click('测绘')
    b.click('开始测绘(完整)')
    b.click('点')
    for level, code in zip(['Class', 'Kind', 'SKind', 'SKind2'], ['C16TEST', 'PARENT', 'POINT', 'LEAF']):
        value('select[aria-label="要素分类 ' + level + '"]', code)
    value('input[aria-label="新建要素 ID"]', 'RELAY_LAYOUT_POINT')
    value('[data-edit-control="name"] input', '可操作的保留图层')
    value('input[aria-label="工作流编辑人"]', 'local-ui-test')
    for event in ['mousePressed', 'mouseReleased']:
        b.call('Input.dispatchMouseEvent', {'type': event, 'button': 'left', 'clickCount': 1, 'x':800, 'y':600})
    b.click('完成当前图层')
    b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===1')
    b.click('删除要素')
    for i in range(80):
        row = '[...document.querySelectorAll("div.flex.items-center.gap-2.rounded.border.bg-white.p-2")].find(e=>e.textContent.includes(' + json.dumps('(DELETE_' + str(i).zfill(3) + ')') + '))'
        click_element(row + '.querySelector("button")')
    b.click('确认')
    b.wait('Boolean([...document.querySelectorAll("div")].find(e=>e.textContent==="待删除标记"))')
    body = '''[...document.querySelectorAll('div')].find(e=>e.textContent==='待删除标记'&&e.getBoundingClientRect().height).parentElement.parentElement'''
    metrics = b.evaluate('''(() => {const e=%s;const r=e.getBoundingClientRect();
      return {height:e.clientHeight,content:e.scrollHeight,overflow:getComputedStyle(e).overflowY,
        sameContainer:Boolean(e.querySelector('.min-w-max')),x:r.x+30,y:r.y+40};})()''' % body)
    assert metrics['sameContainer'] and metrics['overflow'] == 'auto', metrics
    assert metrics['content'] > metrics['height'] >= 120, metrics
    b.screenshot('relay-delete-scroll-top.png')
    b.call('Input.dispatchMouseEvent', {'type':'mouseWheel','x':metrics['x'],'y':metrics['y'],'deltaX':0,'deltaY':3000})
    b.wait('(() => {const e=%s;return e.scrollTop+e.clientHeight>=e.scrollHeight-2;})()' % body)
    b.click('>')
    b.click('JSON')
    b.wait('document.body.innerText.includes("RELAY_LAYOUT_POINT")')
    click_element('''[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='关闭'&&e.getBoundingClientRect().height)''')
    b.wait('!document.body.innerText.includes("JSON 导出")')
    checks.append('80 deletion marks and ordinary layers share one bounded wheel-scroll container; layer JSON remains reachable')
    b.screenshot('relay-delete-scroll-bottom.png')
    # Removing a mark must still update the draft and export count.
    b.evaluate('(%s).scrollTop=0' % body)
    click_element('(%s).querySelector("button[title=DELETE_000]")' % body)
    b.wait('!document.querySelector("button[title=DELETE_000]")')
    b.click('导出标准包')
    expected = b.evaluate('"当前配置：r"+window.workflowAcceptance.config.revision+" · 契约 c"+window.workflowAcceptance.config.contractRevision')
    assert b.evaluate('document.body.innerText.includes(' + json.dumps(expected) + ')'), expected
    assert not b.evaluate('document.body.innerText.includes("Schema版本：")')
    checks.append('export displays the actual runtime configuration r/contract c, with 79 deletion marks after removal')
    b.screenshot('relay-export-current-config.png')
    # Generate and download through the normal controls; check the existing wire format.
    value('input', 'local-ui-test')
    b.click('生成标准包')
    b.wait('document.body.innerText.includes("标准包已生成：")', 30)
    directory = OUT / 'relay-download'
    directory.mkdir(parents=True, exist_ok=True)
    b.call('Browser.setDownloadBehavior', {'behavior':'allow','downloadPath':str(directory.resolve())})
    b.click('点击下载标准包')
    deadline=time.time()+20
    while not list(directory.glob('*.zip')) and time.time()<deadline:
        time.sleep(.1)
    archive=max(directory.glob('*.zip'), key=lambda f:f.stat().st_mtime)
    with zipfile.ZipFile(archive) as package:
        manifest=json.loads(package.read('INDEX.json'))
        assert manifest['schemaVersion']=='1.0.0' and manifest['deleteCount']==79 and manifest['featureCount']==1, manifest
    checks.append('normal generate/download succeeds; existing package Schema and feature/delete counts are preserved')
    b.call('Emulation.setDeviceMetricsOverride', {'width':430,'height':932,'deviceScaleFactor':1,'mobile':False})
    time.sleep(.3)
    # Existing viewport-switch policy stops drawing; reopen through the normal menu.
    b.click('开始测绘(完整)')
    b.click('导入数据')
    root = b.call('DOM.getDocument')['root']['nodeId']
    file_input = b.call('DOM.querySelector', {'nodeId':root,'selector':'input[type=file][accept*=".zip"]'})['nodeId']
    b.call('DOM.setFileInputFiles', {'nodeId':file_input,'files':[str(archive.resolve())]})
    b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===1')
    mobile = b.evaluate('''(() => {const e=%s;e.scrollTop=0;const r=e.getBoundingClientRect();
      return {height:e.clientHeight,content:e.scrollHeight,x:r.x+30,y:r.bottom-24};})()''' % body)
    assert mobile['content'] > mobile['height'] >= 120, mobile
    b.call('Input.dispatchMouseEvent', {'type':'mouseWheel','x':mobile['x'],'y':mobile['y'],'deltaX':0,'deltaY':3000})
    b.wait('(() => {const e=%s;return e.scrollTop+e.clientHeight>=e.scrollHeight-2;})()' % body)
    assert b.evaluate('''(() => {const e=%s;const list=e.querySelector('.min-w-max').getBoundingClientRect(),r=e.getBoundingClientRect();return list.top<r.bottom&&list.bottom>r.top;})()''' % body)
    b.screenshot('relay-delete-mobile-bottom.png')
    checks.append('narrow-screen layer panel also scrolls past deletion marks to reach ordinary layers')
    assert not b.errors, b.errors
    result={'checks':checks,'scroll':metrics,'mobileScroll':mobile,'configurationDisplay':expected,'runtimeErrors':b.errors}
    (OUT/'relay-layout-result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(result,ensure_ascii=False))
except Exception:
    b.screenshot('relay-layout-failure.png')
    (OUT/'relay-layout-failure.json').write_text(json.dumps({'text':b.evaluate('document.body.innerText'),'errors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8')
    raise
