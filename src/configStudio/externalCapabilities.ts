import type {ExternalRole,GeometryKind} from './types';

/** Algorithm invariants only. Never add classification paths or field UI defaults. */
export const EXTERNAL_ROLES: Record<ExternalRole,{label:string;geometry:GeometryKind;fields:Record<string,readonly string[]>}> = {
 railLine:{label:'线路',geometry:'LineString',fields:{Name:['string'],bureau:['string'],line:['string'],color:['string'],direction:['number','enum'],startplf:['string','reference'],endplf:['string','reference']}},
 stationArea:{label:'站场',geometry:'Point',fields:{Name:['string'],STBuilding:['string','reference'],platforms:['json']}},
 platform:{label:'站台',geometry:'Point',fields:{Name:['string'],Situation:['boolean'],Connect:['boolean'],lines:['json']}},
 platformFootprint:{label:'站台轮廓',geometry:'Polygon',fields:{Name:['string'],LineID:['string','reference']}},
 stationBuilding:{label:'车站建筑',geometry:'Polygon',fields:{Name:['string'],Floors:['json']}},
 stationBuildingPoint:{label:'车站建筑点',geometry:'Point',fields:{Name:['string'],Floors:['json'],stations:['json']}},
 stationFloor:{label:'车站楼层',geometry:'Polygon',fields:{Name:['string'],NofFloor:['string'],staBuildingID:['string','reference']}},
 tradePoint:{label:'交易点',geometry:'Point',fields:{Name:['string'],Trade:['json']}},
};
export const EXTERNAL_COMPONENT_ROLES: Record<string,readonly ExternalRole[]> = {
 railwayWorkflow:['railLine'],
 stationWorkflow:['stationArea','platform','platformFootprint','stationBuilding','stationBuildingPoint','stationFloor'],
 tradePointWorkflow:['tradePoint'],tradePointEditor:['tradePoint'],
};
/** Bridge tokens are business roles, never a lookup of a feature's Class. */
export const RAIL_ROLE_KEYS = {RLE:'railLine',STA:'stationArea',PLF:'platform',PFB:'platformFootprint',STB:'stationBuilding',SBP:'stationBuildingPoint',STF:'stationFloor'} as const;
