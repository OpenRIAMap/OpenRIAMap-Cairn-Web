import {Children,cloneElement,createContext,isValidElement,useContext,type LabelHTMLAttributes,type ReactElement,type ReactNode} from 'react';
import {ModuleHelp,MODULE_HELP} from './ModuleHelp';
import {resolveSettingHelp,type HelpResolution} from './settingHelpCatalog';
type ControlProps={children?:ReactNode;'aria-label'?:string;placeholder?:string;type?:string;className?:string;[key:string]:unknown};
const inheritedHelp=createContext<HelpResolution|undefined>(undefined);
function isControl(value:ReactNode):value is ReactElement<ControlProps>{return isValidElement(value)&&(['input','textarea','select'].includes(String(value.type))||value.type===HelpControl);}
function words(value:ReactNode):string {
  if(typeof value==='string'||typeof value==='number')return String(value);
  if(Array.isArray(value))return value.map(words).join(' ');
  if(isValidElement<{children?:ReactNode}>(value)&&value.type!==ModuleHelp&&!isControl(value))return words(value.props.children);
  return '';
}
function explicitHelp(value:ReactNode):HelpResolution|undefined {
  for(const node of Children.toArray(value))if(isValidElement<{children?:ReactNode;title?:string;text?:string;helpKey?:string}>(node)){
    if(node.type===ModuleHelp){const text=node.props.text??MODULE_HELP[node.props.helpKey??node.props.title??''];if(text)return {key:`explicit/${node.props.title}`,text,kind:'exact'};}
    const child=explicitHelp(node.props.children);if(child)return child;
  }return undefined;
}
function annotate(value:ReactNode,resolution:HelpResolution):ReactNode {
  return Children.map(value,node=>{
    if(!isValidElement<ControlProps>(node)||node.type===ModuleHelp)return node;
    if(['input','textarea','select'].includes(String(node.type)))return cloneElement(node,{'data-config-setting':resolution.key,'data-help-kind':resolution.kind});
    return typeof node.type==='string'?cloneElement(node,{},annotate(node.props.children,resolution)):node;
  });
}
export function HelpLabel({context,children,...props}:LabelHTMLAttributes<HTMLLabelElement>&{context:string}){
  const rows=Children.toArray(children),first=rows.find(isControl),title=words(children).replace(/\s+/g,' ').trim()||first?.props['aria-label']||first?.props.placeholder||context;
  const supplied=explicitHelp(children),resolution=supplied??resolveSettingHelp(title,context);
  let split=rows.findIndex(isControl);
  if(split===0&&first?.props.type==='checkbox'){const next=rows.findIndex((row,index)=>index>0&&isControl(row));split=next<0?rows.length:next;}
  if(split<0)split=rows.length;
  const marked=Children.toArray(annotate(children,resolution));
  return <label {...props} data-setting-help={resolution.key} data-help-kind={resolution.kind}><inheritedHelp.Provider value={resolution}>{supplied?marked:<><span className="cm-help-heading">{split?marked.slice(0,split):title}<ModuleHelp title={title} helpKey={resolution.key} text={resolution.text}/></span>{marked.slice(split)}</>}</inheritedHelp.Provider></label>;
}
/** Unlabelled compact cells get the same local help; nested controls reuse the
 * enclosing label's explanation without adding a second icon. */
export function HelpControl({context,children}:{context:string;children:ReactElement<ControlProps>}){
  const parent=useContext(inheritedHelp),props=children.props,title=props['aria-label']||props.placeholder||context,resolution=parent??resolveSettingHelp(title,context);
  const control=cloneElement(children,{'data-config-setting':resolution.key,'data-help-kind':resolution.kind});
  if(parent)return control;
  return <span data-setting-help={resolution.key} data-help-kind={resolution.kind} className={`cm-help-control ${props.type==='checkbox'?'cm-help-checkbox':''}`}>{control}<ModuleHelp title={title} helpKey={resolution.key} text={resolution.text}/></span>;
}
