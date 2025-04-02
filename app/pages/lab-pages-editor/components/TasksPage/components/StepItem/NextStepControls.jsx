import PropTypes from 'prop-types';
import NextStepArrow from './NextStepArrow.jsx';
import NextStepIcon from '../../../../icons/NextStepIcon.jsx'

const DEFAULT_HANDLER = () => {};

export default function NextStepControls({
  allSteps = [],
  isLastItem = false,
  isLinearWorkflow = false,
  step,
  updateNextStepForStep = DEFAULT_HANDLER
}) {
  if (!step) return null;
  const [ stepKey, stepBody ] = step;
  const isLinearItem = isLinearWorkflow && !isLastItem;
  const showMockSubmit = isLinearWorkflow && isLastItem;
  const showNextPageDropdown = !isLinearWorkflow && !showMockSubmit;
  const selectableSteps = allSteps.filter(([otherStepKey]) => otherStepKey !== stepKey);
  
  function onChange(e) {
    const next = e.target?.value;
    updateNextStepForStep(stepKey, next);
  }

  if (showNextPageDropdown || showMockSubmit) {
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
            {selectableSteps.map(([otherStepKey, otherStepBody]) => {
              const taskKeysAsLabel = otherStepBody?.taskKeys?.toString() || '(none)';
              return (
                <option
                  key={`simple-next-controls-option-${otherStepKey}`}
                  value={otherStepKey}
                >
                  {taskKeysAsLabel}
                </option>
              );
            })}
          </select>
        )}
        {showMockSubmit && (
          <div className="mock-submit">Submit</div>
        )}
      </div>
    );
  } else {
    return (
      <div className="decorated-prompt">
        <span className="decoration-line" />
        <NextStepIcon className="next-step-icon" />
        <span className="decoration-line" />
      </div>
    );
  }
}

NextStepControls.propTypes = {
  allSteps: PropTypes.arrayOf(PropTypes.array),
  isLastItem: PropTypes.bool,
  isLinearWorkflow: PropTypes.bool,
  step: PropTypes.array,
  updateNextStepForStep: PropTypes.func
};
