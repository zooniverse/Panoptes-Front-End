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
  max-height: 0;
  top: 100%;
  transition: max-height 500ms ease;
  width: 100%;

  &.open {
    max-height: ${props => props.height}px;
    z-index: 2
  }
`;

export const Menu = styled.nav`
  background-color: ${theme('mode', { light: zooTheme.colors.teal.mid })};
`;

export const List = styled.ul`
  margin: 0;
  padding: 0;
`;

export const ListItem = styled.li`
  list-style: none;
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

function NarrowMenu({ height, links, open, toggleMenuFn }) {
  const openClass = (open) ? 'open' : '';
  return (
    <MenuWrapper className={openClass} height={height}>
      <ThemeProvider theme={{ mode: 'light' }}>
        <Menu>
          <List>
            {links.map(link => (
              <ListItem key={link.url}>
                <StyledNavLink
                  {...link}
                  onClick={toggleMenuFn}
                />
              </ListItem>
            ))}
          </List>
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
