import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';
import { pxToRem, zooTheme } from '../../../../theme';

import TaskInput from './components/TaskInput';
import TaskInputLabel from './components/TaskInputLabel';

export const StyledTaskInputField = styled.label`
  align-items: baseline;
  background-color: ${theme('mode', {
    dark: zooTheme.colors.darkTheme.background.default,
    light: zooTheme.colors.lightTheme.background.default
  })};
  border: ${theme('mode', {
    dark: `thin solid ${zooTheme.colors.darkTheme.font}`,
    light: 'none'
  })};
  box-shadow: 1px 1px 2px 0 rgba(0,0,0,0.5);
  color: ${theme('mode', {
    dark: zooTheme.colors.darkTheme.font,
    light: zooTheme.colors.lightTheme.font
  })};
  cursor: pointer;
  display: flex;
  margin: 10px 0;
  padding: 1ch 2ch;
  position: relative;
  text-align: left;

  &:hover, &:focus, &[data-focus=true] {
    background: ${theme('mode', {
      dark: zooTheme.colors.teal.dark,
      light: zooTheme.colors.teal.gradient
    })};
    border: ${theme('mode', {
      dark: `3px solid ${zooTheme.colors.teal.light}`,
      light: 'none'
    })};
    color: ${theme('mode', {
      dark: zooTheme.colors.darkTheme.font,
      light: 'white'
    })};
  }

  &.active {
    background-color: ${theme('mode', {
      dark: zooTheme.colors.teal.mid,
      light: zooTheme.colors.teal.mid
    })};
    border: ${theme('mode', {
      dark: `thin solid ${zooTheme.colors.teal.mid}`,
      light: 'none'
    })};
    color: ${theme('mode', {
      dark: zooTheme.colors.darkTheme.font,
      light: 'white'
    })}
  }
`;

export function TaskInputField(props) {
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
