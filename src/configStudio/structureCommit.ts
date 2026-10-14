import type {ConfigPackageV3,MountedFeatureRecord} from './types';
import {resolveNodeFieldSettings} from './nodeFieldSettings';
import {normalizeRuleSourceWorldId} from '../components/Rules/data/ruleDataSources';
import {readRecordPath} from './runtime';

const path=(record:MountedFeatureRecord)=>({class:String(record.Class??''),kind:record.Kind,skind:record.SKind??record.Skind,skind2:record.SKind2??record.Skind2});
/** Validate the latest world pool before any map layer is committed. */
export function assertStructureTargets(config:ConfigPackageV3,created:MountedFeatureRecord[],existing:MountedFeatureRecord[]):void {
  if(config.contractRevision<10)return;
  const records=[...existing,...created];
  for(const record of created){const role=resolveNodeFieldSettings(config,path(record)).value.structure;if(!role?.enabled||role.role!=='member')continue;
    const id=role.hostField?readRecordPath(record,role.hostField):undefined,world=normalizeRuleSourceWorldId(String(record.World??''));
    const candidates=records.filter(row=>normalizeRuleSourceWorldId(String(row.World??''))===world&&row.ID===id);
    const targetRole=candidates.length===1?resolveNodeFieldSettings(config,path(candidates[0])).value.structure:undefined;
    if(candidates.length!==1||!targetRole?.enabled||targetRole.role!=='main')throw Error(`附属 ${record.ID} 的主结构 ${String(id)} 不存在、不唯一或未启用主结构身份。`);
  }
}
