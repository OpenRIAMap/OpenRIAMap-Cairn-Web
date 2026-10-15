import type { CardItem, ConfigPackageV3, ConfigValidationIssue, FieldDefinition, FieldDefinitionRef, LookupTable, OptionTable, PrefillAudit, SelectOption } from './types';
import { resolveEffectiveFields } from './runtime';

export type OptionsOwner = { options?: SelectOption[]; optionTable?:OptionTable; optionsFieldRef?:FieldDefinitionRef; optionsTableId?: string; optionValueType?: FieldDefinition['optionValueType'];prefillAudit?:PrefillAudit };
export function referencedField(config:ConfigPackageV3,ref:FieldDefinitionRef):FieldDefinition|undefined {
  const node=config.nodes.find(node=>node.nodeId===ref.nodeId);
  return node?resolveEffectiveFields(config,node.path).find(field=>field.fieldId===ref.fieldId):undefined;
}
export function effectiveOptionTable(config:Pick<ConfigPackageV3,'lookupTables'>,owner:OptionsOwner):OptionTable {
  if(owner.optionsFieldRef){
    if(!('nodes' in config))return {valueType:owner.optionValueType??'string',rows:[]};
    const field=referencedField(config as ConfigPackageV3,owner.optionsFieldRef);
    return field?{valueType:field.optionValueType??field.optionTable?.valueType??'string',rows:field.options??[]}:{valueType:owner.optionValueType??'string',rows:[]};
  }
  const table=owner.optionsTableId?config.lookupTables?.find(table=>table.id===owner.optionsTableId):undefined;
  if(owner.optionsTableId)return {valueType:table?.valueType??owner.optionValueType??'string',rows:table?.rows??[]};
  return owner.optionTable??{valueType:owner.optionValueType??'string',rows:owner.options??[]};
}
export function effectiveOptions(config: Pick<ConfigPackageV3,'lookupTables'>, owner: OptionsOwner): SelectOption[] {
  const rows = effectiveOptionTable(config,owner).rows;
  return rows.map(({value,label})=>({value,label}));
}
export function effectiveOptionsOwner<T extends OptionsOwner>(config: Pick<ConfigPackageV3,'lookupTables'>, owner:T):T {
  if(!owner.optionsFieldRef&&!owner.optionsTableId&&!owner.optionTable)return owner;
  const table=effectiveOptionTable(config,owner);
  return {...owner,options:effectiveOptions(config,owner),optionValueType:table.valueType};
}
export function localOptions<T extends OptionsOwner>(config:Pick<ConfigPackageV3,'lookupTables'>,owner:T,table:OptionTable):T {
  return {...owner,optionsFieldRef:undefined,optionsTableId:undefined,prefillAudit:undefined,...('contractRevision' in config&&Number(config.contractRevision)>=11?{optionTable:structuredClone(table),options:undefined,optionValueType:table.valueType}:{options:structuredClone(table.rows),optionValueType:table.valueType})};
}
export function prefillOptionTable<T extends OptionsOwner>(config:ConfigPackageV3,owner:T,table:OptionTable):T {
  const current=effectiveOptionTable(config,owner);
  if(current.rows.length&&current.valueType!==table.valueType)throw Error('值类型不兼容，未修改当前对照。');
  const key=(value:string)=>table.valueType==='number'?String(Number(value)):value;
  const rows=structuredClone(current.rows),at=new Map(rows.map((row,index)=>[key(row.value),index]));
  for(const row of table.rows){const index=at.get(key(row.value));if(index===undefined){at.set(key(row.value),rows.length);rows.push(structuredClone(row));}else rows[index]=structuredClone(row);}
  return localOptions(config,owner,{valueType:table.valueType,rows});
}
export function bindOptionsField<T extends OptionsOwner>(config:ConfigPackageV3,owner:T,ref:FieldDefinitionRef):T {
  const field=referencedField(config,ref);if(!field?.options?.length)throw Error('所选字段没有有效对照。');
  return {...owner,optionsFieldRef:structuredClone(ref),optionsTableId:undefined,optionTable:undefined,options:undefined,prefillAudit:undefined,optionValueType:field.optionValueType??'string'};
}
export function bindOptionsTable<T extends OptionsOwner>(config:ConfigPackageV3, owner:T, tableId?:string):T {
  if(!tableId){const table=effectiveOptionTable(config,owner);if((owner.optionsTableId||owner.optionsFieldRef)&&!table.rows.length)throw Error('绑定来源失效，请重新绑定有效来源，不能解除为空副本。');return localOptions(config,owner,table);}
  const table=config.lookupTables?.find(item=>item.id===tableId);if(!table)throw Error('所选对照表不存在。');
  if(!table.rows.length)throw Error('所选对照表为空。');
  return {...owner,optionsTableId:tableId,optionsFieldRef:undefined,optionTable:undefined,prefillAudit:undefined,options:undefined,optionValueType:table.valueType};
}
export function cardOptionsOwner(item:CardItem):OptionsOwner {return {...item,options:item.valueOptions};}
export function withCardOptions(item:CardItem,owner:OptionsOwner):CardItem {
  return {...item,optionTable:owner.optionTable,optionsTableId:owner.optionsTableId,optionsFieldRef:owner.optionsFieldRef,optionValueType:owner.optionValueType,valueOptions:owner.options,prefillAudit:owner.prefillAudit};
}
export function resolveBoundCard(config:ConfigPackageV3,item:CardItem):CardItem {
  const field=item.fieldBinding?referencedField(config,item.fieldBinding):undefined;
  const next=field?{...item,source:field.key,label:field.labels,options:{...item.options,format:field.options?.length?'enum' as const:field.format??'plain' as const}}:item;
  const owner=cardOptionsOwner(next);
  return owner.optionTable||owner.optionsTableId||owner.optionsFieldRef?{...next,valueOptions:effectiveOptions(config,owner)}:next;
}
export function bindCardField(config:ConfigPackageV3,item:CardItem,ref:FieldDefinitionRef):CardItem {
  if(item.inheritFrom)throw Error('硬继承项目不能重新绑定来源。');
  const field=referencedField(config,ref);if(!field)throw Error('所选字段已不存在。');
  let next:CardItem={...item,fieldBinding:structuredClone(ref),source:field.key,label:structuredClone(field.labels),prefillAudit:undefined};
  if(field.options?.length)next=withCardOptions(next,bindOptionsField(config,cardOptionsOwner(next),ref));
  return next;
}
export function unbindCardField(config:ConfigPackageV3,item:CardItem):CardItem {
  if(item.inheritFrom)throw Error('硬继承项目不能解除绑定。');
  if(!item.fieldBinding||!referencedField(config,item.fieldBinding))throw Error('字段绑定已失效，请重新绑定有效字段。');
  const resolved=resolveBoundCard(config,item);
  // Dictionary reference remains independent; its derived rows are not persisted.
  return {...resolved,fieldBinding:undefined,valueOptions:resolved.optionsFieldRef||resolved.optionsTableId||resolved.optionTable?undefined:resolved.valueOptions};
}
export function tableReferences(config:ConfigPackageV3, id:string):string[] {
  return [
    ...config.nodes.flatMap(node=>node.fields.filter(field=>field.optionsTableId===id).map(field=>`分类 ${node.nodeId} / ${field.key}`)),
    ...config.nodes.flatMap(node=>node.card?.mode==='fields'?node.card.items.filter(item=>item.optionsTableId===id).map(item=>`信息卡 ${node.nodeId} / ${item.id}`):[]),
    ...config.workflows.flatMap(workflow=>workflow.steps.flatMap(step=>(step.controls??[]).flatMap(control=>[
      ...(control.optionsTableId===id?[`工作流 ${workflow.id} / ${control.slot??control.id}`]:[]),
      ...(control.group?.itemFields??[]).filter(field=>field.optionsTableId===id).map(field=>`工作流 ${workflow.id} / ${control.slot??control.id} / ${field.key}`),
    ]))),
  ];
}
export function renameLookupTable(input:ConfigPackageV3,from:string,to:string):ConfigPackageV3 {
  if(from===to)return input;
  if(!/^[a-z][a-z0-9-]{1,80}$/.test(to)||input.lookupTables?.some(table=>table.id===to))throw Error('表格 ID 格式无效或与已有表格重复。');
  if(!input.lookupTables?.some(table=>table.id===from))throw Error('原表格已不存在。');
  const config=structuredClone(input);
  config.lookupTables!.find(table=>table.id===from)!.id=to;
  const update=(owner:OptionsOwner)=>{if(owner.optionsTableId===from)owner.optionsTableId=to;};
  config.nodes.forEach(node=>{node.fields.forEach(update);if(node.card?.mode==='fields')node.card.items.forEach(item=>{if(item.optionsTableId===from)item.optionsTableId=to;});});
  config.workflows.forEach(workflow=>workflow.steps.forEach(step=>step.controls?.forEach(control=>{update(control);control.group?.itemFields.forEach(update);})));
  return config;
}
export function lookupFunctionValue(config:Pick<ConfigPackageV3,'lookupTables'>,tableId:string,value:string|number|boolean):LookupTable['rows'][number]['functionValue'] {
  return config.lookupTables?.find(table=>table.id===tableId)?.rows.find(row=>row.value===String(value))?.functionValue;
}
export function validateLookupTables(config:ConfigPackageV3,includeNodes=true):ConfigValidationIssue[] {
  const issues:ConfigValidationIssue[]=[];
  const error=(path:string,message:string,code='lookup-table-invalid')=>issues.push({severity:'error',code,path,message});
  if(config.contractRevision<10&&(config.lookupTables?.length||config.nodes.some(n=>n.fields.some(f=>f.optionsTableId))||config.workflows.some(w=>w.steps.some(s=>s.controls?.some(c=>c.optionsTableId||c.group?.itemFields.some(f=>f.optionsTableId))))))error('lookupTables','对照表需要 r10 契约。');
  const ids=new Set<string>();
  for(const table of config.lookupTables??[]){
    const path=`lookupTables/${table.id}`;
    if(!/^[a-z][a-z0-9-]{1,80}$/.test(table.id)||ids.has(table.id))error(path,'表格 ID 必须有效且唯一。');ids.add(table.id);
    if(!(table.label.zh.trim()||config.contractRevision>=11&&table.label.en.trim()))error(path,'表格需要中文或英文名称。');
    if(!table.rows.length)error(path,'表格至少需要一行。');
    const values=new Set<string>();const pointIds=new Set<string>();
    for(const [index,row] of table.rows.entries()){
      const at=`${path}/rows/${index}`,normalized=table.valueType==='number'?String(Number(row.value)):row.value;
      if(!row.value.trim()||values.has(normalized)||table.valueType==='number'&&!Number.isFinite(Number(row.value))||table.valueType==='boolean'&&!['true','false'].includes(row.value))error(at,'存储值为空、重复或类型不符。');values.add(normalized);
      if(!(row.label.zh.trim()||config.contractRevision>=11&&row.label.en.trim()))error(at,'对照行需要中文或英文名称。');
      if(table.functionKind==='none'&&row.functionValue!==undefined)error(at,'无功能值表格不能包含功能值。');
      if(table.functionKind==='speed'&&(typeof row.functionValue!=='number'||!Number.isFinite(row.functionValue)||row.functionValue<=0))error(at,'出行速度必须为正数，单位为方块/秒。');
      if(table.functionKind==='teleportHub'){
        const hub=row.functionValue;
        if(!hub||typeof hub==='number'||!hub.world.trim()||!Number.isFinite(hub.range)||hub.range<=0||!hub.returnPoints.length){error(at,'枢纽需设置世界、正数范围及至少一个返回点。');continue;}
        for(const point of hub.returnPoints){if(!point.id.trim()||pointIds.has(`${hub.world}/${point.id}`)||![point.x,point.y,point.z].every(Number.isFinite)||!point.label.zh.trim())error(at,'返回点 ID/名称/坐标无效，或同世界 ID 重复。');pointIds.add(`${hub.world}/${point.id}`);}
      }
    }
  }
  const inspect=(owner:OptionsOwner,path:string)=>{if(!owner.optionsTableId)return;const table=config.lookupTables?.find(row=>row.id===owner.optionsTableId);if(!table)error(path,`引用的对照表 ${owner.optionsTableId} 不存在。`,'lookup-table-reference-missing');if(table&&table.valueType!==(owner.optionValueType??'string'))error(path,'表格存储值类型已变化，请重新选择表格确认绑定类型。','lookup-table-type-changed');if(owner.options?.length)error(path,'绑定表格后不能同时保存独立对照行，请先解除绑定。');};
  if(includeNodes)config.nodes.forEach(node=>node.fields.forEach(field=>inspect(field,`nodes/${node.nodeId}/fields/${field.fieldId}`)));
  config.workflows.forEach(w=>w.steps.forEach(s=>s.controls?.forEach(c=>{inspect(c,`workflows/${w.id}/${c.id}`);c.group?.itemFields.forEach(f=>inspect(f,`workflows/${w.id}/${c.id}/${f.key}`));})));
  if(config.contractRevision>=11){
    const check=(owner:OptionsOwner,path:string,expected?:string,defaultValue?:unknown)=>{
      if([Boolean(owner.optionsFieldRef),Boolean(owner.optionsTableId),Boolean(owner.optionTable)].filter(Boolean).length>1)error(path,'副本、字段对照和公共表只能选择一种来源。');
      if((owner.optionsTableId||owner.optionsFieldRef||owner.optionTable)&&owner.options?.length)error(path,'对照主体或绑定不能同时保存旧式独立行。');
      const table=effectiveOptionTable(config,owner),binding=owner.optionsTableId||owner.optionsFieldRef;
      if(owner.optionsFieldRef&&!referencedField(config,owner.optionsFieldRef))error(path,'绑定字段不存在或在该分类中不再有效。','lookup-field-reference-missing');
      if(binding&&!table.rows.length)error(path,'绑定来源为空，必须手动修复。','lookup-binding-empty');
      if(binding&&owner.optionValueType&&table.valueType!==owner.optionValueType)error(path,'绑定来源类型已改变，请重新绑定确认。','lookup-binding-type-changed');
      if(expected&&table.rows.length&&table.valueType!==expected)error(path,'对照值类型与目标字段保存类型不兼容。');
      const values=new Set<string>();for(const row of table.rows){const key=table.valueType==='number'?String(Number(row.value)):row.value;
        if(!row.value.trim()||values.has(key)||table.valueType==='number'&&!Number.isFinite(Number(row.value))||table.valueType==='boolean'&&!['true','false'].includes(row.value)||!(row.label.zh.trim()||row.label.en.trim()))error(path,'对照包含空名称、重复值或不合法的保存值。');values.add(key);
      }
      if(defaultValue!==undefined&&table.rows.length&&(!table.rows.some(row=>row.value===String(defaultValue))||typeof defaultValue!==table.valueType))error(path,'默认值与当前对照的保存值或类型不兼容。');
    };
    if(includeNodes)config.nodes.forEach(node=>{
      node.fields.forEach(field=>check(field,`nodes/${node.nodeId}/fields/${field.fieldId}`,field.type==='enum'?field.optionValueType??'string':field.type==='number'?'number':field.type==='boolean'?'boolean':field.type==='string'?'string':undefined));
      if(node.card?.mode==='fields')node.card.items.forEach(item=>{const path=`nodes/${node.nodeId}/card/${item.id}`;check(cardOptionsOwner(item),path);if(item.fieldBinding){const field=referencedField(config,item.fieldBinding);if(!field)error(path,'信息卡字段绑定来源不存在。','card-field-binding-missing');else if(!(field.labels.zh.trim()||field.labels.en.trim()))error(path,'绑定字段没有有效显示名称。');}});
    });
    config.workflows.forEach(w=>w.steps.forEach(s=>s.controls?.forEach(c=>{check(c,`workflows/${w.id}/${c.id}`,undefined,c.defaultValue);c.group?.itemFields.forEach(f=>check(f,`workflows/${w.id}/${c.id}/${f.key}`,undefined,f.defaultValue));})));
  }
  return issues;
}
/** Copied from the current V1 definitions, including all four return points.
 * Navigation keeps its existing constants until its separately approved switch. */
export function defaultLookupTables():LookupTable[]{return [
  {id:'teleport-hubs',label:{zh:'所属枢纽区',en:''},valueType:'string',functionKind:'teleportHub',rows:[
    {value:'zthspawn',label:{zh:'zthspawn',en:''},functionValue:{world:'zth',range:100,returnPoints:[
      {id:'zth_main_1',label:{zh:'初生水殿',en:''},x:-644,y:35,z:-1562},
      {id:'zth_main_1_1',label:{zh:'图书馆',en:''},x:-760,y:71,z:-1556},
    ]}},
    {value:'hfw',label:{zh:'hfw',en:''},functionValue:{world:'zth',range:100,returnPoints:[
      {id:'zth_main_2',label:{zh:'海风湾',en:''},x:8455,y:66,z:-1161},
      {id:'zth_main_2_1',label:{zh:'鱼子小雕',en:''},x:8601,y:97,z:-1366},
    ]}},
  ]},
  {id:'road-travel-modes',label:{zh:'出行方式',en:''},valueType:'string',functionKind:'speed',rows:[
    {value:'WALK',label:{zh:'步行',en:''},functionValue:4.3},
    {value:'HORSE',label:{zh:'马',en:''},functionValue:10},
  ]},
];}
