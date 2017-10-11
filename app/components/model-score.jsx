import React from 'react';

const isVar = v => typeof v !== 'undefined';

// grabs the model score (calculated in modelCanvas) and displays it with a
// progress bar
const ModelScore = (props) => {
  if (props.workflow && props.workflow.configuration &&
    props.workflow.configuration.metadata &&
    props.workflow.configuration.metadata.modelScore) {
    let s = props.workflow.configuration.metadata.modelScore;
    if (s < 80) {
      s = (s).toFixed(2);
    } else if (s < 95) {
      s = (s).toFixed(3);
    } else {
      s = (s).toFixed(4);
    }
    return (
      <div className="answer undefined">
        <div className="answer-button">
          <div className="answer-button-label">Score: {s}</div>
          <progress max="100" value={s} />
        </div>
      </div>);
  } else {
    return (
      <div>
        <p>No Score Calculated</p>
        <progress max="100" value="0" />
      </div>
    );
  }
};

/* eslint-disable react/forbid-prop-types */
ModelScore.propTypes = {
  workflow: React.PropTypes.object
};
/* eslint-enable react/forbid-prop-types */

ModelScore.defaultProps = {
  workflow: {}
};

// check if we're on a modelling project, and only render if we are
const ModelScoreWrapper = (props) => {
  if (props.workflow.configuration.metadata && props.workflow.configuration.metadata.type === 'modelling') {
    return <ModelScore {...props} />;
  } else {
    return null;
  }
};

/* eslint-disable react/forbid-prop-types */
ModelScoreWrapper.propTypes = {
  workflow: React.PropTypes.object
};
/* eslint-enable react/forbid-prop-types */


export default ModelScoreWrapper;
