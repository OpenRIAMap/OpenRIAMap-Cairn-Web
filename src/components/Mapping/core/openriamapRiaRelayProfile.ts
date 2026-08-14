import type { ReviewPackageProfile } from '@/components/Review/package';

/**
 * The RIA composition of the generic review-package contract.
 *
 * Paths and nested class conventions live here rather than in the generic
 * CairnMap package core.  This module is intentionally the only place where
 * the historical RIA package layout is named.
 */
export const OPENRIAMAP_RIA_RELAY_PROFILE: ReviewPackageProfile = {
  profileId: 'openriamap-ria-relay',
  featureRoot: 'Data_Spilt',
  pictureRoot: 'Picture',
  indexPath: 'INDEX.json',
  reviewPath: 'Review.json',
  deletePath: 'Delete.json',
  toolRefreshRoot: 'Tool_Refresh',
  nestedKindClasses: ['ISG', 'ISL', 'ISP'],
};

export default OPENRIAMAP_RIA_RELAY_PROFILE;
