/** Read-only release audit. Mutations use clones and never persist application data. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {performance} from 'node:perf_hooks';
import {execFileSync} from 'node:child_process';
import JSZip from 'jszip';
import {validateConfigPackage,validateWorkflowDefinition,resolveEffectiveFields,compileConfigRuntime,configCompilationStats} from '../../src/configStudio/runtime';
import {prepareConfigForActivation} from '../../src/configStudio/configActivation';
import {readConfigPackage,buildConfigPackageArchive} from '../../src/configStudio/package';
import {migrateConfigToR11} from '../../src/configStudio/r11Migration';
import {validateLookupTables,resolveBoundCard} from '../../src/configStudio/lookupTables';
import {createCategoryArtifact,prepareCategoryImport} from '../../src/configStudio/categoryArtifact';
import {buildWorkflowArtifact,prepareWorkflowArtifactImport} from '../../src/configStudio/workflowArtifact';
import {stableConfigText} from '../../src/configStudio/defaultConfigProvider';
import {validateV3WorkflowRecords} from '../../src/configStudio/V3WorkflowRunner';
import type {ConfigPackageV3,ConfigValidationReport} from '../../src/configStudio/types';

const out=path.resolve(process.env.CAIRNMAP_RELEASE_AUDIT_OUT??'docs/90_roadmap-and-history/runtime-v32-release-audit-20261016');
fs.mkdirSync(out,{recursive:true});
const raw=fs.readFileSync('src/configStudio/defaults/r11-r7.config.json');
const base=JSON.parse(raw.toString('utf8')) as ConfigPackageV3;
const sha=(data:string|Uint8Array)=>createHash('sha256').update(data).digest('hex');
const root=(c:any,code='ROD')=>c.nodes.find((n:any)=>n.path.class===code&&!n.path.kind);
const flow=(c:any)=>c.workflows.find((w:any)=>w.id==='v3-rod_road');
const controls=(c:any)=>flow(c).steps.flatMap((s:any)=>s.controls??[]);
const slot=(c:any,key='F')=>controls(c).find((item:any)=>item.slot===key);
const rules=(c:any)=>root(c).geometryProfiles.LineString.zoomPriority.rules;
const assignment=(c:any,target='Level')=>flow(c).outputs[0].assignments.find((a:any)=>a.target===target);
const freshField=(key='AuditValue')=>({fieldId:'audit-value',key,type:'string',cardinality:'single',input:'text',labels:{zh:'核验字段',en:''},description:{zh:'',en:''}});
type Probe={id:string;area:string;name:string;expect:'error'|'warning'|'allow';module?:'workflow'|'tables';mutate:(c:any)=>void};
const probes:Probe[]=[];
const add=(id:string,area:string,name:string,mutate:Probe['mutate'],expect:Probe['expect']='error',module?:Probe['module'])=>probes.push({id,area,name,mutate,expect,module});
const wf=(id:string,name:string,mutate:Probe['mutate'],expect:Probe['expect']='error')=>add(id,'工作流',name,mutate,expect,'workflow');
wf('WF01','删除仍被组装引用的根字段',c=>c.nodes.filter((n:any)=>n.path.class==='ROD').forEach((n:any)=>n.fields=n.fields.filter((f:any)=>f.key!=='Level')));
wf('WF02','数值目标改为布尔类型',c=>root(c).fields.find((f:any)=>f.key==='Level').type='boolean');
wf('WF03','单值目标改为多值',c=>root(c).fields.find((f:any)=>f.key==='Level').cardinality='multiple');
wf('WF04','数值控件改为布尔控件',c=>slot(c).kind='toggle');
wf('WF05','引用不存在的槽位',c=>assignment(c).expression='MISSING_SLOT');
wf('WF06','非法表达式',c=>assignment(c).expression='join(');
wf('WF07','原型污染目标路径',c=>assignment(c).target='extensions.__proto__.polluted');
wf('WF08','覆盖系统分类',c=>assignment(c).target='Class');
wf('WF09','重复槽位',c=>slot(c,'G').slot='F');
wf('WF10','引用不存在的输出分类',c=>flow(c).outputs[0].classification={class:'NOT_PRESENT'});
wf('WF11','输入默认值不合法',c=>slot(c).defaultValue='not-a-number');
wf('WF12','重复组字段名重复',c=>{const g=slot(c,'P').group;g.itemFields.push(structuredClone(g.itemFields[0]));});
wf('WF13','启用条件引用不存在的槽位',c=>slot(c).when={token:'MISSING_SLOT',operator:'present'});
wf('WF14','绘制页使用未来页面的条件槽位',c=>{const s=flow(c).steps.find((s:any)=>s.kind==='geometry');s.when={token:'FUTURE',operator:'present'};flow(c).steps.push({id:'future',kind:'form',label:{zh:'未来',en:''},controls:[{id:'future',kind:'text',columns:1,slot:'FUTURE',label:{zh:'未来',en:''}}]});});
wf('WF15','搜索返回不存在的字段',c=>slot(c,'C').search.returnField='MissingReturn');
wf('WF16','绘制返回格式与线类型不符',c=>flow(c).steps.find((s:any)=>s.kind==='geometry').drawing={returnFormat:'pointObject'});
wf('WF17','额外绘制不声明返回槽位',c=>flow(c).steps.find((s:any)=>s.kind==='geometry').geometryRole='auxiliary');
wf('WF18','同一目标有两条无条件组装',c=>flow(c).outputs[0].assignments.push({...assignment(c),id:'duplicate-target',expression:'K'}));
wf('WF19','常量文字写入数值字段',c=>{flow(c).editor={enabled:false};assignment(c).expression='"not-a-number"';});
wf('WF20','复合表达式返回文本写入数值字段',c=>{flow(c).editor={enabled:false};assignment(c).expression='join("",A)';});
wf('WF21','number 控件默认值为可规范化的数值字符串',c=>{flow(c).editor={enabled:false};slot(c).defaultValue='12';},'allow');
wf('WF22','直接槽位选项超出目标枚举',c=>{flow(c).editor={enabled:false};root(c).fields.push({...freshField(),type:'enum',input:'select',optionValueType:'string',optionTable:{valueType:'string',rows:[{value:'a',label:{zh:'甲',en:''}}]}});flow(c).steps[1].controls.push({id:'audit-enum',slot:'AUDIT_ENUM',kind:'select',columns:1,label:{zh:'枚举',en:''},optionValueType:'string',optionTable:{valueType:'string',rows:[{value:'b',label:{zh:'乙',en:''}}]}});flow(c).outputs[0].assignments.push({id:'audit-enum',target:'AuditValue',expression:'AUDIT_ENUM'});});
wf('WF23','已删除的 tags 字段仍被 assignment 引用（动态路径）',c=>{c.nodes.filter((n:any)=>n.path.class==='ROD').forEach((n:any)=>n.fields=n.fields.filter((f:any)=>f.key!=='tags.nomenclator'));},'allow');
wf('WF24','专供编辑工作流错误开放给便捷测绘',c=>{const w=c.workflows.find((w:any)=>w.editor?.dedicated);w.quickMapping=true;});

add('FD01','字段','字段 key 重复',c=>root(c).fields.push({...root(c).fields[0],fieldId:'another-field'}));
add('FD02','字段','字段显示名称全空',c=>root(c).fields[0].labels={zh:'',en:''});
add('FD03','字段','不存在的引用分类',c=>root(c).fields.push({...freshField(),type:'reference',reference:{classCode:'NO_CLASS',matchField:'ID'}}));
add('FD04','字段','子级覆盖强制固定继承字段',c=>{const p=root(c,'BUD'),f=p.fields[0];f.inheritance='sealed';c.nodes.find((n:any)=>n.path.class==='BUD'&&n.path.kind).fields.push({...f,fieldId:'illegal-override',labels:{zh:'违规',en:''}});});
add('FD05','字段','字段 ID 重复但 key 不同',c=>root(c).fields.push({...freshField(),fieldId:root(c).fields[0].fieldId}));
add('FD06','字段','非法嵌套路径',c=>root(c).fields[0].key='extensions.constructor.x');

const tab=(id:string,name:string,mutate:Probe['mutate'])=>add(id,'对照表',name,mutate,'error','tables');
tab('TB01','删除被字段引用的公共表',c=>c.lookupTables=c.lookupTables.filter((t:any)=>t.id!=='road-travel-modes'));
tab('TB02','被引用表为空',c=>c.lookupTables.find((t:any)=>t.id==='road-travel-modes').rows=[]);
tab('TB03','表格中保存值重复',c=>{const t=c.lookupTables.find((t:any)=>t.id==='road-travel-modes');t.rows.push(structuredClone(t.rows[0]));});
tab('TB04','表格修改值类型与绑定方不一致',c=>c.lookupTables.find((t:any)=>t.id==='road-travel-modes').valueType='number');
tab('TB05','对照行无任何语言显示名',c=>c.lookupTables.find((t:any)=>t.id==='road-travel-modes').rows[0].label={zh:'',en:''});
tab('TB06','速度功能值非法',c=>c.lookupTables.find((t:any)=>t.id==='road-travel-modes').rows[0].functionValue=-1);
add('TB07','对照表','信息卡绑定不存在的字段定义',c=>root(c).card.items[0].fieldBinding={nodeId:root(c).nodeId,fieldId:'missing-field'});
wf('TB08','工作流绑定不存在的字段对照',c=>{slot(c,'P').group.itemFields[0].optionsFieldRef={nodeId:root(c).nodeId,fieldId:'missing-field'};});
add('TB09','对照表','绑定来源和本地对照同时保存',c=>{const f=root(c).fields[0];f.optionsTableId='road-travel-modes';f.optionTable={valueType:'string',rows:[{value:'x',label:{zh:'本地',en:''}}]};});

add('RD01','渲染','完整命中条件重复',c=>rules(c).push({...structuredClone(rules(c)[0]),id:'audit-duplicate'}));
add('RD02','渲染','Zoom 范围反向',c=>rules(c)[0].when.zoom={min:8,max:1});
add('RD03','渲染','字段组合错误使用分类字段',c=>rules(c)[0].when.fields={op:'all',items:[{kind:'fieldCompare',field:'Class',operator:'eq',value:'ROD'}]});
add('RD04','渲染','字段条件引用不存在的根字段',c=>rules(c)[0].when.fields={op:'all',items:[{kind:'fieldCompare',field:'MissingField',operator:'eq',value:'x'}]});
add('RD05','渲染','布尔条件值和字段类型不一致',c=>rules(c)[0].when.fields={op:'all',items:[{kind:'fieldCompare',field:'Oneway',operator:'eq',value:'yes'}]});
add('RD06','渲染','公式引用不存在的 C9',c=>rules(c)[0].when.fields={op:'all',items:[],formula:{expression:'C9',terms:[{id:'C1',relation:'AND',condition:{kind:'fieldCompare',field:'Oneway',operator:'eq',value:true}}]}});
add('RD07','渲染','可证明的矛盾条件',c=>rules(c)[0].when.fields={op:'all',items:[],formula:{expression:'C1 AND NOT C1',terms:[{id:'C1',relation:'AND',condition:{kind:'fieldCompare',field:'Oneway',operator:'eq',value:true}}]}});
add('RD08','渲染','后规则无条件完全遮蔽前规则',c=>{const r=structuredClone(rules(c)[0]);r.id='audit-shadow';r.when.zoom={min:0,max:8};rules(c).push(r);},'warning');
add('RD09','渲染','不同范围部分交叠且样式相反',c=>{const r=structuredClone(rules(c)[0]);r.id='audit-overlap';r.when.zoom={min:1,max:4};r.representation='geometry';rules(c).push(r);},'allow');
add('RD10','渲染','Label 来源引用不存在的根字段',c=>rules(c)[0].label.source='MissingLabel');
add('RD11','渲染','Label 组合模板引用不存在字段',c=>{const r=c.nodes.find((n:any)=>n.path.class==='RLE'&&!n.path.kind).geometryProfiles.LineString.zoomPriority.rules.find((r:any)=>r.label?.sourceMode==='combined');r.label.template='"MissingLabel"';});
add('RD12','渲染','固定颜色无效',c=>rules(c)[0].style.stroke={mode:'fixed',color:'not-a-color'});
add('RD13','渲染','几何动态优先级引用不存在字段',c=>rules(c)[0].priority={mode:'replace',base:1,metric:{kind:'field',field:'MissingWeight',multiplier:1,rounding:'none'}});
add('RD14','渲染','几何/Label 透明度超界',c=>rules(c)[0].style.strokeOpacity=2);

add('CD01','信息卡','显示不存在的根字段',c=>root(c).card.items[0].source='MissingCardField');
add('CD02','信息卡','引用不存在的专用显示组件',c=>root(c).card={mode:'component',componentKey:'missing-component'});
add('CD03','信息卡','卡片条目 ID 重复',c=>root(c).card.items.push(structuredClone(root(c).card.items[0])));
add('CD04','信息卡','字段继承来源来自平级分类',c=>{root(c).card.items[0].inheritFrom={nodeId:root(c,'BUD').nodeId,itemId:'not-parent'};});
add('CT01','分类','父节点缺失',c=>{c.nodes=c.nodes.filter((n:any)=>n.nodeId!==root(c,'BUD').nodeId);});
add('CT02','分类','分类路径重复',c=>c.nodes.push({...structuredClone(root(c)),nodeId:'another-node'}));
add('CT03','分类','children 记录不存在的节点',c=>root(c).children.push('missing-node'));
add('CT04','分类','children 指向不匹配父路径的其他 Class',c=>root(c).children.push(root(c,'BUD').nodeId));
add('CT05','分类','父级 children 遗漏真实子分类',c=>root(c).children=[]);
add('CT06','分类','几何类型与已启用样式矛盾',c=>root(c).geometryType='Point');

add('AP01','总体规则','世界数字编号重复',c=>c.application.worlds[1].numericCode=c.application.worlds[0].numericCode);
add('AP02','总体规则','世界绑定不存在的来源组',c=>c.application.sources.bindings[c.application.worlds[0].id]='missing-group');
add('AP03','总体规则','图层按钮分类路径不存在',c=>c.application.buttons.items[0].criteria.paths=[{class:'ROD',kind:'MISSING'}]);
add('AP04','总体规则','按钮联动循环',c=>{const [a,b]=c.application.buttons.items;a.behavior={...a.behavior,enableWhenEnabled:[b.id]};b.behavior={...b.behavior,enableWhenEnabled:[a.id]};});
add('AP05','总体规则','无效模块互斥目标',c=>c.application.modules.items[0].exclusiveWith=['missing-module']);
add('AP06','总体规则','启用审核却缺少会话接口',c=>{c.application.review.enabled=true;c.application.review.auth.session='';});
add('AP07','总体规则','未知原生属性',c=>c.engine.typo=true);
add('AP08','总体规则','未知契约版本',c=>c.contractRevision=999);

const baseline=validateConfigPackage(base);
if(!baseline.valid)throw Error('Active seed is invalid: '+JSON.stringify(baseline.issues));
const view=(r:ConfigValidationReport)=>({valid:r.valid,errors:r.issues.filter(i=>i.severity==='error').map(i=>({code:i.code,path:i.path,message:i.message})),warnings:r.issues.filter(i=>i.severity==='warning').map(i=>({code:i.code,path:i.path,message:i.message}))});
const results:any[]=[];
for(const probe of probes){
 const candidate=structuredClone(base);let result:any={id:probe.id,area:probe.area,name:probe.name,expected:probe.expect};
 try{
  probe.mutate(candidate);
  const report=validateConfigPackage(candidate);result.package=view(report);
  if(probe.module==='workflow'){const changed=candidate.workflows.find(w=>stableConfigText(w)!==stableConfigText(base.workflows.find(original=>original.id===w.id)));const target=changed??flow(candidate);result.moduleWorkflowId=target.id;result.module=view(validateWorkflowDefinition(target,candidate));}
  else if(probe.module==='tables'){const issues=validateLookupTables(candidate);result.lookupSubsystem=view({schemaVersion:'cairnmap.config-validation-report.v3',valid:!issues.some(i=>i.severity==='error'),createdAt:'',issues});result.module=result.package;result.moduleBoundary='LookupTablesWorkspace validates the merged full package';}
  else result.module=result.package;
  result.activationBlocked=false;try{prepareConfigForActivation(candidate);}catch(error){result.activationBlocked=true;result.activationMessage=String(error).slice(0,300);}
  result.exportBlocked=false;
  if(probe.expect==='error')try{await buildConfigPackageArchive(candidate,baseline);}catch(error){result.exportBlocked=true;result.exportMessage=String(error).slice(0,160);}
  result.matchesExpectation=probe.expect==='error'?!result.package.valid:probe.expect==='warning'?result.package.warnings.length>baseline.issues.filter(i=>i.severity==='warning').length:result.package.valid;
 }catch(error){result.exception=String(error);result.matchesExpectation=false;}
 results.push(result);console.log(probe.id,result.exception?'EXCEPTION':result.matchesExpectation?'EXPECTED':'GAP',probe.name);
}

// A downstream submit-time check must be distinguished from editor preflight.
const sample=flow(base),leaf=base.nodes.filter(n=>n.path.class==='ROD').sort((a,b)=>Object.keys(b.path).length-Object.keys(a.path).length)[0];
const record={ID:'audit-record',World:'zth',Class:'ROD',Kind:leaf.path.kind,SKind:leaf.path.skind,SKind2:leaf.path.skind2,Name:'audit',Level:'not-a-number',CoordL:[[[0,0,0],[10,0,10]]]};
const runtimeGuard=validateV3WorkflowRecords(base,sample,[{outputId:sample.outputs[0].id,classification:leaf.path,record}] as any);
if(!runtimeGuard.some(issue=>issue.message.includes('Level')&&issue.message.includes('数值')))throw Error('Runtime numeric type guard was not exercised');
const duplicateConfig=structuredClone(base),duplicateRoot=root(duplicateConfig),duplicateField={...freshField(),fieldId:duplicateRoot.fields[0].fieldId};duplicateRoot.fields.push(duplicateField);
const duplicateIdReferenceProbe={selectedField:duplicateField.key,resolvedField:resolveBoundCard(duplicateConfig,{id:'probe',source:duplicateField.key,renderer:'text',visible:true,fieldBinding:{nodeId:duplicateRoot.nodeId,fieldId:duplicateField.fieldId}}).source};
const mountedAudit:any[]=[];
for(const mode of ['present-nested-required','nested-condition-missing-required','existing-value-wrong-type']){
 const c=structuredClone(base),node=root(c),required=node.fields.find((f:any)=>f.key==='tags.nomenclator');
 required.required=true;required.validateExistingData=true;
 const mounted:any={ID:'mounted-audit',World:'zth',Class:'ROD',Kind:leaf.path.kind,SKind:leaf.path.skind,SKind2:leaf.path.skind2,Name:'audit',tags:{nomenclator:'present'},Level:1};
 if(mode==='nested-condition-missing-required'){required.requiredWhen=[{kind:'fieldEquals',field:'tags.flag',value:'yes'}];mounted.tags={flag:'yes'};}
 if(mode==='existing-value-wrong-type'){required.required=false;const f=node.fields.find((f:any)=>f.key==='Level');f.required=true;f.validateExistingData=true;mounted.Level='not-a-number';}
 const report=validateConfigPackage(c,[mounted]);mountedAudit.push({mode,configurationValidWithoutRecords:validateConfigPackage(c).valid,mountedIssues:report.issues.filter(i=>i.code.startsWith('mounted-')).map(i=>({code:i.code,message:i.message,field:i.field}))});
}

const compatibility:any[]=[];
for(const file of ['r8-r4.config.json','r9-r5.config.json','r10-r6.config.json','r11-r7.config.json']){
 const bytes=fs.readFileSync('src/configStudio/defaults/'+file),original=JSON.parse(bytes.toString('utf8'));
 const before=sha(bytes);const row:any={file,originalContract:original.contractRevision};
 try{
  const imported=await readConfigPackage(new File([bytes],file));row.importedContract=imported.contractRevision;row.readValid=validateConfigPackage(imported).valid;
  const migrated=migrateConfigToR11(imported).config;row.migratedContract=migrated.contractRevision;row.migratedValid=validateConfigPackage(migrated).valid;
  row.sourceUnchanged=before===sha(fs.readFileSync('src/configStudio/defaults/'+file));
  const exported=await buildConfigPackageArchive(migrated,validateConfigPackage(migrated));row.zipBytes=exported.size;row.roundtripEqual=stableConfigText(await readConfigPackage(new File([exported],file+'.zip')))===stableConfigText(migrated);
  row.workflowArtifacts=0;row.categoryTrees=0;
  for(const w of imported.workflows){const artifact=buildWorkflowArtifact(imported,w);prepareWorkflowArtifactImport(base,artifact);row.workflowArtifacts++;}
  row.rawTreeConflicts=[];
  if(imported.contractRevision>=9)for(const n of imported.nodes.filter(n=>!n.path.kind)){const artifact=await createCategoryArtifact(imported,n.nodeId,'classTree');const prepared=prepareCategoryImport(base,artifact);if(!prepared.report.valid){const repaired=prepareCategoryImport(base,artifact,true);row.rawTreeConflicts.push({class:n.path.class,codes:[...new Set(prepared.report.issues.filter(i=>i.severity==='error').map(i=>i.code))],explicitRepairValid:repaired.report.valid});}else row.categoryTrees++;}
  else row.rawTreeExportRequiresUpgrade=true;
  row.migratedCategoryTrees=0;for(const n of migrated.nodes.filter(n=>!n.path.kind)){const artifact=await createCategoryArtifact(migrated,n.nodeId,'classTree');const prepared=prepareCategoryImport(base,artifact);if(!prepared.report.valid)throw Error('migrated tree import invalid '+n.path.class);row.migratedCategoryTrees++;}
 }catch(error){row.error=String(error);}
 compatibility.push(row);console.log('compatibility',file,JSON.stringify(row));
}

const blob=await buildConfigPackageArchive(base,baseline),bytes=new Uint8Array(await blob.arrayBuffer()),archive=await JSZip.loadAsync(bytes);
const manifest=JSON.parse(await archive.file('manifest.json')!.async('string'));
const integrity:any[]=[];
for(const [name,mutate] of [
 ['config tamper',(zip:JSZip)=>zip.file('config.json',JSON.stringify({...base,revision:base.revision+1}))],
 ['report tamper',(zip:JSZip)=>zip.file('reports/validation-report.json','{}')],
 ['unknown manifest schema',(zip:JSZip)=>zip.file('manifest.json',JSON.stringify({...manifest,schemaVersion:'unknown'}))],
 ['manifest package identity mismatch',(zip:JSZip)=>zip.file('manifest.json',JSON.stringify({...manifest,packageId:'different-package'}))],
 ['manifest wrong byteLength',(zip:JSZip)=>zip.file('manifest.json',JSON.stringify({...manifest,files:manifest.files.map((f:any)=>({...f,byteLength:1}))}))],
] as const){const zip=await JSZip.loadAsync(bytes);mutate(zip);let rejected=false,message='';try{await readConfigPackage(new File([await zip.generateAsync({type:'uint8array'})],'tampered.zip'));}catch(error){rejected=true;message=String(error);}integrity.push({name,rejected,message});}

const scale:any[]=[];
for(const extra of [0,100,400]){
 const c=structuredClone(base);for(let i=0;i<extra;i++){const n=structuredClone(root(base));n.nodeId='audit-scale-'+i;n.path={class:'AUDIT'+i};n.children=[];delete n.legacy;c.nodes.push(n);}
 const serialized=JSON.stringify(c),row:any={nodes:c.nodes.length,workflows:c.workflows.length,bytes:Buffer.byteLength(serialized)};
 let t=performance.now();const report=validateConfigPackage(c);row.validateMs=performance.now()-t;row.valid=report.valid;
 if(report.valid){t=performance.now();const compiled=compileConfigRuntime(c,true);row.compileMs=performance.now()-t;row.stats=configCompilationStats(compiled);t=performance.now();const packed=await buildConfigPackageArchive(c,report);row.exportZipMs=performance.now()-t;row.zipBytes=packed.size;t=performance.now();const loaded=await readConfigPackage(new File([packed],'scale.zip'));row.readZipMs=performance.now()-t;row.roundtripNodes=loaded.nodes.length;}
 else row.errors=report.issues.filter(i=>i.severity==='error').slice(0,3);
 scale.push(row);console.log('scale',JSON.stringify(row));
}
const summary={testedCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),configSha256:sha(raw),contractRevision:base.contractRevision,packageRevision:base.revision,baseline:view(baseline),scenarioCount:results.length,detectedErrors:results.filter(r=>r.expected==='error'&&r.package&&!r.package.valid).length,gaps:results.filter(r=>!r.matchesExpectation).map(r=>r.id),runtimeGuard,duplicateIdReferenceProbe,mountedAudit,compatibility,integrity,scale};
fs.writeFileSync(path.join(out,'mutation-scenarios.json'),JSON.stringify(results,null,2)+'\n');
fs.writeFileSync(path.join(out,'audit-summary.json'),JSON.stringify(summary,null,2)+'\n');
console.log('AUDIT COMPLETE',JSON.stringify({scenarios:results.length,gaps:summary.gaps,output:out}));
