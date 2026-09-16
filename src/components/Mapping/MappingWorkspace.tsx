import { forwardRef } from 'react';
import MappingEditorCore, { type MeasuringModuleHandle, type MeasuringModuleProps } from './core/MeasuringModule';

export type MappingWorkspaceProps = Omit<MeasuringModuleProps,
  'reviewWorkspace' | 'reviewSession' | 'onReviewDirtyChange' | 'onReviewSave' | 'onReviewExitRequested'>;

/**
 * Mapping has its own React root and never receives Review session bindings.
 * MapContainer remounts this boundary rather than mutating an existing editor
 * into a different workspace.
 */
const MappingWorkspace = forwardRef<MeasuringModuleHandle, MappingWorkspaceProps>((props, ref) => (
  <MappingEditorCore {...props} ref={ref} />
));

MappingWorkspace.displayName = 'MappingWorkspace';

export default MappingWorkspace;
