import NextStepArrow from './NextStepArrow.jsx';

export default function SimpleNextControls({
  allSteps = [],
  step
}) {
  if (!step) return null;
  const [ stepKey, stepBody ] = step;

  function onChange() {}

  return (
    <div className="next-step-controls simple-next-controls">
      <NextStepArrow className="next-arrow" />
      <select
        className={(!stepBody?.next) ? 'next-is-submit' : ''}
        onChange={onChange}
        value={stepBody?.next || ''}
      >
        <option
          value={''}
        >
          Submit
        </option>
        {allSteps.map(([otherStepKey, otherStepBody]) => {
          const taskKeys = otherStepBody?.taskKeys?.toString() || '(none)';
          return (
            <option
              key={`simple-next-controls-option-${otherStepKey}`}
              value={otherStepKey}
            >
              {taskKeys}
            </option>
          );
        })}
      </select>
    </div>
  );
}