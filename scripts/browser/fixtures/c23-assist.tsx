import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {AssistFeatureSearch} from '../../../src/components/Mapping/tools/AssistFeatureSearch';
import {renderLabelHtml} from '../../../src/components/Rules/rendering/labelStyles';
function Fixture(){
 const [mounted,setMounted]=useState(false),[applied,setApplied]=useState('');
 return <><button onClick={()=>setMounted(true)}>Mount sample</button><button onClick={()=>setMounted(false)}>Unmount sample</button><AssistFeatureSearch getOptions={()=>mounted?[{key:'world:local:1',id:'LOCAL_C23',name:'临时道路',description:'ROD/PRI'}]:[]} onApply={key=>{if(!mounted||key!=='world:local:1')return false;setApplied(key);return true;}}/><output>{applied}</output>{['bubble-dark-14','gm-bw-15','gm-wtb-15','rle-pill-13','rle-line-15','structure-label-12'].map((key,i)=><aside key={key} data-label-family={key} style={{position:'absolute',left:400,top:250+i*110,width:0,height:0}} dangerouslySetInnerHTML={{__html:renderLabelHtml(key,'甲乙丙丁戊己庚辛壬癸\n一二三四五六七八九十\n天地玄黄宇宙洪...',{placement:'center',withDot:false,interactive:true})}}/>)}</>;
}
createRoot(document.getElementById('root')!).render(<Fixture/>);
