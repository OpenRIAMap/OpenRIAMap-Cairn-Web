/** One-off audit for the visual-only revision; no network or app writes. */
import ts from 'typescript';
import {execFileSync} from 'node:child_process';
import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const baseline=process.argv[2]??'ebaf17b';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:16*1024*1024});
const printer=ts.createPrinter({removeComments:true});
const parse=(file,text)=>ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const semanticAttribute=/^(on[A-Z]|value$|checked$|disabled$|readOnly$|defaultValue$|defaultChecked$|type$|min$|max$|step$|rows$|multiple$|draggable$|key$|ref$)/;
function bindings(file,text){
  const source=parse(file,text),result=[];
  function visit(node){
    if(ts.isJsxAttribute(node)&&semanticAttribute.test(node.name.text)){
      result.push(printer.printNode(ts.EmitHint.Unspecified,node,source).replace(/\s+/g,' '));
    }
    ts.forEachChild(node,visit);
  }
  visit(source);return result.sort();
}
function logic(file,text){
  const source=parse(file,text);
  const transformed=ts.transform(source,[context=>root=>{
    function visit(node){
      if(ts.isJsxElement(node)||ts.isJsxSelfClosingElement(node)||ts.isJsxFragment(node))return ts.factory.createIdentifier('__PRESENTATION__');
      return ts.visitEachChild(node,visit,context);
    }
    return ts.visitNode(root,visit);
  }]);
  const result=printer.printFile(transformed.transformed[0]);transformed.dispose();return result;
}
const files=git('diff','--name-only',baseline,'--','src').trim().split(/\r?\n/).filter(Boolean);
const audited=[];
for(const file of files){
  if(file.endsWith('.css'))continue;
  assert.ok(file.startsWith('src/configStudio/')&&file.endsWith('.tsx'),`Unexpected non-presentation file: ${file}`);
  const before=git('show',`${baseline}:${file}`),after=readFileSync(file,'utf8');
  // Shared help shells intentionally add presentation metadata and labels;
  // their behavior is covered by help and browser acceptance.
  if(!file.endsWith('/SettingHelp.tsx')){
    assert.deepEqual(bindings(file,after),bindings(file,before),`Changed input/event bindings: ${file}`);
    assert.equal(logic(file,after),logic(file,before),`Changed logic outside JSX: ${file}`);
  }
  audited.push({file,bindingCount:bindings(file,after).length,helpShell:file.endsWith('/SettingHelp.tsx')});
}
const protectedFiles=[...git('ls-tree','-r','--name-only',baseline,'src/configStudio/defaults','public').trim().split(/\r?\n/).filter(file=>/config|manifest|\.zip$/.test(file)),
  'src/configStudio/types.ts','src/configStudio/runtime.ts','src/configStudio/V3WorkflowRunner.tsx','src/configStudio/workflowExpression.ts','src/components/Rules/core/RuleDrivenLayer.tsx'];
const hashes=[];
for(const file of protectedFiles){
  if(!existsSync(file))continue;
  const before=execFileSync('git',['show',`${baseline}:${file}`],{maxBuffer:32*1024*1024});
  const after=readFileSync(file);
  // Text checkout EOL does not alter the content contract.
  const normalize=data=>file.endsWith('.zip')?data:Buffer.from(data.toString('utf8').replace(/\r\n/g,'\n'));
  assert.deepEqual(normalize(after),normalize(before),`Protected file changed: ${file}`);
  hashes.push({file,sha256:createHash('sha256').update(normalize(after)).digest('hex')});
}
console.log(JSON.stringify({baseline,auditedFiles:audited,unchangedProtectedFiles:hashes},null,2));
