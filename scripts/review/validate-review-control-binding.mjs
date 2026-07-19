import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const bindingPath = path.join(root, 'project-config/packages/openriamap-ria/environment/reviewAutomationBinding.json');
const binding = JSON.parse(fs.readFileSync(bindingPath, 'utf8'));
const expected = ['submit', 'precheck', 'approve', 'reject', 'request-changes', 'archive', 'status-refresh', 'report-refresh'];
const errors = [];
if (binding.enabled !== false) errors.push('automation must remain disabled until staged cloud approval');
if (binding.runtimeProfile !== 'openriamap-ria') errors.push('binding must remain downstream-only');
if (JSON.stringify([...binding.intents].sort()) !== JSON.stringify([...expected].sort())) errors.push('intent list mismatch');
if (binding.authorization.separationOfDuties.acceptRequiresIndependentApprover !== true) errors.push('independent acceptance guard missing');
if (binding.authorization.separationOfDuties.productionApplyRequiresControlApproval !== true) errors.push('Control approval guard missing');
if (Object.values(binding.targets.buckets).some((value) => !/^[A-Z0-9_]+$/.test(value))) errors.push('bucket references must be environment variable names');
if (binding.broker.controlApiBaseEnvironmentVariable !== 'CAIRN_CONTROL_API_BASE') errors.push('broker endpoint must be supplied by environment');
if (errors.length) { console.error('Review control binding: FAIL'); errors.forEach((error) => console.error(`- ${error}`)); process.exitCode = 1; }
else console.log('Review control binding: PASS');
