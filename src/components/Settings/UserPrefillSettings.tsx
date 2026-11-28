import {useState} from 'react';
import {UserRound} from 'lucide-react';
import {cachedUser,cacheUser} from '@/store/userPrefill';
import AppButton from '@/components/ui/AppButton';

export function UserPrefillSettings(){
  const [value,setValue]=useState(cachedUser),[message,setMessage]=useState(''),[error,setError]=useState(false);
  return <section className="space-y-3" aria-labelledby="user-prefill-heading">
    <h3 id="user-prefill-heading" className="flex items-center gap-2 text-sm font-medium text-gray-700"><UserRound className="h-4 w-4"/>用户预填设置</h3>
    <div className="space-y-2 rounded-lg bg-gray-50 p-3 text-sm"><label className="block">用户名<input aria-label="预填用户名" className="mt-1 w-full rounded border px-2 py-1" value={value} onChange={event=>setValue(event.target.value)}/></label>
      <AppButton type="button" className="rounded border px-3 py-1" onClick={()=>{try{cacheUser(value);setValue(value.trim());setError(false);setMessage(value.trim()?'已缓存用户名。':'已清除缓存用户名。');}catch(error){setError(true);setMessage(error instanceof Error?error.message:'缓存失败。');}}}>缓存</AppButton>
      <p className="text-xs opacity-75">仅自动填写空输入。留空后点击缓存可恢复进程内预填。</p>
      {message?<p role={error?'alert':'status'} className={error?'text-red-500':''}>{message}</p>:null}
    </div>
  </section>;
}
