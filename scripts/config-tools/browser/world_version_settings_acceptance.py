"""Use the real Settings card and modal; delay remote status after a local refresh."""
import json
from browser_check import Browser, APP_URL, OUT

assert APP_URL.startswith('http://127.0.0.1:')
b=Browser()
b.call('Page.navigate',{'url':APP_URL+'/scripts/browser/fixtures/world-version-settings.html'})
b.wait('Boolean(window.worldVersionSettingsFixture)',40)
card="[...document.querySelectorAll('details')].find(e=>e.textContent.includes('data-eden-first')).parentElement"
versions="[...("+card+").querySelectorAll('span[title^=\"正式版本：\"]')].map(e=>e.textContent.trim())"
b.wait('(()=>{try{return JSON.stringify('+versions+')===JSON.stringify(["24","24"])}catch{return false}})()',40)
b.evaluate("("+card+").querySelector('details').open=true")
b.wait("[...("+card+").querySelectorAll('button')].some(e=>e.textContent==='调拨当前版本')")
b.click('调拨当前版本')
b.wait("Boolean(document.querySelector('[aria-label=\"世界版本管理\"]'))")
b.evaluate("(()=>{const e=document.querySelector('textarea[aria-label=\"调整原因\"]');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(e,'首次采集编号修正');e.dispatchEvent(new Event('input',{bubbles:true}));})()")
b.click('预检')
b.wait("[...document.querySelectorAll('button')].some(e=>e.textContent==='确认执行'&&!e.disabled)")
b.click('确认执行')
b.wait("document.body.innerText.includes('确认调拨世界版本')")
b.evaluate("[...document.querySelectorAll('button')].filter(e=>e.textContent==='确认执行'&&!e.disabled).at(-1).click()")
b.wait("document.body.innerText.includes('已排队')")
b.click('查询进度')
b.wait("document.body.innerText.includes('任务已完成')",40)
result={'versions':b.evaluate(versions),'localStoreVersion':b.evaluate('window.worldVersionSettingsFixture.localVersion()'),'runtimeErrors':b.errors}
(OUT/'world-version-settings-result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
b.screenshot('world-version-settings-refreshed.png')
assert result['localStoreVersion']==1,result
assert result['versions']==['1','1'],result
assert not b.errors,b.errors
print(json.dumps({'passed':'actual Settings card keeps both remote and local versions at 1 after the delayed refresh response',**result},ensure_ascii=False))
