/** Shared literal search semantics for native and dedicated forms. */
export function matchesSearchQuery(value:unknown,query:string,matcher='contains'){
 const text=String(value??'').toLocaleLowerCase(),needle=query.trim().toLocaleLowerCase();
 if(matcher==='prefix')return text.startsWith(needle);
 if(matcher==='token')return text.split(/[\s_\-/.]+/).some(token=>token.startsWith(needle));
 if(matcher==='fuzzy'){let index=0;for(const char of text)if(char===needle[index])index++;return index===needle.length;}
 return text.includes(needle);
}
