import type { CardConfiguration, CardItem, CategoryNode } from './types';

const identity=(origin:{nodeId:string;itemId:string})=>`${origin.nodeId}/${origin.itemId}`;
/** Names/source/dictionary inherit; local layout, renderer, order and visibility
 * stay independent. Origin identity survives row reorder and local cloning. */
export function mergeInheritedCard(parent:CardConfiguration|undefined,local:CardConfiguration|undefined,parentId:string):CardConfiguration|undefined {
  if(!parent||parent.mode!=='fields')return local??parent;
  if(local&&local.mode!=='fields')return local;
  if(!local)return { ...parent,items:parent.items.map(item=>({...item,inheritFrom:item.inheritFrom??{nodeId:parentId,itemId:item.id}})) };
  const upstream=new Map(parent.items.map(item=>[identity(item.inheritFrom??{nodeId:parentId,itemId:item.id}),item]));
  const represented=new Set<string>();
  const items=local.items.flatMap(item=>{
    if(!item.inheritFrom)return [item];
    const key=identity(item.inheritFrom),source=upstream.get(key);
    if(!source)return []; // An upstream deletion removes its inherited row.
    represented.add(key);
    return [{...item,source:source.source,label:source.label,valueOptions:source.valueOptions,prefillAudit:undefined}];
  });
  for(const [key,item] of upstream)if(!represented.has(key))items.push({...item,id:`inherited:${key}`,inheritFrom:item.inheritFrom??{nodeId:parentId,itemId:item.id},prefillAudit:undefined});
  return {...local,items};
}
/** Link corresponding rows once. For historical layouts, formerly omitted
 * parent rows become hidden entries instead of changing the V1 visible card. */
export function linkCardInheritance(node:CategoryNode,parent:CardConfiguration|undefined,parentId:string,preserveOmitted=false):void {
  if(!node.card||node.card.mode!=='fields'||parent?.mode!=='fields')return;
  const items=node.card.items,used=new Set<CardItem>();
  for(const inherited of parent.items){
    const origin=inherited.inheritFrom??{nodeId:parentId,itemId:inherited.id};
    const candidates=items.filter(item=>!used.has(item)&&item.source===inherited.source);
    const match=candidates.find(item=>item.renderer===inherited.renderer&&item.section===inherited.section)??(candidates.length===1?candidates[0]:undefined);
    if(match){match.inheritFrom=origin;delete match.prefillAudit;used.add(match);}
    else if(preserveOmitted)items.push({...structuredClone(inherited),id:`inherited:${identity(origin)}`,inheritFrom:origin,visible:false,prefillAudit:undefined});
  }
}
