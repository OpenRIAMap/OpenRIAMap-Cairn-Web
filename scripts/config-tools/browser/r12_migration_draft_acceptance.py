"""Exercise the real Studio migration controls in an isolated browser profile."""
import json
from browser_check import Browser, OUT, APP_URL

b = Browser()
checks = []
toolbar = """document.querySelector('[aria-label="整包草稿操作"]')"""


def select_class(code):
    b.evaluate("""(() => {
      const el=document.querySelector('select[aria-label="编辑分类 Class"]');
      if(el.matches(':disabled'))throw Error('Package draft category picker is locked');
      el.value=""" + json.dumps(code) + ";el.dispatchEvent(new Event('change',{bubbles:true}));return true;})()")
    b.wait("document.querySelector('select[aria-label=\"编辑分类 Class\"]').value===" + json.dumps(code))


def active():
    return b.evaluate("(async()=>{const p=await import('/src/configStudio/defaultConfigProvider.ts');return p.getActiveConfigSnapshot();})()")


def session_absent():
    b.wait("(async()=>{const s=await import('/src/configStudio/configLabStorage.ts');return !(await s.readStudioEditingSession());})()")


try:
    b.call('Page.navigate', {'url': APP_URL + '/?workspace=config-studio'})
    b.wait("!!document.querySelector('nav[aria-label=\"设计工作区\"]') || [...document.querySelectorAll('button')].some(e=>e.textContent==='下载并启用')", 60)
    if not b.evaluate("!!document.querySelector('nav[aria-label=\"设计工作区\"]')"):
        b.click('下载并启用')
    b.wait("!!document.querySelector('nav[aria-label=\"设计工作区\"]')", 60)
    b.evaluate('window.confirm=()=>true')
    if b.evaluate(toolbar + '!==null'):
        b.click('放弃整包草稿')
        b.wait(toolbar + '===null')
        session_absent()
    if active()['contractRevision'] != 11:
        b.evaluate("(async()=>{const p=await import('/src/configStudio/defaultConfigProvider.ts');await p.persistActiveConfig(await p.loadDefaultConfig(),true);})()")
        b.navigate('?workspace=config-studio')
    original = active()
    assert original['contractRevision'] == 11
    b.click('迁移到 r12 草稿')
    b.wait(toolbar + '!==null')
    assert active() == original, 'Starting a migration must not activate its draft'
    assert b.evaluate(toolbar + ".textContent.includes('r11 → r12')")
    assert b.evaluate("[...document.querySelectorAll('button')].find(e=>e.textContent==='全局核验').disabled")
    assert b.evaluate(toolbar + ".querySelectorAll('button').length") == 3
    assert b.evaluate("[..." + toolbar + ".querySelectorAll('button')].every(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;})")
    b.screenshot('migration-actions-desktop.png')
    checks.append('r11 migration opens a visible package toolbar before the engine editor; saved baseline and publication gate remain intact')

    select_class('ROD')
    select_class('SBP')
    b.wait("(async()=>{const s=await import('/src/configStudio/configLabStorage.ts');const d=await s.readStudioEditingSession();return d?.draftScope==='package'&&d?.selectedId==='class-sbp';})()")
    b.navigate('?workspace=config-studio')
    b.wait(toolbar + '!==null')
    assert b.evaluate("document.querySelector('select[aria-label=\"编辑分类 Class\"]').value") == 'SBP'
    select_class('ROD')
    checks.append('whole-package review can switch categories; reload restores the draft scope and selected category')

    b.call('Emulation.setDeviceMetricsOverride', {'width': 390, 'height': 850, 'deviceScaleFactor': 1, 'mobile': False})
    assert b.evaluate("[..." + toolbar + ".querySelectorAll('button')].every(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;})")
    assert b.evaluate('document.documentElement.scrollWidth<=innerWidth')
    b.screenshot('migration-actions-mobile.png')
    b.call('Emulation.setDeviceMetricsOverride', {'width': 1440, 'height': 1000, 'deviceScaleFactor': 1, 'mobile': False})
    checks.append('390px layout keeps all package controls visible without document horizontal overflow')

    b.click('核验整包草稿')
    b.wait("!" + toolbar + ".querySelector('button:nth-of-type(2)').disabled")
    b.evaluate('window.confirm=()=>false')
    b.click('保存整包草稿')
    assert b.evaluate(toolbar + '!==null')
    assert active() == original
    b.evaluate('window.confirm=()=>true')
    b.click('保存整包草稿')
    b.wait(toolbar + '===null')
    session_absent()
    assert active()['contractRevision'] == 12
    b.click('全局核验')
    b.wait("document.querySelector('nav [role=status]')?.textContent.includes('全局核验通过')")
    assert not b.evaluate("[...document.querySelectorAll('button')].find(e=>e.textContent.includes('整包下载/上传')).disabled")
    b.navigate('?workspace=config-studio')
    assert active()['contractRevision'] == 12
    assert b.evaluate(toolbar + '===null')
    session_absent()
    checks.append('validate then save respects cancelled confirmation; successful save clears durable draft, survives reload and unlocks global validation')

    select_class('ROD')
    b.click('读取分类')
    assert b.evaluate(toolbar + '===null')
    assert b.evaluate("document.querySelector('select[aria-label=\"编辑分类 Class\"]').matches(':disabled')")
    b.click('放弃草稿')
    session_absent()
    checks.append('ordinary category edits retain the original selection lock and category transaction controls')

    # Reproduce an already-persisted migration from the old deployed UI: no scope,
    # no category selected. The fixed UI must recover it without clearing storage.
    # Leave Studio first so its normal beforeunload flush cannot overwrite the
    # old-session fixture we are about to install in this isolated profile.
    b.call('Page.navigate', {'url': APP_URL + '/scripts/config-tools/r12-ui-acceptance.html'})
    b.wait("!!window.r12Harness?.map", 60)
    b.evaluate("""(async()=>{const p=await import('/src/configStudio/defaultConfigProvider.ts'),s=await import('/src/configStudio/configLabStorage.ts'),m=await import('/src/configStudio/r12Migration.ts');const baseline=await p.persistActiveConfig(await p.loadDefaultConfig(),true);await s.saveStudioEditingSession({baseline,draft:m.migrateConfigToR12(baseline).config,tree:null,selectedId:'',editing:true});})()""")
    b.navigate('?workspace=config-studio')
    b.wait(toolbar + '!==null')
    before_discard = active()
    select_class('SBP')
    b.click('放弃整包草稿')
    b.wait(toolbar + '===null')
    session_absent()
    assert active() == before_discard
    b.navigate('?workspace=config-studio')
    assert active() == before_discard
    assert b.evaluate(toolbar + '===null')
    checks.append('legacy stranded migration recovers with usable controls; discard survives reload and preserves the exact saved r11 configuration')

    # A structurally readable but semantically invalid package uses the same
    # transaction controls; validation must continue to block saving it.
    invalid = active()
    invalid['nodes'][1]['path'] = dict(invalid['nodes'][0]['path'])
    invalid_path = OUT / 'invalid-package.fixture.json'
    invalid_path.write_text(json.dumps(invalid, ensure_ascii=False), encoding='utf-8')
    root = b.call('DOM.getDocument')['root']['nodeId']
    node = b.call('DOM.querySelector', {'nodeId': root, 'selector': 'input[type=file][accept=".zip,.json,application/zip,application/json"]'})['nodeId']
    b.call('DOM.setFileInputFiles', {'nodeId': node, 'files': [str(invalid_path.resolve())]})
    b.wait(toolbar + '!==null')
    b.click('核验整包草稿')
    assert b.evaluate(toolbar + ".querySelector('button:nth-of-type(2)').disabled")
    assert active() == before_discard
    select_class('SBP')
    b.click('放弃整包草稿')
    b.wait(toolbar + '===null')
    session_absent()
    assert active() == before_discard
    checks.append('invalid whole-package import exposes review/discard but validation still blocks save and leaves the active configuration untouched')

    assert not b.errors, b.errors
    result = {'checks': checks, 'runtimeErrors': b.errors}
    (OUT / 'r12-migration-draft-results.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(result, ensure_ascii=False))
finally:
    b.ws.close()
