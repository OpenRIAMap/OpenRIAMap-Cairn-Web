import {NativeMergeForm,createMergeDraft,type DraftBundle,type MergeFormProps} from './NativeMergeForm';
import AppButton from '@/components/ui/AppButton';
export type {DraftBundle} from './NativeMergeForm';
export type MergePointPlatformStationDraft={platforms:DraftBundle[];station:DraftBundle|null};
export default function MergePointPlatformStation(props:MergeFormProps&{draft:MergePointPlatformStationDraft;onChange:(draft:MergePointPlatformStationDraft)=>void}){
 const {draft,onChange}=props;
 const add=(station:boolean)=>{try{const bundle=createMergeDraft(props.config,station?'stationArea':'platform');onChange(station?{...draft,station:bundle}:{...draft,platforms:[...draft.platforms,bundle]});}catch(error){alert(error instanceof Error?error.message:String(error));}};
 return <section className="space-y-3"><p className="text-xs text-slate-500">共享一个点坐标，分别填写多个站台和至多一个站场；保存为独立记录。</p><div className="flex gap-2"><AppButton type="button" onClick={()=>add(false)}>添加站台</AppButton><AppButton type="button" disabled={Boolean(draft.station)} onClick={()=>add(true)}>添加站场</AppButton></div>{draft.platforms.map((bundle,index)=><details key={index} className="cm-item" open><summary>站台 {index+1}</summary><NativeMergeForm {...props} bundle={bundle} onRemove={()=>onChange({...draft,platforms:draft.platforms.filter((_,at)=>at!==index)})} onChange={bundle=>onChange({...draft,platforms:draft.platforms.map((old,at)=>at===index?bundle:old)})}/></details>)}{draft.station?<details className="cm-item" open><summary>站场</summary><NativeMergeForm {...props} bundle={draft.station} onRemove={()=>onChange({...draft,station:null})} onChange={station=>onChange({...draft,station})}/></details>:null}</section>;
}
