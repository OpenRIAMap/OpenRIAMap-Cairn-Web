import {Component,type ReactNode} from 'react';

/** A failed lazy editor must report failure instead of a successful load. */
export class ReviewWorkspaceBoundary extends Component<{requestId?:string;onFailure:(id:string,error:string)=>void;children:ReactNode},{error:string}>{
 state={error:''};
 static getDerivedStateFromError(error:unknown){return {error:error instanceof Error?error.message:String(error)};}
 componentDidCatch(){if(this.props.requestId)this.props.onFailure(this.props.requestId,'审核编辑器加载失败：'+this.state.error+'。请刷新后重试。');}
 componentDidUpdate(previous:Readonly<typeof this.props>){if(this.state.error&&this.props.requestId&&previous.requestId!==this.props.requestId)this.setState({error:''});}
 render(){return this.state.error?<div role="alert" className="fixed bottom-4 left-4 z-[2600] rounded border bg-white p-3 text-rose-800">审核编辑器加载失败：{this.state.error}。请刷新后重试。</div>:this.props.children;}
}
