export type WorkflowCatalogGeom='点'|'线'|'面';
import {applicationWorldCodeMap,subscribeApplication} from '@/core/project/applicationRuntime';
import {stringifyFeatureJsonArray} from './featureJsonSerializer';
export type FeatureKey=string;
export type DrawMode='point'|'polyline'|'polygon';
export type BuildOp='create'|'edit'|'import';
export type ImportFormat='点'|'线'|'面'|'批量'|string;
export type Coord2D={x:number;z:number;y?:number};
export type TagPrimitive=string|number|boolean|null;
export type TagRegistryEntry={key:string;label:string;type:'text'|'number'|'bool'|'select';options?:Array<{label:string;value:string}>};
export const TAG_KEY_OTHER='__other__';
export const EXT_VALUE_TYPE_TEXT='text' as const,EXT_VALUE_TYPE_NUMBER='number' as const,EXT_VALUE_TYPE_BOOL='bool' as const,EXT_VALUE_TYPE_NULL='null' as const;
export type ExtValueType='text'|'number'|'bool'|'null';
export const EXT_VALUE_TYPE_OPTIONS:Array<{label:string;value:ExtValueType}>=[{label:'文本',value:'text'},{label:'数字',value:'number'},{label:'布尔',value:'bool'},{label:'空(null)',value:'null'}];
export type FieldType='text'|'number'|'bool'|'select';
export type FieldDef={key:string;label:string;type:FieldType;optional?:boolean;placeholder?:string;options?:Array<{label:string;value:any}>;defaultValue?:unknown};
export type GroupDef={key:string;label:string;addButtonText?:string;optional?:boolean;minItems?:number;fields:FieldDef[]};
export let WORLD_CODE_BY_WORLD_ID=applicationWorldCodeMap();
subscribeApplication(()=>{WORLD_CODE_BY_WORLD_ID=applicationWorldCodeMap();});
export const layerToJsonText=(layer:{jsonInfo?:{featureInfo:unknown}})=>layer.jsonInfo?.featureInfo?stringifyFeatureJsonArray([layer.jsonInfo.featureInfo]):'';
export const parseCoordListFlexible = (raw: string): Coord2D[] | null => {
  const text = raw.trim();
  if (!text) return null;
  const parts = text.split(';').map((s) => s.trim()).filter(Boolean);
  if (!parts.length) return null;

  const out: Coord2D[] = [];
  for (const p of parts) {
    const nums = p.split(',').map((s) => s.trim()).filter(Boolean);
    if (nums.length !== 2 && nums.length !== 3) return null;
    const x = Number(nums[0]);
    const z = nums.length === 2 ? Number(nums[1]) : Number(nums[2]);
    if (!Number.isFinite(x) || !Number.isFinite(z)) return null;
    if (nums.length === 3) {
      const y = Number(nums[1]);
      if (!Number.isFinite(y)) return null;
      out.push({ x, z, y });
    } else {
      out.push({ x, z });
    }
  }
  return out;
};

