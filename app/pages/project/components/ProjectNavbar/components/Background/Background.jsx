import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { colors, pxToRem } from '../../styledHelpers';

const BackgroundWrapper = styled.div.attrs({
  'aria-hidden': true
})`
  background-color: ${props => ((props.hasBg) ? 'black' : colors.teal)};
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
    <BackgroundWrapper hasBg={!!src} {...otherProps}>
      {src && <ImgBackground src={src} />}
    </BackgroundWrapper>
  );
}

Background.propTypes = {
  src: PropTypes.string
};

Background.defaultProps = {
  src: ''
};

export default Background;
