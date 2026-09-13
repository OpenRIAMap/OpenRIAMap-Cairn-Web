import AppCard from '@/components/ui/AppCard';
import ToolIconButton from '@/components/Toolbar/ToolIconButton';
import { RULE_BUTTON_DEFS } from './buttonRuleConfig';
import { User } from 'lucide-react';

type Props = {
  activeButtonIds: string[];
  onToggle: (id: string) => void;
  mode?: 'desktop' | 'mobile';
  frameless?: boolean;
  showPlayers?: boolean;
  onTogglePlayers?: (show: boolean) => void;
};

export default function RuleButtonPanel({ activeButtonIds, onToggle, mode = 'desktop', frameless = false, showPlayers = false, onTogglePlayers }: Props) {
  const active = new Set((activeButtonIds ?? []).map((x) => String(x).trim()).filter(Boolean));

  const mobile = mode === 'mobile';
  const content = (
    <div className={`flex flex-wrap items-center ${mobile ? 'gap-1 justify-start' : 'gap-1'}`}>
      {RULE_BUTTON_DEFS.map((d) => (
        <ToolIconButton
          key={d.id}
          label={d.label}
          icon={d.icon}
          active={active.has(d.id)}
          tone={d.tone}
          onClick={() => onToggle(d.id)}
        />
      ))}
      {onTogglePlayers ? <ToolIconButton label="玩家" icon={<User className="w-5 h-5" />} active={showPlayers} tone="cyan" onClick={() => onTogglePlayers(!showPlayers)} /> : null}
    </div>
  );

  if (frameless) return content;

  return (
    <AppCard className={`bg-white/90 ${mobile ? 'p-2.5 w-[172px]' : 'p-3 sm:min-w-[360px]'} flex flex-col gap-2`}>
      {content}
    </AppCard>
  );
}
