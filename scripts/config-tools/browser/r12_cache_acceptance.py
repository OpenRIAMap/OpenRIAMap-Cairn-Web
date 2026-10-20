import json,time
from browser_check import Browser,APP_URL,OUT
b=Browser();checks=[]
def cache(action):
    return b.evaluate("""new Promise((resolve,reject)=>{const request=indexedDB.open('cairnmap-formal-configuration-v2',1);request.onerror=()=>reject(request.error);request.onsuccess=()=>{const db=request.result,tx=db.transaction('verified-snapshots','readwrite'),store=tx.objectStore('verified-snapshots'),get=store.get('active');get.onsuccess=()=>{let record=get.result;"""+action+"""};tx.oncomplete=()=>{db.close();resolve(true);};tx.onerror=()=>reject(tx.error);};})""")
def reload(expect_map=True):
    prior=b.evaluate('performance.timeOrigin');b.call('Page.navigate',{'url':APP_URL+'/?cacheProbe='+str(time.time())});b.wait('performance.timeOrigin!=='+str(prior),10)
    if expect_map:b.wait("performance.getEntriesByName('cairn:formal-ready').length>0&&!!document.querySelector('.leaflet-container')",40)
    else:b.wait("!!document.querySelector('[role=alert]')&&!document.querySelector('.leaflet-container')",15)
    time.sleep(.3)
try:
    b.call('Page.navigate',{'url':APP_URL+'/?refreshConfiguration=1'});b.wait("performance.getEntriesByName('cairn:formal-ready').length>0&&!!document.querySelector('.leaflet-container')",40);time.sleep(.5)
    reload()
    cache("if(!record)throw Error('cache missing');if(Object.keys(record).sort().join(',')!=='bytes,identity,receipt,savedAt')throw Error('unexpected persistent indexes');record.receipt.validatorFingerprint='0'.repeat(64);store.put(record,'active');")
    reload();assert not b.evaluate("performance.getEntriesByName('cairn:formal-verified').at(-1).detail.reused")
    checks.append('changed validator receipt performs full verification; only raw bytes/identity/receipt/time persisted')
    cache("record.bytes[0]^=1;store.put(record,'active');")
    reload();assert b.evaluate("performance.getEntriesByType('resource').some(e=>e.name.includes('/configuration/releases/')&&e.name.endsWith('/config.json'))")
    checks.append('corrupt raw bytes fail hash check and recover from controlled Web resource')
    script=b.call('Page.addScriptToEvaluateOnNewDocument',{'source':"(()=>{const open=IDBFactory.prototype.open;IDBFactory.prototype.open=function(name,...rest){if(name==='cairnmap-formal-configuration-v2')throw new DOMException('test denied','SecurityError');return open.call(this,name,...rest);};})();"})['identifier']
    reload();b.call('Page.removeScriptToEvaluateOnNewDocument',{'identifier':script})
    checks.append('denied formal cache reads/writes do not block a verified Web configuration')
    b.call('Network.enable');b.call('Network.setBlockedURLs',{'urls':['*configuration/current.json','*configuration/releases/*']})
    reload();b.wait("document.body.innerText.includes('静态版本暂未确认')",15)
    checks.append('offline Web static metadata uses verified cache with a visible warning')
    cache("store.delete('active');")
    reload(False);assert not b.evaluate("performance.getEntriesByName('cairn:formal-ready').length")
    checks.append('no valid cache and offline Web cannot activate unknown config; explicit retry error shown')
    b.call('Network.setBlockedURLs',{'urls':[]});reload()
    assert not b.evaluate("performance.getEntriesByType('resource').some(e=>e.name.includes('/api/configuration'))")
    assert not b.errors,b.errors
    b.screenshot('cache-recovery-map.png')
    (OUT/'r12-cache-results.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors,'businessWritesPerformed':False},ensure_ascii=False,indent=2),encoding='utf-8')
    print('r12 cache browser: '+str(len(checks))+' recovery groups passed',flush=True)
except Exception:
    b.screenshot('cache-failure.png');(OUT/'r12-cache-failure.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors,'body':b.evaluate('document.body.innerText')[-4000:]},ensure_ascii=False,indent=2),encoding='utf-8');raise
finally:
    b.call('Network.setBlockedURLs',{'urls':[]});b.ws.close()
