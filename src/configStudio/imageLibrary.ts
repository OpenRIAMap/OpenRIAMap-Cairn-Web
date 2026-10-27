/** Pure image-library policy, shared by Web, build enumeration and the SCF kernel.
 * Directory availability is deliberately not part of configuration admission. */
export const IMAGE_LIBRARY_PREFIX = '/image-library/';
export const IMAGE_LIBRARY_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'avif'] as const;
export type LibraryImage = { name: string; url: string };

export function supportedLibraryFilename(name: string): boolean {
  return Boolean(name && name.trim() === name && !/[\\/\u0000-\u001f\u007f<>:"|?*]/.test(name)
    && IMAGE_LIBRARY_EXTENSIONS.some(extension => name.toLowerCase().endsWith('.' + extension)));
}
export function imageLibraryUrl(name: string): string {
  if (!supportedLibraryFilename(name)) throw Error(`图片库文件名不合法：${name}`);
  return IMAGE_LIBRARY_PREFIX + encodeURIComponent(name);
}
export function imageLibraryFilename(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.startsWith(IMAGE_LIBRARY_PREFIX)) return;
  try {
    const name = decodeURIComponent(value.slice(IMAGE_LIBRARY_PREFIX.length));
    return supportedLibraryFilename(name) && imageLibraryUrl(name) === value ? name : undefined;
  } catch { return; }
}
export function imageSourceFormProblems(value: { sourceForm?: unknown; url?: unknown }, contractRevision: number): Array<{ path: string; message: string }> {
  if (contractRevision < 17) return value.sourceForm === undefined ? [] : [{ path: 'sourceForm', message: '图片来源形式最低要求契约 c17，请先明确迁移。' }];
  if (value.sourceForm !== 'url' && value.sourceForm !== 'library') return [{ path: 'sourceForm', message: 'c17 图片必须明确设置来源形式为 URL 或图片库，不能根据地址推断。' }];
  return value.sourceForm === 'library' && !imageLibraryFilename(value.url)
    ? [{ path: 'url', message: '图片库来源必须使用 /image-library/ 下支持的图片文件地址，不得包含子目录、查询参数或片段。' }] : [];
}
