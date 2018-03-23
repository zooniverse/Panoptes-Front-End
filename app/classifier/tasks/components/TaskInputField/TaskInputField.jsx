import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';
import { pxToRem, zooTheme } from '../../../../theme';

import TaskInput from './components/TaskInput';
import TaskInputLabel from './components/TaskInputLabel';

const StyledTaskInputField = styled.label`
  align-items: baseline;
  background-color: ${theme('mode' , {
    light: zooTheme.colors.lightTheme.background
  })};
  border: none;
  box-shadow: 1px 1px 2px 0 rgba(0,0,0,0.5);
  color: ${theme('mode'), {
    light: zooTheme.colors.lightTheme.font
  }};
  cursor: pointer;
  display: flex;
  margin: 10px 0;
  padding: 1ch 2ch;
  position: relative;
  text-align: left;

  &:hover, &:focus, &[data-focus=true] {
    background: ${theme('mode', {
      light: zooTheme.colors.teal.hoverGradient
    })};
    color: ${theme('mode', {
      light: 'white'
    })}
  }

  &.active {
    background-color: ${theme('mode', {
      light: zooTheme.colors.teal.mide
    })};
    color: ${theme('mode', {
      light: 'white'
    })}
  }
`;

function TaskInputField(props) {
  return (
    <ThemeProvider theme={{ mode: props.theme }}>
      <StyledTaskInputField className={props.className}>
        <TaskInput
          annotation={props.annotation}
          index={props.index}
          name={props.name}
          onChange={props.onChange}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          type={props.type}
        />
        <TaskInputLabel label={props.label} />
      </StyledTaskInputField>
    </ThemeProvider>
  );
}

TaskInputField.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.string
};

const mapStateToProps = state => ({
  theme: state.userInterface.theme
});

export default connect(mapStateToProps)(TaskInputField);
