import React from 'react';
import {createRoot} from 'react-dom/client';
import '../../../src/styles/index.css';
import SettingsPanel from '../../../src/components/Settings/SettingsPanel';
import {loadFormalConfiguration} from '../../../src/configRuntime/formalConfiguration';
await loadFormalConfiguration();
createRoot(document.getElementById('root')!).render(<SettingsPanel onClose={()=>undefined} onOpenConfigStudio={()=>undefined} onOpenConfigLab={()=>undefined}/>);
