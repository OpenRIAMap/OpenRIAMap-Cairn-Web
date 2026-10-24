import type {WorkflowValueCondition} from './types';
type Scalar=string|number|boolean;
type Atom={token:string;values?:Scalar[];deny?:Scalar[];presence?:boolean};
type Clause=Atom[];
const empty=(value:unknown)=>value==null||typeof value==='string'&&!value.trim();
function satisfiable(clause:Clause):boolean{
  const domains=new Map<string,{allow?:Scalar[];deny:Set<Scalar>;presence?:boolean}>();
  for(const atom of clause){
    const domain=domains.get(atom.token)??{deny:new Set<Scalar>()};
    if(atom.presence!==undefined){if(domain.presence!==undefined&&domain.presence!==atom.presence)return false;domain.presence=atom.presence;}
    if(atom.values)domain.allow=domain.allow?domain.allow.filter(value=>atom.values!.includes(value)):atom.values;
    for(const value of atom.deny??[])domain.deny.add(value);
    if(domain.allow&&!domain.allow.some(value=>!domain.deny.has(value)&&(domain.presence===undefined||!empty(value)===domain.presence)))return false;
    domains.set(atom.token,domain);
  }
  return true;
}

/** True is a proof of coverage, false a reachable gap, undefined a budget limit.
 * This subtracts predicates symbolically; it never treats sample inputs as proof. */
export function workflowConditionsCover(context:Array<WorkflowValueCondition|undefined>,ways:Array<Array<WorkflowValueCondition|undefined>>):boolean|undefined{
  let budget=12000;
  const limit=(rows:Clause[])=>{if((budget-=rows.length+rows.reduce((n,row)=>n+row.length,0))<0||rows.length>128)throw Error('coverage budget');return rows.filter(satisfiable);};
  const cross=(left:Clause[],right:Clause[])=>limit(left.flatMap(a=>right.map(b=>[...a,...b])));
  const dnf=(condition?:WorkflowValueCondition,depth=0):Clause[]=>{
    if(--budget<0||depth>24)throw Error('coverage budget');
    if(!condition)return [[]];
    if(condition.all)return condition.all.reduce((result,child)=>cross(result,dnf(child,depth+1)),[[]] as Clause[]);
    if(condition.any)return limit(condition.any.flatMap(child=>dnf(child,depth+1)));
    const atom:Atom={token:condition.token};
    if(condition.operator==='empty'||condition.operator==='present')atom.presence=condition.operator==='present';
    else if(condition.operator==='equals'&&condition.value!==undefined)atom.values=[condition.value];
    else if(condition.operator==='in'&&condition.values)atom.values=condition.values;
    else throw Error('unsupported condition');
    return [[atom]];
  };
  try{
    let remaining=context.reduce((result,condition)=>cross(result,dnf(condition)),[[]] as Clause[]);
    for(const way of ways){
      const regions=way.reduce((result,condition)=>cross(result,dnf(condition)),[[]] as Clause[]);
      for(const region of regions){
        const inverse=region.map(atom=>[{token:atom.token,...(atom.presence!==undefined?{presence:!atom.presence}:{deny:atom.values})}]);
        remaining=cross(remaining,inverse);
        if(!remaining.length)return true;
      }
    }
    return !remaining.length;
  }catch{return undefined;}
}
