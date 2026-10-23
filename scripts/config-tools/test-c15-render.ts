import assert from 'node:assert/strict';
import {readC14MigrationSource} from './fixtures/c14-migration-source';
import {migratePackageToC15} from '../../src/configStudio/contractMigration';
import {resolveConfigRuntimeRule} from '../../src/components/Rules/configRuntime/configPackageAdapter';
import {editableGeometryProfile,prepareRenderRule} from '../../src/configStudio/renderRuleTemplates';
import {pointSymbolMetrics} from '../../src/components/Rules/rendering/pointSymbolMetrics';
import {workflowRowIdentities,restoreWorkflowRows,workflowItemKey,keepWorkflowItemKey} from '../../src/configStudio/WorkflowFold';
import {canonicalizeWorkflow} from '../../src/configStudio/V3WorkflowEditor';
import {validateNativeStructure} from '../../src/configStudio/nativeContractValidation';
const config=migratePackageToC15(readC14MigrationSource().config).config;
const record=(code:string,type='Polyline'):any=>({uid:'c15-'+code,type,featureInfo:{ID:'c15-'+code,Class:code,World:'zth',Name:'Test'},coords3:[{x:0,y:-64,z:0},{x:200,y:-64,z:100}],p3:{x:0,y:-64,z:0},meta:{Class:code,idValue:'c15-'+code,sig:{},groups:{}}});
const context=(zoom:number):any=>({worldId:'zth',zoomLevel:zoom,leafletZoom:zoom-3,inFloorView:false,activeBuildingUid:null,activeFloorSelector:null,activeBuildingFloorRefSet:null});
const rod=config.nodes.find(node=>node.path.class==='ROD'&&!node.path.kind)!,profile=rod.geometryProfiles.LineString!;
const base=structuredClone(profile.zoomPriority.rules.find(rule=>rule.representation==='geometry')!);
profile.zoomPriority.rules=[{...base,id:'bbox-low',when:{zoom:{min:0,max:4}},multipartAnchor:'featureBbox',interaction:{triggers:{line:false,label:false}}},{...structuredClone(base),id:'parts-high',when:{zoom:{min:5,max:8}},multipartAnchor:'perPart',interaction:{triggers:{line:true,label:false}}}];
const low:any=resolveConfigRuntimeRule(config,record('ROD'),context(3),null),high:any=resolveConfigRuntimeRule(config,record('ROD'),context(6),null);
assert.equal(low.display.anchor.multipartMode,'featureBbox');assert.equal(high.display.anchor.multipartMode,'perPart');assert.equal(low.symbol.labelClick.enabled,false);assert.equal(high.symbol.labelClick.geom.path,true);assert.equal(high.symbol.labelClick.labelEnabled,false);
const partial=structuredClone(config),partialProfile=partial.nodes.find(node=>node.nodeId===rod.nodeId)!.geometryProfiles.LineString!;partialProfile.zoomPriority.rules[1].style!.halo={enabled:true,widthPx:2.5,color:{mode:'fixed',color:'#ffffff'}};partialProfile.zoomPriority.rules[1].conditionalOverrides=[{id:'partial',when:[],style:{strokeOpacity:.5}}];
const merged:any=resolveConfigRuntimeRule(partial,record('ROD'),context(6),null);assert.equal(merged.symbol.pathStyle.halo.widthPx,2.5);assert.equal(merged.symbol.pathStyle.opacity,.5);assert.equal(merged.display.anchor.multipartMode,'perPart');
for(const [boundary,interior,label]of [[true,false,false],[false,true,false],[false,false,true],[false,false,false]]){
 const copy=structuredClone(config),node=copy.nodes.find(node=>node.path.class==='BUD'&&!node.path.kind)!,profile=node.geometryProfiles.Polygon!,rule=structuredClone(profile.zoomPriority.rules.find(rule=>rule.representation==='geometry')!);rule.when={zoom:{min:0,max:8}};rule.interaction={triggers:{boundary,interior,label}};profile.zoomPriority.rules=[rule];
 const rendered:any=resolveConfigRuntimeRule(copy,record('BUD','Polygon'),context(6),null);assert.equal(rendered.symbol.labelClick.geom.boundary,boundary);assert.equal(rendered.symbol.labelClick.geom.interior,interior);assert.equal(rendered.symbol.labelClick.labelEnabled,label);assert.equal(rendered.symbol.labelClick.geom.path,boundary||interior);
 rule.representation='labelOnly';const labelOnly:any=resolveConfigRuntimeRule({...copy},record('BUD','Polygon'),context(6),null);assert.equal(labelOnly.symbol.labelClick.geom.path,false);assert.equal(labelOnly.symbol.labelClick.enabled,label);
}
for(const radius of [0,.5,1,1.5,8,8.5]){const metrics=pointSymbolMetrics({kind:'shape',shape:'circle',radius,style:{weight:1.5},halo:{widthPx:2.5}});assert.equal(metrics.radius,radius);assert.equal(metrics.visible,radius>0);assert.equal(metrics.extent,radius>0?radius+.75+2.5:0);}
for(const geometry of ['Point','LineString','Polygon'] as const)for(const representation of ['geometry','point','hidden','labelOnly'] as const){const rule=prepareRenderRule({...editableGeometryProfile(geometry,15).zoomPriority.rules[0],representation},geometry,15);assert(rule.multipartAnchor&&rule.interaction);assert.deepEqual(validateNativeStructure({...config,nodes:[{nodeId:'c15-types',path:{class:'C15TYPE'},geometryType:geometry,geometryProfiles:{[geometry]:{...editableGeometryProfile(geometry,15),zoomPriority:{rules:[rule]}}},fields:[],children:[]}],workflows:[]}),[]);}
const blank=canonicalizeWorkflow({id:'c15-blank',label:{zh:'空白',en:''},mode:'composed',steps:[],outputs:[]},config);assert(blank.steps.some(step=>step.controls?.some(control=>control.kind==='tagsExtensions')));assert(blank.outputs.every(output=>output.classificationGroup&&!output.classification));
const workflow=structuredClone(config.workflows.find(flow=>flow.steps.some(step=>step.controls?.some(control=>control.group?.itemFields.length)))!),before=JSON.stringify(workflow),keys=workflowRowIdentities(workflow),restored=restoreWorkflowRows(structuredClone(workflow),keys);assert.deepEqual(workflowRowIdentities(restored),keys);assert.equal(JSON.stringify(workflow),before);const a={},b=keepWorkflowItemKey(a,{});assert.equal(workflowItemKey(a),workflowItemKey(b));
console.log('c15 rendering: per-rule anchors, independent label/line/boundary/interior targets, label-only gating, partial style inheritance, decimal/zero metrics, all representation factories and UI-only fold checkpoint identities: OK');
