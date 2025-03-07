import PropTypes from 'prop-types';
import NextStepArrow from './NextStepArrow.jsx';

const DEFAULT_HANDLER = () => {};

export default function BranchingNextControls({
  allSteps = [],
  stepKey,
  task,
  taskKey,
  updateNextStepForTaskAnswer = DEFAULT_HANDLER
}) {
  if (!task || !taskKey) return null;

  const answers = task.answers || [];
  const selectableSteps = allSteps.filter(([otherStepKey]) => otherStepKey !== stepKey);

  function onChange(e) {
    const next = e.target?.value;
    const index = e?.target?.dataset.index;
    updateNextStepForTaskAnswer(taskKey, index, next);
  }

  return (
    <ul className="next-controls horizontal-list">
      {answers.map((answer, index) => (
        <li key={`branching-next-controls-answer-${index}`}>
          <div className="mock-button">{answer.label}</div>
          <NextStepArrow className="next-arrow" />
          <select
            className={(!answer?.next) ? 'next-is-submit' : ''}
            data-index={index}
            onChange={onChange}
            value={answer?.next || ''}
          >
            <option
              value={''}
            >
              Submit
            </option>
            {selectableSteps.map(([stepKey, stepBody]) => {
              const taskKeys = stepBody?.taskKeys?.toString() || '(none)';
              return (
                <option
                  key={`branching-next-controls-answer-${index}-option-${stepKey}`}
                  value={stepKey}
                >
                  {taskKeys}
                </option>
              );
            })}
          </select>
        </li>
      ))}
    </ul>
  );
}

BranchingNextControls.propTypes = {
  allSteps: PropTypes.arrayOf(PropTypes.array),
  stepKey: PropTypes.string,
  task: PropTypes.object,
  taskKey: PropTypes.string,
  updateNextStepForTaskAnswer: PropTypes.func
};