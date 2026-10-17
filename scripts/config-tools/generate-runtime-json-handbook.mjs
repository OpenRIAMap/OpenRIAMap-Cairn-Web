import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { contractModel, lineIndex, collectExamples } from './json-handbook/model.mjs';
import { glossary, fieldNote, compatibilityNote } from './json-handbook/glossary.mjs';

const out = 'docs/20_config-reference/runtime-v32-json-handbook-r11-r7-20261017';
const source = 'src/configStudio/defaults/r11-r7.config.json';
const rawBytes = fs.readFileSync(source), raw = rawBytes.toString('utf8'), config = JSON.parse(raw);
const sha = value => createHash('sha256').update(value).digest('hex');
const model = contractModel(), lines = lineIndex(raw), { samples, seenProperties } = collectExamples(model, config, lines);
const ids = Object.keys(model.definitions).sort((a,b) => Number(a.slice(1)) - Number(b.slice(1)));
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const md = value => String(value).replaceAll('|','\\|').replaceAll('\r','').replaceAll('\n','<br>');
const code = value => '`' + md(value).replaceAll('`','&#96;') + '`';
const pointer = (base,key) => base + '/' + String(key).replaceAll('~','~0').replaceAll('/','~1');
const at = pointer => pointer === '' ? config : pointer.split('/').slice(1).reduce((value,key) => value[key.replaceAll('~1','/').replaceAll('~0','~')], config);
const asPath = value => '$' + value.split('/').slice(1).map(key => /^\d+$/.test(key) ? `[${key}]` : '.' + key.replaceAll('~1','/').replaceAll('~0','~')).join('');
const excerpt = value => { const text = JSON.stringify(value); return text.length > 150 ? text.slice(0,150) + '…（摘要）' : text; };
function typeText(schema, links = true) {
  if (schema.ref) { const label = `${model.metadata[schema.ref].name} [${schema.ref}]`; return links ? `[${md(label)}](#${schema.ref})` : label; }
  if (schema.anyOf) {
    if (schema.anyOf.length === 2 && schema.anyOf.every(item => typeof item.const === 'boolean')) return 'boolean：true / false';
    return schema.anyOf.map(s => typeText(s,links)).join(' / ');
  }
  if ('const' in schema) return code(JSON.stringify(schema.const));
  if (schema.type === 'array') return schema.tuple ? `固定数组 [${schema.tuple.map(s=>typeText(s,links)).join(', ')}]` : `数组＜${typeText(schema.items,links)}＞`;
  return schema.type ?? '任意 JSON（仍受模块语义约束）';
}
const structures = ids.map(id => {
  const definition = model.definitions[id], meta = model.metadata[id];
  const properties = Object.entries(definition.properties).map(([key,schema]) => {
    const note = fieldNote(meta,key); assert.ok(note,`Missing Chinese explanation for ${meta.name}.${key}`);
    const sample = samples[id]?.properties[key];
    if (sample) {
      assert.deepEqual(at(sample.path),sample.value,`Example pointer mismatch: ${sample.path}`);
      assert.deepEqual(JSON.parse(raw.slice(lines[sample.path].offset,lines[sample.path].endOffset)),sample.value,`Example source span mismatch: ${sample.path}`);
    }
    return { id:`${id}.${key}`, key, schema, type:typeText(schema,false), required:definition.required.includes(key), note,
      status:compatibilityNote(meta,key), comment:meta.properties[key].comment, declaration:meta.properties[key],
      ...(sample ? { sample:{path:sample.path,...lines[sample.path],excerpt:excerpt(sample.value)} } : {}) };
  });
  return { id, name:meta.name, usage:meta.usage, ...(samples[id] ? {sample:{path:samples[id].path,start:samples[id].start,end:samples[id].end,occurrences:samples[id].occurrences}} : {}), properties, ...(definition.additionalProperties ? {additionalProperties:definition.additionalProperties} : {}) };
});
const instances = [];
const add = (kind,label,id,p) => instances.push({kind,label,id,path:p,jsonPath:asPath(p),...lines[p]});
for (const key of Object.keys(config)) add('一级区块',glossary[key],key,pointer('',key));
config.nodes.forEach((node,i)=>{
  const p=`/nodes/${i}`, label=Object.values(node.path).join('/'); add('分类',label,node.nodeId,p);
  node.fields.forEach((field,j)=>add('字段',`${label} · ${field.key} · ${field.labels.zh||field.labels.en}`,field.fieldId,`${p}/fields/${j}`));
  for(const [geometry,profile] of Object.entries(node.geometryProfiles)) profile.zoomPriority.rules.forEach((rule,j)=>add('渲染规则',`${label} · ${geometry} · ${rule.when?.zoom?.min??rule.minZoom??'?'}–${rule.when?.zoom?.max??rule.maxZoom??'?'}`,rule.id,`${p}/geometryProfiles/${geometry}/zoomPriority/rules/${j}`));
  if(node.card?.mode==='fields')node.card.items.forEach((item,j)=>add('信息卡单元',`${label} · ${item.source}`,item.id,`${p}/card/items/${j}`));
});
config.workflows.forEach((workflow,i)=>{
  const p=`/workflows/${i}`;add('工作流',`${workflow.label.zh||workflow.label.en} · ${workflow.mode}${workflow.quickMapping===false?' · 非便捷采集':''}`,workflow.id,p);
  workflow.steps.forEach((step,j)=>{const q=`${p}/steps/${j}`;add('工作流页',`${workflow.id} · ${step.kind} · ${step.label.zh}`,step.id,q);(step.controls??[]).forEach((control,k)=>{const r=`${q}/controls/${k}`;add('控件',`${workflow.id} · ${control.slot??'无槽位'} · ${control.label.zh}`,control.id,r);control.group?.itemFields.forEach((field,n)=>add('重复组子字段',`${workflow.id} · ${control.slot}.${field.key} · ${field.label.zh}`,field.key,`${r}/group/itemFields/${n}`));});});
  workflow.outputs.forEach((output,j)=>{add('工作流输出',`${workflow.id} · ${Object.values(output.classification).join('/')}`,output.id,`${p}/outputs/${j}`);output.assignments.forEach((assignment,k)=>add('组装赋值',`${workflow.id} · ${assignment.target} ← ${assignment.expression}`,assignment.id,`${p}/outputs/${j}/assignments/${k}`));});
});
config.lookupTables.forEach((table,i)=>add('公共表',`${table.label.zh} · ${table.rows.length} 行`,table.id,`/lookupTables/${i}`));
config.application.worlds.forEach((world,i)=>add('世界',world.label.zh,world.id,`/application/worlds/${i}`));
config.application.buttons.items.forEach((button,i)=>add('图层按钮',button.names.zh,button.id,`/application/buttons/items/${i}`));
config.application.sources.groups.forEach((group,i)=>add('来源组',group.label.zh,group.id,`/application/sources/groups/${i}`));
const exampleSpecs = [
  ['世界与共享资源','/application/worlds/0','世界本身不再重复保存默认投影矩阵与瓦片地址。'],
  ['完整默认来源组','/application/sources/groups/0','数据/媒体与瓦片链路在一组内共享，世界标签由模板代入。'],
  ['自然地物按钮',`/application/buttons/items/${config.application.buttons.items.findIndex(x=>x.id==='natural_geo')}`,'同一行的分类层级同时满足，多行之间取并集。'],
  ['RLE 方向字段',`/nodes/${config.nodes.findIndex(n=>n.path.class==='RLE'&&Object.keys(n.path).length===1)}/fields/4`,'fieldId 标识定义身份，key 是真实字段。行 value 是文本编码，valueType:number 决定实际保存数字。'],
  ['RLE direction 信息卡实际状态',`/nodes/${config.nodes.findIndex(n=>n.path.class==='RLE'&&Object.keys(n.path).length===1)}/card/items/${config.nodes.find(n=>n.path.class==='RLE'&&Object.keys(n.path).length===1).card.items.findIndex(item=>item.source==='direction')}`,'这里的 prefillAudit 只是单次预填来源审计，不能视为实时字段/对照绑定。请按真实键判断。'],
  ['RLE Zoom 2–4 小胶囊',`/nodes/${config.nodes.findIndex(n=>n.path.class==='RLE'&&Object.keys(n.path).length===1)}/geometryProfiles/LineString/zoomPriority/rules/2`,'when.zoom 与 direction 条件同时成立；label.template 的双引号内是字段名。'],
  ['完整 TPP 工作流',`/workflows/${config.workflows.findIndex(w=>w.id==='v3-tpp_teleport')}`,'包含自身几何与独立额外绘制；按页、返回槽位、启用条件和输出绑定逐项阅读。'],
  ['出行方式公共表',`/lookupTables/${config.lookupTables.findIndex(t=>t.id==='road-travel-modes')}`,'前三列用于人类名称对照，functionValue 保留功能数值；使用方是否已经接入需看执行器。'],
  ['铁路专供编辑工作流',`/workflows/${config.workflows.findIndex(w=>w.id==='v3-editor-rle')}`,'quickMapping:false 和 editor.dedicated 将此方案与外部铁路采集入口分开。'],
];
const examples = exampleSpecs.map(([title,p,note])=>{assert.ok(lines[p],`Example missing ${title}`);return {title,path:p,note,value:at(p),...lines[p]};});
// Never claim a manually indexed field/card is something else after a seed update.
assert.equal(examples.find(x=>x.title==='RLE 方向字段').value.key,'direction');
assert.equal(examples.find(x=>x.title==='RLE direction 信息卡实际状态').value.source,'direction');
const counts={structures:structures.length,properties:structures.reduce((n,s)=>n+s.properties.length,0),usedStructures:Object.keys(samples).length,nodes:config.nodes.length,classes:config.nodes.filter(n=>Object.keys(n.path).length===1).length,workflows:config.workflows.length,tables:config.lookupTables.length,lines:raw.trimEnd().split('\n').length,bytes:rawBytes.length};
const functionSource=fs.readFileSync('src/configStudio/workflowExpression.ts','utf8');
const functions=[...functionSource.matchAll(/\{name:'([^']+)',label:'([^']+)',signature:'([^']+)',description:'([^']+)'/g)].map(m=>({name:m[1],label:m[2],signature:m[3],description:m[4]}));
assert.equal(functions.length,17);
let guide=fs.readFileSync('scripts/config-tools/json-handbook/guide.md','utf8');
const replacements={JSON_LINES:counts.lines,JSON_BYTES:counts.bytes,NODE_COUNT:counts.nodes,CLASS_COUNT:counts.classes,WORKFLOW_COUNT:counts.workflows,TABLE_COUNT:counts.tables,STRUCTURE_COUNT:counts.structures,PROPERTY_COUNT:counts.properties,USED_STRUCTURE_COUNT:counts.usedStructures,SOURCE_SHA:sha(rawBytes),FUNCTION_TABLE:'| 函数 | 中文功能 | 写法 | 解析 |\n| --- | --- | --- | --- |\n'+functions.map(f=>`| ${code(f.name)} | ${f.label} | ${code(f.signature)} | ${f.description} |`).join('\n'),ROOT_INDEX:'| 区块 | JSON Pointer | 完整 JSON 行号 |\n| --- | --- | --- |\n'+instances.filter(x=>x.kind==='一级区块').map(x=>`| ${code(x.id)} | ${code(x.path)} | ${x.start}–${x.end} |`).join('\n')};
guide=guide.replace(/@@([A-Z_]+)@@/g,(_match,key)=>{assert.ok(key in replacements,key);return String(replacements[key]);});
let reference='# 完整字段解析表\n\n基准：契约 r11 / 修订 r7。共 '+counts.structures+' 种对象结构、'+counts.properties+' 个命名字段位置。结构编号 t0/t1 只用于本手册内部跳转，不是配置文件字段。\n\n必填性仅表示该类型分支的结构要求，额外语义仍由实际核验器检查。默认未出现的键不虚构实例值。类型路径是首次遍历入口，共用结构也可出现在其他位置。\n\n';
reference+='| 编号 | 类型/首次入口 | 本包状态 |\n| --- | --- | --- |\n'+structures.map(s=>`| [${s.id}](#${s.id}) | ${code(s.name)} | ${s.sample?`实际出现 ${s.sample.occurrences} 次`:'契约支持但本包未出现'} |`).join('\n')+'\n\n';
for(const structure of structures){
  reference+=`<a id="${structure.id}"></a>\n\n## ${structure.id} · ${structure.name}\n\n首次类型入口：${code(structure.usage)}。${structure.sample?`本包实例：${code(structure.sample.path||'/')}，完整 JSON 第 ${structure.sample.start}–${structure.sample.end} 行。`:'本包没有此结构的实际实例；可能是可选功能或兼容分支。'}\n\n| 键 | 类型 / 子结构 | 结构要求 | 中文解析 | 本包示例（值为摘要） | 状态 |\n| --- | --- | --- | --- | --- | --- |\n`;
  for(const row of structure.properties)reference+=`| ${code(row.key)} | ${typeText(row.schema)} | ${row.required?'必填':'可选'} | ${md(row.note)} | ${row.sample?`${code(row.sample.excerpt)}；行 ${row.sample.start}，Pointer ${code(row.sample.path)}`:'本包未写入'} | ${row.status} |\n`;
  if(structure.additionalProperties)reference+=`| 【自定义键】 | ${typeText(structure.additionalProperties)} | 按使用方约定 | 此对象是字典，键名可变；不代表任意位置均接受新属性。 | 见该对象实际内容 | 当前契约支持 |\n`;
  reference+='\n';
}
let index='# 当前完整配置的实例定位索引\n\n所有行号对应 [current-full.config.json](current-full.config.json)，数组下标从 0 开始。对象 ID/字段名可在 JSON 编辑器中直接搜索；阅读器支持这些 Pointer 跳转。\n\n';
for(const kind of [...new Set(instances.map(x=>x.kind))]){index+=`## ${kind}\n\n| 名称/说明 | 稳定 ID / 键 | JSON Pointer | 行号 |\n| --- | --- | --- | --- |\n`;for(const item of instances.filter(x=>x.kind===kind))index+=`| ${md(item.label)} | ${code(item.id)} | ${code(item.path)} | ${item.start}–${item.end} |\n`;index+='\n';}
let exampleText='# 当前配置的典型完整片段与读法\n\n以下片段均按 Pointer 从完整 JSON 精确提取，没有为说明而补写绑定、默认值或字段。每个片段是一个完整对象，但 **不是可单独导入的整包**。本手册的“完整配置文件”是 current-full.config.json。\n\n';
for(const example of examples)exampleText+=`## ${example.title}\n\n来源：${code(example.path)}，完整 JSON 第 ${example.start}–${example.end} 行。\n\n${example.note}\n\n\`\`\`json\n${JSON.stringify(example.value,null,2)}\n\`\`\`\n\n`;
const data={baseline:{schemaVersion:config.schemaVersion,contractRevision:config.contractRevision,revision:config.revision,packageId:config.packageId,sha256:sha(rawBytes),source,counts},structures,instances,examples:examples.map(({value,...item})=>item),glossary,functions};
function renderMarkdown(markdown){
  const inline=s=>esc(s).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>');
  let html='',fence=false,table=false,list=false;
  const close=()=>{if(table){html+='</tbody></table></div>';table=false;}if(list){html+='</ul>';list=false;}};
  for(const line of markdown.split('\n')){
    if(line.startsWith('```')){close();fence=!fence;html+=fence?'<pre><code>':'</code></pre>';continue;}
    if(fence){html+=esc(line)+'\n';continue;}
    if(line.startsWith('|')){if(!table){close();table=true;html+='<div class="table-wrap"><table><tbody>';}
      if(/^\|\s*-/.test(line))continue;html+='<tr>'+line.split('|').slice(1,-1).map(cell=>'<td>'+inline(cell.trim())+'</td>').join('')+'</tr>';continue;}
    close();if(!line.trim())continue;
    const heading=/^(#{1,6}) (.*)$/.exec(line);if(heading){html+=`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`;continue;}
    html+='<p>'+inline(line)+'</p>';
  }
  close();return html;
}
const template=fs.readFileSync('scripts/config-tools/json-handbook/reader-template.html','utf8');
const embedded=JSON.stringify({data,raw}).replaceAll('<','\\u003c').replaceAll('\u2028','\\u2028').replaceAll('\u2029','\\u2029');
const html=template.replace('@@GUIDE_HTML@@',()=>renderMarkdown(guide)).replace('@@HANDBOOK_PAYLOAD@@',()=>embedded);
const files=new Map([['current-full.config.json',rawBytes],['README.md',guide],['FIELD_REFERENCE.md',reference.trimEnd()+'\n'],['INSTANCE_INDEX.md',index.trimEnd()+'\n'],['EXAMPLES.md',exampleText.trimEnd()+'\n'],['reference-data.json',JSON.stringify(data,null,2)+'\n'],['handbook.html',html]]);
const trackedSources=[source,'src/configStudio/types.ts','src/configStudio/native-contract-schema.generated.json','src/core/project/applicationTypes.ts','src/core/project/environmentTypes.ts','src/configStudio/runtime.ts','src/configStudio/workflowExpression.ts','src/configStudio/labelTemplate.ts','src/configStudio/workflowDrawing.ts','src/configStudio/V3WorkflowRunner.tsx','src/core/project/applicationResources.ts','scripts/config-tools/generate-runtime-json-handbook.mjs',...['model.mjs','glossary.mjs','guide.md','reader-template.html'].map(f=>'scripts/config-tools/json-handbook/'+f)];
const manifest={manualVersion:'1.0',date:'2026-10-17',baseline:data.baseline,scope:'Current downstream application default, not browser IndexedDB overrides or the upstream empty template.',sourceHashBasis:'UTF-8 LF for text source files; full JSON file uses exact original bytes.',sources:trackedSources.map(file=>({file,sha256:sha(file===source?fs.readFileSync(file):fs.readFileSync(file,'utf8').replaceAll('\r\n','\n'))})),files:[...files].map(([file,contents])=>({file,bytes:Buffer.byteLength(contents),sha256:sha(contents)})),coverage:{allNamedSchemaPropertiesExplained:true,allActualPropertiesTraversed:true,allExamplePointersAndLinesVerified:true,actualPropertyNames:seenProperties,unknownFieldsAdded:0},knownLimitation:'Category allowMultipleParts is checked before native workflow commit, but multipart toggle/add-part entry disabling is not fully linked to final classification. No application repair in this documentation task.'};
files.set('handbook-manifest.json',JSON.stringify(manifest,null,2)+'\n');
if(process.argv.includes('--check')){
  for(const [file,contents]of files)assert.ok(fs.readFileSync(path.join(out,file)).equals(Buffer.isBuffer(contents)?contents:Buffer.from(contents)),`Handbook drift: ${file}`);
  console.log(`Handbook verified: ${counts.structures} structures, ${counts.properties} properties, ${instances.length} exact instance pointers, ${examples.length} examples; default JSON unchanged.`);
}else{
  fs.mkdirSync(out,{recursive:true});for(const [file,contents]of files)fs.writeFileSync(path.join(out,file),contents);
  console.log(`Handbook generated: ${out}; ${counts.structures} structures / ${counts.properties} properties / ${instances.length} instances.`);
}
