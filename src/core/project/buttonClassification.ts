import type { CairnMapRuleButtonCriteria } from './environmentTypes';
import type { ApplicationButtons } from './applicationTypes';
export type ButtonClassificationPath={class:string;kind?:string;skind?:string;skind2?:string};
const levels=['class','kind','skind','skind2'] as const;
export function classificationContains(scope:ButtonClassificationPath,path:ButtonClassificationPath):boolean{return levels.every(key=>!scope[key]||scope[key]===path[key]);}
export function matchesButtonClassification(path:ButtonClassificationPath,criteria:CairnMapRuleButtonCriteria):boolean {
  if(criteria.paths)return criteria.paths.some(scope=>classificationContains(scope,path));
  return (!criteria.classCode?.length||criteria.classCode.includes(path.class))&&(!criteria.kind?.length||criteria.kind.includes(path.kind??''))&&(!criteria.skind?.length||criteria.skind.includes(path.skind??''))&&(!criteria.skind2?.length||criteria.skind2.includes(path.skind2??''));
}
export function migrateButtonClassification(buttons:ApplicationButtons,paths:ButtonClassificationPath[],published:ButtonClassificationPath[]=[]):{buttons:ApplicationButtons;changes:string[]}{
  const changes:string[]=[];
  const items=buttons.items.map(button=>{
    if(button.criteria.paths)return structuredClone(button);
    const old=button.criteria,deepest=old.skind2?.length?4:old.skind?.length?3:old.kind?.length?2:1;
    const rows=paths.filter(path=>Object.values(path).filter(Boolean).length===deepest&&matchesButtonClassification(path,old)).map(path=>structuredClone(path));
    const unique=rows.filter((path,index)=>rows.findIndex(other=>JSON.stringify(other)===JSON.stringify(path))===index);
    if(!unique.length)throw Error(`按钮 ${button.id} 的旧条件没有可用分类路径，必须先修复分类。`);
    const criteria={paths:unique};
    for(const record of published)if(matchesButtonClassification(record,old)!==matchesButtonClassification(record,criteria))throw Error(`按钮 ${button.id} 在已发布分类 ${Object.values(record).join('/')} 上迁移不等价；未丢弃旧条件。`);
    if(!old.classCode?.length)changes.push(`${button.id}：未限定 Class 已按当前分类树展开为 ${unique.map(path=>Object.values(path).join('/')).join('、')}；未来新增 Class 必须明确加入。`);
    return {...button,criteria};
  });return {buttons:{...buttons,items},changes};
}
