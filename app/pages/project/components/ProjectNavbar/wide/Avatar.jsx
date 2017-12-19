import React, { PropTypes } from 'react';
import styled from 'styled-components';

const commonStyles = () => `
  height: 80px;
  width: 80px;
  border-radius: 100%;
  display: block;
  margin-right: 30px;
  box-shadow: 5px 10px 20px 0 rgba(0,0,0,0.22);
`;

const Img = styled.img.attrs({
  alt: props => `Project icon for ${props.projectTitle}`,
  src: props => props.src
})`
  ${commonStyles()}
`;

const DefaultImg = styled.div.attrs({
  'aria-label': 'Default project icon'
})`
  ${commonStyles()}
  background: url("/assets/simple-pattern.png") repeat;
  background-size: 45px;
`;

function Avatar({ projectTitle, src }) {
  const imgProps = { projectTitle, src };
  return (src) ? <Img {...imgProps} /> : <DefaultImg />;
}

Avatar.defaultProps = {
  projectTitle: '',
  src: ''
};

Avatar.propTypes = {
  projectTitle: PropTypes.string,
  src: PropTypes.string
};

export default Avatar;
