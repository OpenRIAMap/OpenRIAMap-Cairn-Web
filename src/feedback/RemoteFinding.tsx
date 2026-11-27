import {remoteFeedback,type FeedbackLanguage} from './remoteFeedback';
export function RemoteFinding({code,message,language='zh',details}:{code:string;message?:string;language?:FeedbackLanguage;details?:unknown}){
 return <><span>{remoteFeedback(code,message,language)}</span><details className="mt-1 text-xs"><summary>{language==='zh'?'原始详情':'Original details'} · {code}</summary><pre className="cm-bounded-scroll max-h-48 whitespace-pre-wrap break-all" tabIndex={0} onWheel={event=>event.stopPropagation()}>{JSON.stringify({code,message,...(details?{details}:{})},null,2)}</pre></details></>;
}
