import type { ConfigPackageV3, ConfigValidationIssue, FieldDefinition, LookupTable, SelectOption } from './types';

export type OptionsOwner = { options?: SelectOption[]; optionsTableId?: string; optionValueType?: FieldDefinition['optionValueType'] };
export function effectiveOptions(config: Pick<ConfigPackageV3,'lookupTables'>, owner: OptionsOwner): SelectOption[] {
  const rows = owner.optionsTableId ? config.lookupTables?.find(table=>table.id===owner.optionsTableId)?.rows ?? [] : owner.options ?? [];
  return rows.map(({value,label})=>({value,label}));
}
export function effectiveOptionsOwner<T extends OptionsOwner>(config: Pick<ConfigPackageV3,'lookupTables'>, owner:T):T {
  const table=owner.optionsTableId?config.lookupTables?.find(table=>table.id===owner.optionsTableId):undefined;
  return table?{...owner,options:effectiveOptions(config,owner),optionValueType:table.valueType}:owner;
}
export function bindOptionsTable<T extends OptionsOwner>(config:ConfigPackageV3, owner:T, tableId?:string):T {
  if(!tableId){const {optionsTableId:_id,...copy}=effectiveOptionsOwner(config,owner);return {...copy,optionsTableId:undefined,options:structuredClone(effectiveOptions(config,owner))} as T;}
  const table=config.lookupTables?.find(item=>item.id===tableId);if(!table)throw Error('所选对照表不存在。');
  return {...owner,optionsTableId:tableId,options:undefined,optionValueType:table.valueType};
}
export function tableReferences(config:ConfigPackageV3, id:string):string[] {
  return [
    ...config.nodes.flatMap(node=>node.fields.filter(field=>field.optionsTableId===id).map(field=>`分类 ${node.nodeId} / ${field.key}`)),
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
  config.nodes.forEach(node=>node.fields.forEach(update));
  config.workflows.forEach(workflow=>workflow.steps.forEach(step=>step.controls?.forEach(control=>{update(control);control.group?.itemFields.forEach(update);})));
  return config;
}
export function lookupFunctionValue(config:Pick<ConfigPackageV3,'lookupTables'>,tableId:string,value:string|number|boolean):LookupTable['rows'][number]['functionValue'] {
  return config.lookupTables?.find(table=>table.id===tableId)?.rows.find(row=>row.value===String(value))?.functionValue;
}
export function validateLookupTables(config:ConfigPackageV3):ConfigValidationIssue[] {
  const issues:ConfigValidationIssue[]=[];
  const error=(path:string,message:string,code='lookup-table-invalid')=>issues.push({severity:'error',code,path,message});
  if(config.contractRevision<10&&(config.lookupTables?.length||config.nodes.some(n=>n.fields.some(f=>f.optionsTableId))||config.workflows.some(w=>w.steps.some(s=>s.controls?.some(c=>c.optionsTableId||c.group?.itemFields.some(f=>f.optionsTableId))))))error('lookupTables','对照表需要 r10 契约。');
  const ids=new Set<string>();
  for(const table of config.lookupTables??[]){
    const path=`lookupTables/${table.id}`;
    if(!/^[a-z][a-z0-9-]{1,80}$/.test(table.id)||ids.has(table.id))error(path,'表格 ID 必须有效且唯一。');ids.add(table.id);
    if(!table.label.zh.trim())error(path,'表格需要中文名称。');
    if(!table.rows.length)error(path,'表格至少需要一行。');
    const values=new Set<string>();const pointIds=new Set<string>();
    for(const [index,row] of table.rows.entries()){
      const at=`${path}/rows/${index}`,normalized=table.valueType==='number'?String(Number(row.value)):row.value;
      if(!row.value.trim()||values.has(normalized)||table.valueType==='number'&&!Number.isFinite(Number(row.value))||table.valueType==='boolean'&&!['true','false'].includes(row.value))error(at,'存储值为空、重复或类型不符。');values.add(normalized);
      if(!row.label.zh.trim())error(at,'对照行需要中文名称。');
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
  config.nodes.forEach(node=>node.fields.forEach(field=>inspect(field,`nodes/${node.nodeId}/fields/${field.fieldId}`)));
  config.workflows.forEach(w=>w.steps.forEach(s=>s.controls?.forEach(c=>{inspect(c,`workflows/${w.id}/${c.id}`);c.group?.itemFields.forEach(f=>inspect(f,`workflows/${w.id}/${c.id}/${f.key}`));})));
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
