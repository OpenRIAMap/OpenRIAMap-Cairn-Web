import {remoteFeedback,type FeedbackLanguage} from './remoteFeedback';
export function RemoteFinding({code,message,language='zh',details}:{code:string;message?:string;language?:FeedbackLanguage;details?:unknown}){
 return <><span>{remoteFeedback(code,message,language)}</span><details className="mt-1 text-xs"><summary>{language==='zh'?'原始详情':'Original details'} · {code}</summary><pre className="max-h-48 overflow-auto whitespace-pre-wrap break-all">{JSON.stringify({code,message,...(details?{details}:{})},null,2)}</pre></details></>;
}
