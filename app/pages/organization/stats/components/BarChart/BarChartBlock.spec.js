/* eslint func-names: off, prefer-arrow-callback: off */
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import BarChartBlock from './BarChartBlock';
import LoadingIndicator from '../../../../../components/loading-indicator';
import SectionHeading from '../SectionHeading';
import Graph from './components/Graph';
import Parameters from './components/Parameters';

describe('BarChartBlock', function () {
  let wrapper;
  before(function () {
    wrapper = shallow(<BarChartBlock type="classification" />);
  });

  it('should render without crashing', function () {
    expect(wrapper).to.be.ok;
  });

  it('should render SectionHeading', function () {
    expect(wrapper.find(SectionHeading)).to.have.lengthOf(1);
    expect(wrapper.find(SectionHeading).prop('content')).to.equal('organization.stats.classification');
  });

  it('should render Graph', function () {
    expect(wrapper.find(Graph)).to.have.lengthOf(1);
  });

  it('should render Parameters', function () {
    expect(wrapper.find(Parameters)).to.have.lengthOf(1);
  });

  it('should not render a LoadingIndicator if not loading', function () {
    wrapper = shallow(<BarChartBlock loading={false} type="classification" />);
    expect(wrapper.find(LoadingIndicator)).to.have.lengthOf(0);
  });

  it('should render LoadingIndicator if loading', function () {
    wrapper = shallow(<BarChartBlock loading={true} type="classification" />);
    expect(wrapper.find(LoadingIndicator)).to.have.lengthOf(1);
  });
});
