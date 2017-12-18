import React, { PropTypes } from 'react';
import styled from 'styled-components';

const BackgroundOuter = styled.div`
  background-color: #00979D;
  display: flex;
  height: 100%;
  left: 0;
  overflow: hidden;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 10;
`;

const BackgroundInner = styled.div`
  background-color: #000;
  background-image: url("${props => props.src}");
  background-position: center;
  background-size: cover;
  filter: blur(0.333333333rem) brightness(50%);
  flex: 1;
  transform: scale(1.15);
`;

function Background({ src }) {
  const backgroundInner = (src) ? <BackgroundInner src={src} /> : null;

  return (
    <BackgroundOuter aria-hidden="true">
      {backgroundInner}
    </BackgroundOuter>
  );
}

Background.propTypes = {
  src: PropTypes.string
};

Background.defaultProps = {
  src: ''
};

export default Background;
