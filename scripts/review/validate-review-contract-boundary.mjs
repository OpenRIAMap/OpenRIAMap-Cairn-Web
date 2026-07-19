#!/usr/bin/env node
import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const required = [
  'src/components/Review/contracts.ts', 'src/components/Review/session.ts', 'src/components/Review/adapterRegistry.ts', 'src/components/Review/index.ts',
  'project-config/schemas/review/cairnmap.review-workspace-extension.v1.schema.json',
  'project-config/templates/review/reviewWorkspace.extension.template.json', '.cairn/case-template-manifest.json', '.cairn/downstream-impact.json',
];
const errors = required.filter((file) => !fs.existsSync(path.join(root, file))).map((file) => `missing ${file}`);
const forbidden = /openriamap|ria_temp_rule_sources_v1|https?:|github|cos|control|pipeline|scf|tcr|vercel|credential|token|formal approval/i;
for (const file of required.filter((file) => file.startsWith('src/'))) {
  if (forbidden.test(fs.readFileSync(path.join(root, file), 'utf8'))) errors.push(`${file} contains a downstream or deployment dependency`);
}
const changed = childProcess.execFileSync('git', ['diff', '--name-only', 'upstream/main...HEAD'], { cwd: root, encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
const allowed = new Set([...required, 'src/components/Review/workflow.ts', 'docs/ReviewWorkspaceContracts.md', 'scripts/review/validate-review-contract-boundary.mjs', 'scripts/review/validate-case-template-manifest.mjs', 'scripts/review/test-review-workspace-contracts.ts', 'Update_Log/CM_REVIEW_WORKFLOW_CONTRACTS_1.md', 'Update_Log/CM_REVIEW_WORKFLOW_CONTROL_CONTRACTS_1.md', 'package.json']);
for (const file of changed) if (!allowed.has(file)) errors.push(`baseline-preservation violation: ${file} is outside the contract-only allowlist`);
if (changed.some((file) => file.endsWith('.tsx') || file === 'src/components/Map/MapContainer.tsx' || file.startsWith('src/components/Mapping/'))) errors.push('baseline-preservation violation: UI or Mapping implementation changed');
if (errors.length) { console.error('Review contract boundary: FAIL'); errors.forEach((error) => console.error(`- ${error}`)); process.exitCode = 1; }
else console.log('Review contract boundary: PASS');
