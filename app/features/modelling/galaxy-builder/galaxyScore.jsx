import PropTypes from 'prop-types';
import React from 'react';

// grabs the model score (calculated in modelCanvas) and displays it with a
// progress bar
const ModelScore = (props) => {
  let s = props.score === null ? 0 : props.score;
  if (s < 80) {
    s = s.toFixed(2);
  } else if (s < 95) {
    s = (s).toFixed(3);
  } else {
    s = (s).toFixed(4);
  }
  return (
    <div>
      <div>Score: {s}</div>
      <progress max="100" value={s} />
    </div>);
};

/* eslint-disable react/forbid-prop-types */
ModelScore.propTypes = {
  score: PropTypes.number
};
/* eslint-enable react/forbid-prop-types */

// check if we're on a modelling project, and only render if we are
const ModelScoreWrapper = (props) => {
  if (props.modellingEnabled) {
    return <ModelScore {...props} />;
  } else {
    return null;
  }
};

/* eslint-disable react/forbid-prop-types */
ModelScoreWrapper.propTypes = {
  modellingEnabled: PropTypes.bool
};
/* eslint-enable react/forbid-prop-types */


export default ModelScoreWrapper;