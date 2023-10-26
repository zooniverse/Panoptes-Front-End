/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */
/* eslint-disable radix */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/forbid-prop-types */

import PropTypes from 'prop-types';

function StepItem({
  step,
  stepKey,
  tasks = {}
}) {
  if (!step || !stepKey) return <li className="step-item">???</li>;

  return (
    <li className="step-item">
      {stepKey}
    </li>
  );
}

StepItem.propTypes = {
  step: PropTypes.array,
  stepKey: PropTypes.string,
  tasks: PropTypes.object
};

export default StepItem;
