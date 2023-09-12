/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */

import PropTypes from 'prop-types';
import { Link } from 'react-router';

import ReturnIcon from '../icons/ReturnIcon.jsx';
import { useWorkflowContext } from '../context.js';
import strings from '../strings.json';

export default function WorkflowHeader({
  projectId = ''
}) {
  const { workflow } = useWorkflowContext();
  const returnUrl = `/lab/${projectId}/workflows`;

  if (!workflow) return null;

  return (
    <div className="workflow-header">
      <Link to={returnUrl}>
        <ReturnIcon />
        {strings.PagesEditor.components.WorkflowHeader.return}
      </Link>
      <button type="button">
        {strings.PagesEditor.components.WorkflowHeader.tasks}
      </button>
      <button type="button">
        {strings.PagesEditor.components.WorkflowHeader.workflow_settings}
      </button>
    </div>
  );
}

WorkflowHeader.propTypes = {
  projectId: PropTypes.string
};
