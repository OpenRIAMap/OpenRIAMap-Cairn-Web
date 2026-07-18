import { ClipboardCheck } from 'lucide-react';
import ToolIconButton from '@/components/Toolbar/ToolIconButton';

type ReviewModuleLauncherProps = {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
};

export default function ReviewModuleLauncher({ active, onClick, disabled = false }: ReviewModuleLauncherProps) {
  return (
    <ToolIconButton
      label="审核"
      icon={<ClipboardCheck className="h-5 w-5" />}
      active={active}
      tone="orange"
      disabled={disabled}
      onClick={onClick}
      className="h-11 w-11"
    />
  );
}
