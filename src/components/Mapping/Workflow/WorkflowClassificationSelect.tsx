import type {ClassificationPath,ConfigPackageV3,WorkflowOutput} from '@/configStudio/types';
import {workflowClassificationGroup} from '@/configStudio/workflowClassificationGroup';
import {classificationPathKey} from '@/configStudio/runtime';
import {workflowCategoryOptions} from '@/configStudio/workflowCategoryOptions';

/** Authoring defines the scope; filling a workflow selects one concrete member. */
export function WorkflowClassificationSelect({config,output,value,onChange,allowedPaths}:{config:ConfigPackageV3;output:WorkflowOutput;value:string;onChange:(value:string)=>void;allowedPaths?:ClassificationPath[]}){
  const paths=workflowClassificationGroup(config,output).paths.filter(path=>!allowedPaths||allowedPaths.some(allowed=>classificationPathKey(allowed)===classificationPathKey(path)));
  const options=workflowCategoryOptions(config,paths);
  let key='';try{if(value)key=classificationPathKey(JSON.parse(value));}catch{/* Invalid stored selections remain visible as an error. */}
  const valid=options.some(option=>option.key===key);
  return <div className="grid gap-1">
    <select aria-label="工作流分类" className="w-full rounded border px-2 py-1 text-sm" value={valid?key:''} disabled={!options.length} onChange={event=>onChange(options.find(option=>option.key===event.target.value)?.value??'')}>
      <option value="">{options.length?'请选择类型':'没有符合范围的分类'}</option>
      {options.map(option=><option key={option.key} value={option.key} title={option.pathLabel}>{option.label}</option>)}
    </select>
    {value&&!valid?<p role="alert" className="text-xs text-rose-700">原选择已不属于当前可选范围，请重新选择。</p>:!options.length?<p role="alert" className="text-xs text-rose-700">分类组没有符合当前绘制及编辑范围的分类。</p>:null}
  </div>;
}
