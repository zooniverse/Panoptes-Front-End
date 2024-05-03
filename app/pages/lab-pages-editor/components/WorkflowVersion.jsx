import { useWorkflowContext } from '../context.js';
import PlusIcon from '../icons/PlusIcon.jsx'

export default function WorkflowVersion({}) {
  const { workflow, status } = useWorkflowContext();
  const isBusy = status === 'fetching' || status === 'updating';
  if (!workflow) return;

  return (
    <div className="workflow-version">
      V. {workflow.version} {status}
      {isBusy && <PlusIcon />}
    </div>
  );

}