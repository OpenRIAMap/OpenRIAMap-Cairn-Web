import { createContext } from 'react';

export const WorkspaceSidebarContext = createContext<{
  enabled: boolean;
  target: HTMLDivElement | null;
  mapRight: number | null;
  registerPanel: (id: string) => () => void;
} | null>(null);
