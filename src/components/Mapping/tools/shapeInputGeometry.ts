import { equalPoint, type InputPoint } from './pointSequence';
export type ShapeKind = 'circle' | 'ellipse' | 'square' | 'rectangle' | 'polygon';
export type ShapeModel = { kind: ShapeKind; center: InputPoint; radius: number; rx: number; rz: number; width: number; height: number; sides: number; angle: number; vertices?: InputPoint[] };
export function newShape(kind: ShapeKind, center: InputPoint, radius = 10, sides = 6): ShapeModel {
  return { kind, center: { ...center }, radius, rx: radius, rz: radius, width: radius * 2, height: radius * 2, sides, angle: 0 };
}
export const rotatePoint = (p: InputPoint, degrees: number): InputPoint => {
  const a = degrees * Math.PI / 180; return { x: p.x * Math.cos(a) - p.z * Math.sin(a), z: p.x * Math.sin(a) + p.z * Math.cos(a), y: p.y };
};
export function shapeVertices(model: ShapeModel): InputPoint[] {
  if (model.vertices) return model.vertices;
  if (model.kind === 'square' || model.kind === 'rectangle') {
    const w = model.kind === 'square' ? model.radius : model.width / 2, h = model.kind === 'square' ? model.radius : model.height / 2;
    return [{ x: w, z: h }, { x: -w, z: h }, { x: -w, z: -h }, { x: w, z: -h }];
  }
  const n = model.kind === 'polygon' ? model.sides : 512;
  const rx = model.kind === 'ellipse' ? model.rx : model.radius, rz = model.kind === 'ellipse' ? model.rz : model.radius;
  return Array.from({ length: n }, (_, i) => ({ x: rx * Math.cos(i * Math.PI * 2 / n), z: rz * Math.sin(i * Math.PI * 2 / n) }));
}
export const worldShapePoints = (model: ShapeModel, local = shapeVertices(model)) => local.map(point => {
  const rot = rotatePoint(point, model.angle); return { x: rot.x + model.center.x, z: rot.z + model.center.z, y: model.center.y };
});
const length = (a: InputPoint, b: InputPoint) => Math.hypot(a.x - b.x, a.z - b.z);
const quantise = (n: number) => Math.round((n + Number.EPSILON) * 10) / 10;
export function shapeInputError(model: ShapeModel, count: number): string | undefined {
  if (![model.center.x, model.center.z, model.center.y ?? 0, model.angle, model.radius, model.rx, model.rz, model.width, model.height].every(Number.isFinite)) return '坐标和尺寸必须是有效数字';
  if (Math.min(model.radius, model.rx, model.rz, model.width, model.height) <= 0) return '半径及尺寸必须大于 0';
  if (!Number.isInteger(model.sides) || model.sides < 3 || model.sides > 256) return '多边形边数应为 3–256 的整数';
  const minimum = ['circle', 'ellipse'].includes(model.kind) ? 8 : model.kind === 'polygon' ? model.sides : 4;
  if (!Number.isInteger(count) || count < minimum || count > 4096) return `输出控制点数量应为 ${minimum}–4096 的整数`;
}
/** Corner-preserving sampling: exact count, at least one segment per edge. */
export function sampleShape(model: ShapeModel, count: number, line = false): InputPoint[] {
  const error = shapeInputError(model, count); if (error) throw Error(error);
  const vertices = shapeVertices(model), lengths = vertices.map((p, i) => length(p, vertices[(i + 1) % vertices.length]));
  const perimeter = lengths.reduce((a, b) => a + b, 0); if (!perimeter) throw Error('图形已退化');
  let local: InputPoint[];
  if (model.kind === 'circle' || model.kind === 'ellipse') {
    const acc = [0]; for (const d of lengths) acc.push(acc[acc.length - 1] + d);
    let edge = 0;
    local = Array.from({ length: count }, (_, i) => {
      const distance = i * perimeter / count;
      while (edge < vertices.length - 1 && acc[edge + 1] < distance) edge++;
      const a = vertices[edge], b = vertices[(edge + 1) % vertices.length], t = (distance - acc[edge]) / (lengths[edge] || 1);
      return { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t };
    });
  } else {
    const extras = count - vertices.length, allocation = lengths.map(d => Math.floor(extras * d / perimeter));
    const order = lengths.map((d, i) => ({ i, remainder: extras * d / perimeter - allocation[i] })).sort((a, b) => b.remainder - a.remainder || a.i - b.i);
    const remaining = extras - allocation.reduce((a, b) => a + b, 0); for (let i = 0; i < remaining; i++) allocation[order[i].i]++;
    local = vertices.flatMap((a, i) => Array.from({ length: allocation[i] + 1 }, (_, j) => {
      const b = vertices[(i + 1) % vertices.length], t = j / (allocation[i] + 1); return { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t };
    }));
  }
  const points = worldShapePoints(model, local).map(p => ({ ...p, x: quantise(p.x), z: quantise(p.z) }));
  if (points.some((p, i) => equalPoint(p, points[(i + 1) % points.length]))) throw Error('当前尺寸和点数在 0.1 精度下产生重复点，请调整尺寸或点数');
  const invalid = validateSimpleOutline(points); if (invalid) throw Error(invalid);
  return line ? [...points, { ...points[0] }] : points;
}
export function validateSimpleOutline(points: InputPoint[]): string | undefined {
  const cross = (a: InputPoint, b: InputPoint, c: InputPoint) => (b.x - a.x) * (c.z - a.z) - (b.z - a.z) * (c.x - a.x);
  const area = points.reduce((sum, p, i) => sum + p.x * points[(i + 1) % points.length].z - p.z * points[(i + 1) % points.length].x, 0);
  if (Math.abs(area) < 1e-8) return '图形面积为 0，不能输入';
  for (let i = 0; i < points.length; i++) for (let j = i + 2; j < points.length; j++) {
    if (i === 0 && j === points.length - 1) continue;
    const a = points[i], b = points[(i + 1) % points.length], c = points[j], d = points[(j + 1) % points.length];
    if (cross(a, b, c) * cross(a, b, d) < -1e-10 && cross(c, d, a) * cross(c, d, b) < -1e-10) return '图形边界自交，请调整手柄';
  }
}
