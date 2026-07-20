import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const binding = JSON.parse(fs.readFileSync(path.join(root, 'project-config/packages/openriamap-ria/environment/reviewAutomationBinding.json'), 'utf8'));
const broker = fs.readFileSync(path.join(root, 'api/review-workflow.mjs'), 'utf8');
const errors = [];
if (broker.includes('CAIRN_REVIEW_ROLE_BINDINGS_JSON') || broker.includes('roleBindings')) errors.push('Vercel broker must not contain static username role bindings');
if (!broker.includes('principalId: session.login')) errors.push('broker must forward only the OAuth login as the actor identity');
if (binding.authorization.authorizationProvider !== 'scf-github-app-team-resolution') errors.push('SCF must be the Team authorization authority');
if (binding.authorization.githubApp.organization !== 'OpenRIAMap') errors.push('unexpected GitHub organization');
if (binding.targets.runtime.deploymentMode !== 'scf-nodejs-zip' || binding.targets.runtime.region !== 'ap-shanghai') errors.push('Shanghai SCF ZIP runtime is required');
if (errors.length) { console.error('Team review authorization: FAIL'); errors.forEach((error) => console.error(`- ${error}`)); process.exitCode = 1; }
else console.log('Team review authorization: PASS');
