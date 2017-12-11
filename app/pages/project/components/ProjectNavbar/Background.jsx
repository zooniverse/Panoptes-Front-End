import React, { PropTypes } from 'react';
import styled from 'styled-components';

const BackgroundOuter = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  overflow: hidden;
  display: flex;
`;

const BackgroundInner = styled.div`
  background-image: url("${props => props.src}");
  background-position: center;
  background-size: cover;
  filter: blur(5px);
  transform: scale(1.15);
  flex: 1;
`;

function Background({ src }) {
  if (!src) {
    return null;
  } else {
    return (
      <BackgroundOuter>
        <BackgroundInner src={src} />
      </BackgroundOuter>
    );
  }
}

Background.propTypes = {
  src: PropTypes.string
};

Background.defaultProps = {
  src: ''
};

export default Background;
