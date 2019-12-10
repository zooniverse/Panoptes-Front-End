import PropTypes from 'prop-types';
import React from 'react';
import Translate from 'react-translate-component';
import styled from 'styled-components';

import SectionHeading from './SectionHeading';

const StyledByTheNumbers = styled.section`
  background-color: white;
  flex: 1 1 200px;
  margin: 1.6em .8em 0 .8em;
  padding: 2em;
`;

function ByTheNumbers({ projects }) {
  return (
    <StyledByTheNumbers>
      <SectionHeading content="organization.stats.byTheNumbers" />
    </StyledByTheNumbers>
  );
}

ByTheNumbers.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      display_name: PropTypes.string
    })
  ).isRequired
};

export default ByTheNumbers;
