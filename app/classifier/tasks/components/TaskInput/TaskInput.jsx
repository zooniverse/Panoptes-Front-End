import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import theme from 'styled-theming';
import { zooTheme } from '../../../../theme';

export const StyledTaskInput = styled.input.attrs({
  autoFocus: props => props.index === props.annotation.value,
  checked: props => props.index === props.annotation.value,
  name: props => props.name,
  type: props => props.type,
  value: props => props.value
})`
  opacity: 0.01;
  position: absolute;
`;

// Radio or Checkbox
// Using, visibility: hidden or display: none breaks accessibility. This keeps the buttons keyboard accessibile,
// but hides the actual radio or checkbox
function TaskInput(props) {
  return (
    <StyledTaskInput
      annotation={props.annotation}
      index={props.index}
      name={props.name}
      onChange={props.onChange}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      type={props.type}
      value={props.index}
    />
  );
}

const mapStateToProps = state => ({
  theme: state.userInterface.theme
});

export default connect(mapStateToProps)(TaskInput);
