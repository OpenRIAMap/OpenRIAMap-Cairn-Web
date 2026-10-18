"""Use a dedicated disposable browser profile; never touch the user's browser."""
import json
import time
from browser_check import Browser,APP_URL,OUT
b=Browser()
b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/subject-ui-acceptance.html?mode=general&resources=1&reset=1'})
time.sleep(.6)
b.wait('!!window.applicationAcceptance && !!document.querySelector("[role=tab]")')
b.evaluate('window.confirm=()=>true')
scope="document.querySelector('section[aria-label=\"工作流编辑区域\"]')"
def click(text,root='document'):
 b.evaluate(f"[...({root}).querySelectorAll('button')].find(e=>e.textContent.trim()==={json.dumps(text)}&&!e.disabled).click()")
 time.sleep(.15)
def value(label,text):
 b.evaluate(f"(()=>{{const e=document.querySelector('[aria-label='+JSON.stringify({json.dumps(label)})+']'),p=e.tagName==='SELECT'?HTMLSelectElement.prototype:e.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(p,'value').set.call(e,{json.dumps(text)});e.dispatchEvent(new Event(e.tagName==='SELECT'?'change':'input',{{bubbles:true}}));}})()")
 time.sleep(.15)
click('工作流设计')
value('已保存工作流','v3-rod_road')
click('读取',scope)
snapshot=b.evaluate('JSON.stringify(window.applicationAcceptance.snapshot())')
value('组装目标 1','MissingAuditTarget')
click('核验',scope)
detected=b.evaluate(f"({scope}).innerText.includes('workflow-assignment-target-invalid')||({scope}).innerText.includes('不是有效字段')")
assert detected
click('保存',scope)
assert b.evaluate('JSON.stringify(window.applicationAcceptance.snapshot())')==snapshot
b.screenshot('workflow-missing-target-blocked.png')
value('组装目标 1','Name')
b.evaluate("(()=>{const e=document.querySelector('input[aria-label=\"编辑用标准工作流\"]');if(e.checked)e.click();})()")
value('组装表达式 6','"not-a-number"')
click('核验',scope)
literal_gap=b.evaluate(f"({scope}).innerText.includes('工作流核验通过')")
assert literal_gap,'Re-check the reported expression gap: browser no longer agrees'
b.screenshot('workflow-literal-type-gap.png')
click('放弃草稿',scope)
assert b.evaluate('JSON.stringify(window.applicationAcceptance.snapshot())')==snapshot

# Separate history snapshots keep the active configuration unchanged. This profile was
# created solely for this audit and is distinct from the existing QA profile.
b.evaluate("""(async()=>{
 const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('cairnmap-config-lab-v32',1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
 await new Promise((resolve,reject)=>{const t=db.transaction('packages','readwrite'),s=t.objectStore('packages'),r=s.openCursor();r.onsuccess=()=>{const c=r.result;if(c){if(String(c.key).startsWith('revision:audit-history-package:'))c.delete();c.continue();}};t.oncomplete=resolve;t.onerror=()=>reject(t.error);});db.close();
})()""")
history=[]
for count in [1,10,25]:
 result=b.evaluate(f"""(async()=>{{
 const config=window.applicationAcceptance.snapshot();
 const db=await new Promise((resolve,reject)=>{{const r=indexedDB.open('cairnmap-config-lab-v32',1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);}});
 const start=performance.now();
 await new Promise((resolve,reject)=>{{const t=db.transaction('packages','readwrite'),s=t.objectStore('packages');s.put(structuredClone(config),'latest');for(let i=1;i<={count};i++)s.put({{...structuredClone(config),packageId:'audit-history-package',revision:i}},'revision:audit-history-package:'+i);t.oncomplete=resolve;t.onerror=()=>reject(t.error);}});db.close();
 const writeMs=performance.now()-start;
 const storage=await import('/src/configStudio/configLabStorage.ts');
 const t=performance.now(),packages=await storage.listConfigLabPackages();
 const listMs=performance.now()-t;
 const latestStart=performance.now();await storage.readRawConfigLatest();const latestReadMs=performance.now()-latestStart;
 return {{historyCount:{count},listedCount:packages.length,writeMs,listMs,latestReadMs}};
}})()""")
 history.append(result)
assert b.evaluate('JSON.stringify(window.applicationAcceptance.snapshot())')==snapshot
assert not b.errors,b.errors
result={'missingTargetErrorShown':detected,'saveInvalidTargetBlocked':True,'constantTypePreflightGapConfirmed':literal_gap,'invalidCssColorSupported':b.evaluate("CSS.supports('color','not-a-color')"),'activeConfigUnchanged':True,'history':history,'runtimeErrors':b.errors}
(OUT/'browser-preflight-and-history.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False))
