"""Isolated actual-controls acceptance for category locking and complete arrays."""
import ast,json,copy,time,traceback
from pathlib import Path
source=Path(__file__).with_name('single_entry_drawing_acceptance.py')
tree=ast.parse(source.read_text(encoding='utf-8-sig'));prefix=[]
for statement in tree.body:
 if isinstance(statement,ast.Try):break
 prefix.append(statement)
exec(compile(ast.Module(body=prefix,type_ignores=[]),str(source),'exec'),globals())

def state():return b.evaluate('document.querySelector("[data-full-category-state]")?.dataset.fullCategoryState')
def category(parts):
 for level,part in zip(['Class','Kind','SKind','SKind2'],parts):val('select[aria-label="要素分类 '+level+'"]',part)
def start():fresh(BASE);click('测绘');click('开始测绘(完整)');b.wait('!!document.querySelector("[data-full-category-state]")')
def array_text():
 click('完整数组');b.wait('!!document.querySelector(\'textarea[aria-label="完整 Coord 数组"]\')');raw=b.evaluate('document.querySelector(\'textarea[aria-label="完整 Coord 数组"]\').value');click('关闭完整数组');return json.loads(raw)
def complete(value,finish=True):
 click('完整数组');val('textarea[aria-label="完整 Coord 数组"]',json.dumps(value));click('校验');click('完成' if finish else '应用')
def name_input():return '[...document.querySelectorAll("[data-edit-control]")].find(e=>e.getBoundingClientRect().height&&e.querySelector(":scope>span")?.textContent.trim().startsWith("名称")).querySelector("input,textarea")'
def alerts():return b.evaluate('[...document.querySelectorAll("p[role=alert],p[role=status]")].filter(e=>e.getBoundingClientRect().height).map(e=>e.textContent).join("；")')

try:
 start();assert state()=='unloaded'
 assert not b.evaluate('[...document.querySelectorAll("button")].some(e=>e.getBoundingClientRect().height&&["点","线","面"].includes(e.textContent.trim()))')
 draw([(0,0),(30,0)]);assert records()==[]
 category(['PTA','AIR','NOM']);assert not b.evaluate('!!document.querySelector(\'input[aria-label="新建要素 ID"]\')')
 click('确认选择并导入');b.wait('document.querySelector("[data-full-category-state]")?.dataset.fullCategoryState==="loaded"')
 assert b.evaluate('[...document.querySelectorAll("select[aria-label^=要素分类]")].filter(e=>e.getBoundingClientRect().height).every(e=>e.matches(":disabled"))')
 draw([(0,0),(50,0)]);before=array_text();assert len(before[0][0])==2
 b.evaluate('(()=>{const el=document.querySelector(".leaflet-container");let root=el[Object.keys(el).find(k=>k.startsWith("__reactFiber"))];while(root.return)root=root.return;const stack=[root];while(stack.length){const f=stack.pop(),p=f.memoizedProps;if(p?.onApplyActiveCoords&&p?.validateCandidateCoords){window.staleCoordinateApply=p.onApplyActiveCoords;return;}if(f.child)stack.push(f.child);if(f.sibling)stack.push(f.sibling);}throw Error("Actual coordinate callback missing");})()')

 click('解锁分类选择');assert state()=='switching'
 assert b.evaluate('document.querySelector(\'input[aria-label="新建要素 ID"]\').matches(":disabled")')
 draw([(50,50)]);category(['PTA','POT','NOM']);click('尝试切换');assert state()=='loaded',alerts();assert array_text()==before
 b.evaluate('window.staleCoordinateApply([{x:500,y:64,z:500}])');assert array_text()==before
 checks.append('category-first explicit load, locked controls, incomplete polygon/missing required fields can unlock, frozen map cannot write, compatible target preserves coordinates')
 val('input[aria-label="新建要素 ID"]','FULL_ARRAY_TEST');val_expr(name_input(),'Array original');val('input[aria-label="工作流编辑人"]','FULLMODEQA')
 click('解锁分类选择');category(['TPT','WRP','NOM','NOM']);click('尝试切换');assert state()=='switching' and '最多 1' in alerts(),alerts()
 click('恢复原分类');assert state()=='loaded';assert b.evaluate('document.querySelector(\'input[aria-label="新建要素 ID"]\').value')=='FULL_ARRAY_TEST';assert array_text()==before
 checks.append('failed conversion retains immutable source and restore returns category, fields, coordinates and editing state')
 # Two parts, a hole in each; input order defines every part/hole number.
 original=[[[[0,64,0],[60,64,0],[60,64,60],[0,64,60]],[[10,64,10],[20,64,10],[20,64,20],[10,64,20]]],[[[80,64,0],[140,64,0],[140,64,60],[80,64,60]],[[90,64,10],[100,64,10],[100,64,20],[90,64,20]]]]
 complete(original);assert array_text()==original
 click('多部件和内洞设置') if not b.evaluate('!!document.querySelector(\'select[aria-label="部件编号"]\')') else None
 val('select[aria-label="部件编号"]',1)
 original[0].append([[30,64,30],[40,64,30],[40,64,40],[30,64,40]]);complete(original)
 reordered=[original[1],[original[0][0],original[0][2],original[0][1]]];complete(reordered);assert array_text()==reordered
 assert b.evaluate('document.querySelector(\'select[aria-label="部件编号"]\').options.length')==2
 val('select[aria-label="部件编号"]',0);click('撤销');assert array_text()==original;click('重做');assert array_text()==reordered
 val('select[aria-label="部件编号"]',1);assert b.evaluate('document.querySelector(\'select[aria-label="内部洞编号"]\').options.length')==2
 val('select[aria-label="内部洞编号"]',0);click('数组');focus=json.loads(b.evaluate('document.querySelector(\'textarea[placeholder^="请输入严格 JSON 数组"]\').value'));assert focus==reordered[1][1];close_panel('cpT-array-editor-panel')
 b.screenshot('full-array-renumbered.png')
 checks.append('complete nested arrays replace all parts/holes, reorder numbering, preserve valid focus, and whole-draft undo/redo restore both parts')
 click('完整数组');assert not b.evaluate('[...document.querySelectorAll("[data-complete-array-editor] button")].some(e=>e.textContent.trim()==="反转")')
 val('textarea[aria-label="完整 Coord 数组"]','[[[[null,64,0],[1,64,0],[1,64,1]]]]');click('校验');assert '有限数字' in alerts();assert b.evaluate('[...document.querySelectorAll("[data-complete-array-editor] button")].find(e=>e.textContent.trim()==="应用").disabled')
 click('关闭完整数组');assert array_text()==reordered
 checks.append('complete-array editor has no reverse; nonnumeric tuple rejected without partial application')
 click('完成当前图层');b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===1');record=records()[0];assert record['CoordG']==reordered
 # Actual existing layer toolbar, not a setter.
 click('>');click('编辑');b.wait('!!document.querySelector(\'input[aria-label="编辑要素 ID"]\')')
 assert not b.evaluate('!!document.querySelector(\'select[aria-label="要素分类 Class"]\')')
 selectors=b.evaluate('[...document.querySelectorAll(\'select[aria-label="工作流分类"]\')].map(e=>[...e.options].map(o=>o.textContent))')
 assert selectors and selectors[0],selectors
 val_expr(name_input(),'Array edited');click('保存编辑图层');b.wait('window.workflowAcceptance.measurement.getCommittedFeatures()[0].Name==="Array edited"')
 assert records()[0]['CoordG']==reordered
 checks.append('saved existing record reopens with only workflow-scoped single category input; editing preserves complete geometry and creation identity')

 # A separate valid editor fixture with another Class, renamed controls and the same field contracts.
 cross=copy.deepcopy(BASE)
 idmap={n["nodeId"]:"cross-"+n["nodeId"] for n in BASE["nodes"] if n["path"]["class"]=="PTA" and (not n["path"].get("kind") or n["path"]["kind"]=="POT")}
 def reclass(value):
  if isinstance(value,dict):return {k:('CROSS' if k=='class' and v=='PTA' else reclass(v)) for k,v in value.items()}
  if isinstance(value,list):return [reclass(v) for v in value]
  return idmap.get(value,value) if isinstance(value,str) else value
 for node in BASE['nodes']:
  if node['path']['class']=='PTA' and (not node['path'].get('kind') or node['path']['kind']=='POT'):
   n=reclass(copy.deepcopy(node));n['children']=[idmap[v] for v in node.get('children',[]) if v in idmap];cross['nodes'].append(n)
 port_flow=next(w for w in BASE['workflows'] if w['id']=='v3-pta_pot');w=reclass(copy.deepcopy(port_flow));w['id']='cross-class-editor';w['label']['zh']='跨类测试'
 name_assignment=next(v for v in w['outputs'][0]['assignments'] if v['target']=='Name');old=name_assignment['expression'];name_assignment['expression']='CROSS_NAME'
 for step in w['steps']:
  for control in step.get('controls',[]):
   if control.get('slot')==old:control['slot']='CROSS_NAME';control['label']['zh']='名称（目标改名）';control['label']['en']='Renamed target field'
 for binding in w.get('editor',{}).get('backfill',[]):
  if binding['slot']==old:binding['slot']='CROSS_NAME'
 cross['workflows'].append(w)
 fresh(cross);click('测绘');click('开始测绘(完整)');category(['PTA','AIR','NOM']);click('确认选择并导入')
 val('input[aria-label="新建要素 ID"]','CROSS_ID');val_expr(name_input(),'Cross value');click('添加标签行');val('select[aria-label="标签已注册字段"]','Adm');val('input[aria-label="标签扩展值"]','ADM_FOR_TEST')
 draw([(0,0),(50,0)]);prior=array_text();click('解锁分类选择');category(['CROSS','POT','NOM']);click('尝试切换');assert state()=='loaded',alerts()
 assert b.evaluate('document.querySelector(\'input[aria-label="新建要素 ID"]\').value')=='CROSS_ID';assert b.evaluate('('+name_input()+').value')=='Cross value';assert 'ADM_FOR_TEST' in b.evaluate('document.body.innerText');assert array_text()==prior
 checks.append('cross-Class fixture transfers ID, Name and registered tags.Adm without matching UI names or requiring missing required fields')
 # A complete-array window cannot apply after a world/context change.
 click('完整数组');b.evaluate('window.workflowAcceptance.setWorld("eden")');time.sleep(.25)
 assert b.evaluate('[...document.querySelectorAll("[data-complete-array-editor] button")].filter(e=>["应用","完成"].includes(e.textContent.trim())).every(e=>e.disabled)')
 click('关闭完整数组');b.evaluate('window.workflowAcceptance.setWorld("zth")');time.sleep(.25);assert array_text()==prior
 checks.append('world pause makes the complete-array transaction read-only and retains the original draft')


 # The same transaction locks a quick workflow and is invalidated by its world pause.
 open_flow(copy.deepcopy(BASE),'v3-pta_air','FULLQUICK');draw([(0,0),(40,0),(40,40)]);prior=geometry();click('完整数组')
 assert b.evaluate('[...document.querySelectorAll("[data-workflow-step] button")].every(e=>e.matches(":disabled"))')

 text=b.evaluate('document.querySelector(\'textarea[aria-label="完整 Coord 数组"]\').value');val('textarea[aria-label="完整 Coord 数组"]',text+' ');b.screenshot('complete-array-desktop.png')
 b.call('Emulation.setDeviceMetricsOverride',{'width':390,'height':844,'deviceScaleFactor':1,'mobile':False});time.sleep(.3)
 b.wait('!!document.querySelector("[data-complete-array-compact]")')
 assert b.evaluate('document.querySelectorAll("[data-complete-array-editor]").length')==1
 rect=b.evaluate('document.querySelector("[data-complete-array-editor]").getBoundingClientRect().toJSON()');assert rect['left']>=0 and rect['right']<=390,rect
 assert b.evaluate('document.querySelector(\'textarea[aria-label="完整 Coord 数组"]\').value')==text+' '
 click('撤回');assert b.evaluate('document.querySelector(\'textarea[aria-label="完整 Coord 数组"]\').value')==text
 click('恢复');assert b.evaluate('document.querySelector(\'textarea[aria-label="完整 Coord 数组"]\').value')==text+' '
 b.screenshot('complete-array-compact.png');b.call('Emulation.setDeviceMetricsOverride',{'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False});time.sleep(.3)
 assert b.evaluate('document.querySelector(\'textarea[aria-label="完整 Coord 数组"]\').value')==text+' '
 checks.append('desktop/compact transitions retain exactly one complete-array transaction, pending text and independent text undo/redo; compact dialog fits viewport')

 b.evaluate('window.workflowAcceptance.setWorld("eden")');time.sleep(.3)
 assert b.evaluate('[...document.querySelectorAll("[data-complete-array-editor] button")].filter(e=>["应用","完成"].includes(e.textContent.trim())).every(e=>e.disabled)')
 click('关闭完整数组');b.evaluate('window.workflowAcceptance.setWorld("zth")');time.sleep(.3);click('恢复绘制');assert geometry()==prior
 checks.append('quick workflow page and output freeze during complete array; world suspension invalidates the old transaction and explicit resume restores the exact task')

 assert not b.errors,b.errors;assert b.evaluate('window.singleEntryRequests')==[]
 (OUT/'full-mode-selection-array-failure.json').unlink(missing_ok=True);(OUT/'full-mode-selection-array-failure.png').unlink(missing_ok=True)
 (OUT/'full-mode-selection-array-result.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors,'remoteOrWriteRequests':b.evaluate('window.singleEntryRequests')},ensure_ascii=False,indent=2),encoding='utf-8')
 (OUT/'full-mode-array-config.json.gz').write_bytes(gzip.compress(json.dumps(BASE,ensure_ascii=False).encode('utf-8')))
 (OUT/'full-mode-array-record.json').write_text(json.dumps(record,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps({'checks':checks,'runtimeErrors':b.errors},ensure_ascii=False))
except Exception:
 b.screenshot('full-mode-selection-array-failure.png');(OUT/'full-mode-selection-array-failure.json').write_text(json.dumps({'checks':checks,'trace':traceback.format_exc(),'text':b.evaluate('document.body.innerText')[-6500:],'errors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8');raise
