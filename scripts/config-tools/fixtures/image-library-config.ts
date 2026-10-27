import { migratePackageToC17 } from '../../../src/configStudio/contractMigration';
import { editableGeometryProfile } from '../../../src/configStudio/renderRuleTemplates';
import { basePointFromLegacy, defaultSymbolPlacement } from '../../../src/configStudio/pointSymbol';
import { defaultHalo } from '../../../src/configStudio/halo';
import type { ConfigPackageV3, ImagePresentation } from '../../../src/configStudio/types';

export const imageLibraryPresentation = (): ImagePresentation => ({ sizePx: { width: 24, height: 28 }, placement: { ...defaultSymbolPlacement(), offsetPx: { x: 2.5, y: -3 } }, halo: defaultHalo() });
/** Test-only point: the actual editor, previews and codecs consume normal config. */
export function imageLibraryFixture(base: ConfigPackageV3): ConfigPackageV3 {
  const config = migratePackageToC17(base).config;
  const profile = editableGeometryProfile('Point', 17), rule = profile.zoomPriority.rules[0];
  rule.id = 'image-library-rule'; rule.when = { zoom: { min: 0, max: 8 } }; rule.representation = 'geometry';
  rule.style = { pointSymbol: { kind: 'externalImage', image: { mode: 'fixed', sourceForm: 'library', url: '/image-library/N1.png', presentation: imageLibraryPresentation() }, fallback: basePointFromLegacy({}, 17) } };
  profile.zoomPriority.rules = [rule];
  config.nodes.push({ nodeId: 'image-library-test', path: { class: 'IMGTEST' }, geometryType: 'Point', children: [], geometryProfiles: { Point: profile }, fields: [
    { fieldId: 'image-test-name', key: 'Name', type: 'string', cardinality: 'single', input: 'text', required: true, labels: { zh: '图片测试', en: 'Image test' }, description: { zh: '', en: '' } },
    { fieldId: 'image-test-choice', key: 'Choice', type: 'string', cardinality: 'single', input: 'text', labels: { zh: '图片分类', en: 'Image choice' }, description: { zh: '', en: '' } },
  ] });
  return config;
}
