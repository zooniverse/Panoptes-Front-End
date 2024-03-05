import NextStepArrow from './NextStepArrow.jsx';

const DEFAULT_HANDLER = () => {};

export default function BranchingNextControls({
  allSteps = [],
  task,
  taskKey,
  updateAnswerNext = DEFAULT_HANDLER
}) {
  if (!task || !taskKey) return null;

  const answers = task.answers || []

  function onChange(e) {
    const next = e.target?.value;
    const index = e?.target?.dataset.index;
    updateAnswerNext(taskKey, index, next);
  }

  return (
    <ul className="next-step-controls branching-next-controls">
      {answers.map((answer, index) => (
        <li key={`branching-next-controls-answer-${index}`}>
          <div className="fake-button">{answer.label}</div>
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
            {allSteps.map(([stepKey, stepBody]) => {
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