import type { ChangeEvent, ReactNode } from 'react';
import AppButton from '@/components/ui/AppButton';
import type { DataSourceDefinition, DataSourceSelectionPolicy } from '@/core/dataSourceSelection';
import { isDataSourceSelectionAllowed } from '@/core/dataSourceSelection';

export type DataSourceSelectionSupplementalContext = {
  draftSource: DataSourceDefinition | null;
  appliedSource: DataSourceDefinition | null;
  selectionAllowed: boolean;
  isApplying: boolean;
};

export type DataSourceSelectionSectionProps = {
  sources: readonly DataSourceDefinition[];
  policy: DataSourceSelectionPolicy;
  draftSourceId: string;
  appliedSourceId: string;
  isApplying?: boolean;
  status?: { tone: 'success' | 'error' | 'info'; text: string } | null;
  onDraftSourceIdChange(sourceId: string): void;
  onApply(): void;
  title?: string;
  applyLabel?: string;
  appliedLabel?: string;
  defaultSuffix?: string;
  hint?: string;
  /** Application-owned selected-source settings; the generic component never interprets them. */
  renderSupplemental?: (context: DataSourceSelectionSupplementalContext) => ReactNode;
};

const toneClassName = {
  success: 'text-green-600',
  error: 'text-red-600',
  info: 'text-gray-500',
};

function selectableSources(sources: readonly DataSourceDefinition[]): DataSourceDefinition[] {
  return sources.filter((source) => source.enabled !== false && source.selectable !== false);
}

export function DataSourceSelectionSection({
  sources,
  policy,
  draftSourceId,
  appliedSourceId,
  isApplying = false,
  status = null,
  onDraftSourceIdChange,
  onApply,
  title = 'Data source',
  applyLabel = 'Apply',
  appliedLabel = 'Applied',
  defaultSuffix = ' (default)',
  hint,
  renderSupplemental,
}: DataSourceSelectionSectionProps) {
  const sourcesForSelect = selectableSources(sources);
  const selectionAllowed = isDataSourceSelectionAllowed(policy, 'settings');
  const draftSource = sources.find((source) => source.id === draftSourceId) ?? null;
  const appliedSource = sources.find((source) => source.id === appliedSourceId) ?? null;
  const appliedLabelValue = appliedSource?.label ?? appliedSourceId;
  const supplemental = renderSupplemental?.({ draftSource, appliedSource, selectionAllowed, isApplying });

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onDraftSourceIdChange(event.target.value);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-3 space-y-2">
      <div className="text-xs font-semibold text-gray-700">{title}</div>
      <div className="flex items-center gap-2">
        <select
          className="min-w-0 flex-1 rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-800 disabled:bg-gray-100 disabled:text-gray-500"
          value={draftSourceId}
          disabled={!selectionAllowed || isApplying}
          onChange={handleChange}
          onMouseDownCapture={(event) => event.stopPropagation()}
          onPointerDownCapture={(event) => event.stopPropagation()}
          onTouchStartCapture={(event) => event.stopPropagation()}
        >
          {sourcesForSelect.map((source) => (
            <option key={source.id} value={source.id}>
              {source.label}{source.id === policy.defaultSourceId ? defaultSuffix : ''}
            </option>
          ))}
        </select>
        <AppButton
          onClick={onApply}
          disabled={isApplying}
          className="shrink-0 rounded bg-blue-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-600"
        >
          {applyLabel}
        </AppButton>
      </div>
      <div className="text-[11px] leading-relaxed text-gray-500">
        {appliedLabel}: {appliedLabelValue}. {hint ?? 'Changes take effect only after an explicit apply action.'}
      </div>
      {supplemental ? <div className="pt-1">{supplemental}</div> : null}
      {policy.selectionMode === 'fixed' ? (
        <div className="text-[11px] leading-relaxed text-gray-500">This selection is fixed by the application policy.</div>
      ) : null}
      {status ? <div className={`text-[11px] ${toneClassName[status.tone]}`}>{status.text}</div> : null}
    </div>
  );
}

export default DataSourceSelectionSection;
