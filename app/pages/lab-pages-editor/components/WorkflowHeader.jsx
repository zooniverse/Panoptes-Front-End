/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */
/* eslint-disable radix */

import PropTypes from 'prop-types';
import { Link } from 'react-router';

import ReturnIcon from '../icons/ReturnIcon.jsx';
import { useWorkflowContext } from '../context.js';
import strings from '../strings.json';

export default function WorkflowHeader({
  currentTab = 1000,
  projectId = '',
  setCurrentTab = () => {}
}) {
  const { workflow } = useWorkflowContext();
  const returnUrl = `/lab/${projectId}/workflows`;

  function onClick(e) {
    const { tab } = e.target.dataset;
    setCurrentTab(parseInt(tab));
  }

  if (!workflow) return null;

  return (
    <div className="workflow-header flex-row">
      <Link to={returnUrl}>
        <ReturnIcon />
        {strings.PagesEditor.components.WorkflowHeader.return}
      </Link>
      <div className="flex-row flex-item justify-around">
        <button
          className={(currentTab === 0) ? 'selected' : 'unselected'}
          data-tab="0"
          onClick={onClick}
          type="button"
        >
          {strings.PagesEditor.components.WorkflowHeader.tasks}
        </button>
        <button
          className={(currentTab === 1) ? 'selected' : 'unselected'}
          data-tab="1"
          onClick={onClick}
          type="button"
        >
          {strings.PagesEditor.components.WorkflowHeader.workflow_settings}
        </button>
      </div>
    </div>
  );
}

WorkflowHeader.propTypes = {
  currentTab: PropTypes.number,
  projectId: PropTypes.string,
  setCurrentTab: PropTypes.func
};
