import PropTypes from 'prop-types';
import NextStepArrow from './NextStepArrow.jsx';

const DEFAULT_HANDLER = () => {};

export default function SimpleNextControls({
  allSteps = [],
  step,
  updateNextStepForStep = DEFAULT_HANDLER
}) {
  if (!step) return null;
  const [ stepKey, stepBody ] = step;

  function onChange(e) {
    const next = e.target?.value;
    updateNextStepForStep(stepKey, next);
  }

  return (
    <div className="next-controls vertical-layout">
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

SimpleNextControls.propTypes = {
  allSteps: PropTypes.arrayOf(PropTypes.array),
  step: PropTypes.array,
  updateNextStepForStep: PropTypes.func
};