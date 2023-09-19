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
  currentTab = 0,
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

  // When clicking a tab button, make that tab active. This is pretty straightforward.
  function onClick(e) {
    const { tab } = e.target.dataset;
    setCurrentTab(parseInt(tab));
  }

  // When a tab button has focus, the left/right keys will switch to the prev/next tab.
  function onKeyUp(e) {
    let changeTab = 0;
    if (e.key === 'ArrowLeft') changeTab = -1;
    if (e.key === 'ArrowRight') changeTab = +1;

    if (changeTab !== 0) {
      const newTab = (currentTab + changeTab + tabs.length) % tabs.length;
      setCurrentTab(newTab);
      e.preventDefault?.();
      e.stopPropagation?.();
      return false;
    }

    return true;
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
            onKeyUp={onKeyUp}
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
  onKeyUp = () => {},
  selected = false
}) {
  return (
    <button
      aria-selected={selected}
      className={selected ? 'selected' : 'unselected'}
      data-tab={index}
      id={id}
      onClick={onClick}
      onKeyUp={onKeyUp}
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
  onKeyUp: PropTypes.func,
  selected: PropTypes.bool
};
