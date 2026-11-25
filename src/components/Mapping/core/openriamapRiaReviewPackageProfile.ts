import profileJson from '@/config/openriamap-ria-review-package-profile.json';
import { parseReviewPackageProfile, type ReviewPackageProfile } from '@/components/Review/package';
import {validateContributionFeatures, metadataValidationError} from '@/core/audit/contributionContract.mjs';

/**
 * RIA injects kind paths and its creation/edit metadata checks. The neutral
 * package core continues to own ZIP paths and does not require RIA fields.
 */
export const OPENRIAMAP_RIA_REVIEW_PACKAGE_PROFILE: ReviewPackageProfile = {
  ...parseReviewPackageProfile(profileJson),
  validateFeatures(features) {
    const issues=validateContributionFeatures(features.map(feature=>({...feature,path:['Data_Spilt',feature.worldId,feature.classCode,...(OPENRIAMAP_RIA_REVIEW_PACKAGE_PROFILE.nestedKindClasses?.includes(feature.classCode)?feature.kindPath??[]:[])].join('/')+'/'+feature.featureId+'.json'})));
    if(issues.length)throw metadataValidationError(issues);
  },
};

export default OPENRIAMAP_RIA_REVIEW_PACKAGE_PROFILE;
