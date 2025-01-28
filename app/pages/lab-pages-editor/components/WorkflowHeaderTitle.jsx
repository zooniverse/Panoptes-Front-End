import { useWorkflowContext } from '../context.js';
import getPreviewEnv from '../helpers/getPreviewEnv.js';
import ExternalLinkIcon from '../icons/ExternalLinkIcon.jsx';

export default function WorkflowHeaderTitle() {
  const { project, workflow } = useWorkflowContext();

  if (!project || !workflow) return null;

  const workflowTitle = workflow?.display_name ?? '(unnamed workflow)';
  const previewEnv = getPreviewEnv();
  const previewUrl = `https://frontend.preview.zooniverse.org/projects/${project?.slug}/classify/workflow/${workflow?.id}${previewEnv}`;

  return (
    <div className="workflow-header-title">
      <h1>{workflowTitle}</h1>
      <span className="spacer" />
      <a
        className="preview-link"
        href={previewUrl}
        rel="noopener noreferrer"
        target='_blank'
      >
        Preview Workflow <ExternalLinkIcon />
      </a>
    </div>
  );
}
