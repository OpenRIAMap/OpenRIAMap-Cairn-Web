import type {ClassificationPath,ConfigPackageV3,WorkflowControl,WorkflowOutput} from './types';
import {classificationPathKey,workflowPathLabel} from './runtime';
import {workflowClassificationGroup} from './workflowClassificationGroup';

const levels=['class','kind','skind','skind2'] as const;
export function workflowCategoryOptions(config:ConfigPackageV3,paths:ClassificationPath[]){
  const nodes=new Map(config.nodes.map(node=>[classificationPathKey(node.path),node]));
  const options=[...new Map(paths.map(path=>[classificationPathKey(path),path])).values()].map(path=>{
    const key=classificationPathKey(path),level=[...levels].reverse().find(level=>Boolean(path[level]))!,code=path[level]!,node=nodes.get(key),name=node?.classificationLabels?.[level]?.zh||node?.classificationLabels?.[level]?.en;
    return {key,path,value:JSON.stringify(path),label:name&&name!==code?`${code}（${name}）`:code,pathLabel:workflowPathLabel(config,path)};
  });
  const byLabel=new Map<string,typeof options>();
  for(const option of options)byLabel.set(option.label,[...byLabel.get(option.label)??[],option]);
  return options.map(option=>{
    const conflicts=byLabel.get(option.label)!;
    if(conflicts.length<2)return option;
    const parents=levels.filter(level=>Boolean(option.path[level])).slice(0,-1).map(level=>option.path[level]!);
    let suffix=parents.join('/');
    for(let size=1;size<=parents.length;size++){
      const tail=parents.slice(-size).join('/');
      if(conflicts.every(other=>other.key===option.key||levels.filter(level=>Boolean(other.path[level])).slice(0,-1).map(level=>other.path[level]!).slice(-size).join('/')!==tail)){suffix=tail;break;}
    }
    return {...option,label:`${option.label} · ${suffix||option.key}`};
  });
}

/** Only historical factory-owned captions are derived. Custom titles stay intact. */
export function workflowClassificationCaption(config:ConfigPackageV3,control:WorkflowControl,output?:WorkflowOutput):string{
  const label=control.label.zh;
  if(config.contractRevision<15||!control.systemManaged||!output)return label;
  const entries:Array<[string,string]>=[
    ['rod_road-classification','道路类型（Class=ROD）'],['wrp_warp-classification','类别（Kind/SKind）'],
    ...['bud_building','flr_unit','tpp_teleport'].map(id=>[id+'-classification',`类型（Class=${id.split('_')[0].toUpperCase()}）`] as [string,string]),
    ...['isg_ngf_lad','isg_ngf_lis','isg_ngf_wtb','isg_adm_dbz','isg_adm_plz','isl_ngf_wtr','isl_ngf_bod'].map(id=>{const [,kind,skind]=id.toUpperCase().split('_');return [id+'-classification',`类型（Kind=${kind}, SKind=${skind}）`] as [string,string];}),
    ...['isp_adm_dbp','isp_adm_plp'].map(id=>[id+'-classification','类型（Kind=ADM 下所有点要素）'] as [string,string]),
  ];
  if(new Map(entries).get(control.id)!==label)return label;
  const paths=workflowClassificationGroup(config,output).paths;
  const prefix=label.startsWith('道路类型')?'道路类型':label.startsWith('类别')?'类别':'类型';
  const fixed=[...label.matchAll(/(Class|Kind|SKind)=([A-Z0-9_]+)/g)];
  const names={Class:'class',Kind:'kind',SKind:'skind'} as const;
  if(fixed.length&&paths.length&&fixed.every(([,key,value])=>paths.every(path=>path[names[key as keyof typeof names]]===value)))return label;
  return prefix;
}
