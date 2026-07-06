import { getFormatRuntimeContractByClassCode } from './formatRuntimeContracts';
import type { CairnMapFormatExecutor, CairnMapFormatExecutorBuildArgs } from './formatExecutorTypes';

const normalize = (value: unknown): string => String(value ?? '').trim();
const normalizeClassCode = (value: unknown): string => normalize(value).toUpperCase();

type BaseFormatDef = {
  buildFeatureInfo: (args: CairnMapFormatExecutorBuildArgs) => Record<string, unknown>;
  hydrate: (featureInfo: unknown) => { values: Record<string, unknown>; groups: Record<string, unknown[]> };
  coordsFromFeatureInfo: (featureInfo: unknown) => unknown[];
  validateImportItem?: (item: unknown) => string | undefined;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const finiteNumber = (value: unknown): number | undefined => {
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
};

const DEFAULT_COORD_Y = -64;

const isEmptyValue = (value: unknown): boolean =>
  value === undefined || value === null || (typeof value === 'string' && value.trim().length === 0);

const orderedPoint = (value: unknown): { x: number; y: number; z: number } | undefined => {
  if (!isObject(value)) return undefined;
  const x = finiteNumber(value.x);
  const z = finiteNumber(value.z);
  if (x === undefined || z === undefined) return undefined;
  const y = finiteNumber(value.y) ?? DEFAULT_COORD_Y;
  return { x, y, z };
};

const orderedLinePoint = (value: unknown): [number, number, number] | undefined => {
  if (Array.isArray(value)) {
    const x = finiteNumber(value[0]);
    const z = value.length >= 3 ? finiteNumber(value[2]) : finiteNumber(value[1]);
    if (x === undefined || z === undefined) return undefined;
    const y = value.length >= 3 ? finiteNumber(value[1]) : undefined;
    return [x, y ?? DEFAULT_COORD_Y, z];
  }
  const point = orderedPoint(value);
  return point ? [point.x, point.y, point.z] : undefined;
};

const orderedLinePoints = (value: unknown): Array<[number, number, number]> | undefined => {
  if (!Array.isArray(value)) return undefined;
  const points = value
    .map(orderedLinePoint)
    .filter((point): point is [number, number, number] => Boolean(point));
  return points.length > 0 ? points : undefined;
};

const compactObject = (value: Record<string, unknown>): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const [key, raw] of Object.entries(value)) {
    if (!isEmptyValue(raw)) out[key] = raw;
  }
  return out;
};

const compactRows = (value: unknown): Record<string, unknown>[] | undefined => {
  if (!Array.isArray(value)) return undefined;
  const rows = value
    .map((row) => {
      if (isObject(row)) return compactObject(row);
      if (typeof row === 'string' || typeof row === 'number') return { ID: String(row) };
      return {};
    })
    .filter((row) => Object.keys(row).length > 0);
  return rows.length > 0 ? rows : undefined;
};

const normalizeRoadRows = (out: Record<string, unknown>): void => {
  const connectL = compactRows(out.ConnectL ?? out.connectL);
  if (connectL) {
    out.ConnectL = connectL
      .map((row) => {
        const mode = normalize(row.mode || row.Mode) || 'endpoint';
        const tgt = normalize(row.tgt || row.TGT || row.ID || row.id);
        return tgt ? { mode, tgt } : null;
      })
      .filter((row): row is { mode: string; tgt: string } => Boolean(row));
  } else {
    delete out.ConnectL;
  }

  const blacklist = compactRows(out.Blacklist ?? out.blacklist);
  if (blacklist) {
    out.Blacklist = blacklist
      .map((row) => {
        const tgt = normalize(row.tgt || row.TGT || row.ID || row.id);
        return tgt ? { tgt } : null;
      })
      .filter((row): row is { tgt: string } => Boolean(row));
  } else {
    delete out.Blacklist;
  }

  const rawMode = out.Mode ?? out.mode;
  if (Array.isArray(rawMode)) {
    const modes = rawMode
      .map((row) => {
        if (isObject(row)) return normalize(row.code || row.Code || row.ID || row.id);
        if (Array.isArray(row)) return normalize(row[0]);
        return normalize(row);
      })
      .filter(Boolean)
      .map((code) => ({ code }));
    if (modes.length > 0) out.Mode = modes;
    else delete out.Mode;
  } else if (!isEmptyValue(rawMode)) {
    out.Mode = [{ code: normalize(rawMode) }];
  } else {
    delete out.Mode;
  }
};

const parseJsonArray = (value: unknown): unknown[] | undefined => {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string' || value.trim().length === 0) return undefined;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

const normalizeRailRelations = (out: Record<string, unknown>): void => {
  const platforms = compactRows(out.platforms ?? out.Platforms ?? out.PLFS ?? out.PLFs);
  if (platforms) {
    out.platforms = platforms
      .map((row) => {
        const ID = normalize(row.ID || row.id || row.platformId || row.PlatformID);
        return ID ? { ID } : null;
      })
      .filter((row): row is { ID: string } => Boolean(row));
  }

  const lines = compactRows(out.lines ?? out.Lines);
  if (lines) {
    out.lines = lines
      .map((row) => {
        const ID = normalize(row.ID || row.id || row.lineId || row.LineID);
        if (!ID) return null;
        return compactObject({
          ID,
          stationCode: finiteNumber(row.stationCode),
          stationDistance: finiteNumber(row.stationDistance),
          Avaliable: row.Avaliable ?? true,
          Overtaking: row.Overtaking ?? false,
          getin: row.getin ?? true,
          getout: row.getout ?? true,
          NextOT: row.NextOT ?? false,
        });
      })
      .filter((row): row is Record<string, unknown> => Boolean(row));
  }

  const floors = compactRows(out.Floors ?? out.floors);
  if (floors) {
    out.Floors = floors
      .map((row) => {
        const ID = normalize(row.ID || row.id || row.floorId || row.FloorID);
        const Group = normalize(row.Group || row.group);
        return compactObject({ ID, Group });
      })
      .filter((row) => Object.keys(row).length > 0);
  }

  const stations = compactRows(out.stations ?? out.Stations);
  if (stations) {
    out.stations = stations
      .map((row) => {
        const ID = normalize(row.ID || row.id || row.stationId || row.StationID);
        return ID ? { ID } : null;
      })
      .filter((row): row is { ID: string } => Boolean(row));
  }
};

const normalizeKnownGeometryFields = (out: Record<string, unknown>): void => {
  const coord = orderedPoint(out.coordinate);
  if (coord) out.coordinate = coord;
  for (const key of ['Linepoints', 'Conpoints', 'PLpoints', 'Flrpoints']) {
    const points = orderedLinePoints(out[key]);
    if (points) out[key] = points;
  }
};

const passthroughExecutor = (key: string, description: string): CairnMapFormatExecutor => ({
  key,
  runtimeStatus: 'passthrough',
  description,
});

const coordinateProfileExecutor = (spec: {
  key: string;
  description: string;
  normalizeOut?: (out: Record<string, unknown>) => void;
}): CairnMapFormatExecutor => ({
  key: spec.key,
  runtimeStatus: 'active',
  description: spec.description,
  buildFeatureInfo: (args, context) => {
    const baseDef = context.baseDef as BaseFormatDef;
    const out = baseDef.buildFeatureInfo(args);
    normalizeKnownGeometryFields(out);
    spec.normalizeOut?.(out);
    return out;
  },
  hydrate: (featureInfo, context) => {
    const baseDef = context.baseDef as BaseFormatDef;
    const hydrated = baseDef.hydrate(featureInfo);
    const info = isObject(featureInfo) ? featureInfo : {};
    if (isObject(info.coordinate)) {
      const coord = orderedPoint(info.coordinate);
      if (coord) hydrated.values.elevation = hydrated.values.elevation ?? coord.y;
    }
    return hydrated;
  },
  coordsFromFeatureInfo: (featureInfo, context) => {
    const baseDef = context.baseDef as BaseFormatDef;
    return baseDef.coordsFromFeatureInfo(featureInfo);
  },
  validateImportItem: (item, context) => {
    const baseDef = context.baseDef as BaseFormatDef;
    return baseDef.validateImportItem?.(item);
  },
});

const roadLineFormatter = coordinateProfileExecutor({
  key: 'roadLineFormatter',
  description: 'Normalizes ROD Linepoints and relation arrays while keeping config as the field authority.',
  normalizeOut: normalizeRoadRows,
});

const stationFormatter = coordinateProfileExecutor({
  key: 'stationFormatter',
  description: 'Normalizes STA coordinate and platform relation arrays through a Cairn profile.',
  normalizeOut: normalizeRailRelations,
});

const platformFormatter = coordinateProfileExecutor({
  key: 'platformFormatter',
  description: 'Normalizes PLF coordinate and line relation arrays through a Cairn profile.',
  normalizeOut: normalizeRailRelations,
});

const stationBuildingFormatter = coordinateProfileExecutor({
  key: 'stationBuildingFormatter',
  description: 'Normalizes STB polygon coordinates and floor relation arrays through a Cairn profile.',
  normalizeOut: normalizeRailRelations,
});

const stationBuildingPointFormatter = coordinateProfileExecutor({
  key: 'stationBuildingPointFormatter',
  description: 'Normalizes SBP coordinate, floor, and station relation arrays through a Cairn profile.',
  normalizeOut: normalizeRailRelations,
});

const tradePointFormatter: CairnMapFormatExecutor = {
  key: 'tradePointFormatter',
  runtimeStatus: 'active',
  description: 'Builds and hydrates TRP Trade payload from Cairn config fields.',
  buildFeatureInfo: (args, context) => {
    const baseDef = context.baseDef as BaseFormatDef;
    const out = baseDef.buildFeatureInfo(args);
    normalizeKnownGeometryFields(out);
    const trade = parseJsonArray(args.values.Trade ?? out.Trade ?? args.values.TradeJSON ?? out.TradeJSON);
    if (trade) out.Trade = trade;
    delete out.TradeJSON;
    return out;
  },
  hydrate: (featureInfo, context) => {
    const baseDef = context.baseDef as BaseFormatDef;
    const hydrated = baseDef.hydrate(featureInfo);
    const info = isObject(featureInfo) ? featureInfo : {};
    const trade = parseJsonArray(info.Trade ?? info.TradeJSON);
    if (trade) hydrated.values.TradeJSON = JSON.stringify(trade, null, 2);
    if (isObject(info.coordinate)) {
      const coord = orderedPoint(info.coordinate);
      if (coord) hydrated.values.elevation = hydrated.values.elevation ?? coord.y;
    }
    return hydrated;
  },
  coordsFromFeatureInfo: (featureInfo, context) => {
    const baseDef = context.baseDef as BaseFormatDef;
    return baseDef.coordsFromFeatureInfo(featureInfo);
  },
  validateImportItem: (item, context) => {
    const baseDef = context.baseDef as BaseFormatDef;
    const baseError = baseDef.validateImportItem?.(item);
    if (baseError) return baseError;
    const info = isObject(item) ? item : {};
    const rawTrade = info.Trade ?? info.TradeJSON;
    if (rawTrade !== undefined && parseJsonArray(rawTrade) === undefined) return 'Trade / TradeJSON 必须是数组或数组 JSON 字符串';
    return undefined;
  },
};

const teleportPointFormatter: CairnMapFormatExecutor = {
  key: 'teleportPointFormatter',
  runtimeStatus: 'active',
  description: 'Builds and hydrates teleport target coordinates from Cairn form fields.',
  buildFeatureInfo: (args, context) => {
    const baseDef = context.baseDef as BaseFormatDef;
    const out = baseDef.buildFeatureInfo(args);
    const values = args.values ?? {};
    const warp = normalize(out.TGTWarp ?? values.TGTWarp);
    const existingTarget = isObject(out.TGTcoordinate) ? out.TGTcoordinate : {};
    const targetX = finiteNumber(values.TGT_x ?? out.TGT_x ?? existingTarget.x);
    const targetZ = finiteNumber(values.TGT_z ?? out.TGT_z ?? existingTarget.z);
    const targetY = finiteNumber(values.TGTelevation ?? out.TGTelevation ?? existingTarget.y) ?? DEFAULT_COORD_Y;

    if (warp) out.TGTWarp = warp;
    else delete out.TGTWarp;

    if (targetX !== undefined && targetZ !== undefined) {
      out.TGTcoordinate = { x: targetX, y: targetY, z: targetZ };
    }

    normalizeKnownGeometryFields(out);
    delete out.TGT_x;
    delete out.TGT_z;
    return out;
  },
  hydrate: (featureInfo, context) => {
    const baseDef = context.baseDef as BaseFormatDef;
    const hydrated = baseDef.hydrate(featureInfo);
    const info = isObject(featureInfo) ? featureInfo : {};
    const target = isObject(info.TGTcoordinate)
      ? info.TGTcoordinate
      : (isObject(info.tgtCoordinate) ? info.tgtCoordinate : (isObject(info.targetCoordinate) ? info.targetCoordinate : null));
    if (target) {
      hydrated.values.TGT_x = finiteNumber(target.x) ?? '';
      hydrated.values.TGT_z = finiteNumber(target.z) ?? '';
      hydrated.values.TGTelevation = hydrated.values.TGTelevation ?? finiteNumber(target.y) ?? '';
    }
    return hydrated;
  },
  validateImportItem: (item, context) => {
    const baseDef = context.baseDef as BaseFormatDef;
    const baseError = baseDef.validateImportItem?.(item);
    if (baseError) return baseError;
    const info = isObject(item) ? item : {};
    const hasWarp = Boolean(normalize(info.TGTWarp ?? info.tgtWarp));
    const target = isObject(info.TGTcoordinate)
      ? info.TGTcoordinate
      : (isObject(info.tgtCoordinate) ? info.tgtCoordinate : (isObject(info.targetCoordinate) ? info.targetCoordinate : null));
    const hasTargetObject = Boolean(target && finiteNumber(target.x) !== undefined && finiteNumber(target.z) !== undefined);
    const hasLegacyTargetFields = finiteNumber(info.TGT_x) !== undefined && finiteNumber(info.TGT_z) !== undefined;
    if (!hasWarp && !hasTargetObject && !hasLegacyTargetFields) {
      return '缺少 TGTWarp 或合法 TGTcoordinate.x / TGTcoordinate.z';
    }
    return undefined;
  },
};

const BUILTIN_FORMAT_EXECUTORS: CairnMapFormatExecutor[] = [
  tradePointFormatter,
  stationFormatter,
  platformFormatter,
  passthroughExecutor('railLineFormatter', 'ENH_2A passthrough executor hook for RLE rail-line formatting.'),
  passthroughExecutor('platformFootprintFormatter', 'ENH_2A passthrough executor hook for PFB platform-footprint formatting.'),
  roadLineFormatter,
  stationBuildingFormatter,
  stationBuildingPointFormatter,
  passthroughExecutor('stationFloorFormatter', 'ENH_2A passthrough executor hook for STF station-floor formatting.'),
  teleportPointFormatter,
];

const EXECUTOR_BY_KEY = new Map(BUILTIN_FORMAT_EXECUTORS.map((executor) => [executor.key, executor]));

export function listFormatExecutors(): CairnMapFormatExecutor[] {
  return BUILTIN_FORMAT_EXECUTORS.slice();
}

export function getFormatExecutorByKey(formatterKey: string): CairnMapFormatExecutor | undefined {
  return EXECUTOR_BY_KEY.get(normalize(formatterKey));
}

export function hasFormatExecutor(formatterKey: string): boolean {
  return Boolean(getFormatExecutorByKey(formatterKey));
}

export function getFormatExecutorByClassCode(classCode: string): CairnMapFormatExecutor | undefined {
  const contract = getFormatRuntimeContractByClassCode(normalizeClassCode(classCode));
  if (!contract?.formatterKey) return undefined;
  return getFormatExecutorByKey(contract.formatterKey);
}

export function getFormatExecutorKeyByClassCode(classCode: string): string | undefined {
  return getFormatRuntimeContractByClassCode(normalizeClassCode(classCode))?.formatterKey;
}
