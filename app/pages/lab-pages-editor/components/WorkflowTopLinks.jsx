import ExternalLinkIcon from '../icons/ExternalLinkIcon.jsx';
import ReturnIcon from '../icons/ReturnIcon.jsx';
import { useWorkflowContext } from '../context.js';
import strings from '../strings.json';
import zooniverseLogo from '../assets/zooniverse-word-white.png' 

const DEFAULT_HANDLER = () => {};

export default function WorkflowTopLinks() {
  const { project, workflow } = useWorkflowContext();
  const returnUrl = `/lab/${project?.id}/workflows`;

  if (!project || !workflow) return null;

  return (
    <div className="workflow-top-links">
      <a href={returnUrl}> {/* Formerly <Link> from 'react-router', but React was throwing Legacy Context errors. */}
        <ReturnIcon />
        {strings.PagesEditor.components.WorkflowTopLinks.return}
      </a>
      <span className="flex-item" />
      <img className="zooniverse-logo" src={zooniverseLogo} />
    </div>
  );
}
