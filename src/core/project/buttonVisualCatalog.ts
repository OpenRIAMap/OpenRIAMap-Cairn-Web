/** Lightweight metadata shared by runtime, validation and the lazy editor. */
export const BUTTON_ICONS=[
  ['train','铁路'],['route','道路'],['leaf','自然'],['home','住宅'],['map','地图'],['zap','传送'],['shoppingCart','贸易'],['building2','建筑'],
  ['treePine','树林'],['mountain','山地'],['waves','水域'],['landmark','地标'],['hospital','医疗'],['school','学校'],['factory','工厂'],['warehouse','仓库'],['church','教堂'],['castle','城堡'],['tent','营地'],['plane','机场'],['ship','港口'],['bus','公交'],['bike','骑行'],['footprints','步行'],['mapPin','地点'],['flag','标记'],['circleParking','停车'],['cableCar','缆车'],['network','网络'],['layers','图层'],['compass','方向'],['ferrisWheel','游乐'],
] as const;
export const BUTTON_TONES={
  blue:{label:'蓝',active:'bg-blue-100 text-blue-600'},green:{label:'绿',active:'bg-green-100 text-green-600'},cyan:{label:'青',active:'bg-cyan-100 text-cyan-600'},purple:{label:'紫',active:'bg-purple-100 text-purple-600'},gray:{label:'灰',active:'bg-gray-100 text-gray-700'},orange:{label:'橙',active:'bg-orange-100 text-orange-700'},slate:{label:'石板',active:'bg-slate-300 text-slate-800'},
  red:{label:'红',active:'bg-red-100 text-red-700'},teal:{label:'蓝绿',active:'bg-teal-100 text-teal-700'},pink:{label:'粉',active:'bg-pink-100 text-pink-700'},amber:{label:'琥珀',active:'bg-amber-100 text-amber-700'},indigo:{label:'靛蓝',active:'bg-indigo-100 text-indigo-700'},
} as const;
export type ButtonTone=keyof typeof BUTTON_TONES;
export const isButtonIcon=(value:string)=>BUTTON_ICONS.some(([id])=>id===value);
export const isButtonTone=(value:string):value is ButtonTone=>Object.prototype.hasOwnProperty.call(BUTTON_TONES,value);
