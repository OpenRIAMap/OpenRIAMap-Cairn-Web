/** Only an explicit boolean false disables a node. Type errors remain the
 * responsibility of the ordinary record/field validators. */
export const teleportNodeAvailable=(record:Record<string,unknown>):boolean=>record.Situation!==false;
/** O(n), no pairwise edges. Covers temporary state edits even before a caller
 * bumps its general source revision. */
export function teleportAvailabilitySignature(items:Record<string,unknown>[],matches:(record:Record<string,unknown>)=>boolean):string{
 return JSON.stringify(items.filter(r=>r&&typeof r==='object'&&matches(r)).map(r=>[r.ID,teleportNodeAvailable(r)]));
}
