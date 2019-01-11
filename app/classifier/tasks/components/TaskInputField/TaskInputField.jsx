import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';
import { pxToRem, zooTheme } from '../../../../theme';

import TaskInputLabel from './components/TaskInputLabel';
import { doesTheLabelHaveAnImage } from './helpers';

const DEFAULT = {
  backgroundColor: theme('mode', {
    dark: zooTheme.colors.darkTheme.background.default,
    light: zooTheme.colors.lightTheme.background.default
  }),
  border: theme('mode', {
    dark: `2px solid ${zooTheme.colors.darkTheme.font}`,
    light: '2px solid transparent'
  }),
  color: theme('mode', {
    dark: zooTheme.colors.darkTheme.font,
    light: zooTheme.colors.lightTheme.font
  })
};

const HOVER = {
  gradientTop: theme('mode', {
    dark: zooTheme.colors.darkTheme.button.answer.gradient.top,
    light: zooTheme.colors.lightTheme.button.answer.gradient.top
  }),
  gradientBottom: theme('mode', {
    dark: zooTheme.colors.darkTheme.button.answer.gradient.bottom,
    light: zooTheme.colors.lightTheme.button.answer.gradient.bottom
  }),
  color: theme('mode', {
    dark: zooTheme.colors.darkTheme.font,
    light: 'black'
  })
};

const CHECKED = {
  background: theme('mode', {
    dark: zooTheme.colors.teal.mid,
    light: zooTheme.colors.teal.mid
  }),
  border: theme('mode', {
    dark: `2px solid ${zooTheme.colors.teal.mid}`,
    light: '2px solid transparent'
  }),
  color: theme('mode', {
    dark: zooTheme.colors.darkTheme.font,
    light: 'white'
  })
};

export const StyledTaskLabel = styled.span`
  align-items: baseline;
  background-color: ${DEFAULT.backgroundColor};
  border: ${DEFAULT.border};
  box-shadow: 1px 1px 2px 0 rgba(0,0,0,0.5);
  color: ${DEFAULT.color};
  cursor: pointer;
  display: flex;
  margin: ${pxToRem(10)} 0;
  padding: ${props => (doesTheLabelHaveAnImage(props.label) ? '0' : '1ch 2ch')};
  
  &:hover {
    background: linear-gradient(${HOVER.gradientTop}, ${HOVER.gradientBottom});
    border-width: 2px;
    border-style: solid;
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-color: ${HOVER.gradientTop};
    border-bottom-color: ${HOVER.gradientBottom};
    color: ${HOVER.color};
  }
`;

export const StyledTaskInputField = styled.label`
  position: relative;

  input {
    opacity: 0.01;
    position: absolute;
  }

  input:focus + ${StyledTaskLabel} {
    background: linear-gradient(${HOVER.gradientTop}, ${HOVER.gradientBottom});
    border-width: 2px;
    border-style: solid;
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-color: ${HOVER.gradientTop};
    border-bottom-color: ${HOVER.gradientBottom};
    color: ${HOVER.color};
  }

  input:active + ${StyledTaskLabel} {
    background: linear-gradient(${HOVER.gradientTop}, ${HOVER.gradientBottom});
    border-width: 2px;
    border-style: solid;
    border-color: ${theme('mode', {
      dark: zooTheme.colors.teal.dark,
      light: zooTheme.colors.teal.mid
    })};
    color: ${HOVER.color};
  }

  input:checked + ${StyledTaskLabel} {
    background: ${CHECKED.background};
    border: ${CHECKED.border};
    color: ${CHECKED.color}
  }

  input:focus:checked + ${StyledTaskLabel},
  input:checked + ${StyledTaskLabel}:hover {
    border: ${theme('mode', {
      dark: `2px solid ${zooTheme.colors.teal.dark}`,
      light: `2px solid ${zooTheme.colors.teal.dark}`
    })};
  }
`;

export function TaskInputField(props) {
  return (
    <ThemeProvider theme={{ mode: props.theme }}>
      <StyledTaskInputField
        className={props.className}
      >
        <input
          autoFocus={props.autoFocus}
          defaultChecked={props.checked}
          name={props.name}
          onChange={props.onChange}
          type={props.type}
          value={props.index}
        />
        <StyledTaskLabel>
          <TaskInputLabel label={props.label} labelIcon={props.labelIcon} labelStatus={props.labelStatus} />
        </StyledTaskLabel>
      </StyledTaskInputField>
    </ThemeProvider>
  );
}

TaskInputField.defaultProps = {
  autoFocus: false,
  checked: false,
  className: '',
  label: '',
  labelIcon: null,
  labelStatus: null,
  name: '',
  onChange: () => {},
  theme: 'light'
};

TaskInputField.propTypes = {
  autoFocus: PropTypes.bool,
  checked: PropTypes.bool,
  className: PropTypes.string,
  index: PropTypes.number.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.object]),
  labelStatus: PropTypes.oneOfType([PropTypes.node, PropTypes.object]),
  name: PropTypes.string,
  onChange: PropTypes.func,
  theme: PropTypes.string,
  type: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  theme: state.userInterface.theme
});

export default connect(mapStateToProps)(React.memo(TaskInputField));
