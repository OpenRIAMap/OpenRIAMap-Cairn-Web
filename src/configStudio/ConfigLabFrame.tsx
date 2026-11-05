import {useEffect,useState} from 'react';
import {prepareConfigForActivation} from './configActivation';
import {applyApplicationSettings} from '../core/project/applicationRuntime';
import {setRuntimeConfiguration} from '../configRuntime/runtimeDataView';
import MapContainer from '../components/Map/MapContainer';
import type {ConfigPackageV3} from './types';
export default function ConfigLabFrame(){
 const [config,setConfig]=useState<ConfigPackageV3>(),[error,setError]=useState(''),[generation,setGeneration]=useState(0);
 useEffect(()=>{const receive=(event:MessageEvent)=>{if(event.origin!==location.origin||event.source!==parent||event.data?.type!=='cairnmap-lab-config')return;try{const next=prepareConfigForActivation(event.data.config);applyApplicationSettings(next.application);setRuntimeConfiguration(next);setConfig(next);setGeneration(value=>value+1);setError('');}catch(error){setError(String(error));}};window.addEventListener('message',receive);parent.postMessage({type:'cairnmap-lab-ready'},location.origin);return()=>window.removeEventListener('message',receive);},[]);
 return config?<MapContainer key={generation} configRuntime={config} configLab/>:<p role={error?'alert':'status'} className="p-4">{error||'等待实验室配置…'}</p>;
}
