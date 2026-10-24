import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {migratePackageToC15} from '../../../src/configStudio/contractMigration';
import {editableGeometryProfile} from '../../../src/configStudio/renderRuleTemplates';
import {syncWorkflowClassification} from '../../../src/configStudio/systemClassification';
import type {CategoryNode,ConfigPackageV3,FieldDefinition,WorkflowDefinition} from '../../../src/configStudio/types';

export function classificationFixture(){
  const config=migratePackageToC15(JSON.parse(gunzipSync(fs.readFileSync('scripts/config-tools/fixtures/c13-baseline.config.json.gz')).toString('utf8'))).config;
  config.workflows=[];
  const field=(key:string,extra:Partial<FieldDefinition>={}):FieldDefinition=>({fieldId:'test-'+key,key,labels:{zh:key,en:''},description:{zh:'',en:''},type:'string',cardinality:'single',input:'text',...extra});
  const node=(id:string,path:CategoryNode['path'],fields:FieldDefinition[]=[],type:'Point'|'Polygon'='Point'):CategoryNode=>({nodeId:id,path,geometryType:type,classificationLabels:Object.fromEntries(Object.entries(path).map(([level,code])=>[level,{zh:code==='A'?'同名类型':'名称'+code,en:''}])),geometryProfiles:{[type]:editableGeometryProfile(type,15)},fields,children:[]});
  config.nodes.push(
    node('test-root',{class:'WFTEST'},[field('Name',{required:true}),field('URL',{inheritance:'localOnly'}),field('Num',{type:'number'}),field('Flag',{type:'boolean'})]),
    node('test-kind',{class:'WFTEST',kind:'A'},[field('URL')]),
    node('test-group',{class:'WFTEST',kind:'GROUP'}),
    node('test-skind',{class:'WFTEST',kind:'GROUP',skind:'B'},[field('URL',{format:'externalLink'}),field('OnlyB')]),
    node('test-deep',{class:'WFTEST',kind:'DEEP'}),
    node('test-mid',{class:'WFTEST',kind:'DEEP',skind:'MID'}),
    node('test-skind2',{class:'WFTEST',kind:'DEEP',skind:'MID',skind2:'C'},[field('URL')]),
    node('test-area',{class:'WFTEST',kind:'AREA'},[field('URL')],'Polygon'),
    {...node('test-line',{class:'WFTEST',kind:'LINE'},[field('URL')]),geometryType:'LineString',geometryProfiles:{LineString:editableGeometryProfile('LineString',15),Point:{...editableGeometryProfile('Point',15),enabled:false}}},
    node('test-other',{class:'OTHER'},[field('Name',{required:true}),field('URL',{inheritance:'localOnly'}),field('Num',{type:'number'}),field('Flag',{type:'boolean'})]),
    node('test-other-kind',{class:'OTHER',kind:'A'},[field('URL')]),
  );
  // Prevent inherited Point support from turning the area-only node into a candidate.
  config.nodes.find(node=>node.nodeId==='test-area')!.geometryProfiles.Point={...editableGeometryProfile('Point',15),enabled:false};
  delete config.nodes.find(node=>node.nodeId==='test-root')!.geometryType;
  for(const parent of config.nodes.filter(node=>['WFTEST','OTHER'].includes(node.path.class))){
    const parts=Object.entries(parent.path).filter(([,value])=>Boolean(value));
    parent.children=config.nodes.filter(node=>Object.values(node.path).filter(Boolean).length===parts.length+1&&parts.every(([key,value])=>node.path[key as keyof CategoryNode['path']]===value)).map(node=>node.nodeId);
  }
  let workflow:WorkflowDefinition={id:'classification-correction',label:{zh:'分类直选测试',en:''},mode:'composed',actor:{required:true},steps:[
    {id:'actor',kind:'actor',label:{zh:'填写人',en:''}},
    {id:'form',kind:'form',label:{zh:'基本信息',en:''},controls:[
      {id:'name',kind:'text',slot:'NAME',columns:1,required:true,label:{zh:'名称',en:''}},
      {id:'url',kind:'text',slot:'URL',columns:1,label:{zh:'链接',en:''}},
      {id:'annotations',kind:'tagsExtensions',columns:1,label:{zh:'标签与扩展',en:''},systemManaged:true,tagsExtensions:{tagsEnabled:true,extensionsEnabled:true}},
    ]},
    {id:'drawing',kind:'geometry',label:{zh:'绘制',en:''},outputId:'output',geometry:['Point'],drawing:{returnFormat:'coordP',captureSlot:'MAIN',multiple:false}},
  ],outputs:[{id:'output',classificationGroup:{selectors:[
    {id:'terminals',mode:'leafDescendants',path:{class:'WFTEST'}},
    {id:'parent',mode:'self',path:{class:'WFTEST'}},
    {id:'other',mode:'self',path:{class:'OTHER',kind:'A'}},
    {id:'duplicate',mode:'self',path:{class:'WFTEST',kind:'A'}},
  ]},geometry:{selected:'Point'},assignments:[
    {id:'id',target:'ID',expression:'join("_",Class,Kind,Skind,Skind2,"record")'},
    {id:'name',target:'Name',expression:'NAME'},
    {id:'url',target:'URL',expression:'URL'},
    {id:'num',target:'Num',expression:'0'},
    {id:'flag',target:'Flag',expression:'false'},
  ]}]};
  workflow=syncWorkflowClassification(config,workflow);config.workflows=[workflow];
  return {config:config as ConfigPackageV3,workflow,field,node};
}
