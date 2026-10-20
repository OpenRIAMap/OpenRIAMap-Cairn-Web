"""Initial visit + 20 real production reloads; configuration ready and actual configured map, not the loading shell."""
import json,time,math,os
from browser_check import Browser,APP_URL,OUT
b=Browser();rows=[]
script="""(()=>{window.__r12Startup={origin:performance.timeOrigin,mapAt:null};const inspect=()=>{if(document.querySelector('.leaflet-container')&&document.body.innerText.includes('零洲'))window.__r12Startup.mapAt??=performance.now();};new MutationObserver(inspect).observe(document,{childList:true,subtree:true,characterData:true});document.addEventListener('DOMContentLoaded',inspect);})();"""
try:
    b.call('Page.addScriptToEvaluateOnNewDocument',{'source':script})
    b.call('Network.enable')
    for index in range(21):
        prior=b.evaluate('performance.timeOrigin')
        b.call('Page.navigate',{'url':APP_URL+'/?startupProbe='+str(index)+('&refreshConfiguration=1' if index==0 and os.environ.get('CAIRNMAP_STARTUP_REFRESH')=='1' else '')})
        b.wait('performance.timeOrigin!=='+str(prior)+'&&!!window.__r12Startup?.mapAt&&performance.getEntriesByName("cairn:formal-ready").length>0',40)
        row=b.evaluate(r"""(()=>{const ready=performance.getEntriesByName('cairn:formal-ready').at(-1),start=performance.getEntriesByName('cairn:formal-start').at(-1),verified=performance.getEntriesByName('cairn:formal-verified').at(-1);return {navigationToConfiguredMapMs:window.__r12Startup.mapAt,configurationBlockingMs:ready.startTime-start.startTime,formalReadyMs:ready.startTime,verifiedReceiptReused:verified.detail.reused,identity:ready.detail,configurationRequests:performance.getEntriesByType('resource').filter(e=>/\/api\/configuration/.test(e.name)).map(e=>e.name),configDownloads:performance.getEntriesByType('resource').filter(e=>/\/configuration\/releases\/.*config.json/.test(e.name)).map(e=>({name:e.name,duration:e.duration,transferSize:e.transferSize})),fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime,mapCount:document.querySelectorAll('.leaflet-container').length,oldVerificationOverlay:document.body.innerText.includes('正在核验正式配置')};})()""")
        row['visit']='initial' if index==0 else 'warm-'+str(index);rows.append(row)
        assert not row['configurationRequests'],'ordinary startup must never call SCF-backed configuration API'
        assert row['identity']['revision']==int(os.environ.get('CAIRNMAP_EXPECT_REVISION','9')) and row['identity']['contractRevision']==int(os.environ.get('CAIRNMAP_EXPECT_CONTRACT','11'))
        assert not row['oldVerificationOverlay']
        if index:assert row['verifiedReceiptReused'] and not row['configDownloads'],row
        time.sleep(.2 if index else 1)
        if index%5==0:print('Startup measurements '+str(index)+'/20 warm reloads',flush=True)
    warm=rows[1:]
    def stats(key):
        values=sorted(r[key] for r in warm);return {'p50':values[len(values)//2],'p95':values[math.ceil(len(values)*.95)-1],'max':max(values)}
    result={'scope':'local Vite production preview, isolated Chrome, static deployed identity (see rows); configured Leaflet map and world buttons observed; data download is a separate later phase','rows':rows,'configurationBlockingMs':stats('configurationBlockingMs'),'navigationToConfiguredMapMs':stats('navigationToConfiguredMapMs'),'runtimeErrors':b.errors,'scfConfigurationRequests':0,'indexesPersisted':False}
    (OUT/os.environ.get('CAIRNMAP_STARTUP_RESULT','r12-startup-results.json')).write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({k:result[k] for k in ['configurationBlockingMs','navigationToConfiguredMapMs','scfConfigurationRequests','runtimeErrors']},ensure_ascii=False),flush=True)
    b.screenshot('production-map-warm.png')
except Exception:
    (OUT/'r12-startup-failure.json').write_text(json.dumps({'rows':rows,'runtimeErrors':b.errors,'body':b.evaluate('document.body.innerText')},ensure_ascii=False,indent=2),encoding='utf-8');raise
finally:b.ws.close()
