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
  const tabs = [
    {
      id: 'pages-editor_workflow-header-tab-button_task',
      label: strings.PagesEditor.components.WorkflowHeader.tasks
    }, {
      id: 'pages-editor_workflow-header-tab-button_settings',
      label: strings.PagesEditor.components.WorkflowHeader.workflow_settings
    }
  ];

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
      <div
        role="tablist"
        className="flex-row flex-item justify-around"
      >
        {tabs.map((tab, index) => (
          <TabButton
            id={tab.id}
            index={index}
            key={`${tab.id}`}
            label={tab.label}
            onClick={onClick}
            selected={(currentTab === index)}
          />
        ))}
      </div>
    </div>
  );
}

WorkflowHeader.propTypes = {
  currentTab: PropTypes.number,
  projectId: PropTypes.string,
  setCurrentTab: PropTypes.func
};

function TabButton({
  id,
  index,
  label = '',
  onClick = () => {},
  selected = false
}) {
  return (
    <button
      aria-selected={selected}
      className={selected ? 'selected' : 'unselected'}
      data-tab={index}
      id={id}
      onClick={onClick}
      role="tab"
      type="button"
    >
      {label}
    </button>
  );
}

TabButton.propTypes = {
  id: PropTypes.string,
  index: PropTypes.number,
  label: PropTypes.string,
  onClick: PropTypes.func,
  selected: PropTypes.bool
};
