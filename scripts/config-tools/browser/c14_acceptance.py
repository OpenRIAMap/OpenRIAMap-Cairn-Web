"""c14 real UI regressions. Disposable local browser only; no login/cloud writes."""
import base64,json,os,time,gzip
from urllib.request import build_opener,ProxyHandler,Request
from pathlib import Path
from browser_check import Browser,APP_URL,OUT
assert APP_URL.startswith('http://127.0.0.1:')
assert os.environ.get('CAIRNMAP_CDP_PORT') in ('9502','9514','9524')

class C14Browser(Browser):
    def call(self,method,params=None):
        self.seq+=1;ident=self.seq
        self.ws.send(json.dumps({'id':ident,'method':method,'params':params or {}}))
        while True:
            result=json.loads(self.ws.recv())
            if result.get('method')=='Runtime.exceptionThrown':self.errors.append(result['params'])
            if result.get('method')=='Page.javascriptDialogOpening':
                self.seq+=1;self.ws.send(json.dumps({'id':self.seq,'method':'Page.handleJavaScriptDialog','params':{'accept':True}}))
            if result.get('id')!=ident:continue
            if 'error' in result:raise RuntimeError(result['error'])
            return result.get('result',{})

source=json.loads(gzip.decompress((Path(__file__).resolve().parent.parent/'fixtures/c13-baseline.config.json.gz').read_bytes()))
# Discard only tabs in the explicitly disposable local CDP instance. A failed
# dirty-editor test can otherwise leave a beforeunload dialog blocking CDP.
opener=build_opener(ProxyHandler({}));cdp='http://127.0.0.1:'+os.environ['CAIRNMAP_CDP_PORT']
opener.open(Request(cdp+'/json/new?about:blank',method='PUT')).read()
for page in json.loads(opener.open(cdp+'/json').read()):
    if page['type']=='page' and page['url']!='about:blank':opener.open(cdp+'/json/close/'+page['id']).read()
b=C14Browser();checks=[]
files=OUT.parent/'c14-fixtures';files.mkdir(parents=True,exist_ok=True)
downloads=OUT.parent/'c14-downloads';downloads.mkdir(parents=True,exist_ok=True)
DOC="(s.getStudioSessionSnapshot()?.draft??s.getStudioSessionSnapshot()?.tree?.staged??s.getStudioSessionSnapshot()?.packageCandidate?.config??s.getActiveConfigSnapshot())"
def document(expr='contractRevision'):
    return b.evaluate("(async()=>{const s=await import('/src/configStudio/workspaceController.ts');const c="+DOC+";return c."+expr+"})()")
def snapshot():return b.evaluate("(async()=>{const s=await import('/src/configStudio/workspaceController.ts');return s.getStudioSessionSnapshot()})()")
def editor():b.wait("Boolean(document.querySelector('nav[aria-label=\"设计工作区\"]'))",45)
def nav():
    b.call('Page.navigate',{'url':APP_URL+'/?workspace=config-studio&tab=features&c14acceptance='+str(time.time_ns())})
    b.wait("Boolean(document.querySelector('nav[aria-label=\"设计工作区\"]'))||Boolean(document.querySelector('[aria-label=\"检测到本机编辑缓存\"]'))||[...document.querySelectorAll('button')].some(x=>x.textContent==='下载并启用')",45)
    if b.evaluate("[...document.querySelectorAll('button')].some(x=>x.textContent==='下载并启用')"):
        b.click('下载并启用');b.wait("Boolean(document.querySelector('nav[aria-label=\"设计工作区\"]'))||Boolean(document.querySelector('[aria-label=\"检测到本机编辑缓存\"]'))",45)
def reset():
    b.call('Page.navigate',{'url':'about:blank'});b.wait("location.href==='about:blank'")
    b.call('Storage.clearDataForOrigin',{'origin':APP_URL,'storageTypes':'all'})
    nav();editor()
def select(selector,value):
    b.evaluate("(()=>{const el=document.querySelector("+json.dumps(selector)+");if(!el)throw Error('Select missing');el.value="+json.dumps(value)+";el.dispatchEvent(new Event('change',{bubbles:true}));})()")
    settle()
def settle():b.evaluate("new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))")
def fill(scope,label,value):
    b.evaluate("(()=>{const e=[...document.querySelector("+json.dumps(scope)+").querySelectorAll('label')].find(x=>x.textContent.trim().startsWith("+json.dumps(label)+"))?.querySelector('input,textarea');if(!e)throw Error('Input missing: '+"+json.dumps(label)+");Object.getOwnPropertyDescriptor(e instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype,'value').set.call(e,"+json.dumps(str(value))+");e.dispatchEvent(new Event('input',{bubbles:true}));})()")
    settle()
def input_value(selector,value):
    b.evaluate("(()=>{const e=document.querySelector("+json.dumps(selector)+");if(!e)throw Error('Input missing');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,"+json.dumps(str(value))+");e.dispatchEvent(new Event('input',{bubbles:true}));})()")
    settle()
def select_label(scope,label,value):
    b.evaluate("(()=>{const e=[...document.querySelector("+json.dumps(scope)+").querySelectorAll('label')].find(x=>x.textContent.trim().startsWith("+json.dumps(label)+"))?.querySelector('select');if(!e)throw Error('Select missing: '+"+json.dumps(label)+");e.value="+json.dumps(value)+";e.dispatchEvent(new Event('change',{bubbles:true}));})()")
    settle()
def click_selector(selector):
    rect=b.evaluate("(()=>{const el=document.querySelector("+json.dumps(selector)+");if(!el||el.disabled)throw Error('Click target missing/disabled');el.scrollIntoView({block:'center'});const r=el.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,h:r.height}})()")
    assert rect['h']>0,selector
    b.call('Input.dispatchMouseEvent',{'type':'mousePressed','x':rect['x'],'y':rect['y'],'button':'left','clickCount':1});b.call('Input.dispatchMouseEvent',{'type':'mouseReleased','x':rect['x'],'y':rect['y'],'button':'left','clickCount':1})
    settle()
def inside(selector,label):
    match="x.textContent.trim().startsWith("+json.dumps(label)+")" if label=='Icon 选择与配置' else "x.textContent.trim()==="+json.dumps(label)
    b.evaluate("(()=>{const e=[...document.querySelector("+json.dumps(selector)+").querySelectorAll('button')].find(x=>"+match+");if(!e||e.disabled)throw Error('Button disabled/missing');e.click();})()")
    settle()
def upload(selector,file):
    root=b.call('DOM.getDocument')['root']['nodeId'];node=b.call('DOM.querySelector',{'nodeId':root,'selector':selector})['nodeId'];assert node
    b.call('DOM.setFileInputFiles',{'nodeId':node,'files':[str(file.resolve())]})
def open_rule(rule_id):
    selector='details[data-fold-key='+json.dumps('rule:'+rule_id)+']'
    if not b.evaluate('document.querySelector('+json.dumps(selector)+').open'):click_selector(selector+'>summary')
    return selector
def record(label):
    checks.append(label);(OUT/'c14-browser-progress.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8')

try:
    b.call('Network.enable');b.call('Network.setBlockedURLs',{'urls':['https://*',APP_URL+'/api/*','http://analysis.602007.xyz/*']})
    b.call('Browser.setDownloadBehavior',{'behavior':'allow','downloadPath':str(downloads.resolve())})
    reset()
    assert '契约 c' in b.evaluate("document.querySelector('main header').innerText")
    # Prepare old files with the actual codecs. Their import is performed via file inputs.
    payload=b.evaluate("""(async()=>{const c="""+json.dumps(source)+""";const a=await import('/src/configStudio/categoryArtifact.ts'),w=await import('/src/configStudio/workflowArtifact.ts');const n=c.nodes.find(n=>n.path.class==='PLF');return {config:JSON.stringify(c),node:JSON.stringify(await a.createCategoryArtifact(c,n.nodeId,'node')),tree:JSON.stringify(await a.createCategoryArtifact(c,n.nodeId,'classTree')),workflow:JSON.stringify(w.buildWorkflowArtifact(c,c.workflows.find(w=>w.mode==='composed')))}})()""")
    for name,body in payload.items():(files/(name+'.json')).write_text(body,encoding='utf-8')
    archive=b.evaluate("""(async()=>{const p=await import('/src/configStudio/package.ts'),r=await import('/src/configStudio/runtime.ts');const c="""+json.dumps(source)+""";const bytes=new Uint8Array(await(await p.buildConfigPackageArchive(c,r.validateConfigPackage(c))).arrayBuffer());return btoa(Array.from(bytes,b=>String.fromCharCode(b)).join(''))})()""")
    (files/'config.zip').write_bytes(base64.b64decode(archive))
    # Reproduce the old unsaved-draft scenario without a real user's storage.
    b.call('Page.navigate',{'url':APP_URL+'/scripts/browser/fixtures/studio-formal-default.html'});b.wait("document.title==='Studio storage acceptance'")
    b.evaluate("""(async()=>{const c="""+json.dumps(source)+""",d=structuredClone(c),n=d.nodes.find(n=>n.path.class==='BUD');n.fields.find(f=>f.key==='Name').labels.zh='C14_UNSAVED_DRAFT';const st=await import('/src/configStudio/workspaceStorage.ts'),old=await st.initializeWorkspaceStorage();await st.writeWorkspaceCheckpoint({schemaVersion:'cairnmap.studio-workspace.v1',config:c,session:{baseline:c,draft:d,tree:null,selectedId:n.nodeId,editing:true,activeTab:'features',detailsByTab:{features:[1]}},generation:1,updatedAt:new Date().toISOString()},old.token);return true})()""")
    nav();b.click('继续编辑');editor()
    assert document('contractRevision')==13
    b.click('已读取草稿')
    assert document("nodes.find(n=>n.path.class==='BUD').fields.find(f=>f.key==='Name').labels.zh")=='C14_UNSAVED_DRAFT'
    assert document('contractRevision')==13
    assert b.evaluate("[...document.querySelectorAll('main header button')].find(x=>x.textContent.includes('迁移到 c14')).disabled")
    b.screenshot('c13-restored-draft-protected.png');record('c13 restored unsaved category survives repeated read; migration is blocked until its region finishes')
    reset()
    b.call('Page.navigate',{'url':APP_URL+'/scripts/browser/fixtures/studio-formal-default.html'});b.wait("document.title==='Studio storage acceptance'")
    b.evaluate("""(async()=>{const c="""+json.dumps(source)+""";const st=await import('/src/configStudio/workspaceStorage.ts'),old=await st.initializeWorkspaceStorage();await st.writeWorkspaceCheckpoint({schemaVersion:'cairnmap.studio-workspace.v1',config:c,generation:1,updatedAt:new Date().toISOString()},old.token);return true})()""")
    nav();b.click('继续编辑');editor();b.click('迁移到 c14 草稿');b.wait("Boolean(document.querySelector('[aria-label=\"整包草稿操作\"]'))")
    assert document('contractRevision')==14
    assert b.evaluate("document.querySelector('[aria-label=\"迁移处理提示\"]').innerText.includes('新增')")
    before=document('revision');b.click('清除全部迁移提示');assert document('revision')==before
    assert b.evaluate("(async()=>{const s=await import('/src/configStudio/workspaceController.ts');return s.getWorkspaceState().migration.report.dismissed.length>0})()")
    record('explicit c13 → c14 candidate, source-preserving migration notices and dismissal without validation bypass')
    select('select[aria-label="编辑分类 Class"]','PLF')
    upload('input[accept=".json,.zip"]',files/'node.json');b.wait("[...document.querySelectorAll('button')].some(x=>x.textContent==='已读取草稿')")
    assert document('contractRevision')==14;b.click('核验');b.click('保存')
    b.wait("[...document.querySelectorAll('button')].some(x=>x.textContent==='读取分类')")
    b.click('导出分类');b.wait("document.body.innerText.includes('分类文件已导出。')")
    b.wait("document.querySelector('[aria-label=\"分类导出范围\"]')?.value==='node'")
    select('select[aria-label="分类导出范围"]','classTree');b.click('导出分类')
    upload('input[accept=".json,.zip"]',files/'tree.json');b.wait("Boolean(document.querySelector('[aria-label=\"Class 树导入总控\"]'))")
    b.click('核验整棵 Class 树');b.click('保存 Class 树到总配置');b.wait("!document.querySelector('[aria-label=\"Class 树导入总控\"]')")
    record('actual c13 category and Class-tree file selection, automatic c14 migration and region/tree validation/save')
    b.click('工作流设计');upload('[aria-label="工作流编辑区域"] input[type=file]',files/'workflow.json')
    b.wait("[...document.querySelector('[aria-label=\"工作流编辑区域\"]').querySelectorAll('button')].find(x=>x.textContent==='核验')?.disabled===false")
    inside('[aria-label="工作流编辑区域"]','核验');inside('[aria-label="工作流编辑区域"]','保存')
    b.wait("[...document.querySelector('[aria-label=\"工作流编辑区域\"]').querySelectorAll('button')].find(x=>x.textContent==='核验')?.disabled===true")
    b.click('要素设计');record('actual c13 workflow import/validation/save into c14; workflow structure preserved')
    # Whole-package import gets its declared latest writable target independently.
    b.click('放弃整包草稿');upload('main header input[type=file]',files/'config.zip')
    b.wait("Boolean(document.querySelector('[aria-label=\"整包草稿操作\"]'))");assert document('contractRevision')==14
    b.click('下载导入原件')
    deadline=time.time()+10
    while time.time()<deadline and not any(p.read_bytes()==(files/'config.zip').read_bytes() for p in downloads.glob('config*.zip')):time.sleep(.1)
    assert any(p.read_bytes()==(files/'config.zip').read_bytes() for p in downloads.glob('config*.zip')),'original ZIP bytes must survive import unchanged'
    select('select[aria-label="编辑分类 Class"]','SBP');b.click('读取分类')
    b.wait("Boolean(document.querySelector('details[data-fold-key^=\"field:\"]'))")
    assert b.evaluate("[...document.querySelectorAll('details[data-fold-key]')].every(x=>!x.open)")
    click_selector('details[aria-label="字段 Name"]>summary')
    assert b.evaluate("document.querySelector('details[aria-label=\"字段 Name\"]').open")
    # Choose the ordinary rule that actually participates at preview Zoom 6.
    rule_id=document("nodes.find(n=>n.path.class==='SBP').geometryProfiles.Point.zoomPriority.rules.filter(r=>r.style?.pointSymbol&&(r.when?.zoom.min??r.minZoom??0)<=6&&(r.when?.zoom.max??r.maxZoom??8)>=6).at(-1).id")
    rule=open_rule(rule_id);point=rule+' [aria-label="点状显示效果"]'
    select(point+' select','shape');halo=point+' [aria-label="Halo 外环"]'
    click_selector(halo+' input[type=checkbox]')
    b.wait("Boolean(document.querySelector('.ria-config-shape-marker svg g[stroke=\"#ffffff\"]'))",30)
    assert document("nodes.find(n=>n.path.class==='SBP').geometryProfiles.Point.zoomPriority.rules.find(r=>r.id==="+json.dumps(rule_id)+").style.pointSymbol.shape.halo.enabled")
    for shape in ['square','triangle','regular4','regular5','regular6','circle']:
        select_label(point,'显示效果（基础点）',shape)
        b.wait("Boolean(document.querySelector('.ria-config-shape-marker svg g[stroke=\"#ffffff\"]'))")
    select_label('main','样例状态','multiPoint')
    b.wait("document.querySelectorAll('.ria-config-shape-marker').length===3")
    select_label('main','样例状态','singlePoint')
    for mode in ['field','relatedLine','external']:
        select_label(halo,'颜色模式',mode)
        if mode=='field':select_label(halo,'绑定颜色指示字段','Name')
        if mode=='external':
            select_label(halo,'关系目标分类',document("nodes.find(n=>n.path.class==='SBP').nodeId"));select_label(halo,'目标要素颜色字段','Name')
        b.wait("Boolean(document.querySelector('.ria-config-shape-marker svg'))")
    select_label(halo,'颜色模式','valueMap');select_label(halo,'设色字段','Name');inside(halo,'添加值—颜色行')
    input_value(halo+' input[aria-label="设色保存值 1"]','HALO_GREEN');input_value(halo+' input[aria-label="设色颜色 1"]','#00ff00');inside(halo,'显示第 1 行')
    b.wait("Boolean(document.querySelector('.ria-config-shape-marker svg g[stroke=\"#00ff00\"]'))")
    select_label(halo,'颜色模式','fixed');input_value(halo+' input[type=color]','#ffffff')
    record('all five Halo color modes use the shared controls; a Halo color mapping row actually injects and renders its green sample')
    b.screenshot('c14-shape-halo-and-folds.png');record('fresh fields/cards/rules folded; explicit field expansion; all basic-point shapes and three-point collection Halo actually rendered in verifier')
    select(point+' select','icon')
    inside(point,'Icon 选择与配置')
    b.wait("Boolean(document.querySelector('[aria-label=\"Icon 选择与配置\"]'))")
    dialog='[aria-label="Icon 选择与配置"]';inside(dialog,'下一页')
    b.wait("Boolean(document.querySelector('[aria-label=\"Icon 选择与配置\"] [aria-label=\"Halo 外环\"]'))")
    select_label(dialog,'底板形状','circle')
    click_selector(dialog+' [aria-label="Halo 外环"] input[type=checkbox]')
    b.wait("document.querySelector('[alt=\"组合图标实际 CSS 像素预览\"]')?.complete===true",30)
    b.screenshot('c14-icon-halo-dialog.png');b.click('确认图标配置')
    b.wait("!document.querySelector('[aria-label=\"Icon 选择与配置\"]')")
    b.wait("Boolean(document.querySelector('img.leaflet-marker-icon[src^=\"data:image/svg\"]'))",30)
    record('Icon catalogue/configuration modal with live Halo preview, confirmation and actual SVG map symbol')
    # Each image definition owns its halo; no pixel access or cross-origin canvas.
    select(point+' select','externalImage');select_label(point,'图片来源','fixed');image_url=APP_URL+'/icons/pinhead/v25/bus.svg'
    fill(point,'图片 URL',image_url);click_selector(point+' [aria-label="Halo 外环"] input[type=checkbox]')
    b.wait("Boolean(document.querySelector('.ria-config-image-marker img'))",30)
    fixed=b.evaluate("(()=>{const e=document.querySelector('.ria-config-image-marker img'),r=e.getBoundingClientRect();return {w:r.width,h:r.height,outline:getComputedStyle(e).outlineWidth}})()")
    assert fixed=={'w':24,'h':24,'outline':'2px'},fixed
    b.screenshot('c14-image-rectangle-halo.png')
    source_select=point+' select' # Point kind; source mode is selected by its label below.
    select_label(point,'图片来源','valueMap');select_label(point,'图片映射字段','Name');inside(point,'添加图片映射行')
    def row(index):
        b.evaluate("[...document.querySelector("+json.dumps(point)+").querySelectorAll('section.cm-item')].forEach((e,i)=>e.setAttribute('data-c14-image-row',i))")
        return point+' [data-c14-image-row="'+str(index)+'"]'
    first=row(0);fill(first,'实际保存值','HALO_IMAGE_A');fill(first,'图片 URL',image_url)
    click_selector(first+' [aria-label="Halo 外环"] input[type=checkbox]');inside(first,'显示第 1 行')
    b.wait("Boolean(document.querySelector('.ria-config-image-marker img'))",30)
    inside(point,'添加图片映射行');second=row(1);fill(second,'实际保存值','HALO_IMAGE_B');fill(second,'图片 URL',image_url);fill(second,'图片宽 px',40);fill(second,'图片高 px',20)
    click_selector(second+' [aria-label="Halo 外环"] input[type=checkbox]');fill(second+' [aria-label="Halo 外环"]','粗细 px',4);inside(second,'显示第 2 行')
    b.wait("(()=>{const e=document.querySelector('.ria-config-image-marker img');return e&&e.getBoundingClientRect().width===40&&getComputedStyle(e).outlineWidth==='4px'})()",30)
    settings=document("nodes.find(n=>n.path.class==='SBP').geometryProfiles.Point.zoomPriority.rules.find(r=>r.id==="+json.dumps(rule_id)+").style.pointSymbol.image.entries.map(r=>({value:r.value,width:r.presentation.sizePx.width,halo:r.presentation.halo.widthPx}))")
    assert settings==[{'value':'HALO_IMAGE_A','width':24,'halo':2},{'value':'HALO_IMAGE_B','width':40,'halo':4}],settings
    b.screenshot('c14-image-map-independent-halo.png');inside(second,'删除图片行')
    select_label(point,'图片来源','fieldUrl');select_label(point,'图标 URL 字段','Name')
    b.wait("!document.querySelector('.ria-config-image-marker')")
    select_label(point,'图片来源','externalFieldUrl');select_label(point,'目标要素 ID 所在字段','ID');fill(point,'目标要素的图片 URL 字段路径','Name')
    b.wait("!document.querySelector('.ria-config-image-marker')")
    # Fallback is independent of the failed image's rectangle.
    fallback=point+' fieldset.cm-subsection:last-child'
    b.evaluate("(()=>{const p=document.querySelector("+json.dumps(point)+");const f=[...p.querySelectorAll('fieldset')].find(e=>e.querySelector(':scope > legend')?.textContent==='显示效果（回退）');if(!f)throw Error('fallback missing');f.setAttribute('data-c14-fallback','true')})()")
    fallback=point+' [data-c14-fallback]';click_selector(fallback+' [aria-label="Halo 外环"] input[type=checkbox]');inside(fallback,'显示回退效果')
    b.wait("Boolean(document.querySelector('.ria-config-shape-marker svg'))",30);assert not b.evaluate("Boolean(document.querySelector('.ria-config-image-marker'))")
    record('four image sources, per-row size/Halo, real rectangle rendering, row deletion cleanup and independently rendered fallback Halo')
    # Geometry halo shares the exact projected path; updates follow stroke style.
    b.click('放弃草稿');select('select[aria-label="编辑分类 Class"]','ROD');b.click('读取分类')
    line_id=document("nodes.find(n=>n.path.class==='ROD').geometryProfiles.LineString.zoomPriority.rules.filter(r=>(r.when?.zoom.min??r.minZoom??0)<=6&&(r.when?.zoom.max??r.maxZoom??8)>=6).at(-1).id")
    line=open_rule(line_id)
    b.evaluate("(()=>{const p=document.querySelector("+json.dumps(line)+");const button=[...p.querySelectorAll('button')].find(e=>e.textContent==='显示效果');if(button&&!button.disabled)button.click()})()")
    click_selector(line+' [aria-label="Halo 外环"] input[type=checkbox]')
    b.wait("Boolean(document.querySelector('path.ria-geometry-halo'))",30)
    assert b.evaluate("(()=>{const h=document.querySelector('path.ria-geometry-halo'),p=h.nextElementSibling;return h.getAttribute('d')===p.getAttribute('d')&&h.getAttribute('fill')==='none'&&h.style.pointerEvents==='none'})()")
    fill(line,'描边粗细',8)
    b.wait("[...document.querySelectorAll('path.ria-geometry-halo')].some(h=>h.getAttribute('stroke-width')==='12')",30)
    select_label(line,'显示效果','dash')
    b.wait("[...document.querySelectorAll('path.ria-geometry-halo')].some(h=>h.getAttribute('stroke-dasharray')===h.nextElementSibling.getAttribute('stroke-dasharray')&&h.hasAttribute('stroke-dasharray'))")
    select_label('main','样例状态','multiLine');b.wait("[...document.querySelectorAll('path.ria-geometry-halo')].some(h=>(h.getAttribute('d').match(/M/g)||[]).length>=2)")
    b.screenshot('c14-line-halo.png');record('single/multipart line Halo uses identical projected geometry, responds to stroke changes and preserves dash pattern without extra event targets')
    select_label(line,'显示种类','point');line_point=line+' [aria-label="点状显示效果"]'
    click_selector(line_point+' [aria-label="Halo 外环"] input[type=checkbox]')
    b.wait("Boolean(document.querySelector('.ria-config-shape-marker svg'))");assert not b.evaluate("Boolean(document.querySelector('path.ria-geometry-halo'))")
    record('line point-representation uses its own point Halo and removes the old geometry Halo')
    b.click('放弃草稿');select('select[aria-label="编辑分类 Class"]','BUD');b.click('读取分类');select_label('main','样例状态','smallPolygon')
    polygon_id=document("nodes.find(n=>n.path.class==='BUD').geometryProfiles.Polygon.zoomPriority.rules.filter(r=>(r.when?.zoom.min??r.minZoom??0)<=6&&(r.when?.zoom.max??r.maxZoom??8)>=6).at(-1).id")
    polygon=open_rule(polygon_id);click_selector(polygon+' [aria-label="Halo 外环"] input[type=checkbox]');fill(polygon,'填色透明度',0)
    b.wait("Boolean(document.querySelector('path.ria-geometry-halo'))",30)
    assert b.evaluate("[...document.querySelectorAll('path.ria-geometry-halo')].some(h=>h.nextElementSibling.getAttribute('fill-opacity')==='0')")
    b.screenshot('c14-transparent-polygon-halo.png');record('transparent polygon keeps visible inward/outward boundary Halo while the original fill remains transparent')
    # Continue-edit is explicit, and stable fold IDs restore the same open rule.
    fold_key='rule:'+polygon_id
    b.evaluate("(async()=>{const w=await import('/src/configStudio/workspaceController.ts');await w.flushWorkspace()})()")
    nav();b.click('继续编辑');editor()
    b.wait('document.querySelector('+json.dumps('details[data-fold-key="'+fold_key+'"]')+')?.open')
    assert document('contractRevision')==14
    assert b.evaluate("(async()=>{const w=await import('/src/configStudio/workspaceController.ts');return /^[a-f0-9]{64}$/.test(w.getWorkspaceState().migration.resultSha256)})()")
    record('explicit cached-workspace continue restores c14 edits and the same stable rule fold ID')
    assert document("nodes.find(n=>n.path.class==='BUD').geometryProfiles.Polygon.zoomPriority.rules.find(r=>r.id==="+json.dumps(polygon_id)+").style.halo.enabled")
    select_label(polygon,'显示种类','point');polygon_point=polygon+' [aria-label="点状显示效果"]'
    click_selector(polygon_point+' [aria-label="Halo 外环"] input[type=checkbox]')
    b.wait("Boolean(document.querySelector('.ria-config-shape-marker svg'))");assert not b.evaluate("Boolean(document.querySelector('path.ria-geometry-halo'))")
    record('polygon point-representation uses its own point Halo and removes the old geometry Halo')
    # Current candidate, rather than saved baseline, controls the migration gate.
    reset();b.call('Page.navigate',{'url':APP_URL+'/scripts/browser/fixtures/studio-formal-default.html'});b.wait("document.title==='Studio storage acceptance'")
    b.evaluate("""(async()=>{const c="""+json.dumps(source)+""";const m=await import('/src/configStudio/contractMigration.ts'),st=await import('/src/configStudio/workspaceStorage.ts');const base=m.migratePackageToC14(c).config,old=await st.initializeWorkspaceStorage();await st.writeWorkspaceCheckpoint({schemaVersion:'cairnmap.studio-workspace.v1',config:base,session:{baseline:base,draft:null,tree:null,selectedId:'',editing:false,packageCandidate:{baseline:base,config:c,source:'recovery'}},generation:1,updatedAt:new Date().toISOString()},old.token);return true})()""")
    nav();b.click('继续编辑');editor();assert document('contractRevision')==13
    b.click('迁移到 c14 草稿');assert document('contractRevision')==14
    assert snapshot()['packageCandidate']['baseline']['contractRevision']==14
    record('c14 saved baseline with c13 current candidate migrates the candidate and preserves its saved c14 baseline')
    assert not b.errors,b.errors
    result={'checks':checks,'runtimeErrors':b.errors,'cloudWrites':0}
    (OUT/'c14-browser.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(result,ensure_ascii=False))
except Exception:
    b.screenshot('c14-failure.png')
    (OUT/'c14-error-state.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors,'body':b.evaluate('document.body.innerText')},ensure_ascii=False,indent=2),encoding='utf-8')
    raise
finally:b.ws.close()
