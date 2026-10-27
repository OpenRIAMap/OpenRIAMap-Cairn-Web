import images from 'virtual:image-library';
import type { LibraryImage } from './imageLibrary';

export let libraryImages: LibraryImage[] = images;
const listeners = new Set<(images: LibraryImage[]) => void>();
export function subscribeImageLibrary(listener: (images: LibraryImage[]) => void): () => void {
  listeners.add(listener); listener(libraryImages);
  return () => { listeners.delete(listener); };
}
import.meta.hot?.on('image-library:changed', (next: LibraryImage[]) => {
  libraryImages = next;
  for (const listener of listeners) listener(next);
});
