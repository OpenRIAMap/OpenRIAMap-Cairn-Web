import type { CairnMapRuleButtonItem } from './environmentTypes';
export type ApplicationLabel={zh:string;en:string};
export type ApplicationWorld={
  id:string;prefix:string;numericCode:number;label:ApplicationLabel;enabled:boolean;default:boolean;
  center:{x:number;y:number;z:number};mapLink:string;dataSourceId:string;
  projection:{id:'dynmap-flat';worldToMap:number[];mapToWorld:number[];mapzoomin:number;mapzoomout:number;tileSize:128;tilescale:number};
  tiles:{baseUrl:string;filteredBaseUrl:string;prefix:string;imageFormat:'jpg'|'png'|'webp';extraZoomLevels:number;minNativeZoom:number;maxNativeZoom:number;attribution:string;maxRetries:number;retryDelay:number};
};
export type ApplicationButton=Omit<CairnMapRuleButtonItem,'label'>&{names:ApplicationLabel;size:28|36|44;group:string};
export type ApplicationButtons={storageKey:string;legacyStorageKeys:string[];maxActive:number;fallback:string[];byWorld:Record<string,string[]>;items:ApplicationButton[]};
export type ApplicationSources={
  storageKey:string;defaultSourceId:string;selectionMode:'fixed'|'user-select'|'user-select-on-failure';retryOnFailure:boolean;
  items:Array<{id:string;label:ApplicationLabel;enabled:boolean;selectable:boolean;readerKind:'formal-release-v2';readerSchemaVersion:'openriamap.formal-release-reader.v2';rootUrl:string;mediaRootUrl:string;transport:'direct'|'github-raw-compatible'}>;
  github:{sourceIds:string[];owner:string;repo:string;branch:string};
  linkModes:{storageKey:string;legacyStorageKeys:string[];items:Array<{id:string;label:ApplicationLabel;baseUrl:string;default:boolean}>};
};
export type ApplicationModuleId='mapping'|'measurement'|'navigation'|'search'|'review'|'players'|'settings'|'publicReleases';
export type ApplicationModules={items:Array<{id:ApplicationModuleId;enabled:boolean;load:'eager'|'lazy'|'preload';exclusiveWith:ApplicationModuleId[]}>;players:{endpoint:string;directEndpoint:string;mode:'proxy'|'direct';pollIntervalMs:number;requestTimeoutMs:number}};
export type ApplicationReview={enabled:boolean;provider:'github-cookie';protocol:'openriamap-review-v1';auth:{start:string;session:string;logout:string};control:string;workflow:string;publicReleases:string;serverReferences:{oauthClientId:string;oauthRedirectUri:string;sessionSigning:string;controlApiBase:string;brokerSecret:string}};
export type ApplicationPreferences={language:'zh'|'en';search:{homepageLimit:number;navigationLimit:number;debounceMs:number};navigation:{transferWalkSpeed:number;railRideSpeed:number;transferCostFactor:number;normalPlatformTransferCost:number};map:{logicalInitialZoom:number;leafletOffset:number;scrollWheelZoom:boolean;doubleClickZoom:boolean;dragging:boolean};toolbar:{position:'left'|'right';compact:boolean}};
export type ApplicationSettings={schemaVersion:'cairnmap.application.v1';worlds:ApplicationWorld[];buttons:ApplicationButtons;sources:ApplicationSources;modules:ApplicationModules;review:ApplicationReview;preferences:ApplicationPreferences};
export type ApplicationSection=Exclude<keyof ApplicationSettings,'schemaVersion'>;
