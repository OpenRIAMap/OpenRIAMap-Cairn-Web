"""Actual five-fix UI regression; no production data, credentials or writes."""
import ast,copy,json,sys,time,traceback
from pathlib import Path
source=Path(__file__).with_name('single_entry_drawing_acceptance.py')
tree=ast.parse(source.read_text(encoding='utf-8-sig'));prefix=[]
for statement in tree.body:
 if isinstance(statement,ast.Try):break
 prefix.append(statement)
exec(compile(ast.Module(body=prefix,type_ignores=[]),str(source),'exec'),globals())

def paths():return b.evaluate('Object.values(window.workflowAcceptance.map._layers).filter(l=>typeof l.getLatLngs==="function").map(l=>({geometry:l.toGeoJSON().geometry,weight:l.options.weight,dash:l.options.dashArray??null,interactive:l.options.interactive,index:[...document.querySelectorAll(".leaflet-overlay-pane svg path")].indexOf(l._path)}))')
def no_duplicate():assert not any(p['weight']==4 and p['interactive'] for p in paths()),paths()
def part_locked():return b.evaluate('document.querySelector(\'select[aria-label="部件编号"]\').disabled')
def row(record):return '[...document.querySelectorAll("div")].find(e=>e.getBoundingClientRect().height&&typeof e.className==="string"&&e.className.includes("whitespace-nowrap")&&e.textContent.includes('+json.dumps(record['ID'])+'))'
def reopen(record):
 press('('+row(record)+').querySelector(\'button[title="展开工具栏"]\')')
 press('[...('+row(record)+').querySelectorAll("button")].find(e=>e.textContent.trim()==="编辑")')
 b.wait('!!document.querySelector(\'section[aria-label="V3 工作流式编辑"]\')')
def full_mode():
 if not b.evaluate('[...document.querySelectorAll("button")].some(e=>e.textContent.trim()==="切换到完整模式"&&e.getBoundingClientRect().height)'):click('测绘')
 click('切换到完整模式')
def after_save(expected):
 p=paths();components=[]
 for shape in p:
  g=shape['geometry'];assert g['type'] in ('Polygon','MultiPolygon')
  components.extend([g['coordinates']] if g['type']=='Polygon' else g['coordinates'])
 assert len(components)==len(expected['parts']),(p,expected)
 for component,part in zip(components,expected['parts']):assert len(component)==len(part)
 # SVG even-odd fill must leave the center of each known rectangular hole empty.
 for part in expected['parts']:
  for ring in part[1:]:
   x=sum(v['x'] for v in ring)/len(ring);z=sum(v['z'] for v in ring)/len(ring)
   assert b.evaluate('(()=>{const p=window.workflowAcceptance.screenPointAt('+str(x)+','+str(z)+');return [...document.querySelectorAll(".leaflet-overlay-pane svg path")].every(e=>!e.isPointInFill(new DOMPoint(p.x,p.y).matrixTransform(e.getScreenCTM().inverse())));})()')

def isolated_formal_reader():
 # Valid empty release fixture for the actual global-ID reader; no remote I/O.
 b.evaluate('''(async()=>{const {applyApplicationSettings}=await import('/src/core/project/applicationRuntime.ts');const app=structuredClone(window.workflowAcceptance.config.application);for(const group of app.sources.groups){group.dataPathTemplate='';for(const source of group.sources.items){source.rootUrl='https://five-fix-fixture.invalid';source.transport='direct';}}applyApplicationSettings(app);const {getRuleDataSourceSnapshot}=await import('/src/components/Rules/data/formalDataSourceRuntime.ts');const wid=getRuleDataSourceSnapshot('zth').worldId,rid='five-fix-local-release',docs=new Map(),put=async(key,value)=>{const bytes=new TextEncoder().encode(JSON.stringify(value));docs.set(key,bytes);return {sha256:[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(n=>n.toString(16).padStart(2,'0')).join(''),byteLength:bytes.length};};const chunk=`releases/${rid}/data-merge/${wid}/chunk.json`,catalog=`releases/${rid}/manifests/worlds/${wid}-catalog.json`,manifest=`releases/${rid}/manifests/worlds/${wid}.json`;const integrity=await put(chunk,{schemaVersion:'openriamap.world-merge-chunk.v2',worldId:wid,featureCount:0,features:[]});await put(catalog,{schemaVersion:'openriamap.world-chunk-catalog.v2',worldId:wid,releaseId:rid,chunks:[{key:chunk,...integrity,featureCount:0}]});const hash=await put(manifest,{schemaVersion:'openriamap.world-release-manifest.v2',worldId:wid,releaseId:rid,chunkCatalogKeys:[catalog],featureCount:0,chunkCount:1});await put('current/worlds/_release-set.json',{schemaVersion:'openriamap.current-release-set.v2',releaseId:rid,formalVersion:1,worlds:[wid]});await put(`current/worlds/${wid}.json`,{schemaVersion:'openriamap.current-world.v2',worldId:wid,releaseId:rid,formalVersion:1,worldManifestKey:manifest,worldManifestSha256:hash.sha256});const original=window.fetch;window.fixtureReads=[];window.fetch=(input,init)=>{const url=new URL(typeof input==='string'?input:input.url,location.href);if(url.hostname==='five-fix-fixture.invalid'){const key=decodeURIComponent(url.pathname.slice(1)),bytes=docs.get(key);if(!bytes)throw Error('Unknown isolated fixture '+key);if((init?.method??'GET')!=='GET')throw Error('No fixture writes');window.fixtureReads.push(key);return Promise.resolve(new Response(bytes,{status:200,headers:{'content-type':'application/json'}}));}return original(input,init);};})()''')

try:
 config=copy.deepcopy(BASE);open_flow(config,'v3-pta_air','FIVEFIX')
 draw([(0,0),(70,0)]);no_duplicate();draw([(70,70)]);time.sleep(.2);no_duplicate()
 click('多部件和内洞设置');array([(0,0),(70,0),(70,70),(0,70)])
 click('内部空间');click('添加内部洞');draw([(10,10),(20,10),(20,20)]);array([(10,10),(20,10),(20,20),(10,20)]);no_duplicate()
 click('添加部件');draw([(20,-50),(70,-50)]);no_duplicate();draw([(70,-20)]);time.sleep(.2);no_duplicate()
 array([(20,-50),(70,-50),(70,-20),(20,-20)]);click('内部空间');click('添加内部洞');draw([(30,-40),(40,-40),(40,-30)]);array([(30,-40),(40,-40),(40,-30),(30,-30)])
 expected=geometry();assert len(expected['parts'])==2 and all(len(p)==2 for p in expected['parts']);no_duplicate()
 before=draft();click('上一页');click('下一页');assert draft()==before;no_duplicate()
 checks.append('FIX04: 2/3 points, new component/holes, focus and backtrack retain one active editor and dashed references; no full solid overlay')
 click('确认保存输出');b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===1');saved=records()[0]
 assert saved['CoordG']==canonical(expected);after_save(expected)
 text=b.evaluate('document.body.innerText');assert 'PTA（港口和空港） / AIR（机场） / NOM（默认）' in text
 b.screenshot('five-fix-first-save-complete.png');(OUT/'five-fix-first-save-record.json').write_text(json.dumps(saved,ensure_ascii=False,indent=2),encoding='utf-8')
 checks.append('FIX01/02: first native save renders both complete parts and SVG holes; record, full category names and identity remain exact')
 full_mode();reopen(saved)
 assert not part_locked(),'The initial editor must not need an unrelated toggle.'
 val('select[aria-label="部件编号"]',1);val('select[aria-label="部件编号"]',0)
 click('显示部件编号');assert part_locked();click('显示部件编号');assert not part_locked()
 b.screenshot('five-fix-reentry-enabled.png')
 assert not b.evaluate('!!document.querySelector(\'select[aria-label="要素分类 Class"]\')')
 assert records()[0]==saved
 assert not part_locked();val('input[aria-label="工作流编辑人"]','FIVEFIXEDIT')
 # Existing actual field failure stays specific and repairable in this form.
 name_input='[...document.querySelectorAll("[data-edit-control]")].find(e=>e.getBoundingClientRect().height&&e.querySelector(":scope>span")?.textContent.trim().startsWith("名称")).querySelector("input,textarea")'
 val_expr(name_input,'');click('保存编辑图层')
 b.wait('!!document.querySelector("p[role=alert]")');error=b.evaluate('[...document.querySelectorAll("p[role=alert]")].map(e=>e.textContent).join("；")');assert ('Name' in error or '名称' in error) and '必填' in error,error
 assert b.evaluate('!!document.querySelector(\'section[aria-label="V3 工作流式编辑"]\')')
 val_expr(name_input,'FIVEFIX repaired');click('保存编辑图层');b.wait('!document.querySelector(\'section[aria-label="V3 工作流式编辑"]\')')
 assert records()[0]['CoordG']==saved['CoordG'];after_save(expected)
 checks.append('FIX03/05: reentry is immediately enabled; numbering still locks; reedit uses only workflow-scoped category choices; actual required field errors preserve repairable form')
 # Fixed visibility reuses the same complete shapes.
 press('[...('+row(saved)+').querySelectorAll("button")].find(e=>e.textContent.trim()==="隐藏")');assert paths()==[]
 press('[...('+row(saved)+').querySelectorAll("button")].find(e=>e.textContent.trim()==="显示")');after_save(expected)
 checks.append('FIX01: hidden/shown complete fixed geometry preserves every hole')
 isolated_formal_reader();click('临时挂载');b.wait('document.body.innerText.includes("取消临时挂载")',45)
 assert paths()==[]
 assert 'PTA（港口和空港） / AIR（机场） / NOM（默认）' in b.evaluate('document.body.innerText')
 mounted=b.evaluate('(async()=>{const {readTemporaryRuleSources}=await import("/src/components/Rules/data/temporaryRuleSession.ts");return readTemporaryRuleSources();})()')
 mounted_record=next(item for entries in mounted.values() for entry in entries for item in entry['items'] if item['ID']==saved['ID'])
 assert mounted_record['CoordG']==saved['CoordG']
 click('取消临时挂载');b.wait('!document.body.innerText.includes("enabled=true")');after_save(expected)
 checks.append('FIX01/02: actual mount uses complete stored record and shared category caption; unmount restores complete fixed SVG; ID reader uses an integrity-checked isolated release')
 config=copy.deepcopy(BASE)
 for node in config['nodes']:
  if node['path']['class']=='PTA' and 'Polygon' in node.get('geometryProfiles',{}):node['geometryProfiles']['Polygon']['allowMultipleParts']=False
 open_flow(config,'v3-pta_air','FIVEFIXSINGLE');draw([(0,0),(70,0),(70,70),(0,70)]);click('多部件和内洞设置');assert part_locked()
 click('内部空间');click('添加内部洞');draw([(10,10),(20,10),(20,20)]);array([(10,10),(20,10),(20,20),(10,20)])
 click('确认保存输出');b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===1');single=records()[0]
 full_mode();reopen(single);assert part_locked();click('内部空间');assert part_locked()
 checks.append('FIX03: forbidden multipart remains locked on reentry and unrelated toggles while valid holes survive')
 assert not b.errors,b.errors;assert b.evaluate('window.singleEntryRequests')==[]
 (OUT/'five-fix-failure.json').unlink(missing_ok=True)
 (OUT/'five-fix-error.png').unlink(missing_ok=True)
 (OUT/'saved-layer-five-fixes-result.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors,'remoteOrWriteRequests':b.evaluate('window.singleEntryRequests')},ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps({'checks':checks,'runtimeErrors':b.errors},ensure_ascii=False))
except Exception:
 b.screenshot('five-fix-error.png');(OUT/'five-fix-failure.json').write_text(json.dumps({'checks':checks,'trace':traceback.format_exc(),'text':b.evaluate('document.body.innerText')[-6000:],'runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8');raise
