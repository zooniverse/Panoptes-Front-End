import PropTypes from 'prop-types';
import React from 'react';

const TextTaskSummary = ({ annotation, task }) => (
  <div>
    <div className="question">
      {task.instruction}
    </div>
    <div className="answers">
      {annotation && annotation.value &&
        <div className="answer">
          “<code>{annotation.value}</code>”
        </div>}
    </div>
  </div>
);

TextTaskSummary.propTypes = {
  annotation: PropTypes.shape(
    { value: PropTypes.string }
  ),
  task: PropTypes.shape(
    {
      instruction: PropTypes.string,
      help: PropTypes.string,
      required: PropTypes.bool
    }
  )
};

TextTaskSummary.defaultProps = {
  annotation: null,
  task: null
};

export default TextTaskSummary;
