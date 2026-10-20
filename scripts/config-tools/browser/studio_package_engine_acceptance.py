"""Real Studio transactions in an isolated profile; no remote business writes."""
import json
from browser_check import Browser, OUT, APP_URL

b = Browser()
checks = []
bar = """document.querySelector('[aria-label="整包草稿操作"]')"""
engine = """document.querySelector('[aria-label="全局引擎独立编辑区域"]')"""
preferences = """document.querySelector('[data-application-section="preferences"]')"""
workflow_area = """document.querySelector('[aria-label="工作流编辑区域"]')"""


def click(text, scope='document'):
    b.evaluate("(()=>{const e=[...(" + scope + ").querySelectorAll('button')].find(e=>e.textContent.trim()===" + json.dumps(text) + ");if(!e||e.matches(':disabled'))throw Error('Missing or disabled action: '+" + json.dumps(text) + ");e.click();return true;})()")


def fill(label, value, scope='document'):
    b.evaluate("(()=>{const e=[...(" + scope + ").querySelectorAll('label')].find(e=>e.querySelector('.cm-help-heading')?.textContent.trim().startsWith(" + json.dumps(label) + ")&&e.querySelector('input')&&!e.querySelector('input').matches(':disabled'))?.querySelector('input');if(!e)throw Error('Missing editable field '+" + json.dumps(label) + ");Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e," + json.dumps(str(value)) + ");e.dispatchEvent(new Event('input',{bubbles:true}));return true;})()")


def pick(selector, value):
    b.evaluate("(()=>{const e=document.querySelector(" + json.dumps(selector) + ");if(!e||e.matches(':disabled'))throw Error('Picker unavailable');e.value=" + json.dumps(value) + ";e.dispatchEvent(new Event('change',{bubbles:true}));return true;})()")


def active():
    return b.evaluate("(async()=>{const p=await import('/src/configStudio/defaultConfigProvider.ts');return p.getActiveConfigSnapshot();})()")


def session():
    return b.evaluate("(async()=>{const s=await import('/src/configStudio/configLabStorage.ts');return (await s.readStudioEditingSession())??null;})()")


def wait_session(expression):
    b.wait("(async()=>{const s=await import('/src/configStudio/configLabStorage.ts'),v=await s.readStudioEditingSession();return " + expression + ";})()")


def upload(name, config):
    path = OUT / name
    path.write_text(json.dumps(config, ensure_ascii=False), encoding='utf-8')
    root = b.call('DOM.getDocument')['root']['nodeId']
    file_input = b.call('DOM.querySelector', {'nodeId': root, 'selector': 'input[accept=".zip,.json,application/zip,application/json"]'})['nodeId']
    b.call('DOM.setFileInputFiles', {'nodeId': file_input, 'files': [str(path.resolve())]})
    b.wait(bar + '!==null')
    wait_session('!!v?.packageCandidate')


def assert_same_active(config):
    assert active() == config, 'A staged candidate or region edit changed the active configuration'


try:
    b.call('Page.navigate', {'url': APP_URL + '/?workspace=config-studio'})
    b.wait("!!document.querySelector('nav[aria-label=\"设计工作区\"]')||[...document.querySelectorAll('button')].some(e=>e.textContent==='下载并启用')", 60)
    if not b.evaluate("!!document.querySelector('nav[aria-label=\"设计工作区\"]')"):
        b.click('下载并启用')
    b.wait("!!document.querySelector('nav[aria-label=\"设计工作区\"]')", 60)
    b.evaluate('window.confirm=()=>true')
    # Reset only this script's isolated profile, allowing repeat runs after a
    # failed assertion without interacting with any user browser or drafts.
    b.call('Page.navigate', {'url': APP_URL + '/scripts/config-tools/r12-ui-acceptance.html'})
    b.wait('!!window.r12Harness?.map', 60)
    b.evaluate("(async()=>{const p=await import('/src/configStudio/defaultConfigProvider.ts');await p.persistActiveConfig(await p.loadDefaultConfig(),true);await p.persistStudioEditingSession(null);})()")
    b.navigate('?workspace=config-studio')
    assert active()['contractRevision'] == 11

    # Engine-only saves never create category drafts or package candidates.
    initial = active()
    b.evaluate(engine + ".querySelector('details').open=true;true")
    fill('激活半径 px', initial['engine']['contextView']['activationRadiusPx'] + 1, engine)
    b.wait("[..." + engine + ".querySelectorAll('button')].some(e=>e.textContent==='保存引擎'&&!e.matches(':disabled'))")
    assert b.evaluate(bar + '===null')
    assert_same_active(initial)
    click('核验引擎', engine)
    click('保存引擎', engine)
    b.wait("document.querySelector('nav [role=status]')?.textContent.includes('全局引擎已独立保存')")
    wait_session('!v')
    first = active()
    assert first['nodes'] == initial['nodes'] and first['application'] == initial['application'] and first['lookupTables'] == initial['lookupTables']
    assert first['engine']['contextView']['activationRadiusPx'] == initial['engine']['contextView']['activationRadiusPx'] + 1
    pick('select[aria-label="编辑分类 Class"]', 'ROD')
    pick('select[aria-label="编辑分类 Kind"]', 'NOM')
    b.wait("document.querySelectorAll('.leaflet-ria-overlay-pane path').length>0")
    fill('线最小屏幕长度 px', 1000000, engine)
    b.wait("document.querySelectorAll('.leaflet-ria-overlay-pane path').length===0")
    assert_same_active(first)
    click('放弃引擎草稿', engine)
    b.wait("document.querySelectorAll('.leaflet-ria-overlay-pane path').length>0")
    wait_session('!v')
    pick('select[aria-label="编辑分类 Kind"]', '')
    checks.append('unsaved engine screen gates immediately update the real validator; discard restores drawing without changing the active configuration')
    fill('激活半径 px', first['engine']['contextView']['activationRadiusPx'] + 1, engine)
    assert b.evaluate(bar + '===null')
    assert b.evaluate("[...document.querySelectorAll('button')].some(e=>e.textContent==='读取分类')")
    click('保存引擎', engine)
    wait_session('!v')
    assert active()['nodes'] == first['nodes']
    assert active()['engine']['contextView']['activationRadiusPx'] == first['engine']['contextView']['activationRadiusPx'] + 1
    b.screenshot('engine-independent-actions.png')
    checks.append('engine-only validate/save is independent with and without a selected category; unrelated modules remain byte-equivalent')

    baseline = active()
    click('迁移到 r12 草稿')
    wait_session("v?.packageCandidate?.config.contractRevision===12&&!v?.draft&&!v?.editing")
    for tab in ['总体规则', '工作流设计', '要素设计']:
        b.click(tab)
        b.wait("document.querySelector('[role=tab][aria-selected=true]').textContent===" + json.dumps(tab))
        assert b.evaluate(bar + '!==null')
        assert_same_active(baseline)
    checks.append('a migration candidate allows all three design tabs while retaining the original active configuration')

    # Candidate region saves stage instead of activating. Reverting an engine
    # edit clears only the engine draft; a second edit can then be staged.
    b.evaluate(engine + ".querySelector('details').open=true;true")
    radius = baseline['engine']['contextView']['activationRadiusPx']
    fill('激活半径 px', radius + 3, engine)
    b.click('工作流设计')
    assert b.evaluate("document.querySelector('[role=tab][aria-selected=true]').textContent") == '要素设计'
    fill('激活半径 px', radius, engine)
    wait_session('!!v?.packageCandidate&&!v?.engineDraft')
    fill('激活半径 px', radius + 2, engine)
    click('核验引擎', engine)
    click('保存引擎', engine)
    wait_session('v?.packageCandidate?.config.engine.contextView.activationRadiusPx===' + str(radius + 2) + '&&!v?.engineDraft')
    assert_same_active(baseline)
    pick('select[aria-label="编辑分类 Class"]', 'ROD')
    b.click('读取分类')
    wait_session('!!v?.draft&&!!v?.packageCandidate')
    fill('名称（zh）', '候选道路字段名称')
    b.click('核验')
    b.click('保存')
    wait_session('!!v?.packageCandidate&&!v?.draft&&!v?.editing')
    assert_same_active(baseline)
    tables = """document.querySelector('[aria-label="对照表独立编辑区域"]')"""
    b.evaluate(tables + ".querySelector('details').open=true;true")
    fill('表格名', '候选对照表名称', tables)
    click('核验表格', tables)
    click('保存表格', tables)
    wait_session("!!v?.packageCandidate&&!v?.lookupDraft&&v.packageCandidate.config.lookupTables[0].label.zh==='候选对照表名称'")
    assert_same_active(baseline)
    checks.append('lookup-table save stages only its own table changes into the same candidate and preserves the staged engine/classification edits')
    b.click('总体规则')
    click('读取/编辑', preferences)
    fill('主页结果数量', baseline['application']['preferences']['search']['homepageLimit'] + 1, preferences)
    click('核验', preferences)
    click('保存', preferences)
    wait_session('!!v?.packageCandidate&&!Object.keys(v?.generalDrafts??{}).length')
    assert_same_active(baseline)
    b.navigate('?workspace=config-studio')
    assert b.evaluate("document.querySelector('[role=tab][aria-selected=true]').textContent") == '总体规则'
    assert session()['packageCandidate']['config']['engine']['contextView']['activationRadiusPx'] == radius + 2
    b.screenshot('candidate-general-tab.png')
    checks.append('engine, classification and general module saves update one durable candidate; unfinished region drafts block leaving, reverted engine edits clear, and refresh restores the selected tab')

    b.click('核验整包草稿')
    b.wait('!' + bar + ".querySelector('button:nth-of-type(2)').matches(':disabled')")
    b.click('保存整包草稿')
    b.wait(bar + '===null')
    wait_session('!v')
    migrated = active()
    assert migrated['contractRevision'] == 12
    assert migrated['engine']['contextView']['activationRadiusPx'] == radius + 2
    assert migrated['lookupTables'][0]['label']['zh'] == '候选对照表名称'
    assert migrated['application']['preferences']['search']['homepageLimit'] == baseline['application']['preferences']['search']['homepageLimit'] + 1
    b.click('全局核验')
    b.wait("document.querySelector('nav [role=status]')?.textContent.includes('全局核验通过')")
    checks.append('only final full candidate validation/save applies all staged modules once and restores the ordinary publication gate')

    # Import errors in two separate design tabs; repairing either one must not
    # require the other to already be valid.
    b.click('要素设计')
    broken = active()
    before_import = json.loads(json.dumps(broken))
    broken['application']['preferences']['search']['homepageLimit'] = 0
    target = next(w for w in broken['workflows'] if w['mode'] == 'composed' and w.get('editor', {}).get('enabled'))
    target_id = target['id']
    target['editor']['backfill'] = [{'slot': '__missing_slot', 'target': 'Name'}]
    upload('multi-module-errors.fixture.json', broken)
    b.click('核验整包草稿')
    assert b.evaluate(bar + ".querySelector('button:nth-of-type(2)').matches(':disabled')")
    b.click('工作流设计')
    pick('select[aria-label="已保存工作流"]', target_id)
    click('读取', workflow_area)
    wait_session("v?.workflowSession?.draft.id===" + json.dumps(target_id))
    b.navigate('?workspace=config-studio')
    assert b.evaluate("document.querySelector('[role=tab][aria-selected=true]').textContent") == '工作流设计'
    b.evaluate("[...document.querySelectorAll('details')].find(e=>e.querySelector('summary')?.textContent.startsWith('受控回填映射')).open=true;true")
    b.click('删除映射')
    click('核验', workflow_area)
    click('保存', workflow_area)
    wait_session('!!v?.packageCandidate&&!v?.workflowSession')
    assert_same_active(before_import)
    b.click('核验整包草稿')
    assert b.evaluate(bar + ".querySelector('button:nth-of-type(2)').matches(':disabled')")
    b.screenshot('candidate-workflow-repaired.png')
    b.click('总体规则')
    click('读取/编辑', preferences)
    fill('主页结果数量', before_import['application']['preferences']['search']['homepageLimit'], preferences)
    click('核验', preferences)
    click('保存', preferences)
    wait_session('!!v?.packageCandidate&&!Object.keys(v?.generalDrafts??{}).length')
    assert_same_active(before_import)
    b.click('核验整包草稿')
    b.wait('!' + bar + ".querySelector('button:nth-of-type(2)').matches(':disabled')")
    b.call('Emulation.setDeviceMetricsOverride', {'width': 390, 'height': 850, 'deviceScaleFactor': 1, 'mobile': False})
    assert b.evaluate('document.documentElement.scrollWidth<=innerWidth')
    assert b.evaluate("[..." + bar + ".querySelectorAll('button')].every(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;})")
    b.screenshot('candidate-mobile.png')
    b.call('Emulation.setDeviceMetricsOverride', {'width': 1440, 'height': 1000, 'deviceScaleFactor': 1, 'mobile': False})
    b.click('保存整包草稿')
    b.wait(bar + '===null')
    wait_session('!v')
    assert active()['application']['preferences']['search']['homepageLimit'] > 0
    assert not active()['workflows'][next(i for i, w in enumerate(active()['workflows']) if w['id'] == target_id)]['editor'].get('backfill')
    checks.append('an imported workflow/general multi-error candidate is repaired across tabs, including unsaved workflow reload recovery; partial fixes cannot activate, while the fully repaired package saves')
    checks.append('390px candidate controls remain visible and the document has no horizontal overflow')

    # Valid imports also stage, and dropping a candidate does not change active.
    before_discard = active()
    valid_import = json.loads(json.dumps(before_discard))
    valid_import['displayName']['zh'] += ' imported candidate'
    b.click('要素设计')
    upload('valid-package.fixture.json', valid_import)
    assert_same_active(before_discard)
    b.click('放弃整包草稿')
    b.wait(bar + '===null')
    wait_session('!v')
    b.navigate('?workspace=config-studio')
    assert b.evaluate(bar + '===null')
    assert_same_active(before_discard)
    checks.append('even valid imports require final package confirmation; discard and reload preserve the exact previous active package')

    # A different active save while this candidate is open cannot be overwritten.
    upload('concurrent-package.fixture.json', valid_import)
    b.evaluate("(async()=>{const p=await import('/src/configStudio/defaultConfigProvider.ts');const c=structuredClone(p.getActiveConfigSnapshot());c.displayName.zh+=' concurrent edit';await p.persistActiveConfig(c,true);})()")
    concurrent_active = active()
    b.click('核验整包草稿')
    b.click('保存整包草稿')
    b.wait("document.querySelector('nav [role=status]')?.textContent.includes('本地活动配置已被其他编辑更新')")
    assert b.evaluate(bar + '!==null')
    assert_same_active(concurrent_active)
    b.click('放弃整包草稿')
    b.wait(bar + '===null')
    checks.append('final candidate save rejects a concurrently changed active baseline and retains the candidate for review')

    assert not b.errors, b.errors
    result = {'checks': checks, 'runtimeErrors': b.errors}
    (OUT / 'studio-package-engine-results.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(result, ensure_ascii=False))
finally:
    b.ws.close()
