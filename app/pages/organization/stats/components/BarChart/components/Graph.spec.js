/* eslint func-names: off, prefer-arrow-callback: off */
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Graph from './Graph';

const mockData = [
  {
    label: '2019-12-28T00:00:00Z',
    value: 10
  },
  {
    label: '2019-12-29T00:00:00Z',
    value: 20
  },
  {
    label: '2019-12-30T00:00:00.000Z',
    value: 30
  },
  {
    label: '2019-12-31T00:00:00Z',
    value: 40
  },
  {
    label: '2020-01-01T00:00:00Z',
    value: 0
  },
  {
    label: '2020-01-02T00:00:00Z',
    value: 35
  },
  {
    label: '2020-01-03T00:00:00Z',
    value: 25
  }
];

const seriesFromMockData = mockData.map(datum => datum.value);
const labelsFromMockData = mockData.map(datum => datum.label);

describe('Graph', function () {
  let wrapper;
  let chartData;
  before(function () {
    wrapper = shallow(<Graph by='day' data={mockData} />);
    chartData = wrapper.prop('data');
  });
  it('should render without crashing', function () {
    expect(wrapper).to.be.ok;
  });

  it('should render as type Bar', function () {
    expect(wrapper.prop('type')).to.equal('Bar');
  });

  it('should render with data series', function () {
    expect(chartData.series[0]).to.eql(seriesFromMockData);
  });

  it('should render with data labels', function () {
    expect(chartData.labels).to.eql(labelsFromMockData);
  });
});
