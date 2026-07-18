import type { ReviewInboxItem, ReviewLayerMountSummary, ReviewLayerVisibility, ReviewPictureEntry } from './reviewStatusTypes';

const TEMP_RULE_SOURCES_KEY = 'ria_temp_rule_sources_v1';
const TEMP_RULE_DELETE_IDS_KEY = 'ria_temp_rule_delete_ids_v1';
const REVIEW_SOURCE_PREFIX = 'review::';
const REVIEW_DELETE_IDS_KEY = 'ria_review_temp_delete_ids_v1';

function readJsonObject(key: string): Record<string, any> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function writeJsonObject(key: string, value: Record<string, any>) {
  localStorage.setItem(key, JSON.stringify(value));
}

function dispatchReviewLayerChanged(worldId?: string) {
  window.dispatchEvent(new CustomEvent('ria-temp-rule-sources-changed', { detail: { worldId } }));
  window.dispatchEvent(new CustomEvent('ria-temp-rule-deletes-changed', { detail: { worldId } }));
  window.dispatchEvent(new CustomEvent('ria-review-temp-rule-sources-changed', { detail: { worldId } }));
}

function getFeatureId(item: any): string {
  return String(item?.ID ?? item?.id ?? item?.featureInfo?.ID ?? item?.meta?.idValue ?? '').trim();
}

function getFeatureOperation(item: any): 'create' | 'update' {
  const raw = String(item?.operation ?? item?.Operation ?? item?.relayOperation ?? item?.RelayOperation ?? item?.action ?? '').toLowerCase();
  if (raw.includes('update') || raw.includes('modify') || raw.includes('replace')) return 'update';
  return 'create';
}

function filterPicturesByIds(picturesById: Record<string, ReviewPictureEntry[]>, ids: Set<string>) {
  const result: Record<string, ReviewPictureEntry[]> = {};
  for (const [id, entries] of Object.entries(picturesById)) {
    if (!ids.has(id)) continue;
    if (entries.length > 0) result[id] = entries;
  }
  return result;
}

function replaceReviewSources(worldId: string, sources: any[]) {
  const obj = readJsonObject(TEMP_RULE_SOURCES_KEY);
  const current = Array.isArray(obj[worldId]) ? obj[worldId] : [];
  obj[worldId] = [
    ...current.filter((source: any) => !String(source?.uid ?? '').startsWith(REVIEW_SOURCE_PREFIX)),
    ...sources,
  ];
  writeJsonObject(TEMP_RULE_SOURCES_KEY, obj);
}

function replaceReviewDeleteIds(worldId: string, deleteIds: string[]) {
  const reviewObj = readJsonObject(REVIEW_DELETE_IDS_KEY);
  const previousReviewIds = Array.isArray(reviewObj[worldId])
    ? reviewObj[worldId].map((id: unknown) => String(id ?? '').trim()).filter(Boolean)
    : [];
  const previousSet = new Set(previousReviewIds);
  const deleteObj = readJsonObject(TEMP_RULE_DELETE_IDS_KEY);
  const current = Array.isArray(deleteObj[worldId])
    ? deleteObj[worldId].map((id: unknown) => String(id ?? '').trim()).filter(Boolean)
    : [];
  deleteObj[worldId] = Array.from(new Set([
    ...current.filter((id) => !previousSet.has(id)),
    ...deleteIds,
  ]));
  reviewObj[worldId] = deleteIds;
  writeJsonObject(TEMP_RULE_DELETE_IDS_KEY, deleteObj);
  writeJsonObject(REVIEW_DELETE_IDS_KEY, reviewObj);
}

export function clearReviewTempLayers(worldId?: string) {
  const sources = readJsonObject(TEMP_RULE_SOURCES_KEY);
  const deleteIds = readJsonObject(TEMP_RULE_DELETE_IDS_KEY);
  const reviewDeleteIds = readJsonObject(REVIEW_DELETE_IDS_KEY);
  const worldIds = worldId ? [worldId] : Array.from(new Set([...Object.keys(sources), ...Object.keys(deleteIds), ...Object.keys(reviewDeleteIds)]));

  for (const wid of worldIds) {
    if (Array.isArray(sources[wid])) {
      sources[wid] = sources[wid].filter((source: any) => !String(source?.uid ?? '').startsWith(REVIEW_SOURCE_PREFIX));
    }
    const previousReviewIds = Array.isArray(reviewDeleteIds[wid])
      ? new Set(reviewDeleteIds[wid].map((id: unknown) => String(id ?? '').trim()).filter(Boolean))
      : new Set<string>();
    if (Array.isArray(deleteIds[wid])) {
      deleteIds[wid] = deleteIds[wid].filter((id: unknown) => !previousReviewIds.has(String(id ?? '').trim()));
    }
    if (Array.isArray(reviewDeleteIds[wid])) {
      reviewDeleteIds[wid] = [];
    }
  }

  writeJsonObject(TEMP_RULE_SOURCES_KEY, sources);
  writeJsonObject(TEMP_RULE_DELETE_IDS_KEY, deleteIds);
  writeJsonObject(REVIEW_DELETE_IDS_KEY, reviewDeleteIds);
  dispatchReviewLayerChanged(worldId);
}

export function mountReviewPackageAsTempLayers(
  worldId: string,
  item: ReviewInboxItem,
  visibility: ReviewLayerVisibility,
): ReviewLayerMountSummary {
  const createItems: any[] = [];
  const updateItems: any[] = [];
  for (const feature of item.features) {
    if (getFeatureOperation(feature) === 'update') updateItems.push(feature);
    else createItems.push(feature);
  }

  const pictureIds = new Set(Object.keys(item.picturesById));
  const pictureItems = item.features.filter((feature) => pictureIds.has(getFeatureId(feature)));
  const deleteIds = item.deleteMarks.map((mark) => String(mark.ID ?? '').trim()).filter(Boolean);
  const sources: any[] = [];

  sources.push({
    uid: `${REVIEW_SOURCE_PREFIX}${item.packageId}::create`,
    worldId,
    label: `Review Create · ${item.packageId}`,
    enabled: visibility.create,
    items: createItems,
  });
  sources.push({
    uid: `${REVIEW_SOURCE_PREFIX}${item.packageId}::update`,
    worldId,
    label: `Review Update · ${item.packageId}`,
    enabled: visibility.update,
    items: updateItems,
  });
  sources.push({
    uid: `${REVIEW_SOURCE_PREFIX}${item.packageId}::picture`,
    worldId,
    label: `Review Pictures · ${item.packageId}`,
    enabled: visibility.pictures,
    items: pictureItems,
    picturesById: filterPicturesByIds(item.picturesById, pictureIds),
  });

  replaceReviewSources(worldId, sources);
  replaceReviewDeleteIds(worldId, visibility.delete ? deleteIds : []);
  dispatchReviewLayerChanged(worldId);

  return {
    createCount: createItems.length,
    updateCount: updateItems.length,
    deleteCount: deleteIds.length,
    pictureCount: Object.values(item.picturesById).reduce((sum, entries) => sum + entries.length, 0),
  };
}
