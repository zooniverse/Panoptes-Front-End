import React from 'react';
import PropTypes from 'prop-types';
import counterpart from 'counterpart';

counterpart.registerTranslations('en', {
  lab: {
    visibility: {
      applyForBeta: {
        applyButton: 'Apply for review'
      }
    }
  }
});

function ApplyForBetaButton({ applyForBetaFn, disabled }) {
  return (
    <button
      type="button"
      className="standard-button"
      disabled={disabled}
      onClick={applyForBetaFn}
    >
      {counterpart('lab.visibility.applyForBeta.applyButton')}
    </button>
  );
}

ApplyForBetaButton.propTypes = {
  applyForBetaFn: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

ApplyForBetaButton.defaultProps = {
  applyForBetaFn: Function.prototype,
  disabled: true
};

export default ApplyForBetaButton;
