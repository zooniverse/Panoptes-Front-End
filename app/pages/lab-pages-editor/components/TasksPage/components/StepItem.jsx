/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */
/* eslint-disable radix */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/forbid-prop-types */

import { useState } from 'react';
import PropTypes from 'prop-types';

// import strings from '../../../strings.json'; // TODO: move all text into strings
import TaskItem from './TaskItem.jsx';
import CopyIcon from '../../../icons/CopyIcon.jsx';
import DeleteIcon from '../../../icons/DeleteIcon.jsx';
import EditIcon from '../../../icons/EditIcon.jsx';
import GripIcon from '../../../icons/GripIcon.jsx';
import MoveDownIcon from '../../../icons/MoveDownIcon.jsx';
import MoveUpIcon from '../../../icons/MoveUpIcon.jsx';

function StepItem({
  allTasks,
  moveStep = () => {},
  step,
  stepKey,
  stepIndex
}) {
  if (!step || !stepKey || !allTasks) return <li className="step-item">ERROR: could not render Step</li>;

  const taskKeys = step.taskKeys || [];

  function moveStepUp() {
    moveStep(stepIndex, stepIndex - 1);
  }

  function moveStepDown() {
    moveStep(stepIndex, stepIndex + 1);
  }

  function onDragStart(e) {
    // TODO: drag item is step-body, but only the drag handle should initiate drag start
    console.log('+++ dragStart:', e);
    e.dataTransfer.setData('text/plain', stepIndex + '');
  }

  return (
    <li className="step-item">
      {(stepIndex === 0)
      ? <DropTarget targetIndex={stepIndex} moveStep={moveStep} />
      : null}
      <div
        className="step-body"
        draggable="true" /* This is enumerated, and has to be a string. */
        onDragStart={onDragStart}
      >
        <div className="step-controls flex-row spacing-bottom-XS">
          <span className="step-controls-left" />
          <div className="step-controls-center">
            <button
              aria-label={`Rearrange Page ${stepKey} upwards`}
              className="plain"
              onClick={moveStepUp}
              type="button"
            >
              <MoveUpIcon />
            </button>
            {/* TODO: add drag/drop functionality. Perhaps this needs to be wider, too. */}
            <GripIcon
              className="grab-handle"
            />
            <button
              aria-label={`Rearrange Page/Step ${stepKey} downwards`}
              className="plain"
              onClick={moveStepDown}
              type="button"
            >
              <MoveDownIcon />
            </button>
          </div>
          <div className="step-controls-right">
            <button aria-label={`Delete Page/Step ${stepKey}`} className="plain" type="button">
              <DeleteIcon />
            </button>
            <button aria-label={`Copy Page/Step ${stepKey}`} className="plain" type="button">
              <CopyIcon />
            </button>
            <button aria-label={`Edit Page/Step ${stepKey}`} className="plain" type="button">
              <EditIcon />
            </button>
          </div>
        </div>
        <ul className="tasks-list" aria-label={`Tasks for Page/Step ${stepKey}`}>
          {taskKeys.map((taskKey) => {
            const task = allTasks[taskKey];
            return (
              <TaskItem
                key={`taskItem-${taskKey}`}
                task={task}
                taskKey={taskKey}
              />
            );
          })}
        </ul>
      </div>
      <DropTarget targetIndex={stepIndex + 1} moveStep={moveStep} />
    </li>
  );
}

StepItem.propTypes = {
  allTasks: PropTypes.object,
  moveStep: PropTypes.func,
  step: PropTypes.object,
  stepKey: PropTypes.string,
  stepIndex: PropTypes.number
};

function DropTarget({
  targetIndex = 0,
  moveStep = () => {}
}) {
  const [active, setActive] = useState(false);

  function onDragEnter(e) {
    setActive(true);
    e.preventDefault(); // Prevent default, to ensure onDrop works.
  }

  function onDragLeave(e) {
    setActive(false);
    e.preventDefault();  // Probably unnecessary for onDrop, but oh well
  }

  function onDragOver(e) {
    e.preventDefault(); // Prevent default, to ensure onDrop works.
  }

  function onDrop(e) {
    const from = parseInt(e.dataTransfer.getData('text/plain')) || 0;
    const to = targetIndex;
    console.log('+++ onDrop: ', from, to);
    // moveStep(from, to);
    setActive(false);
    e.preventDefault();
  }

  return (
    <div
      className={`step-drop-target ${active ? 'active' : ''}`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    ></div>
  );
}

export default StepItem;
