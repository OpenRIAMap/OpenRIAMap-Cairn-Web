import type { Plugin } from 'vite';
export function scanImageLibrary(directory: string): Promise<Array<{ name: string; url: string }>>;
export function imageLibraryPlugin(): Plugin;
