import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';
import { pxToRem, zooTheme } from '../../../../theme';

import TaskInputLabel from './components/TaskInputLabel';
import { doesTheLabelHaveAnImage } from './helpers';

export const StyledTaskInputField = styled.label`
  align-items: baseline;
  background-color: ${theme('mode', {
    dark: zooTheme.colors.darkTheme.background.default,
    light: zooTheme.colors.lightTheme.background.default
  })};
  border: ${theme('mode', {
    dark: `thin solid ${zooTheme.colors.darkTheme.font}`,
    light: 'thin solid transparent'
  })};
  box-shadow: 1px 1px 2px 0 rgba(0,0,0,0.5);
  color: ${theme('mode', {
    dark: zooTheme.colors.darkTheme.font,
    light: zooTheme.colors.lightTheme.font
  })};
  cursor: pointer;
  display: flex;
  margin: ${pxToRem(10)} 0;
  padding: ${(props) => { return doesTheLabelHaveAnImage(props.label) ? '0' : '1ch 2ch'; }};
  position: relative;
  text-align: left;

  &:hover, &:focus, &[data-focus=true] {
    background: ${theme('mode', {
      dark: zooTheme.colors.darkTheme.background.default,
      light: zooTheme.colors.teal.gradient
    })};
    border: ${theme('mode', {
      dark: `thin solid ${zooTheme.colors.darkTheme.button.answer}`,
      light: `thin solid ${zooTheme.colors.teal.gradient}`
    })};
    color: ${theme('mode', {
      dark: zooTheme.colors.darkTheme.font,
      light: 'white'
    })};
  }

  &:active {
    background: ${theme('mode', {
      dark: zooTheme.colors.teal.dark,
      light: zooTheme.colors.teal.gradient
    })};
    border: ${theme('mode', {
      dark: `thin solid ${zooTheme.colors.teal.dark}`,
      light: `thin solid ${zooTheme.colors.teal.mid}`
    })};
    color: ${theme('mode', {
      dark: zooTheme.colors.darkTheme.font,
      light: 'white'
    })};
  }

  &.active {
    background: ${theme('mode', {
      dark: zooTheme.colors.teal.mid,
      light: zooTheme.colors.teal.mid
    })};
    border: ${theme('mode', {
      dark: `thin solid ${zooTheme.colors.teal.mid}`,
      light: `thin solid transparent`
    })};
    color: ${theme('mode', {
      dark: zooTheme.colors.darkTheme.font,
      light: 'white'
    })}
  }

  &.active:hover, &.active:focus, &.active[data-focus=true] {
    background: ${theme('mode', {
      dark: zooTheme.colors.teal.mid,
      light: zooTheme.colors.teal.mid
    })};
    border: ${theme('mode', {
      dark: `2px solid ${zooTheme.colors.teal.dark}`,
      light: `2px solid ${zooTheme.colors.teal.dark}`
    })};
  }

  input {
    opacity: 0.01;
    position: absolute;
  }
`;

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

function shouldInputBeAutoFocused(annotation, index, name, type) {
  if (type === 'radio' && name === 'drawing-tool') {
    return index === 0;
  }

  return index === annotation.value;
}

export class TaskInputField extends React.Component {
  onChange(e) {
    this.unFocus();
    this.props.onChange(e);
  }

  onFocus() {
    this.field.dataset.focus = true;
  }

  onBlur() {
    this.unFocus();
  }

  unFocus() {
    this.field.dataset.focus = false;
  }

  render() {
    return (
      <ThemeProvider theme={{ mode: this.props.theme }}>
        <StyledTaskInputField
          innerRef={(node) => { this.field = node; }}
          className={this.props.className}
          label={this.props.label}
          data-focus={false}
        >
          <input
            autoFocus={shouldInputBeAutoFocused(this.props.annotation, this.props.index, this.props.name, this.props.type)}
            checked={shouldInputBeChecked(this.props.annotation, this.props.index, this.props.type)}
            name={this.props.name}
            onBlur={this.onBlur.bind(this)}
            onChange={this.onChange.bind(this)}
            onFocus={this.onFocus.bind(this)}
            type={this.props.type}
            value={this.props.index}
          />
          <TaskInputLabel label={this.props.label} labelIcon={this.props.labelIcon} labelStatus={this.props.labelStatus} />
        </StyledTaskInputField>
      </ThemeProvider>
    );
  }
}

TaskInputField.defaultProps = {
  className: '',
  label: '',
  labelIcon: null,
  labelStatus: null,
  name: '',
  onChange: () => {},
  theme: 'light'
};

TaskInputField.propTypes = {
  annotation: PropTypes.shape({
    _key: PropTypes.number,
    task: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.number), // mulitple choice
      PropTypes.number, // single choice
      PropTypes.arrayOf(PropTypes.object), // drawing task
      PropTypes.object // null
    ])
  }).isRequired,
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

export default connect(mapStateToProps)(TaskInputField);
