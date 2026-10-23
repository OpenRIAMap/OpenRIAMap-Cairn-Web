import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import {CONTRACT_CAPABILITIES,supportsContract,NATIVE_CONFIG_REVISION} from '../../src/configStudio/contract';
import {migrationChain} from '../../src/configStudio/contractMigration';
import {CONFIGURATION_RULES_VERSION} from '../../src/configRuntime/formalConfiguration';
import type {ConfigPackageV3} from '../../src/configStudio/types';
const latest:ConfigPackageV3['contractRevision']=NATIVE_CONFIG_REVISION;
for(const capability of ['native','activation','category','workflow','publication'] as const){assert(supportsContract(capability,latest));assert(!supportsContract(capability,latest+1));}
assert.equal(CONFIGURATION_RULES_VERSION,`cairnmap-c${latest}-production-1`);
assert.equal(JSON.parse(fs.readFileSync('vendor/configuration-r11/manifest.json','utf8')).rulesVersion,CONFIGURATION_RULES_VERSION);
for(let source=Math.max(13,latest-5);source<=latest;source++)for(const kind of ['package','node','classTree','workflow'] as const)assert.equal(migrationChain(source,latest,kind).length,latest-source);
const violations:string[]=[],inventory:Array<{file:string;line:number;text:string;category:string}>=[],gates:Array<{file:string;line:number;text:string}>=[];
function scan(directory:string){for(const entry of fs.readdirSync(directory,{withFileTypes:true})){
  const name=path.join(directory,entry.name);if(entry.isDirectory()){if(!['defaults','Legacy'].includes(entry.name))scan(name);continue;}
  if(!/\.(?:tsx?|m?js)$/.test(name)||name.includes('.generated.'))continue;
  const text=fs.readFileSync(name,'utf8'),source=ts.createSourceFile(name,text,ts.ScriptTarget.Latest,true,name.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
  text.split(/\r?\n/).forEach((line,index)=>{if(/contractRevision\s*(?:[<>=!]|\)|\])|supportsContract\(/.test(line))gates.push({file:name,line:index+1,text:line.trim().slice(0,500)});});
  function visit(node:ts.Node){
    if(ts.isJsxText(node)||ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node)){
      const value=node.getText(source);if(/(?:契约|迁移|原生|需要|最低|信息卡|点状显示|公式编辑器|图层按钮)/.test(value)&&/\br\d+\b/.test(value)){
        const line=source.getLineAndCharacterOfPosition(node.getStart(source)).line+1;
        inventory.push({file:name,line,text:value.slice(0,300),category:'historical-r-or-invalid-copy'});
        // Protocol/schema identifiers and issue codes are deliberately historical.
        if(!/(cairnmap[.-]|render-|contract-|\.\/|\.ts|r\d+-production)/.test(value))violations.push(`${name}:${line}: ${value}`);
      }
      else if(/(?:\bc\d+\b|cairnmap-.*production|contractRevision)/.test(value)&&/(?:契约|迁移|最低|需要|production|contractRevision)/.test(value))inventory.push({file:name,line:source.getLineAndCharacterOfPosition(node.getStart(source)).line+1,text:value.slice(0,300),category:/production/.test(value)?'rules-identity':/(?:最低|需要|要求|迁移)/.test(value)?'capability-or-migration':'document-identity'});
    }
    if(ts.isTemplateExpression(node)&&/r\$\{[^}]*contractRevision/.test(node.getText(source)))violations.push(`${name}: contract identity still uses r: ${node.getText(source)}`);
    ts.forEachChild(node,visit);
  }visit(source);
}}
scan('src/configStudio');scan('src/configRuntime');scan('src/components/Settings');
assert(!fs.readFileSync('src/configStudio/CategoryFileControls.tsx','utf8').includes('config.contractRevision!==9'));
assert(!fs.readFileSync('src/configStudio/runtime.ts','utf8').includes('原生契约 revision 5/6'));
assert(fs.readFileSync('scripts/relay/formal-configuration-context.mjs','utf8').includes('CONTRACT_CAPABILITIES.publication.includes(identity.contractRevision)'),'CLI and Web must use the same publication capability list');
if(process.env.CAIRNMAP_CONTRACT_AUDIT_OUT){fs.mkdirSync(path.dirname(process.env.CAIRNMAP_CONTRACT_AUDIT_OUT),{recursive:true});fs.writeFileSync(process.env.CAIRNMAP_CONTRACT_AUDIT_OUT,JSON.stringify({latest,capabilities:CONTRACT_CAPABILITIES,inventory,gates,violations},null,2));}
assert.deepEqual(violations,[],violations.join('\n'));
console.log(`Contract maintenance: c${latest} capabilities, all import kinds/window steps, unknown future rejection and UI copy audit passed.`);
