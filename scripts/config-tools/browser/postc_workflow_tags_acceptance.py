import json,os,time
from pathlib import Path
from browser_check import Browser,APP_URL
b=Browser();checks=[]
def select(label,value):
 b.wait('Boolean(document.querySelector('+json.dumps('select[aria-label="'+label+'"]')+'))')
 b.evaluate("(()=>{const e=document.querySelector("+json.dumps('select[aria-label="'+label+'"]')+");Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(e,"+json.dumps(value)+");e.dispatchEvent(new Event('change',{bubbles:true}));})()")
 time.sleep(.15)
def fill(selector,value):
 b.evaluate("(()=>{const e=document.querySelector("+json.dumps(selector)+");Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,"+json.dumps(value)+");e.dispatchEvent(new Event('input',{bubbles:true}));})()")
 time.sleep(.15)
def scoped_click(scope,text):
 b.evaluate("[...document.querySelector("+json.dumps(scope)+").querySelectorAll('button')].find(e=>e.textContent.trim()==="+json.dumps(text)+").click()")
 time.sleep(.15)
b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/subject-ui-acceptance.html?mode=general&resources=1&reset=1'})
b.wait("window.applicationAcceptance?.snapshot().lookupTables.length===3&&Boolean(document.querySelector('nav'))")
b.click('工作流设计');b.click('新建');select('工作流初始化方式','template');select('工作流模板','v3-tpp_teleport')
fill('input[aria-label="新工作流 ID"]','test-copy-tpp');fill('input[aria-label="名称 zh"]','完整模板复制验收');b.click('创建工作流草稿')
b.wait("!document.querySelector('[role=dialog]')")
scoped_click('section[aria-label="工作流编辑区域"]','保存')
b.wait("window.applicationAcceptance.snapshot().workflows.some(w=>w.id==='test-copy-tpp')")
assert b.evaluate("(()=>{const c=window.applicationAcceptance.snapshot(),a=c.workflows.find(w=>w.id==='v3-tpp_teleport'),b=c.workflows.find(w=>w.id==='test-copy-tpp');return a.steps.length===b.steps.length&&a.outputs.length===b.outputs.length&&JSON.stringify(a.outputs)===JSON.stringify(b.outputs)&&a.label.zh!=='完整模板复制验收';})()")
checks.append('TPP template including extra drawing, conditions and output assembly copies and saves without altering source')
b.click('新建');select('工作流初始化方式','template');select('工作流模板','v3-tpp_teleport');fill('input[aria-label="新工作流 ID"]','v3-tpp_teleport');fill('input[aria-label="名称 zh"]','重复ID');b.click('创建工作流草稿')
b.wait("Boolean(document.querySelector('[role=dialog] [role=alert]'))");assert b.evaluate("document.querySelector('[role=dialog]').textContent.includes('已存在')")
b.call('Input.dispatchKeyEvent',{'type':'keyDown','key':'Escape','code':'Escape'});b.call('Input.dispatchKeyEvent',{'type':'keyUp','key':'Escape','code':'Escape'})
b.click('要素设计');b.click('预留对照表格')
table="[aria-label='对照表独立编辑区域'] details > article.cm-field-card:last-of-type"
assert b.evaluate("[...document.querySelectorAll('[aria-label=\"对照表独立编辑区域\"] details > article.cm-field-card')].slice(0,3).every(article=>[...article.querySelectorAll('button')].find(b=>b.textContent==='删除表格')?.disabled)")
scoped_click(table,'添加选项')
row=table+' > section:last-of-type'
inputs=b.evaluate("[...document.querySelector("+json.dumps(row)+").querySelectorAll('input')].length")
assert inputs>=3
b.evaluate("(()=>{const e=[...document.querySelector("+json.dumps(row)+").querySelectorAll('input')];for(const [i,v] of [[0,'确认标签验收'],[1,'Verified test'],[2,'VerifiedAcceptance']]){Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e[i],v);e[i].dispatchEvent(new Event('input',{bubbles:true}));}})()")
time.sleep(.15)
b.evaluate("(()=>{const e=document.querySelector("+json.dumps(row+' select')+");Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(e,'bool');e.dispatchEvent(new Event('change',{bubbles:true}));})()")
b.click('保存表格');b.wait("window.applicationAcceptance.snapshot().lookupTables.find(t=>t.id==='standard-tag-fields').rows.some(r=>r.value==='VerifiedAcceptance')")
checks.append('system table deletion and IDs locked; typed tag metadata edited and saved through independent table transaction')
b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/subject-ui-acceptance.html?mode=tags'})
b.wait('Boolean(window.tagsAcceptance)');assert b.evaluate("document.querySelectorAll('input').length===0")
b.click('添加标签行');select('标签已注册字段','VerifiedAcceptance');assert b.evaluate("Object.values(window.tagsAcceptance.value)[0].tags[0].value===false")
b.click('添加标签行')
b.evaluate("(()=>{const e=[...document.querySelectorAll('select[aria-label=标签已注册字段]')][1];Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(e,'level');e.dispatchEvent(new Event('change',{bubbles:true}));})()")
fill('input[aria-label="标签扩展值"][type=number]','0')
assert b.evaluate("Object.values(window.tagsAcceptance.value)[0].tags[1].value==='0'")
assert b.evaluate("!document.body.textContent.includes('高级对象查看与编辑')")
checks.append('new standard tag visible without code changes; blank start, false/zero types and inline first-row additions retained')
for width in [320,390,600,900,1440]:
 b.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':1000,'deviceScaleFactor':1,'mobile':False})
 assert b.evaluate('document.documentElement.scrollWidth<=innerWidth+2'),width
b.screenshot('postc-workflow-tags.png');assert not b.errors,b.errors
out=Path(os.environ['CAIRNMAP_ACCEPTANCE_OUT']);(out/'postc-workflow-tags.json').write_text(json.dumps({'checks':checks,'runtime_errors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(checks,ensure_ascii=False));b.evaluate('window.applicationAcceptance.restoreDefault()');b.ws.close()
