import React from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import Translate from 'react-translate-component';
import theme from 'styled-theming';
import { pxToRem, zooTheme } from '../../../../theme';

const StyledTaskBackButton = styled.button.attrs({
  type: 'button'
})`
  background-color: ${theme('mode', {
    light: zooTheme.colors.background
  })};
  border: none;
  box-sizing: border-box;
  cursor: pointer;
  flex: 1 0;
  position: relative;
`;

const StyledBackButtonToolTip = styled.span`
  background-color: ${theme('mode', {
    light: zooTheme.colors.teal.dark
  })};
  bottom: -100%;
  color: white;
  padding: 1em;
  position: absolute;
`;

class TaskBackButton extends React.Component {
  constructor() {
    super();

    this.state = {
      showWarning: false
    };

    this.toggleWarning = this.toggleWarning.bind(this);
  }

  toggleWarning() {
    if (this.props.areAnnotationsPersisted) {
      this.setState((prevState) => {
        return { showWarning: !prevState.showWarning };
      });
    }
  }

  render() {
    if (this.props.showButton) {
      return (
        <ThemeProvider theme={{ mode: 'light' }}>
          <StyledTaskBackButton
            onClick={this.props.destroyCurrentAnnotation}
            onMouseEnter={this.toggleWarning}
            onFocus={this.toggleWarning}
            onMouseLeave={this.toggleWarning}
            onBlur={this.toggleWarning}
          >
            <Translate content="classifier.back" />
            {this.state.showWarning &&
              <StyledBackButtonToolTip>
                <Translate content="classifier.backButtonWarning" />
              </StyledBackButtonToolTip>}
          </StyledTaskBackButton>
        </ThemeProvider>
      );
    }

    return null;
  }
}

TaskBackButton.defaultProps = {
  areAnnotationsPersisted: false,
  destroyCurrentAnnotation: () => {},
  showButton: false
};

TaskBackButton.propTypes = {
  areAnnotationsPersisted: PropTypes.bool,
  destroyCurrentAnnotation: PropTypes.func,
  showButton: PropTypes.bool
};

export default TaskBackButton;