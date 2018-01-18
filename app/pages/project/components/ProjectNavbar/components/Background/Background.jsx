import React, { PropTypes } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { theme, pxToRem } from '../../../../../../theme';

const BackgroundWrapper = styled.div.attrs({
  'aria-hidden': true
})`
  background-color: ${props => ((props.hasBg) ? 'black' : props.theme.colors.teal.mid)};
  display: flex;
  height: 100%;
  left: 0;
  overflow: hidden;
  position: absolute;
  top: 0;
  width: 100%;
`;

const ImgBackground = styled.div`
  background-image: url("${props => props.src}");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: blur(${pxToRem(5)}) brightness(50%);
  flex: 1;
  transform: scale(1.15);
`;

function Background({ src, ...otherProps }) {
  return (
    <ThemeProvider theme={theme}>
      <BackgroundWrapper hasBg={!!src} {...otherProps}>
        {src && <ImgBackground src={src} />}
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
