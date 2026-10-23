/** Open only an explicitly added item. Never changes saved configuration. */
export function studioFoldKey(item:HTMLDetailsElement,scope:string):string{
  const parts:string[]=[];
  for(let current:Element|null=item;current;current=current.parentElement){
    if(current instanceof HTMLDetailsElement)parts.push(current.dataset.foldKey??current.querySelector(':scope > summary')?.textContent?.trim()??'details');
    if(current.hasAttribute('data-application-section'))parts.push('application:'+current.getAttribute('data-application-section'));
    if(current.matches('main.config-editor'))break;
  }
  return scope+parts.reverse().join('/');
}
export function openAddedSetting(key:string):void{
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    const item=Array.from(document.querySelectorAll<HTMLDetailsElement>('details[data-fold-key]')).find(item=>item.dataset.foldKey===key);
    if(item){for(let parent:HTMLElement|null=item;parent;parent=parent.parentElement)if(parent instanceof HTMLDetailsElement)parent.open=true;item.scrollIntoView({block:'nearest'});item.querySelector<HTMLElement>('input,select,textarea,button')?.focus();}
  }));
}
