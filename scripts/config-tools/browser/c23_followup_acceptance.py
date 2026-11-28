"""Local-only UI regressions for live mounted candidates and delayed lab bootstrap."""
import json,os,time
from pathlib import Path
from urllib.request import build_opener,ProxyHandler,Request
from browser_check import Browser,APP_URL,OUT

assert APP_URL.startswith('http://127.0.0.1:')
opener=build_opener(ProxyHandler({}));port=os.environ['CAIRNMAP_CDP_PORT']
tab=json.loads(opener.open(Request('http://127.0.0.1:'+port+'/json/new?about:blank',method='PUT')).read())
os.environ['CAIRNMAP_CDP_TARGET']=tab['id']
b=Browser();checks=[]
try:
 b.call('Page.navigate',{'url':APP_URL+'/scripts/browser/fixtures/c23-assist.html'})
 b.wait('document.querySelector("input")!==null',45)
 b.evaluate('(()=>{const e=document.querySelector("input");Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set.call(e,"LOCAL_C23");e.dispatchEvent(new Event("input",{bubbles:true}));})()')
 b.wait('document.body.innerText.includes("没有匹配")')
 b.click('Mount sample');b.wait('document.querySelectorAll("[role=option]").length===1')
 assert b.evaluate('document.querySelector("input").value')=='LOCAL_C23'
 b.click('LOCAL_C23（临时道路）ROD/PRI');assert b.evaluate('document.querySelector("output").textContent')==''
 b.click('应用');assert b.evaluate('document.querySelector("output").textContent')=='world:local:1'
 b.click('Unmount sample');b.wait('document.querySelectorAll("[role=option]").length===0')
 b.click('应用');b.wait('document.body.innerText.includes("目标已卸除")')
 checks.append('unchanged query refreshes after mount/unmount; selection waits for Apply and stale target is rejected')
 b.call('Page.addScriptToEvaluateOnNewDocument',{'source':'''if(window===window.top){const original=window.fetch.bind(window);let release;const gate=new Promise(resolve=>release=resolve);window.releaseLabBootstrap=release;window.fetch=async(...args)=>{const response=await original(...args);if(new URL(String(args[0]),location.href).pathname==='/configuration/current.json')await gate;return response;};}'''})
 b.call('Page.navigate',{'url':APP_URL+'/scripts/browser/fixtures/c23-lab.html'})
 b.wait('document.querySelector("input[type=file]")!==null',45)
 pointer=json.loads((Path.cwd()/'public/configuration/current.json').read_text(encoding='utf-8'))
 package=Path.cwd()/'public'/pointer['configUrl'].lstrip('/')
 b.call('DOM.enable');doc=b.call('DOM.getDocument')['root']['nodeId'];node=b.call('DOM.querySelector',{'nodeId':doc,'selector':'input[type=file]'})['nodeId']
 b.call('DOM.setFileInputFiles',{'nodeId':node,'files':[str(package.resolve())]})
 b.wait('document.body.innerText.includes("已添加实验室版本")',60)
 chosen=b.evaluate('document.querySelector("select").value');assert chosen!='formal'
 b.evaluate('window.releaseLabBootstrap()')
 b.wait('document.querySelector("select").options.length===2',60)
 assert b.evaluate('document.querySelector("select").value')==chosen
 assert b.evaluate('document.body.innerText.includes("已添加实验室版本")')
 checks.append('late formal configuration preserves the imported lab choice and admission message')
 assert not b.errors,b.errors
 (OUT/'c23-followup-browser.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8')
 print(json.dumps(checks,ensure_ascii=False))
finally:b.ws.close()
