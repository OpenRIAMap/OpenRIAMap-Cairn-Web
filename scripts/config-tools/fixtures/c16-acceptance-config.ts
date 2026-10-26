import {editableGeometryProfile} from '../../../src/configStudio/renderRuleTemplates';
import {migratePackageToC16} from '../../../src/configStudio/contractMigration';
import type {ConfigPackageV3,GeometryKind,WorkflowDefinition} from '../../../src/configStudio/types';
/** Test-only taxonomy absent from every historical catalog. */
export function c16AcceptanceConfig(base:ConfigPackageV3){
 const config=migratePackageToC16(base).config;
 const root={class:'C16TEST'},parent={...root,kind:'PARENT'};
 config.nodes.push({nodeId:'test-root',path:root,children:['test-parent'],fields:[],geometryProfiles:{}},{nodeId:'test-parent',path:parent,children:['test-point','test-line','test-area'],fields:[],geometryProfiles:{}});
 for(const [key,geometry]of [['POINT','Point',{class:'RIL',kind:'PLF'}],['LINE','LineString',{class:'RIL',kind:'RLE'}],['AREA','Polygon',{class:'RIL',kind:'PFB'}]] as const){
  const path={...parent,skind:key,skind2:'LEAF'},group={...parent,skind:key},profile=editableGeometryProfile(geometry,16);
  config.nodes.push({nodeId:'test-'+key.toLowerCase(),path:group,children:['test-'+key+'-leaf'],fields:[],geometryProfiles:{}},{nodeId:'test-'+key+'-leaf',path,geometryType:geometry,children:[],classificationLabels:{skind2:{zh:'自定义末端',en:'Custom terminal'}},fields:[{fieldId:'test-'+key+'-name',key:'Name',type:'string',input:'text',cardinality:'single',labels:{zh:'测试名称',en:'Test name'},description:{zh:'',en:''},required:true},{fieldId:'test-'+key+'-count',key:'Count',type:'number',input:'text',cardinality:'single',labels:{zh:'测试数量',en:''},description:{zh:'',en:''}}],geometryProfiles:{[geometry]:profile}});
  const workflow:WorkflowDefinition={id:'c16-test-'+key,label:{zh:'c16 '+key+' 编辑',en:''},mode:'composed',quickMapping:false,editor:{enabled:true,dedicated:true,scope:path},steps:[{id:'actor',kind:'actor',label:{zh:'填写人',en:''}},{id:'form',kind:'form',label:{zh:'测试信息',en:''},controls:[{id:'name',slot:'F1',kind:'text',columns:1,label:{zh:'测试名称',en:''},required:true},{id:'count',slot:'F2',kind:'number',columns:1,label:{zh:'测试数量',en:''},defaultValue:0},{id:'annotations',kind:'tagsExtensions',columns:1,label:{zh:'标签与扩展',en:''},systemManaged:true,tagsExtensions:{tagsEnabled:true,extensionsEnabled:true}}]},{id:'geometry',kind:'geometry',label:{zh:'测试绘制',en:''},geometry:[geometry],outputId:'main',drawing:{enabledFromThisPage:true,keepDrawingWhenBack:true,allowBack:true,multiple:geometry==='Polygon'}}],outputs:[{id:'main',classificationGroup:{selectors:[{id:'self',mode:'self',path}]},geometry:{selected:geometry as GeometryKind},assignments:[{id:'id',target:'ID',expression:'"collected-id"'},{id:'name',target:'Name',expression:'F1'},{id:'count',target:'Count',expression:'F2'}]}]};
  config.workflows.push(workflow);
 }
 return config;
}
