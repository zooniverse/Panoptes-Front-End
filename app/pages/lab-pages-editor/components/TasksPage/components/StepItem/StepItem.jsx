import PropTypes from 'prop-types';

// import strings from '../../../strings.json'; // TODO: move all text into strings
import DropTarget from './DropTarget.jsx';
import TaskItem from './TaskItem.jsx';

import checkCanStepBranch from '../../../../helpers/checkCanStepBranch.js';

import SimpleNextControls from './SimpleNextControls.jsx';

import CopyIcon from '../../../../icons/CopyIcon.jsx';
import DeleteIcon from '../../../../icons/DeleteIcon.jsx';
import EditIcon from '../../../../icons/EditIcon.jsx';
import GripIcon from '../../../../icons/GripIcon.jsx';
import MoveDownIcon from '../../../../icons/MoveDownIcon.jsx';
import MoveUpIcon from '../../../../icons/MoveUpIcon.jsx';

const DEFAULT_HANDLER = () => {};

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
  const [stepKey, stepBody] = step || [];
  if (!stepKey || !stepBody || !allSteps || !allTasks) return <li className="step-item">ERROR: could not render Step</li>;

  const isLastItem = stepIndex === allSteps.length - 1;
  const taskKeys = stepBody.taskKeys || [];

  function doCopy() {
    copyStep(stepIndex);
  }

  function doDelete() {
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

  const branchingTaskKey = checkCanStepBranch(step, allTasks);
  
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
            <button
              aria-label={`Delete Page/Step ${stepKey}`}
              className="plain"
              onClick={doDelete}
              type="button"
            >
              <DeleteIcon />
            </button>
            <button
              aria-label={`Copy Page/Step ${stepKey}`}
              className="plain"
              onClick={doCopy}
              type="button"
            >
              <CopyIcon />
            </button>
            <button
              aria-label={`Edit Page/Step ${stepKey}`}
              className="plain"
              onClick={doEdit}
              type="button"
            >
              <EditIcon />
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
                task={task}
                taskKey={taskKey}
                updateNextStepForTaskAnswer={updateNextStepForTaskAnswer}
              />
            );
          })}
        </ul>
      </div>
      {!branchingTaskKey && (
        <SimpleNextControls
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
