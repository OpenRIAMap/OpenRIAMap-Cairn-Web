import type { ReactNode } from 'react';
import { ModuleHelp } from './ModuleHelp';
export function SettingField({title,help,children}:{title:string;help:string;children:ReactNode}){
  return <label data-setting-field={title} className="grid min-w-0 content-start gap-1 text-xs"><span>{title}<ModuleHelp title={title} text={help}/></span>{children}</label>;
}
