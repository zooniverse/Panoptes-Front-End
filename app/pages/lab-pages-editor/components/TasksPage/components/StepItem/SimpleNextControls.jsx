import PropTypes from 'prop-types';
import NextStepArrow from './NextStepArrow.jsx';

const DEFAULT_HANDLER = () => {};

export default function SimpleNextControls({
  allSteps = [],
  isLastItem = false,
  isLinearWorkflow = false,
  step,
  updateNextStepForStep = DEFAULT_HANDLER
}) {
  if (!step) return null;
  const [ stepKey, stepBody ] = step;
  const isLinearItem = isLinearWorkflow && !isLastItem;
  const showFakeSubmit = isLinearWorkflow && isLastItem;
  const showNextPageDropdown = !isLinearWorkflow && !showFakeSubmit;
  
  function onChange(e) {
    const next = e.target?.value;
    updateNextStepForStep(stepKey, next);
  }

  return (
    <div className="next-controls vertical-layout">
      <NextStepArrow
        arrowhead={isLinearItem}
        className="next-arrow"
        height={isLinearItem ? 24 : 10}
      />
      {showNextPageDropdown && (<select
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
      )}
      {showFakeSubmit && (
        <div className="fake-submit">Submit</div>
      )}
    </div>
  );
}

SimpleNextControls.propTypes = {
  allSteps: PropTypes.arrayOf(PropTypes.array),
  isLastItem: PropTypes.bool,
  isLinearWorkflow: PropTypes.bool,
  step: PropTypes.array,
  updateNextStepForStep: PropTypes.func
};