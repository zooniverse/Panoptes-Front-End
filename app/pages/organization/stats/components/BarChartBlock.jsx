import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import SectionHeading from './SectionHeading';

const StyledBarChartContainer = styled.section`
  background-color: white;
  flex: 1 1 400px;
  margin: 1.6em .8em 0 .8em;
  padding: 2em;
`;

const StyledDateRange = styled.h5`
  display: inline-block;
`;

const StyledBarChartSmallPlaceholder = styled.div`
  height: 45px;
  width: 180px;
  border: 2px solid blue;
  display: inline-block;
  margin: 0;
`;

const StyledBarChartPlaceholder = styled.div`
  height: 200px;
  min-width: 400px;
  border: 2px solid red;
`;

function BarChartBlock({ type }) {
  return (
    <StyledBarChartContainer>
      <SectionHeading content={`organization.stats.${type}`} />
      <h4>Current Date Range</h4>
      <StyledDateRange>Aug 6, 2019 - Aug 29, 2019</StyledDateRange>
      <StyledBarChartSmallPlaceholder />
      <StyledBarChartPlaceholder />
      <label htmlFor="classifications-per">
        {type}
        {' per '}
        <select id="classifications-per" defaultValue="day">
          <option value="hour">hour</option>
          <option value="day">day</option>
          <option value="week">week</option>
          <option value="month">month</option>
        </select>
      </label>
      <label htmlFor="classifications-project">
        {' for '}
        <select id="classifications-project" defaultValue="all">
          <option value="all">all</option>
          <option value="123">Project 1</option>
          <option value="456">Project 2</option>
          <option value="789">Project 3</option>
        </select>
      </label>
      <br />
      <button type="button">Reset View</button>
    </StyledBarChartContainer>
  );
}

BarChartBlock.propTypes = {
  type: PropTypes.string.isRequired
};

export default BarChartBlock;
