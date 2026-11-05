import DataSourceRecoveryDialog from './DataSourceRecoveryDialog';
import { getRuleDataSourceSelectionController, getRuleDataSourceSelectionPolicy } from '@/components/Rules/data/formalDataSourceRuntime';
import { useRuleDataStore } from '@/store/ruleDataStore';
import {readRecoverableRuleWorldCache} from '@/components/Rules/data/worldRuleCache';
import {getRuleDataSourceSnapshot} from '@/components/Rules/data/formalDataSourceRuntime';

export default function DataSourceRecoveryHost() {
  const source = useRuleDataStore((state) => state.dataSource);
  const failure = useRuleDataStore((state) => state.dataSourceFailure);
  const isApplying = useRuleDataStore((state) => state.dataSourceApplying);
  const applyDataSource = useRuleDataStore((state) => state.applyDataSource);
  const clearFailure = useRuleDataStore((state) => state.clearDataSourceFailure);
  const recoverLocal = useRuleDataStore((state) => state.recoverLocalWorld);
  const cached = failure?.worldId ? readRecoverableRuleWorldCache(failure.worldId, getRuleDataSourceSnapshot(failure.worldId)) : null;
  const controller = getRuleDataSourceSelectionController(source.worldId);

  return (
    <DataSourceRecoveryDialog
      open={!!failure}
      sources={controller.getSources()}
      policy={getRuleDataSourceSelectionPolicy(source.worldId)}
      appliedSourceId={source.sourceId}
      failure={failure}
      isApplying={isApplying}
      title="运行数据读取失败"
      applyLabel="应用并重试"
      cancelLabel={cached ? '取消重试，使用本地版本' : '取消加载'}
      recoveryDescription={cached ? `本地完整版本 ${cached.dataset.formalVersion ?? cached.dataset.mergeVersion} · 缓存于 ${new Date(cached.meta.cachedAt).toLocaleString()}。远端状态尚未确认。` : '当前来源和世界没有可用的完整本地版本；取消后将停止此次加载。'}
      onClose={() => {if (!recoverLocal()) clearFailure();}}
      onApply={(sourceId) => {
        void applyDataSource(sourceId, 'failure').catch(() => undefined);
      }}
    />
  );
}
