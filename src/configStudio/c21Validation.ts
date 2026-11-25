import type {ConfigPackageV3,WorkflowValueCondition} from './types';
import {classificationScopeProblems} from './classificationScope';
import {tableDefinitionErrors,tableValueErrors} from './ordinaryTable';
export function c21ConfigurationProblems(config:ConfigPackageV3):Array<{path:string;message:string}>{
 const issues:Array<{path:string;message:string}>=[],fail=(path:string,message:string)=>issues.push({path,message});
 const c21=config.contractRevision>=21;
 if(!c21&&(config.application?.titles||config.application?.announcements?.items.some(n=>n.loginOnly!==undefined)))fail('application','标题和登录公告门槛最低要求 c21。');
 const condition=(c:WorkflowValueCondition|undefined,path:string,depth=0)=>{if(!c)return;if(depth>12){fail(path,'条件嵌套不能超过 12 层。');return;}if(c.all&&c.any)fail(path,'条件不能同时使用全部和任意组合。');if(c.all||c.any){if(!(c.all??c.any)!.length)fail(path,'条件组合不能为空。');for(const v of c.all??c.any??[])condition(v,path,depth+1);}else if(!c.token||!['empty','present','equals','in'].includes(c.operator)||c.operator==='equals'&&c.value===undefined||c.operator==='in'&&!c.values?.length)fail(path,'显示条件缺少字段、操作或比较值。');};
 if(c21&&config.application){const directory=config.lookupTables?.find(t=>t.id==='dataset-directory');if(!directory||directory.functionKind!=='dataset'||directory.valueType!=='string')fail('lookupTables/dataset-directory','数据集目录的固定身份、功能和文本保存类型必须保留。');}
 for(const t of config.lookupTables??[]){const path='lookupTables/'+t.id;
  if(!c21&&t.functionKind==='dataset')fail(path,'数据集目录最低要求 c21。');
  if(t.functionKind==='dataset')for(const row of t.rows){const v=row.functionValue;if(!v||typeof v!=='object'||!('scope' in v)){fail(path,'数据集行需要世界与分类范围。');continue;}if(!config.application?.worlds.some(w=>w.id===v.world&&w.enabled))fail(path,'数据集行需要已启用世界的稳定 ID。');if(!v.scope.rows.length)fail(path,'数据集行至少需要一个分类范围。');for(const message of classificationScopeProblems(v.scope,config))fail(path,message);}
  if(c21&&t.functionKind==='teleportHub')for(const row of t.rows){const v=row.functionValue;if(v&&typeof v==='object'&&'returnPoints' in v){if('range' in v)fail(path,'c21 已移除枢纽范围，请从旧契约显式迁移。');if(!config.application?.worlds.some(w=>w.id===v.world&&w.enabled))fail(path,'枢纽世界需要已启用世界稳定 ID。');}}
 }
 for(const n of config.nodes){const path='nodes/'+n.nodeId;
  for(const f of n.fields){if(!c21&&(f.table||f.dynamicSource||f.format==='table'||f.input==='table'))fail(path,'表格和动态数据集字段最低要求 c21。');if(f.format==='table'||f.input==='table'){if(f.format!=='table'||f.input!=='table'||f.type!=='json'||f.cardinality!=='single')fail(path,'普通表格需要单值 JSON 类型、表格格式与表格输入。');for(const message of tableDefinitionErrors(f.table))fail(path+'/fields/'+f.fieldId,message);}}
  if(n.card?.mode==='fields')for(const item of n.card.items){if(!c21&&item.when)fail(path,'信息卡行条件最低要求 c21。');condition(item.when,path+'/card/'+item.id);}
 }
 for(const w of config.workflows){const path='workflows/'+w.id,controls=w.steps.flatMap(s=>s.controls??[]);
  if(c21&&w.mode==='composed')for(const o of w.outputs){const ds=controls.filter(c=>c.kind==='dataset'&&c.outputId===o.id);if(ds.length!==1||!ds[0]?.systemManaged)fail(path,'每个输出需要唯一系统所属数据集单元。');if(o.assignments.some(a=>a.target==='tags.dataset'||a.target==='tags'))fail(path,'tags.dataset 由系统数据集单元独占，不能由普通组装重复写入。');}
  for(const s of w.steps){const ids=new Set<string>();for(const section of s.sections??[]){if(!c21||s.kind!=='form'||!section.id||ids.has(section.id)||!(section.label.zh.trim()||section.label.en.trim()))fail(path,'分栏必须在 c21 信息页内，标识唯一且有标题。');ids.add(section.id);}
   for(const c of s.controls??[]){if(!c21&&(c.kind==='table'||c.kind==='dataset'||c.sectionId))fail(path,'表格、数据集、分栏控件最低要求 c21。');if(c.sectionId&&(!ids.has(c.sectionId)||['classificationPicker','tagsExtensions'].includes(c.kind)))fail(path,'控件分栏引用无效，分类和标签扩展单元不能进入分栏。');if(c.kind==='table'){for(const message of tableDefinitionErrors(c.table))fail(path+'/controls/'+c.id,message);if(c.defaultValue!==undefined)for(const message of tableValueErrors(c.table,c.defaultValue,!!c.required))fail(path,message);}condition(c.when,path);}
  }
 }
 if(c21&&config.application?.titles)for(const [key,v] of Object.entries(config.application.titles))if(!v.trim()||v.length>200)fail('application/titles/'+key,'标题需要 1–200 字符。');
 return issues;
}
