import type { ReviewLayerVisibility } from './reviewStatusTypes';

const LAYERS: Array<{ key: keyof ReviewLayerVisibility; label: string; note: string }> = [
  { key: 'create', label: 'Review Create', note: '新增/未分类要素' },
  { key: 'update', label: 'Review Update', note: '更新类要素' },
  { key: 'delete', label: 'Review Delete', note: '删除屏蔽预览' },
  { key: 'pictures', label: 'Review Pictures', note: '图片绑定预览' },
];

type ReviewLayerControlsProps = {
  value: ReviewLayerVisibility;
  onChange: (next: ReviewLayerVisibility) => void;
  disabled?: boolean;
};

export default function ReviewLayerControls({ value, onChange, disabled = false }: ReviewLayerControlsProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-3">
      <div className="mb-2 text-sm font-semibold text-gray-900">Review Layers</div>
      <div className="flex flex-col gap-2">
        {LAYERS.map((layer) => (
          <label key={layer.key} className={`flex items-center justify-between gap-3 rounded-xl px-2 py-1.5 ${disabled ? 'bg-gray-50 text-gray-400' : 'bg-gray-50 text-gray-700'}`}>
            <span className="min-w-0">
              <span className="block text-xs font-semibold">{layer.label}</span>
              <span className="block text-[11px] text-gray-500">{layer.note}</span>
            </span>
            <input
              type="checkbox"
              checked={value[layer.key]}
              disabled={disabled}
              onChange={(event) => onChange({ ...value, [layer.key]: event.target.checked })}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
