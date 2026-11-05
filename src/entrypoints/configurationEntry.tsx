import ConfigLabFrame from '../configStudio/ConfigLabFrame';
import ConfigStudio from '../configStudio/ConfigStudio';
import ConfigLab from '../configStudio/ConfigLab';
import WorkflowStudioPage from '../configStudio/WorkflowStudioPage';
import { ConfigBootstrap, useWorkspaceNavigation } from '../configStudio/ConfigBootstrap';

function WorkspaceContents({workspace,onClose}:{workspace:string;onClose:()=>void}){
  const navigate=useWorkspaceNavigation(),close=()=>navigate(onClose);
  return workspace==='config-studio'?<ConfigStudio onClose={close}/>:workspace==='config-workflow'?<WorkflowStudioPage onClose={close}/>:<ConfigLab onClose={close}/>;
}

export default function ConfigurationEntry({ workspace, onClose }: { workspace: string; onClose: () => void }) {
  if(workspace==='config-lab-frame')return <ConfigLabFrame/>;
  if(workspace==='config-lab')return <ConfigLab onClose={onClose}/>;
  return <ConfigBootstrap onClose={onClose}><WorkspaceContents workspace={workspace} onClose={onClose}/></ConfigBootstrap>;
}
