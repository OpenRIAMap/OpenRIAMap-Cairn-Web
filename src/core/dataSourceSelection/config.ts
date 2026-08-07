import {
  DATA_SOURCE_SELECTION_CONFIG_SCHEMA_VERSION,
  type DataSourceDefinition,
  type DataSourceSelectionConfig,
  type DataSourceSelectionMode,
  type DataSourceSelectionPolicy,
} from './contracts';
import { validateDataSourceSelectionConfig } from './controller';

type UnknownRecord = Record<string, unknown>;

function fail(message: string): never {
  throw new Error(`data-source-selection-config:${message}`);
}

function record(value: unknown, field: string): UnknownRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${field}-must-be-an-object`);
  return value as UnknownRecord;
}

function nonEmptyString(value: unknown, field: string): string {
  const normalized = typeof value === 'string' ? value.trim() : '';
  if (!normalized) fail(`${field}-must-be-a-non-empty-string`);
  return normalized;
}

function boolean(value: unknown, field: string): boolean {
  if (typeof value !== 'boolean') fail(`${field}-must-be-a-boolean`);
  return value;
}

function selectionMode(value: unknown): DataSourceSelectionMode {
  if (value === 'fixed' || value === 'user-select' || value === 'user-select-on-failure') return value;
  fail('policy.selectionMode-is-invalid');
}

function source(value: unknown, index: number): DataSourceDefinition {
  const item = record(value, `sources[${index}]`);
  const parsed: DataSourceDefinition = {
    id: nonEmptyString(item.id, `sources[${index}].id`),
    label: nonEmptyString(item.label, `sources[${index}].label`),
    readerKind: nonEmptyString(item.readerKind, `sources[${index}].readerKind`),
  };
  if ('enabled' in item) parsed.enabled = boolean(item.enabled, `sources[${index}].enabled`);
  if ('selectable' in item) parsed.selectable = boolean(item.selectable, `sources[${index}].selectable`);
  return parsed;
}

function policy(value: unknown): DataSourceSelectionPolicy {
  const item = record(value, 'policy');
  const parsed: DataSourceSelectionPolicy = {
    defaultSourceId: nonEmptyString(item.defaultSourceId, 'policy.defaultSourceId'),
    selectionMode: selectionMode(item.selectionMode),
    requireExplicitApply: boolean(item.requireExplicitApply, 'policy.requireExplicitApply'),
    automaticFallback: boolean(item.automaticFallback, 'policy.automaticFallback') as false,
    clearCacheOnApply: nonEmptyString(item.clearCacheOnApply, 'policy.clearCacheOnApply') as 'source-dependent',
    retryOnFailure: boolean(item.retryOnFailure, 'policy.retryOnFailure'),
  };
  if (parsed.requireExplicitApply !== true) fail('policy.requireExplicitApply-must-be-true');
  if (parsed.automaticFallback !== false) fail('policy.automaticFallback-must-be-false');
  if (parsed.clearCacheOnApply !== 'source-dependent') fail('policy.clearCacheOnApply-is-invalid');
  return parsed;
}

export function parseDataSourceSelectionConfig(input: unknown): DataSourceSelectionConfig {
  const root = record(input, 'root');
  if (root.schemaVersion !== DATA_SOURCE_SELECTION_CONFIG_SCHEMA_VERSION) fail('schemaVersion-is-invalid');
  if (!Array.isArray(root.sources)) fail('sources-must-be-an-array');
  const parsed: DataSourceSelectionConfig = {
    schemaVersion: DATA_SOURCE_SELECTION_CONFIG_SCHEMA_VERSION,
    storageKey: nonEmptyString(root.storageKey, 'storageKey'),
    sources: root.sources.map(source),
    policy: policy(root.policy),
  };
  validateDataSourceSelectionConfig(parsed.sources, parsed.policy);
  return parsed;
}
