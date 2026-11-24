/** RIA business configuration generation. No network or publication side effects. */
import fs from 'node:fs';
import {configureC21BuildingWorkflows} from './c21-building-workflows';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {migratePackageToContract} from '../../src/configStudio/contractMigration';
import {resolveEffectiveFields,resolveCardConfiguration,resolveGeometryProfile,validateConfigPackage} from '../../src/configStudio/runtime';
import {syncSystemClassification} from '../../src/configStudio/systemClassification';
import {groupTagControls} from '../../src/configStudio/c21Workflow';
import {datasetField} from '../../src/configStudio/c21Migration';
import {canonicalDictionaries} from '../../src/configStudio/dictionaryContract';
import {buildConfigPackageArchive} from '../../src/configStudio/package';
import type {ClassificationPath,ConfigPackageV3,FieldDefinition} from '../../src/configStudio/types';
const input=path.resolve(process.argv[2]??'../../outputs/c21-generation-20261124/baseline/formal-r161-c20.config.json'),out=path.resolve(process.argv[3]??'../../outputs/c21-repair-20261124/candidate');fs.mkdirSync(out,{recursive:true});
const bytes=fs.readFileSync(input),base=JSON.parse(bytes.toString('utf8')) as ConfigPackageV3;
if(base.revision!==161||base.contractRevision!==20||createHash('sha256').update(bytes).digest('hex')!=='ceaae53a99a215389edd966d39d8c19673b2ea08fe79c9320237da9a511c8cf7')throw Error('c21 baseline identity mismatch');
const migrated=migratePackageToContract(base),config=migrated.config;
const L=(zh:string)=>({zh,en:''}),K=(p:ClassificationPath)=>[p.class,p.kind,p.skind,p.skind2].filter(Boolean).join('/');
const groups=[['BUD/NOM','NOM:普通建筑|RES:住宅建筑|COM:商业建筑|OFF:办公建筑|IND:工业设施|CRG:仓储设施|PUB:公共服务建筑|CUL:文体景观建筑|MIX:综合用途建筑'],['BUD/LAR','RES:住宅小区|COM:商业综合体|OFF:办公园区|IND:工业设施群|CRG:仓储设施群|PUB:公共服务园区|CUL:文体景观建筑群|MIX:综合建筑群'],['BUD/SUB/BUM','NOM:普通附属建筑|RES:附属住宅建筑|COM:附属商业建筑|OFF:附属办公建筑|IND:附属工业设施|CRG:附属仓储设施|PUB:附属公共服务建筑|AUX:附属配套设施'],['BUD/SUB/BUP','ENT:出入口|SRV:服务点|FAC:设施点|OTH:其他附属点'],['FLR/NOM','NOM:普通楼内单元|RES:住宅单元|COM:商业单元|OFF:办公单元|IND:工业单元|CRG:仓储单元|PUB:公共服务单元|CIR:公共通行单元|AUX:设备后勤单元']];
const parse=(text:string):ClassificationPath=>Object.fromEntries(text.split('/').map((v,i)=>[['class','kind','skind','skind2'][i],v])) as ClassificationPath;
const originals=new Map(base.nodes.filter(n=>['BUD','FLR'].includes(n.path.class)).map(n=>[K(n.path),{node:structuredClone(n),fields:resolveEffectiveFields(base,n.path),card:resolveCardConfiguration(base,n.path)}]));
const bud=originals.get('BUD/NOM')!,flr=originals.get('FLR/NOM')!;
for(const [prefix,entries] of groups)for(const part of [prefix,...entries.split('|').map(e=>prefix+'/'+e.split(':')[0])]){
 const p=parse(part);if(config.nodes.some(n=>K(n.path)===part))continue;
 for(let depth=2;depth<part.split('/').length;depth++){const q=part.split('/').slice(0,depth).join('/');if(!config.nodes.some(n=>K(n.path)===q))config.nodes.push({...structuredClone(bud.node),nodeId:'c21-'+q.toLowerCase().replaceAll('/','-'),path:parse(q),children:[],fields:[],legacy:undefined});}
 const template=part.includes('/SUB/')||p.class==='FLR'?flr.node:bud.node;
 const n={...structuredClone(template),nodeId:'c21-'+part.toLowerCase().replaceAll('/','-'),path:p,children:[],fields:[],legacy:undefined};config.nodes.push(n);
}
const main={enabled:true,role:'main' as const,floorViewMinZoom:4},member={enabled:true,role:'member' as const,hostField:'BuildingID',selectorField:'NofFloor',visibility:'activeLevel' as const,allowIndependentDisplay:false};
const specs:Array<[string,string,string,string[]?]>=[['Address','地址','text'],['BuildingNo','楼栋号','text'],['RoomNo','单元号','text'],['Builder','建者','text'],['User','用户列表','textarea',['RES','OFF','MIX']],['Operator','运营者','text',['COM','IND','PUB','MIX','CRG']],['Contact','设施联络人','textarea',['COM','IND','PUB','MIX','CRG']],['Access','许可范围','textarea',['COM','IND','PUB','MIX','CRG']],['Public','是否公开','toggle',['COM','IND','PUB','MIX','CRG']],['Status','服务开放状态','toggle'],['Situation','建筑本身状态','toggle'],['ContainTRP','包含交易','json',['COM','PUB','MIX','CUL','CRG']],['BusinessType','经营内容','textarea',['COM']],['OfficeUse','用途','textarea',['OFF']],['ProductionType','生产内容或过程','textarea',['IND']],['Products','产物列表','table',['IND']],['StorageContent','仓储内容','table',['CRG']],['ServiceType','服务内容','text',['PUB']],['FacilityFunction','设施功能','text',['CUL']],['UnitCount','户数','number',['RES']],['FloorsAbove','地上层数','number',['RES']],['FloorsBelow','地下层数','number',['RES']],['EntranceRole','入口性质','text',['ENT']],['CirculationType','通行功能','text',['CIR']],['ConnectsFloors','连接楼层','text',['CIR']],['AuxiliaryUse','后勤／配套用途','text',['AUX']]];
const applies=(p:ClassificationPath,key:string,uses?:string[])=>{
 const k=K(p),use=p.skind2??p.skind;
 if(key==='Address')return /^BUD\/(NOM|LAR|SUB\/(BUM|BUP))(\/|$)/.test(k);
 if(key==='BuildingNo')return /^BUD\/(NOM|SUB\/BUM)(\/|$)/.test(k);
 if(key==='RoomNo')return p.class==='FLR';
 if(key==='ServiceType'&&k==='BUD/SUB/BUP/SRV'||key==='FacilityFunction'&&k==='BUD/SUB/BUP/FAC')return true;
 return !uses||uses.includes(use??'');
};
function field(key:string,label:string,input:string):FieldDefinition{
 const table=key==='Products'?{columns:[{key:'product',label:L('产物'),type:'text' as const,required:true},{key:'efficiency',label:L('理论效率'),type:'text' as const}]}:key==='StorageContent'?{columns:[{key:'contain',label:L('存储'),type:'text' as const,required:true},{key:'reserves',label:L('理论存储量'),type:'text' as const}]}:undefined;
 return {fieldId:'c21-'+key,key,labels:L(label),description:L(''),type:input==='number'?'number':input==='toggle'?'boolean':['json','table'].includes(input)?'json':'string',cardinality:'single',input:input==='number'?'text':input as FieldDefinition['input'],format:input==='table'?'table':input==='toggle'?'boolean':input==='json'?'json':'plain',...(table?{table:{...table,maxRows:500,maxCellLength:10000}}:{}),...(input==='toggle'?{optionValueType:'boolean' as const,options:[{value:'true',label:L(key==='Public'?'公开':key==='Status'?'开放':'正常')},{value:'false',label:L(key==='Public'?'私有':key==='Status'?'关闭':'隐藏') }]}:{}),...(key==='Products'?{required:true}:{}),inheritance:'overridable'};
}
const memberProfiles=structuredClone(flr.node.geometryProfiles);
for(const profile of Object.values(memberProfiles))if(profile){const hidden=profile.zoomPriority.rules.find(r=>r.representation==='hidden'&&r.when?.zoom.max===5),high=profile.zoomPriority.rules.find(r=>r.representation==='geometry'&&r.when?.zoom.min===6);if(hidden&&high){hidden.when!.zoom.max=3;const added=structuredClone(high);added.id='c21-member-geometry-4-5';added.when!.zoom={min:4,max:5};if(added.label)added.label.visible=false;profile.zoomPriority.rules.splice(profile.zoomPriority.rules.indexOf(high),0,added);}}
const pointRule=structuredClone(bud.node.geometryProfiles.Polygon!.zoomPriority.rules.find(r=>r.representation==='point')!);pointRule.id='c21-member-point-compatible';pointRule.representation='geometry';pointRule.when={zoom:{min:4,max:8}};pointRule.logic={templateId:config.engine!.renderTemplates!.find(t=>t.geometry==='Point')!.id,overrides:{}};if(pointRule.label)pointRule.label.visible=false;
const pointHigh=structuredClone(pointRule);pointHigh.id='c21-member-point-6-8';pointHigh.when={zoom:{min:6,max:8}};pointHigh.label=structuredClone(bud.node.geometryProfiles.Polygon!.zoomPriority.rules.find(r=>r.representation==='point')!.label);pointRule.when={zoom:{min:4,max:5}};
if(pointRule.style?.pointSymbol?.kind==='shape')pointRule.style.pointSymbol.shape.behavior={...pointRule.style.pointSymbol.shape.behavior,visibility:'independent'};
for(const n of config.nodes.filter(n=>['BUD','FLR'].includes(n.path.class))){
 const original=originals.get(K(n.path)),isMember=n.path.class==='FLR'||n.path.kind==='SUB',isPoint=n.path.kind==='SUB'&&n.path.skind==='BUP';
 const template=original??(isMember?flr:bud);
 n.fields=structuredClone(template.fields).filter(f=>!specs.some(s=>s[0]===f.key)&&f.key!=='tags.dataset').map(f=>({...f,inheritance:'overridable',overrideOf:undefined}));
 n.fields.push(...specs.filter(([key,,,uses])=>applies(n.path,key,uses)).map(([key,label,input])=>field(key,label,input)),datasetField());
 n.inheritDown={fields:false,card:false,display:false,search:false};n.receiveFromParent={...n.receiveFromParent,fields:false,card:false,display:false};
 if(K(n.path)==='BUD'||K(n.path)==='BUD/SUB')delete n.geometryType;
 n.displaySettings={structure:isMember?member:main};if(n.fieldSettings?.structure)delete n.fieldSettings.structure;
 if(isMember){n.geometryProfiles=isPoint?{Point:{enabled:true,allowMultipleParts:true,zoomPriority:{rules:[structuredClone(pointRule),structuredClone(pointHigh)]}}}:structuredClone(memberProfiles);n.geometryType=isPoint?'Point':'Polygon';n.receiveFromParent={...n.receiveFromParent,geometry:false,display:false};n.inheritDown.display=false;}
 else {n.geometryProfiles=structuredClone(original?.node.geometryProfiles??bud.node.geometryProfiles);n.geometryType='Polygon';}
 if(K(n.path)==='BUD'||K(n.path)==='BUD/SUB')delete n.geometryType;
 const label=groups.flatMap(([prefix,entries])=>entries.split('|').map(e=>({p:prefix+'/'+e.split(':')[0],label:e.split(':')[1]}))).find(row=>row.p===K(n.path))?.label??({'BUD/LAR':'建筑群','BUD/SUB':'附属建筑','BUD/SUB/BUM':'附属建筑面','BUD/SUB/BUP':'附属建筑点','BUD/NOM':'标准建筑','FLR/NOM':'楼内单元'}[K(n.path)]);
 if(label){const level=n.path.skind2?'skind2':n.path.skind?'skind':n.path.kind?'kind':'class';n.classificationLabels={...n.classificationLabels,[level]:L(label)};}
 const card=structuredClone(template.card);if(card?.mode==='fields'){
  card.items=card.items.filter(i=>!specs.some(s=>s[0]===i.source)).map(i=>({...i,inheritFrom:undefined}));
  for(const f of n.fields.filter(f=>specs.some(s=>s[0]===f.key)||f.key==='tags.dataset'))card.items.push({id:'c21-card-'+f.key,source:f.key,visible:true,hideWhenEmpty:true,section:'main',renderer:f.key==='ContainTRP'?'relationLink':'text',label:f.labels,options:{format:f.type==='boolean'?'enum':f.format},...(f.type==='boolean'?{valueOptions:f.options,optionValueType:'boolean' as const}:{}),...(f.key==='Access'?{when:{token:'Public',operator:'equals',value:false}}:{}),...(f.key==='ContainTRP'?{relation:{multiple:true,sourceValuePath:'ID',targetClassification:{class:'TRP'},targetMatchField:'ID',targetDisplayField:'Name',clickable:true}}:{})});
  n.card=card;
 }
}
for(const n of config.nodes)n.children=config.nodes.filter(child=>{const a=K(n.path).split('/'),b=K(child.path).split('/');return b.length===a.length+1&&a.every((v,i)=>b[i]===v);}).map(child=>child.nodeId);
configureC21BuildingWorkflows(config,specs.map(spec=>spec[0]));
let candidate=canonicalDictionaries(syncSystemClassification(config));for(const w of candidate.workflows)groupTagControls(w);
// r161 is the publication baseline, not a newly allocated production revision.
const report=validateConfigPackage(candidate);fs.writeFileSync(path.join(out,'candidate.config.json'),JSON.stringify(candidate,null,2)+'\n');fs.writeFileSync(path.join(out,'validation.json'),JSON.stringify(report,null,2)+'\n');fs.writeFileSync(path.join(out,'migration.json'),JSON.stringify(migrated.report,null,2)+'\n');
if(!report.valid){console.error(JSON.stringify(report.issues.filter(i=>i.severity==='error').slice(0,25),null,2));throw Error('c21 candidate validation failed');}
const archive=Buffer.from(await(await buildConfigPackageArchive(candidate,report)).arrayBuffer());fs.writeFileSync(path.join(out,'c21-ria-review.cairn-config.zip'),archive);fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify({taskId:'c21-repair-20261124',base:{revision:161,contractRevision:20,sha256:createHash('sha256').update(bytes).digest('hex')},candidate:{contractRevision:21,revision:candidate.revision,sha256:createHash('sha256').update(fs.readFileSync(path.join(out,'candidate.config.json'))).digest('hex'),archiveSha256:createHash('sha256').update(archive).digest('hex'),nodes:candidate.nodes.length,workflows:candidate.workflows.length,buildingLeaves:38},publicationPerformed:false},null,2)+'\n');console.log('c21 RIA candidate validated and generated:',out);
