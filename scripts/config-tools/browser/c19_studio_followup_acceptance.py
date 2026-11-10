"""Exercise the c19 follow-up through a disposable localhost Studio."""
import json
import os
import time
import zipfile
from urllib.request import ProxyHandler, Request, build_opener

from browser_check import APP_URL, OUT, Browser


def main():
    assert APP_URL.startswith('http://127.0.0.1:')
    cdp = 'http://127.0.0.1:' + os.environ['CAIRNMAP_CDP_PORT']
    build_opener(ProxyHandler({})).open(Request(cdp + '/json/new?about:blank', method='PUT')).close()
    browser = Browser()
    js, wait, click = browser.evaluate, browser.wait, browser.click
    def find(selector):
        return 'document.querySelector(' + json.dumps(selector) + ')'

    global_settings = find('details[data-fold-key=feature-global-settings]')
    rule = find('details[data-fold-key="rule:v1-structure-low-point--base"]')
    mode = rule + '.querySelector(\'[aria-label="规则适用范围"] select\')'
    template = find('[data-engine-section=renderTemplates]')
    density = find('[data-engine-section=densityGroups]')
    create = find('[aria-label="创建模板"]')
    selected = """(config => config?.nodes.find(n => n.nodeId === 'class-bud-nom')
        ?.geometryProfiles.Polygon.zoomPriority.rules.find(r => r.id === 'v1-structure-low-point--base'))"""
    checks = []

    def set_value(target, value, kind='Select'):
        wait('Boolean(' + target + ')')
        js("""(() => {
          const element = """ + target + '; const value = ' + json.dumps(value) + """;
          Object.getOwnPropertyDescriptor(HTML""" + kind + """Element.prototype, 'value').set.call(element, value);
          element.dispatchEvent(new Event(element instanceof HTMLSelectElement ? 'change' : 'input', {bubbles:true}));
        })()""")

    def state(expression):
        return js("""(async()=>{const w=await import('/src/configStudio/workspaceController.ts');
            const session=w.getStudioSessionSnapshot();return """ + expression + '})()')

    def scoped_click(scope, label):
        button = '[...' + scope + '.querySelectorAll("button")].find(b=>b.textContent.trim()===' + json.dumps(label) + ')'
        wait(button + '?.matches(":enabled")')
        js(button + '.click()')

    def verify_rule(representation):
        result = state(selected + '(session.draft ?? w.getActiveConfigSnapshot())')
        assert result['representation'] == representation, result
        assert 'behavior' not in result.get('style', {}), result
        errors = js("""(async()=>{const w=await import('/src/configStudio/workspaceController.ts');
          const {validateNativeStructure}=await import('/src/configStudio/nativeContractValidation.ts');
          return validateNativeStructure(w.getStudioSessionSnapshot()?.draft ?? w.getActiveConfigSnapshot())})()""")
        assert not errors, errors
        return result.get('style', {})

    try:
        browser.call('Network.enable')
        browser.call('Network.setBlockedURLs', {'urls': ['https://*', APP_URL + '/api/*', 'http://analysis.602007.xyz/*']})
        browser.call('Storage.clearDataForOrigin', {'origin': APP_URL, 'storageTypes': 'all'})
        browser.call('Page.navigate', {'url': APP_URL + '/?workspace=config-studio&tab=features'})
        nav = find('nav[aria-label="设计工作区"]')
        wait('Boolean(' + nav + ') || document.body.innerText.includes("下载并启用")', 60)
        if js('document.body.innerText.includes("下载并启用")'):
            click('下载并启用')
        wait('Boolean(' + nav + ')', 60)
        js('window.confirm = () => true')
        assert js(global_settings + '.open') is False

        set_value(find('select[aria-label="编辑分类 Class"]'), 'BUD')
        set_value(find('select[aria-label="编辑分类 Kind"]'), 'NOM')
        click('读取分类')
        wait('Boolean(' + rule + ')')
        js(rule + '.open=true')
        initial = verify_rule('point')['pointSymbol']
        if js('document.body.innerText.includes("显示验证器")'):
            click('显示验证器')
        set_value(find('select[data-config-setting="ConfigStudio/样例状态"]'), 'mediumPolygon')
        marker = find('.ria-config-shape-marker')
        wait('Boolean(' + marker + ')', 30)
        set_value(mode, 'geometry')
        assert 'pointSymbol' not in verify_rule('geometry')
        wait('!Boolean(' + marker + ')')
        js(rule + '.closest("article").querySelector("header button").click()')
        wait('!Boolean(' + rule + ')')
        js("""[...document.querySelectorAll('article header button')].find(b=>b.textContent.trim().startsWith('面')).click()""")
        wait('Boolean(' + rule + ')')
        js(rule + '.open=true')
        set_value(mode, 'point')
        assert verify_rule('point')['pointSymbol'] == initial
        wait('Boolean(' + marker + ')', 30)
        set_value(mode, 'geometryWithPoint')
        assert verify_rule('geometryWithPoint')['midpoint']['pointSymbol'] == initial
        wait('Boolean(' + marker + ')', 30)
        set_value(mode, 'labelOnly')
        assert 'midpoint' not in verify_rule('labelOnly')
        set_value(mode, 'hidden')
        assert not verify_rule('hidden')
        set_value(mode, 'geometryWithPoint')
        assert verify_rule('geometryWithPoint')['midpoint']['pointSymbol'] == initial
        click('核验')
        click('保存')
        wait('document.body.innerText.includes("已保存本地活动配置")')
        assert state(selected + '(w.getActiveConfigSnapshot()).representation') == 'geometryWithPoint'
        click('读取分类')
        wait('Boolean(' + rule + ')')
        assert verify_rule('geometryWithPoint')['midpoint']['pointSymbol'] == initial
        click('放弃草稿')
        checks.append('BUD/NOM point, polygon, composite, hidden and label-only with panel remount and durable category save')

        js(global_settings + '.open=true')
        scoped_click(template, '添加模板')
        assert js(create + '.previousElementSibling.disabled')
        assert js(density + '.querySelector("fieldset").disabled')
        scoped_click(create, '核验并创建')
        wait(create + '.innerText.includes("至少填写一个名称")')
        set_value(create + '.querySelector("select")', 'Point')
        assert js('[...' + create + '.querySelectorAll("option")].filter(o=>o.text.startsWith("复制 ")).every(o=>o.text.startsWith("复制 点"))')
        set_value(create + '.querySelector("input")', '回归模板', 'Input')
        js(global_settings + '.open=false')
        state('await w.flushWorkspace()')
        browser.call('Page.reload')
        wait('Boolean(' + find('[aria-label="检测到本机编辑缓存"]') + ')', 60)
        click('继续编辑')
        wait('Boolean(' + create + ')')
        assert js(global_settings + '.open') is False
        js(global_settings + '.open=true; window.confirm = () => true')
        assert js(create + '.querySelector("input").value') == '回归模板'
        scoped_click(create, '取消创建')
        assert js('!Boolean(' + create + ')')
        scoped_click(template, '添加模板')
        set_value(create + '.querySelector("select")', 'Point')
        set_value(create + '.querySelector("input")', '回归模板', 'Input')
        scoped_click(create, '核验并创建')
        wait('!Boolean(' + create + ')')
        template_id = js(template + '.querySelector("select").value')
        assert state('!w.getActiveConfigSnapshot().engine.renderTemplates.some(t=>t.id===' + json.dumps(template_id) + ')')
        assert js(template + '.innerText.includes("请先检查当前引用状态")')
        scoped_click(template, '检查当前引用状态')
        wait(template + '.innerText.includes("未引用")')
        scoped_click(template, '删除所选模板')
        wait(template + '.innerText.includes("已过期")')
        checks.append('template creation and cancellation, collapsed session resume, scoped locks and reference-gated delete')

        scoped_click(density, '检查当前引用状态')
        assert js(density + '.innerText.includes("内置密度组受保护")')
        scoped_click(density, '添加密度组')
        density_create = find('[aria-label="创建密度组"]')
        set_value(density_create + '.querySelector("select")', 'structureLabel')
        set_value(density_create + '.querySelector("input")', '回归密度组', 'Input')
        scoped_click(density_create, '核验并创建')
        wait('!Boolean(' + density_create + ')')
        density_id = js(density + '.querySelector("select").value')
        groups = state('session.engineDraft.value.densityGroups')
        copied = next(g for g in groups if g['id'] == density_id)
        original = next(g for g in groups if g['id'] == 'structureLabel')
        assert copied['defaultGrid'] == original['defaultGrid'] and copied['zoomGrids'] == original['zoomGrids']
        assert js(density + '.innerText.includes("引用检查已过期")')
        scoped_click(density, '核验')
        scoped_click(density, '保存')
        wait(density + '.querySelector(\'[role="status"]\').textContent.trim()==="未修改"')
        assert state('w.getActiveConfigSnapshot().engine.densityGroups.some(g=>g.id===' + json.dumps(density_id) + ')')
        checks.append('protected groups and independent save of a copied density group including its Zoom segments')

        if not js(global_settings + '.open'):
            js(global_settings + '.open=true')
        scoped_click(density, '添加 Zoom 分段')
        scoped_click(density, '核验')
        report = density + '.querySelector(\'[aria-label="引擎核验报告"]\')'
        wait('Boolean(' + report + ')')
        error_group = '[...' + report + '.querySelectorAll("details")].find(d=>d.firstChild.textContent.includes("density-grid-overlap"))'
        locate = error_group + '.querySelector("button")'
        wait('Boolean(' + locate + ')')
        js(global_settings + '.open=false; ' + locate + '.click()')
        wait(global_settings + '.open')
        assert js(density + '.querySelector("select").value') == density_id
        scoped_click(density, '放弃草稿')
        checks.append('an actual density validation issue reopens the global panel and locates the affected item')

        # Recreate the persisted legacy editor leak without changing any repository or live files.
        js("""(async()=>{
          const w=await import('/src/configStudio/workspaceController.ts');
          const baseline=w.getActiveConfigSnapshot(), draft=structuredClone(baseline), rule=""" + selected + """(draft);
          Object.assign(rule.style, structuredClone(rule.style.midpoint.pointSymbol.shape));
          rule.style.behavior={anchor:'geometry',visibility:'independent',offsetPx:{x:1,y:2}};
          await w.persistStudioEditingSession({baseline,draft,draftScope:'category',tree:null,
            selectedId:'class-bud-nom',editing:true,activeTab:'features',detailsByTab:{}});
          await w.flushWorkspace();
        })()""")
        browser.call('Page.reload')
        click('继续编辑')
        wait('Boolean(' + rule + ')')
        js(rule + '.open=true')
        assert state(selected + '(session.draft).style.behavior.offsetPx.x') == 1
        click('修复显示种类草稿')
        assert verify_rule('geometryWithPoint')['midpoint']['pointSymbol'] == initial
        js('window.confirm = () => true')
        click('核验')
        click('保存')
        wait('document.body.innerText.includes("已保存本地活动配置")')
        checks.append('a previously persisted style.behavior leak is repaired in the Studio and passes strict category save')

        download_dir = OUT / 'c19-followup-downloads'
        download_dir.mkdir(exist_ok=True)
        previous = {p.name: p.stat().st_mtime_ns for p in download_dir.glob('*.zip')}
        browser.call('Browser.setDownloadBehavior', {'behavior': 'allow', 'downloadPath': str(download_dir.resolve())})
        click('全局核验')
        click('整包下载/上传')
        click('下载配置整包')
        deadline = time.monotonic() + 25
        files = []
        while not files and time.monotonic() < deadline:
            files = [p for p in download_dir.glob('*.zip') if p.stat().st_mtime_ns != previous.get(p.name) and zipfile.is_zipfile(p)]
            time.sleep(.15)
        assert files, 'No standard ZIP downloaded'
        with zipfile.ZipFile(files[0]) as archive:
            exported = json.loads(archive.read('config.json'))
        node = next(node for node in exported['nodes'] if node['nodeId'] == 'class-bud-nom')
        saved = next(row for row in node['geometryProfiles']['Polygon']['zoomPriority']['rules'] if row['id'] == 'v1-structure-low-point--base')
        assert saved['style']['midpoint']['pointSymbol'] == initial and 'behavior' not in saved['style']
        wait('!Boolean(' + find('[aria-label="整包下载/上传"][role="dialog"]') + ')')
        click('导入本地配置')
        root = browser.call('DOM.getDocument')['root']['nodeId']
        upload = browser.call('DOM.querySelector', {'nodeId': root, 'selector': 'header input[type=file]'})['nodeId']
        browser.call('DOM.setFileInputFiles', {'nodeId': upload, 'files': [str(files[0].resolve())]})
        wait('document.body.innerText.includes("已导入隔离候选")', 45)
        assert state(selected + '(session.packageCandidate.config).style.midpoint.pointSymbol') == initial
        click('放弃整包草稿')
        checks.append('standard ZIP export and import retain the repaired composite representation')

        js('''(async()=>{
          const {renderLabelHtml}=await import('/src/components/Rules/rendering/labelStyles.ts');
          const holder=document.createElement('div');
          holder.style.cssText='position:fixed;left:0;top:0;width:240px;height:90px;display:grid;place-items:center;z-index:2147483647;background:white';
          document.body.append(holder);
          window.renderFollowupLabel=(key,text,underline)=>{
            holder.innerHTML=renderLabelHtml({key,underline},text,{placement:'E'});
            const front=holder.querySelector('span span:last-child');
            if(!key.startsWith('structure-label')) return null;
            const style=getComputedStyle(front), rect=front.getBoundingClientRect();
            return [style.textDecorationLine,rect.width,rect.height];
          };
        })()''')
        clip = {'x': 0, 'y': 0, 'width': 240, 'height': 90, 'scale': 1}
        for style, label in [('structure-label-12', '默认建筑'), ('structure-label-12', '默认建筑\nWRP'),
                             ('gm-bw-12', '默认建筑'), ('gm-outline-12', '默认建筑'), ('gm-wtb-12', '默认建筑')]:
            captures, decoration = [], []
            for enabled in (False, True):
                decoration.append(js('window.renderFollowupLabel(...' + json.dumps([style, label, enabled]) + ')'))
                captures.append(browser.call('Page.captureScreenshot', {'format': 'png', 'clip': clip})['data'])
            assert captures[0] != captures[1], (style, label)
            if style.startswith('structure-label'):
                assert [row[0] for row in decoration] == ['none', 'underline'], decoration
                assert decoration[0][1:] == decoration[1][1:], decoration
        checks.append('visible underline pixel changes in four HTML styles, with unchanged structure-label bounds')
        assert not browser.errors, browser.errors
        (OUT / 'c19-studio-followup.json').write_text(json.dumps(checks, ensure_ascii=False, indent=2), encoding='utf-8')
        print(json.dumps(checks, ensure_ascii=False))
    finally:
        browser.ws.close()


if __name__ == '__main__':
    main()
