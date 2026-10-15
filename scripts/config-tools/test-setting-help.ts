import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {resolveSettingHelp} from '../../src/configStudio/settingHelpCatalog';
const sites=JSON.parse(fs.readFileSync('docs/90_roadmap-and-history/runtime-v32-postc-v11-20261015/help-control-sites.json','utf8')) as Array<{file:string;kind:string;title:string}>;
const missing=[...new Set(sites.filter(row=>row.title&&resolveSettingHelp(row.title,path.basename(row.file,'.tsx')).kind==='context').map(row=>`${path.basename(row.file,'.tsx')}/${row.title}`))];
assert.deepEqual(missing,[],'static setting sites must have semantic explanations');
const {inventory}=await import('./instrument-setting-help.mjs');assert.equal(inventory.length,0,'new controls need local help integration');
for(const [title,context] of [['symbol','ExtraRuleSettings'],['NE','RenderRuleExtensionsEditor'],['tags.custom','NodeFieldSettingsEditor'],['custom','LabelSourceEditor'],['1','GeneralParameterEditor:sources/github/sourceIds/0']]){const result=resolveSettingHelp(title,context);assert.notEqual(result.kind,'context');assert(result.text.length>25);assert(result.key.includes(title));}
console.log(`setting-help: ${sites.length} static sites, dynamic field/event/direction semantics and new-control coverage passed`);
