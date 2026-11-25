import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {migratePackageToContract} from '../../src/configStudio/contractMigration';
import {buildWorkflowArtifact,prepareWorkflowArtifactImport} from '../../src/configStudio/workflowArtifact';
import {validateWorkflowDefinition} from '../../src/configStudio/runtime';
import {migrationMinimumRevision} from '../../src/configStudio/contract';
import type {ConfigPackageV3} from '../../src/configStudio/types';

const original=JSON.parse(gunzipSync(fs.readFileSync('scripts/config-tools/fixtures/c13-baseline.config.json.gz')).toString('utf8')) as ConfigPackageV3;
const oldest=migratePackageToContract(original,migrationMinimumRevision(21)).config;
for(let version=migrationMinimumRevision(21);version<21;version++){
  const source=migratePackageToContract(oldest,version).config;
  const target=migratePackageToContract(source,21).config;
  const artifact=buildWorkflowArtifact(source,source.workflows.find(w=>w.mode==='composed')!);
  const beforeSource=JSON.stringify(artifact),beforeTarget=JSON.stringify(target);
  assert(artifact.lookupTables?.some(table=>table.id==='standard-tag-fields'));
  assert(!artifact.lookupTables!.find(table=>table.id==='standard-tag-fields')!.rows.some(row=>row.value==='dataset'));
  const imported=prepareWorkflowArtifactImport(target,artifact);
  assert(validateWorkflowDefinition(imported.workflow,target).valid,`c${version} workflow must import into c21`);
  assert.equal(imported.tables.length,0,'an upgraded existing dependency must not replace or duplicate a shared table');
  assert.equal(imported.workflow.steps.flatMap(step=>step.controls??[]).filter(control=>control.kind==='dataset').length,imported.workflow.outputs.length);
  assert.equal(JSON.stringify(artifact),beforeSource,'source artifact must stay unchanged');
  assert.equal(JSON.stringify(target),beforeTarget,'import preparation must not mutate the destination');

  const conflict=structuredClone(artifact);
  conflict.lookupTables!.find(table=>table.id==='standard-tag-fields')!.rows[0].label.zh+=' — genuine conflict';
  assert.throws(()=>prepareWorkflowArtifactImport(target,conflict),/对照表 standard-tag-fields.*冲突/,'real user edits must still block import');
  assert.equal(JSON.stringify(target),beforeTarget);
}
console.log('c21 artifacts: supported older workflow dependencies migrate before comparison; source/destination preserved; real shared-table conflicts still rejected.');
