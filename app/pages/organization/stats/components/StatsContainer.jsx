import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  display: block;
  margin-bottom: 1.6em;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: -1.6em -.8em 0 -.8em;
`;

function StatsContainer({ children }) {
  return (
    <StyledWrapper>
      <StyledContainer>
        {children}
      </StyledContainer>
    </StyledWrapper>
  );
}

StatsContainer.propTypes = {
  children: PropTypes.node.isRequired
};

export default StatsContainer;
