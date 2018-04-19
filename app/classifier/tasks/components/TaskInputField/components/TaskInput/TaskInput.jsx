import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';



export const StyledTaskInput = styled.input.attrs({
  name: props => props.name,
  type: props => props.type
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

      name={props.name}
      onChange={props.onChange}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      type={props.type}
      value={props.index}
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

