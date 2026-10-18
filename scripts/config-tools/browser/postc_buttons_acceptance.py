import json,os,time
from pathlib import Path
from browser_check import Browser,APP_URL
b=Browser();checks=[]
b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/subject-ui-acceptance.html?mode=general&resources=1&reset=1'})
b.wait("window.applicationAcceptance?.snapshot().application.buttons.items[0].criteria.paths!==undefined&&Boolean(document.querySelector('[data-application-section=buttons]'))")
def click(scope,text):
 b.evaluate("[...document.querySelector("+json.dumps(scope)+").querySelectorAll('button')].find(e=>e.textContent.trim()==="+json.dumps(text)+").click()")
 time.sleep(.15)
click('[data-application-section=buttons]','读取/编辑')
article='article[aria-label="按钮定义 natural_geo"]'
assert b.evaluate("document.querySelectorAll("+json.dumps(article+' fieldset select')+").length>=8")
assert not b.evaluate("document.querySelector('[data-layer-buttons-editor]').textContent.includes('历史状态键')")
assert b.evaluate("[...document.querySelectorAll("+json.dumps(article+' header [data-setting-field]')+")].map(e=>e.dataset.settingField)")==['ID','名称 zh','名称 en','尺寸','分组']
checks.append('natural_geo has two cascaded four-level rows and one shared responsive header; history keys hidden')
click(article,'选择图标（leaf）');b.wait("Boolean(document.querySelector('input[aria-label=搜索图标]'))")
b.evaluate("(()=>{const e=document.querySelector('input[aria-label=搜索图标]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,'mountain');e.dispatchEvent(new Event('input',{bubbles:true}));})()")
b.click('山地 · mountain');b.wait("Boolean(document.querySelector("+json.dumps(article+' svg.lucide-mountain')+"))")
b.evaluate("document.querySelector("+json.dumps(article+' button[aria-label="配色 红"]')+").click()")
b.evaluate("(()=>{const e=document.querySelector("+json.dumps(article+' [data-setting-field=尺寸] select')+");Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(e,'44');e.dispatchEvent(new Event('change',{bubbles:true}));})()")
b.wait("document.querySelector("+json.dumps(article+' header button[aria-pressed=true]')+")?.style.width==='44px'")
assert b.evaluate("document.querySelector("+json.dumps(article+' header button[aria-pressed=true]')+").className.includes('bg-red-100')")
checks.append('lazy visual icon gallery, palette and actual 44px ToolIconButton update single and overall previews')
click(article,'添加显示内容');click('[data-application-section=buttons]','核验')
assert b.evaluate("document.querySelector('[data-application-section=buttons]').textContent.includes('Class 必填')")
b.evaluate("[...document.querySelector("+json.dumps(article)+").querySelectorAll('button')].filter(e=>e.textContent==='删除显示内容').pop().click()")
click('[data-application-section=buttons]','核验')
assert b.evaluate("document.querySelector('[data-application-section=buttons]').textContent.includes('核验通过')")
click('[data-application-section=buttons]','保存');b.wait("Boolean(document.querySelector('button[aria-label=\"Confirm application changes\"]'))||window.applicationAcceptance.snapshot().application.buttons.items.find(b=>b.id==='natural_geo').iconKey==='mountain'")
if b.evaluate("Boolean(document.querySelector('button[aria-label=\"Confirm application changes\"]'))"):b.evaluate("document.querySelector('button[aria-label=\"Confirm application changes\"]').click()")
b.wait("window.applicationAcceptance.snapshot().application.buttons.items.find(b=>b.id==='natural_geo').iconKey==='mountain'")
checks.append('empty Class blocks module validation; repaired paths and visuals save through the real transaction')
click('[data-application-section=buttons]','读取/编辑')
for width in [320,390,600,900,1440]:
 b.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':1000,'deviceScaleFactor':1,'mobile':False})
 assert not b.evaluate("[...document.querySelectorAll('[data-layer-buttons-editor] input,[data-layer-buttons-editor] select')].some(e=>{const r=e.getBoundingClientRect(),p=e.closest('article')?.getBoundingClientRect();return p&&r.width&&(r.right>p.right+2||r.left<p.left-2);})"),width
checks.append('header, range selectors and visual controls fit five widths')
b.evaluate('document.querySelector('+json.dumps(article)+').scrollIntoView()');b.screenshot('postc-buttons.png')
click('[data-application-section=buttons]','放弃草稿');assert not b.errors,b.errors
out=Path(os.environ['CAIRNMAP_ACCEPTANCE_OUT']);(out/'postc-buttons.json').write_text(json.dumps({'checks':checks,'runtime_errors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(checks,ensure_ascii=False));b.evaluate('window.applicationAcceptance.restoreDefault()');b.ws.close()
