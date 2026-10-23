export type ShapeMetricsPlan={kind?:string;shape?:string;radius?:number;assetStatus?:string;style?:{weight?:number;lineJoin?:string};halo?:{widthPx?:number}};
/** Same effective dimensions feed SVG, collision and hit surfaces. Padding is never a visible footprint. */
export function pointSymbolMetrics(plan?:ShapeMetricsPlan){
 const circle=plan?.shape==='circle',radius=Math.max(circle?0:2,Number(plan?.radius??6));
 const visible=plan?.assetStatus!=='pending'&&!(circle&&radius===0);
 const outer=circle?radius:Math.max(1,radius-1),weight=Math.max(0,Number(plan?.style?.weight??0));
 const sides=plan?.shape==='triangle'?3:plan?.shape==='regular5'?5:plan?.shape==='regular6'?6:4;
 const join=!circle&&plan?.style?.lineJoin==='miter'?1/Math.cos(Math.PI/sides):1;
 const baseRadius=visible?outer+weight/2*join:0,halo=visible?Math.max(0,Number(plan?.halo?.widthPx??0)):0;
 const extent=visible?baseRadius+halo*join:0,canvas=Math.max(1,Math.ceil(2*extent+4));
 return {radius,outer,baseRadius,extent,canvas,visible};
}
