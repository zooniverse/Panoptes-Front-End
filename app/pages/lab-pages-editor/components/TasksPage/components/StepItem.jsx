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
  activeDragItem = -1,
  allTasks,
  editStep = () => {},
  moveStep = () => {},
  setActiveDragItem = () => {},
  step,
  stepKey,
  stepIndex
}) {
  if (!step || !stepKey || !allTasks) return <li className="step-item">ERROR: could not render Step</li>;

  const taskKeys = step.taskKeys || [];

  function edit() {
    editStep(stepIndex);
  }

  function moveStepUp() {
    moveStep(stepIndex, stepIndex - 1);
  }

  function moveStepDown() {
    moveStep(stepIndex, stepIndex + 1);
  }

  function onDragStart(e) {
    // TODO: drag item is step-body, but only the drag handle should initiate drag start
    e.dataTransfer.setData('text/plain', stepIndex + '');
    setActiveDragItem(stepIndex);  // Use state because DropTarget's onDragEnter CAN'T read dragEvent.dataTransfer.getData()
  }

  return (
    <li className="step-item">
      {(stepIndex === 0)
      ? <DropTarget
          activeDragItem={activeDragItem}
          moveStep={moveStep}
          setActiveDragItem={setActiveDragItem}
          targetIndex={stepIndex}
        />
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
              className="move-button plain"
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
              className="move-button plain"
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
            <button
              aria-label={`Edit Page/Step ${stepKey}`}
              className="plain"
              onClick={edit}
              type="button"
            >
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
      <DropTarget
        activeDragItem={activeDragItem}
        moveStep={moveStep}
        setActiveDragItem={setActiveDragItem}
        targetIndex={stepIndex + 1}  /* Don't forget the +1 ! */
      />
    </li>
  );
}

StepItem.propTypes = {
  activeDragItem: PropTypes.number,
  allTasks: PropTypes.object,
  editStep: PropTypes.func,
  moveStep: PropTypes.func,
  setActiveDragItem: PropTypes.func,
  step: PropTypes.object,
  stepKey: PropTypes.string,
  stepIndex: PropTypes.number
};

function DropTarget({
  activeDragItem = -1,
  moveStep = () => {},
  setActiveDragItem = () => {},
  targetIndex = 0
}) {
  const [active, setActive] = useState(false);

  function onDragEnter(e) {
    const from = activeDragItem;
    const to = (from < targetIndex) ? targetIndex - 1 : targetIndex; 
    setActive(from !== to);
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
    const to = (from < targetIndex) ? targetIndex - 1 : targetIndex;
    moveStep(from, to);
    setActive(false);
    setActiveDragItem(-1);
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

DropTarget.propTypes = {
  activeDragItem: PropTypes.number,
  moveStep: PropTypes.func,
  setActiveDragItem: PropTypes.func,
  targetIndex: PropTypes.number
}

export default StepItem;
