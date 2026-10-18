import ConfigStudio from '../configStudio/ConfigStudio';
import ConfigLab from '../configStudio/ConfigLab';
import WorkflowStudioPage from '../configStudio/WorkflowStudioPage';
import { ConfigBootstrap } from '../configStudio/ConfigBootstrap';

export default function ConfigurationEntry({ workspace, onClose }: { workspace: string; onClose: () => void }) {
  return <ConfigBootstrap>{workspace === 'config-studio' ? <ConfigStudio onClose={onClose} /> : workspace === 'config-workflow' ? <WorkflowStudioPage onClose={onClose} /> : <ConfigLab onClose={onClose} />}</ConfigBootstrap>;
}
