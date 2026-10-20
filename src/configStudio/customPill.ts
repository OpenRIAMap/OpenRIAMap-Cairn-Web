import type { CustomPillSettings, RenderColorBinding } from './types';

/** Shared by authoring, validation, HTML painting and layout; all values are CSS pixels. */
export const CUSTOM_PILL_LIMITS = { fontMin: 6, fontMax: 72, ratioMax: 10, strokeMax: 72 } as const;
export function createCustomPill(backgroundColor: RenderColorBinding = { mode: 'fixed', color: '#2563eb' }): CustomPillSettings {
  return { lineHeightRatio: 1, paddingYRatio: .2, paddingXRatio: .5, radiusRatio: .6,
    textColor: { mode: 'fixed', color: '#ffffff' }, backgroundColor: structuredClone(backgroundColor),
    strokeColor: { mode: 'fixed', color: '#334155' }, strokeWidth: 0 };
}
export function customPillErrors(size: number, value: CustomPillSettings | undefined): Array<{ key: string; message: string }> {
  if (!value) return [{ key: 'pill', message: '自定义胶囊需要完整的胶囊设置。' }];
  const errors: Array<{ key: string; message: string }> = [];
  if (!Number.isFinite(size) || size < 6 || size > 72) errors.push({ key: 'size', message: '胶囊字号必须介于 6–72px。' });
  for (const key of ['lineHeightRatio', 'paddingYRatio', 'paddingXRatio', 'radiusRatio'] as const) {
    const number = value[key];
    if (!Number.isFinite(number) || number > 10 || number < 0 || key === 'lineHeightRatio' && number === 0)
      errors.push({ key, message: `${key} 必须是${key === 'lineHeightRatio' ? '大于 0' : '非负'}且不超过 10 的有限数字。` });
  }
  if (!Number.isFinite(value.strokeWidth) || value.strokeWidth < 0 || value.strokeWidth > 72)
    errors.push({ key: 'strokeWidth', message: '胶囊描边宽度必须介于 0–72px。' });
  return errors;
}
export type PillMetrics = { paddingX: number; paddingY: number; radius: number; requestedRadius: number; lineHeight: number; width: number; height: number; strokeWidth: number };
export type ResolvedCustomPill = { settings: CustomPillSettings; textColor: string; backgroundColor: string; strokeColor: string };
export function customPillMetrics(size: number, settings: CustomPillSettings, textWidth: number, lineCount = 1): PillMetrics {
  const paddingX = Math.round(size * settings.paddingXRatio), paddingY = Math.round(size * settings.paddingYRatio);
  const lineHeight = size * settings.lineHeightRatio, strokeWidth = settings.strokeWidth;
  const width = Math.max(0, textWidth) + 2 * (paddingX + strokeWidth);
  const height = Math.max(1, lineCount) * lineHeight + 2 * (paddingY + strokeWidth);
  return { paddingX, paddingY, lineHeight, strokeWidth, width, height, requestedRadius: Math.round(size * settings.radiusRatio),
    radius: Math.min(Math.round(size * settings.radiusRatio), width / 2, height / 2) };
}
export const pillColorBindings = (pill?: CustomPillSettings): RenderColorBinding[] => pill ? [pill.textColor, pill.backgroundColor, pill.strokeColor] : [];
