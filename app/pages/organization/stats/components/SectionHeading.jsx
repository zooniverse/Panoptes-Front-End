import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import Translate from 'react-translate-component';

import LoadingIndicator from '../../../../components/loading-indicator';

export const StyledSectionHeading = styled.h3`
  display: inline-block;
  font-size: 1em;
  letter-spacing: 1.5px;
  line-height: 17px;
  margin-bottom: 1.3em;
  text-transform: uppercase;
`;

function SectionHeading({ content, loading, withProp }) {
  return (
    <>
      <Translate
        component={StyledSectionHeading}
        content={content}
        with={withProp}
      />
      {loading && <LoadingIndicator off={!loading} />}
    </>
  );
}

SectionHeading.propTypes = {
  content: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  withProp: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  )
};

SectionHeading.defaultProps = {
  loading: false,
  withProp: undefined
};

export default SectionHeading;
