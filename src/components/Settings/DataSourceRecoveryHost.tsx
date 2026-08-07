import DataSourceRecoveryDialog from './DataSourceRecoveryDialog';
import { getRuleDataSourceSelectionController, getRuleDataSourceSelectionPolicy } from '@/components/Rules/data/formalDataSourceRuntime';
import { useRuleDataStore } from '@/store/ruleDataStore';

export default function DataSourceRecoveryHost() {
  const source = useRuleDataStore((state) => state.dataSource);
  const failure = useRuleDataStore((state) => state.dataSourceFailure);
  const isApplying = useRuleDataStore((state) => state.dataSourceApplying);
  const applyDataSource = useRuleDataStore((state) => state.applyDataSource);
  const clearFailure = useRuleDataStore((state) => state.clearDataSourceFailure);
  const controller = getRuleDataSourceSelectionController();

  return (
    <DataSourceRecoveryDialog
      open={!!failure}
      sources={controller.getSources()}
      policy={getRuleDataSourceSelectionPolicy()}
      appliedSourceId={source.sourceId}
      failure={failure}
      isApplying={isApplying}
      title="运行数据读取失败"
      applyLabel="应用并重试"
      cancelLabel="取消"
      onClose={clearFailure}
      onApply={(sourceId) => {
        void applyDataSource(sourceId, 'failure').catch(() => undefined);
      }}
    />
  );
}
