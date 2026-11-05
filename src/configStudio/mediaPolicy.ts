import type {ConfigPackageV3} from './types';
export type MediaPolicyEntry={worldId:string;featureId:string;sha256?:string;url?:string};
/** Compare content identities, not client-provided "existing" flags or order. */
export function validateMediaPolicy(config:ConfigPackageV3,incoming:MediaPolicyEntry[],existing:MediaPolicyEntry[]):string[]{
 const policy=config.application?.preferences.pictureControls;if(config.contractRevision<18||!policy)return [];
 const errors:string[]=[];
 for(const item of incoming){const allowed=item.url?policy.allowExternalLink:policy.allowUpload;if(allowed)continue;const unchanged=existing.some(prior=>prior.worldId===item.worldId&&prior.featureId===item.featureId&&(item.url?prior.url===item.url:!!item.sha256&&prior.sha256===item.sha256&&!prior.url));if(!unchanged)errors.push(`${item.worldId}/${item.featureId}：当前配置已关闭新增${item.url?'图片链接':'上传图片'}，仅允许携带未改变的正式图片或删除绑定。`);}
 return [...new Set(errors)];
}
