import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const excluded=new Set(['ModuleHelp','SettingHelp','V3WorkflowRunner','WorkflowAnnotationsInput','FeatureSearchInput','ConfigRuntimePreview','ConfigRuntimeMap']);
const root='src/configStudio',inventory=[];
for(const name of fs.readdirSync(root).filter(name=>name.endsWith('.tsx'))){
 const context=name.slice(0,-4);if(excluded.has(context))continue;
 const file=path.join(root,name),source=fs.readFileSync(file,'utf8'),tree=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX),edits=[];
 const tag=node=>node.tagName?.getText(tree);
 const insideLabel=node=>{for(let parent=node.parent;parent;parent=parent.parent)if(ts.isJsxElement(parent)&&['label','HelpLabel','SettingField','HelpControl'].includes(tag(parent.openingElement)))return true;return false;};
 const walk=node=>{
  if(ts.isJsxElement(node)&&tag(node.openingElement)==='label'){
   edits.push({start:node.openingElement.tagName.getStart(tree),end:node.openingElement.tagName.end,text:`HelpLabel context="${context}"`},{start:node.closingElement.tagName.getStart(tree),end:node.closingElement.tagName.end,text:'HelpLabel'});
   inventory.push({file,kind:'label',title:node.children.filter(ts.isJsxText).map(n=>n.text.trim()).filter(Boolean).join(' ')});
  }
  if((ts.isJsxSelfClosingElement(node)||ts.isJsxElement(node))&&['input','select','textarea'].includes(tag(ts.isJsxElement(node)?node.openingElement:node))&&!insideLabel(node)){
   const opening=ts.isJsxElement(node)?node.openingElement:node,attrs=opening.attributes.properties;
   const literal=name=>{const attr=attrs.find(a=>ts.isJsxAttribute(a)&&a.name.getText(tree)===name);return attr?.initializer&&ts.isStringLiteral(attr.initializer)?attr.initializer.text:undefined;};
   if(['file','hidden'].includes(literal('type'))||literal('className')?.split(/\s+/).includes('hidden'))return;
   edits.push({start:node.getStart(tree),end:node.getStart(tree),text:`<HelpControl context="${context}">`},{start:node.end,end:node.end,text:'</HelpControl>'});
   inventory.push({file,kind:'control',title:literal('aria-label')??literal('placeholder')??literal('title')??''});
  }
  ts.forEachChild(node,walk);
 };walk(tree);
 if(edits.length&&process.argv.includes('--apply')){let text=source;for(const edit of edits.sort((a,b)=>b.start-a.start||b.end-a.end||Number(a.text.startsWith('</'))-Number(b.text.startsWith('</'))))text=text.slice(0,edit.start)+edit.text+text.slice(edit.end);const imports=[...new Set(edits.flatMap(e=>e.text.includes('HelpLabel')?['HelpLabel']:e.text.includes('HelpControl')?['HelpControl']:[]))];text=`import {${imports.join(',')}} from './SettingHelp';\n`+text;fs.writeFileSync(file,text);}
}
const destination=process.argv.find(arg=>arg.endsWith('.json'));if(destination)fs.writeFileSync(destination,JSON.stringify(inventory,null,2)+'\n');
console.log(`setting help: ${inventory.length} control/label sites ${process.argv.includes('--apply')?'instrumented':'pending'}`);
export {inventory};
