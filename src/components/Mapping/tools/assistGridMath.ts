export type AssistGridSettings={x:number;z:number;spacing:number;color:'#ffffff'|'#000000'};
export function normalizeAssistGrid(x:string,z:string,spacing:string,color:AssistGridSettings['color']):AssistGridSettings{
  if([x,z,spacing].some(value=>!value.trim()))throw Error('请填写中心点和间距。');
  const values=[x,z,spacing].map(Number);
  if(values.some(value=>!Number.isFinite(value))||values[2]<=0)throw Error('中心点须为有效数字，间距须为正数。');
  const half=(value:number)=>Math.sign(value)*Math.round(Math.abs(value)*2)/2;
  const [cx,cz,s]=values.map(half);
  if(s<.5)throw Error('应用后的间距不能小于0.5。');
  return {x:cx,z:cz,spacing:s,color};
}

export function snapAssistGrid(point:{x:number;z:number},grid:AssistGridSettings,threshold:number){
  const x=grid.x+Math.round((point.x-grid.x)/grid.spacing)*grid.spacing;
  const z=grid.z+Math.round((point.z-grid.z)/grid.spacing)*grid.spacing;
  const dx=Math.abs(point.x-x),dz=Math.abs(point.z-z),dist=Math.min(dx,dz);
  return {point:dist>threshold?point:dx<=dz?{x,z:point.z}:{x:point.x,z},snapped:dist<=threshold,dist};
}

