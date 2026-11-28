import type {ExternalRoleBinding, WorkflowOutput} from './types';

/** Display names never participate in output identity or formula evaluation. */
export function workflowOutputLabel(output: Pick<WorkflowOutput, 'label'>, index: number, language = 'zh'): string {
  const label = output.label;
  return (language === 'en' ? label?.en?.trim() || label?.zh?.trim() : label?.zh?.trim() || label?.en?.trim())
    || (language === 'en' ? `Output ${index + 1}` : `输出 ${index + 1}`);
}

export function externalRoleLabel(binding: ExternalRoleBinding | undefined, fallback: string, language = 'zh'): string {
  const label = binding?.label;
  return (language === 'en' ? label?.en?.trim() || label?.zh?.trim() : label?.zh?.trim() || label?.en?.trim()) || fallback;
}
