import fs from 'node:fs';
import path from 'node:path';
import {
  featureKeyFromRef,
  targetFeatureRelativePath,
  writeDryRunOutputs,
} from './native-relay-apply-tools.mjs';
import { writeJson } from './native-relay-package-tools.mjs';

function normalizeSlashes(value) {
  return String(value).replace(/\\/g, '/');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function isSubPath(baseDir, candidatePath) {
  const base = path.resolve(baseDir);
  const candidate = path.resolve(candidatePath);
  return candidate === base || candidate.startsWith(`${base}${path.sep}`);
}

function assertTargetPath(rootDir, targetPath, label) {
  if (!isSubPath(rootDir, targetPath)) {
    throw new Error(`[write-safety] ${label} target escapes its root: ${normalizeSlashes(targetPath)}`);
  }
  const normalized = normalizeSlashes(targetPath);
  if (normalized.includes('/.cairnmap-tmp/relay-input/')) {
    throw new Error(`[write-safety] Refusing to write inside relay-input cache: ${normalized}`);
  }
}

function assertRootSafety(context) {
  const { args, report } = context;
  const relayRoot = path.resolve(args.relayRoot);
  const outRoot = path.resolve(args.outRoot);
  const targetRoots = [
    ['featureDataRoot', args.featureDataRoot, args.explicitFeatureDataRoot],
    ['pictureRoot', args.pictureRoot, args.explicitPictureRoot],
    ['mediaIndexRoot', args.mediaIndexRoot, args.explicitMediaIndexRoot],
  ];
  for (const [name, rootValue, explicit] of targetRoots) {
    const resolved = path.resolve(rootValue);
    if (!explicit) throw new Error(`[write-safety] --${name.replace(/Root$/, '').replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)} must be explicitly provided in --write mode.`);
    if (isSubPath(relayRoot, resolved) || isSubPath(resolved, relayRoot)) {
      throw new Error(`[write-safety] ${name} must not overlap the RelayPackage root.`);
    }
    if (isSubPath(outRoot, resolved) || isSubPath(resolved, outRoot)) {
      throw new Error(`[write-safety] ${name} must not overlap the report output root.`);
    }
    if (normalizeSlashes(resolved).includes('/.cairnmap-tmp/relay-input/')) {
      throw new Error(`[write-safety] ${name} must not be inside .cairnmap-tmp/relay-input.`);
    }
  }
  if (report.errors.length > 0) {
    throw new Error('[write-safety] Dry-run comparison contains errors. Refusing to write.');
  }
}

function backupPathFor(args, category, relativePath) {
  return path.join(args.outRoot, 'backups', category, relativePath);
}

function maybeBackupFile(args, sourcePath, category, relativePath, backupManifest) {
  if (!args.backup || !sourcePath || !fs.existsSync(sourcePath)) return null;
  const backupPath = backupPathFor(args, category, relativePath);
  ensureDir(path.dirname(backupPath));
  fs.copyFileSync(sourcePath, backupPath);
  backupManifest.push({ category, sourcePath: normalizeSlashes(sourcePath), backupPath: normalizeSlashes(backupPath), relativePath });
  return backupPath;
}

function writeFeatureChanges(context, backupManifest) {
  const { args, relayFeatures, featureDataLayout, report } = context;
  const byKey = new Map(relayFeatures.map((entry) => [entry.key, entry]));
  const writes = [];
  for (const change of report.featureChanges) {
    const entry = byKey.get(change.featureKey);
    if (!entry) continue;
    const relativePath = targetFeatureRelativePath(entry.info, args.projectId, featureDataLayout);
    const targetPath = path.join(args.featureDataRoot, relativePath);
    assertTargetPath(args.featureDataRoot, targetPath, 'feature');
    if (change.status === 'unchanged') {
      writes.push({ ...change, action: 'skip-unchanged' });
      continue;
    }
    if (change.status === 'update' && args.allowOverwrite === false) {
      throw new Error(`[write-safety] Feature overwrite blocked by --no-overwrite: ${relativePath}`);
    }
    maybeBackupFile(args, targetPath, 'Data_Spilt', relativePath, backupManifest);
    writeJson(targetPath, entry.data);
    writes.push({
      ...change,
      action: change.status === 'create' ? 'written-create' : 'written-update',
      writtenPath: normalizeSlashes(targetPath),
    });
  }
  return writes;
}

function applyDeletes(context, backupManifest) {
  const { args, report } = context;
  const deletes = [];
  for (const change of report.deleteChanges) {
    if (!change.targetRelativePath || !change.targetPath) {
      deletes.push({ ...change, action: 'skip-unresolved' });
      continue;
    }
    const targetPath = path.resolve(change.targetPath);
    assertTargetPath(args.featureDataRoot, targetPath, 'delete');
    if (change.status === 'missing-target') {
      if (args.strictDelete) throw new Error(`[write-safety] Delete target missing under --strict-delete: ${change.targetRelativePath}`);
      deletes.push({ ...change, action: 'skip-missing-target' });
      continue;
    }
    maybeBackupFile(args, targetPath, 'Data_Spilt_deleted', change.targetRelativePath, backupManifest);
    if (fs.existsSync(targetPath)) fs.rmSync(targetPath, { force: true });
    deletes.push({ ...change, action: 'deleted', deletedPath: normalizeSlashes(targetPath) });
  }
  return deletes;
}

function writePictureChanges(context, backupManifest) {
  const { args, pictureChanges } = context;
  const writes = [];
  for (const item of pictureChanges) {
    const targetPath = path.resolve(item.targetPath);
    assertTargetPath(args.pictureRoot, targetPath, 'picture');
    if (item.status === 'unchanged') {
      writes.push({ status: item.status, objectKey: item.objectKey, action: 'skip-unchanged', targetPath: normalizeSlashes(targetPath) });
      continue;
    }
    if (item.status === 'overwrite' && args.allowOverwrite === false) {
      throw new Error(`[write-safety] Picture overwrite blocked by --no-overwrite: ${item.objectKey}`);
    }
    maybeBackupFile(args, targetPath, 'Picture', item.objectKey, backupManifest);
    ensureDir(path.dirname(targetPath));
    fs.copyFileSync(item.sourcePath, targetPath);
    writes.push({
      status: item.status,
      objectKey: item.objectKey,
      action: item.status === 'create' ? 'copied-create' : 'copied-overwrite',
      sourcePath: normalizeSlashes(item.sourcePath),
      targetPath: normalizeSlashes(targetPath),
      sourceHash: item.sourceHash,
      baselineHash: item.baselineHash,
    });
  }
  return writes;
}

function writeMediaIndex(context, backupManifest) {
  const { args, mediaIndexPlan } = context;
  const assetWrites = [];
  const bindingWrites = [];
  for (const asset of mediaIndexPlan.assets) {
    const relativePath = path.join('assets', `${asset.mediaId}.json`);
    const targetPath = path.join(args.mediaIndexRoot, relativePath);
    assertTargetPath(args.mediaIndexRoot, targetPath, 'media asset');
    if (fs.existsSync(targetPath) && args.allowOverwrite === false) throw new Error(`[write-safety] Media asset overwrite blocked by --no-overwrite: ${relativePath}`);
    maybeBackupFile(args, targetPath, 'Media_Index_Spilt', relativePath, backupManifest);
    writeJson(targetPath, asset);
    assetWrites.push({ mediaId: asset.mediaId, objectKey: asset.objectKey, writtenPath: normalizeSlashes(targetPath) });
  }
  for (const binding of mediaIndexPlan.bindings) {
    const ref = binding.featureRef;
    const relativePath = path.join('bindings', ref.worldId, ref.classCode, ...(ref.kindPath ?? []), `${ref.featureId}.json`);
    const targetPath = path.join(args.mediaIndexRoot, relativePath);
    assertTargetPath(args.mediaIndexRoot, targetPath, 'media binding');
    if (fs.existsSync(targetPath) && args.allowOverwrite === false) throw new Error(`[write-safety] Media binding overwrite blocked by --no-overwrite: ${relativePath}`);
    maybeBackupFile(args, targetPath, 'Media_Index_Spilt', relativePath, backupManifest);
    writeJson(targetPath, binding);
    bindingWrites.push({ featureKey: featureKeyFromRef(ref), mediaCount: binding.media.length, writtenPath: normalizeSlashes(targetPath) });
  }
  return { assetWrites, bindingWrites };
}

export function buildApplyReport(context, writeResult = null, status = 'dry-run-only') {
  const { args, report } = context;
  return {
    schemaVersion: 'cairnmap.native-relay-apply-report.v1',
    generatedAt: report.generatedAt,
    mode: args.write ? 'write' : 'dry-run',
    finalStatus: status,
    projectId: args.projectId,
    inputs: {
      ...report.inputs,
      mediaIndexRoot: normalizeSlashes(args.mediaIndexRoot),
      writeEnabled: Boolean(args.write),
      backupEnabled: Boolean(args.backup),
      allowOverwrite: args.allowOverwrite !== false,
      strictDelete: Boolean(args.strictDelete),
    },
    dryRunSummary: report.summary,
    writes: writeResult ?? {
      featureWrites: [],
      deleteWrites: [],
      pictureWrites: [],
      mediaAssetWrites: [],
      mediaBindingWrites: [],
      backupManifest: [],
    },
    warnings: [...report.warnings],
    errors: [...report.errors],
  };
}

export function writeApplyOutputs(context, applyReport) {
  const { args, report } = context;
  ensureDir(args.outRoot);
  const applyReportPath = path.join(args.outRoot, 'apply-report.json');
  writeJson(path.join(args.outRoot, 'dry-run-report.json'), report);
  writeJson(applyReportPath, applyReport);
  writeJson(path.join(args.outRoot, 'feature-writes.json'), applyReport.writes.featureWrites ?? []);
  writeJson(path.join(args.outRoot, 'delete-writes.json'), applyReport.writes.deleteWrites ?? []);
  writeJson(path.join(args.outRoot, 'picture-writes.json'), applyReport.writes.pictureWrites ?? []);
  writeJson(path.join(args.outRoot, 'media-index-writes.json'), {
    assets: applyReport.writes.mediaAssetWrites ?? [],
    bindings: applyReport.writes.mediaBindingWrites ?? [],
  });
  writeJson(path.join(args.outRoot, 'backup-manifest.json'), applyReport.writes.backupManifest ?? []);
  return { applyReportPath };
}

export function applyNativeRelayPackageToTargets(context) {
  assertRootSafety(context);
  const backupManifest = [];
  const featureWrites = writeFeatureChanges(context, backupManifest);
  const deleteWrites = applyDeletes(context, backupManifest);
  const pictureWrites = writePictureChanges(context, backupManifest);
  const { assetWrites, bindingWrites } = writeMediaIndex(context, backupManifest);
  return {
    featureWrites,
    deleteWrites,
    pictureWrites,
    mediaAssetWrites: assetWrites,
    mediaBindingWrites: bindingWrites,
    backupManifest,
  };
}

export async function runProtectedApply(context) {
  writeDryRunOutputs(context, { writePreview: false });
  if (!context.args.write) {
    const applyReport = buildApplyReport(context, null, 'DRY_RUN_ONLY');
    const { applyReportPath } = writeApplyOutputs(context, applyReport);
    return { applyReport, applyReportPath, wroteTargets: false };
  }
  const writeResult = applyNativeRelayPackageToTargets(context);
  const applyReport = buildApplyReport(context, writeResult, 'PASS');
  const { applyReportPath } = writeApplyOutputs(context, applyReport);
  return { applyReport, applyReportPath, wroteTargets: true };
}
