import * as L from "leaflet";
import { buildTextPathPlanResult } from "@/components/Rules/rendering/label/labelTextPath";
import {
  escapeHtml,
  lineTextStyleFromStyleKey,
  parseStyleKey,
} from "@/components/Rules/rendering/label/labelLineTextStyle";
import { markLineTextMarker } from "@/components/Rules/rendering/label/labelLineTextGeometry";
import type {
  DisplayAnchorConfig,
  DisplayTextPathFallback,
  TextPathStatus,
} from "@/components/Rules/rendering/display/displayTypes";

export type TextPathLabelMarkerResult = {
  marker: L.Marker | null;
  status?: TextPathStatus;
  planKey?: string;
  markerLatLng?: L.LatLng;
};

type MarkerOptions = {
  map: L.Map;
  latlng: L.LatLng;
  text: string;
  pathLatLngs: L.LatLng[];
  anchor?: Partial<DisplayAnchorConfig> | null;
  styleKey?: any;
  fallback?: DisplayTextPathFallback | null;
  rotateDeg?: number;
  onClick?: () => void;
  cacheKeyHint?: string;
  offsetX?: number;
  offsetY?: number;
};

export function makeTextPathLabelMarkerResult(
  options: MarkerOptions,
): TextPathLabelMarkerResult {
  const style = lineTextStyleFromStyleKey(options.styleKey);
  const parsed = parseStyleKey(options.styleKey);
  const rotateDeg =
    typeof options.rotateDeg === "number"
      ? options.rotateDeg
      : parsed.rotateDeg;

  const built = buildTextPathPlanResult({
    map: options.map,
    text: options.text,
    pathLatLngs: options.pathLatLngs,
    anchor: options.anchor ?? null,
    className: style.className,
    fontSizePx: style.fontSize,
    rotateDeg,
    fallback: options.fallback ?? options.anchor?.textPathFallback ?? null,
    cacheKeyHint: options.cacheKeyHint,
  });
  const plan = built.plan;
  if (!plan || plan.mode === "svgVerticalCjk") {
    return { marker: null, status: built.status, planKey: built.cacheKey };
  }

  const markerLatLng = options.map.containerPointToLatLng(
    L.point(plan.markerContainerPoint.x + (options.offsetX ?? 0), plan.markerContainerPoint.y + (options.offsetY ?? 0)),
  );
  const pathId = `ria-textpath-${Math.random().toString(36).slice(2)}`;
  const safeStroke = escapeHtml(style.stroke);
  const safeFill = escapeHtml(style.fill);
  const letterSpacing =
    typeof plan.letterSpacingPx === "number" && plan.letterSpacingPx > 0
      ? `letter-spacing:${Math.round(plan.letterSpacingPx * 100) / 100}px;`
      : "";


  const rootLeft=plan.markerContainerPoint.x-plan.width/2,rootTop=plan.markerContainerPoint.y-plan.height/2;
  const textBody=(plan.rows??[plan]).map((row,index)=>{
    const id=pathId+'-'+index,x=row.markerContainerPoint.x-row.width/2-rootLeft,y=row.markerContainerPoint.y-row.height/2-rootTop;
    const rotation=row.mode==='svgStraightLabel'&&row.rotateDeg?`rotate(${row.rotateDeg} ${row.width/2} ${row.height/2})`:'';
    return `<g transform="translate(${x} ${y})"><defs><path id="${id}" d="${row.pathD}" /></defs><g transform="${rotation}"><text class="${row.className}"><textPath href="#${id}" startOffset="50%" text-anchor="middle" method="align" spacing="auto">${escapeHtml(row.text)}</textPath></text></g></g>`;
  }).join('');

  const html = `
    <svg class="ria-line-textpath-svg" width="${plan.width}" height="${plan.height}" viewBox="${plan.viewBox}" aria-hidden="true" style="overflow:visible;pointer-events:auto">
      <style>
        .ria-line-textpath{font:${style.fontWeight} ${style.fontSize}px system-ui,-apple-system,Segoe UI,Roboto,sans-serif;fill:${safeFill};stroke:${safeStroke};stroke-width:${style.strokeWidth}px;paint-order:stroke;stroke-linejoin:round;dominant-baseline:middle;pointer-events:auto;cursor:pointer;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision;${letterSpacing}}
      </style>
      ${textBody}
    </svg>`;

  const icon = L.divIcon({
    className: "ria-line-textpath-icon",
    html,
    iconSize: [plan.width, plan.height],
    iconAnchor: [plan.width / 2, plan.height / 2],
  });

  const marker = L.marker(markerLatLng, {
    icon,
    pane: "ria-label",
    zIndexOffset: 1000,
    interactive: true,
    keyboard: false,
    bubblingMouseEvents: false,
  });
  if (options.onClick) marker.on("click", options.onClick);
  const planKey = built.cacheKey ?? options.cacheKeyHint ?? "";
  markLineTextMarker(marker, {
    kind: "textPath",
    markerLatLng,
    planKey,
  });
  return { marker, status: plan.status ?? built.status, planKey, markerLatLng };
}

export function makeTextPathLabelMarker(
  options: MarkerOptions,
): L.Marker | null {
  return makeTextPathLabelMarkerResult(options).marker;
}
