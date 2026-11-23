import type {ConfigPackageV3,FieldDefinition,WorkflowDefinition} from './types';
import {groupTagControls,DATASET_TABLE_ID} from './c21Workflow';
import {syncWorkflowClassification} from './systemClassification';
import {resolveEffectiveFields} from './runtime';
import type {MigrationChange} from './contractMigration';
export const datasetField=():FieldDefinition=>({fieldId:'system-tags-dataset',key:'tags.dataset',scope:'tags',type:'string',cardinality:'single',input:'select',format:'plain',dynamicSource:'dataset-directory',labels:{zh:'所属数据集',en:'Dataset'},description:{zh:'采集计划所属数据集',en:''},inheritance:'overridable'});
export function migrateC21Workflow(workflow:WorkflowDefinition,config?:ConfigPackageV3):WorkflowDefinition{
 const result=config?syncWorkflowClassification({...config,contractRevision:21},workflow):structuredClone(workflow);
 groupTagControls(result);return result;
}
export function migrateC21Package(config:ConfigPackageV3,changes:MigrationChange[]):void{
 config.lookupTables??=[];
 if(!config.lookupTables.some(t=>t.id===DATASET_TABLE_ID))config.lookupTables.push({id:DATASET_TABLE_ID,label:{zh:'数据集目录',en:'Dataset directory'},valueType:'string',functionKind:'dataset',rows:[]});
 for(const t of config.lookupTables)if(t.functionKind==='teleportHub')for(const row of t.rows){const hub=row.functionValue;if(hub&&typeof hub==='object'&&'returnPoints' in hub){delete hub.range;const world=config.application?.worlds.find(w=>[w.id,w.prefix,String(w.numericCode),w.label.zh,w.label.en].includes(hub.world));if(world)hub.world=world.id;}}
 const tags=config.lookupTables.find(t=>t.id==='standard-tag-fields');if(tags&&!tags.rows.some(r=>r.value==='dataset'))tags.rows.push({value:'dataset',label:{zh:'所属数据集',en:'Dataset'},functionValue:{kind:'tagField',type:'select',dynamicSource:'dataset-directory'}});
 for(const n of [...config.nodes].sort((a,b)=>Object.keys(a.path).length-Object.keys(b.path).length))if(!resolveEffectiveFields(config,n.path).some(f=>f.key==='tags.dataset'))n.fields.push(datasetField());
 config.workflows=config.workflows.map(w=>migrateC21Workflow(w,config));
 if(config.application){config.application.titles??={mapTitle:'RIA 在线地图',tabTitle:'CairnMap - OpenRIAMap Profile'};for(const n of config.application.announcements?.items??[])n.loginOnly??=false;}
 changes.push({id:'c20-c21:identity',kind:'converted',component:'contract',path:'contractRevision',before:20,after:21,message:'c21：新增数据集和系统单元、标签分栏、标题及公告门槛；移除枢纽退役范围，保留既有输出、控件、公告与返回点身份。'});
}
