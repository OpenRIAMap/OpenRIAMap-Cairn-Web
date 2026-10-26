import frozen from './migrationData/factory-c6.json';
import type {ConfigPackageV3} from './types';
/** Frozen historical conversion input; never used as the active configuration. */
export function createConfigPackageFromCurrentProject():ConfigPackageV3{return structuredClone(frozen) as unknown as ConfigPackageV3;}
