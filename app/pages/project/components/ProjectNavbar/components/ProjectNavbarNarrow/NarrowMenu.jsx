import React from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';

import NavLink from '../NavLink';

import { pxToRem, zooTheme } from '../../../../../../theme';

export const MenuWrapper = styled.div`
  max-width: ${pxToRem(300)};
  overflow: hidden;
  position: absolute;
  top: 100%;
  transform: translateY(-100%);
  transition: transform 0.3s ease-out;
  width: 100%;
  z-index: 10;

  &.open {
    transform: translateY(0);
  }
`;

export const Menu = styled.nav`
  background-color: ${theme('mode', { light: zooTheme.colors.teal.mid })};
`;

const navLinkBackgroundColor = theme('mode', {
  light: zooTheme.colors.brand.default
});

export const StyledNavLink = styled(NavLink)`
  line-height: 3.071428571;
  padding: 0 ${pxToRem(30)};

  &:hover, &:focus {
    background-color: ${navLinkBackgroundColor};
  }

  &.active {
    background-color: ${navLinkBackgroundColor};
  }
`;

function NarrowMenu({ links, open, toggleMenuFn }) {
  const openClass = (open) ? 'open' : '';
  return (
    <MenuWrapper className={openClass}>
      <ThemeProvider theme={{ mode: 'light' }}>
        <Menu>
          {links.map(link => (
            <StyledNavLink
              {...link}
              key={link.url}
              onClick={toggleMenuFn}
            />
          ))}
        </Menu>
      </ThemeProvider>
    </MenuWrapper>
  );
}

NarrowMenu.defaultProps = {
  links: [
    { url: '' }
  ],
  open: true,
  toggleMenuFn: () => {}
};

NarrowMenu.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string
  })),
  open: PropTypes.bool,
  toggleMenuFn: PropTypes.func
};

export default NarrowMenu;
