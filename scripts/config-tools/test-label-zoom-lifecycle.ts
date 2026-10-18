import assert from 'node:assert/strict';
import fs from 'node:fs';
import {prepareConfigForActivation} from '../../src/configStudio/configActivation';
import {resolveGeometryProfile} from '../../src/configStudio/runtime';
import {resolveConfigRuntimeRule} from '../../src/components/Rules/configRuntime/configPackageAdapter';
import {buildFeatureMeta,findFirstRule,type FeatureRecord,type RenderRule,type RenderContext} from '../../src/components/Rules/rendering/renderRules';
import {FeatureStore} from '../../src/components/Rules/data/featureStore';
import {resolveFeatureDisplayPlan,shouldRenderByDisplayPlan} from '../../src/components/Rules/rendering/display/displayRuleResolver';

const config=prepareConfigForActivation(JSON.parse(fs.readFileSync('src/configStudio/defaults/r11-r7.config.json','utf8')));
const rows:Array<{path:string;variant:number;v1:number[];v3:number[];disabledTransitions:Array<[number,number]>}>=[];
const differences:Array<{path:string;variant:number;zoom:number;v1:boolean;v3:boolean}>=[];
const variants=[{direction:'3',Level:0,Connect:false},{direction:'0',Level:1,Connect:true},{direction:'1',Level:2,Connect:false},{direction:'3',Level:3,Connect:true},{direction:'3',Level:4,Connect:false},{direction:'3',Level:5,Connect:true},{direction:'3',Level:6,Connect:false}];
function labelEnabled(rule:RenderRule|null,record:FeatureRecord,ctx:RenderContext,store:FeatureStore):boolean {
 if(!rule||rule.zoom&&(ctx.zoomLevel<rule.zoom[0]||ctx.zoomLevel>rule.zoom[1])||rule.visible&&!rule.visible(record,ctx,store))return false;
 if(!shouldRenderByDisplayPlan(resolveFeatureDisplayPlan(record,rule,ctx,store),ctx))return false;
 const label=typeof rule.symbol?.label==='function'?rule.symbol.label(record,ctx,store):rule.symbol?.label;
 if(!label?.enabled||label.minLevel!==undefined&&ctx.zoomLevel<label.minLevel)return false;
 const text=typeof label.textFrom==='function'?label.textFrom(record,ctx,store):label.textFrom?record.featureInfo[label.textFrom]:record.featureInfo.Name;
 return Boolean(String(text??'').trim());
}
let probes=0;
for(const node of config.nodes)for(const geometry of ['Point','LineString','Polygon'] as const){
 if(!resolveGeometryProfile(config,node.path,geometry)?.enabled)continue;
 for(const [variant,extra] of variants.entries()){
  const Class=node.path.class,Type=geometry==='Point'?'Points':geometry==='LineString'?'Polyline':'Polygon';
  const featureInfo={World:'zth',ID:'zoom-lifecycle',Class,Type,Kind:node.path.kind,SKind:node.path.skind,SKind2:node.path.skind2,Name:'Zoom fixture',bureau:'T',line:'1',color:'#ff0000',...extra};
  const record:FeatureRecord={uid:'zoom-lifecycle',type:Type,featureInfo,meta:buildFeatureMeta(featureInfo,Class,Type),p3:{x:0,y:-64,z:0},coords3:[{x:-1600,y:-64,z:-400},{x:1600,y:-64,z:-400},{x:1600,y:-64,z:400},{x:-1600,y:-64,z:400}]};
  const store=new FeatureStore([record]),v1:number[]=[],v3:number[]=[];
  for(let zoom=0;zoom<=8;zoom++){
   const ctx:RenderContext={worldId:'zth',zoomLevel:zoom,leafletZoom:zoom-3,inFloorView:false,activeBuildingUid:null,activeFloorSelector:null,activeBuildingFloorRefSet:null};
   const before=labelEnabled(findFirstRule(record),record,ctx,store),after=labelEnabled(resolveConfigRuntimeRule(config,record,ctx,null,store),record,ctx,store);
   if(before)v1.push(zoom);if(after)v3.push(zoom);
   if(before!==after&&!(Class==='RLE'&&extra.direction==='3'&&zoom>=2&&zoom<=4))differences.push({path:JSON.stringify(node.path),variant,zoom,v1:before,v3:after});
   probes++;
  }
  const disabledTransitions:Array<[number,number]>=[];for(let zoom=1;zoom<=8;zoom++)if(v3.includes(zoom)&&!v3.includes(zoom-1))disabledTransitions.push([zoom,zoom-1]);
  rows.push({path:JSON.stringify(node.path),variant,v1,v3,disabledTransitions});
 }
}
if(process.env.CAIRNMAP_LIFECYCLE_OUT){fs.mkdirSync(process.env.CAIRNMAP_LIFECYCLE_OUT,{recursive:true});fs.writeFileSync(process.env.CAIRNMAP_LIFECYCLE_OUT+'/configuration-audit.json',JSON.stringify({probes,classifications:config.nodes.length,differences,rows},null,2)+'\n');}
assert.equal(differences.length,0,JSON.stringify(differences.slice(0,30)));
const rail=rows.filter(row=>JSON.parse(row.path).class==='RLE');assert(rail.length);assert(rail.every(row=>!row.v3.includes(0)&&!row.v3.includes(1)));
console.log(`label-zoom-lifecycle: ${probes} V1/V3 label eligibility probes across all 95 classifications; only approved RLE Zoom2–4 additions differ; ${rows.filter(row=>row.disabledTransitions.length).length} cases require label removal while zooming out`);
