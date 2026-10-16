"""Dedicated disposable Edge profile. No user browser or production storage."""
import json,time
from browser_check import Browser,APP_URL,OUT
b=Browser()
b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/subject-ui-acceptance.html?mode=general&resources=1&reset=1'})
time.sleep(.7)
b.wait('!!window.applicationAcceptance && !!document.querySelector("[role=tab]")')
b.evaluate('window.confirm=()=>true')
scope='document.querySelector(\'section[aria-label="工作流编辑区域"]\')'
def click(text,root='document'):
 b.evaluate(f"void([...({root}).querySelectorAll('button')].find(e=>e.textContent.trim()==={json.dumps(text)}&&!e.disabled).click())")
 time.sleep(.15)
def value(label,text):
 b.evaluate(f"(()=>{{const e=document.querySelector('[aria-label='+JSON.stringify({json.dumps(label)})+']'),p=e.tagName==='SELECT'?HTMLSelectElement.prototype:e.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(p,'value').set.call(e,{json.dumps(text)});e.dispatchEvent(new Event(e.tagName==='SELECT'?'change':'input',{{bubbles:true}}));}})()")
 time.sleep(.15)
click('工作流设计');value('已保存工作流','v3-rod_road');click('读取',scope)
snapshot=b.evaluate('JSON.stringify(window.applicationAcceptance.snapshot())')
value('组装表达式 6','"not-a-number"')
click('核验',scope)
b.wait(f"({scope}).innerText.includes('workflow-expression-type-conflict')||({scope}).innerText.includes('需要 单值 number')")
click('保存',scope)
assert b.evaluate('JSON.stringify(window.applicationAcceptance.snapshot())')==snapshot
b.screenshot('workflow-expression-blocked.png')
value('组装表达式 6','F');click('核验',scope)
assert b.evaluate(f"({scope}).innerText.includes('工作流核验通过')")
click('放弃草稿',scope)
assert b.evaluate('JSON.stringify(window.applicationAcceptance.snapshot())')==snapshot
# Low-level fixtures model many saved snapshots without repeated activation.
b.evaluate("""(async()=>{window.repairBase=structuredClone(window.applicationAcceptance.snapshot());window.rs=await import('/src/configStudio/configLabStorage.ts');window.rt=await import('/src/configStudio/runtime.ts');window.fixture=async(count,legacy=false)=>{
 const open=()=>new Promise((resolve,reject)=>{const r=indexedDB.open('cairnmap-config-lab-v32',2);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});const db=await open();
 await new Promise((resolve,reject)=>{const t=db.transaction(['packages','history-summaries'],'readwrite'),s=t.objectStore('packages'),m=t.objectStore('history-summaries');s.clear();m.clear();s.put(repairBase,'latest');s.put({kind:'default'},'active-choice');for(let i=1;i<=count;i++){const key='revision:repair-history:'+i;s.put({...repairBase,packageId:'repair-history',revision:i},key);if(!legacy)m.put({key,packageId:'repair-history',projectId:repairBase.projectId,revision:i,displayName:repairBase.displayName,savedAt:'',sha256:'fixture',validation:'unchecked'});}if(!legacy)s.put({done:true},'history-summary-backfill');t.oncomplete=resolve;t.onerror=()=>reject(t.error);});db.close();};})()""")
history=[]
for count in [1,10,25,100]:
 b.evaluate(f'fixture({count})')
 row=b.evaluate("""(async()=>{const before=rt.configPreflightStats(),t=performance.now(),page=await rs.listConfigLabPackageSummaries(),listMs=performance.now()-t,after=rt.configPreflightStats();let pages=1,total=page.items.length,next=page.next;while(next){const p=await rs.listConfigLabPackageSummaries({after:next});pages++;total+=p.items.length;next=p.next;}const readStart=performance.now(),raw=await rs.readConfigLabHistoryRaw(page.items[0].key),readMs=performance.now()-readStart,parseStart=performance.now(),config=JSON.parse(raw),parseMs=performance.now()-parseStart,validateStart=performance.now(),report=rt.validateConfigPackage(config),validateMs=performance.now()-validateStart,compileStart=performance.now();rt.compileConfigRuntime(config,true);const compileMs=performance.now()-compileStart,selectedBefore=rt.configPreflightStats();await rs.loadConfigLabHistory(page.items[0].key);const selectedAfter=rt.configPreflightStats();return {count:total,firstPage:page.items.length,pages,listMs,readMs,parseMs,validateMs,compileMs,valid:report.valid,listValidations:after.packageValidations-before.packageValidations,listCompilations:after.compilations-before.compilations,selectedValidations:selectedAfter.packageValidations-selectedBefore.packageValidations,selectedCompilations:selectedAfter.compilations-selectedBefore.compilations};})()""")
 assert row['count']==count and row['listValidations']==0 and row['listCompilations']==0,row
 assert row['selectedValidations']==1 and row['selectedCompilations']==1,row
 if count==25:assert row['listMs']<1000,row
 history.append(row)
# Recreate a genuine old database, including invalid/unknown snapshots.
legacy=b.evaluate("""(async()=>{await new Promise((resolve,reject)=>{const r=indexedDB.deleteDatabase('cairnmap-config-lab-v32');r.onsuccess=resolve;r.onerror=()=>reject(r.error);});const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('cairnmap-config-lab-v32',1);r.onupgradeneeded=()=>r.result.createObjectStore('packages');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});await new Promise((resolve,reject)=>{const t=db.transaction('packages','readwrite'),s=t.objectStore('packages');s.put(repairBase,'latest');for(let i=1;i<=25;i++)s.put({...repairBase,packageId:'legacy-history',revision:i,...(i===25?{contractRevision:999}:{})},'revision:legacy-history:'+i);t.oncomplete=resolve;t.onerror=()=>reject(t.error);});db.close();const before=rt.configPreflightStats(),t=performance.now();await rs.readRawConfigLatest();const latestReadMs=performance.now()-t;let page=await rs.listConfigLabPackageSummaries(),firstCount=page.items.length,batches=1;while(page.pendingBackfill){page=await rs.listConfigLabPackageSummaries();batches++;}const after=rt.configPreflightStats(),unknown=page.items.find(item=>item.revision===25);let rejected=false;try{await rs.loadConfigLabHistory(unknown.key);}catch{rejected=true;}const retained=JSON.parse(await rs.readConfigLabHistoryRaw(unknown.key)).contractRevision===999;return {latestReadMs,firstCount,batches,total:page.items.length,rejected,retained,listValidations:after.packageValidations-before.packageValidations,listCompilations:after.compilations-before.compilations};})()""")
assert legacy['firstCount']<=8 and legacy['batches']>=4 and legacy['total']==25 and legacy['rejected'] and legacy['retained'] and legacy['listValidations']==0 and legacy['listCompilations']==0,legacy
atomic=b.evaluate("""(async()=>{const base={...repairBase,packageId:'atomic-history',revision:1};await rs.saveConfigLabPackage(base,{kind:'custom'});const before=await rs.readRawConfigLatest(),expected={config:base,kind:'custom'};let collision=false;try{await rs.saveConfigLabPackage({...base,displayName:{zh:'collision',en:''}},{kind:'default'});}catch{collision=true;}const unchanged=before===await rs.readRawConfigLatest(),choice=await rs.readActiveConfigChoice(),results=await Promise.allSettled([rs.saveConfigLabPackage({...base,revision:2},{kind:'custom'},false,expected),rs.saveConfigLabPackage({...base,revision:3},{kind:'custom'},false,expected)]),latest=JSON.parse(await rs.readRawConfigLatest()),page=await rs.listConfigLabPackageSummaries(),summary=page.items.find(item=>item.packageId===latest.packageId&&item.revision===latest.revision);return {collision,unchanged,choiceUnchanged:choice.kind==='custom',oneWinner:results.filter(r=>r.status==='fulfilled').length===1,summaryAtomic:summary?.validation==='validated'&&summary.sha256.length===64};})()""")
assert all(atomic.values()),atomic
assert b.evaluate('JSON.stringify(window.applicationAcceptance.snapshot())')==snapshot
assert not b.errors,b.errors
result={'expressionErrorShown':True,'invalidSaveBlocked':True,'correctionUnblocked':True,'activeConfigUnchanged':True,'history':history,'legacyUpgrade':legacy,'atomicSave':atomic,'runtimeErrors':b.errors}
(OUT/'browser-repair-results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(result,ensure_ascii=False))
