import { useWorkflowContext } from '../context.js';
import LoadingIcon from '../icons/LoadingIcon.jsx'

export default function WorkflowVersion({}) {
  const { workflow, status } = useWorkflowContext();
  const isBusy = status === 'fetching' || status === 'updating';
  if (!workflow) return;

  return (
    <div className="workflow-version">
      V. {workflow.version}
      {isBusy && <LoadingIcon alt="Loading" />}
    </div>
  );

}