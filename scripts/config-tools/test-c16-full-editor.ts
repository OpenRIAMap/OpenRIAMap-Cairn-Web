import {editableGeometryProfile} from '../../src/configStudio/renderRuleTemplates';
import assert from 'node:assert/strict';
import {readC16MigrationSource} from './fixtures/c16-migration-source';
import {migratePackageToC16} from '../../src/configStudio/contractMigration';
import {validateConfigPackage} from '../../src/configStudio/runtime';
import {fullEditorWorkflow,initializeFullEditor,prepareFullEditorCreate} from '../../src/configStudio/fullEditor';
import {compileWorkflowEditPlan,hydrateWorkflowEdit} from '../../src/configStudio/workflowEditing';
import {prepareNativeWorkflowEdit} from '../../src/configStudio/workflowEditCommit';
import type {WorkflowDefinition} from '../../src/configStudio/types';

const base=readC16MigrationSource();
const config=migratePackageToC16(base).config,path={class:'NEWCLASS'},profile=editableGeometryProfile('Point',16);
config.nodes.push({nodeId:'newclass',path,geometryType:'Point',children:[],fields:[
 {fieldId:'new-name',key:'Name',type:'string',cardinality:'single',input:'text',labels:{zh:'新名字',en:''},description:{zh:'',en:''},required:true},
 {fieldId:'new-number',key:'Count',type:'number',cardinality:'single',input:'text',labels:{zh:'数量',en:''},description:{zh:'',en:''}},
],geometryProfiles:{Point:profile}});
const workflow:WorkflowDefinition={id:'newclass-editor',label:{zh:'新分类编辑',en:''},mode:'composed',quickMapping:false,editor:{enabled:true,dedicated:true,scope:path},steps:[
 {id:'actor',kind:'actor',label:{zh:'填写人',en:''}},
 {id:'form',kind:'form',label:{zh:'资料',en:''},controls:[{id:'name',kind:'text',slot:'F1',columns:1,label:{zh:'新名字',en:''},required:true},{id:'count',kind:'number',slot:'F2',columns:1,label:{zh:'数量',en:''},defaultValue:0},{id:'annotations',kind:'tagsExtensions',columns:1,label:{zh:'标签与扩展',en:''},systemManaged:true,tagsExtensions:{tagsEnabled:true,extensionsEnabled:true}}]},
 {id:'geometry',kind:'geometry',label:{zh:'绘制',en:''},outputId:'main',geometry:['Point'],drawing:{enabledFromThisPage:true,keepDrawingWhenBack:true,allowBack:true,multiple:false}},
],outputs:[{id:'main',classificationGroup:{selectors:[{id:'self',mode:'self',path}]},geometry:{selected:'Point'},assignments:[{id:'id',target:'ID',expression:'"old-create-id"'},{id:'name',target:'Name',expression:'F1'},{id:'count',target:'Count',expression:'F2'}]}]};
config.workflows.push(workflow);
assert(validateConfigPackage(config).valid,JSON.stringify(validateConfigPackage(config).issues.filter(issue=>issue.severity==='error')));
const routed=fullEditorWorkflow(config,path,'Point'),plan=compileWorkflowEditPlan(routed,config),draft=initializeFullEditor(config,plan,path);
assert.equal(draft.slots.F2,0);
draft.slots.EDIT_ID='Z_NEW_1';draft.slots.F1='新要素';
const geometry={type:'Point' as const,parts:[{x:1,y:64,z:2}]},now=new Date('2026-10-26T00:00:00Z');
const created=prepareFullEditorCreate(config,routed,draft,geometry,'zth','creator',[],now);
assert.equal(created.ID,'Z_NEW_1','manual ID never runs creation ID assembly');
assert.equal(created.Count,0);assert.equal(created.CreateBy,'creator');assert.equal(created.CreateTime,'20261026');assert.equal(created.ModifityBy,undefined);
assert.throws(()=>prepareFullEditorCreate(config,routed,draft,geometry,'zth','creator',[created],now),/已存在/);
const editing=hydrateWorkflowEdit(plan,created);editing.slots.F1='编辑后';
const changed=prepareNativeWorkflowEdit(config,routed,created,editing,geometry,'zth','editor',[],new Date('2026-10-27T00:00:00Z'));
assert.equal(changed.Name,'编辑后');assert.equal(changed.ID,created.ID);assert.equal(changed.CreateBy,'creator');assert.equal(changed.CreateTime,'20261026');assert.equal(changed.ModifityBy,'editor');
assert.throws(()=>fullEditorWorkflow(config,{class:'UNKNOWN'},'Point'),/未启用/);
const conflict=structuredClone(config);conflict.workflows.push({...workflow,id:'duplicate-editor'});
assert.throws(()=>fullEditorWorkflow(conflict,path,'Point'),/同优先级/);
console.log('c16 full editor: unregistered class, shared plan/defaults, manual create ID, creation/edit metadata, duplicate ID and route conflict passed');
