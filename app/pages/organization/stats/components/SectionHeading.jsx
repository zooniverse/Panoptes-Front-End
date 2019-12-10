import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import Translate from 'react-translate-component';

const StyledSectionHeading = styled.h3`
  font-size: 1em;
  letter-spacing: 1.5px;
  margin-bottom: 1.3em;
  text-transform: uppercase;
`;

function SectionHeading({ content, withProp }) {
  return (
    <Translate
      component={StyledSectionHeading}
      content={content}
      with={withProp}
    />
  );
}

SectionHeading.propTypes = {
  content: PropTypes.string.isRequired,
  withProp: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  )
};

SectionHeading.defaultProps = {
  withProp: undefined
};

export default SectionHeading;
