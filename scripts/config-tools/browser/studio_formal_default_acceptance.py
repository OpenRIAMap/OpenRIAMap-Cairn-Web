"""Run only in a disposable local CDP profile; no login or cloud writes."""
import json
import os
from browser_check import Browser, OUT, APP_URL

assert os.environ.get('CAIRNMAP_CDP_PORT') == '9501', 'Use the isolated formal-default acceptance profile'
b = Browser()
checks = []

def active():
    return b.evaluate("(async()=>{const p=await import('/src/configStudio/defaultConfigProvider.ts');const c=p.getActiveConfigSnapshot();return {revision:c.revision,contract:c.contractRevision,raw:JSON.stringify(c)}})()")

def navigate():
    b.call('Page.navigate', {'url': APP_URL + '/?workspace=config-studio&tab=features'})
    b.wait("Boolean(document.querySelector('nav[aria-label=\"设计工作区\"]')) || Array.from(document.querySelectorAll('button')).some(x=>x.textContent.includes('下载并启用'))", 40)
    if b.evaluate("Array.from(document.querySelectorAll('button')).some(x=>x.textContent.includes('下载并启用'))"):
        b.click('下载并启用')
    b.wait("document.querySelector('main header p')?.textContent.includes('配置 r')", 40)

def persist_seed(revision=None):
    return b.evaluate("(async()=>{const p=await import('/src/configStudio/defaultConfigProvider.ts');const c=await(await fetch('/src/configStudio/defaults/r11-r7.config.json')).json();" + (f'c.revision={revision};' if revision else '') + "await p.persistActiveConfig(c);return JSON.stringify(p.getActiveConfigSnapshot())})()")

try:
    # Block external HTTPS at the browser network layer before navigation,
    # including the existing site's telemetry script and its send endpoint.
    # Only the local HTTP Vite origin is needed for this acceptance.
    b.call('Network.enable')
    b.call('Network.setBlockedURLs', {'urls': ['https://*', 'http://analysis.602007.xyz/*']})
    b.call('DOMStorage.enable')
    b.call('DOMStorage.clear', {'storageId': {'securityOrigin': APP_URL, 'isLocalStorage': False}})
    b.call('Page.navigate', {'url': 'about:blank'})
    b.call('Storage.clearDataForOrigin', {'origin': APP_URL, 'storageTypes': 'all'})
    # Instrument only this disposable page, including reloads. Formal reads are
    # local Vite static files; all business/API requests are forbidden.
    b.call('Page.addScriptToEvaluateOnNewDocument', {'source': """
      (()=>{const originalFetch=window.fetch.bind(window);window.testRequests=[];
      window.fetch=async (input,options)=>{
        const url=String(input);window.testRequests.push(url);
        if(new URL(url,location.href).origin!==location.origin)throw Error('External request forbidden in default acceptance');
        if(url.startsWith('/api/'))throw Error('Business request forbidden in default acceptance');
        const mode=sessionStorage.getItem('studio-test-mode');
        if(url==='/configuration/current.json'&&mode==='offline')return new Response('{}',{status:503});
        if(url.startsWith('/configuration/releases/')&&mode==='corrupt')return new Response('corrupt');
        return originalFetch(input,options);
      };})();
    """})
    navigate()
    expected = b.evaluate("(async()=>await(await fetch('/configuration/current.json')).json())()")
    assert active()['contract'] == expected['contractRevision']
    assert active()['revision'] == expected['revision']
    assert not b.evaluate("document.body.innerText.includes('迁移到 r13 草稿')")
    checks.append('fresh workbench opens the current formal configuration, not the historical seed')

    old_raw = persist_seed()
    navigate()
    assert active()['contract'] == 11
    assert b.evaluate("document.body.innerText.includes('迁移到 r13 草稿')")
    b.click('恢复当前正式配置')
    b.wait("document.querySelector('main header p')?.textContent.includes('契约 r' + " + str(expected['contractRevision']) + ")", 40)
    assert active()['revision'] == expected['revision']
    assert not b.evaluate("document.body.innerText.includes('迁移到 r13 草稿')")
    recovered = b.evaluate("(async()=>{const p=await import('/src/configStudio/defaultConfigProvider.ts');const s=await import('/src/configStudio/configLabStorage.ts');const rows=await p.getConfigRecoveries();return await Promise.all(rows.filter(x=>x.source==='before-restore-default').map(x=>s.readConfigRecovery(x.key)))})()")
    assert any(row['raw'] == old_raw for row in recovered)
    navigate()
    assert active()['contract'] == expected['contractRevision']
    checks.append('actual restore button upgrades r7/r11 to formal contract, preserves exact local backup and survives refresh')

    persist_seed()
    navigate()
    before = active()['raw']
    for mode, message in [('offline', '503'), ('corrupt', '摘要')]:
        b.evaluate('sessionStorage.setItem("studio-test-mode",' + json.dumps(mode) + ')')
        b.click('恢复当前正式配置')
        b.wait('document.body.innerText.includes(' + json.dumps(message) + ')', 40)
        assert active()['raw'] == before
        assert b.evaluate("(async()=>{const s=await import('/src/configStudio/configLabStorage.ts');return (await s.readActiveConfigChoice()).kind})()") == 'custom'
        assert b.evaluate("!Array.from(document.querySelectorAll('button')).find(x=>x.textContent==='恢复当前正式配置').disabled")
    checks.append('HTTP and digest failures retain active bytes and durable selection; restore button is retryable')

    # A custom local edit remains available while the Web is unreachable.
    b.evaluate("sessionStorage.setItem('studio-test-mode','offline')")
    navigate()
    assert active()['raw'] == before
    checks.append('offline reopening preserves an explicitly selected local edit')
    b.evaluate("sessionStorage.removeItem('studio-test-mode')")
    b.click('恢复当前正式配置')
    b.wait("document.querySelector('main header p')?.textContent.includes('契约 r' + " + str(expected['contractRevision']) + ")", 40)

    # The current formal revision may collide with a different old local tree.
    # Keep history immutable and allocate beyond it when saving a default copy.
    collision_raw = persist_seed(expected['revision'])
    b.evaluate("(async()=>{const p=await import('/src/configStudio/defaultConfigProvider.ts');await p.restoreApplicationDefault();const c=await p.persistActiveConfig(await p.loadDefaultConfig());if(c.revision<=" + str(expected['revision']) + ")throw Error('Revision collision was not resolved')})()")
    stored = b.evaluate("(async()=>{const s=await import('/src/configStudio/configLabStorage.ts');return s.readConfigLabHistoryRaw('revision:' + " + json.dumps(expected['packageId']) + " + ':' + " + str(expected['revision']) + ")})()")
    assert json.loads(stored) == json.loads(collision_raw)
    checks.append('saving a formal default resolves a revision collision without overwriting old history')

    # Simulate an unfinished default-based edit made before a new publication.
    # Leave the editor first, so its legitimate pagehide flush cannot overwrite
    # a fixture pretending to have been saved by an earlier browser session.
    b.call('Page.navigate', {'url': APP_URL + '/scripts/browser/fixtures/studio-formal-default.html'})
    b.wait("document.title==='Studio storage acceptance'")
    b.evaluate("(async()=>{const s=await import('/src/configStudio/configLabStorage.ts');const c=await(await fetch('/src/configStudio/defaults/r11-r7.config.json')).json();await s.saveStudioEditingSession({baseline:c,draft:null,tree:null,selectedId:'',editing:false,engineDraft:{baseline:c.engine,value:c.engine}});await s.saveActiveConfigChoice({kind:'default'})})()")
    navigate()
    assert active()['contract'] == 11, 'unfinished draft keeps its original baseline'
    assert b.evaluate("Array.from(document.querySelectorAll('button')).find(x=>x.textContent==='恢复当前正式配置').disabled")
    rejection = b.evaluate("(async()=>{const p=await import('/src/configStudio/defaultConfigProvider.ts');try{await p.restoreApplicationDefault();return ''}catch(e){return String(e)}})()")
    assert '草稿' in rejection
    assert b.evaluate("(async()=>{const s=await import('/src/configStudio/configLabStorage.ts');return Boolean((await s.readStudioEditingSession()).engineDraft)})()")
    checks.append('unfinished default-based draft retains its baseline; UI and provider both block destructive restore')
    b.screenshot('studio-formal-default-draft-protection.png')

    b.evaluate("(async()=>{const p=await import('/src/configStudio/defaultConfigProvider.ts');await p.persistStudioEditingSession(null);await p.restoreApplicationDefault()})()")
    navigate()
    b.screenshot('studio-formal-default-current.png')
    assert not b.errors, b.errors
    result = {'checks': checks, 'formalIdentity': expected, 'runtimeErrors': b.errors, 'cloudWrites': 0}
    (OUT / 'studio-formal-default-browser.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(result, ensure_ascii=False))
finally:
    b.ws.close()
