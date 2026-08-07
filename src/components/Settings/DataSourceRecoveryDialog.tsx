import { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import BlockingFullscreenModal from '@/components/Common/BlockingFullscreenModal';
import AppButton from '@/components/ui/AppButton';
import AppCard from '@/components/ui/AppCard';
import type { DataSourceDefinition, DataSourceSelectionFailure, DataSourceSelectionPolicy } from '@/core/dataSourceSelection';
import { isDataSourceSelectionAllowed } from '@/core/dataSourceSelection';

export type DataSourceRecoveryDialogProps = {
  open: boolean;
  sources: readonly DataSourceDefinition[];
  policy: DataSourceSelectionPolicy;
  appliedSourceId: string;
  failure: DataSourceSelectionFailure | null;
  isApplying?: boolean;
  onClose(): void;
  onApply(sourceId: string): void;
  title?: string;
  applyLabel?: string;
  cancelLabel?: string;
};

function selectableSources(sources: readonly DataSourceDefinition[]): DataSourceDefinition[] {
  return sources.filter((source) => source.enabled !== false && source.selectable !== false);
}

export function DataSourceRecoveryDialog({
  open,
  sources,
  policy,
  appliedSourceId,
  failure,
  isApplying = false,
  onClose,
  onApply,
  title = 'Data source request failed',
  applyLabel = 'Apply and retry',
  cancelLabel = 'Cancel',
}: DataSourceRecoveryDialogProps) {
  const selectionAllowed = isDataSourceSelectionAllowed(policy, 'failure');
  const sourceOptions = selectableSources(sources);
  const [draftSourceId, setDraftSourceId] = useState(appliedSourceId);

  useEffect(() => {
    if (!open) return;
    const failedSource = failure?.sourceId;
    const nextSourceId = failedSource && sourceOptions.some((source) => source.id === failedSource)
      ? failedSource
      : appliedSourceId;
    setDraftSourceId(nextSourceId);
  }, [open, failure?.sourceId, appliedSourceId]);

  if (!failure) return null;

  return (
    <BlockingFullscreenModal open={open} onBackdropClick={isApplying ? undefined : onClose}>
      <AppCard className="w-[min(100vw-2rem,28rem)] overflow-hidden">
        <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-orange-600" />
            <h2 className="truncate font-bold text-gray-800">{title}</h2>
          </div>
          <AppButton
            onClick={onClose}
            disabled={isApplying}
            className="p-1 hover:bg-gray-200 rounded"
            aria-label={cancelLabel}
          >
            <X className="h-5 w-5 text-gray-500" />
          </AppButton>
        </div>
        <div className="space-y-3 p-4 text-sm">
          <div className="rounded-lg bg-gray-50 p-3 text-gray-700 space-y-1">
            <div className="text-xs text-gray-500">Stage: {failure.stage}</div>
            {failure.worldId ? <div className="text-xs text-gray-500">World: {failure.worldId}</div> : null}
            <div className="break-words leading-relaxed">{failure.message}</div>
          </div>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-gray-700">Data source</span>
            <select
              className="w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-800 disabled:bg-gray-100 disabled:text-gray-500"
              value={draftSourceId}
              disabled={!selectionAllowed || isApplying}
              onChange={(event) => setDraftSourceId(event.target.value)}
            >
              {sourceOptions.map((source) => <option key={source.id} value={source.id}>{source.label}</option>)}
            </select>
          </label>
          {!selectionAllowed ? (
            <div className="text-[11px] leading-relaxed text-gray-500">The application policy keeps this source selection fixed.</div>
          ) : null}
          <div className="flex justify-end gap-2 pt-1">
            <AppButton
              onClick={onClose}
              disabled={isApplying}
              className="rounded bg-gray-200 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-300"
            >
              {cancelLabel}
            </AppButton>
            <AppButton
              onClick={() => onApply(draftSourceId)}
              disabled={isApplying || !failure.retryAllowed}
              className="rounded bg-blue-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-600"
            >
              {applyLabel}
            </AppButton>
          </div>
        </div>
      </AppCard>
    </BlockingFullscreenModal>
  );
}

export default DataSourceRecoveryDialog;
