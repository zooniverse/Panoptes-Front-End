import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styled, { ThemeProvider } from 'styled-components';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import theme from 'styled-theming';
import { zooTheme } from '../../../../../theme';

function checkIfMSBrowser() {
  if ('CSS' in window) {
    return !CSS.supports('width', 'max-content');
  }

  return 'ActiveXObject' in window;
}

export const StyledBackButtonWrapper = styled.div`
  position: relative;
  flex: 1 0;
`;

export const StyledBackButton = styled.button.attrs({
  type: 'button'
})`
  background-color: ${theme('mode', {
    dark: zooTheme.colors.darkTheme.background.default,
    light: zooTheme.colors.lightTheme.background.default
  })};
  border: ${theme('mode', {
    dark: `thin solid ${zooTheme.colors.darkTheme.font}`,
    light: 'none'
  })};
  box-sizing: border-box;
  color: ${theme('mode', {
    dark: zooTheme.colors.darkTheme.font,
    light: zooTheme.colors.lightTheme.font
  })};
  cursor: pointer;
  font-size: 0.9em;
  padding: 0.9em;
  width: 100%;

  &:focus, &:hover {
    background: ${theme('mode', {
      dark: zooTheme.colors.teal.dark,
      light: zooTheme.colors.teal.gradient
    })};
    border: ${theme('mode', {
      dark: `thin solid ${zooTheme.colors.darkTheme.button.answer}`,
      light: 'none'
    })};
    color: ${theme('mode', {
      dark: zooTheme.colors.darkTheme.font,
      light: 'white'
    })};
  }
`;

export const StyledBackButtonToolTip = styled.span`
  bottom: ${(checkIfMSBrowser()) ? '-130%' : '-100%'};
  box-sizing: border-box;
  color: ${theme('mode', {
    dark: zooTheme.colors.teal.light,
    light: zooTheme.colors.teal.mid
  })};
  font-size: 0.9em;
  left: 0;
  padding: 1em 0;
  position: absolute;
  width: ${(checkIfMSBrowser()) ? '400%' : 'max-content'};
`;

export class BackButton extends React.Component {
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
    return (
      <ThemeProvider theme={{ mode: this.props.theme }}>
        <StyledBackButtonWrapper>
          <StyledBackButton
            aria-label={(this.props.areAnnotationsNotPersisted ? backButtonWarning : '')}
            onClick={this.props.onClick}
            onMouseEnter={this.toggleWarning}
            onFocus={this.toggleWarning}
            onMouseLeave={this.toggleWarning}
            onBlur={this.toggleWarning}
          >
            <Translate content="classifier.back" />
          </StyledBackButton>
          {this.state.showWarning &&
            <StyledBackButtonToolTip>
              <Translate content="classifier.backButtonWarning" />
            </StyledBackButtonToolTip>}
        </StyledBackButtonWrapper>
      </ThemeProvider>
    );
  }
}

BackButton.defaultProps = {
  areAnnotationsNotPersisted: false,
  theme: 'light',
  onClick: () => {}
};

BackButton.propTypes = {
  areAnnotationsNotPersisted: PropTypes.bool,
  theme: PropTypes.string,
  onClick: PropTypes.func
};

const mapStateToProps = state => ({
  theme: state.userInterface.theme
});

export default connect(mapStateToProps)(BackButton);
