import {standardTagFields} from '@/configStudio/standardTagFields';
import {projectRegistryScene,type ProjectedRegistryScene,type ProjectedRegistryField} from '@/components/Common/formProjection';
import type {ConfigPackageV3,ClassificationPath,ExternalRole,WorkflowDefinition} from '@/configStudio/types';
import {resolveEffectiveFields} from '@/configStudio/runtime';
import {effectiveOptions} from '@/configStudio/lookupTables';
import {SCHEMA_TRP_TRADE} from './trade/registration';
import {SCHEMA_RAIL_LINE,SCHEMA_RAIL_STATION,SCHEMA_RAIL_PLATFORM,SCHEMA_RAIL_PLATFORM_BOUNDARY,SCHEMA_RAIL_STATION_BUILDING,SCHEMA_RAIL_STATION_BUILDING_POINT,SCHEMA_RAIL_STATION_BUILDING_FLOOR} from './rail/registration';
const schemas={railLine:SCHEMA_RAIL_LINE,stationArea:SCHEMA_RAIL_STATION,platform:SCHEMA_RAIL_PLATFORM,platformFootprint:SCHEMA_RAIL_PLATFORM_BOUNDARY,stationBuilding:SCHEMA_RAIL_STATION_BUILDING,stationBuildingPoint:SCHEMA_RAIL_STATION_BUILDING_POINT,stationFloor:SCHEMA_RAIL_STATION_BUILDING_FLOOR,tradePoint:SCHEMA_TRP_TRADE};
export function specializedFormView(config:ConfigPackageV3,_workflow:WorkflowDefinition,path:ClassificationPath,role:ExternalRole,scene:'editor'|'workflow'='editor'):ProjectedRegistryScene{
 const view=projectRegistryScene(schemas[role],scene),fields=[...resolveEffectiveFields(config,path).filter(field=>!field.key.startsWith('tags.')),...standardTagFields(config,path)];
 const active:ProjectedRegistryField[]=view.fields.flatMap(field=>{
  const definition=fields.find(candidate=>candidate.key===field.path);
  if(!definition)return [];
  return [{...field,label:definition.labels.zh||definition.labels.en||field.label,required:definition.required,defaultValue:definition.defaultValue,...(definition.placeholder?{placeholder:definition.placeholder}:{}),...(definition.type==='enum'?{control:'select' as const,options:effectiveOptions(config,definition).map(option=>({label:option.label.zh||option.label.en,value:option.value}))}:{})}];
 });
 for(const definition of fields)if(!definition.key.startsWith('tags.')&&!definition.key.startsWith('extensions.')&&!active.some(field=>field.path===definition.key)&&definition.scenes?.editor!==false){
  active.push({key:definition.key,path:definition.key,label:definition.labels.zh||definition.labels.en||definition.key,required:definition.required,defaultValue:definition.defaultValue,control:definition.type==='boolean'?'bool':definition.type==='number'?'number':definition.type==='enum'?'select':definition.type==='json'?'json':'text',order:1000+active.length,...(definition.type==='enum'?{options:effectiveOptions(config,definition).map(option=>({label:option.label.zh||option.label.en,value:option.value}))}:{})});
 }
 const groups=view.groups.flatMap(group=>{const definition=fields.find(field=>field.key===group.path);return definition?[{...group,label:definition.labels.zh||definition.labels.en||group.label,optional:!definition.required}]:[];});
 return {...view,classification:undefined,fields:active.filter(field=>!groups.some(group=>group.path===field.path)),groups};
}
