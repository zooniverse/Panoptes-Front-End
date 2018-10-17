import React from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';

import { pxToRem, zooTheme } from '../../../../../../theme';
import ZooniverseLogo from '../../../../../../partials/zooniverse-logo';

export const StyledAvatarImg = styled.img`
  border-radius: 100%;
  display: block;
  box-shadow: ${pxToRem(1.5)} ${pxToRem(10)} ${pxToRem(20)} 0 rgba(0,0,0,0.22);
  height: ${props => pxToRem(props.size)};
  position: relative;
  width: ${props => pxToRem(props.size)};
`;

export const DefaultProjectAvatarWrapper = styled(StyledAvatarImg.withComponent('div'))`
  background-color: ${theme('mode', { light: zooTheme.colors.teal.mid })};
  color: ${theme('mode', { light: zooTheme.colors.brand.default })};
`;

// height: 100% specifically fixes a Firefox positioning issue
export const StyledZooniverseLogo = styled(ZooniverseLogo).attrs({
  height: props => pxToRem(props.size),
  width: '50%'
})`
  height: 100%;
  left: 25%;
  position: absolute;
  z-index: 1;
`;

function Avatar(props) {
  const { projectTitle, src, ...avatarProps } = props;

  if (projectTitle) {
    avatarProps.alt = `Project icon for ${projectTitle}`;
  }

  if (src) {
    avatarProps.src = src;
    return <StyledAvatarImg {...avatarProps} />;
  }

  return (
    <ThemeProvider theme={{ mode: 'light' }}>
      <DefaultProjectAvatarWrapper {...avatarProps}>
        <StyledZooniverseLogo size={props.size} />
      </DefaultProjectAvatarWrapper>
    </ThemeProvider>
  );
}

Avatar.defaultProps = {
  alt: 'Project icon',
  projectTitle: '',
  size: 40,
  src: ''
};

Avatar.propTypes = {
  alt: PropTypes.string,
  projectTitle: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  src: PropTypes.string
};

export default Avatar;
