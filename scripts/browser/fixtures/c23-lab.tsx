import React from 'react';
import {createRoot} from 'react-dom/client';
import {ConfigLab} from '../../../src/configStudio/ConfigLab';
// Mount the real lab without the application's earlier bootstrap, so its own
// delayed formal read can race a normal file-input import independently.
history.replaceState(null,'','/?workspace=config-lab');
createRoot(document.getElementById('root')!).render(<ConfigLab onClose={()=>{}}/>);
