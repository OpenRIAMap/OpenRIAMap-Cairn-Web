/** Draft-only identities. Never serialised into feature coordinates or fields. */
export type InputPoint = { x: number; z: number; y?: number };
export type SequenceSnapshot = { points: InputPoint[]; ids: number[]; anchor: number | null; cursor: number | null };
export const equalPoint = (a: InputPoint, b: InputPoint) => a.x === b.x && a.z === b.z && a.y === b.y;
export const equalPoints = (a: InputPoint[], b: InputPoint[]) => a.length === b.length && a.every((p, i) => equalPoint(p, b[i]));
export const logicalPoints = (points: InputPoint[], closed: boolean) => closed && points.length > 1 && equalPoint(points[0], points[points.length - 1]) ? points.slice(0, -1) : points;

export class PointSequence {
  private serial = 0;
  points: InputPoint[] = [];
  ids: number[] = [];
  anchor: number | null = null;
  cursor: number | null = null;
  get active() { return this.anchor !== null; }
  get index() { return this.cursor === null ? -1 : this.ids.indexOf(this.cursor); }
  get anchorIndex() { return this.anchor === null ? -1 : this.ids.indexOf(this.anchor); }
  stop() { this.anchor = null; this.cursor = null; }
  reset(points: InputPoint[]) { this.stop(); this.points = points.map(p => ({ ...p })); this.ids = points.map(() => ++this.serial); }
  sync(points: InputPoint[]) {
    if (equalPoints(points, this.points)) return;
    // Retain only an unambiguous unchanged prefix/suffix. Replacement can never
    // silently bind a selected numeric index to a different vertex.
    let start = 0, end = 0;
    while (start < Math.min(points.length, this.points.length) && equalPoint(points[start], this.points[start])) start++;
    while (end < Math.min(points.length, this.points.length) - start && equalPoint(points[points.length - 1 - end], this.points[this.points.length - 1 - end])) end++;
    this.ids = [...this.ids.slice(0, start), ...points.slice(start, points.length - end).map(() => ++this.serial), ...(end ? this.ids.slice(-end) : [])];
    this.points = points.map(p => ({ ...p }));
    if (this.anchor !== null && !this.ids.includes(this.anchor)) this.stop();
    if (this.cursor !== null && !this.ids.includes(this.cursor)) this.cursor = this.anchor;
  }
  select(index: number) { if (!this.ids[index]) return false; this.anchor = this.ids[index]; this.cursor = this.anchor; return true; }
  snapshot(): SequenceSnapshot { return { points: this.points.map(p => ({ ...p })), ids: [...this.ids], anchor: this.anchor, cursor: this.cursor }; }
  restore(saved: SequenceSnapshot) {
    const anchor = this.anchor;
    this.points = saved.points.map(p => ({ ...p })); this.ids = [...saved.ids];
    if (anchor === null || !this.ids.includes(anchor)) this.stop();
    else { this.anchor = anchor; this.cursor = saved.anchor === anchor && saved.cursor !== null && this.ids.includes(saved.cursor) ? saved.cursor : anchor; }
  }
  candidate(additions: InputPoint[], closed: boolean) {
    const logical = logicalPoints(this.points, closed);
    const at = this.active ? this.index + 1 : logical.length;
    if (at < 0 || (this.active && this.index < 0)) throw new Error('插入目标已失效，请重新选择。');
    const points = [...this.points.slice(0, at), ...additions.map(p => ({ ...p })), ...this.points.slice(at)];
    return { points, at };
  }
  append(additions: InputPoint[], closed: boolean) {
    const { points, at } = this.candidate(additions, closed);
    const fresh = additions.map(() => ++this.serial);
    this.ids.splice(at, 0, ...fresh); this.points = points;
    if (this.active && fresh.length) this.cursor = fresh[fresh.length - 1];
    return points;
  }
}

export type PointEditHistory = { points: InputPoint[]; undo: InputPoint[][]; redo: InputPoint[][] };
export function applyPointEdit(history: PointEditHistory, points: InputPoint[]): PointEditHistory {
  if (equalPoints(history.points, points)) return history;
  return { points, undo: [...history.undo, history.points], redo: [] };
}
export function undoPointEdit(history: PointEditHistory, redo = false): PointEditHistory {
  const source = redo ? history.redo : history.undo;
  if (!source.length) return history;
  return redo ? { points: source[source.length - 1], undo: [...history.undo, history.points], redo: source.slice(0, -1) }
    : { points: source[source.length - 1], undo: source.slice(0, -1), redo: [...history.redo, history.points] };
}
