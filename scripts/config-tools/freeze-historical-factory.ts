import fs from 'node:fs';
import {createConfigPackageFromCurrentProject} from '../../src/configStudio/legacyProjectAdapter';
import {WORKFLOW_EDITOR_SCHEMAS,projectRegistryScene} from '@/legacy/editorSchemas/index';
import {getClassTagRegistryEntries} from '../../src/core/project/classMetadata';
import {SEARCH_RULE_BLACKLIST_LINES,SEARCH_RULE_PRIORITY_LINES,SEARCH_CATEGORY_OVERRIDE_LINES} from '../../src/components/Search/searchRuleTables';
// Historical fixture generator. This output is never an active configuration.
const config=createConfigPackageFromCurrentProject();
config.parity!.generatedAt='2026-10-26T00:00:00.000Z';
fs.mkdirSync('src/configStudio/migrationData',{recursive:true});
fs.writeFileSync('src/configStudio/migrationData/factory-c6.json',JSON.stringify(config,null,2)+'\n');
fs.writeFileSync('src/configStudio/migrationData/editor-scenes.json',JSON.stringify(WORKFLOW_EDITOR_SCHEMAS.map(schema=>({schema,workflow:projectRegistryScene(schema,'workflow')})),null,2)+'\n');
fs.writeFileSync('src/configStudio/migrationData/tag-entries.json',JSON.stringify(getClassTagRegistryEntries(),null,2)+'\n');
fs.writeFileSync('src/configStudio/migrationData/search-rules.json',JSON.stringify({SEARCH_RULE_BLACKLIST_LINES,SEARCH_RULE_PRIORITY_LINES,SEARCH_CATEGORY_OVERRIDE_LINES},null,2)+'\n');
console.log(JSON.stringify({contract:config.contractRevision,nodes:config.nodes.length,workflows:config.workflows.length}));
