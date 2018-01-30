import counterpart from 'counterpart';
import React from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';
import { pxToRem, zooTheme } from '../../../../../../theme';

export const OpenMenuButton = styled.button`
  background-color: transparent;
  border: 0;
  border-radius: ${pxToRem(500)};
  color: white;
  cursor: pointer;
  display: block;
  font-size: ${pxToRem(14)};
  letter-spacing: ${pxToRem(1.5)};
  line-height: 1.13;
  margin: ${pxToRem(10)} 0 0;
  padding: ${pxToRem(7)} ${pxToRem(6)} ${pxToRem(5)} 1.2rem;
  text-transform: uppercase;
  text-shadow: 0 ${pxToRem(2)} ${pxToRem(2)} rgba(0,0,0,0.22);
  transition: background 0.2s ease-out;

  &:hover,
  &.open {
    background-color: ${theme('mode', { light: zooTheme.colors.teal.light })};
    color: black;
  }

  & i {
    font-size: ${pxToRem(20)};
    position: relative;
    top: ${pxToRem(-2)};
    vertical-align: middle;
  }
`;

function NarrowMenuButton({ onClick, open }) {
  const icon = (open) ? 'fa-angle-up' : 'fa-angle-down';
  const className = (open) ? 'open' : '';
  return (
    <ThemeProvider theme={{ mode: 'light' }}>
      <OpenMenuButton onClick={onClick} className={className}>
        {counterpart('project.nav.exploreProject')}
        <i className={`fa fa-fw ${icon}`} />
      </OpenMenuButton>
    </ThemeProvider>
  );
}

NarrowMenuButton.propTypes = {
  onClick: PropTypes.func,
  open: PropTypes.bool
};

NarrowMenuButton.defaultProps = {
  onClick: () => {},
  open: false
};

export default NarrowMenuButton;
