import PropTypes from 'prop-types';
import React from 'react';

export default function LabelEditor(props) {
  function deleteAnnotation(annotation) {
    const index = props.annotation.value.indexOf(annotation);
    props.annotation.value.splice(index, 1);
    props.onChange(props.annotation);
  }

  function onClick(e) {
    if (e.data && e.data.text && e.target.className === 'survey-identification-remove') {
      deleteAnnotation(e.data);
      e.preventDefault();
    }
  }

  function onKeyDown(e) {
    if (e.data && e.data.text && e.which === 8) {
      deleteAnnotation(e.data);
      e.preventDefault();
    }
  }

  const children = React.Children.map(
    props.children, child => React.cloneElement(child, { disabled: false })
  );

  return (
    <div onClick={onClick} onKeyDown={onKeyDown}>
      {children}
    </div>
  );
}

LabelEditor.propTypes = {
  children: PropTypes.node
};