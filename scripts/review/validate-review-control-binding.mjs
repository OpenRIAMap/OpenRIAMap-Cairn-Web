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
if (binding.schemaVersion !== 'openriamap.ria-review-automation-binding.v2') errors.push('three-role binding v2 is required');
if (binding.authorization.authorizationProvider !== 'scf-github-app-team-resolution') errors.push('SCF GitHub Team authorization provider missing');
if (binding.authorization.staticUsernameRoleBindingsAllowed !== false) errors.push('static username role bindings must remain disabled');
if (Object.keys(binding.authorization.githubApp.teamSlugs ?? {}).sort().join(',') !== 'contributor,maintainer,reviewer') errors.push('three Team slugs are required');
if (binding.authorization.separationOfDuties.acceptRequiresIndependentApprover !== false || binding.authorization.separationOfDuties.acceptRequiresReviewerOrMaintainer !== true) errors.push('collective reviewer acceptance policy missing');
if (binding.authorization.separationOfDuties.productionApplyRequiresControlApproval !== true) errors.push('Control approval guard missing');
if (Object.values(binding.targets.buckets).some((value) => !/^[A-Z0-9_]+$/.test(value))) errors.push('bucket references must be environment variable names');
if (binding.broker.controlApiBaseEnvironmentVariable !== 'CAIRN_CONTROL_API_BASE') errors.push('broker endpoint must be supplied by environment');
if (JSON.stringify(binding).includes('CAIRN_REVIEW_ROLE_BINDINGS_JSON')) errors.push('static Vercel role binding variable is forbidden');
if (errors.length) { console.error('Review control binding: FAIL'); errors.forEach((error) => console.error(`- ${error}`)); process.exitCode = 1; }
else console.log('Review control binding: PASS');
