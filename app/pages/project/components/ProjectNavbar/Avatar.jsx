import React, { PropTypes } from 'react';
import styled from 'styled-components';

const commonStyles = `
  border-radius: 100%;
  display: block;
  box-shadow: 5px 10px 20px 0 rgba(0,0,0,0.22);
`;

const Img = styled.img.attrs({
  alt: props => `Project icon for ${props.projectTitle}`,
  src: props => props.src
})`
  ${commonStyles}
  height: ${props => props.size}px;
  width: ${props => props.size}px;
`;

const DefaultImg = styled.div.attrs({
  'aria-label': 'Default project icon'
})`
  ${commonStyles}
  background: url("/assets/simple-pattern.png") repeat;
  background-size: 45px;
  height: ${props => props.size}px;
  width: ${props => props.size}px;
`;

function Avatar({ projectTitle, size, src }) {
  const imgProps = { projectTitle, size, src };
  return (src) ? <Img {...imgProps} /> : <DefaultImg {...size} />;
}

Avatar.defaultProps = {
  projectTitle: '',
  size: 40,
  src: ''
};

Avatar.propTypes = {
  projectTitle: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  src: PropTypes.string
};

export default Avatar;
