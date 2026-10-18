export type TileImageRequestOptions={maxRetries:number;retryDelay:number};
/** One bounded request lifecycle, shared by image and Canvas tile layers. */
export function requestTileImage(image:HTMLImageElement,url:string,options:TileImageRequestOptions,onLoad:()=>void,onError:(error:Error)=>void):()=>void {
  let retries=0,finished=false,timer:ReturnType<typeof setTimeout>|undefined;
  const clean=()=>{if(timer!==undefined)clearTimeout(timer);timer=undefined;image.onload=null;image.onerror=null;};
  image.onload=()=>{if(finished)return;finished=true;clean();try{onLoad();}catch(error){onError(error instanceof Error?error:Error(String(error)));}};
  image.onerror=()=>{
    if(finished)return;
    if(retries>=options.maxRetries){finished=true;clean();onError(Error(`Tile load failed after ${retries} retries`));return;}
    retries++;
    if(timer!==undefined)clearTimeout(timer);
    timer=setTimeout(()=>{timer=undefined;if(!finished)image.src=`${url}${url.includes('?')?'&':'?'}_retry=${retries}&_t=${Date.now()}`;},options.retryDelay*retries);
  };
  image.src=url;
  return ()=>{if(finished)return;finished=true;clean();image.removeAttribute('src');};
}
export class TileImageRequests {
  private pending=new Map<HTMLElement,()=>void>();
  load(target:HTMLElement,image:HTMLImageElement,url:string,options:TileImageRequestOptions,onLoad:()=>void,onError:(error:Error)=>void):void {
    this.cancel(target);
    const complete=()=>this.pending.delete(target);
    const cancel=requestTileImage(image,url,options,()=>{complete();onLoad();},error=>{complete();onError(error);});
    this.pending.set(target,cancel);
  }
  cancel(target:HTMLElement):void{this.pending.get(target)?.();this.pending.delete(target);}
  cancelAll():void{for(const cancel of this.pending.values())cancel();this.pending.clear();}
}
