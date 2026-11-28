/** Native form validity is scoped to the visible workflow page, not the map. */
export function reportExternalMissing(root:HTMLElement):boolean{
  const fields=[...root.querySelectorAll<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>('[aria-required="true"]')].filter(field=>!field.disabled&&field.getBoundingClientRect().height>0);
  let first:HTMLElement|undefined;
  for(const field of fields){const missing=!field.value.trim();field.toggleAttribute('aria-invalid',missing);const row=field.closest('label')??field.parentElement;row?.setAttribute('data-input-invalid',String(missing));if(missing&&!first)first=field;}
  root.querySelector('[data-external-input-report]')?.remove();
  if(first){const message=document.createElement('p');message.dataset.externalInputReport='true';message.setAttribute('role','alert');message.className='text-xs text-red-500';message.textContent='请填写标出的必填项。';root.append(message);first.scrollIntoView({block:'nearest'});first.focus();return false;}
  return true;
}
