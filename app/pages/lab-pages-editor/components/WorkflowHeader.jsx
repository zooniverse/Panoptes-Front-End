import PropTypes from 'prop-types';

import ReturnIcon from '../icons/ReturnIcon.jsx';
import { useWorkflowContext } from '../context.js';
import strings from '../strings.json';

export default function WorkflowHeader({
  currentTab = 0,
  projectId = '',
  setCurrentTab = () => {},
  tabs = []
}) {
  const { workflow } = useWorkflowContext();
  const returnUrl = `/lab/${projectId}/workflows`;

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
      document?.querySelector(`#${tabs[newTab]?.id}`)?.focus();

      e.preventDefault?.();
      e.stopPropagation?.();
      return false;
    }

    return true;
  }

  if (!workflow) return null;

  return (
    <div className="workflow-header flex-row">
      <a href={returnUrl}> {/* Formerly <Link> from 'react-router', but React was throwing Legacy Context errors. */}
        <ReturnIcon />
        {strings.PagesEditor.components.WorkflowHeader.return}
      </a>
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
            targetPanel={tab.targetPanel}
          />
        ))}
      </div>
    </div>
  );
}

WorkflowHeader.propTypes = {
  currentTab: PropTypes.number,
  projectId: PropTypes.string,
  setCurrentTab: PropTypes.func,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      targetPanel: PropTypes.string
    })
  )
};

function TabButton({
  id,
  index,
  label = '',
  onClick = () => {},
  onKeyUp = () => {},
  selected = false,
  targetPanel = ''
}) {
  return (
    <button
      aria-controls={targetPanel}
      aria-selected={selected ? 'true' : 'false'}
      data-tab={index}
      id={id}
      onClick={onClick}
      onKeyUp={onKeyUp}
      role="tab"
      tabIndex={selected ? 0 : -1}
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
  selected: PropTypes.bool,
  targetPanel: PropTypes.string
};
