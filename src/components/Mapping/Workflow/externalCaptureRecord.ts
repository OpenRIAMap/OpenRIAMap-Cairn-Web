import {categoryAllowsParts,recordCategory} from '@/configStudio/multipartPolicy';
import {resolveGeometryProfile} from '@/configStudio/runtime';
import {omitOptionalFieldValues} from '@/configStudio/optionalFieldValues';
import {validateMultipartGeometry,withCanonicalMultipartGeometry,type MultipartGeometry} from '@/core/geometry/multipartGeometry';
import type {ClassificationPath,ConfigPackageV3} from '@/configStudio/types';
export function prepareExternalCaptureRecord(raw:Record<string,unknown>,geometry:MultipartGeometry,config?:ConfigPackageV3,path?:ClassificationPath):Record<string,unknown>{
 const error=validateMultipartGeometry(geometry);if(error)throw Error(error);
 const record={...raw};
 if(path){
  if(!config||!resolveGeometryProfile(config,path,geometry.type)?.enabled)throw Error('受控输出分类未启用当前几何类型。');
  if(geometry.parts.length>1&&!categoryAllowsParts(config,path,geometry.type))throw Error('当前分类禁止多部件；请修改完整几何，不能自动截断。');
  for(const key of ['Class','Kind','SKind','Skind','SKind2','Skind2'])delete record[key];
  Object.assign(record,{Class:path.class,...(path.kind?{Kind:path.kind}:{}),...(path.skind?{SKind:path.skind}:{}),...(path.skind2?{SKind2:path.skind2}:{})});
 }
 return withCanonicalMultipartGeometry(config?omitOptionalFieldValues(config,recordCategory(record),record):record,geometry);
}
