import { readdir, open, lstat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { imageLibraryUrl, supportedLibraryFilename } from '../src/configStudio/imageLibrary.ts';

const virtualId = 'virtual:image-library', resolvedId = '\0' + virtualId;
function matchesHeader(name, bytes) {
  const extension = name.split('.').at(-1).toLowerCase();
  if (extension === 'png') return bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  if (extension === 'jpg' || extension === 'jpeg') return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (extension === 'gif') return /^GIF8[79]a$/.test(bytes.toString('ascii', 0, 6));
  if (extension === 'webp') return bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP';
  return bytes.toString('ascii', 4, 8) === 'ftyp' && /avif|avis/.test(bytes.toString('ascii', 8, Math.min(bytes.length, 64)));
}
/** No generated index: this list is computed from the public files on every build. */
export async function scanImageLibrary(directory) {
  const entries = await readdir(directory, { withFileTypes: true }), names = new Set(), images = [];
  for (const entry of entries) {
    if (!/\.(png|jpe?g|webp|gif|avif)$/i.test(entry.name)) continue;
    const filename = resolve(directory, entry.name), stat = await lstat(filename);
    if (!stat.isFile() || stat.isSymbolicLink() || !supportedLibraryFilename(entry.name)) throw Error(`图片库文件不合法：${filename}`);
    const key = entry.name.toLowerCase();
    if (names.has(key)) throw Error(`图片库文件名忽略大小写后重复：${filename}`);
    names.add(key);
    const file = await open(filename, 'r'), header = Buffer.alloc(64);
    let size;
    try { size = (await file.read(header, 0, header.length, 0)).bytesRead; }
    finally { await file.close(); }
    if (!stat.size || !matchesHeader(entry.name, header.subarray(0, size))) throw Error(`图片库文件为空或格式与扩展名不符：${filename}`);
    images.push({ name: entry.name, url: imageLibraryUrl(entry.name) });
  }
  return images.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
}
export function imageLibraryPlugin() {
  let directory;
  return {
    name: 'internal-image-library',
    configResolved(config) { directory = resolve(config.publicDir, 'image-library'); },
    resolveId(id) { if (id === virtualId) return resolvedId; },
    async load(id) { if (id === resolvedId) return `export default ${JSON.stringify(await scanImageLibrary(directory))};`; },
    async buildStart() { for (const image of await scanImageLibrary(directory)) this.addWatchFile(resolve(directory, image.name)); },
    configureServer(server) {
      server.watcher.add(directory);
      const changed = async (filename) => {
        if (resolve(dirname(filename)) !== directory) return;
        const module = server.moduleGraph.getModuleById(resolvedId);
        if (module) server.moduleGraph.invalidateModule(module);
        try { server.ws.send({ type: 'custom', event: 'image-library:changed', data: await scanImageLibrary(directory) }); }
        catch (error) { server.config.logger.error(String(error)); }
      };
      server.watcher.on('add', changed).on('unlink', changed).on('change', changed);
      server.httpServer?.once('close', () => {
        server.watcher.off('add', changed).off('unlink', changed).off('change', changed);
      });
    },
  };
}
