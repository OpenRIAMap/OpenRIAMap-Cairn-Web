import { ConfigDialog } from './ConfigDialog';
import { classificationPathKey } from './runtime';
import type { prepareCategoryDeletion } from './categoryDeletion';

export function CategoryDeletionDialog({ plan, onClose, onConfirm }: {
  plan: ReturnType<typeof prepareCategoryDeletion> | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const errors = plan?.report.issues.filter(issue => issue.severity === 'error') ?? [];
  const occupied = plan?.occupied.reduce((sum, issue) => sum + (issue.count ?? 0), 0) ?? 0;
  return <ConfigDialog open={Boolean(plan)} title="删除分类及其全部子分类" onClose={onClose}>
    {plan ? <>
      <p className="text-sm">将删除以下 {plan.nodes.length} 个分类定义；不会删除实际要素数据或其他模块。当前挂载记录中有 {occupied} 条仍使用这些分类。</p>
      <details open className="cm-subsection text-xs"><summary>完整删除范围</summary>
        <ul className="mt-2 max-h-48 overflow-auto">{plan.nodes.map(node => <li key={node.nodeId}>{classificationPathKey(node.path)}</li>)}</ul>
      </details>
      {errors.length ? <details open className="cm-subsection text-xs text-rose-700"><summary>删除后需修复的核验问题（{errors.length}）</summary>
        <ul className="mt-2 max-h-48 overflow-auto">{errors.map((issue, index) => <li key={index}>{issue.path}：{issue.message}</li>)}</ul>
      </details> : null}
      <p className="text-xs text-slate-600">确认后只暂存到整包草稿，可切换区域修复引用；仍有数据占用或有效引用时，顶部整包核验保存会被阻断。放弃整包草稿可恢复。</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded border bg-white px-3 py-1.5 text-sm" onClick={onClose}>取消删除分类</button>
        <button type="button" className="rounded bg-rose-700 px-3 py-1.5 text-sm text-white" onClick={onConfirm}>暂存删除到整包草稿</button>
      </div>
    </> : null}
  </ConfigDialog>;
}
