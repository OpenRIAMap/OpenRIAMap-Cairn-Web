import { forwardRef } from 'react';
import MappingEditorCore, { type MeasuringModuleHandle, type MeasuringModuleProps } from '@/components/Mapping/core/MeasuringModule';

/**
 * The review surface owns a distinct React lifetime from MappingWorkspace.
 * ReviewEditor supplies the review-only bindings to a fresh MappingEditorCore
 * instance; the host never changes a mounted editor from mapping to review.
 */
export type ReviewWorkspaceProps = Omit<MeasuringModuleProps, 'reviewWorkspace'>;

const ReviewEditor = forwardRef<MeasuringModuleHandle, ReviewWorkspaceProps>((props, ref) => (
  <MappingEditorCore {...props} ref={ref} reviewWorkspace />
));
ReviewEditor.displayName = 'ReviewEditor';

const ReviewWorkspace = forwardRef<MeasuringModuleHandle, ReviewWorkspaceProps>((props, ref) => (
  <ReviewEditor {...props} ref={ref} />
));
ReviewWorkspace.displayName = 'ReviewWorkspace';

export default ReviewWorkspace;
