import json,time
from pathlib import Path
from browser_check import Browser,APP_URL,OUT
from sync01_transport import install
install();b=Browser()
class Checks(list):
 def append(self,value):super().append(value);print(value,flush=True)
checks=Checks()
b.call('Page.addScriptToEvaluateOnNewDocument',{'source':'window.confirm=()=>true'})
def click(text):
 b.evaluate(f"void([...document.querySelectorAll('button')].find(e=>e.textContent.trim()==={json.dumps(text)}&&!e.disabled).click())")
def go(query):
 b.call('Page.navigate',{'url':APP_URL+'/'+query});time.sleep(.5)
def snapshot():return b.evaluate("(async()=>{const p=await import('/src/configStudio/defaultConfigProvider.ts'),s=await import('/src/configStudio/configLabStorage.ts');return {active:JSON.stringify(p.getActiveConfigSnapshot()),latest:await s.readRawConfigLatest()};})()")
def upload(file):
 root=b.call('DOM.getDocument')['root']['nodeId'];node=b.call('DOM.querySelector',{'nodeId':root,'selector':'header input[type=file]'})['nodeId'];b.call('DOM.setFileInputFiles',{'nodeId':node,'files':[str(Path(file).resolve())]})
go('?workspace=config-studio&configMode=v3');b.wait("!!document.querySelector('header input[type=file]')")
b.evaluate('window.confirm=()=>true')
before=snapshot()
upload('migration-runs/release-repair-20261017/import-fixtures/invalid-manifest.zip')
b.wait("document.body.innerText.includes('不支持此配置 manifest 版本')")
assert snapshot()==before
checks.append('actual file-input rejects unknown ZIP manifest; active and durable latest unchanged')
# Simulate slow disk I/O, preserving the original bytes and real import handler.
b.evaluate("window.originalRepairRead=File.prototype.arrayBuffer;File.prototype.arrayBuffer=function(){const file=this;return new Promise((resolve,reject)=>setTimeout(()=>originalRepairRead.call(file).then(resolve,reject),1200));}")
upload('migration-runs/release-repair-20261017/import-fixtures/cancel-repair.zip')
b.wait("[...document.querySelectorAll('button')].some(e=>e.textContent==='取消导入')")
assert b.evaluate("[...document.querySelectorAll('header button')].find(e=>e.textContent.trim()==='导入').disabled")
click('取消导入');b.wait("document.body.innerText.includes('已取消本次导入')")
b.evaluate('File.prototype.arrayBuffer=window.originalRepairRead')
assert snapshot()==before
checks.append('visible Cancel during delayed disk read cancels only this import; active/latest unchanged')
upload('src/configStudio/defaults/r8-r4.config.json')
b.wait("document.querySelector('main header p')?.textContent.includes('契约 r8')",40)
assert b.evaluate("(async()=>{const p=await import('/src/configStudio/defaultConfigProvider.ts');return p.getActiveConfigSnapshot().nodes.length===95;})()")
checks.append('actual Studio reads, validates and saves original r8 JSON; 95 nodes retained')
click('恢复应用默认配置')
b.wait("document.querySelector('main header p')?.textContent.includes('契约 r11')",40)
b.evaluate('window.confirm=()=>true')
upload('docs/90_roadmap-and-history/runtime-v32-release-repair-20261017/r11-r7.initial.cairn-config-v3.zip')
b.wait("document.body.innerText.includes('已导入 cairnmap-config-v32-semantic r7')",40)
checks.append('frozen initial r11 ZIP imports through real Studio handler after old-file restoration')
go('?workspace=config-lab&configMode=v3');b.wait("document.body.innerText.includes('已加载活动 V3 配置')",40)
b.wait("[...document.querySelectorAll('header select option')].some(e=>e.value==='legacy-history:25')")
first=b.evaluate("document.querySelector('header select')?.options.length")
b.wait("[...document.querySelectorAll('button')].some(e=>e.textContent==='更多历史版本')")
click('更多历史版本');b.wait(f"document.querySelector('header select').options.length>{first}")
checks.append('actual Lab More history button appends next summary page')
before=snapshot()
b.evaluate("(()=>{const s=document.querySelector('header select');s.value='legacy-history:25';s.dispatchEvent(new Event('change',{bubbles:true}));})()")
b.wait("[...document.querySelectorAll('button')].some(e=>e.textContent==='下载原文诊断')")
assert snapshot()==before
checks.append('selecting preserved unknown history fails safely and offers raw diagnostic download')
b.evaluate("(()=>{const s=document.querySelector('header select');s.value='legacy-history:24';s.dispatchEvent(new Event('change',{bubbles:true}));})()")
b.wait("document.body.innerText.includes('已切换活动版本 legacy-history r24')",40)
go('?workspace=config-lab&configMode=v3')
b.wait("document.body.innerText.includes('已加载活动 V3 配置 legacy-history r24')",40)
checks.append('selected valid history survives full reload, then can restore application default')
click('恢复应用默认配置');b.wait("document.body.innerText.includes('已加载活动 V3 配置 cairnmap-config-v32-semantic r7')",40)
b.screenshot('history-pagination-and-default-restored.png')
assert not b.errors,b.errors
result={'checks':checks,'runtimeErrors':b.errors}
(OUT/'browser-import-history-ui.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(json.dumps(result,ensure_ascii=False))
