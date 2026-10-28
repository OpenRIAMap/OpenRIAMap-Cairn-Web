import type {ClassificationPath,ConfigPackageV3} from '@/configStudio/types';
import {classificationDisplayName} from '@/configStudio/classificationPresentation';
import {recordCategory} from '@/configStudio/multipartPolicy';

/** Presentation only: never use a localized caption as a classification key. */
export function layerClassificationCaption(config:ConfigPackageV3|undefined,record:Record<string,unknown>|undefined,fallback:string):string {
  if(!record?.Class)return fallback;
  const path=recordCategory(record),prefix:ClassificationPath={class:''};
  return (['class','kind','skind','skind2'] as const).flatMap(level=>{
    const code=path[level];if(!code)return [];
    prefix[level]=code;
    const name=classificationDisplayName(config,prefix);
    return [name&&name!==code?`${code}（${name}）`:code];
  }).join(' / ');
}
