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

  function onClick() {
    console.log('TODO');
  }

  if (!workflow) return null;

  return (
    <div className="workflow-header flex-row">
      <Link to={returnUrl}>
        <ReturnIcon />
        {strings.PagesEditor.components.WorkflowHeader.return}
      </Link>
      <div className="flex-row flex-item justify-around">
        <button className="unselected" type="button" onClick={onClick}>
          {strings.PagesEditor.components.WorkflowHeader.tasks}
        </button>
        <button className="selected" type="button" onClick={onClick}>
          {strings.PagesEditor.components.WorkflowHeader.workflow_settings}
        </button>
      </div>
    </div>
  );
}

WorkflowHeader.propTypes = {
  projectId: PropTypes.string
};
