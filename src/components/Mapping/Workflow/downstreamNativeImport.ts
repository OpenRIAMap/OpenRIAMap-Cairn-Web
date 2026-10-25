import type {ConfigPackageV3} from '@/configStudio/types';
import {prepareNativeFeatureImport} from '@/configStudio/nativeFeatureImport';
import {normalizeV3WorldId} from '@/configStudio/workflowKernel';
import {recordClassification} from '@/configStudio/workflowEditing';
import {omitOptionalFieldValues} from '@/configStudio/optionalFieldValues';
import {annotationEqual,assembleAnnotations} from '@/configStudio/workflowAnnotations';
import {resolveGeometryProfile} from '@/configStudio/runtime';
import {readableClassification} from '@/configRuntime/classificationCompatibility';
import {isExactClassificationMigrationAlias} from '@/configRuntime/classificationReadScopes';
import {geometryTypeFromFeatureType,readMultipartGeometry,validateMultipartGeometry,withCanonicalMultipartGeometry} from '@/core/geometry/multipartGeometry';

/** Preserve V1 map-to-layer import of an unchanged published record.
 * Historical records can carry obsolete subtype codes or omit a now-required
 * relation. This narrow bridge never grants that compatibility to a new or
 * edited record, and creation/edit-save validation remains unchanged.
 */
export function prepareDownstreamNativeImport(config:ConfigPackageV3,item:Record<string,unknown>,world:string,published:Record<string,unknown>[]) {
 try {
  const prepared=prepareNativeFeatureImport(config,item,world);
  // An exact, published classification-only replacement is a migration, not
  // an ordinary field edit. Keep historical raw values after strict target
  // validation; never grant this to new IDs, other worlds or changed content.
  const classificationKeys=new Set(['Class','Kind','SKind','Skind','SKind2','Skind2']);
  const content=(record:Record<string,unknown>)=>Object.fromEntries(Object.entries(record).filter(([key])=>!classificationKeys.has(key)));
  const original=published.find(record=>String(record.ID??'')===String(item.ID??'')&&annotationEqual(content(record),content(item)));
  if(original){const raw=recordClassification(original),from=readableClassification(config,raw)??raw;if(isExactClassificationMigrationAlias(config,from,recordClassification(item)))return {...prepared,record:structuredClone(item)};}
  return prepared;
 } catch(error) {
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
