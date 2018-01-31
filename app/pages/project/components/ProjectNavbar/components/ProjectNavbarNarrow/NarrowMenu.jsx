import React from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';

import NavLink from '../NavLink';

import { pxToRem, zooTheme } from '../../../../../../theme';

// why doesn't max-height: 100% on the open class work? It only maxes at half the full height of the menu.
export const MenuWrapper = styled.div`
  max-width: ${pxToRem(300)};
  overflow: hidden;
  position: absolute;
  max-height: 0;
  top: 100%;
  transition: max-height 500ms ease;
  width: 100%;

  &.open {
    max-height: 200%;
    z-index: 1
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
