import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {AssistFeatureSearch} from '../../../src/components/Mapping/tools/AssistFeatureSearch';
function Fixture(){
 const [mounted,setMounted]=useState(false),[applied,setApplied]=useState('');
 return <><button onClick={()=>setMounted(true)}>Mount sample</button><button onClick={()=>setMounted(false)}>Unmount sample</button><AssistFeatureSearch getOptions={()=>mounted?[{key:'world:local:1',id:'LOCAL_C23',name:'临时道路',description:'ROD/PRI'}]:[]} onApply={key=>{if(!mounted||key!=='world:local:1')return false;setApplied(key);return true;}}/><output>{applied}</output></>;
}
createRoot(document.getElementById('root')!).render(<Fixture/>);
