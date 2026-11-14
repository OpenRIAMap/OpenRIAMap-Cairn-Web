import { useId, type ReactNode } from 'react';
import AppCard from '@/components/ui/AppCard';

export function FoldableToolbarPanel({ kind, label, icon, collapsed, onToggle, children }: {
  kind: 'layers' | 'mode';
  label: string;
  icon: ReactNode;
  collapsed: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  const contentId = useId();
  const action = (collapsed ? '展开' : '收起') + label;
  return (
    <AppCard className="cm-foldable-toolbar bg-white/90" data-toolbar-panel={kind}>
      <div className="cm-foldable-toolbar-content" id={contentId} hidden={collapsed}>{children}</div>
      <button type="button" className="cm-toolbar-fold" aria-label={action} title={action}
        aria-expanded={!collapsed} aria-controls={contentId} onClick={onToggle}>
        <span className="cm-fold-triangle" aria-hidden="true" />
        {icon}
      </button>
    </AppCard>
  );
}
