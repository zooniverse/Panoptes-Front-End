import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userInterfaceActions from '../../../../redux/ducks/userInterface';

import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import { pxToRem, zooTheme } from '../../../../theme';

export const StyledProjectThemeButton = styled.button.attrs({
  type: 'button'
})`
  color: zooTheme.colors.teal.mid;

  &:hover, &:focus {
    text-decoration: underline;
  }
`;

class ProjectThemeButton extends React.Component {
  static defaultProps = {
    actions: { theme: { setTheme: () => {} } },
    theme: 'light'
  }

  static propTypes = {
    actions: PropTypes.shape({
      theme: PropTypes.shape({
        setTheme: PropTypes.func
      })
    }),
    theme: PropTypes.string
  }

  whichThemeToAlternate(currentTheme) {
    return (currentTheme === zooTheme.mode.light) ? counterpart('project.classifyPage.dark') : counterpart('project.classifyPage.light');
  }

  toggleTheme() {
    const newTheme = (this.props.theme === zooTheme.mode.light) ? zooTheme.mode.dark : zooTheme.mode.light;
    this.props.actions.theme.setTheme(newTheme)
  }

  render() {
    return (
      <p>
        <StyledProjectThemeButton onClick={this.toggleTheme.bind(this)}>
          <Translate
            content="project.classifyPage.themeToggle"
            with={{ theme: this.whichThemeToAlternate(this.props.theme) }}
          />
        </StyledProjectThemeButton>
      </p>
    );
  }
}

const mapStateToProps = state => ({
  theme: state.userInterface.theme
});

const mapDispatchToProps = dispatch => ({
  actions: {
    theme: bindActionCreators(userInterfaceActions, dispatch)
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectThemeButton);
