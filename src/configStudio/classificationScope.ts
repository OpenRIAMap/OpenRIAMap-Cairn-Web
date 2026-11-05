import type {ClassificationPath, ConfigPackageV3} from './types';

export type ClassificationScopeRow = {id: string; condition: 'include' | 'exclude'; path: ClassificationPath};
export type ClassificationScope = {rows: ClassificationScopeRow[]};
/** Arrays are retained solely for reading c17 and earlier documents. */
export type ClassificationRange = ClassificationPath[] | ClassificationScope;
const levels = ['class', 'kind', 'skind', 'skind2'] as const;
export function classificationContains(parent: ClassificationPath, child: ClassificationPath): boolean {
  return levels.every(level => !parent[level] || parent[level] === child[level]);
}
export function scopeRows(value: ClassificationRange): ClassificationScopeRow[] {
  return Array.isArray(value) ? value.map((path, index) => ({id: `scope-${index}`, condition: 'include', path})) : value.rows;
}
export function matchesClassificationRange(value: ClassificationRange, path: ClassificationPath): boolean {
  const rows = scopeRows(value);
  return rows.some(row => row.condition === 'include' && classificationContains(row.path, path)) && !rows.some(row => row.condition === 'exclude' && classificationContains(row.path, path));
}
const cache = new WeakMap<ConfigPackageV3, WeakMap<object, ClassificationPath[]>>();
export function resolveClassificationScope(config: ConfigPackageV3, scope: ClassificationRange): ClassificationPath[] {
  const prior = Object.isFrozen(config) ? cache.get(config)?.get(scope) : undefined;
  if (prior) return prior;
  const result = config.nodes.filter(node => matchesClassificationRange(scope, node.path)).map(node => node.path);
  if (Object.isFrozen(config)) {let scopes=cache.get(config);if(!scopes){scopes=new WeakMap();cache.set(config,scopes);}scopes.set(scope,result);}
  return result;
}
export function classificationScopeProblems(scope: ClassificationRange, config?: ConfigPackageV3): string[] {
  const rows=scopeRows(scope), problems:string[]=[];
  if(rows.length&&!rows.some(row=>row.condition==='include'))problems.push('作用范围至少需要一个 + 条件。');
  if(new Set(rows.map(row=>row.id)).size!==rows.length)problems.push('范围行标识重复。');
  for(const row of rows){
    if(!['include','exclude'].includes(row.condition)||!row.path.class||levels.some((key,index)=>row.path[key]&&levels.slice(0,index).some(parent=>!row.path[parent])))problems.push('范围条件或分类路径无效。');
    else if(config&&!config.nodes.some(node=>levels.every(key=>(node.path[key]??'')===(row.path[key]??''))))problems.push('分类路径不存在：'+levels.map(key=>row.path[key]).filter(Boolean).join('/'));
  }
  return problems;
}
export function toSignedScope(value: ClassificationRange): ClassificationScope {return {rows: structuredClone(scopeRows(value))};}
