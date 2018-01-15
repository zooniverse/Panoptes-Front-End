import PropTypes from 'prop-types';
import React from 'react';

export default function Selection(props) {
  function onClick(e) {
    e.data = props.annotation;
  }

  function onKeyDown(e) {
    e.data = props.annotation;
  }

  return (
    <span
      style={{ background: `${props.annotation.labelInformation.color}` }}
      data-selection={props.annotation.text}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {props.annotation.text}
      {' '}
      {!props.disabled &&
        <button className="survey-identification-remove" aria-label="Delete" title="Delete">&times;</button>}
    </span>
  );
}

Selection.propTypes = {
  annotation: PropTypes.shape({
    labelInformation: PropTypes.object,
    text: PropTypes.string
  }),
  disabled: PropTypes.bool
};

Selection.defaultProps = {
  disabled: true
};