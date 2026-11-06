import {useCallback,useRef,useState,type CSSProperties,type ReactNode} from 'react';
import {ToolButtonTooltip} from './ToolButtonTooltip';
import AppButton from '@/components/ui/AppButton';

import { BUTTON_TONES, type ButtonTone as Tone } from '@/core/project/buttonVisualCatalog';

type ToolIconButtonProps = {
  style?:CSSProperties;
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  active?: boolean;
  tone?: Tone;
  shadow?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
};

export default function ToolIconButton({
  label,
  style,
  icon,
  onClick,
  active = false,
  tone = 'blue',
  shadow = false,
  disabled = false,
  className = '',
  type = 'button',
}: ToolIconButtonProps) {
  const anchor=useRef<HTMLButtonElement>(null),[hint,setHint]=useState(false),closeHint=useCallback(()=>setHint(false),[]);
  const base =
    'relative group flex flex-col items-center justify-center h-9 w-9 p-1.5 transition-colors';
  const inactive = 'bg-white/90 text-gray-600 hover:bg-gray-100';
  const disabledCls = 'bg-gray-100 text-gray-300 cursor-not-allowed';
  const activeCls = BUTTON_TONES[tone]?.active;
  const shadowCls = shadow ? 'shadow-lg' : '';

  const stateCls = disabled ? disabledCls : active ? activeCls : inactive;

  return (
    <><AppButton
      ref={anchor}
      onMouseEnter={()=>setHint(true)}
      onMouseLeave={()=>{if(document.activeElement!==anchor.current)closeHint();}}
      onFocus={()=>setHint(true)}
      onBlur={closeHint}
      style={style}
      type={type}
      onClick={disabled ? undefined : onClick}
      className={`${base} ${stateCls} ${shadowCls} ${className}`.trim()}
      title={label}
      aria-pressed={active}
      disabled={disabled}
    >
      {icon}

    </AppButton>{hint&&!disabled?<ToolButtonTooltip anchor={anchor} label={label} onClose={closeHint}/>:null}</>
  );
}
