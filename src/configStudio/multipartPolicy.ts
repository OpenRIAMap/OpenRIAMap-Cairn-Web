import { hasCategoryNode, hasDescendants, resolveGeometryProfile } from './runtime';
import type { ClassificationPath, ConfigPackageV3, GeometryKind, WorkflowDefinition, WorkflowStep } from './types';

export function recordCategory(record: Record<string, unknown>): ClassificationPath {
  return { class: String(record.Class ?? ''), ...(record.Kind ? {kind:String(record.Kind)} : {}), ...(record.SKind ?? record.Skind ? {skind:String(record.SKind ?? record.Skind)} : {}), ...(record.SKind2 ?? record.Skind2 ? {skind2:String(record.SKind2 ?? record.Skind2)} : {}) };
}
export function categoryAllowsParts(config: ConfigPackageV3, path: ClassificationPath, geometry: GeometryKind): boolean {
  return hasCategoryNode(config, path) && !hasDescendants(config, path) && resolveGeometryProfile(config, path, geometry)?.enabled === true && resolveGeometryProfile(config, path, geometry)?.allowMultipleParts === true;
}
/** One capture can feed multiple outputs. All actual consumers must permit it. */
export function drawingAllowsParts(config: ConfigPackageV3, workflow: WorkflowDefinition, step: WorkflowStep, selected: Record<string, ClassificationPath | undefined>): boolean {
  if (step.drawing?.multiple !== true || step.drawing.returnFormat === 'pointObject') return false;
  const ids = new Set([step.geometryRole !== 'auxiliary' ? step.outputId : undefined, ...(step.drawing.bindings ?? []).filter(binding => binding.value === 'geometry' && /^(CoordP|CoordL|CoordG)$/.test(binding.target)).map(binding => binding.outputId)].filter(Boolean));
  if (!ids.size) return true; // auxiliary coordinates governed by their own format
  return [...ids].every(id => { const output = workflow.outputs.find(output => output.id === id); return !!output && categoryAllowsParts(config, selected[output.id] ?? output.classification, step.geometry![0]); });
}
