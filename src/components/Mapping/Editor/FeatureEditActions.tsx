/** The editing owner supplies the existing save/cancel handlers and write lock. */
export function FeatureEditActions({onSave,onCancel,saveDisabled=false}:{onSave:()=>void;onCancel:()=>void;saveDisabled?:boolean}) {
  return <div className="cm-feature-edit-actions mt-3" data-feature-edit-actions>
    <button type="button" className="cm-feature-edit-cancel rounded px-3 py-2" onClick={onCancel}>放弃要素编辑</button>
    <button type="button" className="cm-feature-edit-save rounded px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40" disabled={saveDisabled} onClick={onSave}>保存编辑图层</button>
  </div>;
}
