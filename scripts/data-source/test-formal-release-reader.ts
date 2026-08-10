import {
  FormalReleaseReaderError,
  loadFormalWorldFeatures,
  loadFormalWorldRuleDataset,
  resolveFormalWorldRelease,
  type FormalReleaseFetchJson,
} from '../../src/components/Rules/data/formalReleaseReader';
import type { RuleDataSourceSnapshot } from '../../src/components/Rules/data/formalDataSourceRuntime';

function expect(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const source: RuleDataSourceSnapshot = {
  sourceId: 'formal-test',
  label: 'Formal test source',
  readerKind: 'formal-release-v2',
  readerSchemaVersion: 'openriamap.formal-release-reader.v2',
  rootUrl: 'https://example.invalid',
  transportId: 'direct:https://example.invalid',
  generation: 0,
};

const objects: Record<string, unknown> = {
  'current/worlds/_release-set.json': {
    schemaVersion: 'openriamap.current-release-set.v2',
    releaseId: 'release-1',
    formalVersion: 1,
    worlds: ['zth'],
  },
  'current/worlds/zth.json': {
    schemaVersion: 'openriamap.current-world.v2',
    worldId: 'zth',
    releaseId: 'release-1',
    formalVersion: 1,
    worldManifestKey: 'releases/release-1/manifests/worlds/zth.json',
  },
  'releases/release-1/manifests/worlds/zth.json': {
    schemaVersion: 'openriamap.world-release-manifest.v2',
    worldId: 'zth',
    releaseId: 'release-1',
    chunkCatalogKeys: ['releases/release-1/manifests/worlds/zth-chunk-catalog-001.json'],
  },
  'releases/release-1/manifests/worlds/zth-chunk-catalog-001.json': {
    schemaVersion: 'openriamap.world-chunk-catalog.v2',
    worldId: 'zth',
    releaseId: 'release-1',
    chunks: [
      { key: 'releases/release-1/data-merge/zth/zth-chunk-001.json' },
      { key: 'releases/release-1/data-merge/zth/zth-chunk-002.json' },
    ],
  },
  'releases/release-1/data-merge/zth/zth-chunk-001.json': {
    schemaVersion: 'openriamap.world-merge-chunk.v2',
    worldId: 'zth',
    features: [{ featureId: 'a', record: { ID: 'a', Class: 'STN' } }],
  },
  'releases/release-1/data-merge/zth/zth-chunk-002.json': {
    schemaVersion: 'openriamap.world-merge-chunk.v2',
    worldId: 'zth',
    features: [{ featureId: 'b', record: { ID: 'b', Class: 'RMP' } }],
  },
};

const fetchJson: FormalReleaseFetchJson = async <T>(key) => {
  if (!(key in objects)) throw new Error(`unexpected object key: ${key}`);
  return objects[key] as T;
};

const release = await resolveFormalWorldRelease({ source, worldId: 'zth', fetchJson });
expect(release.releaseId === 'release-1', 'release id mismatch');
expect(release.formalVersion === 1, 'formal version mismatch');

const features = await loadFormalWorldFeatures({ source, release, fetchJson });
expect(features.length === 2 && features[0].ID === 'a' && features[1].ID === 'b', 'feature records were not unwrapped');

const dataset = await loadFormalWorldRuleDataset({ source, worldId: 'zth', fetchJson });
expect(dataset.releaseId === 'release-1', 'dataset release id mismatch');
expect(dataset.formalVersion === 1, 'dataset formal version mismatch');
expect(dataset.sourceId === 'formal-test', 'dataset source scope mismatch');
expect(dataset.readerSchemaVersion === source.readerSchemaVersion, 'dataset schema scope mismatch');

const mismatched = { ...objects, 'current/worlds/zth.json': { ...(objects['current/worlds/zth.json'] as object), releaseId: 'release-2' } };
const mismatchFetch: FormalReleaseFetchJson = async <T>(key) => mismatched[key] as T;
try {
  await resolveFormalWorldRelease({ source, worldId: 'zth', fetchJson: mismatchFetch });
  throw new Error('release mismatch unexpectedly passed');
} catch (error) {
  expect(error instanceof FormalReleaseReaderError && error.stage === 'world-pointer', 'release mismatch did not identify the pointer stage');
}

console.log('Formal release reader test: PASS');
