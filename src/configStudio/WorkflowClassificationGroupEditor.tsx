import {HelpLabel} from './SettingHelp';
import type {ConfigPackageV3,WorkflowOutput,WorkflowClassificationSelector,GeometryKind} from './types';
import {CategoryPathPicker} from './CategoryPathPicker';
import {workflowClassificationGroup} from './workflowClassificationGroup';
import {classificationPathKey} from './runtime';
import {openAddedSetting} from './folding';
export function WorkflowClassificationGroupEditor({config,output,onChange}:{config:ConfigPackageV3;output:WorkflowOutput;onChange:(output:WorkflowOutput)=>void}){
  const rows=output.classificationGroup?.selectors??[],result=workflowClassificationGroup(config,output);
  const change=(selectors:WorkflowClassificationSelector[])=>onChange({...output,classificationGroup:{selectors}});
  return <section className="cm-subsection space-y-3" aria-label="分类组设置">
    {rows.map((row,index)=><details className="cm-item" data-fold-key={'selector:'+output.id+':'+row.id} key={row.id}><summary>分类 {index+1} · {row.mode==='self'?'指定分类本身':'指定分类下所有末端分类'} · {classificationPathKey(row.path)||'未指定'}</summary><div className="mt-3 space-y-2"><HelpLabel context="WorkflowClassificationGroupEditor" className="grid gap-1 text-xs">指定方式<select aria-label={'分类指定方式 '+(index+1)} value={row.mode} onChange={e=>change(rows.map(item=>item.id===row.id?{...item,mode:e.target.value as WorkflowClassificationSelector['mode']}:item))}><option value="self">指定分类本身</option><option value="leafDescendants">指定分类下所有末端分类</option></select></HelpLabel><CategoryPathPicker config={config} value={row.path} label={'分类 '+(index+1)} onChange={path=>change(rows.map(item=>item.id===row.id?{...item,path}:item))}/>{result.rows[index]?.error?<p role="alert" className="text-xs text-rose-700">{result.rows[index].error}</p>:<p className="text-xs text-slate-500">符合类型 {result.rows[index]?.paths.length??0} 项；过滤 {result.rows[index]?.filtered??0} 项。</p>}<button type="button" className="text-xs text-rose-700" onClick={()=>change(rows.filter(item=>item.id!==row.id))}>删除分类</button></div></details>)}
    <button type="button" className="rounded border px-2 py-1 text-xs" onClick={()=>{const row:WorkflowClassificationSelector={id:output.id+'-selector-'+crypto.randomUUID(),mode:'self',path:{class:''}};change([...rows,row]);openAddedSetting('selector:'+output.id+':'+row.id);}}>添加分类</button>
    <HelpLabel context="WorkflowClassificationGroupEditor" className="grid gap-1 text-xs">此绘制页固定类型<select aria-label="此绘制页固定类型" value={output.geometry.selected} onChange={e=>onChange({...output,geometry:{selected:e.target.value as GeometryKind}})}><option value="Point">点</option><option value="LineString">线</option><option value="Polygon">面</option></select></HelpLabel>
    <details data-fold-key={'candidates:'+output.id}><summary className="text-xs">分类组有效候选 · {result.paths.length} 项</summary><ul className="mt-2 text-xs">{result.paths.map(path=><li key={classificationPathKey(path)}>{classificationPathKey(path)}</li>)}</ul></details>
  </section>;
}
