import PropTypes from 'prop-types';
import React from 'react';
import Translate from 'react-translate-component';
import styled from 'styled-components';

import filterTimeSeries from '../helpers/filterTimeSeries';
import formatLabel from '../helpers/formatLabel';
import Select from './Select';

export const binByOptions = [
  { label: 'hour', value: 'hour' },
  { label: 'day', value: 'day' },
  { label: 'week', value: 'week' },
  { label: 'month', value: 'month' }
];

const StyledParametersContainer = styled.div`
  background-color: #EFF2F5;
  border-top: 1px solid #A6A7A9;
  padding: 1.4em;
`;

const StyledTitle = styled.h4`
  color: #5C5C5C;
  font-weight: bold;
  letter-spacing: 1.5px;
  line-height: 17px;
  margin-bottom: 1.2em;
  text-transform: uppercase;
`;

const StyledInputsContainer = styled.div`
  align-items: center;
  display: flex;
  height: 2.5em;
`;

const StyledText = styled.span`
  color: #000000;
  white-space: nowrap;
`;

const StyledResetContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row-reverse;
  height: 2.5em;
  justify-content: space-between;
  margin-top: 1em;
`;

export const StyledResetButton = styled.button`
  background: #EFF2F5;
  border: 1px solid #00979D;
  font: inherit;
  height: 40px;
  line-height: 17px;
  width: 150px;

  &.active, &:hover, &:focus {
    background: #00979D;
    color: #FFFFFF;
  }
`;

const StyledWarning = styled.span`
  color: #000000;
  font-style: italic;
`;

function Parameters({
  projects,
  binBy,
  handleBinByChange,
  handleRangeChange,
  handleReset,
  handleResourceChange,
  loading,
  rangeMax,
  rangeMin,
  resourceId,
  statData,
  type
}) {
  const resourceOptions = projects.map(project => (
    { label: project.display_name, value: project.id }
  ));
  resourceOptions.splice(0, 0, { label: 'all', value: 'all' });

  let maxDateRange = [];
  if (statData && statData.length > 0) {
    maxDateRange = filterTimeSeries(statData, undefined, rangeMin)
      .map(stat => (
        { label: formatLabel[binBy](stat.label), value: stat.label }
      ));
  }

  let minDateRange = [];
  if (statData && statData.length > 0) {
    minDateRange = filterTimeSeries(statData, rangeMax, undefined)
      .map(stat => (
        { label: formatLabel[binBy](stat.label), value: stat.label }
      ));
  }

  let currentRangeMax;
  if (rangeMax) {
    currentRangeMax = rangeMax;
  } else if (maxDateRange[(maxDateRange.length - 1)]) {
    currentRangeMax = maxDateRange[(maxDateRange.length - 1)].value;
  }

  let currentRangeMin;
  if (rangeMin) {
    currentRangeMin = rangeMin;
  } else if (minDateRange[0]) {
    currentRangeMin = minDateRange[0].value;
  }

  return (
    <StyledParametersContainer>
      <Translate
        component={StyledTitle}
        content="organization.stats.adjustParameters"
      />
      <StyledInputsContainer>
        <Translate
          component={StyledText}
          content={`organization.stats.per${type}`}
        />
        <Select
          current={binBy}
          handleChange={handleBinByChange}
          loading={loading}
          options={binByOptions}
          selectFor="binBy"
        />
        <Translate
          component={StyledText}
          content="organization.stats.for"
        />
        <Select
          current={resourceId}
          handleChange={handleResourceChange}
          loading={loading}
          options={resourceOptions}
          selectFor="resourceId"
        />
      </StyledInputsContainer>
      <StyledInputsContainer>
        <Translate
          component={StyledText}
          content="organization.stats.dateRange"
        />
        <Select
          current={currentRangeMin}
          handleChange={handleRangeChange}
          loading={loading}
          options={minDateRange}
          selectFor="rangeMin"
        />
        <Select
          current={currentRangeMax}
          handleChange={handleRangeChange}
          loading={loading}
          options={maxDateRange}
          selectFor="rangeMax"
        />
      </StyledInputsContainer>
      <StyledResetContainer>
        <StyledResetButton
          onClick={() => handleReset()}
          disabled={loading}
          type="button"
        >
          <Translate
            content="organization.stats.reset"
          />
        </StyledResetButton>
        {binBy === 'hour' && (
          <Translate
            component={StyledWarning}
            content="organization.stats.hourly"
          />
        )}
      </StyledResetContainer>
    </StyledParametersContainer>
  );
}

Parameters.propTypes = {
  binBy: PropTypes.string,
  handleBinByChange: PropTypes.func,
  handleRangeChange: PropTypes.func,
  handleReset: PropTypes.func,
  handleResourceChange: PropTypes.func,
  loading: PropTypes.bool,
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      display_name: PropTypes.string
    })
  ),
  rangeMax: PropTypes.string,
  rangeMin: PropTypes.string,
  resourceId: PropTypes.string,
  statData: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number
    })
  ),
  type: PropTypes.string.isRequired
};

Parameters.defaultProps = {
  binBy: '',
  handleBinByChange: () => {},
  handleRangeChange: () => {},
  handleReset: () => {},
  handleResourceChange: () => {},
  loading: false,
  projects: [],
  rangeMax: undefined,
  rangeMin: undefined,
  resourceId: '',
  statData: []
};

export default Parameters;
