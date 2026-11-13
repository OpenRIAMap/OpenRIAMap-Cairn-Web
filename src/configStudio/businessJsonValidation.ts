import { readableClassification } from '../configRuntime/classificationCompatibility';
import { pathsMatch } from '../core/project/navigationDefinition';
import { externalRolePaths } from './externalBindings';
import { recordCategory } from './multipartPolicy';
import { classificationPathKey, resolveCardConfiguration } from './runtime';
import type { ConfigPackageV3, ConfigValidationIssue, MountedFeatureRecord, ValueSchema } from './types';
import { validateStructuredValue, VALUE_SCHEMA_TEMPLATES } from './valueSchema';

export const stationReferenceFields = ['Stations', 'stations', 'stationsgroup', 'stationsGroup', 'StationsGroup', 'Stationsgroup'];
export const railLineFields = ['lines', 'Lines', 'LINES', 'LINEs'];
export const railPlatformFields = ['platforms', 'Platforms', 'PLFS', 'PLFs'];
export const connectFields = ['ConnectL', 'connectL'];
export const blacklistFields = ['Blacklist', 'blacklist'];
export const modeFields = ['Mode', 'mode'];

export function firstBusinessField(record: MountedFeatureRecord, names: string[]): unknown {
  for (const name of names) if (record[name] != null) return record[name];
  return undefined;
}

const text: ValueSchema = { type: 'string' };
const number: ValueSchema = { type: 'number' };
const textOrNumber: ValueSchema = { anyOf: [text, number] };
const tradeItems: ValueSchema = {
  type: 'array',
  items: { type: 'object', required: ['Name', 'Count'], properties: {
    Name: text, Count: textOrNumber, Img: text, ItemID: text, Brief: text,
  } },
};
const tradeSchema: ValueSchema = {
  type: 'array',
  items: { type: 'object', required: ['OfferItems', 'ReceiveItems'], properties: {
    TradeNum: textOrNumber, Note: textOrNumber, OfferItems: tradeItems, ReceiveItems: tradeItems,
  } },
};

export const businessJsonTemplateByField: Readonly<Record<string, string>> = {
  ...Object.fromEntries(railLineFields.map(key => [key, 'rail-lines'])),
  ...Object.fromEntries(railPlatformFields.map(key => [key, 'rail-platforms'])),
  ...Object.fromEntries(stationReferenceFields.map(key => [key, 'rail-stations'])),
  ...Object.fromEntries(connectFields.map(key => [key, 'road-connections'])),
  ...Object.fromEntries(blacklistFields.map(key => [key, 'road-blacklist'])),
  ...Object.fromEntries(modeFields.map(key => [key, 'road-modes'])),
  TGTcoordinate: 'target-point',
};

/** Checks the actual fields consumed by the business features, without a
 * database snapshot. Reference resolution remains part of publication. */
export function validateBusinessJsonRecords(config: ConfigPackageV3, records: readonly MountedFeatureRecord[]): ConfigValidationIssue[] {
  if (config.contractRevision < 20 || !records.length) return [];
  const shared = config.application?.preferences.railwayRoles?.selectors;
  const nav = config.application?.navigation;
  const tradePaths = new Set(config.workflows
    .filter(workflow => ['tradePointWorkflow', 'tradePointEditor'].includes(workflow.external?.componentKey ?? ''))
    .flatMap(workflow => {
      try {
        return externalRolePaths(config, workflow, 'tradePoint').map(classificationPathKey);
      } catch {
        // Workflow validation reports incomplete role bindings separately.
        return [];
      }
    }));
  const checksByPath = new Map<string, Array<[string, ValueSchema]>>();
  const result: ConfigValidationIssue[] = [];

  for (const record of records) {
    const raw = recordCategory(record);
    const path = readableClassification(config, raw) ?? raw;
    const pathKey = classificationPathKey(path);
    let checks = checksByPath.get(pathKey);
    if (!checks) {
      const selected: Array<[string, ValueSchema]> = [];
      const add = (keys: string[]) => {
        for (const key of keys) selected.push([key, VALUE_SCHEMA_TEMPLATES[businessJsonTemplateByField[key]].schema]);
      };
      const card = resolveCardConfiguration(config, path, false);
      if (tradePaths.has(pathKey) || card?.mode === 'component' && card.componentKey === 'TRP') {
        selected.push(['Trade', tradeSchema], ['trade', tradeSchema]);
      }
      const inRailRole = (role: 'platforms' | 'stationAreas' | 'stations') =>
        (shared && pathsMatch(shared[role], path)) || (nav && pathsMatch(nav.rail.selectors[role], path));
      if (inRailRole('platforms')) add(railLineFields);
      if (inRailRole('stationAreas')) add(railPlatformFields);
      if (inRailRole('stations')) add(stationReferenceFields);
      if (nav && pathsMatch(nav.road.selectors.roads, path)) {
        add(connectFields);
        add(blacklistFields);
        add(modeFields);
      }
      if (nav && pathsMatch(nav.teleport.selectors.teleportPoints, path)) add(['TGTcoordinate']);
      checks = selected;
      checksByPath.set(pathKey, selected);
    }
    const id = String(record.ID ?? '');
    const worldId = config.application?.worlds.find(world =>
      [world.id, world.prefix, String(world.numericCode), world.label.zh, world.label.en].includes(String(record.World)))?.id;
    for (const [field, schema] of checks) {
      if (record[field] === undefined) continue;
      for (const message of validateStructuredValue(record[field], schema, field, true)) {
        const separator = message.indexOf('：');
        const location = message.slice(0, separator);
        result.push({ severity: 'error', code: 'business-json-invalid', field, worldId,
          path: 'mounted/' + id + '/' + location, message,
          affectedFeatures: [{ id, name: String(record.Name ?? id) }] });
      }
    }
  }
  return result;
}
