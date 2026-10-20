const cache = new Map<string, number[]>(), widths = new Map<string, number>();
let context: CanvasRenderingContext2D | null | undefined;
export const isCjkGlyph = (text: string) => /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u3040-\u30ff\uac00-\ud7af]/u.test(text);
export function usesScriptAwareGlyphs(anchor: { lineTextOrientationPolicy?: string } | null | undefined) { return anchor?.lineTextOrientationPolicy === 'scriptAware'; }
function remember<T>(store: Map<string, T>, key: string, value: T) { store.set(key, value); if (store.size > 5000) store.delete(store.keys().next().value!); return value; }
/** One bounded metrics pass; cache is in memory and keyed by the full actual font/text. */
export function scriptGlyphWidths(text: string, font: string, size: number): number[] {
  const key = `${font}|${text}`, prior = cache.get(key); if (prior) return prior;
  if (context === undefined) context = typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d');
  if (context) context.font = font;
  const measure = (value: string) => {
    const key = `${font}|${value}`, prior = widths.get(key); if (prior !== undefined) return prior;
    return remember(widths, key, context?.measureText(value).width ?? Array.from(value).reduce((n, c) => n + size * (isCjkGlyph(c) ? 1 : /\s/u.test(c) ? .32 : .6), 0));
  };
  const chars = Array.from(text), result = chars.map(char => measure(char));
  // Pair kerning preserves the advances within Latin runs, without prefix measurements or collision iteration.
  for (let i = 1; i < chars.length; i++) if (!isCjkGlyph(chars[i]) && !isCjkGlyph(chars[i - 1])) result[i - 1] = Math.max(0, result[i - 1] + measure(chars[i - 1] + chars[i]) - measure(chars[i - 1]) - measure(chars[i]));
  return remember(cache, key, result);
}
export function scriptSpacing(bend: number, normal = .5, curved = 1.8, threshold = 30) { return bend >= threshold ? curved : normal; }
