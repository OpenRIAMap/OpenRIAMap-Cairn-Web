import type {ConfigPackageV3} from '@/configStudio/types';
import {prepareNativeFeatureImport} from '@/configStudio/nativeFeatureImport';
import {normalizeV3WorldId} from '@/configStudio/workflowKernel';
import {recordClassification} from '@/configStudio/workflowEditing';
import {omitOptionalFieldValues} from '@/configStudio/optionalFieldValues';
import {annotationEqual,assembleAnnotations} from '@/configStudio/workflowAnnotations';
import {resolveGeometryProfile} from '@/configStudio/runtime';
import {geometryTypeFromFeatureType,readMultipartGeometry,validateMultipartGeometry,withCanonicalMultipartGeometry} from '@/core/geometry/multipartGeometry';

/** Preserve V1 map-to-layer import of an unchanged published record.
 * Historical records can carry obsolete subtype codes or omit a now-required
 * relation. This narrow bridge never grants that compatibility to a new or
 * edited record, and creation/edit-save validation remains unchanged.
 */
export function prepareDownstreamNativeImport(config:ConfigPackageV3,item:Record<string,unknown>,world:string,published:Record<string,unknown>[]) {
 try {return prepareNativeFeatureImport(config,item,world);} catch(error) {
  const original=published.find(record=>String(record.ID??'')===String(item.ID??'')&&annotationEqual(record,item));
  const type=geometryTypeFromFeatureType(item.Type),classCode=String(item.Class??'');
  if(!original||!String(item.ID??'').trim()||!type||!config.nodes.some(node=>node.path.class===classCode&&!node.path.kind)||!resolveGeometryProfile(config,{class:classCode},type)?.enabled||normalizeV3WorldId(String(item.World??''))!==normalizeV3WorldId(world))throw error;
  const read=readMultipartGeometry(item,type),geometryError=read.error??validateMultipartGeometry(read.geometry);
  if(geometryError||!read.geometry)throw Error(geometryError??'缺少几何。');
  assembleAnnotations({advanced:{...(item.tags!==undefined?{tags:item.tags}:{}),...(item.extensions!==undefined?{extensions:item.extensions}:{})}});
  const geometry=read.geometry,coords=geometry.type==='Point'?geometry.parts:geometry.type==='LineString'?geometry.parts[0]:geometry.parts[0][0];
  return {record:withCanonicalMultipartGeometry(omitOptionalFieldValues(config,recordClassification(item),item),geometry),geometry,coords,mode:type==='Point'?'point' as const:type==='LineString'?'polyline' as const:'polygon' as const};
 }
}
