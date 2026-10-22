import { readMultipartGeometry, validateMultipartGeometry, type MultipartGeometryKind } from '../geometry/multipartGeometry';

/** All navigation consumers share the map's canonical/legacy conflict checks.
 * Algorithms still accept one component; never silently flatten geometry. */
export function readNavigationGeometry(record: Record<string, unknown>, kind: MultipartGeometryKind) {
  // Keep historical navigation aliases, but let the existing reader parse and
  // compare them; aliases may never hide invalid canonical/standard fields.
  const aliases = (kind==='Point'?['center','Coord','coord']:kind==='LineString'?['plpoints','points']:['conpoints','flrpoints','points','Points']).filter(key=>Object.prototype.hasOwnProperty.call(record,key));
  const reads = [readMultipartGeometry(record, kind),...aliases.map(key=>readMultipartGeometry(record,kind,key))];
  const read = reads.find(value=>value.geometry)??reads[0];
  const conflict = reads.some(value=>value.geometry&&JSON.stringify(value.geometry)!==JSON.stringify(read.geometry));
  const invalid = reads.find(value=>value.error)?.error ?? (conflict?'geometry-field-conflict':validateMultipartGeometry(read.geometry));
  const fail = (reason: string): never => { throw Error(`${String(record.ID ?? record.Name ?? '未知要素')} 的导航几何无法安全解析：${reason}。`); };
  if (invalid || !read.geometry) return fail(invalid ?? '缺少几何坐标');
  if (read.geometry.parts.length !== 1) return fail('仅支持单部件导航几何');
  if (read.geometry.type === 'Polygon' && read.geometry.parts[0].length !== 1) return fail('导航暂不支持含内洞的车站建筑');
  return read.geometry;
}
export function navigationPoint(record: Record<string, unknown>) {
  const geometry = readNavigationGeometry(record, 'Point');
  if (geometry.type !== 'Point') throw Error('导航几何类型不符');
  return geometry.parts[0];
}
export function navigationLine(record: Record<string, unknown>) {
  const geometry = readNavigationGeometry(record, 'LineString');
  if (geometry.type !== 'LineString') throw Error('导航几何类型不符');
  return geometry.parts[0];
}
export function navigationPolygon(record: Record<string, unknown>) {
  const geometry = readNavigationGeometry(record, 'Polygon');
  if (geometry.type !== 'Polygon') throw Error('导航几何类型不符');
  return geometry.parts[0][0];
}
