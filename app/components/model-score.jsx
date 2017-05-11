import React from 'react';

// TODO: credit source
(function() {
  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }
})();

const isVar = (v) => typeof(v) !== 'undefined';

// grabs the model score (calculated in modelCanvas) and displays it with a
// progress bar
const ModelScore = (props) => {
  if (isVar(props.workflow) && isVar(props.workflow.configuration) &&
    isVar(props.workflow.configuration.metadata) &&
    isVar(props.workflow.configuration.metadata.modelScore)) {
    let s = props.workflow.configuration.metadata.modelScore;
    if (s < 80) {
      s = Math.round10(s, -2);
    } else if (s < 90) {
      s = Math.round10(s, -3);
    } else if (s < 95) {
      s = Math.round10(s, -4);
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
}

ModelScore.propTypes = {
  workflow: React.PropTypes.object
};

ModelScore.defaultProps = {
  workflow: {}
}

export default ModelScore;
