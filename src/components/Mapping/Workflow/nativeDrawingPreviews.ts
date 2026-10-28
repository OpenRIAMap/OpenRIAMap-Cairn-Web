import type {MultipartGeometry} from '@/core/geometry/multipartGeometry';
import type {WorkflowBridge} from './WorkflowHost';

/** Validated reference images only. The measuring editor owns active geometry. */
export class NativeDrawingPreviews {
  private readonly valid=new Map<string,MultipartGeometry>();
  private active?:string;
  private hidden=false;
  constructor(private readonly bridge:()=>WorkflowBridge){}
  update(key:string,geometry:MultipartGeometry){this.valid.set(key,structuredClone(geometry));this.render(key);}
  clear(key:string){this.valid.delete(key);this.bridge().clearWorkflowPreview(`native:${key}`);}
  clearAll(){for(const key of this.valid.keys())this.bridge().clearWorkflowPreview(`native:${key}`);this.valid.clear();}
  setContext(active:string|undefined,hidden:boolean,available?:Set<string>){
    if(available)for(const key of this.valid.keys())if(!available.has(key))this.clear(key);
    if(this.active===active&&this.hidden===hidden)return;
    this.active=active;this.hidden=hidden;
    for(const key of this.valid.keys())this.render(key);
  }
  private render(key:string){
    if(this.hidden||key===this.active){this.bridge().clearWorkflowPreview(`native:${key}`);return;}
    const geometry=this.valid.get(key);if(!geometry)return;
    this.bridge().upsertWorkflowPreview(`native:${key}`,geometry.type==='Point'?'point':geometry.type==='LineString'?'polyline':'polygon',[],{interactive:false},geometry);
  }
}
