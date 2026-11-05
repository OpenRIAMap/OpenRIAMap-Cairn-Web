import type { ConfigPackageV3, ConfigValidationReport } from './types';
import type { StudioEditingSession } from './studioSession';
import type { TemporaryDiagnostic } from './temporaryDiagnostic';

export type WorkspaceValidation = {
  id: string; sessionId: string; generation: number; configFingerprint: string; recordsFingerprint: string;
  rulesVersion: string; validatorFingerprint: string; resourceFingerprint: string;
  mountedCount: number; report: ConfigValidationReport;
};
export type WorkspaceCheckpoint = {
  schemaVersion: 'cairnmap.studio-workspace.v1';
  config: ConfigPackageV3; session?: StudioEditingSession;
  validation?: WorkspaceValidation; importedDiagnostic?: TemporaryDiagnostic;
  migration?: import('./migrationAttachment').MigrationAttachment;
  generation: number; updatedAt: string;
  importedEditAudit?:{audit:import('./editAudit').EditAudit;sourceConfig:ConfigPackageV3};
  editAudit?:import('./editAudit').EditAudit;
  baselineIdentity?:import('../configRuntime/formalConfiguration').ConfigurationIdentity;
  inputBuffers?:Record<string,string>;
};
