import {useState} from 'react';import {createRoot} from 'react-dom/client';
import '../../../src/styles/index.css';
import {migratePackageToContract} from '../../../src/configStudio/contractMigration';
import {resolveConfiguredFeatureCard} from '../../../src/components/Rules/cardrules/featureCardRegistry';
import {buildFeatureMeta,type FeatureRecord} from '../../../src/components/Rules/rendering/renderPrimitives';
import {externalRolePaths,resolveExternalReferenceSource,expandBindingGroup} from '../../../src/configStudio/externalBindings';
import {classificationPathKey} from '../../../src/configStudio/runtime';
import {recordCategory} from '../../../src/configStudio/multipartPolicy';
// This fixture reads the current formal document, not a historical c16 input.
// Keep its migration target current instead of trying to downgrade newer data.
const identity=await fetch('/configuration/current.json').then(r=>r.json()),config=migratePackageToContract(await fetch(identity.configUrl).then(r=>r.json())).config;
const workflow=config.workflows.find(w=>w.external?.componentKey==='tradePointWorkflow')!,path=externalRolePaths(config,workflow,'tradePoint')[0];
const record={World:'zth',ID:'c16-trade-card',Class:path.class,Kind:path.kind,SKind:path.skind,SKind2:path.skind2,Name:'c16 交易点',tags:{Land:'native-land'},Trade:[{TradeNum:0,OfferItems:[{Name:'Stone',Count:0}],ReceiveItems:[{Name:'Emerald',Count:1}]}]};
const feature={uid:record.ID,type:'Points',featureInfo:record,meta:buildFeatureMeta(record,record.Class,'Points')} as FeatureRecord;
const reference=resolveExternalReferenceSource(config,{workflowId:workflow.id,bindingId:'landUnit'}),targetPath=expandBindingGroup(config,reference.classificationGroup)[0],targetRecord={ID:'native-land',Name:'原生地理单元',Class:targetPath.class,Kind:targetPath.kind,SKind:targetPath.skind,SKind2:targetPath.skind2};
const target={uid:'native-land',type:'Polygon',featureInfo:targetRecord,meta:buildFeatureMeta(targetRecord,targetRecord.Class,'Polygon')} as FeatureRecord;
function App(){const [mode,setMode]=useState('trade'),[clicked,setClicked]=useState('');const ordinary={...feature,featureInfo:{ID:'b',Class:'BUD',Kind:'NOM',Name:'原生普通卡片'},meta:buildFeatureMeta({ID:'b',Class:'BUD',Name:'原生普通卡片'},'BUD','Polygon')} as FeatureRecord;
 const current=mode==='trade'?feature:ordinary,{Component,props}=resolveConfiguredFeatureCard(config,current);
 return <main className="p-4"><div className="mb-3 flex gap-2"><button id="trade" onClick={()=>setMode('trade')}>交易卡片</button><button id="native" onClick={()=>setMode('native')}>普通卡片</button></div><div id="card"><Component {...props} open feature={current} variant="embedded" resolveFeatureById={(id,scope)=>id==='native-land'&&scope?.classificationGroup&&expandBindingGroup(config,scope.classificationGroup).some(path=>classificationPathKey(path)===classificationPathKey(recordCategory(targetRecord)))?target:undefined} onTryTriggerLabelClickById={(id,scope)=>setClicked(id+'|'+JSON.stringify(scope?.classificationGroup))}/></div><output id="clicked" className="block break-all text-xs">{clicked}</output></main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
