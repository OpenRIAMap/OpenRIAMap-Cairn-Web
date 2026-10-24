"""P0: real controls/files/dialogs in a disposable local browser profile.

Only read-only state inspection is used; no store, IndexedDB or config writes
outside the product's UI handlers. Production migration is not exercised.
"""
import json, os, time, traceback, zipfile
from pathlib import Path
from browser_check import Browser, APP_URL, OUT

assert APP_URL.startswith('http://127.0.0.1:')

class AuthoringBrowser(Browser):
    def __init__(self):
        self.dialogs = []
        super().__init__()

    def call(self, method, params=None):
        self.seq += 1
        ident = self.seq
        self.ws.send(json.dumps({'id': ident, 'method': method, 'params': params or {}}))
        while True:
            result = json.loads(self.ws.recv())
            if result.get('method') == 'Runtime.exceptionThrown':
                self.errors.append(result['params'])
            if result.get('method') == 'Page.javascriptDialogOpening':
                self.dialogs.append(result['params']['type'])
                self.seq += 1
                self.ws.send(json.dumps({'id': self.seq, 'method': 'Page.handleJavaScriptDialog', 'params': {'accept': True}}))
            if result.get('id') != ident:
                continue
            if 'error' in result:
                raise RuntimeError(result['error'])
            return result.get('result', {})

b = AuthoringBrowser()
checks = []
downloads = OUT.parent / 'category-downloads' / str(time.time_ns())
downloads.mkdir(parents=True, exist_ok=True)
b.call('Browser.setDownloadBehavior', {'behavior': 'allow', 'downloadPath': str(downloads.resolve())})

def state():
    return b.evaluate("(async()=>{const m=await import('/src/configStudio/workspaceController.ts');return {active:m.getActiveConfigSnapshot(),session:m.getStudioSessionSnapshot()}})()")

def value(label, data):
    selector = ','.join(tag + '[aria-label=' + json.dumps(label, ensure_ascii=False) + ']' for tag in ['input', 'select', 'textarea'])
    b.wait('Boolean(document.querySelector(' + json.dumps(selector) + '))')
    b.evaluate("(()=>{const e=document.querySelector(" + json.dumps(selector) + ");if(e.disabled||e.closest('fieldset:disabled'))throw Error('Disabled field: '+e.getAttribute('aria-label'));const p=e.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(p,'value').set.call(e," + json.dumps(data) + ");e.dispatchEvent(new Event(e.tagName==='SELECT'?'change':'input',{bubbles:true}));})()")
    time.sleep(.1)

def nav():
    b.call('Page.navigate', {'url': APP_URL + '/?workspace=config-studio&tab=features&categoryAcceptance=' + str(time.time_ns())})
    b.wait("Boolean(document.querySelector('nav[aria-label=\"设计工作区\"]'))||Array.from(document.querySelectorAll('button')).some(x=>['下载并启用','继续编辑'].includes(x.textContent.trim()))", 45)
    if b.evaluate("Array.from(document.querySelectorAll('button')).some(x=>x.textContent.trim()==='下载并启用')"):
        b.click('下载并启用')
    b.wait("Boolean(document.querySelector('nav[aria-label=\"设计工作区\"]'))||Array.from(document.querySelectorAll('button')).some(x=>x.textContent.trim()==='继续编辑')", 45)

def new_node(code, geometry=None, template=None):
    b.click('新增分类')
    value('新分类代码', code)
    value('新分类名称 zh', 'P0 测试 ' + code)
    if template:
        value('初始化状态', 'template')
        value('分类模板来源 Class', template)
    elif geometry is not None:
        value('初始化状态', 'blank')
        value('新分类几何', geometry)
    b.click('创建分类草稿')
    b.wait("!document.querySelector('section[aria-label=\"新增要素分类\"]')", 30)

def upload(path):
    document = b.call('DOM.getDocument')['root']['nodeId']
    node = b.call('DOM.querySelector', {'nodeId': document, 'selector': '[aria-label="分类管理容器"] input[type=file]'})['nodeId']
    assert node
    b.call('DOM.setFileInputFiles', {'nodeId': node, 'files': [str(path.resolve())]})
    b.wait("Boolean(document.querySelector('[aria-label=\"Class 树导入总控\"]'))", 30)

try:
    nav()
    if b.evaluate("Array.from(document.querySelectorAll('button')).some(x=>x.textContent.trim()==='继续编辑')"):
        b.click('恢复默认')
    b.wait("Boolean(document.querySelector('nav[aria-label=\"设计工作区\"]'))", 45)
    baseline = state()['active']
    new_node('P0_ACCEPT', geometry='')
    assert state()['active'] == baseline
    b.click('核验')
    b.wait("document.body.innerText.includes('每个最终分类必须解析为一种明确几何类型')")
    assert b.evaluate("Array.from(document.querySelectorAll('button')).find(x=>x.textContent.trim()==='保存')?.disabled")
    assert b.evaluate("Array.from(document.querySelectorAll('button')).find(x=>x.textContent.trim()==='导出分类')?.disabled")
    b.click('暂存节点')
    b.wait("Boolean(document.querySelector('[aria-label=\"普通分类草稿暂存\"]'))")
    new_node('GROUP')
    b.click('暂存节点')
    checks.append('untyped root and intermediate node stage without activation; strict save/export gates remain')
    new_node('POINT', template='PLF')
    b.click('暂存节点')
    value('编辑分类 SKind', '')
    new_node('LINE', template='RLE')
    b.click('暂存节点')
    snapshot = state()
    assert snapshot['active'] == baseline
    nodes = [node for node in snapshot['session']['draft']['nodes'] if node['path']['class'] == 'P0_ACCEPT']
    assert len(nodes) == 4
    assert {node.get('geometryType') for node in nodes} == {None, 'Point', 'LineString'}
    assert snapshot['session']['tree'] is None
    b.screenshot('p0-ordinary-draft.png')
    time.sleep(1.2)
    nav()
    b.wait("Array.from(document.querySelectorAll('button')).some(x=>x.textContent.trim()==='继续编辑')")
    b.click('继续编辑')
    b.wait("Boolean(document.querySelector('[aria-label=\"普通分类草稿暂存\"]'))", 30)
    recovered = state()
    assert recovered['active'] == baseline
    assert recovered['session']['draft'] == snapshot['session']['draft']
    checks.append('PLF/RLE template initialization and mixed geometry children; ordinary draft recovers via explicit cache admission')
    b.click('核验分类草稿')
    b.click('保存分类草稿')
    b.wait("!document.querySelector('[aria-label=\"普通分类草稿暂存\"]')")
    saved = state()['active']
    assert len(saved['nodes']) == len(baseline['nodes']) + 4
    # Ordinary local saves already advance the local config revision. Compare
    # the later deletion with that expected identity, not the formal r number.
    baseline = {**baseline, 'revision': saved['revision']}
    before_files = set(downloads.glob('*.zip'))
    value('分类导出范围', 'classTree')
    b.click('导出分类')
    deadline = time.time() + 30
    artifact = None
    while time.time() < deadline:
        files = set(downloads.glob('*.zip')) - before_files
        if files:
            artifact = next(iter(files))
            if zipfile.is_zipfile(artifact):
                break
        time.sleep(.2)
    assert artifact and zipfile.is_zipfile(artifact)
    with zipfile.ZipFile(artifact) as archive:
        payload = json.loads(archive.read('category.json'))
    assert len(payload['nodes']) == 4
    upload(artifact)
    assert state()['active'] == saved
    new_node('IMPORTED_GROUP', geometry='')
    b.click('核验')
    b.click('保存')
    b.wait("Array.from(document.querySelectorAll('button')).some(x=>x.textContent.trim()==='读取分类')")
    assert state()['session']['editing'] is False
    assert len([node for node in state()['session']['tree']['staged']['nodes'] if node['path']['class']=='P0_ACCEPT']) == 5
    new_node('IMPORTED_POINT', geometry='Point')
    b.click('核验')
    b.click('保存')
    assert state()['active'] == saved
    b.click('核验整棵 Class 树')
    b.click('放弃导入 Class 树')
    assert state()['active'] == saved
    upload(artifact)
    b.click('核验整棵 Class 树')
    b.click('保存 Class 树到总配置')
    b.wait("!document.querySelector('[aria-label=\"Class 树导入总控\"]')")
    assert state()['active'] == saved
    checks.append('actual ZIP download/file selection; imported-tree intermediate nodes stage without activation; discard and commit preserve saved design')
    value('编辑分类 Class', 'P0_ACCEPT')
    b.click('删除当前分类及其子分类')
    b.wait("Boolean(document.querySelector('[aria-label=\"删除分类及其全部子分类\"]'))")
    assert b.evaluate("document.querySelector('[aria-label=\"删除分类及其全部子分类\"]').innerText.includes('4 个分类定义')")
    b.click('取消删除分类')
    assert state()['active'] == saved
    b.click('删除当前分类及其子分类')
    b.screenshot('p0-subtree-delete-confirmation.png')
    b.click('暂存删除到整包草稿')
    assert state()['active'] == saved
    b.click('总体规则')
    b.wait("location.search.includes('tab=general')")
    b.click('要素设计')
    b.click('核验整包草稿')
    b.click('保存整包草稿')
    b.wait("!Array.from(document.querySelectorAll('button')).some(x=>x.textContent.trim()==='保存整包草稿')")
    assert state()['active'] == baseline
    checks.append('recursive deletion preview/cancel, cross-tab candidate repairs and final commit; unrelated config remains identical')
    value('编辑分类 Class', 'ROD')
    b.click('删除当前分类及其子分类')
    b.click('暂存删除到整包草稿')
    b.click('核验整包草稿')
    b.wait("Array.from(document.querySelectorAll('button')).find(x=>x.textContent.trim()==='保存整包草稿')?.disabled")
    assert state()['active'] == baseline
    b.screenshot('p0-deletion-reference-block.png')
    b.click('放弃整包草稿')
    b.click('工作流设计')
    b.click('删除工作流')
    b.wait("Array.from(document.querySelectorAll('button')).some(x=>x.textContent.trim()==='放弃整包草稿')")
    assert len(state()['session']['packageCandidate']['config']['workflows']) == len(baseline['workflows']) - 1
    assert state()['active'] == baseline
    b.click('放弃整包草稿')
    assert state()['active'] == baseline
    checks.append('referenced-class deletion cannot pass final save; workflow deletion is isolated and reversible')
    b.click('要素设计')
    for level,code in [('Class','ISL'),('Kind','NGF'),('SKind','BOD')]:
        value('编辑分类 '+level,code)
    b.click('新增分类')
    value('新分类代码','STYLE_ONLY')
    value('新分类名称 zh','显示模板回退测试')
    value('初始化状态','template')
    value('分类模板来源 Class','ROD')
    for title in ['同步字段设计','同步信息卡设置']:
        b.evaluate('(()=>{const e=[...document.querySelectorAll(\'section[aria-label="新增要素分类"] label\')].find(e=>e.textContent.trim().startsWith('+json.dumps(title)+')).querySelector(\'input[type="checkbox"]\');if(e.checked)e.click();})()')
    b.click('创建分类草稿')
    b.wait('!document.querySelector(\'section[aria-label="新增要素分类"]\')')
    copied=next(node for node in state()['session']['draft']['nodes'] if node['path'].get('skind2')=='STYLE_ONLY')
    assert copied['fields']==[] and not copied.get('fieldSettings')
    assert '#111827' in json.dumps(copied['geometryProfiles'])
    assert '显示取色回退' in b.evaluate('Array.from(document.querySelectorAll("details")).find(e=>e.querySelector("summary")?.textContent==="分类创建报告")?.textContent')
    b.click('核验')
    assert not b.evaluate('Array.from(document.querySelectorAll("button")).find(e=>e.textContent.trim()==="保存")?.disabled')
    b.screenshot('display-only-template-fallback.png')
    b.click('放弃草稿')
    assert state()['active']==baseline
    checks.append('actual display-only ROD template borrows explicit fallback colors under natural line schema, without road fields; report and validation pass; source unchanged')
    assert not b.errors, b.errors
    (OUT / 'category-authoring-acceptance.json').write_text(json.dumps({'checks': checks, 'dialogs': b.dialogs, 'runtimeErrors': b.errors, 'download': str(artifact)}, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps({'checks': checks, 'runtimeErrors': b.errors}, ensure_ascii=False))
except Exception:
    b.screenshot('p0-category-failure.png')
    (OUT / 'category-authoring-failure.txt').write_text(traceback.format_exc() + '\n\n' + b.evaluate('document.body.innerText'), encoding='utf-8')
    raise
