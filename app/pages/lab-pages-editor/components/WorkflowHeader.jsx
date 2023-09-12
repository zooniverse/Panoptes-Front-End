/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */

import PropTypes from 'prop-types';
import { Link } from 'react-router';

import GoBackIcon from '../icons/GoBackIcon.jsx';
import { useWorkflowContext } from '../context.js';
import strings from '../strings.json';

export default function WorkflowHeader({
  projectId = ''
}) {
  const { workflow } = useWorkflowContext();
  const returnUrl = `/lab/${projectId}/workflows`;

  if (!workflow) return null;

  return (
    <header>
      <Link to={returnUrl}>
        <GoBackIcon />
        {strings.PagesEditor.components.WorkflowHeader.go_back}
      </Link>
      <button type="button">
        Tasks
      </button>
      <button type="button">
        Workflow Settings
      </button>
    </header>
  );
}

WorkflowHeader.propTypes = {
  projectId: PropTypes.string
};
