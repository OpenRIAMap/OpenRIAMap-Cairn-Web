import profileJson from '@/config/openriamap-ria-review-package-profile.json';
import { parseReviewPackageProfile, type ReviewPackageProfile } from '@/components/Review/package';

/**
 * RIA declares only how its existing feature classes use the generic
 * package's optional `kind` segment.  The upstream contract owns every
 * Relay ZIP directory, marker and required file name.
 */
export const OPENRIAMAP_RIA_REVIEW_PACKAGE_PROFILE: ReviewPackageProfile = parseReviewPackageProfile(profileJson);

export default OPENRIAMAP_RIA_REVIEW_PACKAGE_PROFILE;
