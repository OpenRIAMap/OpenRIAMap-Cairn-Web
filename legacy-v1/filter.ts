import { getOpenRIAMapClassConfigs } from './core/project/openriamapRiaClasses';
import { readMultipartGeometry, geometryTypeFromFeatureType } from './core/geometry/multipartGeometry';
import type { RuleWorldDataset } from './components/Rules/data/sourceTypes';

export const legacyDataDiagnostics = { unknown: 0, malformed: 0 };
/** Filter before datasets enter render, search, navigation and reference stores. */
export function filterLegacyDataset(dataset: RuleWorldDataset): RuleWorldDataset {
  return { ...dataset, features: dataset.features.filter(record => {
    const definition = getOpenRIAMapClassConfigs().find(item => item.classCode === record.Class);
    if (!definition) { legacyDataDiagnostics.unknown++; return false; }
    const options = definition.classification?.options ?? [];
    const actual = [record.Kind, record.SKind ?? record.Skind, record.SKind2 ?? record.Skind2].map(value => String(value ?? ''));
    if(record.Class==='ROD'&&actual[1]==='NOM'&&(!actual[2]||actual[2]==='NOM')&&!options.some(option=>option.kind===actual[0]&&option.skind===actual[1]&&String(option.skind2??'')===actual[2])){actual[1]='';actual[2]='';}
    const option=options.find(option => [option.kind, option.skind, option.skind2].every((value, index) => String(value ?? '') === actual[index]));
    if (!option && (actual.some(Boolean) || definition.classification?.required)) {
      legacyDataDiagnostics.unknown++; return false;
    }
    const expected = option?.drawMode==='point'?'Point':option?.drawMode==='polyline'?'LineString':option?.drawMode==='polygon'?'Polygon':definition.geometry.type;
    if (geometryTypeFromFeatureType(record.Type) !== expected) { legacyDataDiagnostics.unknown++; return false; }
    try {
      const geometry = readMultipartGeometry(record, expected, definition.geometry.sourceField);
      if (!geometry.geometry || geometry.error) { legacyDataDiagnostics.malformed++; return false; }
    } catch { legacyDataDiagnostics.malformed++; return false; }
    return true;
  }) };
}
