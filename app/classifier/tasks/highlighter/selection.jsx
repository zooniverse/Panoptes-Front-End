import React from 'react';

export default function Selection(props) {
  return (
    <span style={{ background: `${props.annotation.labelInformation.color}` }} >
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