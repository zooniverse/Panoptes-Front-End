import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

// import strings from '../../../strings.json'; // TODO: move all text into strings
import DropTarget from './DropTarget.jsx';
import TaskItem from './TaskItem.jsx';

import checkCanStepBranch from '../../../../helpers/checkCanStepBranch.js';

import NextStepControls from './NextStepControls.jsx';

import CopyIcon from '../../../../icons/CopyIcon.jsx';
import DeleteIcon from '../../../../icons/DeleteIcon.jsx';
import EditIcon from '../../../../icons/EditIcon.jsx';
import GripIcon from '../../../../icons/GripIcon.jsx';
import MoveDownIcon from '../../../../icons/MoveDownIcon.jsx';
import MoveUpIcon from '../../../../icons/MoveUpIcon.jsx';

const DEFAULT_HANDLER = () => {};
const ENABLE_EXPERIMENTAL_CONTAINER_STYLE = true;  // If enabled, and the last Task is a branching Task, then the .step-body container will be restyled so that the "next step" arrows APPEAR OUTSIDE the container.
const CONTAINER_HEIGHT_OFFSET = 64;  // This value is eyeballed. Adjust as necessary.

function StepItem({
  activeDragItem = -1,
  allSteps,
  allTasks,
  copyStep = DEFAULT_HANDLER,
  deleteStep = DEFAULT_HANDLER,
  isLinearWorkflow = false,
  moveStep = DEFAULT_HANDLER,
  openEditStepDialog = DEFAULT_HANDLER,
  setActiveDragItem = DEFAULT_HANDLER,
  step,
  stepIndex,
  updateNextStepForStep = DEFAULT_HANDLER,
  updateNextStepForTaskAnswer = DEFAULT_HANDLER
}) {
  const htmlContainer = useRef(null);
  const htmlContent = useRef(null);
  const [ containerStyle, setContainerStyle ] = useState({});
  const [stepKey, stepBody] = step || [];
  if (!stepKey || !stepBody || !allSteps || !allTasks) return <li className="step-item">ERROR: could not render Step</li>;

  const isLastItem = stepIndex === allSteps.length - 1;
  const taskKeys = stepBody.taskKeys || [];
  const branchingTaskKey = checkCanStepBranch(step, allTasks);
  const stepLabel = `Page ${ stepIndex + 1 }`

  function doCopyStep() {
    copyStep(stepIndex);
  }

  function doDeleteStep() {
    deleteStep(stepIndex);
  }

  function doEdit() {
    openEditStepDialog(stepIndex);
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

  /*
  Experimental: restyle the Step Item in such a way that - if the last Task in
  a Step is a branching Task - that Task's answers' "next Step" arrow
  appear outside the Step Item container.

  Look, it's hard describe in words, so please appreciate this ASCII diagram:

    +--StepItem--------------+
    |                        |  Note how the arrow joining [Yes] with [T1], and
    |  T0 Do you see a Cat?  |  the arrow joining [No] with [T7], both sit
    |                        |  outside the StepItem's boundary box.
    |    [ Yes ]    [ No ]   |
    |      |          |      |
    +------|----------|------+
           v          v
         [ T1  ]    [ T7 ]
   */
  function experimentalRestyleContainer() {
    const container = htmlContainer?.current;
    const content = htmlContent?.current;
    if (!content || !container || !ENABLE_EXPERIMENTAL_CONTAINER_STYLE) return;

    const lastTaskInStep = taskKeys.at(-1);
    const lastTaskHasAnswers = allTasks?.[lastTaskInStep]?.answers?.length > 0
    const contentHeight = content.offsetHeight;
    if (lastTaskInStep === branchingTaskKey && lastTaskHasAnswers && contentHeight) {
      setContainerStyle({
        height: `${content.offsetHeight - CONTAINER_HEIGHT_OFFSET}px`,
        marginBottom: `${CONTAINER_HEIGHT_OFFSET}px`,
        paddingBottom: '0',
        // overflow: 'visible'  // Unnecessary here, as this is already specified in the .styl
      });
    } else {
      setContainerStyle({});
    }
  }

  // TODO: experimentalRestyleContainer() should also trigger when the window resizes.
  useEffect(experimentalRestyleContainer, [step])
  
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
        ref={htmlContainer}
        style={containerStyle}
      >
        <div
          /* Redundant inner content is used for styling "branching next step extrudes from step-body" */
          className="step-body-inner"
          ref={htmlContent}
        >
          <div className="step-controls">
            <div className="step-controls-left">
              <span className="step-label">{stepLabel}</span>
            </div>
            <div className="step-controls-center">
              <button
                aria-label={`Rearrange Page ${stepKey} upwards`}
                className="control-button"
                onClick={moveStepUp}
                type="button"
              >
                <MoveUpIcon />
              </button>
              <GripIcon
                className="grab-handle"
              />
              <button
                aria-label={`Rearrange Page/Step ${stepKey} downwards`}
                className="control-button"
                onClick={moveStepDown}
                type="button"
              >
                <MoveDownIcon />
              </button>
            </div>
            <div className="step-controls-right">
              <button
                aria-label={`Edit Page/Step ${stepKey}`}
                className="control-button"
                onClick={doEdit}
                type="button"
              >
                <EditIcon />
              </button>
              <button
                aria-label={`Copy Page/Step ${stepKey}`}
                className="control-button"
                onClick={doCopyStep}
                type="button"
              >
                <CopyIcon />
              </button>
              <button
                aria-label={`Delete Page/Step ${stepKey}`}
                className="control-button"
                onClick={doDeleteStep}
                type="button"
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
          <ul
            aria-label={`Tasks for Page/Step ${stepKey}`}
            className="tasks-list"
          >
            {taskKeys.map((taskKey) => {
              const task = allTasks[taskKey];
              return (
                <TaskItem
                  allSteps={allSteps}
                  isBranchingTask={branchingTaskKey === taskKey}
                  key={`taskItem-${taskKey}`}
                  stepKey={stepKey}
                  task={task}
                  taskKey={taskKey}
                  updateNextStepForTaskAnswer={updateNextStepForTaskAnswer}
                />
              );
            })}
          </ul>
        </div>
      </div>
      {!branchingTaskKey && (
        <NextStepControls
          allSteps={allSteps}
          isLastItem={isLastItem}
          isLinearWorkflow={isLinearWorkflow}
          step={step}
          updateNextStepForStep={updateNextStepForStep}
        />
      )}
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
  allSteps: PropTypes.array,
  allTasks: PropTypes.object,
  copyStep: PropTypes.func,
  deleteStep: PropTypes.func,
  isLinearWorkflow: PropTypes.bool,
  moveStep: PropTypes.func,
  openEditStepDialog: PropTypes.func,
  setActiveDragItem: PropTypes.func,
  step: PropTypes.array,
  stepIndex: PropTypes.number,
  updateNextStepForStep: PropTypes.func,
  updateNextStepForTaskAnswer: PropTypes.func
};

export default StepItem;
