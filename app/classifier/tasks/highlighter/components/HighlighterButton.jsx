import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';
import { pxToRem, zooTheme } from '../../../../theme';

import { StyledTaskInputField } from '../../components/TaskInputField';
import HighlighterButtonLabel from './HighlighterButtonLabel';


// TODO: the focus and hover styles while the component has the active class is not working
export const StyledHighlighterButton = StyledTaskInputField.extend`
  font-size: inherit;
  width: 100%;
`.withComponent('button');

export function HighlighterButton(props) {
  return (
    <ThemeProvider theme={{ mode: props.theme }}>
      <StyledHighlighterButton
        autoFocus={props.autoFocus}
        type="button"
        value={props.value}
        onClick={props.onClick}
      >
        <HighlighterButtonLabel color={props.color} label={props.label} />
      </StyledHighlighterButton>
    </ThemeProvider>
  );
}

HighlighterButton.propTypes = {
  autoFocus: PropTypes.bool,
  color: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
  theme: PropTypes.string,
  value: PropTypes.string
};

HighlighterButton.defaultProps = {
  autoFocus: false,
  onClick: () => {},
  theme: '',
  value: ''
};

const mapStateToProps = state => ({
  theme: state.userInterface.theme
});

export default connect(mapStateToProps)(HighlighterButton);

