import type { ReviewInboxItem, ReviewInboxPayload, ReviewInboxPayloadItem, ReviewPictureEntry } from './reviewStatusTypes';
import type { ParsedRelayPackage } from '@/components/Mapping/core/relayPackageParser';

const SAMPLE_INBOX_URL = '/review-samples/relay-review-inbox.sample.json';

function normalizeString(value: unknown, fallback = ''): string {
  const text = String(value ?? '').trim();
  return text || fallback;
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item ?? '').trim()).filter(Boolean);
}

function normalizePicturesById(value: unknown): Record<string, ReviewPictureEntry[]> {
  const result: Record<string, ReviewPictureEntry[]> = {};
  if (!value || typeof value !== 'object') return result;
  for (const [id, rawList] of Object.entries(value as Record<string, unknown>)) {
    if (!Array.isArray(rawList)) continue;
    const entries = rawList
      .map((entry) => {
        if (!entry || typeof entry !== 'object') return null;
        const obj = entry as Record<string, unknown>;
        const url = normalizeString(obj.url);
        if (!url) return null;
        const normalized: ReviewPictureEntry = {
          source: obj.source === 'pub' ? 'pub' : 'dat',
          url,
        };
        const filename = normalizeString(obj.filename);
        const relativePath = normalizeString(obj.relativePath);
        if (filename) normalized.filename = filename;
        if (relativePath) normalized.relativePath = relativePath;
        return normalized;
      })
      .filter((entry): entry is ReviewPictureEntry => Boolean(entry));
    if (entries.length > 0) result[String(id)] = entries;
  }
  return result;
}

function normalizeDeleteMarks(value: unknown): ReviewInboxItem['deleteMarks'] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        const obj = item as Record<string, unknown>;
        const ID = normalizeString(obj.ID ?? obj.id);
        const Name = normalizeString(obj.Name ?? obj.name);
        return ID ? { ID, Name } : null;
      }
      const ID = normalizeString(item);
      return ID ? { ID, Name: '' } : null;
    })
    .filter((item): item is { ID: string; Name: string } => Boolean(item));
}

function normalizeReviewItem(item: ReviewInboxPayloadItem): ReviewInboxItem | null {
  const packageId = normalizeString(item?.packageId);
  const worldId = normalizeString(item?.worldId, 'zth');
  if (!packageId) return null;
  const features = Array.isArray(item?.features) ? item.features : [];
  return {
    packageId,
    projectId: normalizeString(item?.projectId) || undefined,
    worldId,
    status: normalizeString(item?.status, 'pending'),
    currentStage: normalizeString(item?.currentStage) || undefined,
    createdAt: normalizeString(item?.createdAt) || undefined,
    updatedAt: normalizeString(item?.updatedAt) || undefined,
    packagePath: normalizeString(item?.packagePath) || undefined,
    packageType: normalizeString(item?.packageType) || undefined,
    meta: item?.meta,
    review: item?.review,
    precheck: item?.precheck,
    accept: item?.accept,
    history: Array.isArray(item?.history) ? item.history : [],
    warnings: normalizeStringArray(item?.warnings),
    errors: normalizeStringArray(item?.errors),
    features,
    deleteMarks: normalizeDeleteMarks(item?.deleteMarks),
    picturesById: normalizePicturesById(item?.picturesById),
    source: item?.source ?? 'sample',
  };
}

export async function loadSampleReviewInbox(): Promise<ReviewInboxItem[]> {
  const response = await fetch(SAMPLE_INBOX_URL, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`无法读取内置审核样例：${response.status} ${response.statusText}`);
  }
  const payload = (await response.json()) as ReviewInboxPayload;
  return (payload.items ?? [])
    .map((item) => normalizeReviewItem(item))
    .filter((item): item is ReviewInboxItem => Boolean(item));
}

export function createReviewItemFromParsedRelayPackage(fileName: string, parsed: ParsedRelayPackage, fallbackWorldId: string): ReviewInboxItem {
  const packageId = normalizeString(fileName.replace(/\.zip$/i, ''), `local-${Date.now()}`);
  const pictureCount = Object.values(parsed.draft.picturesById).reduce((sum, entries) => sum + entries.filter((entry) => !entry.deleted).length, 0);
  const picturesById: Record<string, ReviewPictureEntry[]> = {};
  for (const [id, entries] of Object.entries(parsed.draft.picturesById)) {
    const normalized = entries
      .filter((entry) => !entry.deleted && Boolean(entry.previewUrl))
      .map((entry) => ({
        source: 'dat' as const,
        url: String(entry.previewUrl),
        filename: entry.originalName,
        relativePath: entry.relativePath,
      }));
    if (normalized.length > 0) picturesById[id] = normalized;
  }

  return {
    packageId,
    projectId: 'local-preview',
    worldId: fallbackWorldId,
    status: parsed.isRelayPackageLike ? 'pending' : 'legacy_preview',
    currentStage: 'local-preview',
    createdAt: new Date().toISOString(),
    updatedAt: parsed.draft.meta.updatedAt,
    packagePath: fileName,
    packageType: parsed.isRelayPackageLike ? 'native-relay-package' : 'legacy-zip-preview',
    meta: {
      operator: parsed.draft.meta.operator,
      note: parsed.draft.meta.note,
      packageVersion: parsed.draft.meta.packageVersion,
      exportedAt: parsed.draft.meta.updatedAt,
      featureCount: parsed.parsedFeatureCount,
      pictureCount,
      deleteCount: parsed.parsedDeleteCount,
    },
    review: {
      schemaVersion: 'local-preview',
      status: 'pending',
      decision: null,
      notes: [],
      precheck: { status: 'not-run', warnings: [], errors: [] },
      history: [],
    },
    precheck: { status: 'NOT_RUN', runId: null, reportPath: null, finalStatus: null, updatedAt: null },
    accept: { status: 'NOT_RUN', runId: null, reportPath: null, finalStatus: null, updatedAt: null },
    history: [],
    warnings: parsed.isRelayPackageLike ? [] : ['该文件不具备标准 RelayPackage 标记，当前仅作为 legacy preview 读取。'],
    errors: [],
    features: parsed.jsonItems,
    deleteMarks: parsed.draft.deleteMarks,
    picturesById,
    source: 'local-file',
  };
}
