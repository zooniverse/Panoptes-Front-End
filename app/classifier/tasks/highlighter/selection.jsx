import React from 'react';

export default function Selection(props) {
  function onClick(e) {
    e.data = props.annotation;
  }

  function onKeyDown(e) {
    e.data = props.annotation;
  }

  return (
    <span tabIndex={-1} style={{ background: `${props.annotation.labelInformation.color}` }} onClick={onClick} onKeyDown={onKeyDown}>
      {props.annotation.text}
    </span>
  );
}

Selection.propTypes = {
  annotation: React.PropTypes.shape({
    labelInformation: React.PropTypes.object,
    text: React.PropTypes.string
  })
};