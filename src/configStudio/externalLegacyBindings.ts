import type {ClassificationPath,ConfigPackageV3,ExternalRoleBinding,WorkflowDefinition} from './types';
import {EXTERNAL_COMPONENT_ROLES,RAIL_ROLE_KEYS} from './externalCapabilities';

/** Frozen c15 declaration codec. Only used for old inputs, never for c16 dispatch. */
export function legacyExternalRoleBindings(config:ConfigPackageV3|undefined,workflow:WorkflowDefinition):ExternalRoleBinding[]{
 const declared=workflow.external?.coveredClassifications??(workflow.target?[workflow.target]:[]);
 return (EXTERNAL_COMPONENT_ROLES[workflow.external?.componentKey??'']??[]).flatMap(role=>{
  const code=Object.entries(RAIL_ROLE_KEYS).find(([,key])=>key===role)?.[0]??'TRP';
  const candidates=declared.filter(path=>path.class===code&&!path.kind||path.class==='RIL'&&path.kind===code&&!path.skind);
  if(candidates.length!==1)return [];
  const path:ClassificationPath={...candidates[0]};
  const hasChildren=Boolean(config?.nodes.some(node=>node.path.class===path.class&&(!path.kind||node.path.kind===path.kind)&&Object.values(node.path).filter(Boolean).length>Object.values(path).filter(Boolean).length));
  return [{role,classificationGroup:{selectors:[{id:'migrated-'+role,mode:role==='tradePoint'&&hasChildren?'leafDescendants':'self',path}]}}];
 });
}
