import type {ClassificationPath,ConfigPackageV3} from './types';
import {classificationPathKey} from './runtime';
export function classificationDisplayName(config:ConfigPackageV3|undefined,path:ClassificationPath,language:'zh'|'en'=config?.application?.preferences.language??'zh'):string{
 const level=(['skind2','skind','kind','class'] as const).find(level=>path[level]),code=level?path[level]??'':'';
 const node=config?.nodes.find(node=>classificationPathKey(node.path)===classificationPathKey(path)),labels=level?node?.classificationLabels?.[level]:undefined;
 return labels?.[language]||labels?.zh||labels?.en||code;
}
