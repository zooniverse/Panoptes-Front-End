import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import SectionHeading from '../SectionHeading';
import Graph from './components/Graph';
import Parameters from './components/Parameters';

const StyledBarChartContainer = styled.section`
  background-color: white;
  border: 1px solid #E2E5E9;
  flex: 1 1 400px;
  margin: 1.6em .8em 0 .8em;
  padding: 2em;
`;

function BarChartBlock({
  binBy,
  handleBinByChange,
  handleRangeChange,
  handleReset,
  handleResourceChange,
  projects,
  rangeMax,
  rangeMin,
  resourceId,
  statData,
  graphData,
  type
}) {
  return (
    <StyledBarChartContainer>
      <SectionHeading content={`organization.stats.${type}`} />
      <Graph
        by={binBy}
        data={graphData}
      />
      <Parameters
        binBy={binBy}
        handleBinByChange={handleBinByChange}
        handleRangeChange={handleRangeChange}
        handleReset={handleReset}
        handleResourceChange={handleResourceChange}
        projects={projects}
        rangeMax={rangeMax}
        rangeMin={rangeMin}
        resourceId={resourceId}
        statData={statData}
        type={type}
      />
    </StyledBarChartContainer>
  );
}

BarChartBlock.propTypes = {
  binBy: PropTypes.string.isRequired,
  handleBinByChange: PropTypes.func.isRequired,
  handleRangeChange: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  handleResourceChange: PropTypes.func.isRequired,
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      display_name: PropTypes.string
    })
  ),
  rangeMax: PropTypes.string,
  rangeMin: PropTypes.string,
  resourceId: PropTypes.string.isRequired,
  statData: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number
    })
  ),
  graphData: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number
    })
  ),
  type: PropTypes.string.isRequired
};

BarChartBlock.defaultProps = {
  projects: [],
  rangeMax: undefined,
  rangeMin: undefined,
  statData: [],
  graphData: []
};

export default BarChartBlock;
