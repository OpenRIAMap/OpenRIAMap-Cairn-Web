import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import JSZip from 'jszip';
import {prepareConfigForActivation} from '../../src/configStudio/configActivation';
import {validateConfigPackage,resolveGeometryProfile} from '../../src/configStudio/runtime';
import {resolveConfigRuntimeRule} from '../../src/components/Rules/configRuntime/configPackageAdapter';
import {FeatureStore} from '../../src/components/Rules/data/featureStore';
import {evaluateV3WorkflowOutputs} from '../../src/configStudio/V3WorkflowRunner';
import {readConfigPackage} from '../../src/configStudio/package';
import {stableConfigText} from '../../src/configStudio/defaultConfigProvider';
import {buildV3CardSections} from '../../src/configStudio/V3CardRenderer';
const sha=(value:string|Uint8Array)=>createHash('sha256').update(value).digest('hex'),out='docs/90_roadmap-and-history/runtime-v32-downstream-mainupdate-20261014',manifest=JSON.parse(fs.readFileSync('src/configStudio/defaults/manifest-r10-r6.json','utf8'));
const bytes=fs.readFileSync('src/configStudio/defaults/r10-r6.config.json'),config=JSON.parse(bytes.toString('utf8')),oldBytes=fs.readFileSync('src/configStudio/defaults/r9-r5.config.json'),old=JSON.parse(oldBytes.toString('utf8'));
assert.equal(sha(oldBytes),'999d4afee9e1bfe9daf86639d95e2dae721d6c887cef3771fb1afa0d79df816e');assert.equal(sha(bytes),manifest.sha256);assert.equal(config.contractRevision,10);assert.equal(config.revision,6);assert.equal(config.nodes.length,95);assert.equal(config.workflows.length,28);assert.equal(config.lookupTables.length,2);assert(config.application);const {parity:_,...content}=config;assert.equal(sha(stableConfigText(content)),manifest.semanticFingerprint);assert(validateConfigPackage(config).valid);
const active=prepareConfigForActivation(config),normalize=(plan:unknown)=>JSON.parse(JSON.stringify(plan,(key,value)=>key==='name'||key==='minZoom'||key==='maxZoom'?undefined:value));let plans=0,deviations=0,pillRepairs=0;
for(const node of old.nodes)for(const geometry of ['Point','LineString','Polygon'] as const){if(!resolveGeometryProfile(old,node.path,geometry)?.enabled)continue;
  for(const direction of ['0','1','3'])for(const Connect of [false,true])for(let zoom=0;zoom<=8;zoom++){
    const featureInfo={ID:'comparison',World:'zth',Class:node.path.class,Kind:node.path.kind,SKind:node.path.skind,SKind2:node.path.skind2,Name:'比较',direction,Connect,bureau:'T',line:'1',color:'#ff0000'},record:any={uid:'comparison',featureInfo,type:geometry==='Point'?'Points':geometry==='LineString'?'Polyline':'Polygon',meta:{Class:node.path.class,idValue:'comparison',sig:{},groups:{}},p3:{x:0,y:-64,z:0},coords3:[{x:0,y:-64,z:0},{x:100,y:-64,z:0},{x:100,y:-64,z:100},{x:0,y:-64,z:0}]},ctx:any={worldId:'zth',zoomLevel:zoom,leafletZoom:zoom-3,inFloorView:false,activeBuildingUid:null,activeFloorSelector:null,activeBuildingFloorRefSet:null},store=new FeatureStore([record]);
    const before=resolveConfigRuntimeRule(old,record,ctx,null,store),after=resolveConfigRuntimeRule(active,record,ctx,null,store);
    if(node.path.class==='RLE'&&geometry==='LineString'&&direction==='3'&&zoom>=2&&zoom<=4){assert.equal(after?.symbol?.label?.textFrom?.(record),'T1');assert(after?.symbol?.label?.enabled);assert.deepEqual(after?.symbol?.pathStyle,before?.symbol?.pathStyle);deviations++;}
    else {assert.equal(after?.symbol?.label?.textFrom?.(record),before?.symbol?.label?.textFrom?.(record));const normalizedAfter=normalize(after),normalizedBefore=normalize(before);if(node.path.class==='RLE'&&direction==='3'&&zoom>=5){assert.equal(normalizedAfter.display.anchor.lineTextRepositionStrictSvg,false);assert.equal(normalizedBefore.display.anchor.lineTextRepositionStrictSvg,true);normalizedAfter.display.anchor.lineTextRepositionStrictSvg=true;pillRepairs++;}assert.deepEqual(normalizedAfter,normalizedBefore,`${node.nodeId}/${geometry}/${direction}/${Connect}/${zoom}`);}plans++;
  }
}
const fixtures=JSON.parse(fs.readFileSync('scripts/config-tools/fixtures/v1-workflow-output-parity.json','utf8')).cases;
for(const fixture of fixtures){const workflow=config.workflows.find((row:any)=>row.id===`v3-${fixture.schemaKey}`),output=workflow.outputs[0],slots:Record<string,unknown>={actor:'fixture-user'};
  for(const control of workflow.steps.flatMap((step:any)=>step.controls??[]))if(control.slot){const key=control.id.slice(fixture.schemaKey.length+1,-control.slot.length-1);if(key in fixture.inputs)slots[control.slot]=fixture.inputs[key];}
  const data=fixture.geometry==='Point'?fixture.expectedRecord.CoordP:fixture.geometry==='LineString'?fixture.expectedRecord.CoordL[0]:fixture.expectedRecord.CoordG[0][0];
  assert.deepEqual(evaluateV3WorkflowOutputs(workflow,slots,{world:'zth',config,classifications:{[output.id]:fixture.classification},coordinates:{[output.id]:data.map(([x,y,z]:number[])=>({x,y,z}))},now:new Date('2026-10-07T00:00:00Z')})[0].record,fixture.expectedRecord,fixture.schemaKey);
}
const english=structuredClone(config);english.application.preferences.language='en';const node=english.nodes.find((node:any)=>node.path.class==='WRP'&&!node.path.kind);node.card={mode:'fields',items:[{id:'empty-en',source:'Name',renderer:'text',visible:true,label:{zh:'中文名称',en:''}}]};assert.equal(buildV3CardSections(english,{featureInfo:{Class:'WRP',Name:'Value'},meta:{Class:'WRP'}} as any)?.mainRows[0].label,'');
const delivery=JSON.parse(fs.readFileSync(out+'/delivery-manifest.json','utf8')),zipBytes=fs.readFileSync(out+'/OpenRIAMap_V32_Downstream_MainUpdate_r6.zip');assert.equal(sha(zipBytes),delivery.zipSha256);assert.deepEqual(await readConfigPackage(new File([zipBytes],'r10.zip')),config);const zip=await JSZip.loadAsync(zipBytes);assert(zip.file('reports/application-dependencies.json'));assert.equal(JSON.parse(await zip.file('reports/application-dependencies.json')!.async('text')).authProvider,'github-cookie');
console.log(`r10-final-package: ${plans} actual render plans (${deviations} approved RLE additions and ${pillRepairs} SVG-only capsule repairs), ${fixtures.length} complete V1 records, English empty labels, new default/delivery SHA/ZIP/dependencies, frozen r9 retained passed`);
