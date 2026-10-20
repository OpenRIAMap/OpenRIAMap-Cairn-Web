import { useLayoutEffect, useRef, useState } from 'react';
import type { RenderFieldCondition, RenderFieldGroup, ZoomPriorityRule } from './types';
import { renderRuleRange } from './renderRuleConditions';
const literal = (value: unknown) => JSON.stringify(value) ?? '空';
function conditionText(value: RenderFieldCondition): string {
  if (value.kind === 'fieldPresent') return `${value.field} ${value.present ? '有值' : '为空'}`;
  if (value.kind === 'fieldEquals') return `${value.field} = ${literal(value.value)}`;
  if (value.kind === 'fieldIn') return `${value.field} ∈ ${literal(value.values)}`;
  const operators = { eq: '=', ne: '≠', gt: '>', ge: '≥', lt: '<', le: '≤', in: '∈', notIn: '∉', present: '有值', empty: '为空' };
  return `${value.field} ${operators[value.operator]}${['present', 'empty'].includes(value.operator) ? '' : ' ' + literal(value.values ?? value.value)}`;
}
export function fieldGroupTitle(group: RenderFieldGroup): string {
  if (group.formula) {
    const formula=group.formula;
    const expand=(text:string,seen:string[]):string=>text.replace(/\b[A-Z][A-Z0-9_]*\b/g,token=>{
      const term=formula.terms.find(term=>term.id===token);if(term)return `(${conditionText(term.condition)})`;
      const nested=formula.groups?.find(item=>item.id===token);
      return nested&&!seen.includes(token)&&seen.length<8?`(${expand(nested.expression,[...seen,token])})`:token;
    });
    return expand(formula.expression,[]);
  }
  return group.op === 'not' ? `NOT (${group.items.map(item => 'op' in item ? fieldGroupTitle(item) : conditionText(item)).join(', ')})` : group.items.map(item => 'op' in item ? `(${fieldGroupTitle(item)})` : conditionText(item)).join(group.op === 'all' ? ' AND ' : ' OR ');
}
export function renderRuleTitle(rule: ZoomPriorityRule, index: number) {
  const range = renderRuleRange(rule);
  return `渲染规则 ${index + 1} · ${range.min} ≤ Zoom ≤ ${range.max}${rule.when?.fields ? ' · ' + fieldGroupTitle(rule.when.fields) : ''}`;
}
/** Literal three-dot truncation, remeasured after resize/font load; complete text remains accessible. */
export function RenderRuleTitle({ rule, index }: { rule: ZoomPriorityRule; index: number }) {
  const text = renderRuleTitle(rule, index), ref = useRef<HTMLSpanElement>(null), [shown, setShown] = useState(text);
  useLayoutEffect(() => {
    const element = ref.current; if (!element) return;
    const measure = () => {
      const style = getComputedStyle(element), lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.5;
      const probe = document.createElement('span'); probe.style.cssText = `position:fixed;visibility:hidden;white-space:normal;overflow-wrap:anywhere;width:${element.clientWidth}px;font:${style.font};line-height:${lineHeight}px;`; document.body.append(probe);
      const chars=Array.from(text);let lo = 0, hi = chars.length; probe.textContent = text;
      if (probe.getBoundingClientRect().height <= lineHeight * 2 + .5) setShown(text);
      else { while (lo < hi) { const mid = Math.ceil((lo + hi) / 2); probe.textContent = chars.slice(0, mid).join('') + '...'; if (probe.getBoundingClientRect().height <= lineHeight * 2 + .5) lo = mid; else hi = mid - 1; } setShown(chars.slice(0, lo).join('') + '...'); }
      probe.remove();
    };
    measure(); const observer = new ResizeObserver(measure); observer.observe(element);
    let alive = true; void document.fonts?.ready.then(() => { if (alive) measure(); }); return () => { alive = false; observer.disconnect(); };
  }, [text]);
  return <span ref={ref} title={text} aria-label={text} className="inline-block max-w-full break-words align-top leading-6" style={{ width: 'calc(100% - 1.5em)', overflowWrap: 'anywhere' }}>{shown}</span>;
}
