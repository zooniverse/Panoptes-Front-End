import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

function shouldInputBeChecked(annotation, index, type) {
  if (type === 'radio') {
    const toolIndex = annotation._toolIndex || 0;
    if (toolIndex) {
      return index === toolIndex;
    }
    return index === annotation.value;
  }

  if (type === 'checkbox') {
    return (annotation.value && annotation.value.length > 0) ? annotation.value.includes(index) : false;
  }

  return false;
}

function shouldInputBeFocused(annotation, index, name, type) {
  if (type === 'radio' && name === 'drawing-tool') {
    return index === 0;
  }

  return index === annotation.value;
}

export const StyledTaskInput = styled.input.attrs({
  autoFocus: props => shouldInputBeFocused(props.annotation, props.index, props.name, props.type),
  checked: props => shouldInputBeChecked(props.annotation, props.index, props.type),
  name: props => props.name,
  type: props => props.type,
  value: props => props.index
})`
  opacity: 0.01;
  position: absolute;
`;

// Radio or Checkbox
// Using, visibility: hidden or display: none breaks accessibility. This keeps the buttons keyboard accessibile,
// but hides the actual radio or checkbox
export default function TaskInput(props) {
  return (
    <StyledTaskInput
      annotation={props.annotation}
      index={props.index}
      name={props.name}
      onChange={props.onChange}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      type={props.type}
    />
  );
}

TaskInput.defaultProps = {
  name: '',
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {}
};

TaskInput.propTypes ={
  annotation: PropTypes.shape({
    _key: PropTypes.number,
    _toolIndex: PropTypes.number,
    task: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.number), // mulitple choice
      PropTypes.number, // single choice
      PropTypes.arrayOf(PropTypes.object), // drawing task
      PropTypes.object // null
    ])
  }).isRequired,
  index: PropTypes.number.isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  type: PropTypes.string.isRequired
};

