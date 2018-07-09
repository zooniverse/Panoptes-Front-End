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
    return !CSS.supports('width', 'max-content') && !CSS.supports('width', '-moz-max-content');
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
    light: 'thin solid transparent'
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
      dark: zooTheme.colors.darkTheme.background.default,
      light: `linear-gradient(
        ${zooTheme.colors.lightTheme.button.answer.gradient.top},
        ${zooTheme.colors.lightTheme.button.answer.gradient.bottom}
      )`
    })};
    border: ${theme('mode', {
      dark: `thin solid ${zooTheme.colors.darkTheme.button.answer.default}`,
      light: 'thin solid transparent'
    })};
    color: ${theme('mode', {
      dark: zooTheme.colors.darkTheme.font,
      light: 'black'
    })};
  }
`;

// Firefox returns CSS.supports('width', 'max-content') as false
// even though CanIUse reports it is supported by Firefox
// Only the vendor prefixed -moz-max-content returns true
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
  width: -moz-max-content;

  .rtl & {
    left: auto;
    right: 0;
  }
`;

export class BackButton extends React.Component {
  constructor() {
    super();

    this.state = {
      showWarning: false
    };

    this.showWarning = this.showWarning.bind(this);
    this.hideWarning = this.hideWarning.bind(this);
  }

  showWarning() {
    if (this.props.areAnnotationsNotPersisted && !this.state.showWarning) {
      this.setState({ showWarning: true });
    }
  }

  hideWarning() {
    if (this.props.areAnnotationsNotPersisted && this.state.showWarning) {
      this.setState({ showWarning: false });
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
            onMouseEnter={this.showWarning}
            onFocus={this.showWarning}
            onMouseLeave={this.hideWarning}
            onBlur={this.hideWarning}
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
