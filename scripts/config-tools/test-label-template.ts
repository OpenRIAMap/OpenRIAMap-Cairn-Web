import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parseLabelTemplate, evaluateLabelTemplate, resolveLabelText, labelTemplateTokens } from '../../src/configStudio/labelTemplate';
import { migrateConfigToR10 } from '../../src/configStudio/r10Migration';
import { compileConfigRuntime, validateConfigPackage } from '../../src/configStudio/runtime';
import { resolveConfigRuntimeRule } from '../../src/components/Rules/configRuntime/configPackageAdapter';
import { FeatureStore } from '../../src/components/Rules/data/featureStore';
const old=JSON.parse(fs.readFileSync('src/configStudio/defaults/r9-r5.config.json','utf8')),config=migrateConfigToR10(old).config;
assert(validateConfigPackage(config).valid,JSON.stringify(validateConfigPackage(config).issues.filter(issue=>issue.severity==='error')));
assert.equal(evaluateLabelTemplate(parseLabelTemplate('"bureau"/"line"'),path=>({bureau:'T',line:1})[path as 'bureau'|'line']),'T/1');
assert.equal(evaluateLabelTemplate(parseLabelTemplate('"a""b"'),path=>path==='a'?0:false),'0false');
for(const value of ['',undefined,null,[],{},Infinity])assert.equal(evaluateLabelTemplate(parseLabelTemplate('prefix"a"'),()=>value),undefined);
for(const value of ['"a','"constructor"','"a.__proto__"','"a[b]"','literal','"a"'.repeat(257),'x'.repeat(8193)+'"a"','"a"\\q'])assert.throws(()=>parseLabelTemplate(value),value.slice(0,40));
assert.equal(evaluateLabelTemplate(parseLabelTemplate('\\""a"\\"'),()=>1),'"1"');
const active=compileConfigRuntime(config),rail=active.nodes.find(node=>node.path.class==='RLE'&&!node.path.kind)!.geometryProfiles.LineString!,combined=rail.zoomPriority.rules.find(rule=>rule.id==='r10-rle-code-pill-zoom2-4')!.label!;
assert.equal(labelTemplateTokens(combined),labelTemplateTokens(combined));
assert.equal(resolveLabelText(combined,path=>path==='ID'?'fallback':undefined,value=>value,()=>''),'fallback');
const invalid=structuredClone(config);invalid.nodes.find(node=>node.path.class==='RLE'&&!node.path.kind)!.geometryProfiles.LineString!.zoomPriority.rules.find(rule=>rule.id==='r10-rle-code-pill-zoom2-4')!.label!.template='"notAField"';assert(!validateConfigPackage(invalid).valid);
let comparisons=0;
for(const direction of ['0','1','3'])for(let zoom=0;zoom<=8;zoom++){
  const record:any={uid:'rail',type:'Polyline',featureInfo:{Class:'RLE',ID:'rail',Name:'正式线路名',World:'zth',direction,bureau:'T',line:'1',color:'#ff0000'},meta:{Class:'RLE',idValue:'rail',sig:{},groups:{}},coords3:[{x:0,y:-64,z:0},{x:100,y:-64,z:100}]};
  const ctx:any={worldId:'zth',zoomLevel:zoom,leafletZoom:zoom-3,inFloorView:false},store=new FeatureStore([record]),plan=resolveConfigRuntimeRule(active,record,ctx,null,store),before=resolveConfigRuntimeRule(old,record,ctx,null,store);
  if(direction==='3'&&zoom>=2&&zoom<=4){assert(plan?.symbol?.label?.enabled);assert.equal(plan?.symbol?.label?.textFrom?.(record),'T1');assert.notEqual(plan?.symbol?.label?.styleKey,before?.symbol?.label?.styleKey);}
  else {assert.equal(plan?.symbol?.label?.enabled,before?.symbol?.label?.enabled);assert.equal(plan?.symbol?.label?.textFrom?.(record),before?.symbol?.label?.textFrom?.(record));assert.deepEqual(plan?.symbol?.label?.styleKey,before?.symbol?.label?.styleKey);}comparisons++;
}
console.log(`label-template: safe syntax/escaping/budgets, empty/object fallback, 0/false, immutable compilation, unknown fields and ${comparisons} actual RLE Zoom/direction plans passed; frozen V1 fixture unchanged`);
