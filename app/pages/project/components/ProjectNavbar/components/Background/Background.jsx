import React from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';
import { pxToRem, zooTheme } from '../../../../../../theme';

// a dark theme variant could be added later
const backgroundColor = theme('mode', {
  light: zooTheme.colors.teal.mid
});

export const BackgroundWrapper = styled.div.attrs({
  'aria-hidden': true
})`
  background-color: ${props => ((props.hasBg) ? 'black' : backgroundColor)};
  display: flex;
  height: 100%;
  left: 0;
  overflow: hidden;
  position: absolute;
  top: 0;
  width: 100%;
`;

// IE 11 doesn't support filter. Not even their own propriety MS filter. :faceplam: IE and Edge do not support background-blend
export const IEContrastLayer = styled.div`
  background-color: rgba(0,93,105,0.5);
  height: 100%;
  position: absolute;
  width: 100%;
`;

export const ImgBackground = styled.div`
  background-blend-mode: multiply;
  background-color: rgba(0,93,105,0.3);
  background-image: url("${props => props.src}");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: blur(${pxToRem(5)}) brightness(50%);
  flex: 1;
  position: relative;
  transform: scale(1.15);
`;

function checkIfMSBrowser() {
  if ('CSS' in window) {
    return !CSS.supports('background-blend-mode', 'multiply');
  }

  return 'ActiveXObject' in window;
}

function Background({ src, ...otherProps }) {
  const isMSBrowser = checkIfMSBrowser();

  return (
    <ThemeProvider theme={{ mode: 'light' }}>
      <BackgroundWrapper hasBg={!!src} {...otherProps}>
        {src &&
          <ImgBackground src={src}>
            {isMSBrowser &&
              <IEContrastLayer />}
          </ImgBackground>}
      </BackgroundWrapper>
    </ThemeProvider>
  );
}

Background.propTypes = {
  src: PropTypes.string
};

Background.defaultProps = {
  src: ''
};

export default Background;
