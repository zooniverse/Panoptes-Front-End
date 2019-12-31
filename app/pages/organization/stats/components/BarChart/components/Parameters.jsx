import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Translate from 'react-translate-component';
import styled from 'styled-components';

import filterTimeSeries from '../helpers/filterTimeSeries';
import Select from './Select';

const StyledParametersContainer = styled.div`
  background-color: #EFF2F5;
  border-top: 1px solid #A6A7A9;
  min-height: 200px;
  padding: 1em;
`;

const StyledTitle = styled.h4`
  color: #5c5c5c;
  font-weight: bold;
  letter-spacing: 1.5px;
  margin-bottom: .8em;
  text-transform: uppercase;
`;

const StyledInputsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

function Parameters({
  projects,
  binBy,
  handleBinByChange,
  handleRangeChange,
  handleReset,
  handleResourceChange,
  rangeMax,
  rangeMin,
  resourceId,
  statData,
  type
}) {
  const binByOptions = [
    { label: 'hour', value: 'hour' },
    { label: 'day', value: 'day' },
    { label: 'week', value: 'week' },
    { label: 'month', value: 'month' }
  ];

  const resourceOptions = projects.map(project => (
    { label: project.display_name, value: project.id }
  ));
  resourceOptions.splice(0, 0, { label: 'all', value: 'all' });

  const formatLabel = {
    hour: date => moment.utc(date).format('MMM-DD hh:mm A'),
    day: date => moment.utc(date).format('MMM-DD-YYYY'),
    week: date => moment.utc(date).format('MMM-DD-YYYY'),
    month: date => moment.utc(date).format('MMM YYYY')
  };

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
          content="organization.stats.per"
          with={{ type }}
        />
        <Select
          current={binBy}
          handleChange={handleBinByChange}
          options={binByOptions}
          selectFor="binBy"
        />
        <Translate
          content="organization.stats.for"
        />
        <Select
          current={resourceId}
          handleChange={handleResourceChange}
          options={resourceOptions}
          selectFor="resourceId"
        />
        <Translate
          content="organization.stats.dateRange"
        />
        <Select
          current={currentRangeMin}
          handleChange={handleRangeChange}
          options={minDateRange}
          selectFor="rangeMin"
        />
        <Select
          current={currentRangeMax}
          handleChange={handleRangeChange}
          options={maxDateRange}
          selectFor="rangeMax"
        />
        <button
          onClick={() => handleReset()}
          type="button"
        >
          <Translate
            content="organization.stats.reset"
          />
        </button>
      </StyledInputsContainer>
    </StyledParametersContainer>
  );
}

Parameters.propTypes = {
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
  type: PropTypes.string.isRequired
};

Parameters.defaultProps = {
  projects: [],
  rangeMax: undefined,
  rangeMin: undefined,
  statData: []
};

export default Parameters;
