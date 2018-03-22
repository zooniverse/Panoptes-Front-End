import React from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import theme from 'styled-theming';
import { zooTheme } from '../../../../theme';

function checkIfMSBrowser() {
  if ('CSS' in window) {
    return !CSS.supports('width', 'max-content');
  }

  return 'ActiveXObject' in window;
}

export const StyledTaskBackButtonWrapper = styled.div`
  position: relative;
  flex: 1 0;
`;

export const StyledTaskBackButton = styled.button.attrs({
  type: 'button'
})`
  background-color: ${theme('mode', {
    light: zooTheme.colors.lightTheme.background.default
  })};
  border: none;
  box-sizing: border-box;
  cursor: pointer;
  font-size: 0.9em;
  padding: 0.9em;
  width: 100%;

  &:focus, &:hover {
    background: ${theme('mode', {
      light: '#f6f6f6' // TODO: Check in on actual styling for this.
    })};
  }
`;

export const StyledTaskBackButtonToolTip = styled.span`
  bottom: ${(checkIfMSBrowser()) ? '-130%' : '-100%'};
  box-sizing: border-box;
  color: ${theme('mode', {
    light: zooTheme.colors.teal.mid
  })};
  font-size: 0.9em;
  left: 0;
  padding: 1em 0;
  position: absolute;
  width: ${(checkIfMSBrowser()) ? '400%' : 'max-content'};
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
    if (this.props.areAnnotationsNotPersisted) {
      this.setState((prevState) => {
        return { showWarning: !prevState.showWarning };
      });
    }
  }

  render() {
    const backButtonWarning = counterpart('classifier.backButtonWarning');
    if (this.props.showButton) {
      return (
        <ThemeProvider theme={{ mode: 'light' }}>
          <StyledTaskBackButtonWrapper>
            <StyledTaskBackButton
              aria-label={(this.props.areAnnotationsNotPersisted ? backButtonWarning : '')}
              onClick={this.props.destroyCurrentAnnotation}
              onMouseEnter={this.toggleWarning}
              onFocus={this.toggleWarning}
              onMouseLeave={this.toggleWarning}
              onBlur={this.toggleWarning}
            >
              <Translate content="classifier.back" />
            </StyledTaskBackButton>
            {this.state.showWarning &&
              <StyledTaskBackButtonToolTip>
                <Translate content="classifier.backButtonWarning" />
              </StyledTaskBackButtonToolTip>}
          </StyledTaskBackButtonWrapper>
        </ThemeProvider>
      );
    }

    return null;
  }
}

TaskBackButton.defaultProps = {
  areAnnotationsNotPersisted: false,
  destroyCurrentAnnotation: () => {},
  showButton: false
};

TaskBackButton.propTypes = {
  areAnnotationsNotPersisted: PropTypes.bool,
  destroyCurrentAnnotation: PropTypes.func,
  showButton: PropTypes.bool
};

export default TaskBackButton;
