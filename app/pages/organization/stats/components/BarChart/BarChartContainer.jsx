import PropTypes from 'prop-types';
import React from 'react';
import statsClient from 'panoptes-client/lib/stats-client';

import fillTimeSeries from './helpers/fillTimeSeries';
import filterTimeSeries from './helpers/filterTimeSeries';
import getDefaultRange from './helpers/getDefaultRange';
import BarChartBlock from './BarChartBlock';

class BarChartContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      binBy: 'day',
      rangeMax: undefined,
      rangeMin: undefined,
      resourceId: 'all',
      statDataByResource: new Map()
    };

    this.getStatData = this.getStatData.bind(this);
    this.handleBinByChange = this.handleBinByChange.bind(this);
    this.handleRangeChange = this.handleRangeChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleResourceChange = this.handleResourceChange.bind(this);
  }

  componentDidMount() {
    this.handleResourceChange('all');
  }

  componentDidUpdate(prevProps) {
    const { projects } = this.props;
    const { binBy, resourceId, statDataByResource } = this.state;

    if (prevProps.projects !== projects) {
      const statData = statDataByResource.get(resourceId);
      if (!statData || !statData[binBy] || statData[binBy].length === 0) {
        this.handleResourceChange(resourceId);
      }
    }
  }

  getStatData(binBy, resourceId) {
    const { projects, type } = this.props;

    if (!projects || !projects.length) {
      return Promise.resolve([]);
    }

    let projectID;
    if (resourceId === 'all') {
      projectID = projects.map(project => project.id);
    } else {
      projectID = resourceId;
    }

    const query = {
      period: binBy,
      projectID,
      type
    };

    return statsClient
      .query(query)
      .then(data => (
        data.map(statObject => ({
          label: statObject.key_as_string,
          value: statObject.doc_count
        }))
      )).then(data => (
        fillTimeSeries(data, binBy)
      ))
      .catch(() => {
        if (console) {
          console.warn('Failed to fetch stats');
        }
      });
  }

  handleBinByChange(binBy) {
    const { resourceId, statDataByResource } = this.state;

    const statData = statDataByResource.get(resourceId);

    if (!statData || !statData[binBy] || statData[binBy].length === 0) {
      this.getStatData(binBy, resourceId)
        .then((stats) => {
          const newStatDataByResource = new Map(statDataByResource);
          const newStatData = Object.assign({}, statData, { [binBy]: stats });
          newStatDataByResource.set(resourceId, newStatData);
          const { rangeMax, rangeMin } = getDefaultRange(stats);
          this.setState({
            binBy,
            rangeMax,
            rangeMin,
            statDataByResource: newStatDataByResource
          });
        });
    } else {
      const stats = statData[binBy];
      const { rangeMax, rangeMin } = getDefaultRange(stats);
      this.setState({ binBy, rangeMax, rangeMin });
    }
  }

  handleRangeChange(limit, which) {
    const { rangeMax, rangeMin } = this.state;

    if (which === 'rangeMax' && limit > rangeMin) {
      this.setState({ rangeMax: limit });
    }

    if (which === 'rangeMin' && limit < rangeMax) {
      this.setState({ rangeMin: limit });
    }
  }

  handleReset() {
    const { statDataByResource } = this.state;
    const statData = statDataByResource.get('all');
    const stats = statData.day;
    const { rangeMax, rangeMin } = getDefaultRange(stats);

    this.setState({
      binBy: 'day',
      rangeMax,
      rangeMin,
      resourceId: 'all'
    });
  }

  handleResourceChange(resourceId) {
    const { binBy, statDataByResource } = this.state;

    const statData = statDataByResource.get(resourceId);

    if (!statData || !statData[binBy] || statData[binBy].length === 0) {
      this.getStatData(binBy, resourceId)
        .then((stats) => {
          const newStatDataByResource = new Map(statDataByResource);
          const newStatData = Object.assign({}, statData, { [binBy]: stats });
          newStatDataByResource.set(resourceId, newStatData);
          const { rangeMax, rangeMin } = getDefaultRange(stats);
          this.setState({
            rangeMax,
            rangeMin,
            resourceId,
            statDataByResource: newStatDataByResource
          });
        });
    } else {
      const stats = statData[binBy];
      const { rangeMax, rangeMin } = getDefaultRange(stats);
      this.setState({ rangeMax, rangeMin, resourceId });
    }
  }

  render() {
    const { projects, type } = this.props;
    const {
      binBy,
      rangeMax,
      rangeMin,
      resourceId,
      statDataByResource
    } = this.state;

    const resourceStats = statDataByResource.get(resourceId);

    let statData = [];
    let graphData = [];
    if (resourceStats && resourceStats[binBy]) {
      statData = resourceStats[binBy];
      graphData = filterTimeSeries(statData, rangeMax, rangeMin);
    }

    return (
      <BarChartBlock
        handleBinByChange={this.handleBinByChange}
        handleRangeChange={this.handleRangeChange}
        handleReset={this.handleReset}
        handleResourceChange={this.handleResourceChange}
        binBy={binBy}
        projects={projects}
        rangeMax={rangeMax}
        rangeMin={rangeMin}
        resourceId={resourceId}
        statData={statData}
        graphData={graphData}
        type={type}
      />
    );
  }
}

BarChartContainer.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      display_name: PropTypes.string
    })
  ),
  type: PropTypes.string.isRequired
};

BarChartContainer.defaultProps = {
  projects: []
};

export default BarChartContainer;
