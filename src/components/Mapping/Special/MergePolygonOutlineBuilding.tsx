import {NativeMergeForm,createMergeDraft,type DraftBundle,type MergeFormProps} from './NativeMergeForm';
import AppButton from '@/components/ui/AppButton';
export type {DraftBundle} from './NativeMergeForm';
export type MergePolygonOutlineBuildingDraft={outline:DraftBundle|null;building:DraftBundle|null};
export default function MergePolygonOutlineBuilding(props:MergeFormProps&{draft:MergePolygonOutlineBuildingDraft;onChange:(draft:MergePolygonOutlineBuildingDraft)=>void}){
 const {draft,onChange}=props;
 const add=(building:boolean)=>{try{const bundle=createMergeDraft(props.config,building?'stationBuilding':'platformFootprint');onChange(building?{...draft,building:bundle}:{...draft,outline:bundle});}catch(error){alert(error instanceof Error?error.message:String(error));}};
 return <section className="space-y-3"><p className="text-xs text-slate-500">共享完整面几何，分别填写站台轮廓和车站建筑；保存为独立记录。</p><div className="flex gap-2"><AppButton type="button" disabled={Boolean(draft.outline)} onClick={()=>add(false)}>添加站台轮廓</AppButton><AppButton type="button" disabled={Boolean(draft.building)} onClick={()=>add(true)}>添加车站建筑</AppButton></div>{draft.outline?<details className="cm-item" open><summary>站台轮廓</summary><NativeMergeForm {...props} bundle={draft.outline} onRemove={()=>onChange({...draft,outline:null})} onChange={outline=>onChange({...draft,outline})}/></details>:null}{draft.building?<details className="cm-item" open><summary>车站建筑</summary><NativeMergeForm {...props} bundle={draft.building} onRemove={()=>onChange({...draft,building:null})} onChange={building=>onChange({...draft,building})}/></details>:null}</section>;
}
