/** The editing owner supplies the existing save/cancel handlers and write lock. */
export function FeatureEditActions({onSave,onCancel,saveDisabled=false,mode='edit'}:{onSave:()=>void;onCancel:()=>void;saveDisabled?:boolean;mode?:'create'|'edit'}) {
  return <div className="cm-feature-edit-actions mt-3" data-feature-edit-actions>
    <button type="button" className="cm-feature-edit-cancel rounded px-3 py-2" onClick={onCancel}>{mode==='edit'?'放弃要素编辑':'放弃要素绘制'}</button>
    <button type="button" className="cm-feature-edit-save rounded px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40" disabled={saveDisabled} onClick={onSave}>{mode==='edit'?'保存编辑图层':'保存图层'}</button>
  </div>;
}
