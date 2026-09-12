import assert from 'node:assert/strict';
import { formalMediaUrl, loadFormalMediaAssets } from '../../src/components/Rules/data/formalMediaReader';
import type { RuleDataSourceSnapshot } from '../../src/components/Rules/data/formalDataSourceRuntime';

const source: RuleDataSourceSnapshot = {
  sourceId: 'formal-cos',
  label: 'Formal',
  readerKind: 'formal-release-v2',
  readerSchemaVersion: 'openriamap.formal-release-reader.v2',
  rootUrl: 'https://example.invalid/data',
  mediaRootUrl: 'https://example.invalid/media',
  transportId: 'direct:test',
  generation: 1,
};

const releaseId = 'review-aaaaaaaaaaaaaaaaaaaa';
const key = `releases/${releaseId}/media-index-merge/zth/feature-index/ISG/NGF/INDEX.json`;
const mediaKey = `worlds/zth/assets/${'a'.repeat(64)}/display/greenland.png`;
const assets = await loadFormalMediaAssets({
  source,
  releaseId,
  worldId: 'zth',
  classCode: 'ISG',
  kindPath: ['NGF'],
  featureId: 'greenland',
  fetchJson: async <T>(requestedKey: string) => {
    assert.equal(requestedKey, key);
    return {
      schemaVersion: 'openriamap.world-media-feature-index.v1',
      releaseId,
      worldId: 'zth',
      category: 'ISG/NGF',
      assetsByFeature: {
        greenland: [{ sourcePath: 'Picture/zth/ISG/NGF/greenland/greenland.png', key: mediaKey, sha256: 'a'.repeat(64), byteLength: 4, contentType: 'image/png', role: 'display', order: 1 }],
      },
    } as T;
  },
});
assert.equal(assets.length, 1);
assert.equal(formalMediaUrl(source.mediaRootUrl!, assets[0].key), `https://example.invalid/media/${mediaKey}`);
console.log('Formal media reader test: PASS');
