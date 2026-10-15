import {lazy,Suspense,type ComponentType} from 'react';
import { Building2, Home, Leaf, Map, Route, ShoppingCart, Train, Zap } from 'lucide-react';
const legacy:Record<string,ComponentType<{className?:string}>>={train:Train,route:Route,leaf:Leaf,home:Home,map:Map,zap:Zap,shoppingCart:ShoppingCart,building2:Building2};
/** Existing keys stay synchronous. New SVG modules load independently. */
const extra={
  treePine:lazy(()=>import('lucide-react/dist/esm/icons/tree-pine.js')),
  mountain:lazy(()=>import('lucide-react/dist/esm/icons/mountain.js')),
  waves:lazy(()=>import('lucide-react/dist/esm/icons/waves.js')),
  landmark:lazy(()=>import('lucide-react/dist/esm/icons/landmark.js')),
  hospital:lazy(()=>import('lucide-react/dist/esm/icons/hospital.js')),
  school:lazy(()=>import('lucide-react/dist/esm/icons/school.js')),
  factory:lazy(()=>import('lucide-react/dist/esm/icons/factory.js')),
  warehouse:lazy(()=>import('lucide-react/dist/esm/icons/warehouse.js')),
  church:lazy(()=>import('lucide-react/dist/esm/icons/church.js')),
  castle:lazy(()=>import('lucide-react/dist/esm/icons/castle.js')),
  tent:lazy(()=>import('lucide-react/dist/esm/icons/tent.js')),
  plane:lazy(()=>import('lucide-react/dist/esm/icons/plane.js')),
  ship:lazy(()=>import('lucide-react/dist/esm/icons/ship.js')),
  bus:lazy(()=>import('lucide-react/dist/esm/icons/bus.js')),
  bike:lazy(()=>import('lucide-react/dist/esm/icons/bike.js')),
  footprints:lazy(()=>import('lucide-react/dist/esm/icons/footprints.js')),
  mapPin:lazy(()=>import('lucide-react/dist/esm/icons/map-pin.js')),
  flag:lazy(()=>import('lucide-react/dist/esm/icons/flag.js')),
  circleParking:lazy(()=>import('lucide-react/dist/esm/icons/circle-parking.js')),
  cableCar:lazy(()=>import('lucide-react/dist/esm/icons/cable-car.js')),
  network:lazy(()=>import('lucide-react/dist/esm/icons/network.js')),
  layers:lazy(()=>import('lucide-react/dist/esm/icons/layers.js')),
  compass:lazy(()=>import('lucide-react/dist/esm/icons/compass.js')),
  ferrisWheel:lazy(()=>import('lucide-react/dist/esm/icons/ferris-wheel.js')),
};
export function resolveRuleButtonIcon(iconKey:string){
  const Icon=legacy[iconKey];if(Icon)return <Icon className="h-5 w-5"/>;
  const Extra=extra[iconKey as keyof typeof extra];
  return Extra?<Suspense fallback={<span role="status" aria-label="图标加载中">…</span>}><Extra className="h-5 w-5"/></Suspense>:<span role="img" aria-label={`未注册图标 ${iconKey}`} className="text-red-600">?</span>;
}
